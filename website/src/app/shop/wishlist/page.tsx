"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getWishlist, removeFromWishlist } from '@/lib/api/wishlist';
import { Product } from '@/lib/api/products';
import { addToCart } from '@/lib/api/cart';
import Link from 'next/link';

export default function WishlistPage() {
    const router = useRouter();
    const { user, token } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [removingId, setRemovingId] = useState<string | null>(null);

    useEffect(() => {
        if (!user || !token) {
            router.push('/login?redirect=/shop/wishlist');
            return;
        }
        loadWishlist();
    }, [user, token]);

    const loadWishlist = async () => {
        if (!token) return;
        
        setIsLoading(true);
        try {
            const wishlistProducts = await getWishlist(token);
            setProducts(wishlistProducts);
        } catch (error) {
            console.error('Error loading wishlist:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = async (productId: string) => {
        if (!token) return;
        
        setRemovingId(productId);
        try {
            const success = await removeFromWishlist(productId, token);
            if (success) {
                await loadWishlist();
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        } finally {
            setRemovingId(null);
        }
    };

    const handleAddToCart = async (product: Product) => {
        if (!token) return;
        
        try {
            const success = await addToCart(product.id, 1, {}, token);
            if (success) {
                alert('Produkt zum Warenkorb hinzugefügt!');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Fehler beim Hinzufügen zum Warenkorb.');
        }
    };

    const getCategoryName = (category: string) => {
        const names: Record<string, string> = {
            clothing: 'Bekleidung',
            accessories: 'Accessoires',
            supplements: 'Supplements',
            equipment: 'Equipment'
        };
        return names[category] || category;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    <p className="mt-4 text-gray-600 font-body">Wunschliste wird geladen...</p>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center py-16">
                        <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h2 className="text-2xl font-bold mb-2 text-gray-600 font-heading">
                            Deine Wunschliste ist leer
                        </h2>
                        <p className="text-gray-500 mb-6 font-body">
                            Füge Produkte hinzu, die du später kaufen möchtest.
                        </p>
                        <Link href="/shop">
                            <Button className="bg-primary-600 hover:bg-primary-700 text-white font-button">
                                Zum Shop
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/shop">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Zurück zum Shop
                        </Button>
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-primary-700 font-heading">
                                Meine Wunschliste
                            </h1>
                            <p className="text-gray-600 mt-2 font-body">
                                {products.length} {products.length === 1 ? 'Produkt' : 'Produkte'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="group overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 h-full flex flex-col">
                                <div className="relative">
                                    <Link href={`/shop/${product.id}`}>
                                        <img
                                            src={product.images?.[0] || "https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&w=600&q=80"}
                                            alt={product.name}
                                            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                                        />
                                    </Link>
                                    <button
                                        onClick={() => handleRemove(product.id)}
                                        disabled={removingId === product.id}
                                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                                    >
                                        <Heart className={`w-5 h-5 fill-red-600 text-red-600 ${removingId === product.id ? 'opacity-50' : ''}`} />
                                    </button>
                                    {product.featured && (
                                        <Badge className="absolute top-3 left-3 bg-accent-500 text-white">
                                            Featured
                                        </Badge>
                                    )}
                                    {!product.inStock && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <Badge variant="destructive">Ausverkauft</Badge>
                                        </div>
                                    )}
                                </div>

                                <CardContent className="p-6 flex flex-col flex-grow">
                                    <div className="mb-3 flex-grow">
                                        <Badge variant="outline" className="text-xs mb-2">
                                            {getCategoryName(product.category)}
                                        </Badge>
                                        <Link href={`/shop/${product.id}`}>
                                            <h3 className="font-bold text-lg mb-2 text-primary-700 font-heading hover:text-primary-800 cursor-pointer">
                                                {product.name}
                                            </h3>
                                        </Link>
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-3 font-body">
                                            {product.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-2xl font-bold text-accent-600 font-heading">
                                            {product.price.toFixed(2)}€
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleAddToCart(product)}
                                            disabled={!product.inStock}
                                            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-button"
                                        >
                                            <ShoppingBag className="w-4 h-4 mr-2" />
                                            In den Warenkorb
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

