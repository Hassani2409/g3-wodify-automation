"""Standalone lead API; starts without legacy Wodify/SendGrid configuration."""
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from src.leads.api import limiter, router
from src.leads.storage import get_sessions


@asynccontextmanager
async def lifespan(app):
    get_sessions()
    yield


app = FastAPI(title="G3 Lead Intake", debug=False, lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.include_router(router)


@app.middleware("http")
async def private_responses(request: Request, call_next):
    response = await call_next(request)
    response.headers["Cache-Control"] = "no-store"
    return response
