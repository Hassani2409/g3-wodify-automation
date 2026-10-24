from datetime import datetime
import uuid

from sqlalchemy import Column, DateTime, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import declarative_base

Base = declarative_base()


def uid():
    return str(uuid.uuid4())


class Contact(Base):
    __tablename__ = "crm_contacts"
    id = Column(String(36), primary_key=True, default=uid)
    email = Column(String(254), nullable=False, unique=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(50), nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class Inquiry(Base):
    __tablename__ = "crm_inquiries"
    id = Column(String(36), primary_key=True, default=uid)
    contact_id = Column(
        String(36), ForeignKey("crm_contacts.id"), nullable=False, index=True
    )
    idempotency_key = Column(String(128), nullable=False, unique=True)
    payload_hash = Column(String(64), nullable=False)
    # Immutable submission snapshot; later inquiries cannot overwrite appointment wishes.
    payload = Column(JSON, nullable=False)
    status = Column(String(20), nullable=False, default="new")
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class SyncJob(Base):
    __tablename__ = "crm_sync_jobs"
    id = Column(String(36), primary_key=True, default=uid)
    inquiry_id = Column(
        String(36), ForeignKey("crm_inquiries.id"), unique=True, nullable=False
    )
    provider = Column(String(30), nullable=False)
    mode = Column(
        String(10), nullable=False
    )  # Captured at submission: test jobs never become live.
    state = Column(String(20), nullable=False, default="pending", index=True)
    attempts = Column(Integer, nullable=False, default=0)
    next_attempt_at = Column(
        DateTime, nullable=False, default=datetime.utcnow, index=True
    )
    lease_token = Column(String(36), nullable=True)
    lease_until = Column(DateTime, nullable=True)
    remote_id = Column(String(100), nullable=True)
    last_error = Column(
        String(100), nullable=True
    )  # Codes only, never API bodies or secrets.


class AutomationPreview(Base):
    __tablename__ = "crm_automation_previews"
    id = Column(String(36), primary_key=True, default=uid)
    inquiry_id = Column(
        String(36), ForeignKey("crm_inquiries.id"), nullable=False, index=True
    )
    kind = Column(String(30), nullable=False)
    state = Column(String(20), nullable=False, default="preview")
    recipient = Column(String(254), nullable=False)
    subject = Column(String(200), nullable=False)
    body = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
