"""
Tests for email workflow automation

Tests cover:
- Welcome email workflow
- Lead response email workflow
- Trial confirmation/reminder/followup workflows
- Lead nurturing sequence workflows
"""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from datetime import datetime, timedelta

from src.services.email_service import email_service
from src.services.automation_service import automation_service
from src.services.scheduler_service import scheduler_service
from src.models.wodify import (
    WodifyMembershipCreated,
    WodifyLeadCreated,
    WodifyClassBooked,
    MembershipStatus,
    LeadStatus
)


@pytest.fixture
def mock_sendgrid():
    """Mock SendGrid API client"""
    with patch('src.services.email_service.SendGridAPIClient') as mock:
        mock_client = MagicMock()
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.headers = {'X-Message-Id': 'test-message-id-123'}
        mock_client.send.return_value = mock_response
        mock.return_value = mock_client
        yield mock_client


@pytest.fixture
def sample_membership():
    """Sample membership data"""
    return WodifyMembershipCreated(
        client_id="test_client_123",
        first_name="Max",
        last_name="Mustermann",
        email="max@example.com",
        phone="+49 123 456789",
        membership_id="mem_123",
        membership_type="Regular Unlimited",
        membership_status=MembershipStatus.ACTIVE,
        monthly_price=129.00,
        start_date=datetime.now(),
        is_first_membership=True
    )


@pytest.fixture
def sample_lead():
    """Sample lead data"""
    return WodifyLeadCreated(
        lead_id="lead_123",
        first_name="Anna",
        last_name="Schmidt",
        email="anna@example.com",
        phone="+49 987 654321",
        lead_status=LeadStatus.NEW,
        interested_in="CrossFit Fundamentals"
    )


@pytest.fixture
def sample_booking():
    """Sample booking data"""
    return WodifyClassBooked(
        client_id="test_client_123",
        first_name="Max",
        last_name="Mustermann",
        email="max@example.com",
        class_id="class_123",
        class_name="CrossFit Fundamentals",
        class_date=datetime.now() + timedelta(days=1),
        coach_name="Coach John",
        booking_id="booking_123",
        booking_status="Booked"
    )


class TestWelcomeEmailWorkflow:
    """Tests for welcome email workflow"""
    
    @pytest.mark.asyncio
    async def test_send_welcome_email_success(self, mock_sendgrid, sample_membership):
        """Test successful welcome email sending"""
        success, message_id = await email_service.send_welcome_email(
            first_name=sample_membership.first_name,
            last_name=sample_membership.last_name,
            email=sample_membership.email,
            membership_type=sample_membership.membership_type,
            start_date=sample_membership.start_date.strftime("%d.%m.%Y"),
            monthly_price=sample_membership.monthly_price,
            is_first_membership=True
        )
        
        assert success is True
        assert message_id == "test-message-id-123"
        mock_sendgrid.send.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_send_welcome_email_failure(self, sample_membership):
        """Test welcome email sending failure"""
        with patch('src.services.email_service.SendGridAPIClient') as mock:
            mock_client = MagicMock()
            mock_response = MagicMock()
            mock_response.status_code = 500
            mock_client.send.return_value = mock_response
            mock.return_value = mock_client
            
            success, message_id = await email_service.send_welcome_email(
                first_name=sample_membership.first_name,
                last_name=sample_membership.last_name,
                email=sample_membership.email,
                membership_type=sample_membership.membership_type,
                start_date=sample_membership.start_date.strftime("%d.%m.%Y"),
                monthly_price=sample_membership.monthly_price
            )
            
            assert success is False
            assert message_id is None


class TestLeadResponseEmailWorkflow:
    """Tests for lead response email workflow"""
    
    @pytest.mark.asyncio
    async def test_send_lead_response_email(self, mock_sendgrid, sample_lead):
        """Test lead response email sending"""
        success, message_id = await email_service.send_lead_response_email(
            first_name=sample_lead.first_name,
            last_name=sample_lead.last_name,
            email=sample_lead.email,
            interested_in=sample_lead.interested_in,
            phone=sample_lead.phone
        )
        
        assert success is True
        assert message_id == "test-message-id-123"
        mock_sendgrid.send.assert_called_once()


class TestTrialWorkflows:
    """Tests for trial class workflows"""
    
    @pytest.mark.asyncio
    async def test_send_trial_confirmation(self, mock_sendgrid, sample_booking):
        """Test trial confirmation email"""
        success, message_id = await email_service.send_trial_confirmation_email(
            first_name=sample_booking.first_name,
            last_name=sample_booking.last_name,
            email=sample_booking.email,
            class_name=sample_booking.class_name,
            class_date=sample_booking.class_date.strftime("%Y-%m-%d"),
            class_time=sample_booking.class_date.strftime("%H:%M"),
            coach_name=sample_booking.coach_name,
            booking_id=sample_booking.booking_id
        )
        
        assert success is True
        assert message_id == "test-message-id-123"
    
    @pytest.mark.asyncio
    async def test_send_trial_reminder(self, mock_sendgrid, sample_booking):
        """Test trial reminder email"""
        success, message_id = await email_service.send_trial_reminder_email(
            first_name=sample_booking.first_name,
            last_name=sample_booking.last_name,
            email=sample_booking.email,
            class_name=sample_booking.class_name,
            class_date=sample_booking.class_date.strftime("%Y-%m-%d"),
            class_time=sample_booking.class_date.strftime("%H:%M"),
            coach_name=sample_booking.coach_name
        )
        
        assert success is True
        assert message_id == "test-message-id-123"
    
    @pytest.mark.asyncio
    async def test_send_trial_followup(self, mock_sendgrid, sample_booking):
        """Test trial followup email"""
        success, message_id = await email_service.send_trial_followup_email(
            first_name=sample_booking.first_name,
            last_name=sample_booking.last_name,
            email=sample_booking.email,
            booking_id=sample_booking.booking_id,
            class_name=sample_booking.class_name
        )
        
        assert success is True
        assert message_id == "test-message-id-123"


