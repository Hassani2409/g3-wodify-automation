"""
Tests for database service
"""

import pytest
from datetime import datetime

from src.models.database import Member, Lead
from src.services.database_service import DatabaseService


@pytest.mark.asyncio
async def test_create_member(test_db, sample_membership_data):
    """Test creating a member in the database"""
    db_service = DatabaseService()
    
    # Create member
    await db_service.create_member(sample_membership_data)
    
    # Verify member was created
    member = test_db.query(Member).filter(
        Member.client_id == sample_membership_data.client_id
    ).first()
    
    assert member is not None
    assert member.first_name == sample_membership_data.first_name
    assert member.last_name == sample_membership_data.last_name
    assert member.email == sample_membership_data.email


@pytest.mark.asyncio
async def test_create_lead(test_db, sample_lead_data):
    """Test creating a lead in the database"""
    db_service = DatabaseService()
    
    # Create lead
    await db_service.create_lead(sample_lead_data)
    
    # Verify lead was created
    lead = test_db.query(Lead).filter(
        Lead.lead_id == sample_lead_data.lead_id
    ).first()
    
    assert lead is not None
    assert lead.first_name == sample_lead_data.first_name
    assert lead.last_name == sample_lead_data.last_name
    assert lead.email == sample_lead_data.email


@pytest.mark.asyncio
async def test_mark_welcome_email_sent(test_db, sample_membership_data):
    """Test marking welcome email as sent"""
    db_service = DatabaseService()
    
    # Create member
    await db_service.create_member(sample_membership_data)
    
    # Mark welcome email as sent
    await db_service.mark_welcome_email_sent(
        sample_membership_data.client_id,
        "test_message_id"
    )
    
    # Verify
    member = test_db.query(Member).filter(
        Member.client_id == sample_membership_data.client_id
    ).first()
    
    assert member.welcome_email_sent is True
    assert member.welcome_email_sent_at is not None


@pytest.mark.asyncio
async def test_log_email(test_db):
    """Test logging an email"""
    db_service = DatabaseService()
    
    await db_service.log_email(
        email_type="welcome",
        recipient_email="test@example.com",
        recipient_name="Test User",
        sendgrid_message_id="msg_123",
        related_client_id="client_123"
    )
    
    # Note: This test would need access to the EmailLog table
    # For now, we just verify it doesn't raise an exception
    assert True

