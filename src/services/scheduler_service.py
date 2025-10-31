"""
G3 CrossFit WODIFY Automation - Scheduler Service

This service handles scheduled tasks using APScheduler.
Replaces asyncio.sleep() for production-ready delayed task execution.
"""

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.jobstores.memory import MemoryJobStore
from loguru import logger
from datetime import datetime, timedelta
from typing import Optional
import uuid

from config.settings import settings
from src.services.email_service import email_service
from src.services.database_service import database_service


class SchedulerService:
    """Service for scheduling delayed tasks"""
    
    def __init__(self):
        jobstores = {
            'default': MemoryJobStore()
        }
        
        self.scheduler = AsyncIOScheduler(jobstores=jobstores)
        self.scheduler.start()
        logger.info("Scheduler service initialized")
    
    def schedule_welcome_email(
        self,
        client_id: str,
        first_name: str,
        last_name: str,
        email: str,
        membership_type: str,
        start_date: str,
        monthly_price: float,
        delay_minutes: int = None
    ) -> str:
        """
        Schedule a welcome email to be sent after a delay
        
        Args:
            client_id: Member client ID
            first_name: Member first name
            last_name: Member last name
            email: Member email
            membership_type: Membership type
            start_date: Membership start date
            monthly_price: Monthly price
            delay_minutes: Delay in minutes (defaults to settings)
        
        Returns:
            Job ID
        """
        if delay_minutes is None:
            delay_minutes = settings.welcome_email_delay_minutes
        
        run_date = datetime.now() + timedelta(minutes=delay_minutes)
        job_id = f"welcome_email_{client_id}_{uuid.uuid4().hex[:8]}"
        
        self.scheduler.add_job(
            self._send_welcome_email_job,
            'date',
            run_date=run_date,
            args=[client_id, first_name, last_name, email, membership_type, start_date, monthly_price],
            id=job_id,
            replace_existing=True
        )
        
        logger.info(f"Scheduled welcome email for {email} at {run_date} (Job ID: {job_id})")
        return job_id
    
    def schedule_team_notification(
        self,
        client_id: str,
        first_name: str,
        last_name: str,
        email: str,
        phone: Optional[str],
        membership_type: str,
        start_date: str,
        monthly_price: float,
        delay_seconds: int = 0
    ) -> str:
        """
        Schedule a team notification email
        
        Args:
            client_id: Member client ID
            first_name: Member first name
            last_name: Member last name
            email: Member email
            phone: Member phone
            membership_type: Membership type
            start_date: Membership start date
            monthly_price: Monthly price
            delay_seconds: Delay in seconds
        
        Returns:
            Job ID
        """
        run_date = datetime.now() + timedelta(seconds=delay_seconds)
        job_id = f"team_notification_{client_id}_{uuid.uuid4().hex[:8]}"
        
        self.scheduler.add_job(
            self._send_team_notification_job,
            'date',
            run_date=run_date,
            args=[client_id, first_name, last_name, email, phone, membership_type, start_date, monthly_price],
            id=job_id,
            replace_existing=True
        )
        
        logger.info(f"Scheduled team notification for {client_id} at {run_date} (Job ID: {job_id})")
        return job_id
    
    def schedule_lead_nurturing_email(
        self,
        lead_id: str,
        first_name: str,
        last_name: str,
        email: str,
        delay_hours: int = None
    ) -> str:
        """
        Schedule a lead nurturing email
        
        Args:
            lead_id: Lead ID
            first_name: Lead first name
            last_name: Lead last name
            email: Lead email
            delay_hours: Delay in hours (defaults to settings)
        
        Returns:
            Job ID
        """
        if delay_hours is None:
            delay_hours = settings.lead_nurturing_delay_hours
        
        run_date = datetime.now() + timedelta(hours=delay_hours)
        job_id = f"lead_nurturing_{lead_id}_{uuid.uuid4().hex[:8]}"
        
        self.scheduler.add_job(
            self._send_lead_nurturing_job,
            'date',
            run_date=run_date,
            args=[lead_id, first_name, last_name, email],
            id=job_id,
            replace_existing=True
        )
        
        logger.info(f"Scheduled lead nurturing email for {email} at {run_date} (Job ID: {job_id})")
        return job_id
    
    async def _send_welcome_email_job(
        self,
        client_id: str,
        first_name: str,
        last_name: str,
        email: str,
        membership_type: str,
        start_date: str,
        monthly_price: float
    ):
        """Job to send welcome email"""
        try:
            logger.info(f"Executing scheduled welcome email for {email}")
            
            success, message_id = await email_service.send_welcome_email(
                first_name=first_name,
                last_name=last_name,
                email=email,
                membership_type=membership_type,
                start_date=start_date,
                monthly_price=monthly_price
            )
            
            if success:
                await database_service.mark_welcome_email_sent(client_id, message_id)
                await database_service.log_email(
                    email_type="welcome",
                    recipient_email=email,
                    recipient_name=f"{first_name} {last_name}",
                    sendgrid_message_id=message_id,
                    related_client_id=client_id
                )
                logger.info(f"Welcome email sent successfully: {message_id}")
            else:
                logger.error(f"Failed to send welcome email to {email}")
                
        except Exception as e:
            logger.error(f"Error in welcome email job: {str(e)}")
    
    async def _send_team_notification_job(
        self,
        client_id: str,
        first_name: str,
        last_name: str,
        email: str,
        phone: Optional[str],
        membership_type: str,
        start_date: str,
        monthly_price: float
    ):
        """Job to send team notification"""
        try:
            logger.info(f"Executing scheduled team notification for {client_id}")
            
            success, message_id = await email_service.send_team_notification_email(
                first_name=first_name,
                last_name=last_name,
                email=email,
                phone=phone,
                membership_type=membership_type,
                start_date=start_date,
                monthly_price=monthly_price,
                client_id=client_id
            )
            
            if success:
                await database_service.log_email(
                    email_type="team_notification",
                    recipient_email=settings.g3_email,
                    recipient_name="G3 CrossFit Team",
                    sendgrid_message_id=message_id,
                    related_client_id=client_id
                )
                logger.info(f"Team notification sent successfully: {message_id}")
            else:
                logger.error(f"Failed to send team notification")
                
        except Exception as e:
            logger.error(f"Error in team notification job: {str(e)}")
    
    async def _send_lead_nurturing_job(
        self,
        lead_id: str,
        first_name: str,
        last_name: str,
        email: str
    ):
        """Job to send lead nurturing email"""
        try:
            logger.info(f"Executing scheduled lead nurturing email for {email}")
            
            success, message_id = await email_service.send_lead_nurturing_email(
                first_name=first_name,
                last_name=last_name,
                email=email
            )
            
            if success:
                await database_service.mark_nurturing_email_sent(lead_id, message_id)
                await database_service.log_email(
                    email_type="lead_nurturing",
                    recipient_email=email,
                    recipient_name=f"{first_name} {last_name}",
                    sendgrid_message_id=message_id,
                    related_lead_id=lead_id
                )
                logger.info(f"Lead nurturing email sent successfully: {message_id}")
            else:
                logger.error(f"Failed to send lead nurturing email to {email}")
                
        except Exception as e:
            logger.error(f"Error in lead nurturing job: {str(e)}")
    
    def shutdown(self):
        """Shutdown the scheduler"""
        self.scheduler.shutdown()
        logger.info("Scheduler service shut down")


# Global scheduler service instance
scheduler_service = SchedulerService()

