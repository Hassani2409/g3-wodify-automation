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

from config.settings import settings


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
                return True, message_id
            else:
                logger.error(f"Failed to send email to {to_email} - Status: {response.status_code}")
                return False, None
                
        except Exception as e:
            logger.error(f"Error sending email to {to_email}: {str(e)}")
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
        monthly_price: float
    ) -> tuple[bool, Optional[str]]:
        """
        Send welcome email to new member
        
        Args:
            first_name: Member's first name
            last_name: Member's last name
            email: Member's email address
            membership_type: Type of membership
            start_date: Membership start date
            monthly_price: Monthly membership price
        
        Returns:
            Tuple of (success: bool, message_id: Optional[str])
        """
        context = {
            'first_name': first_name,
            'last_name': last_name,
            'membership_type': membership_type,
            'start_date': start_date,
            'monthly_price': monthly_price,
        }
        
        html_content = self.render_template('welcome.html', context)
        subject = f"Willkommen bei G3 CrossFit, {first_name}! 🎉"
        
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
        client_id: str
    ) -> tuple[bool, Optional[str]]:
        """
        Send team notification email about new member
        
        Args:
            first_name: Member's first name
            last_name: Member's last name
            email: Member's email address
            phone: Member's phone number
            membership_type: Type of membership
            start_date: Membership start date
            monthly_price: Monthly membership price
            client_id: WODIFY client ID
        
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
            'wodify_profile_url': f"{settings.wodify_app_url}/Client/Profile?id={client_id}"
        }
        
        html_content = self.render_template('team_notification.html', context)
        subject = f"Neues Mitglied: {first_name} {last_name}"
        
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


# Global email service instance
email_service = EmailService()
