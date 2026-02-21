// ============================================
// CART STORE (ZUSTAND)
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';
import { generateId } from '@/lib/utils';
import { CART } from '@/lib/constants';

// ============================================
// CART STORE STATE & ACTIONS
// ============================================

interface CartState {
  // State
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  isCartOpen: boolean;
  customShippingCost: number;

  // Actions
  addItem: (product: Product, quantity?: number, variant?: Record<string, string>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  updateShippingCost: (cost: number) => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;

  // Helpers
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
}

// ============================================
// CART STORE IMPLEMENTATION
// ============================================

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      isLoading: false,
      error: null,
      isCartOpen: false,
      customShippingCost: 0,

      // Add item to cart
      addItem: (product, quantity = 1, variant) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.productId === product.id &&
              JSON.stringify(item.variant) === JSON.stringify(variant)
          );

          if (existingItemIndex > -1) {
            const updatedItems = [...state.items];
            const newQuantity = Math.min(
              updatedItems[existingItemIndex].quantity + quantity,
              CART.MAX_QUANTITY_PER_ITEM
            );
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: newQuantity,
            };
            return { items: updatedItems };
          }

          const newItem: CartItem = {
            id: generateId(),
            productId: product.id,
            name: product.name,
            slug: product.slug,
            price: product.salePrice || product.price,
            originalPrice: product.price,
            quantity: Math.min(quantity, CART.MAX_QUANTITY_PER_ITEM),
            image: product.images[0] || '',
            variant,
            vendorId: product.vendorId,
            vendorName: product.vendorName,
            maxQuantity: product.inventory,
          };

          return { items: [...state.items, newItem] };
        });
      },

      // Remove item
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      // Update quantity
      updateQuantity: (itemId, quantity) => {
        if (quantity < 1) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? { ...item, quantity: Math.min(quantity, CART.MAX_QUANTITY_PER_ITEM) }
              : item
          ),
        }));
      },

      // Clear cart
      clearCart: () => {
        set({ items: [], customShippingCost: 0 });
      },

      // Update shipping cost
      updateShippingCost: (cost) => {
        set({ customShippingCost: cost });
      },

      // Toggle cart drawer
      toggleCart: () => {
        set((state) => ({ isCartOpen: !state.isCartOpen }));
      },

      // Set cart open
      setCartOpen: (open) => {
        set({ isCartOpen: open });
      },

      // Check if product is in cart
      isInCart: (productId) => {
        return get().items.some((item) => item.productId === productId);
      },

      // Get quantity of a product in cart
      getItemQuantity: (productId) => {
        const item = get().items.find((item) => item.productId === productId);
        return item?.quantity || 0;
      },
    }),
    {
      name: 'cart-storage',
      // Only persist items and custom shipping — do NOT persist computed values
      partialize: (state) => ({
        items: state.items,
        customShippingCost: state.customShippingCost,
      }),
    }
  )
);

// ============================================
// SELECTOR HOOKS
// All computed values are derived from `items` directly in the selector.
// This fixes the bug where JS getters defined on the store object are stripped
// by Zustand's persist middleware when state is re-hydrated from localStorage,
// causing itemCount / subtotal / etc. to always return undefined after page load.
// ============================================

export const useCartItems = () => useCartStore((state) => state.items);

export const useCartItemCount = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );

export const useCartSubtotal = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

export const useCartShipping = () =>
  useCartStore((state) => {
    const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (subtotal >= CART.FREE_SHIPPING_THRESHOLD) return 0;
    return state.customShippingCost || 5.99;
  });

export const useCartTax = () =>
  useCartStore((state) => {
    const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return Math.round(subtotal * CART.TAX_RATE * 100) / 100;
  });

export const useCartTotal = () =>
  useCartStore((state) => {
    const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping =
      subtotal >= CART.FREE_SHIPPING_THRESHOLD ? 0 : state.customShippingCost || 5.99;
    const tax = Math.round(subtotal * CART.TAX_RATE * 100) / 100;
    return subtotal + shipping + tax;
  });
