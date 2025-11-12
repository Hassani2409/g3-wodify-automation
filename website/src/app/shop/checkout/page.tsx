"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ShoppingCart, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCart, CartResponse } from '@/lib/api/cart';
import { createOrder, CreateOrderRequest } from '@/lib/api/orders';
import Link from 'next/link';

export default function CheckoutPage() {
    const router = useRouter();
    const { user, token } = useAuth();
    const [cart, setCart] = useState<CartResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderNumber, setOrderNumber] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState<CreateOrderRequest>({
        shipping_name: user?.name || '',
        shipping_email: user?.email || '',
        shipping_phone: '',
        shipping_address_line1: '',
        shipping_address_line2: '',
        shipping_city: '',
        shipping_postal_code: '',
        shipping_country: 'DE',
        customer_notes: '',
    });

    useEffect(() => {
        if (!user || !token) {
            router.push('/login?redirect=/shop/checkout');
            return;
        }
        loadCart();
    }, [user, token]);

    const loadCart = async () => {
        if (!token) return;
        
        setIsLoading(true);
        try {
            const cartData = await getCart(token);
            if (!cartData || cartData.items.length === 0) {
                router.push('/shop/cart');
                return;
            }
            setCart(cartData);
        } catch (error) {
            console.error('Error loading cart:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setIsSubmitting(true);
        try {
            const result = await createOrder(formData, token);
            if (result.success && result.order_number) {
                setOrderNumber(result.order_number);
                setOrderSuccess(true);
            } else {
                alert(result.message || 'Fehler beim Erstellen der Bestellung');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Fehler beim Erstellen der Bestellung');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    <p className="mt-4 text-gray-600 font-body">Wird geladen...</p>
                </div>
            </div>
        );
    }

    if (orderSuccess) {
        return (
            <div className="min-h-screen bg-background">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <div className="mb-6">
                            <CheckCircle className="w-20 h-20 mx-auto text-green-500" />
                        </div>
                        <h1 className="text-3xl font-bold mb-4 text-primary-700 font-heading">
                            Bestellung erfolgreich!
                        </h1>
                        <p className="text-lg text-gray-600 mb-2 font-body">
                            Vielen Dank für deine Bestellung.
                        </p>
                        {orderNumber && (
                            <p className="text-xl font-semibold text-accent-600 mb-8 font-heading">
                                Bestellnummer: {orderNumber}
                            </p>
                        )}
                        <div className="space-y-4">
                            <Link href="/shop">
                                <Button className="bg-primary-600 hover:bg-primary-700 text-white font-button">
                                    Weiter einkaufen
                                </Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button variant="outline" className="ml-4 font-button">
                                    Zu meinen Bestellungen
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    if (!cart) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/shop/cart">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Zurück zum Warenkorb
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold text-primary-700 font-heading">
                        Kasse
                    </h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Shipping Form */}
                        <div className="lg:col-span-2">
                            <Card className="shadow-md">
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-bold mb-6 text-primary-700 font-heading">
                                        Lieferadresse
                                    </h2>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="shipping_name" className="font-body">
                                                Name *
                                            </Label>
                                            <Input
                                                id="shipping_name"
                                                name="shipping_name"
                                                value={formData.shipping_name}
                                                onChange={handleInputChange}
                                                required
                                                className="mt-1 font-body"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="shipping_email" className="font-body">
                                                E-Mail *
                                            </Label>
                                            <Input
                                                id="shipping_email"
                                                name="shipping_email"
                                                type="email"
                                                value={formData.shipping_email}
                                                onChange={handleInputChange}
                                                required
                                                className="mt-1 font-body"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="shipping_phone" className="font-body">
                                                Telefon
                                            </Label>
                                            <Input
                                                id="shipping_phone"
                                                name="shipping_phone"
                                                type="tel"
                                                value={formData.shipping_phone}
                                                onChange={handleInputChange}
                                                className="mt-1 font-body"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="shipping_address_line1" className="font-body">
                                                Straße und Hausnummer *
                                            </Label>
                                            <Input
                                                id="shipping_address_line1"
                                                name="shipping_address_line1"
                                                value={formData.shipping_address_line1}
                                                onChange={handleInputChange}
                                                required
                                                className="mt-1 font-body"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="shipping_address_line2" className="font-body">
                                                Adresszusatz
                                            </Label>
                                            <Input
                                                id="shipping_address_line2"
                                                name="shipping_address_line2"
                                                value={formData.shipping_address_line2}
                                                onChange={handleInputChange}
                                                className="mt-1 font-body"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="shipping_postal_code" className="font-body">
                                                    Postleitzahl *
                                                </Label>
                                                <Input
                                                    id="shipping_postal_code"
                                                    name="shipping_postal_code"
                                                    value={formData.shipping_postal_code}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="mt-1 font-body"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="shipping_city" className="font-body">
                                                    Stadt *
                                                </Label>
                                                <Input
                                                    id="shipping_city"
                                                    name="shipping_city"
                                                    value={formData.shipping_city}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="mt-1 font-body"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="shipping_country" className="font-body">
                                                Land
                                            </Label>
                                            <Input
                                                id="shipping_country"
                                                name="shipping_country"
                                                value={formData.shipping_country}
                                                onChange={handleInputChange}
                                                className="mt-1 font-body"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="customer_notes" className="font-body">
                                                Hinweise (optional)
                                            </Label>
                                            <Textarea
                                                id="customer_notes"
                                                name="customer_notes"
                                                value={formData.customer_notes}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="mt-1 font-body"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-24 shadow-lg">
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-bold mb-4 text-primary-700 font-heading">
                                        Bestellübersicht
                                    </h2>
                                    
                                    <div className="space-y-2 mb-4">
                                        {cart.items.map((item) => (
                                            <div key={item.id} className="flex justify-between text-sm font-body">
                                                <span className="text-gray-600">
                                                    {item.product_name} x{item.quantity}
                                                </span>
                                                <span className="font-medium">
                                                    {item.subtotal.toFixed(2)}€
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-3 mb-6 border-t pt-4">
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
                                        <div className="border-t pt-3">
                                            <div className="flex justify-between text-lg font-bold text-primary-700 font-heading">
                                                <span>Gesamt</span>
                                                <span>{cart.total.toFixed(2)}€</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-button"
                                        size="lg"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Wird verarbeitet...
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart className="w-5 h-5 mr-2" />
                                                Bestellung abschließen
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

