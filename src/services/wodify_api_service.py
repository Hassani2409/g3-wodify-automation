"""
Wodify API Service - Handles all communication with Wodify API
"""

import httpx
import logging
from typing import List, Dict, Optional, Any
from datetime import datetime, date, timedelta
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from config.settings import settings

logger = logging.getLogger(__name__)


class WodifyAPIService:
    """Service for interacting with Wodify API"""
    
    def __init__(self):
        self.api_key = settings.wodify_api_key
        self.api_url = settings.wodify_api_url
        self.location_id = settings.wodify_location_id
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((httpx.HTTPStatusError, httpx.RequestError)),
        reraise=True
    )
    async def _make_request(
        self, 
        method: str, 
        endpoint: str, 
        params: Optional[Dict] = None,
        data: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """
        Make HTTP request to Wodify API with automatic retry logic
        
        Args:
            method: HTTP method (GET, POST, DELETE, etc.)
            endpoint: API endpoint path
            params: Query parameters
            data: Request body data
            
        Returns:
            Response JSON data
            
        Raises:
            httpx.HTTPStatusError: For HTTP errors (after retries)
            httpx.RequestError: For request errors (after retries)
        """
        url = f"{self.api_url}/{endpoint}"
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.request(
                    method=method,
                    url=url,
                    headers=self.headers,
                    params=params,
                    json=data
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"Wodify API HTTP error: {e.response.status_code} - {e.response.text}")
            raise
        except httpx.RequestError as e:
            logger.error(f"Wodify API request error: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Wodify API unexpected error: {str(e)}")
            raise
    
    async def get_schedule(
        self, 
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        class_type: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Get class schedule from Wodify
        
        Args:
            start_date: Start date for schedule (default: today)
            end_date: End date for schedule (default: 7 days from start)
            class_type: Filter by class type (optional)
        
        Returns:
            List of class objects
        """
        if not start_date:
            start_date = date.today()
        if not end_date:
            end_date = start_date + timedelta(days=7)
        
        params = {
            "location_id": self.location_id,
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat()
        }
        
        if class_type:
            params["class_type"] = class_type
        
        try:
            response = await self._make_request("GET", "classes", params=params)
            return response.get("classes", [])
        except Exception as e:
            logger.error(f"Failed to fetch schedule: {str(e)}")
            # Return empty list on error to prevent frontend crashes
            return []
    
    async def get_class_details(self, class_id: str) -> Optional[Dict[str, Any]]:
        """
        Get detailed information about a specific class
        
        Args:
            class_id: Wodify class ID
        
        Returns:
            Class details or None if not found
        """
        try:
            response = await self._make_request("GET", f"classes/{class_id}")
            return response.get("class", None)
        except Exception as e:
            logger.error(f"Failed to fetch class details for {class_id}: {str(e)}")
            return None
    
    async def book_class(
        self, 
        class_id: str, 
        user_id: str,
        user_email: str,
        user_name: str
    ) -> Dict[str, Any]:
        """
        Book a class for a user
        
        Args:
            class_id: Wodify class ID
            user_id: User ID
            user_email: User email
            user_name: User full name
        
        Returns:
            Booking confirmation
        """
        data = {
            "class_id": class_id,
            "user_id": user_id,
            "user_email": user_email,
            "user_name": user_name,
            "location_id": self.location_id
        }
        
        try:
            response = await self._make_request("POST", "bookings", data=data)
            logger.info(f"Class booked successfully: {class_id} for user {user_email}")
            return response
        except Exception as e:
            logger.error(f"Failed to book class {class_id} for {user_email}: {str(e)}")
            raise
    
    async def cancel_booking(
        self, 
        booking_id: str,
        user_id: str
    ) -> Dict[str, Any]:
        """
        Cancel a class booking
        
        Args:
            booking_id: Booking ID
            user_id: User ID
        
        Returns:
            Cancellation confirmation
        """
        data = {
            "booking_id": booking_id,
            "user_id": user_id
        }
        
        try:
            response = await self._make_request("DELETE", f"bookings/{booking_id}", data=data)
            logger.info(f"Booking cancelled successfully: {booking_id}")
            return response
        except Exception as e:
            logger.error(f"Failed to cancel booking {booking_id}: {str(e)}")
            raise
    
    async def join_waitlist(
        self, 
        class_id: str,
        user_id: str,
        user_email: str,
        user_name: str
    ) -> Dict[str, Any]:
        """
        Add user to class waitlist
        
        Args:
            class_id: Wodify class ID
            user_id: User ID
            user_email: User email
            user_name: User full name
        
        Returns:
            Waitlist confirmation
        """
        data = {
            "class_id": class_id,
            "user_id": user_id,
            "user_email": user_email,
            "user_name": user_name,
            "location_id": self.location_id
        }
        
        try:
            response = await self._make_request("POST", "waitlist", data=data)
            logger.info(f"User added to waitlist: {class_id} for {user_email}")
            return response
        except Exception as e:
            logger.error(f"Failed to add to waitlist {class_id} for {user_email}: {str(e)}")
            raise
    
    async def get_user_bookings(self, user_id: str) -> List[Dict[str, Any]]:
        """
        Get all bookings for a user
        
        Args:
            user_id: User ID
        
        Returns:
            List of user bookings
        """
        params = {
            "user_id": user_id,
            "location_id": self.location_id
        }
        
        try:
            response = await self._make_request("GET", "bookings", params=params)
            return response.get("bookings", [])
        except Exception as e:
            logger.error(f"Failed to fetch bookings for user {user_id}: {str(e)}")
            return []
    
    async def get_class_types(self) -> List[Dict[str, Any]]:
        """
        Get all available class types
        
        Returns:
            List of class types
        """
        params = {
            "location_id": self.location_id
        }
        
        try:
            response = await self._make_request("GET", "class-types", params=params)
            return response.get("class_types", [])
        except Exception as e:
            logger.error(f"Failed to fetch class types: {str(e)}")
            return []
    
    async def get_trainers(self) -> List[Dict[str, Any]]:
        """
        Get all trainers/coaches
        
        Returns:
            List of trainers
        """
        params = {
            "location_id": self.location_id
        }
        
        try:
            response = await self._make_request("GET", "trainers", params=params)
            return response.get("trainers", [])
        except Exception as e:
            logger.error(f"Failed to fetch trainers: {str(e)}")
            return []
    
    async def create_membership(
        self,
        first_name: str,
        last_name: str,
        email: str,
        phone: Optional[str],
        membership_type: str,
        start_date: str,
        payment_method: str = "stripe"
    ) -> Dict[str, Any]:
        """
        Create a new membership in WODIFY
        
        Args:
            first_name: Member's first name
            last_name: Member's last name
            email: Member's email address
            phone: Member's phone number (optional)
            membership_type: Type of membership
            start_date: Membership start date (YYYY-MM-DD)
            payment_method: Payment method (stripe, cash, etc.)
        
        Returns:
            Membership creation response
        """
        data = {
            "location_id": self.location_id,
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "phone": phone,
            "membership_type": membership_type,
            "start_date": start_date,
            "payment_method": payment_method
        }
        
        try:
            response = await self._make_request("POST", "memberships", data=data)
            logger.info(f"Membership created successfully for {email}")
            return response
        except Exception as e:
            logger.error(f"Failed to create membership for {email}: {str(e)}")
            raise
    
    async def create_lead(
        self,
        first_name: str,
        last_name: str,
        email: str,
        phone: Optional[str],
        message: Optional[str] = None,
        interested_in: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create a new lead in WODIFY
        
        Args:
            first_name: Lead's first name
            last_name: Lead's last name
            email: Lead's email address
            phone: Lead's phone number (optional)
            message: Message from the lead (optional)
            interested_in: What they're interested in (optional)
        
        Returns:
            Lead creation response
        """
        data = {
            "location_id": self.location_id,
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "phone": phone,
            "message": message,
            "interested_in": interested_in
        }
        
        try:
            response = await self._make_request("POST", "leads", data=data)
            logger.info(f"Lead created successfully for {email}")
            return response
        except Exception as e:
            logger.error(f"Failed to create lead for {email}: {str(e)}")
            raise
    
    async def get_membership_packages(self) -> List[Dict[str, Any]]:
        """
        Get all available membership packages from Sales Portal
        
        Returns:
            List of membership packages
        """
        params = {
            "location_id": self.location_id
        }
        
        try:
            response = await self._make_request("GET", "membership-packages", params=params)
            return response.get("packages", [])
        except Exception as e:
            logger.error(f"Failed to fetch membership packages: {str(e)}")
            return []
    
    async def get_member(self, client_id: str) -> Optional[Dict[str, Any]]:
        """
        Get member details from WODIFY
        
        Args:
            client_id: WODIFY Client ID
        
        Returns:
            Member details or None if not found
        """
        params = {
            "client_id": client_id,
            "location_id": self.location_id
        }
        
        try:
            response = await self._make_request("GET", f"members/{client_id}", params=params)
            return response.get("member", None)
        except Exception as e:
            logger.error(f"Failed to fetch member {client_id}: {str(e)}")
            return None
    
    async def update_membership(
        self,
        membership_id: str,
        membership_type: Optional[str] = None,
        membership_status: Optional[str] = None,
        monthly_price: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Update membership in WODIFY
        
        Args:
            membership_id: WODIFY Membership ID
            membership_type: New membership type (optional)
            membership_status: New status (optional)
            monthly_price: New monthly price (optional)
        
        Returns:
            Update confirmation
        """
        data = {
            "membership_id": membership_id,
            "location_id": self.location_id
        }
        
        if membership_type:
            data["membership_type"] = membership_type
        if membership_status:
            data["membership_status"] = membership_status
        if monthly_price:
            data["monthly_price"] = monthly_price
        
        try:
            response = await self._make_request("PATCH", f"memberships/{membership_id}", data=data)
            logger.info(f"Membership updated successfully: {membership_id}")
            return response
        except Exception as e:
            logger.error(f"Failed to update membership {membership_id}: {str(e)}")
            raise
    
    async def cancel_membership(
        self,
        membership_id: str,
        cancellation_reason: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Cancel membership in WODIFY
        
        Args:
            membership_id: WODIFY Membership ID
            cancellation_reason: Reason for cancellation (optional)
        
        Returns:
            Cancellation confirmation
        """
        data = {
            "membership_id": membership_id,
            "location_id": self.location_id
        }
        
        if cancellation_reason:
            data["cancellation_reason"] = cancellation_reason
        
        try:
            response = await self._make_request("POST", f"memberships/{membership_id}/cancel", data=data)
            logger.info(f"Membership cancelled successfully: {membership_id}")
            return response
        except Exception as e:
            logger.error(f"Failed to cancel membership {membership_id}: {str(e)}")
            raise
    
    async def get_lead(self, lead_id: str) -> Optional[Dict[str, Any]]:
        """
        Get lead details from WODIFY
        
        Args:
            lead_id: WODIFY Lead ID
        
        Returns:
            Lead details or None if not found
        """
        params = {
            "lead_id": lead_id,
            "location_id": self.location_id
        }
        
        try:
            response = await self._make_request("GET", f"leads/{lead_id}", params=params)
            return response.get("lead", None)
        except Exception as e:
            logger.error(f"Failed to fetch lead {lead_id}: {str(e)}")
            return None
    
    async def update_lead(
        self,
        lead_id: str,
        lead_status: Optional[str] = None,
        notes: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Update lead in WODIFY
        
        Args:
            lead_id: WODIFY Lead ID
            lead_status: New lead status (optional)
            notes: Additional notes (optional)
        
        Returns:
            Update confirmation
        """
        data = {
            "lead_id": lead_id,
            "location_id": self.location_id
        }
        
        if lead_status:
            data["lead_status"] = lead_status
        if notes:
            data["notes"] = notes
        
        try:
            response = await self._make_request("PATCH", f"leads/{lead_id}", data=data)
            logger.info(f"Lead updated successfully: {lead_id}")
            return response
        except Exception as e:
            logger.error(f"Failed to update lead {lead_id}: {str(e)}")
            raise
    
    async def convert_lead_to_member(
        self,
        lead_id: str,
        membership_type: str,
        start_date: str,
        payment_method: str = "stripe"
    ) -> Dict[str, Any]:
        """
        Convert a lead to a member in WODIFY
        
        Args:
            lead_id: WODIFY Lead ID
            membership_type: Type of membership
            start_date: Membership start date (YYYY-MM-DD)
            payment_method: Payment method (stripe, cash, etc.)
        
        Returns:
            Membership creation response
        """
        data = {
            "lead_id": lead_id,
            "membership_type": membership_type,
            "start_date": start_date,
            "payment_method": payment_method,
            "location_id": self.location_id
        }
        
        try:
            response = await self._make_request("POST", f"leads/{lead_id}/convert", data=data)
            logger.info(f"Lead converted to member successfully: {lead_id}")
            return response
        except Exception as e:
            logger.error(f"Failed to convert lead {lead_id} to member: {str(e)}")
            raise
    
    async def get_all_members(
        self,
        status: Optional[str] = None,
        limit: int = 100,
        offset: int = 0
    ) -> List[Dict[str, Any]]:
        """
        Get all members from WODIFY
        
        Args:
            status: Filter by membership status (optional)
            limit: Maximum number of results (default: 100)
            offset: Offset for pagination (default: 0)
        
        Returns:
            List of members
        """
        params = {
            "location_id": self.location_id,
            "limit": limit,
            "offset": offset
        }
        
        if status:
            params["status"] = status
        
        try:
            response = await self._make_request("GET", "members", params=params)
            return response.get("members", [])
        except Exception as e:
            logger.error(f"Failed to fetch members: {str(e)}")
            return []
    
    async def get_all_leads(
        self,
        status: Optional[str] = None,
        limit: int = 100,
        offset: int = 0
    ) -> List[Dict[str, Any]]:
        """
        Get all leads from WODIFY
        
        Args:
            status: Filter by lead status (optional)
            limit: Maximum number of results (default: 100)
            offset: Offset for pagination (default: 0)
        
        Returns:
            List of leads
        """
        params = {
            "location_id": self.location_id,
            "limit": limit,
            "offset": offset
        }
        
        if status:
            params["status"] = status
        
        try:
            response = await self._make_request("GET", "leads", params=params)
            return response.get("leads", [])
        except Exception as e:
            logger.error(f"Failed to fetch leads: {str(e)}")
            return []
    
    async def check_api_health(self) -> Dict[str, Any]:
        """
        Check WODIFY API health and connectivity
        
        Returns:
            Health status information
        """
        health_status = {
            "api_configured": bool(self.api_key and self.location_id),
            "api_url": self.api_url,
            "location_id": self.location_id,
            "last_check": datetime.utcnow().isoformat(),
            "status": "unknown"
        }
        
        if not health_status["api_configured"]:
            health_status["status"] = "not_configured"
            health_status["error"] = "API key or location ID not configured"
            return health_status
        
        try:
            # Try a simple API call to check connectivity
            response = await self._make_request("GET", "health", params={"location_id": self.location_id})
            health_status["status"] = "healthy"
            health_status["response"] = response
        except httpx.HTTPStatusError as e:
            health_status["status"] = "error"
            health_status["error"] = f"HTTP {e.response.status_code}: {e.response.text}"
        except httpx.RequestError as e:
            health_status["status"] = "connection_error"
            health_status["error"] = str(e)
        except Exception as e:
            health_status["status"] = "unknown_error"
            health_status["error"] = str(e)
        
        return health_status


# Global service instance
wodify_api_service = WodifyAPIService()

