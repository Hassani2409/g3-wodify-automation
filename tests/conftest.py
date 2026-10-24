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

from src.models.database import Base  # noqa: E402


@pytest.fixture(autouse=True)
def isolated_database(tmp_path, monkeypatch):
    """Use one isolated file database across service instances and request threads."""
    from config.settings import settings
    from src.services.database_service import database_service

    url = f"sqlite:///{tmp_path / 'application.db'}"
    monkeypatch.setattr(settings, "database_url", url)
    engine = create_engine(url, connect_args={"check_same_thread": False})
    Base.metadata.create_all(engine)
    monkeypatch.setattr(database_service, "engine", engine)
    monkeypatch.setattr(database_service, "SessionLocal", sessionmaker(bind=engine))
    yield
    engine.dispose()


@pytest.fixture
def test_db(isolated_database):
    from src.services.database_service import database_service

    with database_service.get_session() as session:
        yield session


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
        is_first_membership=True,
    )


@pytest.fixture
def sample_lead_data():
    """Sample lead data for testing"""
    from src.models.wodify import WodifyLeadCreated, LeadStatus

    return WodifyLeadCreated(
        lead_id="lead_123",
        first_name="Anna",
        last_name="Schmidt",
        email="anna@example.com",
        phone="+49 987 654321",
        lead_status=LeadStatus.NEW,
        interested_in="CrossFit Fundamentals",
    )
