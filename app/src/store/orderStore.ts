// ============================================
// ORDER STORE (ZUSTAND)
// ============================================

import { create } from 'zustand';
import type { Order, OrderStatus } from '@/types';
import {
  getOrdersByUser,
  getOrdersByVendor,
  getAllOrders,
  subscribeToCollection,
} from '@/lib/firebase/firestore';

// ============================================
// ORDER STORE STATE & ACTIONS
// ============================================

interface OrderState {
  // State
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  
  // Subscriptions
  unsubscribeOrders: (() => void) | null;
  
  // Actions
  fetchUserOrders: (userId: string) => Promise<void>;
  fetchVendorOrders: (vendorId: string) => Promise<void>;
  fetchAllOrders: (limit?: number) => Promise<void>;
  setCurrentOrder: (order: Order | null) => void;
  
  // Real-time subscriptions
  subscribeToUserOrders: (userId: string) => void;
  subscribeToVendorOrders: (vendorId: string) => void;
  unsubscribeAll: () => void;
  
  // Helpers
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByStatus: (status: OrderStatus) => Order[];
}

// ============================================
// ORDER STORE IMPLEMENTATION
// ============================================

export const useOrderStore = create<OrderState>()((set, get) => ({
  // Initial state
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  unsubscribeOrders: null,
  
  // Fetch user orders
  fetchUserOrders: async (userId) => {
    set({ isLoading: true, error: null });
    
    try {
      const orders = await getOrdersByUser(userId);
      set({ orders, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch orders';
      set({ error: message, isLoading: false });
    }
  },
  
  // Fetch vendor orders
  fetchVendorOrders: async (vendorId) => {
    set({ isLoading: true, error: null });
    
    try {
      const orders = await getOrdersByVendor(vendorId);
      set({ orders, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch orders';
      set({ error: message, isLoading: false });
    }
  },
  
  // Fetch all orders (admin)
  fetchAllOrders: async (limit = 100) => {
    set({ isLoading: true, error: null });
    
    try {
      const orders = await getAllOrders(limit);
      set({ orders, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch orders';
      set({ error: message, isLoading: false });
    }
  },
  
  // Set current order
  setCurrentOrder: (order) => {
    set({ currentOrder: order });
  },
  
  // Subscribe to user orders
  subscribeToUserOrders: (userId) => {
    get().unsubscribeOrders?.();
    
    const unsubscribe = subscribeToCollection<Order>(
      'orders',
      (orders) => {
        set({ orders: orders.filter((o) => o.userId === userId) });
      },
      []
    );
    
    set({ unsubscribeOrders: unsubscribe });
  },
  
  // Subscribe to vendor orders
  subscribeToVendorOrders: (vendorId) => {
    get().unsubscribeOrders?.();
    
    const unsubscribe = subscribeToCollection<Order>(
      'orders',
      (orders) => {
        set({
          orders: orders.filter((o) => o.items.some((item) => item.vendorId === vendorId)),
        });
      },
      []
    );
    
    set({ unsubscribeOrders: unsubscribe });
  },
  
  // Unsubscribe all
  unsubscribeAll: () => {
    get().unsubscribeOrders?.();
    set({ unsubscribeOrders: null });
  },
  
  // Get order by ID
  getOrderById: (orderId) => {
    return get().orders.find((order) => order.id === orderId);
  },
  
  // Get orders by status
  getOrdersByStatus: (status) => {
    return get().orders.filter((order) => order.status === status);
  },
}));

// ============================================
// SELECTOR HOOKS
// ============================================

export const useOrders = () => useOrderStore((state) => state.orders);
export const useCurrentOrder = () => useOrderStore((state) => state.currentOrder);
export const useOrderLoading = () => useOrderStore((state) => state.isLoading);
export const useOrderError = () => useOrderStore((state) => state.error);
