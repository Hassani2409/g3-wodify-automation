"""
G3 CrossFit WODIFY Automation - Database Models
"""

from sqlalchemy import Column, String, Float, Boolean, DateTime, Text, Enum as SQLEnum, Integer, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum
import uuid


Base = declarative_base()


class MembershipStatusDB(str, enum.Enum):
    """Membership status enum for database"""
    ACTIVE = "Active"
    INACTIVE = "Inactive"
    PENDING = "Pending"
    CANCELLED = "Cancelled"


class LeadStatusDB(str, enum.Enum):
    """Lead status enum for database"""
    NEW = "New"
    INTERESTED = "Interested"
    CONTACTED = "Contacted"
    CONVERTED = "Converted"
    LOST = "Lost"


class LeadNurturingStateDB(str, enum.Enum):
    """Lead nurturing state enum for database"""
    NEW = "NEW"
    RESPONDED = "RESPONDED"  # Lead-Response gesendet
    NURTURING_2 = "NURTURING_2"  # Tag 2 E-Mail gesendet
    NURTURING_5 = "NURTURING_5"  # Tag 5 E-Mail gesendet
    NURTURING_7 = "NURTURING_7"  # Tag 7 E-Mail gesendet
    CONVERTED = "CONVERTED"  # Zu Mitglied konvertiert
    OPTED_OUT = "OPTED_OUT"  # Opt-out


class Member(Base):
    """Member database model"""
    __tablename__ = "members"
    
    # Primary Key
    client_id = Column(String, primary_key=True, index=True)
    
    # Member Information
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    phone = Column(String, nullable=True)
    
    # Membership Information
    membership_id = Column(String, nullable=False)
    membership_type = Column(String, nullable=False)
    membership_status = Column(SQLEnum(MembershipStatusDB), nullable=False)
    monthly_price = Column(Float, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=True)
    
    # Additional Information
    is_first_membership = Column(Boolean, default=True)
    referral_source = Column(String, nullable=True)
    emergency_contact = Column(String, nullable=True)
    
    # Email Tracking
    welcome_email_sent = Column(Boolean, default=False)
    welcome_email_sent_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class Lead(Base):
    """Lead database model"""
    __tablename__ = "leads"
    
    # Primary Key
    lead_id = Column(String, primary_key=True, index=True)
    
    # Lead Information
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, nullable=False, index=True)
    phone = Column(String, nullable=True)
    
    # Lead Status
    lead_status = Column(SQLEnum(LeadStatusDB), nullable=False, default=LeadStatusDB.NEW)
    interested_in = Column(String, nullable=True)
    
    # Additional Information
    message = Column(Text, nullable=True)
    referral_source = Column(String, nullable=True)
    
    # Nurturing State Management
    nurturing_state = Column(SQLEnum(LeadNurturingStateDB), nullable=False, default=LeadNurturingStateDB.NEW, index=True)
    
    # Email Tracking
    response_email_sent = Column(Boolean, default=False)
    response_email_sent_at = Column(DateTime, nullable=True)
    nurturing_email_sent = Column(Boolean, default=False)
    nurturing_email_sent_at = Column(DateTime, nullable=True)
    nurturing_2_sent = Column(Boolean, default=False)
    nurturing_2_sent_at = Column(DateTime, nullable=True)
    nurturing_5_sent = Column(Boolean, default=False)
    nurturing_5_sent_at = Column(DateTime, nullable=True)
    nurturing_7_sent = Column(Boolean, default=False)
    nurturing_7_sent_at = Column(DateTime, nullable=True)
    followup_email_sent = Column(Boolean, default=False)
    followup_email_sent_at = Column(DateTime, nullable=True)
    
    # Conversion Tracking
    converted_to_member = Column(Boolean, default=False)
    converted_at = Column(DateTime, nullable=True)
    opted_out = Column(Boolean, default=False)
    opted_out_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class WebhookLog(Base):
    """Webhook log database model"""
    __tablename__ = "webhook_logs"
    
    # Primary Key
    id = Column(String, primary_key=True, index=True)
    
    # Webhook Information
    event_type = Column(String, nullable=False, index=True)
    event_id = Column(String, nullable=False, unique=True, index=True)
    tenant = Column(String, nullable=False)
    
    # Payload
    payload = Column(Text, nullable=False)  # JSON string
    
    # Processing Status
    processed = Column(Boolean, default=False)
    processed_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)
    
    # Timestamps
    received_at = Column(DateTime, server_default=func.now())


class EmailLog(Base):
    """Email log database model"""
    __tablename__ = "email_logs"
    
    # Primary Key
    id = Column(String, primary_key=True, index=True)
    
    # Email Information
    email_type = Column(String, nullable=False, index=True)  # welcome, nurturing, followup, etc.
    recipient_email = Column(String, nullable=False, index=True)
    recipient_name = Column(String, nullable=False)
    
    # SendGrid Information
    sendgrid_message_id = Column(String, nullable=True)
    
    # Status
    sent = Column(Boolean, default=False)
    sent_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)
    
    # Related Records
    related_client_id = Column(String, nullable=True, index=True)
    related_lead_id = Column(String, nullable=True, index=True)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())


