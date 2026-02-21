'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Heart, Share2, ShoppingBag, Star, Truck, Shield, RotateCcw, Minus, Plus, Store } from 'lucide-react';
import { useProductStore, useCartStore, useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProductGrid } from '@/components/product/ProductGrid';
import { formatCurrency, cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Product, Review } from '@/types';

// Related products mock (ideally fetched from DB based on category)
const relatedProducts: Product[] = [
    // We would fetch these based on category in a real app
];

export default function ProductPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const { addItem } = useCartStore();
    const { user } = useAuthStore();
    const { toggleWishlist, isInWishlist, isLoading } = useProductStore();

    const [isFetching, setIsFetching] = useState(true);
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        if (!slug) return;

        let unsubscribe = () => { };

        const loadProduct = async () => {
            setIsFetching(true);
            try {
                const { getProductBySlug, subscribeToDocument } = await import('@/lib/firebase/firestore');
                const initialProduct = await getProductBySlug(slug);

                if (initialProduct) {
                    setProduct(initialProduct);

                    // Increment views
                    const { incrementProductViews } = await import('@/lib/firebase/firestore');
                    incrementProductViews(initialProduct.id);

                    // Subscribe for real-time updates (stock, price, etc.)
                    unsubscribe = subscribeToDocument<Product>('products', initialProduct.id, (updatedProduct) => {
                        if (updatedProduct) {
                            setProduct(updatedProduct);
                        }
                    });
                }
            } catch (error) {
                console.error('Failed to load product:', error);
            } finally {
                setIsFetching(false);
            }
        };

        loadProduct();

        return () => {
            unsubscribe();
        };
    }, [slug]);

    if (isFetching) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-gold-100 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container-elegant py-20 text-center">
                <Package className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                <h1 className="text-2xl font-semibold mb-2">Product Not Found</h1>
                <p className="text-muted-foreground mb-6">The product you are looking for does not exist or has been removed.</p>
                <Button asChild>
                    <Link href="/shop">Back to Shop</Link>
                </Button>
            </div>
        );
    }

    const isWishlisted = isInWishlist(product.id);
    const hasDiscount = product.salePrice && product.salePrice < product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.price - (product.salePrice || product.price)) / product.price) * 100)
        : 0;

    const handleAddToCart = () => {
        if (product.inventory <= 0) {
            toast.error('This item is currently out of stock');
            return;
        }
        addItem(product, quantity);
        toast.success(`${product.name} added to cart`);
    };

    const handleToggleWishlist = () => {
        if (!user) {
            toast.error('Please sign in to add items to your wishlist');
            return;
        }
        toggleWishlist(product.id);
        toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    };

    const handleShare = async () => {
        try {
            await navigator.share({
                title: product.name,
                text: product.description.substring(0, 100),
                url: window.location.href,
            });
        } catch {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard');
        }
    };

    return (
        <div className="container-elegant py-8 animate-fade-in">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Link href="/" className="hover:text-gold-100 transition-colors">Home</Link>
                <span>/</span>
                <Link href="/shop" className="hover:text-gold-100 transition-colors">Shop</Link>
                <span>/</span>
                <Link href={`/category/${product.categoryId}`} className="hover:text-gold-100 transition-colors">
                    {product.categoryName || 'Category'}
                </Link>
                <span>/</span>
                <span className="text-foreground">{product.name}</span>
            </nav>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Images */}
                <div className="space-y-4">
                    {/* Main Image */}
                    <div className="aspect-square bg-beige-100 rounded-xl overflow-hidden">
                        <img
                            src={product.images[selectedImage]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&q=80';
                            }}
                        />
                    </div>

                    {/* Thumbnails */}
                    {product.images.length > 1 && (
                        <div className="flex gap-2">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={cn(
                                        'w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors',
                                        selectedImage === index
                                            ? 'border-gold-100'
                                            : 'border-transparent hover:border-beige-200'
                                    )}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name} - ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    {/* Vendor */}
                    <Link
                        href={`/vendor/${product.vendorId}`}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold-100 transition-colors"
                    >
                        <Store className="w-4 h-4" />
                        {product.vendorName}
                    </Link>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-heading font-semibold">
                        {product.name}
                    </h1>

                    {/* Rating */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={cn(
                                        'w-5 h-5',
                                        i < Math.floor(product.rating)
                                            ? 'fill-gold-100 text-gold-100'
                                            : 'text-beige-300'
                                    )}
                                />
                            ))}
                        </div>
                        <span className="text-sm">
                            {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {product.salesCount} sold
                        </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-semibold">
                            {formatCurrency(product.salePrice || product.price)}
                        </span>
                        {hasDiscount && (
                            <>
                                <span className="text-xl text-muted-foreground line-through">
                                    {formatCurrency(product.price)}
                                </span>
                                <Badge className="bg-red-500 text-white">-{discountPercent}%</Badge>
                            </>
                        )}
                    </div>

                    {/* Short Description */}
                    <p className="text-muted-foreground">{product.shortDescription}</p>

                    <Separator />

                    {/* Quantity & Actions */}
                    <div className="space-y-4">
                        {/* Quantity */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium">Quantity:</span>
                            <div className="flex items-center border rounded-lg">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 flex items-center justify-center hover:bg-beige-100 transition-colors"
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-12 text-center font-medium">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                                    className="w-10 h-10 flex items-center justify-center hover:bg-beige-100 transition-colors"
                                    disabled={quantity >= product.inventory}
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {product.inventory} available
                            </span>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <Button
                                size="lg"
                                className="flex-1"
                                onClick={handleAddToCart}
                                disabled={product.inventory <= 0}
                            >
                                <ShoppingBag className="w-5 h-5 mr-2" />
                                {product.inventory <= 0 ? 'Out of Stock' : 'Add to Cart'}
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={handleToggleWishlist}
                                className={cn(isWishlisted && 'text-red-500 border-red-200 bg-red-50')}
                            >
                                <Heart className={cn('w-5 h-5', isWishlisted && 'fill-current')} />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={handleShare}
                            >
                                <Share2 className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-3 gap-4 py-4">
                        <div className="text-center">
                            <Truck className="w-6 h-6 mx-auto mb-2 text-gold-100" />
                            <p className="text-xs text-muted-foreground">Free Shipping</p>
                        </div>
                        <div className="text-center">
                            <Shield className="w-6 h-6 mx-auto mb-2 text-gold-100" />
                            <p className="text-xs text-muted-foreground">Secure Payment</p>
                        </div>
                        <div className="text-center">
                            <RotateCcw className="w-6 h-6 mx-auto mb-2 text-gold-100" />
                            <p className="text-xs text-muted-foreground">Easy Returns</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mt-12">
                <Tabs defaultValue="description">
                    <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                        <TabsTrigger
                            value="description"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold-100 data-[state=active]:bg-transparent py-3"
                        >
                            Description
                        </TabsTrigger>
                        <TabsTrigger
                            value="specifications"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold-100 data-[state=active]:bg-transparent py-3"
                        >
                            Specifications
                        </TabsTrigger>
                        <TabsTrigger
                            value="reviews"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold-100 data-[state=active]:bg-transparent py-3"
                        >
                            Reviews ({product.reviewCount})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="description" className="mt-6">
                        <div className="prose max-w-none">
                            <p className="whitespace-pre-line">{product.description}</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="specifications" className="mt-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            {Object.entries(product.attributes || {}).map(([key, value]) => (
                                <div key={key} className="flex justify-between py-3 border-b border-beige-200">
                                    <span className="text-muted-foreground">{key}</span>
                                    <span className="font-medium">{value}</span>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="reviews" className="mt-6">
                        <div className="space-y-8">
                            {/* Write Review Form */}
                            {user && (
                                <div className="bg-beige-100/50 p-6 rounded-xl mb-8 border border-beige-200">
                                    <h3 className="text-lg font-medium mb-4">Write a Review</h3>
                                    <form className="space-y-4" onSubmit={async (e) => {
                                        e.preventDefault();
                                        const form = e.target as HTMLFormElement;
                                        const title = (form.elements.namedItem('reviewTitle') as HTMLInputElement).value;
                                        const content = (form.elements.namedItem('reviewContent') as HTMLTextAreaElement).value;
                                        const rating = Number((form.querySelector('[name=rating]') as HTMLInputElement)?.value || 5);

                                        try {
                                            const { createReview } = await import('@/lib/firebase/firestore');
                                            await createReview({
                                                productId: product.id,
                                                userId: user.id,
                                                userName: user.displayName || 'Anonymous',
                                                userPhotoURL: user.photoURL || '',
                                                rating,
                                                title,
                                                content,
                                                status: 'approved', // Auto-approve for demo
                                                createdAt: new Date(),
                                                updatedAt: new Date()
                                            } as any);
                                            toast.success('Review posted successfully!');
                                            form.reset();
                                        } catch (err) {
                                            toast.error('Failed to post review');
                                        }
                                    }}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm font-medium">Rating:</span>
                                            <input type="hidden" name="rating" defaultValue="5" />
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        className="text-gold-100 hover:scale-110 transition-transform"
                                                        onClick={(e) => {
                                                            const btn = e.currentTarget;
                                                            const input = btn.parentElement?.previousElementSibling as HTMLInputElement;
                                                            input.value = star.toString();
                                                            // Simple visual feedback
                                                            const stars = btn.parentElement?.children || [];
                                                            for (let i = 0; i < 5; i++) {
                                                                (stars[i]?.children[0] as SVGElement).style.fill = i < star ? 'currentColor' : 'none';
                                                            }
                                                        }}
                                                    >
                                                        <Star className="w-5 h-5 fill-current" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="reviewTitle">Review Title</Label>
                                            <Input id="reviewTitle" name="reviewTitle" placeholder="Sum up your experience" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="reviewContent">Your Review</Label>
                                            <textarea
                                                id="reviewContent"
                                                name="reviewContent"
                                                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-100 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="What did you like or dislike?"
                                                required
                                            />
                                        </div>
                                        <Button type="submit">Submit Review</Button>
                                    </form>
                                </div>
                            )}

                            <ReviewList productId={product.id} />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Related Products */}
            <div className="mt-16">
                <h2 className="text-2xl font-heading font-semibold mb-6">You May Also Like</h2>
                <ProductGrid products={relatedProducts} columns={4} />
            </div>
        </div>
    );
}

