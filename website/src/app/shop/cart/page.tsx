"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Plus, Minus, Trash2, ArrowLeft, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCart, updateCartItem, removeFromCart, CartResponse } from '@/lib/api/cart';
import Link from 'next/link';

export default function CartPage() {
    const router = useRouter();
    const { user, token } = useAuth();
    const [cart, setCart] = useState<CartResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    useEffect(() => {
        if (!user || !token) {
            router.push('/login?redirect=/shop/cart');
            return;
        }
        loadCart();
    }, [user, token]);

    const loadCart = async () => {
        if (!token) return;
        
        setIsLoading(true);
        try {
            const cartData = await getCart(token);
            setCart(cartData);
        } catch (error) {
            console.error('Error loading cart:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
        if (!token || newQuantity < 1) return;
        
        setIsUpdating(itemId);
        try {
            const success = await updateCartItem(itemId, newQuantity, token);
            if (success) {
                await loadCart();
            }
        } catch (error) {
            console.error('Error updating cart:', error);
        } finally {
            setIsUpdating(null);
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        if (!token) return;
        
        setIsUpdating(itemId);
        try {
            const success = await removeFromCart(itemId, token);
            if (success) {
                await loadCart();
            }
        } catch (error) {
            console.error('Error removing item:', error);
        } finally {
            setIsUpdating(null);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    <p className="mt-4 text-gray-600 font-body">Warenkorb wird geladen...</p>
                </div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center py-16">
                        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h2 className="text-2xl font-bold mb-2 text-gray-600 font-heading">
                            Dein Warenkorb ist leer
                        </h2>
                        <p className="text-gray-500 mb-6 font-body">
                            Füge Produkte hinzu, um zu beginnen.
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
                    <h1 className="text-3xl font-bold text-primary-700 font-heading">
                        Warenkorb
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="shadow-md">
                                    <CardContent className="p-6">
                                        <div className="flex gap-4">
                                            {/* Product Image */}
                                            <div className="w-24 h-24 flex-shrink-0">
                                                <img
                                                    src={item.product_image || "https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&w=200&q=80"}
                                                    alt={item.product_name}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-grow">
                                                <h3 className="font-semibold text-lg mb-1 text-primary-700 font-heading">
                                                    {item.product_name}
                                                </h3>
                                                {item.size && (
                                                    <p className="text-sm text-gray-500 mb-2 font-body">
                                                        Größe: {item.size}
                                                    </p>
                                                )}
                                                <p className="text-lg font-bold text-accent-600 font-heading">
                                                    {item.price.toFixed(2)}€
                                                </p>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex flex-col items-end justify-between">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                        disabled={isUpdating === item.id || item.quantity <= 1}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </Button>
                                                    <span className="w-12 text-center font-medium font-body">
                                                        {item.quantity}
                                                    </span>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                        disabled={isUpdating === item.id}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-lg text-primary-700 font-heading">
                                                        {(item.subtotal).toFixed(2)}€
                                                    </p>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        disabled={isUpdating === item.id}
                                                        className="text-red-600 hover:text-red-700 mt-2"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Entfernen
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24 shadow-lg">
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold mb-4 text-primary-700 font-heading">
                                    Bestellübersicht
                                </h2>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600 font-body">
                                        <span>Zwischensumme</span>
                                        <span>{cart.subtotal.toFixed(2)}€</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 font-body">
                                        <span>Versand</span>
                                        <span>
                                            {cart.shipping_cost === 0 ? (
                                                <span className="text-green-600 font-semibold">Kostenlos</span>
                                            ) : (
                                                `${cart.shipping_cost.toFixed(2)}€`
                                            )}
                                        </span>
                                    </div>
                                    {cart.subtotal < 50 && (
                                        <p className="text-sm text-gray-500 font-body">
                                            Noch {(50 - cart.subtotal).toFixed(2)}€ für kostenlosen Versand!
                                        </p>
                                    )}
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between text-lg font-bold text-primary-700 font-heading">
                                            <span>Gesamt</span>
                                            <span>{cart.total.toFixed(2)}€</span>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => router.push('/shop/checkout')}
                                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-button mb-3"
                                    size="lg"
                                >
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                    Zur Kasse
                                </Button>

                                <Link href="/shop">
                                    <Button variant="outline" className="w-full font-button">
                                        Weiter einkaufen
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

