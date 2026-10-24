"""Website intake now uses the provider-independent lead subsystem.
Legacy unsubscribe is retained for existing Wodify email links.
"""
from typing import Optional
from fastapi import Request
from loguru import logger
from src.leads.api import router, limiter


@router.post("/unsubscribe")
@limiter.limit("10/minute")
async def unsubscribe_lead(
    request: Request, email: Optional[str] = None, lead_id: Optional[str] = None
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
        from src.services.database_service import database_service

        # Try to get email and lead_id from form data first, then query params
        if not email:
            form_data = await request.form()
            email = form_data.get("email") or request.query_params.get("email")
            lead_id = (
                form_data.get("lead_id")
                or request.query_params.get("lead_id")
                or lead_id
            )

        if not email:
            return {"success": False, "message": "E-Mail-Adresse ist erforderlich."}

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
                "message": (
                    "Du wurdest erfolgreich von unseren E-Mails abgemeldet. "
                    "Du wirst keine weiteren E-Mails von uns erhalten."
                ),
            }
        else:
            # Still return success to prevent email enumeration
            return {
                "success": True,
                "message": "Du wurdest erfolgreich von unseren E-Mails abgemeldet.",
            }

    except Exception as e:
        logger.error(f"Error unsubscribing lead: {str(e)}")
        # Still return success to prevent email enumeration
        return {
            "success": True,
            "message": "Du wurdest erfolgreich von unseren E-Mails abgemeldet.",
        }
