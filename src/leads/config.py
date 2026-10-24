from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class LeadSettings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    lead_database_url: str = "sqlite:///./g3_leads.db"
    lead_database_schema: str = ""
    lead_initialize_schema: bool = True
    lead_intake_limit: int = 10
    lead_ingest_key: str = ""
    lead_process_on_submit: bool = False
    hubspot_inquiry_property: str = ""
    crm_provider: Literal["hubspot"] = "hubspot"
    crm_sync_mode: Literal["test", "live"] = "test"
    hubspot_access_token: str = ""
    lead_admin_key: str = ""
    lead_team_email: str = "info@g3crossfit.com"
    # Intentionally no live email/automation implementation in this prototype.
    lead_automation_mode: Literal["test"] = "test"


@lru_cache
def get_settings() -> LeadSettings:
    return LeadSettings()
