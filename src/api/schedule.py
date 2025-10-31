"""
Schedule API Endpoints - Provides schedule data to Next.js frontend
"""

from fastapi import APIRouter, HTTPException, Query, Depends
from fastapi.responses import JSONResponse
from typing import List, Optional
from datetime import date, datetime, timedelta
from pydantic import BaseModel, EmailStr
import logging

from src.services.wodify_api_service import wodify_api_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/schedule", tags=["schedule"])


# Pydantic Models for Request/Response
class BookingRequest(BaseModel):
    """Request model for booking a class"""
    class_id: str
    user_id: str
    user_email: EmailStr
    user_name: str


class WaitlistRequest(BaseModel):
    """Request model for joining waitlist"""
    class_id: str
    user_id: str
    user_email: EmailStr
    user_name: str


class CancelBookingRequest(BaseModel):
    """Request model for cancelling a booking"""
    booking_id: str
    user_id: str


# API Endpoints
@router.get("/classes")
async def get_classes(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    class_type: Optional[str] = Query(None, description="Filter by class type"),
    day: Optional[str] = Query(None, description="Filter by day (Monday, Tuesday, etc.)"),
):
    """
    Get class schedule
    
    Query Parameters:
    - start_date: Start date in YYYY-MM-DD format (default: today)
    - end_date: End date in YYYY-MM-DD format (default: 7 days from start)
    - class_type: Filter by class type (optional)
    - day: Filter by day of week (optional)
    
    Returns:
    - List of classes with availability
    """
    try:
        # Parse dates
        start = date.fromisoformat(start_date) if start_date else date.today()
        end = date.fromisoformat(end_date) if end_date else start + timedelta(days=7)
        
        # Fetch classes from Wodify API
        classes = await wodify_api_service.get_schedule(
            start_date=start,
            end_date=end,
            class_type=class_type
        )
        
        # Filter by day if specified
        if day and classes:
            classes = [c for c in classes if c.get("day") == day]
        
        # Transform data for frontend
        transformed_classes = []
        for cls in classes:
            transformed_classes.append({
                "id": cls.get("id"),
                "name": cls.get("name"),
                "type": cls.get("type", "").lower(),
                "trainer": cls.get("trainer", {}).get("name", "TBD"),
                "day": cls.get("day"),
                "startTime": cls.get("start_time"),
                "endTime": cls.get("end_time"),
                "level": cls.get("level", "Alle Level"),
                "spotsTotal": cls.get("capacity", 12),
                "spotsBooked": cls.get("booked", 0),
                "description": cls.get("description", ""),
                "price": cls.get("price", "Mitgliedschaft"),
                "location": cls.get("location", "G3 CrossFit Berlin")
            })
        
        return JSONResponse(content={
            "success": True,
            "classes": transformed_classes,
            "count": len(transformed_classes)
        })
        
    except ValueError as e:
        logger.error(f"Invalid date format: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    except Exception as e:
        logger.error(f"Error fetching classes: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch classes")


@router.get("/classes/{class_id}")
async def get_class_details(class_id: str):
    """
    Get detailed information about a specific class
    
    Path Parameters:
    - class_id: Wodify class ID
    
    Returns:
    - Detailed class information
    """
    try:
        class_details = await wodify_api_service.get_class_details(class_id)
        
        if not class_details:
            raise HTTPException(status_code=404, detail="Class not found")
        
        return JSONResponse(content={
            "success": True,
            "class": class_details
        })
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching class details: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch class details")


@router.post("/book")
async def book_class(booking: BookingRequest):
    """
    Book a class
    
    Request Body:
    - class_id: Wodify class ID
    - user_id: User ID
    - user_email: User email
    - user_name: User full name
    
    Returns:
    - Booking confirmation
    """
    try:
        result = await wodify_api_service.book_class(
            class_id=booking.class_id,
            user_id=booking.user_id,
            user_email=booking.user_email,
            user_name=booking.user_name
        )
        
        return JSONResponse(content={
            "success": True,
            "message": "Class booked successfully",
            "booking": result
        })
        
    except Exception as e:
        logger.error(f"Error booking class: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to book class: {str(e)}")


@router.post("/waitlist")
async def join_waitlist(request: WaitlistRequest):
    """
    Join class waitlist
    
    Request Body:
    - class_id: Wodify class ID
    - user_id: User ID
    - user_email: User email
    - user_name: User full name
    
    Returns:
    - Waitlist confirmation
    """
    try:
        result = await wodify_api_service.join_waitlist(
            class_id=request.class_id,
            user_id=request.user_id,
            user_email=request.user_email,
            user_name=request.user_name
        )
        
        return JSONResponse(content={
            "success": True,
            "message": "Added to waitlist successfully",
            "waitlist": result
        })
        
    except Exception as e:
        logger.error(f"Error joining waitlist: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to join waitlist: {str(e)}")


@router.delete("/bookings/{booking_id}")
async def cancel_booking(booking_id: str, user_id: str = Query(...)):
    """
    Cancel a booking
    
    Path Parameters:
    - booking_id: Booking ID
    
    Query Parameters:
    - user_id: User ID
    
    Returns:
    - Cancellation confirmation
    """
    try:
        result = await wodify_api_service.cancel_booking(
            booking_id=booking_id,
            user_id=user_id
        )
        
        return JSONResponse(content={
            "success": True,
            "message": "Booking cancelled successfully",
            "cancellation": result
        })
        
    except Exception as e:
        logger.error(f"Error cancelling booking: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to cancel booking: {str(e)}")


@router.get("/user/{user_id}/bookings")
async def get_user_bookings(user_id: str):
    """
    Get all bookings for a user
    
    Path Parameters:
    - user_id: User ID
    
    Returns:
    - List of user bookings
    """
    try:
        bookings = await wodify_api_service.get_user_bookings(user_id)
        
        return JSONResponse(content={
            "success": True,
            "bookings": bookings,
            "count": len(bookings)
        })
        
    except Exception as e:
        logger.error(f"Error fetching user bookings: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch bookings")


@router.get("/class-types")
async def get_class_types():
    """
    Get all available class types
    
    Returns:
    - List of class types
    """
    try:
        class_types = await wodify_api_service.get_class_types()
        
        return JSONResponse(content={
            "success": True,
            "class_types": class_types,
            "count": len(class_types)
        })
        
    except Exception as e:
        logger.error(f"Error fetching class types: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch class types")


@router.get("/trainers")
async def get_trainers():
    """
    Get all trainers/coaches
    
    Returns:
    - List of trainers
    """
    try:
        trainers = await wodify_api_service.get_trainers()
        
        return JSONResponse(content={
            "success": True,
            "trainers": trainers,
            "count": len(trainers)
        })
        
    except Exception as e:
        logger.error(f"Error fetching trainers: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch trainers")

