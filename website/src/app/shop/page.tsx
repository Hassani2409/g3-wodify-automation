"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingBag, Filter, Search, Star, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { listProducts, Product } from '@/lib/api/products';
import { addToCart } from '@/lib/api/cart';
import AdvancedFilters from '@/components/AdvancedFilters';

export default function Shop() {
    const router = useRouter();
    const { user, token } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [isLoading, setIsLoading] = useState(true);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [featuredOnly, setFeaturedOnly] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, selectedCategory, searchQuery, sortBy, minPrice, maxPrice, inStockOnly, featuredOnly]);

    const loadProducts = async () => {
        setIsLoading(true);
        try {
            const fetchedProducts = await listProducts();
            setProducts(fetchedProducts);
            const uniqueCategories = [...new Set(fetchedProducts.map(p => p.category))];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filterProducts = () => {
        let filtered = [...products];

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        if (searchQuery) {
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Price filter
        filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);

        // Stock filter
        if (inStockOnly) {
            filtered = filtered.filter(p => p.inStock);
        }

        // Featured filter
        if (featuredOnly) {
            filtered = filtered.filter(p => p.featured);
        }

        // Sort products
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price_low': return a.price - b.price;
                case 'price_high': return b.price - a.price;
                case 'name': return a.name.localeCompare(b.name);
                default: return 0;
            }
        });

        setFilteredProducts(filtered);
    };

    const handleResetFilters = () => {
        setSelectedCategory('all');
        setMinPrice(0);
        setMaxPrice(1000);
        setInStockOnly(false);
        setFeaturedOnly(false);
        setSearchQuery('');
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

    const getCategoryName = (category: string) => {
        const names: Record<string, string> = {
            clothing: 'Bekleidung',
            accessories: 'Accessoires', 
            supplements: 'Supplements',
            equipment: 'Equipment'
        };
        return names[category] || category;
    };

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
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white font-heading">G3 CrossFit Shop</h1>
                        <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-8 font-body">
                            Hochwertige CrossFit-Ausrüstung und G3-Merchandise für dein Training
                        </p>
                        <div className="inline-flex items-center space-x-2 bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
                            <ShoppingBag className="w-5 h-5 text-accent-400" />
                            <span className="font-medium font-body">Kostenloser Versand ab 50€</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Filter & Search Section */}
            <section className="py-8 bg-white border-b relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 items-center flex-wrap">
                            <div className="flex items-center space-x-2">
                                <Filter className="w-5 h-5 text-primary-600" />
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Kategorie" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Alle Kategorien</SelectItem>
                                        {categories.map(category => (
                                            <SelectItem key={category} value={category}>
                                                {getCategoryName(category)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Sortieren" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name">Name A-Z</SelectItem>
                                    <SelectItem value="price_low">Preis niedrig</SelectItem>
                                    <SelectItem value="price_high">Preis hoch</SelectItem>
                                </SelectContent>
                            </Select>

                            <AdvancedFilters
                                categories={categories}
                                selectedCategory={selectedCategory}
                                onCategoryChange={setSelectedCategory}
                                minPrice={minPrice}
                                maxPrice={maxPrice}
                                onPriceChange={(min, max) => {
                                    setMinPrice(min);
                                    setMaxPrice(max);
                                }}
                                inStockOnly={inStockOnly}
                                onInStockChange={setInStockOnly}
                                featuredOnly={featuredOnly}
                                onFeaturedChange={setFeaturedOnly}
                                onReset={handleResetFilters}
                            />
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Produkte suchen..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-64 font-body"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {isLoading ? (
                        <div className="text-center py-16">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                            <p className="mt-4 text-gray-600 font-body">Produkte werden geladen...</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {filteredProducts.map((product) => (
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
                                                    <Link href={`/shop/category/${product.category}`}>
                                                        <Badge variant="outline" className="text-xs mb-2 cursor-pointer hover:bg-primary-50">
                                                            {getCategoryName(product.category)}
                                                        </Badge>
                                                    </Link>
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
                                                    {product.sizes && product.sizes.length > 0 && (
                                                        <div className="text-xs text-gray-500 font-body">
                                                            Größen: {product.sizes.join(', ')}
                                                        </div>
                                                    )}
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
                            
                            {filteredProducts.length === 0 && !isLoading && (
                                <div className="text-center py-16">
                                    <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                    <h3 className="text-2xl font-semibold mb-2 text-gray-600 font-heading">
                                        Keine Produkte gefunden
                                    </h3>
                                    <p className="text-gray-500 font-body">
                                        Versuche eine andere Suche oder Kategorie.
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}

