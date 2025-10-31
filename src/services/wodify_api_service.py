"""
Wodify API Service - Handles all communication with Wodify API
"""

import httpx
import logging
from typing import List, Dict, Optional, Any
from datetime import datetime, date, timedelta
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
    
    async def _make_request(
        self, 
        method: str, 
        endpoint: str, 
        params: Optional[Dict] = None,
        data: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """Make HTTP request to Wodify API"""
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


# Global service instance
wodify_api_service = WodifyAPIService()

