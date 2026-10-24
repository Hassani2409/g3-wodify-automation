from datetime import datetime
import secrets
import uuid

from fastapi import (
    BackgroundTasks,
    APIRouter,
    Depends,
    Header,
    HTTPException,
    Query,
    Request,
    Response,
)
from pydantic import BaseModel
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy import select, update, text
from sqlalchemy.exc import SQLAlchemyError
from typing import Literal

from .config import get_settings
from .models import AutomationPreview, Contact, Inquiry, SyncJob
from .schemas import InquiryAccepted, InquiryInput
from .service import IntakeRateLimit, IdempotencyConflict, accept_inquiry, process_next
from .storage import get_sessions


def private_headers(response: Response):
    response.headers["Cache-Control"] = "no-store"


router = APIRouter(
    prefix="/api/leads",
    tags=["CRM-independent leads"],
    dependencies=[Depends(private_headers)],
)
limiter = Limiter(key_func=get_remote_address)


def require_admin(x_lead_admin_key: str = Header(default="")):
    expected = get_settings().lead_admin_key
    if len(expected) < 32:
        raise HTTPException(503, "Lead-Verwaltungszugang ist nicht eingerichtet.")
    if not secrets.compare_digest(x_lead_admin_key.encode(), expected.encode()):
        raise HTTPException(401, "Zugriff verweigert.")


@router.post("", response_model=InquiryAccepted, status_code=202)
@limiter.limit("10/minute")
async def create_lead(
    request: Request,
    lead_data: InquiryInput,
    background_tasks: BackgroundTasks,
    x_lead_ingest_key: str = Header(default=""),
    idempotency_key: str = Header(default="", min_length=16, max_length=128),
):
    settings = get_settings()
    if settings.lead_ingest_key and not secrets.compare_digest(
        x_lead_ingest_key, settings.lead_ingest_key
    ):
        raise HTTPException(401, "Zugriff verweigert.")
    # Optional for older API clients; the website always supplies a stable UUID.
    key = idempotency_key or str(uuid.uuid4())
    if not all(c.isascii() and (c.isalnum() or c in "_-") for c in key):
        raise HTTPException(422, "Ungültiger Anfrageschlüssel.")
    try:
        request_id = accept_inquiry(get_sessions(), lead_data, key, get_settings())
    except IntakeRateLimit:
        raise HTTPException(
            429, "Zu viele Anfragen. Bitte später erneut versuchen."
        ) from None
    except IdempotencyConflict:
        raise HTTPException(
            409, "Anfrageschlüssel gehört zu anderen Angaben."
        ) from None
    except SQLAlchemyError:
        raise HTTPException(
            503,
            "Anfrage konnte nicht gespeichert werden. Bitte später erneut versuchen.",
        ) from None
    if settings.lead_process_on_submit:
        background_tasks.add_task(process_next, get_sessions(), settings)
    return InquiryAccepted(request_id=request_id)


@router.get("/health")
def health():
    try:
        with get_sessions()() as session:
            session.execute(text("SELECT 1"))
    except SQLAlchemyError:
        raise HTTPException(503, "Datenbank nicht erreichbar.") from None
    return {
        "status": "healthy",
        "crm_provider": get_settings().crm_provider,
        "crm_mode": get_settings().crm_sync_mode,
        "automation_mode": "test",
    }


@router.get("/manage", dependencies=[Depends(require_admin)])
def list_inquiries(limit: int = Query(25, ge=1, le=100), offset: int = Query(0, ge=0)):
    with get_sessions()() as session:
        inquiries = session.scalars(
            select(Inquiry)
            .order_by(Inquiry.created_at.desc(), Inquiry.id)
            .limit(limit)
            .offset(offset)
        ).all()
        return [
            {
                "request_id": item.id,
                "status": item.status,
                "created_at": item.created_at,
                "email": session.get(Contact, item.contact_id).email,
            }
            for item in inquiries
        ]


@router.get("/manage/{request_id}", dependencies=[Depends(require_admin)])
def inquiry_detail(request_id: str):
    with get_sessions()() as session:
        inquiry = session.get(Inquiry, request_id)
        if not inquiry:
            raise HTTPException(404, "Anfrage nicht gefunden.")
        job = session.scalar(select(SyncJob).where(SyncJob.inquiry_id == request_id))
        previews = session.scalars(
            select(AutomationPreview).where(AutomationPreview.inquiry_id == request_id)
        ).all()
        return {
            "request_id": inquiry.id,
            "status": inquiry.status,
            "created_at": inquiry.created_at,
            "payload": inquiry.payload,
            "crm": {
                "provider": job.provider,
                "mode": job.mode,
                "state": job.state,
                "attempts": job.attempts,
                "remote_id": job.remote_id,
                "error": job.last_error,
                "next_attempt_at": job.next_attempt_at,
            },
            "automation_mode": "test",
            "previews": [
                {
                    "kind": p.kind,
                    "state": p.state,
                    "recipient": p.recipient,
                    "subject": p.subject,
                    "body": p.body,
                }
                for p in previews
            ],
        }


class StatusUpdate(BaseModel):
    status: Literal["new", "contacted", "converted", "closed"]


@router.patch("/manage/{request_id}", dependencies=[Depends(require_admin)])
def update_status(request_id: str, data: StatusUpdate):
    with get_sessions().begin() as session:
        inquiry = session.get(Inquiry, request_id)
        if not inquiry:
            raise HTTPException(404, "Anfrage nicht gefunden.")
        inquiry.status = data.status
    return {"status": data.status}


@router.post("/manage/{request_id}/retry", dependencies=[Depends(require_admin)])
def retry_sync(request_id: str):
    with get_sessions().begin() as session:
        job = session.scalar(select(SyncJob).where(SyncJob.inquiry_id == request_id))
        if not job:
            raise HTTPException(404, "Anfrage nicht gefunden.")
        # State transition must be atomic with respect to the worker's claim.
        changed = session.execute(
            update(SyncJob)
            .where(SyncJob.id == job.id, SyncJob.state.in_(["failed", "retry"]))
            .values(
                state="pending",
                attempts=0,
                last_error=None,
                next_attempt_at=datetime.utcnow(),
                lease_token=None,
                lease_until=None,
            )
        )
        if changed.rowcount != 1:
            raise HTTPException(
                409, "Dieser Auftrag kann nicht erneut gestartet werden."
            )
    return {"state": "pending"}


@router.post("/manage/process", dependencies=[Depends(require_admin)])
async def process_jobs(limit: int = Query(10, ge=1, le=20)):
    states = []
    for _ in range(limit):
        state = await process_next(get_sessions(), get_settings())
        if state is None:
            break
        states.append(state)
    return {"processed": len(states), "states": states, "automation_mode": "test"}
