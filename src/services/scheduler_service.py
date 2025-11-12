"""
G3 CrossFit WODIFY Automation - Scheduler Service

This service handles scheduled tasks using APScheduler.
Replaces asyncio.sleep() for production-ready delayed task execution.
"""

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from loguru import logger
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
import uuid

from config.settings import settings
from src.services.email_service import email_service
from src.services.database_service import database_service
from src.services.sync_service import sync_service


class SchedulerService:
    """Service for scheduling delayed tasks with persistent job store"""
    
    def __init__(self):
        # Configure job store based on environment
        if settings.app_env == "production" and settings.redis_host:
            # Production: Use Redis for persistent job store
            # Note: APScheduler 3.x doesn't have built-in RedisJobStore
            # Using SQLAlchemyJobStore with PostgreSQL in production instead
            # For Redis, consider using a custom job store or upgrade to APScheduler 4.x
            logger.warning("Redis job store not available in APScheduler 3.x. Using SQLAlchemyJobStore.")
            jobstores = {
                'default': SQLAlchemyJobStore(url=settings.database_url, tablename='apscheduler_jobs')
            }
            logger.info(f"Scheduler using SQLAlchemy job store (production): {settings.database_url}")
        else:
            # Development: Use SQLite for persistent job store
            jobstores = {
                'default': SQLAlchemyJobStore(url=settings.database_url, tablename='apscheduler_jobs')
            }
            logger.info(f"Scheduler using SQLAlchemy job store (development): {settings.database_url}")
        
        self.scheduler = AsyncIOScheduler(jobstores=jobstores)
        self.scheduler.start()
        logger.info("Scheduler service initialized with persistent job store")
        
        # Schedule automatic sync jobs
        self._schedule_sync_jobs()
    
    def schedule_welcome_email(
        self,
        client_id: str,
        first_name: str,
        last_name: str,
        email: str,
        membership_type: str,
        start_date: str,
        monthly_price: float,
        delay_minutes: int = None,
        is_first_membership: bool = True,
        referral_source: Optional[str] = None
    ) -> str:
        """
        Schedule a welcome email to be sent after a delay with enhanced personalization
        
        Args:
            client_id: Member client ID
            first_name: Member first name
            last_name: Member last name
            email: Member email
            membership_type: Membership type
            start_date: Membership start date
            monthly_price: Monthly price
            delay_minutes: Delay in minutes (defaults to settings)
            is_first_membership: Whether this is the member's first membership
            referral_source: Source of referral (optional)
        
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
            args=[client_id, first_name, last_name, email, membership_type, start_date, monthly_price, is_first_membership, referral_source],
            id=job_id,
            replace_existing=True,
            max_instances=1,
            misfire_grace_time=300  # 5 minutes grace period for missed jobs
        )
        
        logger.info(f"Scheduled welcome email for {email} at {run_date} (Job ID: {job_id}, First Membership: {is_first_membership})")
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
        delay_seconds: int = 0,
        is_first_membership: bool = True,
        referral_source: Optional[str] = None
    ) -> str:
        """
        Schedule a team notification email with enhanced information
        
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
            is_first_membership: Whether this is the member's first membership
            referral_source: Source of referral (optional)
        
        Returns:
            Job ID
        """
        run_date = datetime.now() + timedelta(seconds=delay_seconds)
        job_id = f"team_notification_{client_id}_{uuid.uuid4().hex[:8]}"
        
        self.scheduler.add_job(
            self._send_team_notification_job,
            'date',
            run_date=run_date,
            args=[client_id, first_name, last_name, email, phone, membership_type, start_date, monthly_price, is_first_membership, referral_source],
            id=job_id,
            replace_existing=True,
            max_instances=1,
            misfire_grace_time=300  # 5 minutes grace period for missed jobs
        )
        
        logger.info(f"Scheduled team notification for {client_id} at {run_date} (Job ID: {job_id}, First Membership: {is_first_membership})")
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
        monthly_price: float,
        is_first_membership: bool = True,
        referral_source: Optional[str] = None
    ):
        """Job to send welcome email with enhanced personalization"""
        job_start_time = datetime.utcnow()
        try:
            logger.info(f"Executing scheduled welcome email for {email} (Client ID: {client_id})")
            
            success, message_id = await email_service.send_welcome_email(
                first_name=first_name,
                last_name=last_name,
                email=email,
                membership_type=membership_type,
                start_date=start_date,
                monthly_price=monthly_price,
                is_first_membership=is_first_membership,
                referral_source=referral_source
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
                duration = (datetime.utcnow() - job_start_time).total_seconds()
                logger.info(f"Welcome email sent successfully: {message_id} (Duration: {duration:.2f}s)")
            else:
                logger.error(f"Failed to send welcome email to {email} (Client ID: {client_id})")
                # Log failed attempt for monitoring
                await database_service.log_email(
                    email_type="welcome_failed",
                    recipient_email=email,
                    recipient_name=f"{first_name} {last_name}",
                    sendgrid_message_id=None,
                    related_client_id=client_id
                )
                
        except Exception as e:
            duration = (datetime.utcnow() - job_start_time).total_seconds()
            logger.error(f"Error in welcome email job for {email}: {str(e)} (Duration: {duration:.2f}s)")
            # Log error for monitoring
            try:
                await database_service.log_email(
                    email_type="welcome_error",
                    recipient_email=email,
                    recipient_name=f"{first_name} {last_name}",
                    sendgrid_message_id=None,
                    related_client_id=client_id
                )
            except Exception as log_error:
                logger.error(f"Failed to log error: {str(log_error)}")
    
    async def _send_team_notification_job(
        self,
        client_id: str,
        first_name: str,
        last_name: str,
        email: str,
        phone: Optional[str],
        membership_type: str,
        start_date: str,
        monthly_price: float,
        is_first_membership: bool = True,
        referral_source: Optional[str] = None
    ):
        """Job to send team notification with enhanced information"""
        job_start_time = datetime.utcnow()
        try:
            logger.info(f"Executing scheduled team notification for {client_id} ({first_name} {last_name})")
            
            success, message_id = await email_service.send_team_notification_email(
                first_name=first_name,
                last_name=last_name,
                email=email,
                phone=phone,
                membership_type=membership_type,
                start_date=start_date,
                monthly_price=monthly_price,
                client_id=client_id,
                is_first_membership=is_first_membership,
                referral_source=referral_source
            )
            
            if success:
                await database_service.log_email(
                    email_type="team_notification",
                    recipient_email=settings.g3_email,
                    recipient_name="G3 CrossFit Team",
                    sendgrid_message_id=message_id,
                    related_client_id=client_id
                )
                duration = (datetime.utcnow() - job_start_time).total_seconds()
                logger.info(f"Team notification sent successfully: {message_id} (Duration: {duration:.2f}s)")
            else:
                logger.error(f"Failed to send team notification for {client_id}")
                # Log failed attempt for monitoring
                await database_service.log_email(
                    email_type="team_notification_failed",
                    recipient_email=settings.g3_email,
                    recipient_name="G3 CrossFit Team",
                    sendgrid_message_id=None,
                    related_client_id=client_id
                )
                
        except Exception as e:
            duration = (datetime.utcnow() - job_start_time).total_seconds()
            logger.error(f"Error in team notification job for {client_id}: {str(e)} (Duration: {duration:.2f}s)")
            # Log error for monitoring
            try:
                await database_service.log_email(
                    email_type="team_notification_error",
                    recipient_email=settings.g3_email,
                    recipient_name="G3 CrossFit Team",
                    sendgrid_message_id=None,
                    related_client_id=client_id
                )
            except Exception as log_error:
                logger.error(f"Failed to log error: {str(log_error)}")
    
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
    
    def schedule_lead_response_email(
        self,
        lead_id: str,
        first_name: str,
        last_name: str,
        email: str,
        delay_minutes: int = 5,
        interested_in: Optional[str] = None,
        phone: Optional[str] = None
    ) -> str:
        """
        Schedule a lead response email (within 5 minutes) with enhanced personalization
        
        Args:
            lead_id: Lead ID
            first_name: Lead first name
            last_name: Lead last name
            email: Lead email
            delay_minutes: Delay in minutes (default: 5)
            interested_in: What the lead is interested in (optional)
            phone: Lead's phone number (optional)
        
        Returns:
            Job ID
        """
        run_date = datetime.now() + timedelta(minutes=delay_minutes)
        job_id = f"lead_response_{lead_id}_{uuid.uuid4().hex[:8]}"
        
        self.scheduler.add_job(
            self._send_lead_response_job,
            'date',
            run_date=run_date,
            args=[lead_id, first_name, last_name, email, interested_in, phone],
            id=job_id,
            replace_existing=True,
            max_instances=1,
            misfire_grace_time=300  # 5 minutes grace period for missed jobs
        )
        
        logger.info(f"Scheduled lead response email for {email} at {run_date} (Job ID: {job_id}, Interested in: {interested_in})")
        return job_id
    
    def schedule_trial_confirmation(
        self,
        booking_id: str,
        first_name: str,
        last_name: str,
        email: str,
        class_name: str,
        class_date: str,
        class_time: str,
        coach_name: Optional[str] = None,
        delay_seconds: int = 0
    ) -> str:
        """
        Schedule a trial confirmation email
        
        Args:
            booking_id: Booking ID
            first_name: User first name
            last_name: User last name
            email: User email
            class_name: Class name
            class_date: Class date
            class_time: Class time
            coach_name: Coach name (optional)
            delay_seconds: Delay in seconds
        
        Returns:
            Job ID
        """
        run_date = datetime.now() + timedelta(seconds=delay_seconds)
        job_id = f"trial_confirmation_{booking_id}_{uuid.uuid4().hex[:8]}"
        
        self.scheduler.add_job(
            self._send_trial_confirmation_job,
            'date',
            run_date=run_date,
            args=[booking_id, first_name, last_name, email, class_name, class_date, class_time, coach_name],
            id=job_id,
            replace_existing=True
        )
        
        logger.info(f"Scheduled trial confirmation for {email} at {run_date} (Job ID: {job_id})")
        return job_id
    
    def schedule_trial_reminder(
        self,
        booking_id: str,
        first_name: str,
        last_name: str,
        email: str,
        class_name: str,
        class_date: str,
        class_time: str,
        coach_name: Optional[str] = None,
        reminder_hours: int = 24
    ) -> str:
        """
        Schedule a trial reminder email (24 hours before)
        
        Args:
            booking_id: Booking ID
            first_name: User first name
            last_name: User last name
            email: User email
            class_name: Class name
            class_date: Class date
            class_time: Class time
            coach_name: Coach name (optional)
            reminder_hours: Hours before class (default: 24)
        
        Returns:
            Job ID
        """
        # Parse class_date and calculate reminder time
        from datetime import datetime as dt
        try:
            class_datetime = dt.strptime(f"{class_date} {class_time}", "%Y-%m-%d %H:%M")
            run_date = class_datetime - timedelta(hours=reminder_hours)
        except:
            # Fallback: use current time + reminder_hours
            run_date = datetime.now() + timedelta(hours=reminder_hours)
        
        job_id = f"trial_reminder_{booking_id}_{uuid.uuid4().hex[:8]}"
        
        self.scheduler.add_job(
            self._send_trial_reminder_job,
            'date',
            run_date=run_date,
            args=[booking_id, first_name, last_name, email, class_name, class_date, class_time, coach_name],
            id=job_id,
            replace_existing=True,
            max_instances=1,
            misfire_grace_time=600  # 10 minutes grace period for missed reminder jobs
        )
        
        logger.info(f"Scheduled trial reminder for {email} at {run_date} (Job ID: {job_id})")
        return job_id
    
    def schedule_trial_followup(
        self,
        booking_id: str,
        first_name: str,
        last_name: str,
        email: str,
        class_date: str,
        class_time: str,
        followup_hours: int = 24,
        class_name: Optional[str] = None
    ) -> str:
        """
        Schedule a trial follow-up email (24 hours after) with feedback form integration
        
        Args:
            booking_id: Booking ID
            first_name: User first name
            last_name: User last name
            email: User email
            class_date: Class date
            class_time: Class time
            followup_hours: Hours after class (default: 24)
            class_name: Class name for personalization (optional)
        
        Returns:
            Job ID
        """
        # Parse class_date and calculate followup time
        from datetime import datetime as dt
        try:
            class_datetime = dt.strptime(f"{class_date} {class_time}", "%Y-%m-%d %H:%M")
            run_date = class_datetime + timedelta(hours=followup_hours)
        except:
            # Fallback: use current time + followup_hours
            run_date = datetime.now() + timedelta(hours=followup_hours)
        
        job_id = f"trial_followup_{booking_id}_{uuid.uuid4().hex[:8]}"
        
        self.scheduler.add_job(
            self._send_trial_followup_job,
            'date',
            run_date=run_date,
            args=[booking_id, first_name, last_name, email, class_name],
            id=job_id,
            replace_existing=True,
            max_instances=1,
            misfire_grace_time=600  # 10 minutes grace period for missed followup jobs
        )
        
        logger.info(f"Scheduled trial followup for {email} at {run_date} (Job ID: {job_id}, Class: {class_name})")
        return job_id
    
    def schedule_nurturing_sequence(
        self,
        lead_id: str,
        first_name: str,
        last_name: str,
        email: str,
        created_at: datetime,
        interested_in: Optional[str] = None
    ) -> list[str]:
        """
        Schedule complete nurturing sequence (Day 2, 5, 7) with enhanced personalization
        
        Args:
            lead_id: Lead ID
            first_name: Lead first name
            last_name: Lead last name
            email: Lead email
            created_at: Lead creation datetime
            interested_in: What the lead is interested in (optional)
        
        Returns:
            List of Job IDs
        """
        job_ids = []
        
        # Day 2 (48 hours after creation)
        run_date_2 = created_at + timedelta(days=2)
        job_id_2 = f"nurturing_2_{lead_id}_{uuid.uuid4().hex[:8]}"
        self.scheduler.add_job(
            self._send_nurturing_2_job,
            'date',
            run_date=run_date_2,
            args=[lead_id, first_name, last_name, email, interested_in],
            id=job_id_2,
            replace_existing=True,
            max_instances=1,
            misfire_grace_time=600  # 10 minutes grace period
        )
        job_ids.append(job_id_2)
        
        # Day 5 (120 hours after creation)
        run_date_5 = created_at + timedelta(days=5)
        job_id_5 = f"nurturing_5_{lead_id}_{uuid.uuid4().hex[:8]}"
        self.scheduler.add_job(
            self._send_nurturing_5_job,
            'date',
            run_date=run_date_5,
            args=[lead_id, first_name, last_name, email, interested_in],
            id=job_id_5,
            replace_existing=True,
            max_instances=1,
            misfire_grace_time=600  # 10 minutes grace period
        )
        job_ids.append(job_id_5)
        
        # Day 7 (168 hours after creation)
        run_date_7 = created_at + timedelta(days=7)
        job_id_7 = f"nurturing_7_{lead_id}_{uuid.uuid4().hex[:8]}"
        self.scheduler.add_job(
            self._send_nurturing_7_job,
            'date',
            run_date=run_date_7,
            args=[lead_id, first_name, last_name, email, interested_in],
            id=job_id_7,
            replace_existing=True,
            max_instances=1,
            misfire_grace_time=600  # 10 minutes grace period
        )
        job_ids.append(job_id_7)
        
        logger.info(f"Scheduled nurturing sequence for {email}: Day 2 ({run_date_2}), Day 5 ({run_date_5}), Day 7 ({run_date_7}), Interested in: {interested_in}")
        return job_ids
    
    async def _send_lead_response_job(
        self,
        lead_id: str,
        first_name: str,
        last_name: str,
        email: str,
        interested_in: Optional[str] = None,
        phone: Optional[str] = None
    ):
        """Job to send lead response email with enhanced personalization"""
        job_start_time = datetime.utcnow()
        try:
            logger.info(f"Executing scheduled lead response email for {email} (Lead ID: {lead_id})")
            
            success, message_id = await email_service.send_lead_response_email(
                first_name=first_name,
                last_name=last_name,
                email=email,
                interested_in=interested_in,
                phone=phone
            )
            
            if success:
                await database_service.update_lead_nurturing_state(
                    lead_id=lead_id,
                    state="RESPONDED",
                    response_email_sent=True,
                    message_id=message_id
                )
                await database_service.log_email(
                    email_type="lead_response",
                    recipient_email=email,
                    recipient_name=f"{first_name} {last_name}",
                    sendgrid_message_id=message_id,
                    related_lead_id=lead_id
                )
                duration = (datetime.utcnow() - job_start_time).total_seconds()
                logger.info(f"Lead response email sent successfully: {message_id} (Duration: {duration:.2f}s)")
            else:
                logger.error(f"Failed to send lead response email to {email} (Lead ID: {lead_id})")
                # Log failed attempt for monitoring
                await database_service.log_email(
                    email_type="lead_response_failed",
                    recipient_email=email,
                    recipient_name=f"{first_name} {last_name}",
                    sendgrid_message_id=None,
                    related_lead_id=lead_id
                )
                
        except Exception as e:
            duration = (datetime.utcnow() - job_start_time).total_seconds()
            logger.error(f"Error in lead response job for {email}: {str(e)} (Duration: {duration:.2f}s)")
            # Log error for monitoring
            try:
                await database_service.log_email(
                    email_type="lead_response_error",
                    recipient_email=email,
                    recipient_name=f"{first_name} {last_name}",
                    sendgrid_message_id=None,
                    related_lead_id=lead_id
                )
            except Exception as log_error:
                logger.error(f"Failed to log error: {str(log_error)}")
    
    async def _send_trial_confirmation_job(
        self,
        booking_id: str,
        first_name: str,
        last_name: str,
        email: str,
        class_name: str,
        class_date: str,
        class_time: str,
        coach_name: Optional[str]
    ):
        """Job to send trial confirmation with calendar integration"""
        job_start_time = datetime.utcnow()
        try:
            logger.info(f"Executing scheduled trial confirmation for {email} (Booking ID: {booking_id})")
            
            success, message_id = await email_service.send_trial_confirmation_email(
                first_name=first_name,
                last_name=last_name,
                email=email,
                class_name=class_name,
                class_date=class_date,
                class_time=class_time,
                coach_name=coach_name,
                booking_id=booking_id
            )
            
            if success:
                await database_service.log_email(
                    email_type="trial_confirmation",
                    recipient_email=email,
                    recipient_name=f"{first_name} {last_name}",
                    sendgrid_message_id=message_id
                )
                duration = (datetime.utcnow() - job_start_time).total_seconds()
                logger.info(f"Trial confirmation sent successfully: {message_id} (Duration: {duration:.2f}s)")
            else:
                logger.error(f"Failed to send trial confirmation to {email} (Booking ID: {booking_id})")
                # Log failed attempt for monitoring
                await database_service.log_email(
                    email_type="trial_confirmation_failed",
                    recipient_email=email,
                    recipient_name=f"{first_name} {last_name}",
                    sendgrid_message_id=None
                )
                
        except Exception as e:
            duration = (datetime.utcnow() - job_start_time).total_seconds()
            logger.error(f"Error in trial confirmation job for {email}: {str(e)} (Duration: {duration:.2f}s)")
            # Log error for monitoring
            try:
                await database_service.log_email(
                    email_type="trial_confirmation_error",
                    recipient_email=email,
                    recipient_name=f"{first_name} {last_name}",
                    sendgrid_message_id=None
                )
            except Exception as log_error:
                logger.error(f"Failed to log error: {str(log_error)}")
    
    async def _send_trial_reminder_job(
        self,
        booking_id: str,
        first_name: str,
        last_name: str,
        email: str,
        class_name: str,
        class_date: str,
        class_time: str,
        coach_name: Optional[str]
    ):
        """Job to send trial reminder with enhanced monitoring"""
        job_start_time = datetime.utcnow()
        try:
            logger.info(f"Executing scheduled trial reminder for {email} (Booking ID: {booking_id})")
            
            success, message_id = await email_service.send_trial_reminder_email(
                first_name=first_name,
                last_name=last_name,
                email=email,
                class_name=class_name,
                class_date=class_date,
                class_time=class_time,
                coach_name=coach_name
            )
            
            if success:
                await database_service.log_email(
                    email_type="trial_reminder",
                    recipient_email=email,
                    recipient_name=f"{first_name} {last_name}",
                    sendgrid_message_id=message_id
                )
                duration = (datetime.utcnow() - job_start_time).total_seconds()
                logger.info(f"Trial reminder sent successfully: {message_id} (Duration: {duration:.2f}s)")
            else:
                logger.error(f"Failed to send trial reminder to {email} (Booking ID: {booking_id})")
                # Log failed attempt for monitoring
                await database_service.log_email(
                    email_type="trial_reminder_failed",
                    recipient_email=email,
                    recipient_name=f"{first_name} {last_name}",
                    sendgrid_message_id=None
                )
                
        except Exception as e:
            duration = (datetime.utcnow() - job_start_time).total_seconds()
            logger.error(f"Error in trial reminder job for {email}: {str(e)} (Duration: {duration:.2f}s)")
            # Log error for monitoring
            try:
                await database_service.log_email(
                    email_type="trial_reminder_error",
                    recipient_email=email,
                    recipient_name=f"{first_name} {last_name}",
                    sendgrid_message_id=None
                )
            except Exception as log_error:
                logger.error(f"Failed to log error: {str(log_error)}")
    
    async def _send_trial_followup_job(
        self,
        booking_id: str,
        first_name: str,
        last_name: str,
        email: str,
        class_name: Optional[str] = None
    ):
        """Job to send trial followup with feedback form integration"""
        job_start_time = datetime.utcnow()
        try:
            logger.info(f"Executing scheduled trial followup for {email} (Booking ID: {booking_id})")
            
            success, message_id = await email_service.send_trial_followup_email(
                first_name=first_name,
                last_name=last_name,
                email=email,
                booking_id=booking_id,
                class_name=class_name
            )
            
            if success:
                await database_service.log_email(
                    email_type="trial_followup",
                    recipient_email=email,
                    recipient_name=f"{first_name} {last_name}",
                    sendgrid_message_id=message_id
                )
                duration = (datetime.utcnow() - job_start_time).total_seconds()
                logger.info(f"Trial followup sent successfully: {message_id} (Duration: {duration:.2f}s)")
            else:
                logger.error(f"Failed to send trial followup to {email} (Booking ID: {booking_id})")
                # Log failed attempt for monitoring
                await database_service.log_email(
                    email_type="trial_followup_failed",
                    recipient_email=email,
                    recipient_name=f"{first_name} {last_name}",
                    sendgrid_message_id=None
                )
                
        except Exception as e:
            duration = (datetime.utcnow() - job_start_time).total_seconds()
            logger.error(f"Error in trial followup job for {email}: {str(e)} (Duration: {duration:.2f}s)")
            # Log error for monitoring
            try:
                await database_service.log_email(
                    email_type="trial_followup_error",
                    recipient_email=email,
                    recipient_name=f"{first_name} {last_name}",
                    sendgrid_message_id=None
                )
            except Exception as log_error:
                logger.error(f"Failed to log error: {str(log_error)}")
    
    async def _send_nurturing_2_job(
        self,
        lead_id: str,
        first_name: str,
        last_name: str,
        email: str,
        interested_in: Optional[str] = None
    ):
        """Job to send nurturing email (Day 2) with enhanced personalization"""
        job_start_time = datetime.utcnow()
        try:
            logger.info(f"Executing scheduled nurturing email (Day 2) for {email} (Lead ID: {lead_id})")
            
            # Check if lead has opted out
            session = database_service.get_session()
            try:
                from src.models.database import Lead
                lead = session.query(Lead).filter(Lead.lead_id == lead_id).first()
                if lead and lead.opted_out:
                    logger.info(f"Lead {lead_id} has opted out, skipping Day 2 email")
                    return
            finally:
                session.close()
            
            success, message_id = await email_service.send_lead_nurturing_2_email(
                first_name=first_name,
                last_name=last_name,
                email=email,
                lead_id=lead_id,
                interested_in=interested_in
            )
            
            if success:
                await database_service.update_lead_nurturing_state(
                    lead_id=lead_id,
                    state="NURTURING_2",
                    nurturing_2_sent=True,
                    message_id=message_id
                )
                await database_service.log_email(
                    email_type="lead_nurturing_2",
                    recipient_email=email,
                    recipient_name=f"{first_name} {last_name}",
                    sendgrid_message_id=message_id,
                    related_lead_id=lead_id
                )
                duration = (datetime.utcnow() - job_start_time).total_seconds()
                logger.info(f"Nurturing email (Day 2) sent successfully: {message_id} (Duration: {duration:.2f}s)")
            else:
                logger.error(f"Failed to send nurturing email (Day 2) to {email} (Lead ID: {lead_id})")
                
        except Exception as e:
            duration = (datetime.utcnow() - job_start_time).total_seconds()
            logger.error(f"Error in nurturing 2 job for {email}: {str(e)} (Duration: {duration:.2f}s)")
    
    async def _send_nurturing_5_job(
        self,
        lead_id: str,
        first_name: str,
        last_name: str,
        email: str,
        interested_in: Optional[str] = None
    ):
        """Job to send nurturing email (Day 5) with enhanced personalization"""
        job_start_time = datetime.utcnow()
        try:
            logger.info(f"Executing scheduled nurturing email (Day 5) for {email} (Lead ID: {lead_id})")
            
            # Check if lead has opted out
            session = database_service.get_session()
            try:
                from src.models.database import Lead
                lead = session.query(Lead).filter(Lead.lead_id == lead_id).first()
                if lead and lead.opted_out:
                    logger.info(f"Lead {lead_id} has opted out, skipping Day 5 email")
                    return
            finally:
                session.close()
            
            success, message_id = await email_service.send_lead_nurturing_5_email(
                first_name=first_name,
                last_name=last_name,
                email=email,
                lead_id=lead_id,
                interested_in=interested_in
            )
            
            if success:
                await database_service.update_lead_nurturing_state(
                    lead_id=lead_id,
                    state="NURTURING_5",
                    nurturing_5_sent=True,
                    message_id=message_id
                )
                await database_service.log_email(
                    email_type="lead_nurturing_5",
                    recipient_email=email,
                    recipient_name=f"{first_name} {last_name}",
                    sendgrid_message_id=message_id,
                    related_lead_id=lead_id
                )
                duration = (datetime.utcnow() - job_start_time).total_seconds()
                logger.info(f"Nurturing email (Day 5) sent successfully: {message_id} (Duration: {duration:.2f}s)")
            else:
                logger.error(f"Failed to send nurturing email (Day 5) to {email} (Lead ID: {lead_id})")
                
        except Exception as e:
            duration = (datetime.utcnow() - job_start_time).total_seconds()
            logger.error(f"Error in nurturing 5 job for {email}: {str(e)} (Duration: {duration:.2f}s)")
    
    async def _send_nurturing_7_job(
        self,
        lead_id: str,
        first_name: str,
        last_name: str,
        email: str,
        interested_in: Optional[str] = None
    ):
        """Job to send nurturing email (Day 7) with opt-out link"""
        job_start_time = datetime.utcnow()
        try:
            logger.info(f"Executing scheduled nurturing email (Day 7) for {email} (Lead ID: {lead_id})")
            
            # Check if lead has opted out
            session = database_service.get_session()
            try:
                from src.models.database import Lead
                lead = session.query(Lead).filter(Lead.lead_id == lead_id).first()
                if lead and lead.opted_out:
                    logger.info(f"Lead {lead_id} has opted out, skipping Day 7 email")
                    return
            finally:
                session.close()
            
            success, message_id = await email_service.send_lead_nurturing_7_email(
                first_name=first_name,
                last_name=last_name,
                email=email,
                lead_id=lead_id,
                interested_in=interested_in
            )
            
            if success:
                await database_service.update_lead_nurturing_state(
                    lead_id=lead_id,
                    state="NURTURING_7",
                    nurturing_7_sent=True,
                    message_id=message_id
                )
                await database_service.log_email(
                    email_type="lead_nurturing_7",
                    recipient_email=email,
                    recipient_name=f"{first_name} {last_name}",
                    sendgrid_message_id=message_id,
                    related_lead_id=lead_id
                )
                duration = (datetime.utcnow() - job_start_time).total_seconds()
                logger.info(f"Nurturing email (Day 7) sent successfully: {message_id} (Duration: {duration:.2f}s)")
            else:
                logger.error(f"Failed to send nurturing email (Day 7) to {email} (Lead ID: {lead_id})")
                
        except Exception as e:
            duration = (datetime.utcnow() - job_start_time).total_seconds()
            logger.error(f"Error in nurturing 7 job for {email}: {str(e)} (Duration: {duration:.2f}s)")
    
    def _schedule_sync_jobs(self):
        """Schedule automatic synchronization jobs"""
        # Sync members every 6 hours
        self.scheduler.add_job(
            sync_members_job,
            'interval',
            hours=6,
            id='sync_members_auto',
            replace_existing=True,
            max_instances=1
        )
        
        # Sync leads every 6 hours
        self.scheduler.add_job(
            sync_leads_job,
            'interval',
            hours=6,
            id='sync_leads_auto',
            replace_existing=True,
            max_instances=1
        )
        
        logger.info("Automatic sync jobs scheduled (every 6 hours)")
    
    def get_job_status(self, job_id: str) -> Optional[Dict[str, Any]]:
        """
        Get status of a scheduled job
        
        Args:
            job_id: Job ID
        
        Returns:
            Job status information or None if not found
        """
        try:
            job = self.scheduler.get_job(job_id)
            if job:
                return {
                    "job_id": job_id,
                    "name": job.name,
                    "next_run_time": job.next_run_time.isoformat() if job.next_run_time else None,
                    "func": job.func.__name__ if hasattr(job.func, '__name__') else str(job.func),
                    "args": job.args,
                    "kwargs": job.kwargs
                }
            return None
        except Exception as e:
            logger.error(f"Error getting job status for {job_id}: {str(e)}")
            return None
    
    def get_all_jobs(self) -> List[Dict[str, Any]]:
        """
        Get all scheduled jobs
        
        Returns:
            List of job information dictionaries
        """
        jobs = []
        try:
            for job in self.scheduler.get_jobs():
                jobs.append({
                    "job_id": job.id,
                    "name": job.name,
                    "next_run_time": job.next_run_time.isoformat() if job.next_run_time else None,
                    "func": job.func.__name__ if hasattr(job.func, '__name__') else str(job.func),
                })
        except Exception as e:
            logger.error(f"Error getting all jobs: {str(e)}")
        return jobs
    
    def get_scheduler_status(self) -> Dict[str, Any]:
        """
        Get overall scheduler status and statistics
        
        Returns:
            Scheduler status information
        """
        try:
            jobs = self.scheduler.get_jobs()
            return {
                "scheduler_running": self.scheduler.running,
                "total_jobs": len(jobs),
                "jobs": [
                    {
                        "job_id": job.id,
                        "name": job.name,
                        "next_run_time": job.next_run_time.isoformat() if job.next_run_time else None,
                        "func": job.func.__name__ if hasattr(job.func, '__name__') else str(job.func),
                    }
                    for job in jobs
                ],
                "jobstore": str(type(self.scheduler.jobstores['default']).__name__),
                "timezone": str(self.scheduler.timezone) if hasattr(self.scheduler, 'timezone') else None
            }
        except Exception as e:
            logger.error(f"Error getting scheduler status: {str(e)}")
            return {
                "scheduler_running": False,
                "error": str(e)
            }
    
    def remove_job(self, job_id: str) -> bool:
        """
        Remove a scheduled job
        
        Args:
            job_id: Job ID to remove
        
        Returns:
            True if job was removed, False otherwise
        """
        try:
            self.scheduler.remove_job(job_id)
            logger.info(f"Job removed: {job_id}")
            return True
        except Exception as e:
            logger.error(f"Error removing job {job_id}: {str(e)}")
            return False
    
    def shutdown(self):
        """Shutdown the scheduler"""
        self.scheduler.shutdown()
        logger.info("Scheduler service shut down")


# Standalone job functions to avoid serialization issues
async def sync_members_job():
    """Job to sync members from WODIFY"""
    try:
        logger.info("Executing scheduled members sync")
        result = await sync_service.sync_members(force=False)
        if result.get("success"):
            logger.info(f"Members sync completed: {result.get('synced', 0)} synced")
        else:
            logger.error(f"Members sync failed: {result.get('error', 'Unknown error')}")
    except Exception as e:
        logger.error(f"Error in members sync job: {str(e)}")


async def sync_leads_job():
    """Job to sync leads from WODIFY"""
    try:
        logger.info("Executing scheduled leads sync")
        result = await sync_service.sync_leads(force=False)
        if result.get("success"):
            logger.info(f"Leads sync completed: {result.get('synced', 0)} synced")
        else:
            logger.error(f"Leads sync failed: {result.get('error', 'Unknown error')}")
    except Exception as e:
        logger.error(f"Error in leads sync job: {str(e)}")


# Global scheduler service instance
scheduler_service = SchedulerService()

