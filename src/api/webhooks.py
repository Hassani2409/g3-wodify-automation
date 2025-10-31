"""
G3 CrossFit WODIFY Automation - Webhook Handlers
"""

from fastapi import APIRouter, Request, HTTPException, BackgroundTasks
from slowapi import Limiter
from slowapi.util import get_remote_address
from loguru import logger
import json
import hmac
import hashlib
from datetime import datetime

from config.settings import settings
from src.models.wodify import (
    WodifyMembershipCreated,
    WodifyLeadCreated,
    WodifyWebhookPayload
)
from src.services.automation_service import automation_service


router = APIRouter(prefix="/webhooks", tags=["webhooks"])
limiter = Limiter(key_func=get_remote_address)


def verify_wodify_signature(payload: bytes, signature: str) -> bool:
    """
    Verify WODIFY webhook signature
    
    Args:
        payload: Raw request payload
        signature: Signature from request header
    
    Returns:
        True if signature is valid, False otherwise
    """
    try:
        expected_signature = hmac.new(
            settings.wodify_webhook_secret.encode(),
            payload,
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(signature, expected_signature)
    except Exception as e:
        logger.error(f"Error verifying signature: {str(e)}")
        return False


@router.post("/wodify/membership-created")
@limiter.limit("100/minute")
async def handle_membership_created(
    request: Request,
    background_tasks: BackgroundTasks
):
    """
    Handle WODIFY webhook: New Membership Created
    
    This endpoint receives notifications when a new member signs up.
    It triggers:
    1. Welcome email to the new member
    2. Team notification email
    3. Database record creation
    """
    try:
        # Get raw body for signature verification
        body = await request.body()
        
        # Verify signature if webhook secret is configured
        if settings.wodify_webhook_secret:
            signature = request.headers.get('X-Wodify-Signature', '')
            if not verify_wodify_signature(body, signature):
                logger.warning("Invalid webhook signature")
                raise HTTPException(status_code=401, detail="Invalid signature")
        
        # Parse JSON payload
        payload = json.loads(body)
        
        # Log webhook receipt
        logger.info(f"Received membership created webhook: {payload.get('client_id')}")
        
        # Parse and validate data
        membership_data = WodifyMembershipCreated(**payload)
        membership_data.webhook_received_at = datetime.utcnow()
        
        # Process in background to return response quickly
        background_tasks.add_task(
            automation_service.process_new_membership,
            membership_data
        )
        
        return {
            "status": "success",
            "message": "Webhook received and processing started",
            "client_id": membership_data.client_id
        }
        
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON payload: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid JSON payload")
    
    except Exception as e:
        logger.error(f"Error processing membership created webhook: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/wodify/lead-created")
@limiter.limit("100/minute")
async def handle_lead_created(
    request: Request,
    background_tasks: BackgroundTasks
):
    """
    Handle WODIFY webhook: New Lead Created
    
    This endpoint receives notifications when a new lead is created.
    It triggers:
    1. Lead nurturing email (after 24 hours)
    2. Database record creation
    """
    try:
        # Get raw body for signature verification
        body = await request.body()
        
        # Verify signature if webhook secret is configured
        if settings.wodify_webhook_secret:
            signature = request.headers.get('X-Wodify-Signature', '')
            if not verify_wodify_signature(body, signature):
                logger.warning("Invalid webhook signature")
                raise HTTPException(status_code=401, detail="Invalid signature")
        
        # Parse JSON payload
        payload = json.loads(body)
        
        # Log webhook receipt
        logger.info(f"Received lead created webhook: {payload.get('lead_id')}")
        
        # Parse and validate data
        lead_data = WodifyLeadCreated(**payload)
        lead_data.webhook_received_at = datetime.utcnow()
        
        # Process in background
        background_tasks.add_task(
            automation_service.process_new_lead,
            lead_data
        )
        
        return {
            "status": "success",
            "message": "Webhook received and processing started",
            "lead_id": lead_data.lead_id
        }
        
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON payload: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid JSON payload")
    
    except Exception as e:
        logger.error(f"Error processing lead created webhook: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/wodify/generic")
@limiter.limit("100/minute")
async def handle_generic_webhook(
    request: Request,
    background_tasks: BackgroundTasks
):
    """
    Handle generic WODIFY webhook
    
    This is a catch-all endpoint for other WODIFY webhooks.
    Useful for logging and future expansion.
    """
    try:
        # Get raw body
        body = await request.body()
        
        # Parse JSON payload
        payload = json.loads(body)
        
        # Log webhook receipt
        event_type = payload.get('event_type', 'unknown')
        logger.info(f"Received generic webhook: {event_type}")
        
        # Parse generic webhook payload
        webhook_data = WodifyWebhookPayload(**payload)
        
        # Log to database (in background)
        background_tasks.add_task(
            automation_service.log_webhook,
            webhook_data
        )
        
        return {
            "status": "success",
            "message": "Webhook received and logged",
            "event_type": event_type
        }
        
    except Exception as e:
        logger.error(f"Error processing generic webhook: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "G3 CrossFit WODIFY Automation",
        "timestamp": datetime.utcnow().isoformat()
    }
