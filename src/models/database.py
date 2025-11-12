"""
G3 CrossFit WODIFY Automation - Database Models
"""

from sqlalchemy import Column, String, Float, Boolean, DateTime, Text, Enum as SQLEnum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from datetime import datetime
import enum


Base = declarative_base()


class MembershipStatusDB(str, enum.Enum):
    """Membership status enum for database"""
    ACTIVE = "Active"
    INACTIVE = "Inactive"
    PENDING = "Pending"
    CANCELLED = "Cancelled"


class LeadStatusDB(str, enum.Enum):
    """Lead status enum for database"""
    NEW = "New"
    INTERESTED = "Interested"
    CONTACTED = "Contacted"
    CONVERTED = "Converted"
    LOST = "Lost"


class Member(Base):
    """Member database model"""
    __tablename__ = "members"
    
    # Primary Key
    client_id = Column(String, primary_key=True, index=True)
    
    # Member Information
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    phone = Column(String, nullable=True)
    
    # Membership Information
    membership_id = Column(String, nullable=False)
    membership_type = Column(String, nullable=False)
    membership_status = Column(SQLEnum(MembershipStatusDB), nullable=False)
    monthly_price = Column(Float, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=True)
    
    # Additional Information
    is_first_membership = Column(Boolean, default=True)
    referral_source = Column(String, nullable=True)
    emergency_contact = Column(String, nullable=True)
    
    # Email Tracking
    welcome_email_sent = Column(Boolean, default=False)
    welcome_email_sent_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class Lead(Base):
    """Lead database model"""
    __tablename__ = "leads"
    
    # Primary Key
    lead_id = Column(String, primary_key=True, index=True)
    
    # Lead Information
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, nullable=False, index=True)
    phone = Column(String, nullable=True)
    
    # Lead Status
    lead_status = Column(SQLEnum(LeadStatusDB), nullable=False, default=LeadStatusDB.NEW)
    interested_in = Column(String, nullable=True)
    
    # Additional Information
    message = Column(Text, nullable=True)
    referral_source = Column(String, nullable=True)
    
    # Email Tracking
    nurturing_email_sent = Column(Boolean, default=False)
    nurturing_email_sent_at = Column(DateTime, nullable=True)
    followup_email_sent = Column(Boolean, default=False)
    followup_email_sent_at = Column(DateTime, nullable=True)
    
    # Conversion Tracking
    converted_to_member = Column(Boolean, default=False)
    converted_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class WebhookLog(Base):
    """Webhook log database model"""
    __tablename__ = "webhook_logs"
    
    # Primary Key
    id = Column(String, primary_key=True, index=True)
    
    # Webhook Information
    event_type = Column(String, nullable=False, index=True)
    event_id = Column(String, nullable=False, unique=True, index=True)
    tenant = Column(String, nullable=False)
    
    # Payload
    payload = Column(Text, nullable=False)  # JSON string
    
    # Processing Status
    processed = Column(Boolean, default=False)
    processed_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)
    
    # Timestamps
    received_at = Column(DateTime, server_default=func.now())


class EmailLog(Base):
    """Email log database model"""
    __tablename__ = "email_logs"
    
    # Primary Key
    id = Column(String, primary_key=True, index=True)
    
    # Email Information
    email_type = Column(String, nullable=False, index=True)  # welcome, nurturing, followup, etc.
    recipient_email = Column(String, nullable=False, index=True)
    recipient_name = Column(String, nullable=False)
    
    # SendGrid Information
    sendgrid_message_id = Column(String, nullable=True)
    
    # Status
    sent = Column(Boolean, default=False)
    sent_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)
    
    # Related Records
    related_client_id = Column(String, nullable=True, index=True)
    related_lead_id = Column(String, nullable=True, index=True)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())


class User(Base):
    """User database model for authentication"""
    __tablename__ = "users"
    
    # Primary Key
    id = Column(String, primary_key=True, index=True)
    
    # User Information
    email = Column(String, unique=True, nullable=False, index=True)
    username = Column(String, unique=True, nullable=True, index=True)
    hashed_password = Column(String, nullable=False)
    
    # Profile Information
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    
    # Account Status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    
    # WODIFY Integration (optional)
    wodify_client_id = Column(String, nullable=True, index=True)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    last_login = Column(DateTime, nullable=True)
