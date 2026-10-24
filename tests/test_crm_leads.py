"""Lead ingestion never needs Wodify, SendGrid or real HubSpot credentials."""
from concurrent.futures import ThreadPoolExecutor
from datetime import date, datetime, timedelta
import json
from types import SimpleNamespace
import uuid

from fastapi.testclient import TestClient
import httpx
import pytest
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker

from src.leads.adapters import (
    HubSpotAdapter,
    SyncError,
    SyncResult,
    TestAdapter as DryRunAdapter,
)
from src.leads.models import AutomationPreview, Base, Contact, Inquiry, SyncJob
from src.leads.schemas import InquiryInput
from src.leads.service import IdempotencyConflict, accept_inquiry, process_next


@pytest.fixture
def sessions(tmp_path):
    engine = create_engine(
        f"sqlite:///{tmp_path}/leads.db", connect_args={"check_same_thread": False}
    )
    Base.metadata.create_all(engine)
    yield sessionmaker(bind=engine, expire_on_commit=False)
    engine.dispose()


@pytest.fixture
def cfg():
    return SimpleNamespace(
        lead_ingest_key="",
        lead_process_on_submit=False,
        crm_provider="hubspot",
        crm_sync_mode="test",
        hubspot_access_token="",
        lead_team_email="team@example.com",
        lead_admin_key="x" * 40,
    )


@pytest.fixture
def data():
    return InquiryInput(
        firstName="Maya",
        lastName="Test",
        email="MAYA@example.com",
        phone="+49301234567",
        booking_date=date.today() + timedelta(days=2),
        booking_time="abends",
        experience_level="Anfänger",
        message="Synthetischer Test",
        privacy_acknowledged=True,
    )


def test_persist_first_and_idempotent_submission(sessions, cfg, data):
    key = str(uuid.uuid4())
    request_id = accept_inquiry(sessions, data, key, cfg)
    assert accept_inquiry(sessions, data, key, cfg) == request_id
    with sessions() as s:
        assert len(s.scalars(select(Contact)).all()) == 1
        assert len(s.scalars(select(Inquiry)).all()) == 1
        assert len(s.scalars(select(SyncJob)).all()) == 1
        previews = s.scalars(select(AutomationPreview)).all()
        assert len(previews) == 2
        assert all(p.state == "preview" for p in previews)
        assert s.get(Inquiry, request_id).payload["booking_time"] == "abends"
        assert s.get(Inquiry, request_id).payload["privacy_acknowledged"] is True
        assert s.scalar(select(Contact)).email == "maya@example.com"


def test_same_contact_preserves_separate_requests(sessions, cfg, data):
    first = accept_inquiry(sessions, data, str(uuid.uuid4()), cfg)
    second = accept_inquiry(
        sessions,
        data.model_copy(update={"booking_time": "vormittags"}),
        str(uuid.uuid4()),
        cfg,
    )
    with sessions() as s:
        assert len(s.scalars(select(Contact)).all()) == 1
        assert s.get(Inquiry, first).payload["booking_time"] == "abends"
        assert s.get(Inquiry, second).payload["booking_time"] == "vormittags"


def test_same_key_different_payload_rejected(sessions, cfg, data):
    key = str(uuid.uuid4())
    accept_inquiry(sessions, data, key, cfg)
    with pytest.raises(IdempotencyConflict):
        accept_inquiry(
            sessions, data.model_copy(update={"message": "changed"}), key, cfg
        )


def test_concurrent_duplicates_create_one_job(sessions, cfg, data):
    key = str(uuid.uuid4())
    with ThreadPoolExecutor(max_workers=3) as pool:
        results = list(
            pool.map(lambda _: accept_inquiry(sessions, data, key, cfg), range(3))
        )
    assert len(set(results)) == 1
    with sessions() as s:
        assert len(s.scalars(select(SyncJob)).all()) == 1


