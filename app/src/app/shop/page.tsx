'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Grid3X3, LayoutList, SlidersHorizontal } from 'lucide-react';
import { useProductStore } from '@/store';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { SORT_OPTIONS, PRICE_RANGES, PRODUCT_CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

// Filter Sidebar Component
function FilterSidebar({ className }: { className?: string }) {
    const { filters, setFilters, clearFilters } = useProductStore();

    return (
        <div className={cn('space-y-6', className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg">Filters</h3>
                <button
                    onClick={clearFilters}
                    className="text-sm text-gold-100 hover:text-gold-200 transition-colors"
                >
                    Clear All
                </button>
            </div>

            <Separator />

            {/* Categories */}
            <div>
                <h4 className="font-medium mb-3">Categories</h4>
                <div className="space-y-2">
                    {PRODUCT_CATEGORIES.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={`category-${category.id}`}
                                checked={filters.category === category.id}
                                onCheckedChange={(checked) =>
                                    setFilters({ category: checked ? category.id : undefined })
                                }
                            />
                            <Label
                                htmlFor={`category-${category.id}`}
                                className="text-sm font-normal cursor-pointer"
                            >
                                {category.name}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Price Range */}
            <div>
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="space-y-2">
                    {PRICE_RANGES.map((range) => (
                        <div key={range.value} className="flex items-center space-x-2">
                            <Checkbox
                                id={`price-${range.value}`}
                                checked={filters.minPrice === range.min && filters.maxPrice === range.max}
                                onCheckedChange={(checked) =>
                                    setFilters({
                                        minPrice: checked ? range.min : undefined,
                                        maxPrice: checked ? range.max : undefined,
                                    })
                                }
                            />
                            <Label
                                htmlFor={`price-${range.value}`}
                                className="text-sm font-normal cursor-pointer"
                            >
                                {range.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Other Filters */}
            <div>
                <h4 className="font-medium mb-3">Other</h4>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="in-stock"
                            checked={filters.inStock}
                            onCheckedChange={(checked) =>
                                setFilters({ inStock: checked as boolean })
                            }
                        />
                        <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
                            In Stock Only
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="on-sale"
                            checked={filters.onSale}
                            onCheckedChange={(checked) =>
                                setFilters({ onSale: checked as boolean })
                            }
                        />
                        <Label htmlFor="on-sale" className="text-sm font-normal cursor-pointer">
                            On Sale
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="featured"
                            checked={filters.featured}
                            onCheckedChange={(checked) =>
                                setFilters({ featured: checked as boolean })
                            }
                        />
                        <Label htmlFor="featured" className="text-sm font-normal cursor-pointer">
                            Featured
                        </Label>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Shop Content Component (to use useSearchParams)
function ShopContent({ categoryId }: { categoryId?: string }) {
    const searchParams = useSearchParams();
    const { products, fetchProducts, isLoading, filters, setFilters, pagination } = useProductStore();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Parse URL params
    useEffect(() => {
        const category = categoryId || searchParams.get('category');
        const search = searchParams.get('search');
        const featured = searchParams.get('featured');
        const sort = searchParams.get('sort') as typeof filters.sortBy;

        const newFilters: Partial<typeof filters> = {};
        if (category) newFilters.category = category;
        if (search) newFilters.search = search;
        if (featured === 'true') newFilters.featured = true;
        if (sort && SORT_OPTIONS.some((o) => o.value === sort)) {
            newFilters.sortBy = sort;
        }

        if (Object.keys(newFilters).length > 0) {
            setFilters(newFilters);
        }
    }, [searchParams, setFilters]);

    // Fetch products & Subscribe for real-time updates
    useEffect(() => {
        // Fetch initial data
        fetchProducts(true);

        // Subscribe to real-time changes (stock/price/etc)
        const { subscribeToProducts, unsubscribeAll } = useProductStore.getState();
        subscribeToProducts();

        return () => unsubscribeAll();
    }, [fetchProducts]);

    // Load more
    const handleLoadMore = () => {
        if (pagination.hasMore && !isLoading) {
            fetchProducts(false);
        }
    };

    return (
        <div className="container-elegant py-8 animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-heading font-semibold mb-2">
                    {filters.search ? `Search: "${filters.search}"` : 'All Products'}
                </h1>
                <p className="text-muted-foreground">
                    {products.length} products found
                </p>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-white rounded-lg border border-beige-200/50">
                {/* Mobile Filter */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="lg:hidden">
                            <SlidersHorizontal className="w-4 h-4 mr-2" />
                            Filters
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] bg-cream-100 p-0">
                        <SheetHeader className="p-6 pb-0">
                            <SheetTitle>Filters</SheetTitle>
                        </SheetHeader>
                        <div className="h-full px-6 py-4 overflow-y-auto">
                            <FilterSidebar />
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Sort */}
                <div className="flex items-center gap-2 ml-auto">
                    <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
                    <Select
                        value={filters.sortBy}
                        onValueChange={(value) => setFilters({ sortBy: value as typeof filters.sortBy })}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {SORT_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* View Mode */}
                <div className="hidden sm:flex items-center border rounded-lg overflow-hidden">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={cn(
                            'p-2 transition-colors',
                            viewMode === 'grid' ? 'bg-charcoal-100 text-white' : 'hover:bg-beige-100'
                        )}
                    >
                        <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={cn(
                            'p-2 transition-colors',
                            viewMode === 'list' ? 'bg-charcoal-100 text-white' : 'hover:bg-beige-100'
                        )}
                    >
                        <LayoutList className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex gap-8">
                {/* Sidebar - Desktop */}
                <aside className="hidden lg:block w-64 flex-shrink-0">
                    <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4">
                        <FilterSidebar />
                    </div>
                </aside>

                {/* Products */}
                <div className="flex-1">
                    <ProductGrid
                        products={products}
                        isLoading={isLoading}
                        variant={viewMode === 'list' ? 'horizontal' : 'default'}
                        columns={viewMode === 'grid' ? 4 : 2}
                    />

                    {/* Load More */}
                    {pagination.hasMore && (
                        <div className="mt-8 text-center">
                            <Button
                                variant="outline"
                                onClick={handleLoadMore}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Loading...' : 'Load More'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ShopPage({ categoryId }: { categoryId?: string }) {
    return (
        <Suspense fallback={<div>Loading shop...</div>}>
            <ShopContent categoryId={categoryId} />
        </Suspense>
    );
}
