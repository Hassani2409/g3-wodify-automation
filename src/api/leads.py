"""
G3 CrossFit WODIFY Automation - Leads API

API endpoints for creating and managing leads from the contact form.
"""

from fastapi import APIRouter, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from pydantic import BaseModel, EmailStr, Field, validator
from loguru import logger
from datetime import datetime
from typing import Optional

from config.settings import settings
from src.services.wodify_api_service import wodify_api_service
from src.services.automation_service import automation_service
from src.services.scheduler_service import scheduler_service
from src.models.database import Lead, LeadStatus
from src.services.database_service import database_service


router = APIRouter(prefix="/api/leads", tags=["leads"])
limiter = Limiter(key_func=get_remote_address)


class LeadCreateRequest(BaseModel):
    """Request model for creating a new lead"""
    firstName: str = Field(..., min_length=1, max_length=100, description="Lead's first name")
    lastName: str = Field(..., min_length=1, max_length=100, description="Lead's last name")
    email: EmailStr = Field(..., description="Lead's email address")
    phone: Optional[str] = Field(None, max_length=50, description="Lead's phone number")
    message: Optional[str] = Field(None, max_length=2000, description="Message from the lead")
    interested_in: Optional[str] = Field(None, max_length=200, description="What they're interested in")
    booking_date: Optional[str] = Field(None, description="Requested booking date (YYYY-MM-DD)")
    booking_time: Optional[str] = Field(None, max_length=50, description="Requested booking time")
    experience_level: Optional[str] = Field(None, max_length=50, description="Experience level")
    source: str = Field(default="Website Contact Form", max_length=100, description="Lead source")

    @validator('phone')
    def validate_phone(cls, v):
        """Validate phone number format"""
        if v and not v.strip():
            return None
        if v:
            # Remove common separators and validate
            cleaned = ''.join(c for c in v if c.isdigit() or c in '+()-')
            if len(cleaned) < 5:
                raise ValueError("Telefonnummer muss mindestens 5 Zeichen lang sein")
        return v

    @validator('booking_date')
    def validate_booking_date(cls, v):
        """Validate booking date format"""
        if v:
            try:
                date_obj = datetime.strptime(v, '%Y-%m-%d').date()
                if date_obj < datetime.now().date():
                    raise ValueError("Buchungsdatum darf nicht in der Vergangenheit liegen")
            except ValueError as e:
                if "does not match format" in str(e):
                    raise ValueError("Ungültiges Datumsformat. Bitte verwende YYYY-MM-DD")
                raise
        return v


class LeadResponse(BaseModel):
    """Response model for lead creation"""
    success: bool
    lead_id: Optional[str] = None
    message: str
    wodify_synced: bool = False