@pytest.mark.asyncio
async def test_dry_run_no_network_and_never_promoted(sessions, cfg, data, monkeypatch):
    def forbid(*args, **kwargs):
        raise AssertionError("Network forbidden")

    monkeypatch.setattr(httpx.AsyncClient, "post", forbid)
    accept_inquiry(sessions, data, str(uuid.uuid4()), cfg)
    cfg.crm_sync_mode = (
        "live"  # Job was accepted in test mode; changing config must not promote it.
    )
    assert await process_next(sessions, cfg) == "simulated"
    with sessions() as s:
        job = s.scalar(select(SyncJob))
        assert job.remote_id.startswith("test:")
        assert all(p.state == "preview" for p in s.scalars(select(AutomationPreview)))
    assert await process_next(sessions, cfg) is None


@pytest.mark.asyncio
async def test_crm_failure_survives_restart_and_backoff(sessions, cfg, data):
    class Offline:
        async def upsert_contact(self, payload):
            raise SyncError("offline")

    accept_inquiry(sessions, data, str(uuid.uuid4()), cfg)
    now = datetime.utcnow() + timedelta(seconds=1)
    assert await process_next(sessions, cfg, Offline(), now) == "retry"
    assert (
        await process_next(sessions, cfg, Offline(), now + timedelta(seconds=10))
        is None
    )
    assert (
        await process_next(sessions, cfg, DryRunAdapter(), now + timedelta(seconds=61))
        == "simulated"
    )
    with sessions() as s:
        assert len(s.scalars(select(Inquiry)).all()) == 1
        assert s.scalar(select(SyncJob)).attempts == 2


@pytest.mark.asyncio
async def test_only_one_worker_claims_and_expired_lease_recovers(sessions, cfg, data):
    accept_inquiry(sessions, data, str(uuid.uuid4()), cfg)
    with sessions.begin() as s:
        job = s.scalar(select(SyncJob))
        job.state, job.lease_token = "processing", "old"
        job.lease_until = datetime.utcnow() + timedelta(minutes=1)
    assert await process_next(sessions, cfg) is None
    assert (
        await process_next(sessions, cfg, now=datetime.utcnow() + timedelta(minutes=2))
        == "simulated"
    )


@pytest.mark.asyncio
async def test_live_job_blocked_when_global_test_mode(sessions, cfg, data):
    cfg.crm_sync_mode = "live"
    accept_inquiry(sessions, data, str(uuid.uuid4()), cfg)
    cfg.crm_sync_mode = "test"
    assert await process_next(sessions, cfg) == "failed"
    with sessions() as s:
        assert s.scalar(select(SyncJob)).last_error == "live_sync_disabled"


@pytest.mark.asyncio
async def test_hubspot_upsert_uses_email_without_enrollment(data):
    requests = []

    def handle(request):
        requests.append(request)
        return httpx.Response(
            200, json={"status": "COMPLETE", "results": [{"id": "1234"}]}
        )

    adapter = HubSpotAdapter("secret", httpx.MockTransport(handle))
    result = await adapter.upsert_contact(
        {**data.model_dump(mode="json"), "contact_id": "local"}
    )
    assert result == SyncResult("1234")
    body = json.loads(requests[0].content)
    assert requests[0].url.path == "/crm/v3/objects/contacts/batch/upsert"
    assert body["inputs"][0]["idProperty"] == "email"
    assert set(body["inputs"][0]["properties"]) == {
        "email",
        "firstname",
        "lastname",
        "phone",
    }
    assert len(requests) == 1


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "status,body,retryable",
    [
        (429, {}, True),
        (503, {}, True),
        (401, {}, False),
        (400, {}, False),
        (200, {"status": "PENDING"}, True),
        (200, {"status": "COMPLETE", "results": [{"id": "1"}], "numErrors": 1}, True),
    ],
)
async def test_hubspot_errors_are_classified_without_leaking(
    status, body, retryable, data
):
    adapter = HubSpotAdapter(
        "secret",
        httpx.MockTransport(
            lambda _: httpx.Response(status, json=body, headers={"Retry-After": "120"})
        ),
    )
    with pytest.raises(SyncError) as exc:
        await adapter.upsert_contact(data.model_dump(mode="json"))
    assert exc.value.retryable is retryable
    assert "secret" not in str(exc.value)
    if status == 429:
        assert exc.value.retry_after == 120


