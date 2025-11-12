/**
 * Product Reviews API Service
 */

export interface Review {
    id: string;
    product_id: string;
    user_id: string;
    user_name: string;
    rating: number;
    title?: string;
    comment?: string;
    verified_purchase: boolean;
    helpful_count: number;
    created_at: string;
}

export interface CreateReviewRequest {
    product_id: string;
    rating: number;
    title?: string;
    comment?: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Get reviews for a product
 */
export async function getProductReviews(productId: string): Promise<Review[]> {
    try {
        const response = await fetch(`${apiUrl}/api/shop/products/${productId}/reviews`);
        
        if (!response.ok) {
            return [];
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
}

/**
 * Create a product review
 */
export async function createReview(
    reviewData: CreateReviewRequest,
    token?: string
): Promise<{ success: boolean; message?: string }> {
    if (!token) {
        throw new Error('User must be logged in');
    }
    
    try {
        const response = await fetch(`${apiUrl}/api/shop/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(reviewData),
        });
        
        if (!response.ok) {
            const error = await response.json();
            return { success: false, message: error.detail || 'Fehler beim Erstellen der Bewertung' };
        }
        
        const data = await response.json();
        return { success: true, message: data.message };
    } catch (error) {
        console.error('Error creating review:', error);
        return { success: false, message: 'Fehler beim Erstellen der Bewertung' };
    }
}

/**
 * Mark a review as helpful
 */
export async function markReviewHelpful(reviewId: string, token?: string): Promise<boolean> {
    if (!token) {
        return false;
    }
    
    try {
        const response = await fetch(`${apiUrl}/api/shop/reviews/${reviewId}/helpful`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        return response.ok;
    } catch (error) {
        console.error('Error marking review helpful:', error);
        return false;
    }
}

