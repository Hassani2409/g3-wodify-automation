"""
Tests for admin endpoints
"""

import pytest
from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def test_admin_dashboard():
    """Test admin dashboard endpoint"""
    response = client.get("/admin/")
    assert response.status_code == 200
    assert "G3 CrossFit" in response.text
    assert "Admin Dashboard" in response.text


def test_admin_stats():
    """Test admin stats endpoint"""
    response = client.get("/admin/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_members" in data
    assert "total_leads" in data
    assert "total_emails" in data
    assert "total_webhooks" in data
    assert "timestamp" in data


def test_test_membership_webhook():
    """Test sending a test membership webhook"""
    response = client.post("/admin/test-webhook/membership")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "client_id" in data


def test_test_lead_webhook():
    """Test sending a test lead webhook"""
    response = client.post("/admin/test-webhook/lead")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "lead_id" in data