@pytest.fixture
def client(sessions, cfg, monkeypatch):
    from src.leads import api
    from src import lead_app

    monkeypatch.setattr(api, "get_sessions", lambda: sessions)
    monkeypatch.setattr(api, "get_settings", lambda: cfg)
    monkeypatch.setattr(lead_app, "get_sessions", lambda: sessions)
    api.limiter._storage.reset()
    with TestClient(lead_app.app) as client:
        yield client


def test_api_accepts_only_valid_inquiry_and_protects_management(client, data):
    payload = data.model_dump(mode="json")
    result = client.post(
        "/api/leads", json=payload, headers={"Idempotency-Key": str(uuid.uuid4())}
    )
    assert result.status_code == 202
    assert result.json()["automation_mode"] == "test"
    request_id = result.json()["request_id"]
    assert client.get("/api/leads/manage").status_code == 401
    assert client.get(f"/api/leads/manage/{request_id}").status_code == 401
    auth = {"X-Lead-Admin-Key": "x" * 40}
    detail = client.get(f"/api/leads/manage/{request_id}", headers=auth)
    assert detail.status_code == 200
    assert detail.headers["Cache-Control"] == "no-store"
    assert detail.json()["crm"]["state"] == "pending"
    assert len(detail.json()["previews"]) == 2
    processed = client.post("/api/leads/manage/process", headers=auth)
    assert processed.status_code == 200
    assert processed.json()["states"] == ["simulated"]
    assert (
        client.patch(
            f"/api/leads/manage/{request_id}",
            json={"status": "contacted"},
            headers=auth,
        ).status_code
        == 200
    )
    assert (
        client.post(f"/api/leads/manage/{request_id}/retry", headers=auth).status_code
        == 409
    )


@pytest.mark.parametrize(
    "changes",
    [
        {"privacy_acknowledged": False},
        {"privacy_acknowledged": "true"},
        {"firstName": "   "},
        {"email": "invalid"},
        {"website": "bot"},
        {"booking_date": "2020-01-01"},
    ],
)
def test_api_rejects_invalid_without_storage(client, sessions, data, changes):
    result = client.post(
        "/api/leads",
        json={**data.model_dump(mode="json"), **changes},
        headers={"Idempotency-Key": str(uuid.uuid4())},
    )
    assert result.status_code == 422
    with sessions() as s:
        assert not s.scalars(select(Inquiry)).all()


@pytest.mark.asyncio
async def test_competing_workers_do_not_deliver_twice(sessions, cfg, data):
    import asyncio

    started, release = asyncio.Event(), asyncio.Event()

    class SlowAdapter:
        async def upsert_contact(self, payload):
            started.set()
            await release.wait()
            return SyncResult("test:one", simulated=True)

    accept_inquiry(sessions, data, str(uuid.uuid4()), cfg)
    task = asyncio.create_task(process_next(sessions, cfg, SlowAdapter()))
    await started.wait()
    assert await process_next(sessions, cfg) is None
    release.set()
    assert await task == "simulated"


@pytest.mark.asyncio
async def test_retries_are_bounded_and_never_delete_inquiry(sessions, cfg, data):
    class Offline:
        async def upsert_contact(self, payload):
            raise SyncError("offline")

    accept_inquiry(sessions, data, str(uuid.uuid4()), cfg)
    for attempt in range(5):
        with sessions() as s:
            due = s.scalar(select(SyncJob)).next_attempt_at
        assert await process_next(
            sessions, cfg, Offline(), due + timedelta(seconds=1)
        ) == ("retry" if attempt < 4 else "failed")
    assert (
        await process_next(sessions, cfg, now=datetime.utcnow() + timedelta(days=100))
        is None
    )
    with sessions() as s:
        assert len(s.scalars(select(Inquiry)).all()) == 1
        assert s.scalar(select(SyncJob)).attempts == 5


def test_automation_configuration_fails_closed():
    from pydantic import ValidationError
    from src.leads.config import LeadSettings

    with pytest.raises(ValidationError):
        LeadSettings(lead_automation_mode="live")


def test_api_missing_admin_key_fails_closed(client, cfg):
    cfg.lead_admin_key = ""
    assert client.get("/api/leads/manage").status_code == 503


