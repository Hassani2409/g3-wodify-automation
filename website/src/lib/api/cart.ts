/**
 * Shopping Cart API Service
 * Handles cart-related API calls
 */

export interface CartItem {
    id: string;
    product_id: string;
    product_name: string;
    product_image?: string;
    price: number;
    quantity: number;
    size?: string;
    subtotal: number;
}

export interface CartResponse {
    items: CartItem[];
    subtotal: number;
    shipping_cost: number;
    total: number;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Get current user's cart
 */
export async function getCart(token?: string): Promise<CartResponse | null> {
    if (!token) {
        return null;
    }
    
    try {
        const response = await fetch(`${apiUrl}/api/shop/cart`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        if (!response.ok) {
            return null;
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching cart:', error);
        return null;
    }
}

/**
 * Add item to cart
 */
export async function addToCart(
    productId: string,
    quantity: number = 1,
    options: { size?: string } = {},
    token?: string
): Promise<boolean> {
    if (!token) {
        throw new Error('User must be logged in');
    }
    
    try {
        const response = await fetch(`${apiUrl}/api/shop/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                product_id: productId,
                quantity,
                ...options,
            }),
        });
        
        return response.ok;
    } catch (error) {
        console.error('Error adding to cart:', error);
        return false;
    }
}

/**
 * Update cart item quantity
 */
export async function updateCartItem(
    itemId: string,
    quantity: number,
    token?: string
): Promise<boolean> {
    if (!token) {
        return false;
    }
    
    try {
        const response = await fetch(`${apiUrl}/api/shop/cart/${itemId}?quantity=${quantity}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        return response.ok;
    } catch (error) {
        console.error('Error updating cart item:', error);
        return false;
    }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(itemId: string, token?: string): Promise<boolean> {
    if (!token) {
        return false;
    }
    
    try {
        const response = await fetch(`${apiUrl}/api/shop/cart/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        return response.ok;
    } catch (error) {
        console.error('Error removing from cart:', error);
        return false;
    }
}

/**
 * Clear entire cart
 */
export async function clearCart(token?: string): Promise<boolean> {
    if (!token) {
        return false;
    }
    
    try {
        const response = await fetch(`${apiUrl}/api/shop/cart`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        return response.ok;
    } catch (error) {
        console.error('Error clearing cart:', error);
        return false;
    }
}

