'use client';

import { useEffect, useState } from 'react';
import { useProductStore, useAuthStore } from '@/store';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Product } from '@/types';
import { getDocument } from '@/lib/firebase/firestore';

export default function WishlistPage() {
    const { wishlist } = useProductStore();
    const { user } = useAuthStore();
    const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
    const [isLoadingWishlist, setIsLoadingWishlist] = useState(true);

    useEffect(() => {
        const loadWishlistProducts = async () => {
            if (wishlist.length === 0) {
                setWishlistProducts([]);
                setIsLoadingWishlist(false);
                return;
            }
            
            setIsLoadingWishlist(true);
            try {
                const fetched = await Promise.all(
                    wishlist.map(id => getDocument<Product>('products', id))
                );
                setWishlistProducts(fetched.filter(Boolean) as Product[]);
            } catch (error) {
                console.error("Failed to fetch wishlist products:", error);
            } finally {
                setIsLoadingWishlist(false);
            }
        };

        loadWishlistProducts();
    }, [wishlist]);

    return (
        <div className="container-elegant py-8 animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <Button variant="ghost" asChild className="mb-4 -ml-2">
                    <Link href="/shop">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Continue Shopping
                    </Link>
                </Button>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold-100/10 rounded-xl flex items-center justify-center">
                        <Heart className="w-5 h-5 text-gold-100" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-heading font-semibold">My Wishlist</h1>
                        <p className="text-muted-foreground text-sm">
                            {wishlist.length === 0
                                ? 'Your saved items will appear here'
                                : `${wishlist.length} saved item${wishlist.length !== 1 ? 's' : ''}`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Not signed in notice */}
            {!user && wishlist.length === 0 && (
                <div className="text-center py-20 bg-beige-100/30 rounded-2xl border border-dashed border-beige-300">
                    <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <h2 className="text-xl font-heading font-semibold mb-2">Sign in to save items</h2>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                        Sign in to save your favourite products and access them from any device.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Button asChild>
                            <Link href="/login">Sign In</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/shop">Browse Products</Link>
                        </Button>
                    </div>
                </div>
            )}

            {/* Empty wishlist (signed in) */}
            {user && wishlist.length === 0 && (
                <div className="text-center py-20 bg-beige-100/30 rounded-2xl border border-dashed border-beige-300">
                    <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <h2 className="text-xl font-heading font-semibold mb-2">Your wishlist is empty</h2>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                        Tap the heart icon on any product to save it here for later.
                    </p>
                    <Button asChild>
                        <Link href="/shop">
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Explore Products
                        </Link>
                    </Button>
                </div>
            )}

            {/* Wishlist products grid */}
            {wishlist.length > 0 && (
                <>
                    <ProductGrid
                        products={wishlistProducts}
                        isLoading={isLoadingWishlist && wishlistProducts.length === 0}
                        columns={4}
                    />

                    {/* If products loaded but none matched wishlist IDs (e.g. products deleted) */}
                    {!isLoadingWishlist && wishlistProducts.length === 0 && wishlist.length > 0 && (
                        <div className="text-center py-16 bg-beige-100/30 rounded-2xl border border-dashed border-beige-300">
                            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <h2 className="text-lg font-medium mb-2">Some saved items are no longer available</h2>
                            <p className="text-muted-foreground text-sm mb-6">
                                The products you saved may have been removed or are temporarily out of stock.
                            </p>
                            <Button variant="outline" asChild>
                                <Link href="/shop">Find New Products</Link>
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
