"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingBag, Star, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { listProducts, Product } from '@/lib/api/products';
import { addToCart } from '@/lib/api/cart';

export default function CategoryPage() {
    const params = useParams();
    const router = useRouter();
    const { user, token } = useAuth();
    const category = params.category as string;
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, [category]);

    const loadProducts = async () => {
        setIsLoading(true);
        try {
            const allProducts = await listProducts();
            const categoryProducts = allProducts.filter(p => p.category === category);
            setProducts(categoryProducts);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToCart = async (product: Product) => {
        if (!user || !token) {
            router.push('/login');
            return;
        }

        try {
            const success = await addToCart(product.id, 1, {}, token);
            if (success) {
                alert('Produkt zum Warenkorb hinzugefügt!');
            } else {
                alert('Fehler beim Hinzufügen zum Warenkorb.');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Bitte loggen Sie sich ein, um Produkte in den Warenkorb zu legen.');
        }
    };

    const getCategoryName = (cat: string) => {
        const names: Record<string, string> = {
            clothing: 'Bekleidung',
            accessories: 'Accessoires',
            supplements: 'Supplements',
            equipment: 'Equipment'
        };
        return names[cat] || cat;
    };

    const getCategoryDescription = (cat: string) => {
        const descriptions: Record<string, string> = {
            clothing: 'Hochwertige CrossFit-Bekleidung für dein Training. Von T-Shirts über Hoodies bis hin zu Leggings und Shorts.',
            accessories: 'Praktische Accessoires für dein CrossFit-Training. Wasserflaschen, Rucksäcke, Handtücher und mehr.',
            supplements: 'Professionelle Nahrungsergänzungsmittel für optimale Performance und Regeneration.',
            equipment: 'Trainingsgeräte für zu Hause. Kettlebells, Springseile, Resistance Bands und mehr.'
        };
        return descriptions[cat] || '';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    <p className="mt-4 text-gray-600 font-body">Produkte werden geladen...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 text-white" style={{background: 'linear-gradient(135deg, #2A5D3C 0%, #1a3a26 100%)'}}>
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80")'
                    }}
                />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/shop">
                        <Button variant="ghost" className="mb-6 text-white hover:bg-white/20">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Zurück zum Shop
                        </Button>
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white font-heading">
                            {getCategoryName(category)}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-200 max-w-3xl font-body">
                            {getCategoryDescription(category)}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {products.length === 0 ? (
                        <div className="text-center py-16">
                            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-2xl font-semibold mb-2 text-gray-600 font-heading">
                                Keine Produkte in dieser Kategorie
                            </h3>
                            <Link href="/shop">
                                <Button className="mt-4 bg-primary-600 hover:bg-primary-700 text-white font-button">
                                    Zurück zum Shop
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <p className="text-gray-600 mb-8 font-body">
                                {products.length} {products.length === 1 ? 'Produkt' : 'Produkte'} gefunden
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {products.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <Card className="group overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 h-full flex flex-col">
                                            <div className="relative cursor-pointer" onClick={() => router.push(`/shop/${product.id}`)}>
                                                <img 
                                                    src={product.images?.[0] || "https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&w=600&q=80"}
                                                    alt={product.name}
                                                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                                {product.featured && (
                                                    <Badge className="absolute top-3 left-3 bg-accent-500 text-white">
                                                        <Star className="w-3 h-3 mr-1" />
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

                                                <Button 
                                                    onClick={() => handleAddToCart(product)}
                                                    disabled={!product.inStock}
                                                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-button"
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    {product.inStock ? 'In den Warenkorb' : 'Ausverkauft'}
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}

