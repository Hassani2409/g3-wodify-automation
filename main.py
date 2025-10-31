"""
G3 CrossFit WODIFY Automation - Main Application

This is the main entry point for the FastAPI application.
It handles WODIFY webhooks and triggers automated workflows.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from loguru import logger
import sys

from config.settings import settings
from src.api.webhooks import router as webhooks_router
from src.api.admin import router as admin_router


# Configure logging
logger.remove()
logger.add(
    sys.stdout,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan> - <level>{message}</level>",
    level=settings.log_level
)
logger.add(
    "logs/app.log",
    rotation="1 day",
    retention="30 days",
    level=settings.log_level
)


# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)


# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    description="Automated workflows for G3 CrossFit WODIFY integration",
    version="1.0.0",
    debug=settings.debug
)

# Add rate limiter to app state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# Configure CORS
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "https://g3-cross-fit-53cc52df.base44.app",
    settings.g3_website,
]

# In production, only allow specific origins
if settings.app_env == "production":
    allowed_origins = [settings.g3_website]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


# Include routers
app.include_router(webhooks_router)
app.include_router(admin_router)


@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    logger.info(f"Starting {settings.app_name}")
    logger.info(f"Environment: {settings.app_env}")
    logger.info(f"Debug mode: {settings.debug}")
    logger.info(f"Database: {settings.database_url}")


@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    from src.services.scheduler_service import scheduler_service
    scheduler_service.shutdown()
    logger.info(f"Shutting down {settings.app_name}")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": settings.app_name,
        "version": "1.0.0",
        "status": "running",
        "environment": settings.app_env
    }


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level=settings.log_level.lower()
    )
