"""
Shop API Endpoints - Product catalog and shopping cart
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.responses import JSONResponse
from typing import List, Optional
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from sqlalchemy import and_
from loguru import logger
import uuid
from datetime import datetime

from src.models.database import (
    Product, CartItem, Order, OrderItem, ProductCategoryDB, OrderStatusDB,
    ProductReview, WishlistItem
)
from src.api.auth import get_current_user
from src.models.database import User
from src.database import get_db

router = APIRouter(prefix="/api/shop", tags=["shop"])


# Pydantic Models
class ProductResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    price: float
    category: str
    images: Optional[List[str]]
    sizes: Optional[List[str]]
    inStock: bool
    stock_quantity: int
    featured: bool
    sku: Optional[str]

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    products: List[ProductResponse]
    total: int


class AddToCartRequest(BaseModel):
    product_id: str
    quantity: int = 1
    size: Optional[str] = None


class CartItemResponse(BaseModel):
    id: str
    product_id: str
    product_name: str
    product_image: Optional[str]
    price: float
    quantity: int
    size: Optional[str]
    subtotal: float

    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    items: List[CartItemResponse]
    subtotal: float
    shipping_cost: float
    total: float


class CreateOrderRequest(BaseModel):
    shipping_name: str
    shipping_email: EmailStr
    shipping_phone: Optional[str]


class ReviewRequest(BaseModel):
    product_id: str
    rating: int
    title: Optional[str] = None
    comment: Optional[str] = None


class ReviewResponse(BaseModel):
    id: str
    product_id: str
    user_id: str
    user_name: Optional[str]
    rating: int
    title: Optional[str]
    comment: Optional[str]
    verified_purchase: bool
    helpful_count: int
    created_at: str

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: str
    order_number: str
    status: str
    subtotal: float
    shipping_cost: float
    total: float
    created_at: str
    items: List[dict]

    class Config:
        from_attributes = True


# Helper function to generate order number
def generate_order_number() -> str:
    """Generate a human-readable order number"""
    timestamp = datetime.now().strftime("%Y%m%d")
    random_part = str(uuid.uuid4())[:8].upper()
    return f"G3-{timestamp}-{random_part}"


# Product Endpoints
@router.get("/products", response_model=ProductListResponse)
async def get_products(
    category: Optional[str] = Query(None, description="Filter by category"),
    featured: Optional[bool] = Query(None, description="Filter featured products"),
    in_stock: Optional[bool] = Query(None, description="Filter in-stock products"),
    db: Session = Depends(get_db)
):
    """Get all products with optional filters"""
    try:
        query = db.query(Product)
        
        if category:
            query = query.filter(Product.category == category)
        
        if featured is not None:
            query = query.filter(Product.featured == featured)
        
        if in_stock is not None:
            query = query.filter(Product.in_stock == in_stock)
        
        products = query.all()
        
        # Convert to response format
        product_responses = []
        for product in products:
            product_responses.append(ProductResponse(
                id=product.id,
                name=product.name,
                description=product.description,
                price=product.price,
                category=product.category.value,
                images=product.images or [],
                sizes=product.sizes or [],
                inStock=product.in_stock,
                stock_quantity=product.stock_quantity,
                featured=product.featured,
                sku=product.sku
            ))
        
        return ProductListResponse(
            products=product_responses,
            total=len(product_responses)
        )
    except Exception as e:
        logger.error(f"Error fetching products: {str(e)}")
        raise HTTPException(status_code=500, detail="Fehler beim Laden der Produkte")


@router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str, db: Session = Depends(get_db)):
    """Get a single product by ID"""
    try:
        product = db.query(Product).filter(Product.id == product_id).first()
        
        if not product:
            raise HTTPException(status_code=404, detail="Produkt nicht gefunden")
        
        # Get average rating and review count
        reviews = db.query(ProductReview).filter(ProductReview.product_id == product_id).all()
        avg_rating = sum(r.rating for r in reviews) / len(reviews) if reviews else 0.0
        
        return ProductResponse(
            id=product.id,
            name=product.name,
            description=product.description,
            price=product.price,
            category=product.category.value,
            images=product.images or [],
            sizes=product.sizes or [],
            inStock=product.in_stock,
            stock_quantity=product.stock_quantity,
            featured=product.featured,
            sku=product.sku
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching product: {str(e)}")
        raise HTTPException(status_code=500, detail="Fehler beim Laden des Produkts")


# Cart Endpoints
@router.get("/cart", response_model=CartResponse)
async def get_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's shopping cart"""
    try:
        cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
        
        items = []
        subtotal = 0.0
        
        for item in cart_items:
            product = item.product
            item_subtotal = item.price_at_added * item.quantity
            subtotal += item_subtotal
            
            items.append(CartItemResponse(
                id=item.id,
                product_id=item.product_id,
                product_name=product.name,
                product_image=product.images[0] if product.images else None,
                price=item.price_at_added,
                quantity=item.quantity,
                size=item.size,
                subtotal=item_subtotal
            ))
        
        # Calculate shipping (free shipping over 50€)
        shipping_cost = 0.0 if subtotal >= 50.0 else 5.99
        total = subtotal + shipping_cost
        
        return CartResponse(
            items=items,
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            total=total
        )
    except Exception as e:
        logger.error(f"Error fetching cart: {str(e)}")
        raise HTTPException(status_code=500, detail="Fehler beim Laden des Warenkorbs")


