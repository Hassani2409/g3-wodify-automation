"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Truck, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { getOrders, Order } from '@/lib/api/orders';
import Link from 'next/link';

export default function OrdersPage() {
    const router = useRouter();
    const { user, token } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user || !token) {
            router.push('/login?redirect=/shop/orders');
            return;
        }
        loadOrders();
    }, [user, token]);

    const loadOrders = async () => {
        if (!token) return;
        
        setIsLoading(true);
        try {
            const fetchedOrders = await getOrders(token);
            setOrders(fetchedOrders);
        } catch (error) {
            console.error('Error loading orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { label: string; variant: 'default' | 'destructive' | 'outline'; icon: any }> = {
            pending: { label: 'Ausstehend', variant: 'outline', icon: Clock },
            processing: { label: 'In Bearbeitung', variant: 'default', icon: Package },
            shipped: { label: 'Versendet', variant: 'default', icon: Truck },
            delivered: { label: 'Geliefert', variant: 'default', icon: CheckCircle },
            cancelled: { label: 'Storniert', variant: 'destructive', icon: XCircle },
            refunded: { label: 'Erstattet', variant: 'destructive', icon: XCircle },
        };

        const config = statusConfig[status.toLowerCase()] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <Badge variant={config.variant} className="flex items-center gap-1">
                <Icon className="w-3 h-3" />
                {config.label}
            </Badge>
        );
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'border-yellow-500',
            processing: 'border-blue-500',
            shipped: 'border-purple-500',
            delivered: 'border-green-500',
            cancelled: 'border-red-500',
            refunded: 'border-gray-500',
        };
        return colors[status.toLowerCase()] || 'border-gray-300';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    <p className="mt-4 text-gray-600 font-body">Bestellungen werden geladen...</p>
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
                        Meine Bestellungen
                    </h1>
                </div>

                {orders.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <h2 className="text-2xl font-bold mb-2 text-gray-600 font-heading">
                                Noch keine Bestellungen
                            </h2>
                            <p className="text-gray-500 mb-6 font-body">
                                Du hast noch keine Bestellungen aufgegeben.
                            </p>
                            <Link href="/shop">
                                <Button className="bg-primary-600 hover:bg-primary-700 text-white font-button">
                                    Zum Shop
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className={`border-l-4 ${getStatusColor(order.status)}`}>
                                    <CardContent className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <h3 className="text-xl font-bold text-primary-700 font-heading">
                                                        {order.order_number}
                                                    </h3>
                                                    {getStatusBadge(order.status)}
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <p className="text-sm text-gray-500 font-body">Bestelldatum</p>
                                                        <p className="font-semibold font-body">
                                                            {new Date(order.created_at).toLocaleDateString('de-DE', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500 font-body">Artikel</p>
                                                        <p className="font-semibold font-body">
                                                            {order.items.length} {order.items.length === 1 ? 'Artikel' : 'Artikel'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <p className="text-sm text-gray-500 mb-2 font-body">Bestellte Artikel:</p>
                                                    <ul className="space-y-1">
                                                        {order.items.map((item, index) => (
                                                            <li key={index} className="text-sm font-body">
                                                                {item.product_name} x{item.quantity}
                                                                {item.size && ` (Größe: ${item.size})`}
                                                                <span className="text-gray-500 ml-2">
                                                                    - {(item.price * item.quantity).toFixed(2)}€
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="lg:text-right">
                                                <div className="mb-2">
                                                    <p className="text-sm text-gray-500 font-body">Zwischensumme</p>
                                                    <p className="text-lg font-semibold font-heading">
                                                        {order.subtotal.toFixed(2)}€
                                                    </p>
                                                </div>
                                                {order.shipping_cost > 0 && (
                                                    <div className="mb-2">
                                                        <p className="text-sm text-gray-500 font-body">Versand</p>
                                                        <p className="text-lg font-semibold font-heading">
                                                            {order.shipping_cost.toFixed(2)}€
                                                        </p>
                                                    </div>
                                                )}
                                                <div className="pt-2 border-t">
                                                    <p className="text-sm text-gray-500 font-body">Gesamt</p>
                                                    <p className="text-2xl font-bold text-accent-600 font-heading">
                                                        {order.total.toFixed(2)}€
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

