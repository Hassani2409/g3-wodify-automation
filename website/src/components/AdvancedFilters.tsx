"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdvancedFiltersProps {
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    minPrice: number;
    maxPrice: number;
    onPriceChange: (min: number, max: number) => void;
    inStockOnly: boolean;
    onInStockChange: (value: boolean) => void;
    featuredOnly: boolean;
    onFeaturedChange: (value: boolean) => void;
    onReset: () => void;
}

export default function AdvancedFilters({
    categories,
    selectedCategory,
    onCategoryChange,
    minPrice,
    maxPrice,
    onPriceChange,
    inStockOnly,
    onInStockChange,
    featuredOnly,
    onFeaturedChange,
    onReset,
}: AdvancedFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [localMinPrice, setLocalMinPrice] = useState(minPrice.toString());
    const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice.toString());

    const handlePriceApply = () => {
        const min = parseFloat(localMinPrice) || 0;
        const max = parseFloat(localMaxPrice) || 1000;
        onPriceChange(min, max);
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

    const activeFiltersCount = [
        selectedCategory !== 'all',
        minPrice > 0 || maxPrice < 1000,
        inStockOnly,
        featuredOnly,
    ].filter(Boolean).length;

    return (
        <>
            <Button
                onClick={() => setIsOpen(!isOpen)}
                variant="outline"
                className="relative font-button"
            >
                <Filter className="w-4 h-4 mr-2" />
                Erweiterte Filter
                {activeFiltersCount > 0 && (
                    <span className="ml-2 bg-primary-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {activeFiltersCount}
                    </span>
                )}
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 mt-2 z-50"
                    >
                        <Card className="shadow-xl">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold font-heading">Filter</h3>
                                    <div className="flex gap-2">
                                        {activeFiltersCount > 0 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={onReset}
                                                className="font-button"
                                            >
                                                Zurücksetzen
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setIsOpen(false)}
                                            className="font-button"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Kategorie */}
                                    <div>
                                        <Label className="mb-2 block font-body">Kategorie</Label>
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => onCategoryChange(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-body"
                                        >
                                            <option value="all">Alle Kategorien</option>
                                            {categories.map(category => (
                                                <option key={category} value={category}>
                                                    {getCategoryName(category)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Preisbereich */}
                                    <div>
                                        <Label className="mb-2 block font-body">Preisbereich (€)</Label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Input
                                                    type="number"
                                                    placeholder="Min"
                                                    value={localMinPrice}
                                                    onChange={(e) => setLocalMinPrice(e.target.value)}
                                                    className="font-body"
                                                />
                                            </div>
                                            <div>
                                                <Input
                                                    type="number"
                                                    placeholder="Max"
                                                    value={localMaxPrice}
                                                    onChange={(e) => setLocalMaxPrice(e.target.value)}
                                                    className="font-body"
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            onClick={handlePriceApply}
                                            size="sm"
                                            className="mt-2 bg-primary-600 hover:bg-primary-700 text-white font-button"
                                        >
                                            Preis anwenden
                                        </Button>
                                    </div>

                                    {/* Verfügbarkeit */}
                                    <div>
                                        <Label className="mb-2 block font-body">Verfügbarkeit</Label>
                                        <label className="flex items-center gap-2 cursor-pointer font-body">
                                            <input
                                                type="checkbox"
                                                checked={inStockOnly}
                                                onChange={(e) => onInStockChange(e.target.checked)}
                                                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                                            />
                                            <span>Nur verfügbare Produkte</span>
                                        </label>
                                    </div>

                                    {/* Featured */}
                                    <div>
                                        <Label className="mb-2 block font-body">Besonderheiten</Label>
                                        <label className="flex items-center gap-2 cursor-pointer font-body">
                                            <input
                                                type="checkbox"
                                                checked={featuredOnly}
                                                onChange={(e) => onFeaturedChange(e.target.checked)}
                                                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                                            />
                                            <span>Nur Featured-Produkte</span>
                                        </label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

