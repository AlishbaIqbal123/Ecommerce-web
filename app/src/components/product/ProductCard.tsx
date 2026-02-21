import { memo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import type { Product } from '@/types';
import { useCartStore, useProductStore, useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'horizontal';
  className?: string;
}

export const ProductCard = memo(({ product, variant = 'default', className }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useProductStore();
  const { isAuthenticated } = useAuthStore();
  const [imageError, setImageError] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - (product.salePrice || product.price)) / product.price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.inventory <= 0) {
      toast.error('This item is currently out of stock');
      return;
    }

    addItem(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please sign in to add items to your wishlist');
      return;
    }

    toggleWishlist(product.id);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  // Compact variant
  if (variant === 'compact') {
    return (
      <Link
        href={`/product/${product.slug}`}
        className={cn(
          'group block bg-white rounded-lg border border-beige-200/50 overflow-hidden',
          'hover:shadow-soft transition-all duration-300',
          className
        )}
      >
        <div className="relative aspect-square bg-beige-100 overflow-hidden">
          {product.images?.[0] && !imageError ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, 25vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-charcoal-100/30" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && (
              <Badge className="bg-red-500 text-white text-xs">-{discountPercent}%</Badge>
            )}
            {product.featured && (
              <Badge className="bg-gold-100 text-white text-xs">Featured</Badge>
            )}
            {product.inventory <= 5 && product.inventory > 0 && (
              <Badge variant="outline" className="bg-white text-xs">
                Only {product.inventory} left
              </Badge>
            )}
          </div>
        </div>

        <div className="p-3">
          <Link href={`/vendor/${product.vendorId}`} className="text-xs text-muted-foreground mb-1 hover:text-gold-100 transition-colors">
            {product.vendorName}
          </Link>
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-gold-100 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-semibold text-sm">
              {formatCurrency(product.salePrice || product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Horizontal variant
  if (variant === 'horizontal') {
    return (
      <Link
        href={`/product/${product.slug}`}
        className={cn(
          'group flex gap-4 bg-white rounded-lg border border-beige-200/50 p-3',
          'hover:shadow-soft transition-all duration-300',
          className
        )}
      >
        <div className="relative w-24 h-24 bg-beige-100 rounded-md overflow-hidden flex-shrink-0">
          {product.images?.[0] && !imageError ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="96px"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-charcoal-100/30" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <Link href={`/vendor/${product.vendorId}`} className="text-xs text-muted-foreground hover:text-gold-100 transition-colors">
            {product.vendorName}
          </Link>
          <h3 className="font-medium line-clamp-1 group-hover:text-gold-100 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3 h-3 fill-gold-100 text-gold-100" />
              <span className="text-xs">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
            </div>
          )}

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {formatCurrency(product.salePrice || product.price)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>

            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={product.inventory <= 0}
            >
              <ShoppingBag className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <div
      className={cn(
        'group bg-white rounded-xl border border-beige-200/50 overflow-hidden',
        'hover:shadow-soft transition-all duration-300',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] bg-beige-100 overflow-hidden">
        {product.images?.[0] && !imageError ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority={product.featured}
            className={cn(
              'object-cover transition-all duration-700',
              isHovered && 'scale-105'
            )}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-charcoal-100/30" />
          </div>
        )}

        {/* Overlay Actions */}
        <div
          className={cn(
            'absolute inset-x-0 bottom-0 p-4 flex gap-2 transition-all duration-300',
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <Button
            className="flex-1"
            onClick={handleAddToCart}
            disabled={product.inventory <= 0}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            {product.inventory <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleToggleWishlist}
            className={cn(
              'bg-white',
              isWishlisted && 'text-red-500 border-red-200 bg-red-50'
            )}
          >
            <Heart className={cn('w-4 h-4', isWishlisted && 'fill-current')} />
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <Badge className="bg-red-500 text-white">-{discountPercent}%</Badge>
          )}
          {product.featured && (
            <Badge className="bg-gold-100 text-white">Featured</Badge>
          )}
          {product.inventory <= 5 && product.inventory > 0 && (
            <Badge variant="outline" className="bg-white">
              Only {product.inventory} left
            </Badge>
          )}
          {product.inventory <= 0 && (
            <Badge variant="secondary" className="bg-charcoal-100 text-white">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Quick View Button */}
        <button
          className={cn(
            'absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center',
            'shadow-lg transition-all duration-300 hover:bg-gold-100 hover:text-white',
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          )}
          onClick={(e) => {
            e.preventDefault();
            // Quick view modal would open here
          }}
        >
          <Eye className="w-4 h-4" />
        </button>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Vendor */}
        <Link href={`/vendor/${product.vendorId}`} className="text-xs text-muted-foreground mb-1 block hover:text-gold-100 transition-colors uppercase tracking-wider font-medium">
          {product.vendorName}
        </Link>

        {/* Title */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-medium line-clamp-2 group-hover:text-gold-100 transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-3.5 h-3.5',
                    i < Math.floor(product.rating)
                      ? 'fill-gold-100 text-gold-100'
                      : 'text-beige-300'
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">
            {formatCurrency(product.salePrice || product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
