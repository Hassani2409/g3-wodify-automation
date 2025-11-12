"""
G3 CrossFit WODIFY Automation - Automation Service

This service contains the business logic for processing webhooks
and triggering automated actions.
"""

from loguru import logger
from datetime import datetime
import uuid

from config.settings import settings
from src.models.wodify import (
    WodifyMembershipCreated,
    WodifyLeadCreated,
    WodifyWebhookPayload,
    WodifyClassBooked
)
from src.services.email_service import email_service
from src.services.database_service import database_service
from src.services.scheduler_service import scheduler_service


class AutomationService:
    """Service for handling automated workflows"""
    
    async def process_new_membership(self, membership_data: WodifyMembershipCreated):
        """
        Process new membership creation

        Workflow:
        1. Save member to database
        2. Check if this member was previously a lead and mark as converted
        3. Cancel any scheduled nurturing jobs for converted lead
        4. Schedule welcome email (if enabled)
        5. Schedule team notification (if enabled)
        6. Log all actions

        Args:
            membership_data: Membership data from WODIFY webhook
        """
        try:
            logger.info(f"Processing new membership for {membership_data.first_name} {membership_data.last_name}")

            # Save member to database
            await database_service.create_member(membership_data)
            logger.info(f"Member saved to database: {membership_data.client_id}")

            # Check if this member was previously a lead and mark as converted
            # This cancels any scheduled nurturing emails and updates the lead state
            converted_lead_id = await database_service.mark_lead_as_converted(
                email=membership_data.email,
                client_id=membership_data.client_id
            )
            if converted_lead_id:
                logger.info(f"Lead {converted_lead_id} marked as converted to member {membership_data.client_id}")

            # Schedule welcome email using scheduler with enhanced personalization
            if settings.enable_welcome_email:
                job_id = scheduler_service.schedule_welcome_email(
                    client_id=membership_data.client_id,
                    first_name=membership_data.first_name,
                    last_name=membership_data.last_name,
                    email=membership_data.email,
                    membership_type=membership_data.membership_type,
                    start_date=membership_data.start_date.strftime("%d.%m.%Y"),
                    monthly_price=membership_data.monthly_price,
                    delay_minutes=settings.welcome_email_delay_minutes,
                    is_first_membership=membership_data.is_first_membership,
                    referral_source=membership_data.referral_source
                )
                logger.info(f"Welcome email scheduled: {job_id} (First Membership: {membership_data.is_first_membership})")

            # Schedule team notification with enhanced information
            if settings.enable_team_notification:
                job_id = scheduler_service.schedule_team_notification(
                    client_id=membership_data.client_id,
                    first_name=membership_data.first_name,
                    last_name=membership_data.last_name,
                    email=membership_data.email,
                    phone=membership_data.phone,
                    membership_type=membership_data.membership_type,
                    start_date=membership_data.start_date.strftime("%d.%m.%Y"),
                    monthly_price=membership_data.monthly_price,
                    delay_seconds=5,  # Send team notification 5 seconds after
                    is_first_membership=membership_data.is_first_membership,
                    referral_source=membership_data.referral_source
                )
                logger.info(f"Team notification scheduled: {job_id} (First Membership: {membership_data.is_first_membership})")

            logger.info(f"Successfully processed membership for {membership_data.client_id}")

        except Exception as e:
            logger.error(f"Error processing new membership: {str(e)}")
            # Don't raise - we don't want to fail the webhook
    
    async def process_new_lead(self, lead_data: WodifyLeadCreated):
        """
        Process new lead creation

        Workflow:
        1. Save lead to database
        2. Schedule nurturing email (after delay)
        3. Log all actions

        Args:
            lead_data: Lead data from WODIFY webhook
        """
        try:
            logger.info(f"Processing new lead for {lead_data.first_name} {lead_data.last_name}")

            # Save lead to database
            await database_service.create_lead(lead_data)
            logger.info(f"Lead saved to database: {lead_data.lead_id}")

            # Schedule lead response email (within 5 minutes) with enhanced personalization
            job_id = scheduler_service.schedule_lead_response_email(
                lead_id=lead_data.lead_id,
                first_name=lead_data.first_name,
                last_name=lead_data.last_name,
                email=lead_data.email,
                delay_minutes=5,
                interested_in=lead_data.interested_in,
                phone=lead_data.phone
            )
            logger.info(f"Lead response email scheduled: {job_id} (Interested in: {lead_data.interested_in})")

            # Schedule nurturing sequence (Day 2, 5, 7) if enabled with enhanced personalization
            if settings.enable_lead_nurturing:
                job_ids = scheduler_service.schedule_nurturing_sequence(
                    lead_id=lead_data.lead_id,
                    first_name=lead_data.first_name,
                    last_name=lead_data.last_name,
                    email=lead_data.email,
                    created_at=lead_data.created_at,
                    interested_in=lead_data.interested_in
                )
                logger.info(f"Nurturing sequence scheduled: {len(job_ids)} jobs (Interested in: {lead_data.interested_in})")

            logger.info(f"Successfully processed lead for {lead_data.lead_id}")

        except Exception as e:
            logger.error(f"Error processing new lead: {str(e)}")
    
    async def process_booking_created(self, booking_data: WodifyClassBooked):
        """
        Process new booking creation
        
        Workflow:
        1. Check if it's a trial class
        2. Schedule confirmation email (immediate)
        3. Schedule reminder email (24h before)
        4. Schedule follow-up email (24h after)
        5. Log all actions
        
        Args:
            booking_data: Booking data from WODIFY webhook
        """
        try:
            logger.info(f"Processing new booking for {booking_data.first_name} {booking_data.last_name}")
            
            # Check if this is a trial class (you may need to adjust this logic)
            is_trial = "trial" in booking_data.class_name.lower() or "probetraining" in booking_data.class_name.lower()
            
            if is_trial:
                # Schedule trial confirmation email (immediate)
                job_id = scheduler_service.schedule_trial_confirmation(
                    booking_id=booking_data.booking_id,
                    first_name=booking_data.first_name,
                    last_name=booking_data.last_name,
                    email=booking_data.email,
                    class_name=booking_data.class_name,
                    class_date=booking_data.class_date.strftime("%Y-%m-%d"),
                    class_time=booking_data.class_date.strftime("%H:%M"),
                    coach_name=booking_data.coach_name,
                    delay_seconds=0
                )
                logger.info(f"Trial confirmation scheduled: {job_id}")
                
                # Schedule trial reminder (24h before)
                job_id = scheduler_service.schedule_trial_reminder(
                    booking_id=booking_data.booking_id,
                    first_name=booking_data.first_name,
                    last_name=booking_data.last_name,
                    email=booking_data.email,
                    class_name=booking_data.class_name,
                    class_date=booking_data.class_date.strftime("%Y-%m-%d"),
                    class_time=booking_data.class_date.strftime("%H:%M"),
                    coach_name=booking_data.coach_name,
                    reminder_hours=24
                )
                logger.info(f"Trial reminder scheduled: {job_id}")
                
                # Schedule trial follow-up (24h after) with feedback form integration
                job_id = scheduler_service.schedule_trial_followup(
                    booking_id=booking_data.booking_id,
                    first_name=booking_data.first_name,
                    last_name=booking_data.last_name,
                    email=booking_data.email,
                    class_date=booking_data.class_date.strftime("%Y-%m-%d"),
                    class_time=booking_data.class_date.strftime("%H:%M"),
                    followup_hours=24,
                    class_name=booking_data.class_name
                )
                logger.info(f"Trial follow-up scheduled: {job_id} (Class: {booking_data.class_name})")
            
            logger.info(f"Successfully processed booking for {booking_data.booking_id}")

        except Exception as e:
            logger.error(f"Error processing new booking: {str(e)}")
    
    async def log_webhook(self, webhook_data: WodifyWebhookPayload):
        """
        Log generic webhook to database
        
        Args:
            webhook_data: Generic webhook data
        """
        try:
            await database_service.log_webhook(webhook_data)
            logger.info(f"Webhook logged: {webhook_data.event_type}")
        except Exception as e:
            logger.error(f"Error logging webhook: {str(e)}")
    
    async def _send_welcome_email(
        self,
        membership_data: WodifyMembershipCreated
    ) -> tuple[bool, str]:
        """
        Send welcome email to new member
        
        Args:
            membership_data: Membership data
        
        Returns:
            Tuple of (success: bool, message_id: str)
        """
        try:
            logger.info(f"Sending welcome email to {membership_data.email}")
            
            success, message_id = await email_service.send_welcome_email(
                first_name=membership_data.first_name,
                last_name=membership_data.last_name,
                email=membership_data.email,
                membership_type=membership_data.membership_type,
                start_date=membership_data.start_date.strftime("%d.%m.%Y"),
                monthly_price=membership_data.monthly_price
            )
            
            if success:
                logger.info(f"Welcome email sent successfully: {message_id}")
                
                # Log email to database
                await database_service.log_email(
                    email_type="welcome",
                    recipient_email=membership_data.email,
                    recipient_name=f"{membership_data.first_name} {membership_data.last_name}",
                    sendgrid_message_id=message_id,
                    related_client_id=membership_data.client_id
                )
            else:
                logger.error(f"Failed to send welcome email to {membership_data.email}")
            
            return success, message_id or ""
            
        except Exception as e:
            logger.error(f"Error sending welcome email: {str(e)}")
            return False, ""
    
    async def _send_team_notification(
        self,
        membership_data: WodifyMembershipCreated
    ) -> tuple[bool, str]:
        """
        Send team notification about new member
        
        Args:
            membership_data: Membership data
        
        Returns:
            Tuple of (success: bool, message_id: str)
        """
        try:
            logger.info(f"Sending team notification for {membership_data.client_id}")
            
            success, message_id = await email_service.send_team_notification_email(
                first_name=membership_data.first_name,
                last_name=membership_data.last_name,
                email=membership_data.email,
                phone=membership_data.phone,
                membership_type=membership_data.membership_type,
                start_date=membership_data.start_date.strftime("%d.%m.%Y"),
                monthly_price=membership_data.monthly_price,
                client_id=membership_data.client_id
            )
            
            if success:
                logger.info(f"Team notification sent successfully: {message_id}")
                
                # Log email to database
                await database_service.log_email(
                    email_type="team_notification",
                    recipient_email=settings.g3_email,
                    recipient_name="G3 CrossFit Team",
                    sendgrid_message_id=message_id,
                    related_client_id=membership_data.client_id
                )
            else:
                logger.error(f"Failed to send team notification")
            
            return success, message_id or ""
            
        except Exception as e:
            logger.error(f"Error sending team notification: {str(e)}")
            return False, ""
    
    async def _send_lead_nurturing_email(
        self,
        lead_data: WodifyLeadCreated
    ) -> tuple[bool, str]:
        """
        Send lead nurturing email
        
        Args:
            lead_data: Lead data
        
        Returns:
            Tuple of (success: bool, message_id: str)
        """
        try:
            logger.info(f"Sending lead nurturing email to {lead_data.email}")
            
            success, message_id = await email_service.send_lead_nurturing_email(
                first_name=lead_data.first_name,
                last_name=lead_data.last_name,
                email=lead_data.email
            )
            
            if success:
                logger.info(f"Lead nurturing email sent successfully: {message_id}")
                
                # Log email to database
                await database_service.log_email(
                    email_type="lead_nurturing",
                    recipient_email=lead_data.email,
                    recipient_name=f"{lead_data.first_name} {lead_data.last_name}",
                    sendgrid_message_id=message_id,
                    related_lead_id=lead_data.lead_id
                )
            else:
                logger.error(f"Failed to send lead nurturing email to {lead_data.email}")
            
            return success, message_id or ""
            
        except Exception as e:
            logger.error(f"Error sending lead nurturing email: {str(e)}")
            return False, ""


# Global automation service instance
automation_service = AutomationService()
