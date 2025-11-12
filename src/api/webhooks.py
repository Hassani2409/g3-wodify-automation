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
from typing import Optional

from config.settings import settings
from src.models.wodify import (
    WodifyMembershipCreated,
    WodifyLeadCreated,
    WodifyWebhookPayload,
    WodifyClassBooked
)
from src.services.automation_service import automation_service

# Initialize Sentry if available
try:
    import sentry_sdk
    SENTRY_AVAILABLE = True
except ImportError:
    SENTRY_AVAILABLE = False


router = APIRouter(prefix="/webhooks", tags=["webhooks"])
limiter = Limiter(key_func=get_remote_address)


def _track_webhook_status(
    event_type: str,
    entity_id: Optional[str],
    status: str,
    error_msg: Optional[str] = None
):
    """
    Track webhook processing status for monitoring
    
    Args:
        event_type: Type of webhook event
        entity_id: ID of the entity (client_id, lead_id, etc.)
        status: Processing status (success, error, failed)
        error_msg: Error message if status is error/failed
    """
    try:
        logger.info(
            f"Webhook status tracked: {event_type} | "
            f"Entity ID: {entity_id} | "
            f"Status: {status}"
        )
        
        # Log to database for monitoring
        from src.services.database_service import database_service
        from src.models.wodify import WodifyWebhookPayload
        
        webhook_payload = WodifyWebhookPayload(
            event_type=event_type,
            event_id=f"{event_type}_{entity_id}_{datetime.utcnow().isoformat()}",
            tenant=settings.wodify_tenant,
            timestamp=datetime.utcnow(),
            data={"entity_id": entity_id, "status": status, "error": error_msg}
        )
        
        # Log webhook (async, but we don't await here to not block)
        import asyncio
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                # If loop is running, schedule as task
                loop.create_task(database_service.log_webhook(webhook_payload))
            else:
                loop.run_until_complete(database_service.log_webhook(webhook_payload))
        except RuntimeError:
            # No event loop, create new one
            asyncio.run(database_service.log_webhook(webhook_payload))
        
        # Report errors to Sentry
        if status in ["error", "failed"] and SENTRY_AVAILABLE:
            sentry_sdk.capture_message(
                f"Webhook processing {status}: {event_type}",
                level="error" if status == "error" else "warning",
                extra={
                    "event_type": event_type,
                    "entity_id": entity_id,
                    "error": error_msg
                }
            )
            
    except Exception as e:
        # Don't fail webhook processing if tracking fails
        logger.warning(f"Failed to track webhook status: {str(e)}")


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
        
        # Track webhook processing
        _track_webhook_status("membership-created", membership_data.client_id, "success")
        
        return {
            "status": "success",
            "message": "Webhook received and processing started",
            "client_id": membership_data.client_id
        }
        
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON payload: {str(e)}")
        _track_webhook_status("membership-created", None, "error", f"Invalid JSON: {str(e)}")
        if SENTRY_AVAILABLE:
            sentry_sdk.capture_exception(e, extra={"webhook_type": "membership-created"})
        raise HTTPException(status_code=400, detail="Invalid JSON payload")
    
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        _track_webhook_status("membership-created", None, "error", f"Validation error: {str(e)}")
        if SENTRY_AVAILABLE:
            sentry_sdk.capture_exception(e, extra={"webhook_type": "membership-created"})
        raise HTTPException(status_code=400, detail=f"Validation error: {str(e)}")
    
    except Exception as e:
        logger.error(f"Error processing membership created webhook: {str(e)}", exc_info=True)
        _track_webhook_status("membership-created", None, "error", str(e))
        if SENTRY_AVAILABLE:
            sentry_sdk.capture_exception(e, extra={"webhook_type": "membership-created"})
        # Don't expose internal error details in production
        error_detail = "Internal server error" if settings.app_env == "production" else str(e)
        raise HTTPException(status_code=500, detail=error_detail)


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
        
        # Track webhook processing
        _track_webhook_status("lead-created", lead_data.lead_id, "success")
        
        return {
            "status": "success",
            "message": "Webhook received and processing started",
            "lead_id": lead_data.lead_id
        }
        
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON payload: {str(e)}")
        _track_webhook_status("lead-created", None, "error", f"Invalid JSON: {str(e)}")
        if SENTRY_AVAILABLE:
            sentry_sdk.capture_exception(e, extra={"webhook_type": "lead-created"})
        raise HTTPException(status_code=400, detail="Invalid JSON payload")
    
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        _track_webhook_status("lead-created", None, "error", f"Validation error: {str(e)}")
        if SENTRY_AVAILABLE:
            sentry_sdk.capture_exception(e, extra={"webhook_type": "lead-created"})
        raise HTTPException(status_code=400, detail=f"Validation error: {str(e)}")
    
    except Exception as e:
        logger.error(f"Error processing lead created webhook: {str(e)}", exc_info=True)
        _track_webhook_status("lead-created", None, "error", str(e))
        if SENTRY_AVAILABLE:
            sentry_sdk.capture_exception(e, extra={"webhook_type": "lead-created"})
        # Don't expose internal error details in production
        error_detail = "Internal server error" if settings.app_env == "production" else str(e)
        raise HTTPException(status_code=500, detail=error_detail)


@router.post("/wodify/booking-created")
@limiter.limit("100/minute")
async def handle_booking_created(
    request: Request,
    background_tasks: BackgroundTasks
):
    """
    Handle WODIFY webhook: Class Booking Created
    
    This endpoint receives notifications when a class is booked.
    It triggers:
    1. Trial confirmation email (if trial class)
    2. Trial reminder email (24h before)
    3. Trial follow-up email (24h after)
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
        logger.info(f"Received booking created webhook: {payload.get('booking_id')}")
        
        # Parse and validate data
        booking_data = WodifyClassBooked(**payload)
        booking_data.webhook_received_at = datetime.utcnow()
        
        # Process in background
        background_tasks.add_task(
            automation_service.process_booking_created,
            booking_data
        )
        
        # Track webhook processing
        _track_webhook_status("booking-created", booking_data.booking_id, "success")
        
        return {
            "status": "success",
            "message": "Webhook received and processing started",
            "booking_id": booking_data.booking_id
        }
        
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON payload: {str(e)}")
        _track_webhook_status("booking-created", None, "error", f"Invalid JSON: {str(e)}")
        if SENTRY_AVAILABLE:
            sentry_sdk.capture_exception(e, extra={"webhook_type": "booking-created"})
        raise HTTPException(status_code=400, detail="Invalid JSON payload")
    
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        _track_webhook_status("booking-created", None, "error", f"Validation error: {str(e)}")
        if SENTRY_AVAILABLE:
            sentry_sdk.capture_exception(e, extra={"webhook_type": "booking-created"})
        raise HTTPException(status_code=400, detail=f"Validation error: {str(e)}")
    
    except Exception as e:
        logger.error(f"Error processing booking created webhook: {str(e)}", exc_info=True)
        _track_webhook_status("booking-created", None, "error", str(e))
        if SENTRY_AVAILABLE:
            sentry_sdk.capture_exception(e, extra={"webhook_type": "booking-created"})
        # Don't expose internal error details in production
        error_detail = "Internal server error" if settings.app_env == "production" else str(e)
        raise HTTPException(status_code=500, detail=error_detail)


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
