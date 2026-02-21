// ============================================
// PRODUCT STORE (ZUSTAND)
// ============================================

import { create } from 'zustand';
import type { Product, Category, ProductFilters } from '@/types';
import {
  getProducts,
  getProductBySlug,
  getCategories,
  subscribeToDocument,
  subscribeToCollection,
} from '@/lib/firebase/firestore';
import { PAGINATION } from '@/lib/constants';

// ============================================
// PRODUCT STORE STATE & ACTIONS
// ============================================

interface ProductState {
  // State
  products: Product[];
  featuredProducts: Product[];
  categories: Category[];
  currentProduct: Product | null;
  filters: ProductFilters;
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
    nextCursor?: string;
  };
  isLoading: boolean;
  error: string | null;

  // Subscriptions
  unsubscribeProduct: (() => void) | null;
  unsubscribeProducts: (() => void) | null;

  // Actions
  setFilters: (filters: Partial<ProductFilters>) => void;
  clearFilters: () => void;
  setPagination: (pagination: Partial<ProductState['pagination']>) => void;

  // Data fetching
  fetchProducts: (reset?: boolean) => Promise<void>;
  fetchProductBySlug: (slug: string) => Promise<Product | null>;
  fetchCategories: () => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;

  // Real-time subscriptions
  subscribeToProduct: (productId: string) => void;
  subscribeToProducts: (filters?: ProductFilters) => void;
  unsubscribeAll: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

// ============================================
// DEFAULT FILTERS
// ============================================

const defaultFilters: ProductFilters = {
  category: undefined,
  vendor: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  rating: undefined,
  inStock: undefined,
  featured: undefined,
  onSale: undefined,
  sortBy: 'newest',
  search: undefined,
};

// ============================================
// PRODUCT STORE IMPLEMENTATION
// ============================================

export const useProductStore = create<ProductState>()((set, get) => ({
  // Initial state
  products: [],
  featuredProducts: [],
  categories: [],
  currentProduct: null,
  filters: { ...defaultFilters },
  pagination: {
    page: PAGINATION.DEFAULT_PAGE,
    limit: PAGINATION.DEFAULT_LIMIT,
    hasMore: false,
  },
  isLoading: false,
  error: null,
  unsubscribeProduct: null,
  unsubscribeProducts: null,
  wishlist: [],

  // Set filters
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, page: 1, nextCursor: undefined },
    }));
    // Refetch with new filters
    get().fetchProducts(true);
  },

  // Clear filters
  clearFilters: () => {
    set({
      filters: { ...defaultFilters },
      pagination: { ...get().pagination, page: 1, nextCursor: undefined },
    });
    get().fetchProducts(true);
  },

  // Set pagination
  setPagination: (pagination) => {
    set((state) => ({
      pagination: { ...state.pagination, ...pagination },
    }));
  },

  // Fetch products
  fetchProducts: async (reset = false) => {
    const { filters, pagination } = get();

    if (reset) {
      set({ products: [], pagination: { ...pagination, page: 1, nextCursor: undefined } });
    }

    set({ isLoading: true, error: null });

    try {
      const result = await getProducts(filters, {
        page: pagination.page,
        limit: pagination.limit,
        cursor: reset ? undefined : pagination.nextCursor,
      });

      set((state) => ({
        products: reset ? result.data : [...state.products, ...result.data],
        pagination: {
          ...state.pagination,
          hasMore: result.hasMore,
          nextCursor: result.nextCursor,
        },
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch products';
      set({ error: message, isLoading: false });
    }
  },

  // Fetch single product by slug
  fetchProductBySlug: async (slug) => {
    set({ isLoading: true, error: null });

    try {
      const product = await getProductBySlug(slug);
      set({ currentProduct: product, isLoading: false });
      return product;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch product';
      set({ error: message, isLoading: false });
      return null;
    }
  },

  // Fetch categories
  fetchCategories: async () => {
    set({ isLoading: true, error: null });

    try {
      const categories = await getCategories();
      set({ categories, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch categories';
      set({ error: message, isLoading: false });
    }
  },

  // Fetch featured products
  fetchFeaturedProducts: async () => {
    set({ isLoading: true, error: null });

    try {
      const result = await getProducts({ featured: true }, { page: 1, limit: 8 });
      set({ featuredProducts: result.data, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch featured products';
      set({ error: message, isLoading: false });
    }
  },

  // Subscribe to real-time product updates
  subscribeToProduct: (productId) => {
    // Unsubscribe from previous subscription
    get().unsubscribeProduct?.();

    const unsubscribe = subscribeToDocument<Product>('products', productId, (product) => {
      set({ currentProduct: product });
    });

    set({ unsubscribeProduct: unsubscribe });
  },

  // Subscribe to real-time products collection with filters
  subscribeToProducts: (filters) => {
    // Unsubscribe from previous subscription
    get().unsubscribeProducts?.();

    // We fetch initial and then subscribe to changes
    // Alternatively, we can just use subscribeToCollection with constraints
    // For now, let's make it more robust
    const activeFilters = filters || get().filters;

    // This requires a helper in firestore.ts to build constraints
    import('@/lib/firebase/firestore').then(({ subscribeToCollection, where, limit, orderBy }) => {
      const constraints: any[] = [where('status', '==', 'active'), limit(20)];

      if (activeFilters.category) constraints.push(where('categoryId', '==', activeFilters.category));
      if (activeFilters.featured) constraints.push(where('featured', '==', true));

      const unsubscribe = subscribeToCollection<Product>('products', (products) => {
        set({ products });
      }, constraints);

      set({ unsubscribeProducts: unsubscribe });
    });
  },

  // Unsubscribe all
  unsubscribeAll: () => {
    get().unsubscribeProduct?.();
    get().unsubscribeProducts?.();
    set({ unsubscribeProduct: null, unsubscribeProducts: null });
  },

  // Toggle wishlist
  toggleWishlist: (productId) => {
    set((state) => {
      const isInWishlist = state.wishlist.includes(productId);
      if (isInWishlist) {
        return { wishlist: state.wishlist.filter((id) => id !== productId) };
      }
      return { wishlist: [...state.wishlist, productId] };
    });
  },

  // Check if product is in wishlist
  isInWishlist: (productId) => {
    return get().wishlist.includes(productId);
  },
}));

// ============================================
// SELECTOR HOOKS
// ============================================

export const useProducts = () => useProductStore((state) => state.products);
export const useFeaturedProducts = () => useProductStore((state) => state.featuredProducts);
export const useCategories = () => useProductStore((state) => state.categories);
export const useCurrentProduct = () => useProductStore((state) => state.currentProduct);
export const useProductFilters = () => useProductStore((state) => state.filters);
export const useProductLoading = () => useProductStore((state) => state.isLoading);
export const useProductError = () => useProductStore((state) => state.error);
export const useWishlist = () => useProductStore((state) => state.wishlist);