@pytest.mark.asyncio
async def test_test_inquiry_cannot_change_pending_live_payload(sessions, cfg, data):
    cfg.crm_sync_mode = "live"
    accept_inquiry(sessions, data, str(uuid.uuid4()), cfg)
    cfg.crm_sync_mode = "test"
    accept_inquiry(
        sessions,
        data.model_copy(update={"firstName": "TestOnlyName"}),
        str(uuid.uuid4()),
        cfg,
    )
    captured = []

    class Capture:
        async def upsert_contact(self, payload):
            captured.append(payload)
            return SyncResult("1234")

    cfg.crm_sync_mode = "live"
    # Force original live job first, even if timestamps have equal precision.
    with sessions.begin() as s:
        for job in s.scalars(select(SyncJob)):
            if job.mode == "test":
                job.next_attempt_at = datetime.utcnow() + timedelta(days=1)
    assert await process_next(sessions, cfg, Capture()) == "synced"
    assert captured[0]["firstName"] == "Maya"


@pytest.mark.asyncio
async def test_older_retry_uses_latest_snapshot_in_same_mode(sessions, cfg, data):
    cfg.crm_sync_mode = "live"
    accept_inquiry(sessions, data, str(uuid.uuid4()), cfg)
    second = accept_inquiry(
        sessions,
        data.model_copy(update={"firstName": "LatestLive"}),
        str(uuid.uuid4()),
        cfg,
    )
    with sessions.begin() as s:
        s.get(Inquiry, second).created_at = datetime.utcnow() + timedelta(seconds=1)
    captured = []

    class Capture:
        async def upsert_contact(self, payload):
            captured.append(payload)
            return SyncResult("1234")

    assert await process_next(sessions, cfg, Capture()) == "synced"
    assert captured[0]["firstName"] == "LatestLive"


def test_admin_cannot_requeue_processing_job(client, sessions, cfg, data):
    request_id = accept_inquiry(sessions, data, str(uuid.uuid4()), cfg)
    with sessions.begin() as s:
        job = s.scalar(select(SyncJob))
        job.state, job.lease_token = "processing", "worker-token"
    result = client.post(
        f"/api/leads/manage/{request_id}/retry",
        headers={"X-Lead-Admin-Key": cfg.lead_admin_key},
    )
    assert result.status_code == 409
    with sessions() as s:
        assert s.scalar(select(SyncJob)).lease_token == "worker-token"


def test_ingest_requires_server_key(client, cfg, data):
    cfg.lead_ingest_key = "s" * 40
    payload = data.model_dump(mode="json")
    assert client.post("/api/leads", json=payload).status_code == 401
    assert (
        client.post(
            "/api/leads",
            json=payload,
            headers={"X-Lead-Ingest-Key": cfg.lead_ingest_key},
        ).status_code
        == 202
    )


def test_persistent_rate_limit_preserves_idempotent_replay(sessions, cfg, data):
    from src.leads.service import IntakeRateLimit

    cfg.lead_intake_limit = 1
    key = str(uuid.uuid4())
    first = accept_inquiry(sessions, data, key, cfg)
    assert accept_inquiry(sessions, data, key, cfg) == first
    with pytest.raises(IntakeRateLimit):
        accept_inquiry(sessions, data, str(uuid.uuid4()), cfg)


@pytest.mark.asyncio
async def test_hubspot_inquiry_contains_latest_message_and_date(data):
    captured = []

    def handler(request):
        captured.append(json.loads(request.content))
        return httpx.Response(
            200, json={"status": "COMPLETE", "results": [{"id": "1234"}]}
        )

    adapter = HubSpotAdapter(
        "secret", transport=httpx.MockTransport(handler), inquiry_property="g3_anfrage"
    )
    payload = data.model_dump(mode="json")
    payload.update(
        request_id="request-123", booking_date="2026-10-26", message="Testnachricht"
    )
    assert (await adapter.upsert_contact(payload)).remote_id == "1234"
    fields = captured[0]["inputs"][0]["properties"]
    assert "2026-10-26" in fields["g3_anfrage"]
    assert "Testnachricht" in fields["g3_anfrage"]
    assert "request-123" in fields["g3_anfrage"]
    assert "lifecyclestage" not in fields