@router.post("/cart")
async def add_to_cart(
    request: AddToCartRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add item to shopping cart"""
    try:
        # Get product
        product = db.query(Product).filter(Product.id == request.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Produkt nicht gefunden")
        
        if not product.in_stock:
            raise HTTPException(status_code=400, detail="Produkt ist nicht verfügbar")
        
        # Check if item already in cart
        existing_item = db.query(CartItem).filter(
            and_(
                CartItem.user_id == current_user.id,
                CartItem.product_id == request.product_id,
                CartItem.size == request.size
            )
        ).first()
        
        if existing_item:
            # Update quantity
            existing_item.quantity += request.quantity
            existing_item.updated_at = datetime.now()
        else:
            # Create new cart item
            cart_item = CartItem(
                user_id=current_user.id,
                product_id=request.product_id,
                quantity=request.quantity,
                size=request.size,
                price_at_added=product.price
            )
            db.add(cart_item)
        
        db.commit()
        
        return JSONResponse(
            status_code=200,
            content={"success": True, "message": "Produkt zum Warenkorb hinzugefügt"}
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error adding to cart: {str(e)}")
        raise HTTPException(status_code=500, detail="Fehler beim Hinzufügen zum Warenkorb")


@router.patch("/cart/{item_id}")
async def update_cart_item(
    item_id: str,
    quantity: int = Query(..., ge=1),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update cart item quantity"""
    try:
        cart_item = db.query(CartItem).filter(
            and_(
                CartItem.id == item_id,
                CartItem.user_id == current_user.id
            )
        ).first()
        
        if not cart_item:
            raise HTTPException(status_code=404, detail="Warenkorb-Item nicht gefunden")
        
        cart_item.quantity = quantity
        cart_item.updated_at = datetime.now()
        db.commit()
        
        return JSONResponse(
            status_code=200,
            content={"success": True, "message": "Warenkorb aktualisiert"}
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating cart item: {str(e)}")
        raise HTTPException(status_code=500, detail="Fehler beim Aktualisieren des Warenkorbs")


@router.delete("/cart/{item_id}")
async def remove_from_cart(
    item_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove item from cart"""
    try:
        cart_item = db.query(CartItem).filter(
            and_(
                CartItem.id == item_id,
                CartItem.user_id == current_user.id
            )
        ).first()
        
        if not cart_item:
            raise HTTPException(status_code=404, detail="Warenkorb-Item nicht gefunden")
        
        db.delete(cart_item)
        db.commit()
        
        return JSONResponse(
            status_code=200,
            content={"success": True, "message": "Item aus Warenkorb entfernt"}
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error removing from cart: {str(e)}")
        raise HTTPException(status_code=500, detail="Fehler beim Entfernen aus dem Warenkorb")


@router.delete("/cart")
async def clear_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Clear entire cart"""
    try:
        db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
        db.commit()
        
        return JSONResponse(
            status_code=200,
            content={"success": True, "message": "Warenkorb geleert"}
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Error clearing cart: {str(e)}")
        raise HTTPException(status_code=500, detail="Fehler beim Leeren des Warenkorbs")


# Order Endpoints
@router.post("/orders")
async def create_order(
    request: CreateOrderRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new order from cart"""
    try:
        # Get cart items
        cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
        
        if not cart_items:
            raise HTTPException(status_code=400, detail="Warenkorb ist leer")
        
        # Calculate totals
        subtotal = sum(item.price_at_added * item.quantity for item in cart_items)
        shipping_cost = 0.0 if subtotal >= 50.0 else 5.99
        total = subtotal + shipping_cost
        
        # Create order
        order = Order(
            user_id=current_user.id,
            order_number=generate_order_number(),
            status=OrderStatusDB.PENDING,
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            total=total,
            shipping_name=request.shipping_name,
            shipping_email=request.shipping_email,
            shipping_phone=request.shipping_phone,
            shipping_address_line1=request.shipping_address_line1,
            shipping_address_line2=request.shipping_address_line2,
            shipping_city=request.shipping_city,
            shipping_postal_code=request.shipping_postal_code,
            shipping_country=request.shipping_country,
            customer_notes=request.customer_notes
        )
        db.add(order)
        db.flush()  # Get order ID
        
        # Create order items
        for cart_item in cart_items:
            product = cart_item.product
            order_item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                product_name=product.name,
                product_sku=product.sku,
                quantity=cart_item.quantity,
                price=cart_item.price_at_added,
                size=cart_item.size
            )
            db.add(order_item)
        
        # Clear cart
        db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
        
        db.commit()
        
        return JSONResponse(
            status_code=201,
            content={
                "success": True,
                "order_id": order.id,
                "order_number": order.order_number,
                "total": total
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating order: {str(e)}")
        raise HTTPException(status_code=500, detail="Fehler beim Erstellen der Bestellung")


@router.get("/orders", response_model=List[OrderResponse])
async def get_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's orders"""
    try:
        orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()
        
        order_responses = []
        for order in orders:
            items = []
            for item in order.items:
                items.append({
                    "product_name": item.product_name,
                    "quantity": item.quantity,
                    "price": item.price,
                    "size": item.size
                })
            
            order_responses.append(OrderResponse(
                id=order.id,
                order_number=order.order_number,
                status=order.status.value,
                subtotal=order.subtotal,
                shipping_cost=order.shipping_cost,
                total=order.total,
                created_at=order.created_at.isoformat(),
                items=items
            ))
        
        return order_responses
    except Exception as e:
        logger.error(f"Error fetching orders: {str(e)}")
        raise HTTPException(status_code=500, detail="Fehler beim Laden der Bestellungen")


@router.get("/orders/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a single order by ID"""
    try:
        order = db.query(Order).filter(
            and_(
                Order.id == order_id,
                Order.user_id == current_user.id
            )
        ).first()
        
        if not order:
            raise HTTPException(status_code=404, detail="Bestellung nicht gefunden")
        
        items = []
        for item in order.items:
            items.append({
                "product_name": item.product_name,
                "quantity": item.quantity,
                "price": item.price,
                "size": item.size
            })
        
        return OrderResponse(
            id=order.id,
            order_number=order.order_number,
            status=order.status.value,
            subtotal=order.subtotal,
            shipping_cost=order.shipping_cost,
            total=order.total,
            created_at=order.created_at.isoformat(),
            items=items
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching order: {str(e)}")
        raise HTTPException(status_code=500, detail="Fehler beim Laden der Bestellung")


# Review Endpoints
@router.post("/reviews")
async def create_review(
    request: ReviewRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a product review"""
    try:
        # Validate rating
        if request.rating < 1 or request.rating > 5:
            raise HTTPException(status_code=400, detail="Bewertung muss zwischen 1 und 5 liegen")
        
        # Check if product exists
        product = db.query(Product).filter(Product.id == request.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Produkt nicht gefunden")
        
        # Check if user already reviewed this product
        existing_review = db.query(ProductReview).filter(
            and_(
                ProductReview.product_id == request.product_id,
                ProductReview.user_id == current_user.id
            )
        ).first()
        
        if existing_review:
            raise HTTPException(status_code=400, detail="Du hast dieses Produkt bereits bewertet")
        
        # Check if user has purchased this product (for verified purchase badge)
        verified_purchase = db.query(OrderItem).join(Order).filter(
            and_(
                Order.user_id == current_user.id,
                OrderItem.product_id == request.product_id,
                Order.status.in_([OrderStatusDB.COMPLETED, OrderStatusDB.DELIVERED])
            )
        ).first() is not None
        
        # Create review
        review = ProductReview(
            product_id=request.product_id,
            user_id=current_user.id,
            rating=request.rating,
            title=request.title,
            comment=request.comment,
            verified_purchase=verified_purchase
        )
        db.add(review)
        db.commit()
        
        return JSONResponse(
            status_code=201,
            content={"success": True, "message": "Bewertung erstellt", "review_id": review.id}
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating review: {str(e)}")
        raise HTTPException(status_code=500, detail="Fehler beim Erstellen der Bewertung")


@router.get("/products/{product_id}/reviews", response_model=List[ReviewResponse])
async def get_product_reviews(
    product_id: str,
    db: Session = Depends(get_db)
):
    """Get reviews for a product"""
    try:
        reviews = db.query(ProductReview).filter(
            ProductReview.product_id == product_id
        ).order_by(ProductReview.created_at.desc()).all()
        
        review_responses = []
        for review in reviews:
            user = review.user
            review_responses.append(ReviewResponse(
                id=review.id,
                product_id=review.product_id,
                user_id=review.user_id,
                user_name=f"{user.name or user.email}",
                rating=review.rating,
                title=review.title,
                comment=review.comment,
                verified_purchase=review.verified_purchase,
                helpful_count=review.helpful_count,
                created_at=review.created_at.isoformat()
            ))
        
        return review_responses
    except Exception as e:
        logger.error(f"Error fetching reviews: {str(e)}")
        raise HTTPException(status_code=500, detail="Fehler beim Laden der Bewertungen")


@router.post("/reviews/{review_id}/helpful")
async def mark_review_helpful(
    review_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark a review as helpful"""
    try:
        review = db.query(ProductReview).filter(ProductReview.id == review_id).first()
        if not review:
            raise HTTPException(status_code=404, detail="Bewertung nicht gefunden")
        
        review.helpful_count += 1
        db.commit()
        
        return JSONResponse(
            status_code=200,
            content={"success": True, "helpful_count": review.helpful_count}
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error marking review helpful: {str(e)}")
        raise HTTPException(status_code=500, detail="Fehler beim Aktualisieren der Bewertung")


# Wishlist Endpoints
@router.post("/wishlist/{product_id}")
async def add_to_wishlist(
    product_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add product to wishlist"""
    try:
        # Check if product exists
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Produkt nicht gefunden")
        
        # Check if already in wishlist
        existing = db.query(WishlistItem).filter(
            and_(
                WishlistItem.user_id == current_user.id,
                WishlistItem.product_id == product_id
            )
        ).first()
        
        if existing:
            raise HTTPException(status_code=400, detail="Produkt ist bereits in der Wunschliste")
        
        # Add to wishlist
        wishlist_item = WishlistItem(
            user_id=current_user.id,
            product_id=product_id
        )
        db.add(wishlist_item)
        db.commit()
        
        return JSONResponse(
            status_code=201,
            content={"success": True, "message": "Produkt zur Wunschliste hinzugefügt"}
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error adding to wishlist: {str(e)}")
        raise HTTPException(status_code=500, detail="Fehler beim Hinzufügen zur Wunschliste")


@router.delete("/wishlist/{product_id}")
async def remove_from_wishlist(
    product_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove product from wishlist"""
    try:
        wishlist_item = db.query(WishlistItem).filter(
            and_(
                WishlistItem.user_id == current_user.id,
                WishlistItem.product_id == product_id
            )
        ).first()
        
        if not wishlist_item:
            raise HTTPException(status_code=404, detail="Produkt nicht in Wunschliste gefunden")
        
        db.delete(wishlist_item)
        db.commit()
        
        return JSONResponse(
            status_code=200,
            content={"success": True, "message": "Produkt aus Wunschliste entfernt"}
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error removing from wishlist: {str(e)}")
        raise HTTPException(status_code=500, detail="Fehler beim Entfernen aus der Wunschliste")


@router.get("/wishlist", response_model=ProductListResponse)
async def get_wishlist(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's wishlist"""
    try:
        wishlist_items = db.query(WishlistItem).filter(
            WishlistItem.user_id == current_user.id
        ).all()
        
        products = [item.product for item in wishlist_items]
        
        product_responses = []
        for product in products:
            product_responses.append(ProductResponse(
                id=product.id,
                name=product.name,
                description=product.description,
                price=product.price,
                category=product.category.value,
                images=product.images or [],
                sizes=product.sizes or [],
                inStock=product.in_stock,
                stock_quantity=product.stock_quantity,
                featured=product.featured,
                sku=product.sku
            ))
        
        return ProductListResponse(
            products=product_responses,
            total=len(product_responses)
        )
    except Exception as e:
        logger.error(f"Error fetching wishlist: {str(e)}")
        raise HTTPException(status_code=500, detail="Fehler beim Laden der Wunschliste")