class User(Base):
    """User database model for authentication"""
    __tablename__ = "users"
    
    # Primary Key
    id = Column(String, primary_key=True, index=True)
    
    # User Information
    email = Column(String, unique=True, nullable=False, index=True)
    username = Column(String, unique=True, nullable=True, index=True)
    hashed_password = Column(String, nullable=False)
    
    # Profile Information
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    
    # Account Status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    
    # WODIFY Integration (optional)
    wodify_client_id = Column(String, nullable=True, index=True)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    last_login = Column(DateTime, nullable=True)


class ProductCategoryDB(str, enum.Enum):
    """Product category enum"""
    CLOTHING = "clothing"
    ACCESSORIES = "accessories"
    SUPPLEMENTS = "supplements"
    EQUIPMENT = "equipment"


class OrderStatusDB(str, enum.Enum):
    """Order status enum"""
    PENDING = "pending"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"


class Product(Base):
    """Product database model"""
    __tablename__ = "products"
    
    # Primary Key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    
    # Product Information
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    category = Column(SQLEnum(ProductCategoryDB), nullable=False, index=True)
    
    # Product Details
    images = Column(JSON, nullable=True)  # Array of image URLs
    sizes = Column(JSON, nullable=True)  # Array of available sizes
    in_stock = Column(Boolean, default=True, index=True)
    stock_quantity = Column(Integer, default=0)
    featured = Column(Boolean, default=False, index=True)
    
    # SEO & Metadata
    sku = Column(String, unique=True, nullable=True, index=True)
    weight = Column(Float, nullable=True)  # in kg
    dimensions = Column(JSON, nullable=True)  # {length, width, height}
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class CartItem(Base):
    """Shopping cart item database model"""
    __tablename__ = "cart_items"
    
    # Primary Key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    
    # Foreign Keys
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    product_id = Column(String, ForeignKey("products.id"), nullable=False, index=True)
    
    # Cart Item Details
    quantity = Column(Integer, nullable=False, default=1)
    size = Column(String, nullable=True)
    price_at_added = Column(Float, nullable=False)  # Store price at time of adding
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    product = relationship("Product", lazy="joined")
    user = relationship("User", lazy="joined")


class Order(Base):
    """Order database model"""
    __tablename__ = "orders"
    
    # Primary Key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    
    # Foreign Keys
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    
    # Order Information
    order_number = Column(String, unique=True, nullable=False, index=True)  # Human-readable order number
    status = Column(SQLEnum(OrderStatusDB), nullable=False, default=OrderStatusDB.PENDING, index=True)
    
    # Pricing
    subtotal = Column(Float, nullable=False)
    shipping_cost = Column(Float, nullable=False, default=0.0)
    total = Column(Float, nullable=False)
    currency = Column(String, default="EUR")
    
    # Payment Information
    stripe_session_id = Column(String, nullable=True, index=True)
    stripe_payment_intent_id = Column(String, nullable=True, index=True)
    payment_status = Column(String, nullable=True)  # paid, pending, failed
    paid_at = Column(DateTime, nullable=True)
    
    # Shipping Information
    shipping_name = Column(String, nullable=False)
    shipping_email = Column(String, nullable=False)
    shipping_phone = Column(String, nullable=True)
    shipping_address_line1 = Column(String, nullable=False)
    shipping_address_line2 = Column(String, nullable=True)
    shipping_city = Column(String, nullable=False)
    shipping_postal_code = Column(String, nullable=False)
    shipping_country = Column(String, nullable=False, default="DE")
    
    # Tracking
    tracking_number = Column(String, nullable=True)
    shipped_at = Column(DateTime, nullable=True)
    delivered_at = Column(DateTime, nullable=True)
    
    # Notes
    customer_notes = Column(Text, nullable=True)
    internal_notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now(), index=True)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", lazy="joined")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    """Order item database model"""
    __tablename__ = "order_items"
    
    # Primary Key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    
    # Foreign Keys
    order_id = Column(String, ForeignKey("orders.id"), nullable=False, index=True)
    product_id = Column(String, ForeignKey("products.id"), nullable=False, index=True)
    
    # Order Item Details
    product_name = Column(String, nullable=False)  # Store name at time of order
    product_sku = Column(String, nullable=True)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)  # Price at time of order
    size = Column(String, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product", lazy="joined")


class ProductReview(Base):
    """Product review database model"""
    __tablename__ = "product_reviews"
    
    # Primary Key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    
    # Foreign Keys
    product_id = Column(String, ForeignKey("products.id"), nullable=False, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    
    # Review Details
    rating = Column(Integer, nullable=False)  # 1-5 stars
    title = Column(String, nullable=True)
    comment = Column(Text, nullable=True)
    verified_purchase = Column(Boolean, default=False)
    
    # Helpful votes
    helpful_count = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now(), index=True)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    product = relationship("Product", lazy="joined")
    user = relationship("User", lazy="joined")


class WishlistItem(Base):
    """Wishlist item database model"""
    __tablename__ = "wishlist_items"
    
    # Primary Key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    
    # Foreign Keys
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    product_id = Column(String, ForeignKey("products.id"), nullable=False, index=True)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now(), index=True)
    
    # Relationships
    product = relationship("Product", lazy="joined")
    user = relationship("User", lazy="joined")
    
    # Unique constraint: one product per user in wishlist
    __table_args__ = (
        {"sqlite_autoincrement": True},
    )