function ReviewList({ productId }: { productId: string }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let unsubscribe = () => { };
        const loadReviews = async () => {
            try {
                const { subscribeToCollection } = await import('@/lib/firebase/firestore');
                const { where, orderBy } = await import('firebase/firestore');

                unsubscribe = subscribeToCollection<Review>('reviews', (data) => {
                    setReviews(data);
                    setIsLoading(false);
                }, [
                    where('productId', '==', productId),
                    where('status', '==', 'approved'),
                    orderBy('createdAt', 'desc')
                ]);
            } catch (error) {
                console.error('Failed to load reviews:', error);
                setIsLoading(false);
            }
        };
        loadReviews();
        return () => unsubscribe();
    }, [productId]);

    if (isLoading) return <div className="py-10 text-center">Loading reviews...</div>;
    if (reviews.length === 0) return <div className="py-10 text-center text-muted-foreground">No reviews yet. Be the first to review!</div>;

    return (
        <div className="space-y-8">
            {reviews.map((review) => (
                <div key={review.id} className="border-b border-beige-200 pb-8 last:border-0">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={review.userPhotoURL} alt={review.userName} />
                                <AvatarFallback>{review.userName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{review.userName}</p>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={cn(
                                                'w-3 h-3',
                                                i < review.rating
                                                    ? 'fill-gold-100 text-gold-100'
                                                    : 'text-beige-300'
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <h4 className="font-medium mb-2">{review.title}</h4>
                    <p className="text-muted-foreground mb-4">{review.content}</p>
                </div>
            ))}
        </div>
    );
}
