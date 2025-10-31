"""
Tests for webhook endpoints
"""

import pytest
from fastapi.testclient import TestClient
from datetime import datetime
import json
import hmac
import hashlib

from main import app
from config.settings import settings


client = TestClient(app)


def create_webhook_signature(payload: dict) -> str:
    """Create a valid webhook signature for testing"""
    payload_str = json.dumps(payload)
    signature = hmac.new(
        settings.wodify_webhook_secret.encode(),
        payload_str.encode(),
        hashlib.sha256
    ).hexdigest()
    return signature


def test_health_check():
    """Test health check endpoint"""
    response = client.get("/webhooks/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "timestamp" in data


def test_membership_created_webhook():
    """Test membership created webhook"""
    payload = {
        "client_id": "test_123",
        "first_name": "Max",
        "last_name": "Mustermann",
        "email": "max@example.com",
        "phone": "+49 123 456789",
        "membership_id": "mem_123",
        "membership_type": "Regular Unlimited",
        "membership_status": "Active",
        "monthly_price": 129.00,
        "start_date": datetime.now().isoformat(),
        "is_first_membership": True
    }
    
    signature = create_webhook_signature(payload)
    
    response = client.post(
        "/webhooks/wodify/membership-created",
        json=payload,
        headers={"X-Wodify-Signature": signature}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["client_id"] == "test_123"


def test_membership_created_webhook_invalid_signature():
    """Test membership created webhook with invalid signature"""
    payload = {
        "client_id": "test_123",
        "first_name": "Max",
        "last_name": "Mustermann",
        "email": "max@example.com",
        "phone": "+49 123 456789",
        "membership_id": "mem_123",
        "membership_type": "Regular Unlimited",
        "membership_status": "Active",
        "monthly_price": 129.00,
        "start_date": datetime.now().isoformat(),
        "is_first_membership": True
    }
    
    response = client.post(
        "/webhooks/wodify/membership-created",
        json=payload,
        headers={"X-Wodify-Signature": "invalid_signature"}
    )
    
    assert response.status_code == 401


def test_lead_created_webhook():
    """Test lead created webhook"""
    payload = {
        "lead_id": "lead_123",
        "first_name": "Anna",
        "last_name": "Schmidt",
        "email": "anna@example.com",
        "phone": "+49 987 654321",
        "lead_status": "New",
        "interested_in": "CrossFit Fundamentals"
    }
    
    signature = create_webhook_signature(payload)
    
    response = client.post(
        "/webhooks/wodify/lead-created",
        json=payload,
        headers={"X-Wodify-Signature": signature}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["lead_id"] == "lead_123"


def test_generic_webhook():
    """Test generic webhook endpoint"""
    payload = {
        "event_type": "test_event",
        "event_id": "evt_123",
        "tenant": "g3crossfit",
        "timestamp": datetime.now().isoformat(),
        "data": {"test": "data"}
    }
    
    response = client.post(
        "/webhooks/wodify/generic",
        json=payload
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["event_type"] == "test_event"


def test_root_endpoint():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "running"
    assert "version" in data

