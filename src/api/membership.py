"""
G3 CrossFit WODIFY Automation - Membership & Sales Portal API

API endpoints for membership management and WODIFY Sales Portal integration.
"""

from fastapi import APIRouter, HTTPException, Query, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from pydantic import BaseModel, EmailStr, Field
from loguru import logger
from datetime import datetime
from typing import List, Optional, Dict, Any

from config.settings import settings
from src.services.wodify_api_service import wodify_api_service
from src.services.automation_service import automation_service
from src.models.database import Member, MembershipStatus
from src.services.database_service import database_service


router = APIRouter(prefix="/api/membership", tags=["membership"])
limiter = Limiter(key_func=get_remote_address)


class MembershipPackageResponse(BaseModel):
    """Response model for membership package"""
    id: str
    name: str
    description: Optional[str] = None
    price: float
    billing_cycle: str  # "monthly", "six_month", "twelve_month"
    features: List[str] = []
    is_popular: bool = False
    stripe_price_id: Optional[str] = None
    wodify_package_id: Optional[str] = None


class MembershipPackagesResponse(BaseModel):
    """Response model for membership packages list"""
    success: bool
    packages: List[MembershipPackageResponse]
    count: int


@router.get("/packages", response_model=MembershipPackagesResponse)
@limiter.limit("60/minute")
async def get_membership_packages(request: Request):
    """
    Get all available membership packages from WODIFY Sales Portal
    
    Returns:
        List of membership packages with pricing and features
    """
    try:
        logger.info("Fetching membership packages from WODIFY Sales Portal")
        
        # Fetch packages from WODIFY
        wodify_packages = await wodify_api_service.get_membership_packages()
        
        # Transform WODIFY packages to our format
        packages = []
        for pkg in wodify_packages:
            # Map WODIFY package to our format
            package = MembershipPackageResponse(
                id=pkg.get("id", ""),
                name=pkg.get("name", "Unnamed Package"),
                description=pkg.get("description"),
                price=pkg.get("price", 0.0),
                billing_cycle=pkg.get("billing_cycle", "monthly"),
                features=pkg.get("features", []),
                is_popular=pkg.get("is_popular", False),
                stripe_price_id=pkg.get("stripe_price_id"),
                wodify_package_id=pkg.get("id")
            )
            packages.append(package)
        
        # If no packages from WODIFY, return default packages
        if not packages:
            logger.warning("No packages from WODIFY, returning default packages")
            packages = [
                MembershipPackageResponse(
                    id="2x_weekly",
                    name="2x pro Woche",
                    description="2 Trainings pro Woche",
                    price=140.0,
                    billing_cycle="monthly",
                    features=[
                        "2 Trainings pro Woche",
                        "Freier Zugang zum Open Gym",
                        "Community Events",
                        "Professionelle Betreuung"
                    ],
                    is_popular=False
                ),
                MembershipPackageResponse(
                    id="3x_weekly",
                    name="3x pro Woche",
                    description="3 Trainings pro Woche",
                    price=150.0,
                    billing_cycle="monthly",
                    features=[
                        "3 Trainings pro Woche",
                        "Freier Zugang zum Open Gym",
                        "Alle Spezialkurse inklusive",
                        "Community Events",
                        "Professionelle Betreuung"
                    ],
                    is_popular=False
                ),
                MembershipPackageResponse(
                    id="unlimited",
                    name="Unlimited",
                    description="Unbegrenzt Trainings pro Woche",
                    price=175.0,
                    billing_cycle="monthly",
                    features=[
                        "Unbegrenzt Trainings pro Woche",
                        "Freier Zugang zum Open Gym",
                        "Alle Spezialkurse inklusive",
                        "Community Events",
                        "Professionelle Betreuung",
                        "Priorität bei Workshops"
                    ],
                    is_popular=True
                )
            ]
        
        return MembershipPackagesResponse(
            success=True,
            packages=packages,
            count=len(packages)
        )
        
    except Exception as e:
        logger.error(f"Error fetching membership packages: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch membership packages: {str(e)}"
        )


@router.get("/packages/{package_id}")
@limiter.limit("60/minute")
async def get_membership_package(
    request: Request,
    package_id: str
):
    """
    Get detailed information about a specific membership package
    
    Path Parameters:
        package_id: Package ID
    
    Returns:
        Detailed package information
    """
    try:
        packages_response = await get_membership_packages(request)
        
        # Find the specific package
        package = next(
            (pkg for pkg in packages_response.packages if pkg.id == package_id),
            None
        )
        
        if not package:
            raise HTTPException(status_code=404, detail="Package not found")
        
        return {
            "success": True,
            "package": package
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching package {package_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch package: {str(e)}"
        )


@router.get("/sales-portal-url")
@limiter.limit("60/minute")
async def get_sales_portal_url(request: Request):
    """
    Get WODIFY Sales Portal URL for embedding
    
    Returns:
        Sales Portal URL if configured, otherwise None
    """
    try:
        if settings.wodify_sales_portal_url:
            return {
                "success": True,
                "url": settings.wodify_sales_portal_url,
                "iframe_enabled": True
            }
        else:
            return {
                "success": False,
                "url": None,
                "iframe_enabled": False,
                "message": "Sales Portal URL not configured"
            }
            
    except Exception as e:
        logger.error(f"Error getting sales portal URL: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to get sales portal URL"
        )


@router.get("/health")
async def health_check():
    """Health check endpoint for membership API"""
    return {
        "status": "healthy",
        "service": "Membership API",
        "timestamp": datetime.utcnow().isoformat(),
        "wodify_configured": bool(settings.wodify_api_key and settings.wodify_location_id),
        "sales_portal_configured": bool(settings.wodify_sales_portal_url)
    }