@router.post("", response_model=LeadResponse)
@limiter.limit("10/minute")
async def create_lead(
    request: Request,
    lead_data: LeadCreateRequest
):
    """
    Create a new lead from the contact form
    
    This endpoint:
    1. Validates the lead data
    2. Creates a lead in WODIFY via API
    3. Saves the lead to the local database
    4. Triggers automated email workflows
    
    Args:
        request: FastAPI request object
        lead_data: Lead creation data from the form
    
    Returns:
        LeadResponse with success status and lead ID
    
    Raises:
        HTTPException: If validation fails or WODIFY API error occurs
    """
    try:
        logger.info(f"Creating lead for {lead_data.email}")
        
        # Create lead in WODIFY
        wodify_response = None
        wodify_synced = False
        
        try:
            wodify_response = await wodify_api_service.create_lead(
                first_name=lead_data.firstName,
                last_name=lead_data.lastName,
                email=lead_data.email,
                phone=lead_data.phone,
                message=lead_data.message,
                interested_in=lead_data.interested_in or lead_data.source
            )
            
            if wodify_response and wodify_response.get("lead_id"):
                wodify_synced = True
                logger.info(f"Lead created in WODIFY: {wodify_response.get('lead_id')}")
            else:
                logger.warning("WODIFY API response missing lead_id")
                
        except Exception as e:
            logger.error(f"Failed to create lead in WODIFY: {str(e)}")
            # Continue with local database save even if WODIFY fails
            # This ensures we don't lose leads if WODIFY API is temporarily unavailable
        
        # Save lead to local database
        session = database_service.get_session()
        try:
            # Check if lead already exists
            existing_lead = session.query(Lead).filter(
                Lead.email == lead_data.email
            ).first()
            
            if existing_lead:
                logger.info(f"Lead already exists for {lead_data.email}, updating...")
                # Update existing lead
                existing_lead.first_name = lead_data.firstName
                existing_lead.last_name = lead_data.lastName
                existing_lead.phone = lead_data.phone or existing_lead.phone
                existing_lead.message = lead_data.message or existing_lead.message
                existing_lead.interested_in = lead_data.interested_in or existing_lead.interested_in
                existing_lead.source = lead_data.source
                existing_lead.updated_at = datetime.utcnow()
                
                if wodify_response and wodify_response.get("lead_id"):
                    existing_lead.lead_id = wodify_response.get("lead_id")
                
                session.commit()
                
                lead_id = existing_lead.lead_id or f"local_{existing_lead.id}"
            else:
                # Create new lead
                new_lead = Lead(
                    lead_id=wodify_response.get("lead_id") if wodify_response else None,
                    first_name=lead_data.firstName,
                    last_name=lead_data.lastName,
                    email=lead_data.email,
                    phone=lead_data.phone,
                    message=lead_data.message,
                    interested_in=lead_data.interested_in or lead_data.source,
                    lead_status=LeadStatus.NEW,
                    source=lead_data.source
                )
                
                session.add(new_lead)
                session.commit()
                session.refresh(new_lead)
                
                lead_id = new_lead.lead_id or f"local_{new_lead.id}"
                logger.info(f"Lead saved to database: {lead_id}")
            
            # Trigger automation workflow if WODIFY sync was successful
            if wodify_synced and wodify_response:
                try:
                    from src.models.wodify import WodifyLeadCreated
                    from datetime import datetime
                    
                    wodify_lead_data = WodifyLeadCreated(
                        lead_id=wodify_response.get("lead_id"),
                        first_name=lead_data.firstName,
                        last_name=lead_data.lastName,
                        email=lead_data.email,
                        phone=lead_data.phone,
                        lead_status=LeadStatus.NEW,
                        interested_in=lead_data.interested_in or lead_data.source,
                        webhook_received_at=datetime.utcnow()
                    )
                    
                    # Process lead in background (triggers email workflows)
                    await automation_service.process_new_lead(wodify_lead_data)
                    logger.info(f"Automation workflow triggered for lead {lead_id}")
                    
                except Exception as e:
                    logger.error(f"Failed to trigger automation workflow: {str(e)}")
                    # Don't fail the request if automation fails
            
            return LeadResponse(
                success=True,
                lead_id=lead_id,
                message="Lead erfolgreich erstellt. Wir werden uns innerhalb von 24 Stunden bei dir melden.",
                wodify_synced=wodify_synced
            )
            
        finally:
            session.close()
            
    except ValueError as e:
        logger.warning(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    
    except Exception as e:
        logger.error(f"Error creating lead: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Ein Fehler ist aufgetreten. Bitte versuche es erneut oder kontaktiere uns direkt."
        )


@router.post("/unsubscribe")
@limiter.limit("10/minute")
async def unsubscribe_lead(
    request: Request,
    email: Optional[str] = None,
    lead_id: Optional[str] = None
):
    """
    Opt out a lead from nurturing emails
    
    Supports both form-data and query parameters for flexibility.
    
    Args:
        request: FastAPI request object
        email: Lead email address (from form-data or query)
        lead_id: Lead ID (optional, from form-data or query)
    
    Returns:
        Success message
    """
    try:
        # Try to get email and lead_id from form data first, then query params
        if not email:
            form_data = await request.form()
            email = form_data.get("email") or request.query_params.get("email")
            lead_id = form_data.get("lead_id") or request.query_params.get("lead_id") or lead_id
        
        if not email:
            return {
                "success": False,
                "message": "E-Mail-Adresse ist erforderlich."
            }
        
        logger.info(f"Opt-out request for email: {email}, lead_id: {lead_id}")
        
        # Opt out the lead
        success = await database_service.opt_out_lead(lead_id=lead_id, email=email)
        
        if success:
            # Cancel scheduled nurturing jobs
            if lead_id:
                await database_service.cancel_nurturing_jobs(lead_id)
            else:
                # Try to find lead by email to cancel jobs
                session = database_service.get_session()
                try:
                    from src.models.database import Lead
                    lead = session.query(Lead).filter(Lead.email == email).first()
                    if lead:
                        await database_service.cancel_nurturing_jobs(lead.lead_id)
                finally:
                    session.close()
            
            return {
                "success": True,
                "message": "Du wurdest erfolgreich von unseren E-Mails abgemeldet. Du wirst keine weiteren E-Mails von uns erhalten."
            }
        else:
            # Still return success to prevent email enumeration
            return {
                "success": True,
                "message": "Du wurdest erfolgreich von unseren E-Mails abgemeldet."
            }
            
    except Exception as e:
        logger.error(f"Error unsubscribing lead: {str(e)}")
        # Still return success to prevent email enumeration
        return {
            "success": True,
            "message": "Du wurdest erfolgreich von unseren E-Mails abgemeldet."
        }


@router.get("/health")
async def health_check():
    """Health check endpoint for leads API"""
    return {
        "status": "healthy",
        "service": "Leads API",
        "timestamp": datetime.utcnow().isoformat()
    }

