"""
G3 CrossFit WODIFY Automation - Email Service
"""

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content
from jinja2 import Environment, FileSystemLoader
from pathlib import Path
from typing import Dict, Optional
from loguru import logger
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
import uuid
from datetime import datetime

from config.settings import settings

# Initialize Sentry if available
try:
    import sentry_sdk
    SENTRY_AVAILABLE = True
except ImportError:
    SENTRY_AVAILABLE = False


class EmailService:
    """Service for sending emails via SendGrid"""
    
    def __init__(self):
        self.sg_client = SendGridAPIClient(settings.sendgrid_api_key)
        self.from_email = Email(settings.sendgrid_from_email, settings.sendgrid_from_name)
        
        # Setup Jinja2 template environment
        template_dir = Path(__file__).parent.parent.parent / "templates" / "email"
        self.jinja_env = Environment(loader=FileSystemLoader(str(template_dir)))
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type(Exception),
        reraise=True
    )
    async def send_email(
        self,
        to_email: str,
        to_name: str,
        subject: str,
        html_content: str,
        plain_text_content: Optional[str] = None
    ) -> tuple[bool, Optional[str]]:
        """
        Send an email via SendGrid with automatic retry logic

        Args:
            to_email: Recipient email address
            to_name: Recipient name
            subject: Email subject
            html_content: HTML email content
            plain_text_content: Plain text email content (optional)

        Returns:
            Tuple of (success: bool, message_id: Optional[str])
        """
        try:
            to = To(to_email, to_name)
            
            message = Mail(
                from_email=self.from_email,
                to_emails=to,
                subject=subject,
                html_content=Content("text/html", html_content)
            )
            
            if plain_text_content:
                message.add_content(Content("text/plain", plain_text_content))
            
            response = self.sg_client.send(message)
            
            if response.status_code in [200, 201, 202]:
                message_id = response.headers.get('X-Message-Id', str(uuid.uuid4()))
                logger.info(f"Email sent successfully to {to_email} - Message ID: {message_id}")
                
                # Track email delivery metrics
                self._track_email_delivery(to_email, message_id, "sent", subject)
                
                return True, message_id
            else:
                error_msg = f"Failed to send email to {to_email} - Status: {response.status_code}"
                logger.error(error_msg)
                
                # Track email delivery failure
                self._track_email_delivery(to_email, None, "failed", subject, error_msg)
                
                # Report to Sentry
                if SENTRY_AVAILABLE:
                    sentry_sdk.capture_message(
                        f"Email delivery failed: {error_msg}",
                        level="error",
                        extra={
                            "email": to_email,
                            "status_code": response.status_code,
                            "subject": subject
                        }
                    )
                
                return False, None
                
        except Exception as e:
            error_msg = f"Error sending email to {to_email}: {str(e)}"
            logger.error(error_msg)
            
            # Track email delivery error
            self._track_email_delivery(to_email, None, "error", subject, error_msg)
            
            # Report to Sentry
            if SENTRY_AVAILABLE:
                sentry_sdk.capture_exception(e, extra={
                    "email": to_email,
                    "subject": subject
                })
            
            return False, None
    
    def render_template(self, template_name: str, context: Dict) -> str:
        """
        Render an email template with context
        
        Args:
            template_name: Name of the template file (e.g., 'welcome.html')
            context: Dictionary of template variables
        
        Returns:
            Rendered HTML string
        """
        try:
            # Add global context variables
            context.update({
                'g3_phone': settings.g3_phone,
                'g3_email': settings.g3_email,
                'g3_website': settings.g3_website,
                'g3_address': settings.g3_address,
                'g3_facebook_group': settings.g3_facebook_group,
                'wodify_schedule_url': settings.wodify_schedule_url,
            })
            
            template = self.jinja_env.get_template(template_name)
            return template.render(**context)
        except Exception as e:
            logger.error(f"Error rendering template {template_name}: {str(e)}")
            raise
    
    async def send_welcome_email(
        self,
        first_name: str,
        last_name: str,
        email: str,
        membership_type: str,
        start_date: str,
        monthly_price: float,
        is_first_membership: bool = True,
        referral_source: Optional[str] = None
    ) -> tuple[bool, Optional[str]]:
        """
        Send welcome email to new member with enhanced personalization
        
        Args:
            first_name: Member's first name
            last_name: Member's last name
            email: Member's email address
            membership_type: Type of membership
            start_date: Membership start date
            monthly_price: Monthly membership price
            is_first_membership: Whether this is the member's first membership
            referral_source: Source of referral (optional)
        
        Returns:
            Tuple of (success: bool, message_id: Optional[str])
        """
        context = {
            'first_name': first_name,
            'last_name': last_name,
            'membership_type': membership_type,
            'start_date': start_date,
            'monthly_price': monthly_price,
            'is_first_membership': is_first_membership,
            'referral_source': referral_source,
        }
        
        html_content = self.render_template('welcome.html', context)
        
        # Personalized subject line based on membership type
        if is_first_membership:
            subject = f"Willkommen in der G3 CrossFit Familie, {first_name}! 🎉"
        else:
            subject = f"Willkommen zurück, {first_name}! 🎉"
        
        return await self.send_email(
            to_email=email,
            to_name=f"{first_name} {last_name}",
            subject=subject,
            html_content=html_content
        )
    
    async def send_team_notification_email(
        self,
        first_name: str,
        last_name: str,
        email: str,
        phone: Optional[str],
        membership_type: str,
        start_date: str,
        monthly_price: float,
        client_id: str,
        is_first_membership: bool = True,
        referral_source: Optional[str] = None
    ) -> tuple[bool, Optional[str]]:
        """
        Send team notification email about new member with enhanced information
        
        Args:
            first_name: Member's first name
            last_name: Member's last name
            email: Member's email address
            phone: Member's phone number
            membership_type: Type of membership
            start_date: Membership start date
            monthly_price: Monthly membership price
            client_id: WODIFY client ID
            is_first_membership: Whether this is the member's first membership
            referral_source: Source of referral (optional)
        
        Returns:
            Tuple of (success: bool, message_id: Optional[str])
        """
        context = {
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'phone': phone or 'Nicht angegeben',
            'membership_type': membership_type,
            'start_date': start_date,
            'monthly_price': monthly_price,
            'client_id': client_id,
            'is_first_membership': is_first_membership,
            'referral_source': referral_source or 'Nicht angegeben',
            'wodify_profile_url': f"{settings.wodify_app_url}/Client/Profile?id={client_id}"
        }
        
        html_content = self.render_template('team_notification.html', context)
        
        # Enhanced subject line
        if is_first_membership:
            subject = f"🎉 Neues Mitglied: {first_name} {last_name} (Erste Mitgliedschaft)"
        else:
            subject = f"🔄 Neues Mitglied: {first_name} {last_name} (Wiederkehrend)"
        
        return await self.send_email(
            to_email=settings.g3_email,
            to_name="G3 CrossFit Team",
            subject=subject,
            html_content=html_content
        )
    
    async def send_lead_nurturing_email(
        self,
        first_name: str,
        last_name: str,
        email: str
    ) -> tuple[bool, Optional[str]]:
        """
        Send lead nurturing email to interested prospect
        
        Args:
            first_name: Lead's first name
            last_name: Lead's last name
            email: Lead's email address
        
        Returns:
            Tuple of (success: bool, message_id: Optional[str])
        """
        context = {
            'first_name': first_name,
            'last_name': last_name,
        }
        
        html_content = self.render_template('lead_nurturing.html', context)
        subject = f"Hast du noch Fragen zu deiner Mitgliedschaft, {first_name}?"
        
        return await self.send_email(
            to_email=email,
            to_name=f"{first_name} {last_name}",
            subject=subject,
            html_content=html_content
        )
    
    async def send_lead_response_email(
        self,
        first_name: str,
        last_name: str,
        email: str,
        interested_in: Optional[str] = None,
        phone: Optional[str] = None
    ) -> tuple[bool, Optional[str]]:
        """
        Send lead response email (within 5 minutes of lead creation) with enhanced personalization
        
        Args:
            first_name: Lead's first name
            last_name: Lead's last name
            email: Lead's email address
            interested_in: What the lead is interested in (optional)
            phone: Lead's phone number (optional)
        
        Returns:
            Tuple of (success: bool, message_id: Optional[str])
        """
        context = {
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'interested_in': interested_in,
            'phone': phone,
        }
        
        html_content = self.render_template('lead_response.html', context)
        
        # Personalized subject line
        if interested_in:
            subject = f"Vielen Dank für dein Interesse an {interested_in}, {first_name}!"
        else:
            subject = f"Vielen Dank für dein Interesse, {first_name}!"
        
        return await self.send_email(
            to_email=email,
            to_name=f"{first_name} {last_name}",
            subject=subject,
            html_content=html_content
        )
    
    async def send_trial_confirmation_email(
        self,
        first_name: str,
        last_name: str,
        email: str,
        class_name: str,
        class_date: str,
        class_time: str,
        coach_name: Optional[str] = None,
        booking_id: Optional[str] = None
    ) -> tuple[bool, Optional[str]]:
        """
        Send trial class confirmation email with calendar integration
        
        Args:
            first_name: User's first name
            last_name: User's last name
            email: User's email address
            class_name: Name of the class
            class_date: Date of the class (YYYY-MM-DD)
            class_time: Time of the class (HH:MM)
            coach_name: Name of the coach (optional)
            booking_id: Booking ID for calendar link (optional)
        
        Returns:
            Tuple of (success: bool, message_id: Optional[str])
        """
        # Generate Google Calendar link
        from datetime import datetime as dt
        calendar_link = None
        try:
            # Parse date and time
            class_datetime = dt.strptime(f"{class_date} {class_time}", "%Y-%m-%d %H:%M")
            end_datetime = class_datetime.replace(hour=class_datetime.hour + 1)  # 1 hour duration
            
            # Format for Google Calendar
            start_str = class_datetime.strftime("%Y%m%dT%H%M%S")
            end_str = end_datetime.strftime("%Y%m%dT%H%M%S")
            
            # Create Google Calendar link
            title = f"Probetraining: {class_name} - G3 CrossFit"
            details = f"Probetraining bei G3 CrossFit\n\nKurs: {class_name}\nTrainer: {coach_name or 'TBD'}\n\nAdresse: {settings.g3_address}"
            location = settings.g3_address
            
            calendar_link = (
                f"https://calendar.google.com/calendar/render?"
                f"action=TEMPLATE&"
                f"text={title.replace(' ', '+')}&"
                f"dates={start_str}/{end_str}&"
                f"details={details.replace(' ', '+').replace(chr(10), '%0A')}&"
                f"location={location.replace(' ', '+')}"
            )
        except Exception as e:
            logger.warning(f"Failed to generate calendar link: {str(e)}")
        
        context = {
            'first_name': first_name,
            'last_name': last_name,
            'class_name': class_name,
            'class_date': class_date,
            'class_time': class_time,
            'coach_name': coach_name or 'TBD',
            'calendar_link': calendar_link,
            'booking_id': booking_id,
        }
        
        html_content = self.render_template('trial_confirmation.html', context)
        subject = f"✅ Probetraining bestätigt - {class_name} am {class_date}"
        
        return await self.send_email(
            to_email=email,
            to_name=f"{first_name} {last_name}",
            subject=subject,
            html_content=html_content
        )
    
    async def send_trial_reminder_email(
        self,
        first_name: str,
        last_name: str,
        email: str,
        class_name: str,
        class_date: str,
        class_time: str,
        coach_name: Optional[str] = None
    ) -> tuple[bool, Optional[str]]:
        """
        Send trial class reminder email (24 hours before)
        
        Args:
            first_name: User's first name
            last_name: User's last name
            email: User's email address
            class_name: Name of the class
            class_date: Date of the class
            class_time: Time of the class
            coach_name: Name of the coach (optional)
        
        Returns:
            Tuple of (success: bool, message_id: Optional[str])
        """
        context = {
            'first_name': first_name,
            'last_name': last_name,
            'class_name': class_name,
            'class_date': class_date,
            'class_time': class_time,
            'coach_name': coach_name or 'TBD',
        }
        
        html_content = self.render_template('trial_reminder.html', context)
        subject = f"⏰ Erinnerung: Dein Probetraining morgen - {class_name}"
        
        return await self.send_email(
            to_email=email,
            to_name=f"{first_name} {last_name}",
            subject=subject,
            html_content=html_content
        )
    
    async def send_trial_followup_email(
        self,
        first_name: str,
        last_name: str,
        email: str,
        booking_id: Optional[str] = None,
        class_name: Optional[str] = None
    ) -> tuple[bool, Optional[str]]:
        """
        Send trial class follow-up email (24 hours after) with feedback form integration
        
        Args:
            first_name: User's first name
            last_name: User's last name
            email: User's email address
            booking_id: Booking ID for feedback link (optional)
            class_name: Class name for personalization (optional)
        
        Returns:
            Tuple of (success: bool, message_id: Optional[str])
        """
        # Generate feedback link
        feedback_link = None
        if booking_id:
            feedback_link = f"{settings.g3_website}/feedback/trial?booking_id={booking_id}&email={email}"
        
        context = {
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'booking_id': booking_id,
            'class_name': class_name,
            'feedback_link': feedback_link,
        }
        
        html_content = self.render_template('trial_followup.html', context)
        
        # Personalized subject line
        if class_name:
            subject = f"Wie war dein Probetraining '{class_name}', {first_name}?"
        else:
            subject = f"Wie war dein Probetraining, {first_name}?"
        
        return await self.send_email(
            to_email=email,
            to_name=f"{first_name} {last_name}",
            subject=subject,
            html_content=html_content
        )
    
    async def send_lead_nurturing_2_email(
        self,
        first_name: str,
        last_name: str,
        email: str,
        lead_id: Optional[str] = None,
        interested_in: Optional[str] = None
    ) -> tuple[bool, Optional[str]]:
        """
        Send lead nurturing email (Day 2) with enhanced personalization
        
        Args:
            first_name: Lead's first name
            last_name: Lead's last name
            email: Lead's email address
            lead_id: Lead ID for opt-out link (optional)
            interested_in: What the lead is interested in (optional)
        
        Returns:
            Tuple of (success: bool, message_id: Optional[str])
        """
        context = {
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'lead_id': lead_id,
            'interested_in': interested_in,
        }
        
        html_content = self.render_template('lead_nurturing_2.html', context)
        
        # Personalized subject line
        if interested_in:
            subject = f"Weitere Informationen zu {interested_in}, {first_name}"
        else:
            subject = f"Weitere Informationen für dich, {first_name}"
        
        return await self.send_email(
            to_email=email,
            to_name=f"{first_name} {last_name}",
            subject=subject,
            html_content=html_content
        )
    
    async def send_lead_nurturing_5_email(
        self,
        first_name: str,
        last_name: str,
        email: str,
        lead_id: Optional[str] = None,
        interested_in: Optional[str] = None
    ) -> tuple[bool, Optional[str]]:
        """
        Send lead nurturing email (Day 5) - Success stories & tips with enhanced personalization
        
        Args:
            first_name: Lead's first name
            last_name: Lead's last name
            email: Lead's email address
            lead_id: Lead ID for opt-out link (optional)
            interested_in: What the lead is interested in (optional)
        
        Returns:
            Tuple of (success: bool, message_id: Optional[str])
        """
        context = {
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'lead_id': lead_id,
            'interested_in': interested_in,
        }
        
        html_content = self.render_template('lead_nurturing_5.html', context)
        subject = f"Erfolgsgeschichten & Tipps für {first_name} - G3 CrossFit"
        
        return await self.send_email(
            to_email=email,
            to_name=f"{first_name} {last_name}",
            subject=subject,
            html_content=html_content
        )
    
    async def send_lead_nurturing_7_email(
        self,
        first_name: str,
        last_name: str,
        email: str,
        lead_id: Optional[str] = None,
        interested_in: Optional[str] = None
    ) -> tuple[bool, Optional[str]]:
        """
        Send lead nurturing email (Day 7) - Final offer with opt-out link
        
        Args:
            first_name: Lead's first name
            last_name: Lead's last name
            email: Lead's email address
            lead_id: Lead ID for opt-out link (required for opt-out functionality)
            interested_in: What the lead is interested in (optional)
        
        Returns:
            Tuple of (success: bool, message_id: Optional[str])
        """
        context = {
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'lead_id': lead_id,
            'interested_in': interested_in,
        }
        
        html_content = self.render_template('lead_nurturing_7.html', context)
        subject = f"Letzte Chance: Spezielles Angebot für dich, {first_name}!"
        
        return await self.send_email(
            to_email=email,
            to_name=f"{first_name} {last_name}",
            subject=subject,
            html_content=html_content
        )


    def _track_email_delivery(
        self,
        to_email: str,
        message_id: Optional[str],
        status: str,
        subject: str,
        error_msg: Optional[str] = None
    ):
        """
        Track email delivery metrics for monitoring
        
        Args:
            to_email: Recipient email
            message_id: SendGrid message ID
            status: Delivery status (sent, failed, error)
            subject: Email subject
            error_msg: Error message if status is failed/error
        """
        try:
            # Log metrics for monitoring
            logger.info(
                f"Email delivery tracked: {status} | "
                f"To: {to_email} | "
                f"Message ID: {message_id} | "
                f"Subject: {subject[:50]}..."
            )
            
            # Store metrics in database for monitoring dashboard
            # This can be extended to write to a metrics table
            from src.services.database_service import database_service
            database_service.log_email(
                email_type=f"email_delivery_{status}",
                recipient_email=to_email,
                recipient_name="",
                sendgrid_message_id=message_id,
                related_client_id=None,
                related_lead_id=None
            )
            
        except Exception as e:
            # Don't fail email sending if tracking fails
            logger.warning(f"Failed to track email delivery metrics: {str(e)}")


# Global email service instance
email_service = EmailService()
