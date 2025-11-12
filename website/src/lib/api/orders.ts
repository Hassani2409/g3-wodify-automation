/**
 * Orders API Service
 * Handles order-related API calls
 */

export interface OrderItem {
    product_name: string;
    quantity: number;
    price: number;
    size?: string;
}

export interface Order {
    id: string;
    order_number: string;
    status: string;
    subtotal: number;
    shipping_cost: number;
    total: number;
    created_at: string;
    items: OrderItem[];
}

export interface CreateOrderRequest {
    shipping_name: string;
    shipping_email: string;
    shipping_phone?: string;
    shipping_address_line1: string;
    shipping_address_line2?: string;
    shipping_city: string;
    shipping_postal_code: string;
    shipping_country?: string;
    customer_notes?: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Create a new order from cart
 */
export async function createOrder(
    orderData: CreateOrderRequest,
    token?: string
): Promise<{ success: boolean; order_id?: string; order_number?: string; total?: number; message?: string }> {
    if (!token) {
        throw new Error('User must be logged in');
    }
    
    try {
        const response = await fetch(`${apiUrl}/api/shop/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(orderData),
        });
        
        if (!response.ok) {
            const error = await response.json();
            return { success: false, message: error.detail || 'Fehler beim Erstellen der Bestellung' };
        }
        
        const data = await response.json();
        return { success: true, ...data };
    } catch (error) {
        console.error('Error creating order:', error);
        return { success: false, message: 'Fehler beim Erstellen der Bestellung' };
    }
}

/**
 * Get user's orders
 */
export async function getOrders(token?: string): Promise<Order[]> {
    if (!token) {
        return [];
    }
    
    try {
        const response = await fetch(`${apiUrl}/api/shop/orders`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        if (!response.ok) {
            return [];
        }
        
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}

/**
 * Get a single order by ID
 */
export async function getOrder(orderId: string, token?: string): Promise<Order | null> {
    if (!token) {
        return null;
    }
    
    try {
        const response = await fetch(`${apiUrl}/api/shop/orders/${orderId}`, {
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
        console.error('Error fetching order:', error);
        return null;
    }
}

