from datetime import datetime, timedelta
import hashlib
import json
import uuid

from sqlalchemy import and_, or_, select, update
from sqlalchemy.exc import IntegrityError

from .adapters import SyncError, get_adapter
from .models import AutomationPreview, Contact, Inquiry, SyncJob

MAX_ATTEMPTS = 5


class IdempotencyConflict(Exception):
    pass


def accept_inquiry(sessions, data, key, settings):
    payload = data.model_dump(mode="json", exclude={"website"})
    payload["privacy_notice_version"] = "2026-10-24"
    digest = hashlib.sha256(json.dumps(payload, sort_keys=True).encode()).hexdigest()
    for retry in range(3):
        try:
            with sessions.begin() as session:
                existing = session.scalar(
                    select(Inquiry).where(Inquiry.idempotency_key == key)
                )
                if existing:
                    if existing.payload_hash != digest:
                        raise IdempotencyConflict()
                    return existing.id
                contact = session.scalar(
                    select(Contact).where(Contact.email == payload["email"])
                )
                if not contact:
                    contact = Contact(
                        email=payload["email"],
                        first_name=data.firstName,
                        last_name=data.lastName,
                        phone=data.phone,
                    )
                    session.add(contact)
                    session.flush()
                else:
                    contact.first_name = data.firstName
                    contact.last_name = data.lastName
                    if data.phone:
                        contact.phone = data.phone
                inquiry = Inquiry(
                    contact_id=contact.id,
                    idempotency_key=key,
                    payload_hash=digest,
                    payload=payload,
                )
                session.add(inquiry)
                session.flush()
                session.add(
                    SyncJob(
                        inquiry_id=inquiry.id,
                        provider=settings.crm_provider,
                        mode=settings.crm_sync_mode,
                    )
                )
                wishes = (
                    f"Wunschtermin: {payload.get('booking_date') or 'offen'}, "
                    f"{payload.get('booking_time') or 'Uhrzeit offen'}."
                )
                session.add_all(
                    [
                        AutomationPreview(
                            inquiry_id=inquiry.id,
                            kind="acknowledgment",
                            recipient=data.email,
                            subject="Deine Anfrage bei G3 CrossFit",
                            body=(
                                f"Hallo {data.firstName}, deine Anfrage ist eingegangen. {wishes} "
                                "Der Termin ist noch nicht bestätigt. Das Team meldet sich zur Abstimmung. "
                                "Dies ist nur eine Testvorschau; es wurde keine E-Mail versendet."
                            ),
                        ),
                        AutomationPreview(
                            inquiry_id=inquiry.id,
                            kind="team_notification",
                            recipient=settings.lead_team_email,
                            subject="Neue Probetraining-/Drop-In-Anfrage",
                            body=(
                                f"Anfrage {inquiry.id}: {data.firstName} {data.lastName}, {data.email}. {wishes} "
                                "Bitte persönlich bearbeiten und den Termin abstimmen. Testvorschau, kein Versand."
                            ),
                        ),
                    ]
                )
                # Inquiry + job + previews commit together, before any network operation.
                return inquiry.id
        except IntegrityError:
            if retry == 2:
                raise
    raise RuntimeError("intake_retry_exhausted")


async def process_next(sessions, settings, adapter=None, now=None):
    now = now or datetime.utcnow()
    token = str(uuid.uuid4())
    due = or_(
        and_(SyncJob.state.in_(["pending", "retry"]), SyncJob.next_attempt_at <= now),
        and_(SyncJob.state == "processing", SyncJob.lease_until <= now),
    )
    with sessions.begin() as session:
        job_id = session.scalar(
            select(SyncJob.id)
            .where(due)
            .order_by(SyncJob.next_attempt_at, SyncJob.id)
            .limit(1)
        )
        if not job_id:
            return None
        claimed = session.execute(
            update(SyncJob)
            .where(SyncJob.id == job_id, due)
            .values(
                state="processing",
                lease_token=token,
                lease_until=now + timedelta(seconds=60),
                attempts=SyncJob.attempts + 1,
            )
        )
        if claimed.rowcount != 1:
            return None
        job = session.get(SyncJob, job_id)
        inquiry = session.get(Inquiry, job.inquiry_id)
        contact = session.get(Contact, inquiry.contact_id)
        mode, provider, attempts = job.mode, job.provider, job.attempts
        # Latest immutable snapshot in this mode/provider prevents test leakage
        # and old retries from overwriting newer live contact data.
        latest = session.scalar(
            select(Inquiry)
            .join(SyncJob, SyncJob.inquiry_id == Inquiry.id)
            .where(
                Inquiry.contact_id == contact.id,
                SyncJob.mode == mode,
                SyncJob.provider == provider,
            )
            .order_by(Inquiry.created_at.desc(), Inquiry.id.desc())
            .limit(1)
        )
        snapshot = latest.payload
        payload = {
            "contact_id": contact.id,
            "email": snapshot["email"],
            "firstName": snapshot["firstName"],
            "lastName": snapshot["lastName"],
            "phone": snapshot.get("phone"),
        }
    state, remote_id, error, next_time = "failed", None, None, now
    try:
        if attempts > MAX_ATTEMPTS:
            raise SyncError("attempts_exhausted", retryable=False)
        # An old live job is not allowed to escape the current test-mode switch.
        if mode == "live" and settings.crm_sync_mode != "live":
            raise SyncError("live_sync_disabled", retryable=False)
        result = await (
            adapter or get_adapter(provider, mode, settings.hubspot_access_token)
        ).upsert_contact(payload)
        state = "simulated" if result.simulated else "synced"
        remote_id = result.remote_id
    except SyncError as exc:
        error = exc.code
        if exc.retryable and attempts < MAX_ATTEMPTS:
            state = "retry"
            next_time = now + timedelta(
                seconds=max(exc.retry_after, min(60 * 2 ** (attempts - 1), 3600))
            )
        else:
            state = "failed"
    except Exception:
        # Do not leak provider response bodies, credentials or contact data.
        error = "adapter_unexpected_error"
        state = "retry" if attempts < MAX_ATTEMPTS else "failed"
        next_time = now + timedelta(minutes=5)
    with sessions.begin() as session:
        session.execute(
            update(SyncJob)
            .where(SyncJob.id == job_id, SyncJob.lease_token == token)
            .values(
                state=state,
                remote_id=remote_id,
                last_error=error,
                next_attempt_at=next_time,
                lease_token=None,
                lease_until=None,
            )
        )
    return state
