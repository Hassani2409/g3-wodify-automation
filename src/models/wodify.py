"""
G3 CrossFit WODIFY Automation - WODIFY Data Models
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class MembershipStatus(str, Enum):
    """Membership status enum"""
    ACTIVE = "Active"
    INACTIVE = "Inactive"
    PENDING = "Pending"
    CANCELLED = "Cancelled"


class LeadStatus(str, Enum):
    """Lead status enum"""
    NEW = "New"
    INTERESTED = "Interested"
    CONTACTED = "Contacted"
    CONVERTED = "Converted"
    LOST = "Lost"


class LeadNurturingState(str, Enum):
    """Lead nurturing state enum"""
    NEW = "NEW"
    RESPONDED = "RESPONDED"  # Lead-Response gesendet
    NURTURING_2 = "NURTURING_2"  # Tag 2 E-Mail gesendet
    NURTURING_5 = "NURTURING_5"  # Tag 5 E-Mail gesendet
    NURTURING_7 = "NURTURING_7"  # Tag 7 E-Mail gesendet
    CONVERTED = "CONVERTED"  # Zu Mitglied konvertiert
    OPTED_OUT = "OPTED_OUT"  # Opt-out


class WodifyMembershipCreated(BaseModel):
    """WODIFY Webhook: New Membership Created"""
    
    # Member Information
    client_id: str = Field(..., description="WODIFY Client ID")
    first_name: str = Field(..., description="Member first name")
    last_name: str = Field(..., description="Member last name")
    email: EmailStr = Field(..., description="Member email address")
    phone: Optional[str] = Field(None, description="Member phone number")
    
    # Membership Information
    membership_id: str = Field(..., description="WODIFY Membership ID")
    membership_type: str = Field(..., description="Membership type name")
    membership_status: MembershipStatus = Field(..., description="Membership status")
    monthly_price: float = Field(..., description="Monthly membership price in EUR")
    start_date: datetime = Field(..., description="Membership start date")
    end_date: Optional[datetime] = Field(None, description="Membership end date")
    
    # Additional Information
    is_first_membership: bool = Field(default=True, description="Is this the member's first membership?")
    referral_source: Optional[str] = Field(None, description="How did the member hear about us?")
    emergency_contact: Optional[str] = Field(None, description="Emergency contact information")
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    webhook_received_at: Optional[datetime] = None


class WodifyLeadCreated(BaseModel):
    """WODIFY Webhook: New Lead Created"""
    
    # Lead Information
    lead_id: str = Field(..., description="WODIFY Lead ID")
    first_name: str = Field(..., description="Lead first name")
    last_name: str = Field(..., description="Lead last name")
    email: EmailStr = Field(..., description="Lead email address")
    phone: Optional[str] = Field(None, description="Lead phone number")
    
    # Lead Status
    lead_status: LeadStatus = Field(default=LeadStatus.NEW, description="Lead status")
    interested_in: Optional[str] = Field(None, description="Interested in which program/membership")
    
    # Additional Information
    message: Optional[str] = Field(None, description="Message from the lead")
    referral_source: Optional[str] = Field(None, description="How did they hear about us?")
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    webhook_received_at: Optional[datetime] = None


class WodifyClassBooked(BaseModel):
    """WODIFY Webhook: Class Booked"""
    
    # Member Information
    client_id: str = Field(..., description="WODIFY Client ID")
    first_name: str = Field(..., description="Member first name")
    last_name: str = Field(..., description="Member last name")
    email: EmailStr = Field(..., description="Member email address")
    
    # Class Information
    class_id: str = Field(..., description="WODIFY Class ID")
    class_name: str = Field(..., description="Class name")
    class_date: datetime = Field(..., description="Class date and time")
    coach_name: Optional[str] = Field(None, description="Coach name")
    
    # Booking Information
    booking_id: str = Field(..., description="WODIFY Booking ID")
    booking_status: str = Field(..., description="Booking status (Booked, Waitlist, Cancelled)")
    
    # Metadata
    booked_at: datetime = Field(default_factory=datetime.utcnow)
    webhook_received_at: Optional[datetime] = None


class WodifyMembershipCancelled(BaseModel):
    """WODIFY Webhook: Membership Cancelled"""
    
    # Member Information
    client_id: str = Field(..., description="WODIFY Client ID")
    first_name: str = Field(..., description="Member first name")
    last_name: str = Field(..., description="Member last name")
    email: EmailStr = Field(..., description="Member email address")
    
    # Membership Information
    membership_id: str = Field(..., description="WODIFY Membership ID")
    membership_type: str = Field(..., description="Membership type name")
    cancellation_reason: Optional[str] = Field(None, description="Reason for cancellation")
    cancelled_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Metadata
    webhook_received_at: Optional[datetime] = None


class WodifyWebhookPayload(BaseModel):
    """Generic WODIFY Webhook Payload"""
    
    event_type: str = Field(..., description="Type of webhook event")
    event_id: str = Field(..., description="Unique event ID")
    tenant: str = Field(..., description="WODIFY tenant identifier")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    data: dict = Field(..., description="Event data")
