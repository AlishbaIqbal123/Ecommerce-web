import { memo } from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  columns?: 2 | 3 | 4 | 5;
  variant?: 'default' | 'compact' | 'horizontal';
  className?: string;
  emptyMessage?: string;
}

export const ProductGrid = memo(({
  products,
  isLoading = false,
  columns = 4,
  variant = 'default',
  className,
  emptyMessage = 'No products found',
}: ProductGridProps) => {
  const columnClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
  };

  // If horizontal variant, we usually want 1 column on mobile, 2 on desktop
  const gridClasses = variant === 'horizontal'
    ? 'grid-cols-1 md:grid-cols-2'
    : columnClasses[columns];

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center py-20', className)}>
        <Loader2 className="w-8 h-8 animate-spin text-gold-100" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-20 text-center', className)}>
        <div className="w-20 h-20 bg-beige-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-charcoal-100/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">{emptyMessage}</h3>
        <p className="text-sm text-muted-foreground">
          Try adjusting your filters or search criteria
        </p>
      </div>
    );
  }

  return (
    <div className={cn('grid gap-4 md:gap-6', gridClasses, className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} variant={variant} />
      ))}
    </div>
  );
});

ProductGrid.displayName = 'ProductGrid';