class TestLeadNurturingWorkflows:
    """Tests for lead nurturing sequence workflows"""
    
    @pytest.mark.asyncio
    async def test_send_nurturing_2_email(self, mock_sendgrid, sample_lead):
        """Test nurturing email (Day 2)"""
        success, message_id = await email_service.send_lead_nurturing_2_email(
            first_name=sample_lead.first_name,
            last_name=sample_lead.last_name,
            email=sample_lead.email,
            lead_id=sample_lead.lead_id,
            interested_in=sample_lead.interested_in
        )
        
        assert success is True
        assert message_id == "test-message-id-123"
    
    @pytest.mark.asyncio
    async def test_send_nurturing_5_email(self, mock_sendgrid, sample_lead):
        """Test nurturing email (Day 5)"""
        success, message_id = await email_service.send_lead_nurturing_5_email(
            first_name=sample_lead.first_name,
            last_name=sample_lead.last_name,
            email=sample_lead.email,
            lead_id=sample_lead.lead_id,
            interested_in=sample_lead.interested_in
        )
        
        assert success is True
        assert message_id == "test-message-id-123"
    
    @pytest.mark.asyncio
    async def test_send_nurturing_7_email(self, mock_sendgrid, sample_lead):
        """Test nurturing email (Day 7)"""
        success, message_id = await email_service.send_lead_nurturing_7_email(
            first_name=sample_lead.first_name,
            last_name=sample_lead.last_name,
            email=sample_lead.email,
            lead_id=sample_lead.lead_id,
            interested_in=sample_lead.interested_in
        )
        
        assert success is True
        assert message_id == "test-message-id-123"


class TestAutomationService:
    """Tests for automation service workflows"""
    
    @pytest.mark.asyncio
    async def test_process_new_membership(self, sample_membership, test_db):
        """Test processing new membership"""
        with patch('src.services.database_service.database_service.create_member') as mock_create, \
             patch('src.services.scheduler_service.scheduler_service.schedule_welcome_email') as mock_schedule:
            
            mock_create.return_value = None
            mock_schedule.return_value = "job_123"
            
            await automation_service.process_new_membership(sample_membership)
            
            mock_create.assert_called_once()
            # Welcome email should be scheduled if enabled
            # (check depends on settings.enable_welcome_email)
    
    @pytest.mark.asyncio
    async def test_process_new_lead(self, sample_lead, test_db):
        """Test processing new lead"""
        with patch('src.services.database_service.database_service.create_lead') as mock_create, \
             patch('src.services.scheduler_service.scheduler_service.schedule_lead_response_email') as mock_response, \
             patch('src.services.scheduler_service.scheduler_service.schedule_nurturing_sequence') as mock_nurturing:
            
            mock_create.return_value = None
            mock_response.return_value = "job_response_123"
            mock_nurturing.return_value = ["job_2", "job_5", "job_7"]
            
            await automation_service.process_new_lead(sample_lead)
            
            mock_create.assert_called_once()
            mock_response.assert_called_once()
            # Nurturing sequence should be scheduled if enabled


class TestEmailRetryLogic:
    """Tests for email retry logic"""
    
    @pytest.mark.asyncio
    async def test_email_retry_on_failure(self, sample_membership):
        """Test that email retries on failure"""
        call_count = 0
        
        def mock_send(*args, **kwargs):
            nonlocal call_count
            call_count += 1
            if call_count < 3:
                mock_response = MagicMock()
                mock_response.status_code = 500
                return mock_response
            else:
                mock_response = MagicMock()
                mock_response.status_code = 200
                mock_response.headers = {'X-Message-Id': 'retry-success-123'}
                return mock_response
        
        with patch('src.services.email_service.SendGridAPIClient') as mock:
            mock_client = MagicMock()
            mock_client.send.side_effect = mock_send
            mock.return_value = mock_client
            
            success, message_id = await email_service.send_welcome_email(
                first_name=sample_membership.first_name,
                last_name=sample_membership.last_name,
                email=sample_membership.email,
                membership_type=sample_membership.membership_type,
                start_date=sample_membership.start_date.strftime("%d.%m.%Y"),
                monthly_price=sample_membership.monthly_price
            )
            
            # Should retry and eventually succeed
            assert call_count == 3
            assert success is True

