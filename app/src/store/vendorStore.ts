// ============================================
// VENDOR STORE (ZUSTAND)
// ============================================

import { create } from 'zustand';
import type { Vendor, Product } from '@/types';
import {
  getVendors,
  getAllVendorsAdmin,
  getVendorByUserId,
  getProductsByVendor,
  subscribeToDocument,
} from '@/lib/firebase/firestore';

// ============================================
// VENDOR STORE STATE & ACTIONS
// ============================================

interface VendorState {
  // State
  vendors: Vendor[];
  currentVendor: Vendor | null;
  vendorProducts: Product[];
  isLoading: boolean;
  error: string | null;

  // Subscriptions
  unsubscribeVendor: (() => void) | null;

  // Actions
  fetchVendors: (status?: Vendor['status']) => Promise<void>;
  fetchVendorsAdmin: () => Promise<void>;
  fetchVendorByUserId: (userId: string) => Promise<Vendor | null>;
  fetchVendorProducts: (vendorId: string) => Promise<void>;
  setCurrentVendor: (vendor: Vendor | null) => void;

  // Real-time subscriptions
  subscribeToVendor: (vendorId: string) => void;
  unsubscribeAll: () => void;

  // Helpers
  getVendorById: (vendorId: string) => Vendor | undefined;
}

// ============================================
// VENDOR STORE IMPLEMENTATION
// ============================================

export const useVendorStore = create<VendorState>()((set, get) => ({
  // Initial state
  vendors: [],
  currentVendor: null,
  vendorProducts: [],
  isLoading: false,
  error: null,
  unsubscribeVendor: null,

  // Fetch all vendors
  fetchVendors: async (status) => {
    set({ isLoading: true, error: null });

    try {
      const vendors = await getVendors(status);
      set({ vendors, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch vendors';
      set({ error: message, isLoading: false });
    }
  },

  // Fetch all vendors (Admin only)
  fetchVendorsAdmin: async () => {
    set({ isLoading: true, error: null });

    try {
      const vendors = await getAllVendorsAdmin();
      set({ vendors, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch admin vendors';
      set({ error: message, isLoading: false });
    }
  },

  // Fetch vendor by user ID
  fetchVendorByUserId: async (userId) => {
    set({ isLoading: true, error: null });

    try {
      const vendor = await getVendorByUserId(userId);
      set({ currentVendor: vendor, isLoading: false });
      return vendor;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch vendor';
      set({ error: message, isLoading: false });
      return null;
    }
  },

  // Fetch vendor products
  fetchVendorProducts: async (vendorId) => {
    set({ isLoading: true, error: null });

    try {
      const products = await getProductsByVendor(vendorId);
      set({ vendorProducts: products, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch vendor products';
      set({ error: message, isLoading: false });
    }
  },

  // Set current vendor
  setCurrentVendor: (vendor) => {
    set({ currentVendor: vendor });
  },

  // Subscribe to vendor updates
  subscribeToVendor: (vendorId) => {
    get().unsubscribeVendor?.();

    const unsubscribe = subscribeToDocument<Vendor>('vendors', vendorId, (vendor) => {
      set({ currentVendor: vendor });
    });

    set({ unsubscribeVendor: unsubscribe });
  },

  // Unsubscribe all
  unsubscribeAll: () => {
    get().unsubscribeVendor?.();
    set({ unsubscribeVendor: null });
  },

  // Get vendor by ID
  getVendorById: (vendorId) => {
    return get().vendors.find((vendor) => vendor.id === vendorId);
  },
}));

// ============================================
// SELECTOR HOOKS
// ============================================

export const useVendors = () => useVendorStore((state) => state.vendors);
export const useCurrentVendor = () => useVendorStore((state) => state.currentVendor);
export const useVendorProducts = () => useVendorStore((state) => state.vendorProducts);
export const useVendorLoading = () => useVendorStore((state) => state.isLoading);
export const useVendorError = () => useVendorStore((state) => state.error);
