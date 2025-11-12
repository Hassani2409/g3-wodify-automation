"""
G3 CrossFit WODIFY Automation - Synchronization API

API endpoints for manual synchronization and sync status monitoring.
"""

from fastapi import APIRouter, HTTPException, Request, Query
from slowapi import Limiter
from slowapi.util import get_remote_address
from loguru import logger
from datetime import datetime
from typing import Optional

from src.services.sync_service import sync_service
from src.services.wodify_api_service import wodify_api_service


router = APIRouter(prefix="/api/sync", tags=["synchronization"])
limiter = Limiter(key_func=get_remote_address)


@router.post("/members")
@limiter.limit("10/hour")
async def sync_members(
    request: Request,
    force: bool = Query(False, description="Force sync even if recently synced")
):
    """
    Manually trigger members synchronization from WODIFY
    
    Query Parameters:
        force: Force sync even if recently synced (default: False)
    
    Returns:
        Sync result with statistics
    """
    try:
        logger.info(f"Manual members sync triggered (force={force})")
        result = await sync_service.sync_members(force=force)
        return result
    except Exception as e:
        logger.error(f"Error during manual members sync: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Sync failed: {str(e)}")


@router.post("/leads")
@limiter.limit("10/hour")
async def sync_leads(
    request: Request,
    force: bool = Query(False, description="Force sync even if recently synced")
):
    """
    Manually trigger leads synchronization from WODIFY
    
    Query Parameters:
        force: Force sync even if recently synced (default: False)
    
    Returns:
        Sync result with statistics
    """
    try:
        logger.info(f"Manual leads sync triggered (force={force})")
        result = await sync_service.sync_leads(force=force)
        return result
    except Exception as e:
        logger.error(f"Error during manual leads sync: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Sync failed: {str(e)}")


@router.post("/all")
@limiter.limit("5/hour")
async def sync_all(
    request: Request,
    force: bool = Query(False, description="Force sync even if recently synced")
):
    """
    Manually trigger full synchronization (members + leads) from WODIFY
    
    Query Parameters:
        force: Force sync even if recently synced (default: False)
    
    Returns:
        Combined sync results
    """
    try:
        logger.info(f"Manual full sync triggered (force={force})")
        result = await sync_service.sync_all(force=force)
        return result
    except Exception as e:
        logger.error(f"Error during manual full sync: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Sync failed: {str(e)}")


@router.get("/status")
@limiter.limit("60/minute")
async def get_sync_status(request: Request):
    """
    Get current synchronization status
    
    Returns:
        Sync status information including last sync times and errors
    """
    try:
        status = sync_service.get_sync_status()
        
        # Add WODIFY API health check
        wodify_health = await wodify_api_service.check_api_health()
        status["wodify_api_health"] = wodify_health
        
        return status
    except Exception as e:
        logger.error(f"Error getting sync status: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get sync status: {str(e)}")


@router.delete("/errors")
@limiter.limit("10/hour")
async def clear_sync_errors(request: Request):
    """
    Clear sync error history
    
    Returns:
        Confirmation message
    """
    try:
        sync_service.clear_errors()
        return {
            "success": True,
            "message": "Sync errors cleared",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Error clearing sync errors: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to clear errors: {str(e)}")


@router.get("/health")
async def health_check():
    """Health check endpoint for sync API"""
    return {
        "status": "healthy",
        "service": "Synchronization API",
        "timestamp": datetime.utcnow().isoformat()
    }

