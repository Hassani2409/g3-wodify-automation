from datetime import date, datetime
from typing import Literal, Optional
from zoneinfo import ZoneInfo

from pydantic import BaseModel, ConfigDict, EmailStr, Field, StrictBool, field_validator


class InquiryInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")
    firstName: str = Field(min_length=1, max_length=100)
    lastName: str = Field(min_length=1, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=50)
    message: Optional[str] = Field(default=None, max_length=2000)
    interested_in: Literal["Probetraining", "Drop-In"] = "Probetraining"
    booking_date: Optional[date] = None
    booking_time: Optional[str] = Field(default=None, max_length=50)
    experience_level: Optional[str] = Field(default=None, max_length=100)
    source: Literal["Website Contact Form"] = "Website Contact Form"
    privacy_acknowledged: StrictBool
    website: str = Field(default="", max_length=200)  # Honeypot.

    @field_validator("privacy_acknowledged")
    @classmethod
    def privacy_required(cls, value):
        if not value:
            raise ValueError("Bitte bestätige den Datenschutzhinweis.")
        return value

    @field_validator("website")
    @classmethod
    def empty_honeypot(cls, value):
        if value:
            raise ValueError("Anfrage konnte nicht angenommen werden.")
        return value

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value):
        if len(value) > 254:
            raise ValueError("E-Mail zu lang.")
        return value.lower()

    @field_validator("booking_date")
    @classmethod
    def future_date(cls, value):
        today = datetime.now(ZoneInfo("Europe/Berlin")).date()
        if value and (value < today or (value - today).days > 93):
            raise ValueError(
                "Bitte wähle einen Termin innerhalb der nächsten drei Monate."
            )
        return value


class InquiryAccepted(BaseModel):
    success: bool = True
    request_id: str
    message: str = "Anfrage gespeichert. Dein Wunschtermin ist noch nicht bestätigt."
    automation_mode: Literal["test"] = "test"
