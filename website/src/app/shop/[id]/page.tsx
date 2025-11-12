"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Minus, Star, ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { getProduct, Product } from '@/lib/api/products';
import { addToCart } from '@/lib/api/cart';
import { addToWishlist, removeFromWishlist, isInWishlist } from '@/lib/api/wishlist';
import { Label } from '@/components/ui/label';
import ProductReviews from '@/components/ProductReviews';
import Link from 'next/link';

export default function ProductDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { user, token } = useAuth();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isInWishlistState, setIsInWishlistState] = useState(false);
    const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

    useEffect(() => {
        if (params.id) {
            loadProduct(params.id as string);
        }
    }, [params.id]);

    useEffect(() => {
        if (product && token) {
            checkWishlistStatus();
        }
    }, [product, token]);

    const loadProduct = async (id: string) => {
        setIsLoading(true);
        try {
            const productData = await getProduct(id);
            setProduct(productData);
            if (productData?.sizes && productData.sizes.length > 0) {
                setSelectedSize(productData.sizes[0]);
            }
        } catch (error) {
            console.error('Error loading product:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const checkWishlistStatus = async () => {
        if (!product || !token) return;
        try {
            const inWishlist = await isInWishlist(product.id, token);
            setIsInWishlistState(inWishlist);
        } catch (error) {
            console.error('Error checking wishlist:', error);
        }
    };

    const handleToggleWishlist = async () => {
        if (!product || !token) {
            router.push('/login?redirect=' + router.asPath);
            return;
        }

        setIsTogglingWishlist(true);
        try {
            if (isInWishlistState) {
                const success = await removeFromWishlist(product.id, token);
                if (success) {
                    setIsInWishlistState(false);
                }
            } else {
                const success = await addToWishlist(product.id, token);
                if (success) {
                    setIsInWishlistState(true);
                }
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        } finally {
            setIsTogglingWishlist(false);
        }
    };

    const handleAddToCart = async () => {
        if (!product || !token) {
            router.push('/login?redirect=' + router.asPath);
            return;
        }

        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            alert('Bitte wähle eine Größe aus');
            return;
        }

        setIsAddingToCart(true);
        try {
            const success = await addToCart(
                product.id,
                quantity,
                { size: selectedSize || undefined },
                token
            );
            if (success) {
                alert('Produkt zum Warenkorb hinzugefügt!');
            } else {
                alert('Fehler beim Hinzufügen zum Warenkorb.');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Bitte loggen Sie sich ein, um Produkte in den Warenkorb zu legen.');
        } finally {
            setIsAddingToCart(false);
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
                    <p className="mt-4 text-gray-600 font-body">Produkt wird geladen...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-bold mb-2 text-gray-600 font-heading">
                            Produkt nicht gefunden
                        </h2>
                        <Link href="/shop">
                            <Button className="mt-4 bg-primary-600 hover:bg-primary-700 text-white font-button">
                                Zurück zum Shop
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const images = product.images || ["https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&w=800&q=80"];

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Back Button */}
                <Link href="/shop">
                    <Button variant="ghost" className="mb-6">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Zurück zum Shop
                    </Button>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Images */}
                    <div>
                        <div className="mb-4">
                            <img
                                src={images[selectedImage]}
                                alt={product.name}
                                className="w-full h-96 object-cover rounded-lg shadow-lg"
                            />
                        </div>
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`border-2 rounded-lg overflow-hidden ${
                                            selectedImage === index
                                                ? 'border-primary-500'
                                                : 'border-transparent'
                                        }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-24 object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="mb-4">
                            <Badge variant="outline" className="mb-2">
                                {getCategoryName(product.category)}
                            </Badge>
                            {product.featured && (
                                <Badge className="ml-2 bg-accent-500 text-white">
                                    <Star className="w-3 h-3 mr-1" />
                                    Featured
                                </Badge>
                            )}
                        </div>

                        <h1 className="text-4xl font-bold mb-4 text-primary-700 font-heading">
                            {product.name}
                        </h1>

                        <p className="text-3xl font-bold mb-6 text-accent-600 font-heading">
                            {product.price.toFixed(2)}€
                        </p>

                        <div className="mb-6">
                            <p className="text-gray-700 leading-relaxed font-body">
                                {product.description}
                            </p>
                        </div>

                        {product.sizes && product.sizes.length > 0 && (
                            <div className="mb-6">
                                <Label className="block mb-2 font-semibold font-body">
                                    Größe *
                                </Label>
                                <Select value={selectedSize} onValueChange={setSelectedSize}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Größe wählen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {product.sizes.map((size) => (
                                            <SelectItem key={size} value={size}>
                                                {size}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="mb-6">
                            <Label className="block mb-2 font-semibold font-body">
                                Menge
                            </Label>
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="h-10 w-10 p-0"
                                >
                                    <Minus className="w-4 h-4" />
                                </Button>
                                <span className="text-xl font-semibold w-12 text-center font-heading">
                                    {quantity}
                                </span>
                                <Button
                                    variant="outline"
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="h-10 w-10 p-0"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {!product.inStock && (
                            <Badge variant="destructive" className="mb-4">
                                Ausverkauft
                            </Badge>
                        )}

                        <div className="flex gap-4">
                            <Button
                                onClick={handleAddToCart}
                                disabled={!product.inStock || isAddingToCart}
                                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-button"
                                size="lg"
                            >
                                {isAddingToCart ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Wird hinzugefügt...
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                        In den Warenkorb
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={handleToggleWishlist}
                                disabled={isTogglingWishlist}
                                variant="outline"
                                size="lg"
                                className={`${isInWishlistState ? 'bg-red-50 border-red-300 text-red-600' : ''}`}
                            >
                                <Heart
                                    className={`w-5 h-5 ${isInWishlistState ? 'fill-red-600' : ''}`}
                                />
                            </Button>
                        </div>

                        <div className="mt-8 pt-8 border-t">
                            <h3 className="font-semibold mb-2 font-heading">Versandinformationen</h3>
                            <ul className="text-sm text-gray-600 space-y-1 font-body">
                                <li>• Kostenloser Versand ab 50€</li>
                                <li>• Standardversand: 5,99€</li>
                                <li>• Lieferzeit: 2-5 Werktage</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                {product && <ProductReviews productId={product.id} />}
            </div>
        </div>
    );
}

