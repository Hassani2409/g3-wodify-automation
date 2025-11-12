/**
 * Wishlist API Service
 */

import { Product } from './products';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Add product to wishlist
 */
export async function addToWishlist(productId: string, token?: string): Promise<boolean> {
    if (!token) {
        throw new Error('User must be logged in');
    }
    
    try {
        const response = await fetch(`${apiUrl}/api/shop/wishlist/${productId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        return response.ok;
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        return false;
    }
}

/**
 * Remove product from wishlist
 */
export async function removeFromWishlist(productId: string, token?: string): Promise<boolean> {
    if (!token) {
        return false;
    }
    
    try {
        const response = await fetch(`${apiUrl}/api/shop/wishlist/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        return response.ok;
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        return false;
    }
}

/**
 * Get user's wishlist
 */
export async function getWishlist(token?: string): Promise<Product[]> {
    if (!token) {
        return [];
    }
    
    try {
        const response = await fetch(`${apiUrl}/api/shop/wishlist`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        if (!response.ok) {
            return [];
        }
        
        const data = await response.json();
        return data.products || [];
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        return [];
    }
}

/**
 * Check if product is in wishlist
 */
export async function isInWishlist(productId: string, token?: string): Promise<boolean> {
    if (!token) {
        return false;
    }
    
    try {
        const wishlist = await getWishlist(token);
        return wishlist.some(p => p.id === productId);
    } catch (error) {
        console.error('Error checking wishlist:', error);
        return false;
    }
}

