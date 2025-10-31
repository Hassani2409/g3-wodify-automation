"""
G3 CrossFit WODIFY Automation - Configuration Settings
"""

from pydantic_settings import BaseSettings
from pydantic import Field
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Application Settings
    app_name: str = Field(default="G3 CrossFit WODIFY Automation", env="APP_NAME")
    app_env: str = Field(default="development", env="APP_ENV")
    debug: bool = Field(default=True, env="DEBUG")
    log_level: str = Field(default="INFO", env="LOG_LEVEL")
    
    # Server Configuration
    host: str = Field(default="0.0.0.0", env="HOST")
    port: int = Field(default=8000, env="PORT")
    
    # Database Configuration
    database_url: str = Field(default="sqlite:///./g3_wodify.db", env="DATABASE_URL")
    
    # WODIFY Configuration
    wodify_webhook_secret: str = Field(env="WODIFY_WEBHOOK_SECRET")
    wodify_tenant: str = Field(default="g3crossfit", env="WODIFY_TENANT")
    wodify_app_url: str = Field(default="https://app.wodify.com", env="WODIFY_APP_URL")
    wodify_schedule_url: str = Field(
        default="https://g3-cross-fit-53cc52df.base44.app/Schedule",
        env="WODIFY_SCHEDULE_URL"
    )
    
    # SendGrid Email Configuration
    sendgrid_api_key: str = Field(env="SENDGRID_API_KEY")
    sendgrid_from_email: str = Field(default="info@g3crossfit.com", env="SENDGRID_FROM_EMAIL")
    sendgrid_from_name: str = Field(default="G3 CrossFit", env="SENDGRID_FROM_NAME")
    
    # G3 CrossFit Information
    g3_phone: str = Field(default="+49 30 12345678", env="G3_PHONE")
    g3_email: str = Field(default="info@g3crossfit.com", env="G3_EMAIL")
    g3_website: str = Field(
        default="https://g3-cross-fit-53cc52df.base44.app",
        env="G3_WEBSITE"
    )
    g3_address: str = Field(default="Musterstraße 123, 10115 Berlin", env="G3_ADDRESS")
    g3_facebook_group: str = Field(
        default="https://facebook.com/groups/g3crossfit",
        env="G3_FACEBOOK_GROUP"
    )
    
    # Slack Integration (Optional)
    slack_webhook_url: Optional[str] = Field(default=None, env="SLACK_WEBHOOK_URL")
    slack_channel: str = Field(default="#neue-mitglieder", env="SLACK_CHANNEL")

    # Monitoring & Error Tracking
    sentry_dsn: Optional[str] = Field(default=None, env="SENTRY_DSN")

    # Feature Flags
    enable_welcome_email: bool = Field(default=True, env="ENABLE_WELCOME_EMAIL")
    enable_team_notification: bool = Field(default=True, env="ENABLE_TEAM_NOTIFICATION")
    enable_lead_nurturing: bool = Field(default=True, env="ENABLE_LEAD_NURTURING")
    enable_slack_notifications: bool = Field(default=False, env="ENABLE_SLACK_NOTIFICATIONS")
    
    # Email Timing
    welcome_email_delay_minutes: int = Field(default=5, env="WELCOME_EMAIL_DELAY_MINUTES")
    lead_nurturing_delay_hours: int = Field(default=24, env="LEAD_NURTURING_DELAY_HOURS")
    lead_followup_delay_days: int = Field(default=7, env="LEAD_FOLLOWUP_DELAY_DAYS")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


# Global settings instance
settings = Settings()
