/**
 * Product API Service
 * Handles product-related API calls
 */

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: 'clothing' | 'accessories' | 'supplements' | 'equipment';
    images?: string[];
    inStock: boolean;
    featured?: boolean;
    sizes?: string[];
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Fetch all products
 */
export async function listProducts(): Promise<Product[]> {
    try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch(`${apiUrl}/api/shop/products`, {
            signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.status}`);
        }
        
        const data = await response.json();
        return data.products || [];
    } catch (error) {
        // Silently fall back to mock data if API is unavailable
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                console.warn('API request timeout, using mock products');
            } else if (!error.message.includes('Failed to fetch')) {
                console.warn('API unavailable, using mock products:', error.message);
            }
        }
        // Return mock data for demo
        return getMockProducts();
    }
}

/**
 * Fetch a single product by ID
 */
export async function getProduct(id: string): Promise<Product | null> {
    try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch(`${apiUrl}/api/shop/products/${id}`, {
            signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            return null;
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        // Silently return null if API is unavailable
        if (error instanceof Error && error.name !== 'AbortError') {
            console.warn('API unavailable for product fetch:', error.message);
        }
        return null;
    }
}

/**
 * Mock products for demo purposes
 */
function getMockProducts(): Product[] {
    return [
        {
            id: '1',
            name: 'G3 CrossFit T-Shirt',
            description: 'Premium Baumwoll-T-Shirt mit G3 CrossFit Logo',
            price: 29.99,
            category: 'clothing',
            images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'],
            inStock: true,
            featured: true,
            sizes: ['S', 'M', 'L', 'XL']
        },
        {
            id: '2',
            name: 'G3 CrossFit Hoodie',
            description: 'Warmes, bequemes Hoodie für dein Training',
            price: 59.99,
            category: 'clothing',
            images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600'],
            inStock: true,
            featured: true,
            sizes: ['S', 'M', 'L', 'XL', 'XXL']
        },
        {
            id: '3',
            name: 'G3 CrossFit Wasserflasche',
            description: 'Robuste, wiederverwendbare Trinkflasche',
            price: 19.99,
            category: 'accessories',
            images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600'],
            inStock: true,
            sizes: ['500ml', '750ml']
        },
        {
            id: '4',
            name: 'Protein Pulver',
            description: 'Hochwertiges Whey-Protein für optimale Regeneration',
            price: 39.99,
            category: 'supplements',
            images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600'],
            inStock: true,
            featured: true
        },
        {
            id: '5',
            name: 'G3 CrossFit Rucksack',
            description: 'Praktischer Rucksack für Training und Alltag',
            price: 49.99,
            category: 'accessories',
            images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'],
            inStock: true
        },
        {
            id: '6',
            name: 'Kettlebell 16kg',
            description: 'Professionelle Kettlebell für zu Hause',
            price: 79.99,
            category: 'equipment',
            images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600'],
            inStock: true
        },
        {
            id: '7',
            name: 'G3 CrossFit Tank Top',
            description: 'Atmungsaktives Tank Top für intensive Workouts',
            price: 24.99,
            category: 'clothing',
            images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'],
            inStock: true,
            sizes: ['S', 'M', 'L', 'XL']
        },
        {
            id: '8',
            name: 'BCAA Pulver',
            description: 'Branched-Chain Amino Acids für bessere Performance',
            price: 34.99,
            category: 'supplements',
            images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600'],
            inStock: true
        }
    ];
}

