"""
G3 CrossFit WODIFY Automation - Database Service
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from loguru import logger
import uuid
import json
from datetime import datetime
from typing import Optional

from config.settings import settings
from src.models.database import Base, Member, Lead, WebhookLog, EmailLog, MembershipStatusDB, LeadStatusDB, LeadNurturingStateDB
from src.models.wodify import WodifyMembershipCreated, WodifyLeadCreated, WodifyWebhookPayload


class DatabaseService:
    """Service for database operations"""
    
    def __init__(self):
        self.engine = create_engine(settings.database_url, echo=settings.debug)
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        
        # Create tables if they don't exist
        Base.metadata.create_all(bind=self.engine)
        logger.info("Database initialized")
    
    def get_session(self) -> Session:
        """Get a database session"""
        return self.SessionLocal()
    
    async def create_member(self, membership_data: WodifyMembershipCreated):
        """
        Create or update member in database
        
        Args:
            membership_data: Membership data from WODIFY
        """
        session = self.get_session()
        try:
            # Check if member already exists
            existing_member = session.query(Member).filter(
                Member.client_id == membership_data.client_id
            ).first()
            
            if existing_member:
                # Update existing member
                existing_member.first_name = membership_data.first_name
                existing_member.last_name = membership_data.last_name
                existing_member.email = membership_data.email
                existing_member.phone = membership_data.phone
                existing_member.membership_id = membership_data.membership_id
                existing_member.membership_type = membership_data.membership_type
                existing_member.membership_status = MembershipStatusDB(membership_data.membership_status.value)
                existing_member.monthly_price = membership_data.monthly_price
                existing_member.start_date = membership_data.start_date
                existing_member.end_date = membership_data.end_date
                existing_member.updated_at = datetime.utcnow()
                
                logger.info(f"Updated existing member: {membership_data.client_id}")
            else:
                # Create new member
                new_member = Member(
                    client_id=membership_data.client_id,
                    first_name=membership_data.first_name,
                    last_name=membership_data.last_name,
                    email=membership_data.email,
                    phone=membership_data.phone,
                    membership_id=membership_data.membership_id,
                    membership_type=membership_data.membership_type,
                    membership_status=MembershipStatusDB(membership_data.membership_status.value),
                    monthly_price=membership_data.monthly_price,
                    start_date=membership_data.start_date,
                    end_date=membership_data.end_date,
                    is_first_membership=membership_data.is_first_membership,
                    referral_source=membership_data.referral_source,
                    emergency_contact=membership_data.emergency_contact
                )
                session.add(new_member)
                logger.info(f"Created new member: {membership_data.client_id}")
            
            session.commit()
            
        except Exception as e:
            session.rollback()
            logger.error(f"Error creating/updating member: {str(e)}")
            raise
        finally:
            session.close()
    
    async def create_lead(self, lead_data: WodifyLeadCreated):
        """
        Create or update lead in database
        
        Args:
            lead_data: Lead data from WODIFY
        """
        session = self.get_session()
        try:
            # Check if lead already exists
            existing_lead = session.query(Lead).filter(
                Lead.lead_id == lead_data.lead_id
            ).first()
            
            if existing_lead:
                # Update existing lead
                existing_lead.first_name = lead_data.first_name
                existing_lead.last_name = lead_data.last_name
                existing_lead.email = lead_data.email
                existing_lead.phone = lead_data.phone
                existing_lead.lead_status = LeadStatusDB(lead_data.lead_status.value)
                existing_lead.interested_in = lead_data.interested_in
                existing_lead.message = lead_data.message
                existing_lead.referral_source = lead_data.referral_source
                existing_lead.updated_at = datetime.utcnow()
                
                logger.info(f"Updated existing lead: {lead_data.lead_id}")
            else:
                # Create new lead
                new_lead = Lead(
                    lead_id=lead_data.lead_id,
                    first_name=lead_data.first_name,
                    last_name=lead_data.last_name,
                    email=lead_data.email,
                    phone=lead_data.phone,
                    lead_status=LeadStatusDB(lead_data.lead_status.value),
                    interested_in=lead_data.interested_in,
                    message=lead_data.message,
                    referral_source=lead_data.referral_source
                )
                session.add(new_lead)
                logger.info(f"Created new lead: {lead_data.lead_id}")
            
            session.commit()
            
        except Exception as e:
            session.rollback()
            logger.error(f"Error creating/updating lead: {str(e)}")
            raise
        finally:
            session.close()
    
    async def log_webhook(self, webhook_data: WodifyWebhookPayload):
        """
        Log webhook to database
        
        Args:
            webhook_data: Generic webhook data
        """
        session = self.get_session()
        try:
            webhook_log = WebhookLog(
                id=str(uuid.uuid4()),
                event_type=webhook_data.event_type,
                event_id=webhook_data.event_id,
                tenant=webhook_data.tenant,
                payload=json.dumps(webhook_data.data),
                processed=True,
                processed_at=datetime.utcnow()
            )
            session.add(webhook_log)
            session.commit()
            
            logger.info(f"Webhook logged: {webhook_data.event_type}")
            
        except Exception as e:
            session.rollback()
            logger.error(f"Error logging webhook: {str(e)}")
            raise
        finally:
            session.close()
    
    async def log_email(
        self,
        email_type: str,
        recipient_email: str,
        recipient_name: str,
        sendgrid_message_id: Optional[str] = None,
        related_client_id: Optional[str] = None,
        related_lead_id: Optional[str] = None
    ):
        """
        Log email to database
        
        Args:
            email_type: Type of email (welcome, team_notification, lead_nurturing, etc.)
            recipient_email: Recipient email address
            recipient_name: Recipient name
            sendgrid_message_id: SendGrid message ID
            related_client_id: Related member client ID
            related_lead_id: Related lead ID
        """
        session = self.get_session()
        try:
            email_log = EmailLog(
                id=str(uuid.uuid4()),
                email_type=email_type,
                recipient_email=recipient_email,
                recipient_name=recipient_name,
                sendgrid_message_id=sendgrid_message_id,
                sent=True,
                sent_at=datetime.utcnow(),
                related_client_id=related_client_id,
                related_lead_id=related_lead_id
            )
            session.add(email_log)
            session.commit()
            
            logger.info(f"Email logged: {email_type} to {recipient_email}")
            
        except Exception as e:
            session.rollback()
            logger.error(f"Error logging email: {str(e)}")
            raise
        finally:
            session.close()
    
    async def mark_welcome_email_sent(self, client_id: str, message_id: str):
        """
        Mark welcome email as sent for a member
        
        Args:
            client_id: Member client ID
            message_id: SendGrid message ID
        """
        session = self.get_session()
        try:
            member = session.query(Member).filter(Member.client_id == client_id).first()
            if member:
                member.welcome_email_sent = True
                member.welcome_email_sent_at = datetime.utcnow()
                session.commit()
                logger.info(f"Marked welcome email as sent for {client_id}")
            
        except Exception as e:
            session.rollback()
            logger.error(f"Error marking welcome email as sent: {str(e)}")
            raise
        finally:
            session.close()
    
    async def mark_nurturing_email_sent(self, lead_id: str, message_id: str):
        """
        Mark nurturing email as sent for a lead
        
        Args:
            lead_id: Lead ID
            message_id: SendGrid message ID
        """
        session = self.get_session()
        try:
            lead = session.query(Lead).filter(Lead.lead_id == lead_id).first()
            if lead:
                lead.nurturing_email_sent = True
                lead.nurturing_email_sent_at = datetime.utcnow()
                session.commit()
                logger.info(f"Marked nurturing email as sent for {lead_id}")
            
        except Exception as e:
            session.rollback()
            logger.error(f"Error marking nurturing email as sent: {str(e)}")
            raise
        finally:
            session.close()
    
    async def update_lead_nurturing_state(
        self,
        lead_id: str,
        state: str,
        response_email_sent: bool = False,
        nurturing_2_sent: bool = False,
        nurturing_5_sent: bool = False,
        nurturing_7_sent: bool = False,
        message_id: Optional[str] = None
    ):
        """
        Update lead nurturing state and email tracking
        
        Args:
            lead_id: Lead ID
            state: New nurturing state (NEW, RESPONDED, NURTURING_2, NURTURING_5, NURTURING_7, CONVERTED, OPTED_OUT)
            response_email_sent: Whether response email was sent
            nurturing_2_sent: Whether nurturing 2 email was sent
            nurturing_5_sent: Whether nurturing 5 email was sent
            nurturing_7_sent: Whether nurturing 7 email was sent
            message_id: SendGrid message ID (optional)
        """
        session = self.get_session()
        try:
            lead = session.query(Lead).filter(Lead.lead_id == lead_id).first()
            if lead:
                # Update state
                lead.nurturing_state = LeadNurturingStateDB(state)
                
                # Update email tracking flags
                if response_email_sent:
                    lead.response_email_sent = True
                    lead.response_email_sent_at = datetime.utcnow()
                if nurturing_2_sent:
                    lead.nurturing_2_sent = True
                    lead.nurturing_2_sent_at = datetime.utcnow()
                if nurturing_5_sent:
                    lead.nurturing_5_sent = True
                    lead.nurturing_5_sent_at = datetime.utcnow()
                if nurturing_7_sent:
                    lead.nurturing_7_sent = True
                    lead.nurturing_7_sent_at = datetime.utcnow()
                
                lead.updated_at = datetime.utcnow()
                session.commit()
                logger.info(f"Updated nurturing state for {lead_id} to {state}")
            else:
                logger.warning(f"Lead {lead_id} not found for state update")
            
        except Exception as e:
            session.rollback()
            logger.error(f"Error updating lead nurturing state: {str(e)}")
            raise
        finally:
            session.close()
    
    async def mark_welcome_email_sent(self, client_id: str, message_id: str):
        """
        Mark welcome email as sent for a member
        
        Args:
            client_id: Member client ID
            message_id: SendGrid message ID
        """
        session = self.get_session()
        try:
            member = session.query(Member).filter(Member.client_id == client_id).first()
            if member:
                member.welcome_email_sent = True
                member.welcome_email_sent_at = datetime.utcnow()
                session.commit()
                logger.info(f"Marked welcome email as sent for {client_id}")
            
        except Exception as e:
            session.rollback()
            logger.error(f"Error marking welcome email as sent: {str(e)}")
            raise
        finally:
            session.close()
    
    async def opt_out_lead(self, lead_id: str, email: str) -> bool:
        """
        Opt out a lead from nurturing emails
        
        Args:
            lead_id: Lead ID (optional, can be None)
            email: Lead email address
        
        Returns:
            True if opt-out was successful, False otherwise
        """
        session = self.get_session()
        try:
            # Try to find lead by ID first, then by email
            lead = None
            if lead_id:
                lead = session.query(Lead).filter(Lead.lead_id == lead_id).first()
            
            if not lead and email:
                lead = session.query(Lead).filter(Lead.email == email).first()
            
            if lead:
                lead.opted_out = True
                lead.opted_out_at = datetime.utcnow()
                lead.nurturing_state = LeadNurturingStateDB.OPTED_OUT
                session.commit()
                logger.info(f"Lead opted out: {lead_id or email}")
                return True
            else:
                logger.warning(f"Lead not found for opt-out: {lead_id or email}")
                return False
            
        except Exception as e:
            session.rollback()
            logger.error(f"Error opting out lead: {str(e)}")
            raise
        finally:
            session.close()
    
    async def cancel_nurturing_jobs(self, lead_id: str):
        """
        Cancel all scheduled nurturing jobs for a lead
        
        Args:
            lead_id: Lead ID
        """
        try:
            from src.services.scheduler_service import scheduler_service
            
            # Get all jobs for this lead
            jobs = scheduler_service.get_all_jobs()
            cancelled_count = 0
            
            for job in jobs:
                job_id = job.get("job_id", "")
                if f"nurturing_" in job_id and lead_id in job_id:
                    if scheduler_service.remove_job(job_id):
                        cancelled_count += 1
                        logger.info(f"Cancelled nurturing job: {job_id}")
            
            logger.info(f"Cancelled {cancelled_count} nurturing jobs for lead {lead_id}")
            
        except Exception as e:
            logger.error(f"Error cancelling nurturing jobs for {lead_id}: {str(e)}")
    
    async def mark_lead_as_converted(self, email: str, client_id: Optional[str] = None):
        """
        Mark a lead as converted to member when membership is created
        
        This method:
        1. Finds the lead by email
        2. Updates the lead state to CONVERTED
        3. Cancels all scheduled nurturing jobs
        4. Sets conversion timestamp
        
        Args:
            email: Lead email address
            client_id: Member client ID (optional, for reference)
        
        Returns:
            Lead ID if found and converted, None otherwise
        """
        session = self.get_session()
        try:
            # Find lead by email
            lead = session.query(Lead).filter(Lead.email == email).first()
            
            if lead:
                # Update lead state to CONVERTED
                lead.nurturing_state = LeadNurturingStateDB.CONVERTED
                lead.lead_status = LeadStatusDB.CONVERTED
                lead.converted_to_member = True
                lead.converted_at = datetime.utcnow()
                lead.updated_at = datetime.utcnow()
                
                session.commit()
                logger.info(f"Marked lead {lead.lead_id} as converted (Email: {email}, Client ID: {client_id})")
                
                # Cancel all scheduled nurturing jobs for this lead
                await self.cancel_nurturing_jobs(lead.lead_id)
                
                return lead.lead_id
            else:
                logger.info(f"No lead found for email {email} - may be a direct membership signup")
                return None
                
        except Exception as e:
            session.rollback()
            logger.error(f"Error marking lead as converted: {str(e)}")
            raise
        finally:
            session.close()


# Global database service instance
database_service = DatabaseService()
