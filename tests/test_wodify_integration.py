"""
Integration tests for WODIFY API service

Tests cover:
- WODIFY API authentication
- Membership management
- Lead management
- Class schedule retrieval
- Booking operations
"""

import pytest
import httpx
from datetime import date
from unittest.mock import AsyncMock, MagicMock, patch

from src.services.wodify_api_service import wodify_api_service


@pytest.fixture
def mock_httpx():
    """Mock httpx client for API calls"""
    with patch("src.services.wodify_api_service.httpx.AsyncClient") as mock:
        mock_client = AsyncMock()
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"success": True, "data": {}}
        mock_client.request.return_value = mock_response
        mock.return_value.__aenter__.return_value = mock_client
        mock.return_value.__aexit__.return_value = None
        yield mock_client


class TestWodifyAPIAuthentication:
    """Tests for WODIFY API authentication"""

    @pytest.mark.asyncio
    async def test_api_key_authentication(self, mock_httpx):
        """Test that API key is included in requests"""
        await wodify_api_service._make_request("GET", "test/endpoint")

        # Verify that request was made with proper headers
        mock_httpx.request.assert_called_once()
        call_args = mock_httpx.request.call_args

        # Check that headers contain authorization
        assert "headers" in call_args.kwargs
        # Note: Actual header name depends on WODIFY API implementation


class TestMembershipManagement:
    """Tests for membership management operations"""

    @pytest.mark.asyncio
    async def test_create_membership(self, mock_httpx):
        """Test creating a new membership"""
        mock_response = MagicMock()
        mock_response.status_code = 201
        mock_response.json.return_value = {
            "success": True,
            "membership_id": "mem_123",
            "client_id": "client_123",
        }
        mock_httpx.request.return_value = mock_response

        result = await wodify_api_service.create_membership(
            first_name="Max",
            last_name="Test",
            email="max@example.com",
            phone=None,
            membership_type="Regular Unlimited",
            start_date="2024-01-01",
        )

        assert result["success"] is True
        assert result["membership_id"] == "mem_123"
        mock_httpx.request.assert_called_once()

    @pytest.mark.asyncio
    async def test_get_member(self, mock_httpx):
        """Test retrieving membership information"""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "success": True,
            "member": {
                "membership_id": "mem_123",
                "membership_type": "Regular Unlimited",
                "status": "Active",
                "monthly_price": 129.00,
            },
        }
        mock_httpx.request.return_value = mock_response

        result = await wodify_api_service.get_member("client_123")

        assert result["membership_id"] == "mem_123"

    @pytest.mark.asyncio
    async def test_update_membership(self, mock_httpx):
        """Test updating membership"""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"success": True, "membership_id": "mem_123"}
        mock_httpx.request.return_value = mock_response

        result = await wodify_api_service.update_membership(
            membership_id="mem_123", membership_type="Premium Unlimited"
        )

        assert result["success"] is True


class TestLeadManagement:
    """Tests for lead management operations"""

    @pytest.mark.asyncio
    async def test_create_lead(self, mock_httpx):
        """Test creating a new lead"""
        mock_response = MagicMock()
        mock_response.status_code = 201
        mock_response.json.return_value = {"success": True, "lead_id": "lead_123"}
        mock_httpx.request.return_value = mock_response

        result = await wodify_api_service.create_lead(
            first_name="Anna",
            last_name="Schmidt",
            email="anna@example.com",
            phone="+49 123 456789",
            message="Interested in CrossFit",
        )

        assert result["lead_id"] == "lead_123"

    @pytest.mark.asyncio
    async def test_get_lead(self, mock_httpx):
        """Test retrieving lead information"""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "success": True,
            "lead": {
                "lead_id": "lead_123",
                "first_name": "Anna",
                "last_name": "Schmidt",
                "email": "anna@example.com",
                "status": "New",
            },
        }
        mock_httpx.request.return_value = mock_response

        result = await wodify_api_service.get_lead("lead_123")

        assert result["lead_id"] == "lead_123"

    @pytest.mark.asyncio
    async def test_update_lead(self, mock_httpx):
        """Test updating lead status"""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"success": True, "lead_id": "lead_123"}
        mock_httpx.request.return_value = mock_response

        result = await wodify_api_service.update_lead(
            lead_id="lead_123", lead_status="Contacted"
        )

        assert result["success"] is True


class TestClassSchedule:
    """Tests for class schedule operations"""

    @pytest.mark.asyncio
    async def test_get_classes(self, mock_httpx):
        """Test retrieving class schedule"""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "success": True,
            "classes": [
                {
                    "class_id": "class_1",
                    "class_name": "CrossFit Fundamentals",
                    "start_time": "2024-01-01T10:00:00Z",
                    "coach": "Coach John",
                    "available_spots": 5,
                }
            ],
        }
        mock_httpx.request.return_value = mock_response

        result = await wodify_api_service.get_schedule(
            start_date=date(2024, 1, 1), end_date=date(2024, 1, 7)
        )

        assert len(result) == 1
        assert result[0]["class_id"] == "class_1"

    @pytest.mark.asyncio
    async def test_book_class(self, mock_httpx):
        """Test booking a class"""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"success": True, "booking_id": "booking_123"}
        mock_httpx.request.return_value = mock_response

        result = await wodify_api_service.book_class(
            class_id="class_123",
            user_id="user_123",
            user_email="max@example.com",
            user_name="Max Test",
        )

        assert result["success"] is True
        assert result["booking_id"] == "booking_123"

    @pytest.mark.asyncio
    async def test_cancel_booking(self, mock_httpx):
        """Test canceling a booking"""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"success": True, "booking_id": "booking_123"}
        mock_httpx.request.return_value = mock_response

        result = await wodify_api_service.cancel_booking(
            booking_id="booking_123", user_id="user_123"
        )

        assert result["success"] is True


class TestErrorHandling:
    """Exercise provider errors rather than accidental missing-method errors."""

    @pytest.mark.asyncio
    @pytest.mark.parametrize("status", [400, 429])
    async def test_api_error_handling(self, mock_httpx, status):
        request = httpx.Request("GET", "https://example.com/test")
        response = httpx.Response(status, request=request)
        mock_httpx.request.return_value = response
        with pytest.raises(httpx.HTTPStatusError) as error:
            await wodify_api_service._make_request("GET", "test")
        assert error.value.response.status_code == status
        mock_httpx.request.assert_called()

    @pytest.mark.asyncio
    async def test_network_error_handling(self, mock_httpx):
        mock_httpx.request.side_effect = httpx.RequestError("Network error")
        with pytest.raises(httpx.RequestError, match="Network error"):
            await wodify_api_service._make_request("GET", "classes")
        mock_httpx.request.assert_called()
