"""Provider boundary: adapters receive a contact snapshot and return an external ID."""
from dataclasses import dataclass
from typing import Protocol

import httpx


@dataclass(frozen=True)
class SyncResult:
    remote_id: str
    simulated: bool = False


class SyncError(Exception):
    def __init__(self, code: str, retryable: bool = True, retry_after: int = 0):
        super().__init__(code)
        self.code = code
        self.retryable = retryable
        self.retry_after = min(max(retry_after, 0), 86400)


class CRMAdapter(Protocol):
    async def upsert_contact(self, payload: dict) -> SyncResult:
        ...


class TestAdapter:
    async def upsert_contact(self, payload: dict) -> SyncResult:
        # Stable local reference, explicitly not a HubSpot contact ID.
        return SyncResult("test:" + payload["contact_id"], simulated=True)


class HubSpotAdapter:
    def __init__(self, token: str, transport=None, inquiry_property: str = ""):
        self.inquiry_property = inquiry_property
        self.token = token
        self.transport = transport

    async def upsert_contact(self, payload: dict) -> SyncResult:
        if not self.token:
            raise SyncError("hubspot_not_configured", retryable=False)
        properties = {
            "email": payload["email"],
            "firstname": payload["firstName"],
            "lastname": payload["lastName"],
        }
        if payload.get("phone"):
            properties["phone"] = payload["phone"]
        if self.inquiry_property:
            properties[self.inquiry_property] = (
                f"Anfrage: {payload.get('request_id', '')}\n"
                f"Quelle: Website Contact Form\n"
                f"Interesse: {payload.get('interested_in', '')}\n"
                f"Wunschtermin: {payload.get('booking_date') or 'offen'}\n"
                f"Uhrzeitwunsch: {payload.get('booking_time') or 'offen'}\n"
                f"Erfahrung: {payload.get('experience_level') or 'offen'}\n"
                f"Nachricht:\n{payload.get('message') or ''}\n"
                "Status: Anfrage eingegangen, Termin noch nicht bestaetigt."
            )
        # No lifecycle, subscription, marketing or workflow enrollment changes.
        body = {
            "inputs": [
                {
                    "idProperty": "email",
                    "id": payload["email"],
                    "properties": properties,
                }
            ]
        }
        try:
            async with httpx.AsyncClient(
                timeout=12, transport=self.transport
            ) as client:
                response = await client.post(
                    "https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert",
                    headers={"Authorization": f"Bearer {self.token}"},
                    json=body,
                )
        except httpx.HTTPError:
            raise SyncError("hubspot_transport") from None
        if response.status_code == 429:
            value = response.headers.get("Retry-After", "60")
            raise SyncError(
                "hubspot_rate_limit", retry_after=int(value) if value.isdigit() else 60
            )
        if response.status_code >= 500:
            raise SyncError("hubspot_unavailable")
        if response.status_code not in (200, 201):
            raise SyncError(f"hubspot_http_{response.status_code}", retryable=False)
        try:
            data = response.json()
            results = data.get("results", [])
            if (
                data.get("errors")
                or data.get("numErrors")
                or data.get("status") != "COMPLETE"
                or len(results) != 1
            ):
                raise ValueError()
            remote_id = results[0]["id"]
            if not isinstance(remote_id, str) or not remote_id.isdigit():
                raise ValueError()
        except (ValueError, KeyError, TypeError):
            raise SyncError("hubspot_invalid_response") from None
        return SyncResult(remote_id)


def get_adapter(
    provider: str, mode: str, token: str = "", inquiry_property: str = ""
) -> CRMAdapter:
    if provider != "hubspot":
        raise SyncError("unknown_provider", retryable=False)
    if mode == "test":
        return TestAdapter()
    if mode != "live":
        raise SyncError("unknown_mode", retryable=False)
    return HubSpotAdapter(token, inquiry_property=inquiry_property)
