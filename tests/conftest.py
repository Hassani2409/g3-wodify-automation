"""
Test configuration and fixtures
"""

import pytest
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Set test environment
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["SENDGRID_API_KEY"] = "test_api_key"
os.environ["WODIFY_WEBHOOK_SECRET"] = "test_secret"
os.environ["ENABLE_WELCOME_EMAIL"] = "False"
os.environ["ENABLE_TEAM_NOTIFICATION"] = "False"
os.environ["ENABLE_LEAD_NURTURING"] = "False"

from src.models.database import Base


@pytest.fixture(scope="function")
def test_db():
    """Create a test database"""
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()
    
    yield session
    
    session.close()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def sample_membership_data():
    """Sample membership data for testing"""
    from src.models.wodify import WodifyMembershipCreated, MembershipStatus
    from datetime import datetime
    
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
def sample_lead_data():
    """Sample lead data for testing"""
    from src.models.wodify import WodifyLeadCreated, LeadStatus
    from datetime import datetime
    
    return WodifyLeadCreated(
        lead_id="lead_123",
        first_name="Anna",
        last_name="Schmidt",
        email="anna@example.com",
        phone="+49 987 654321",
        lead_status=LeadStatus.NEW,
        interested_in="CrossFit Fundamentals"
    )

