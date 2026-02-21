// ============================================
// UI STATE STORE (ZUSTAND)
// ============================================

import { create } from 'zustand';

// ============================================
// UI STORE STATE & ACTIONS
// ============================================

interface UIState {
  // Sidebar/Drawer states
  isCartOpen: boolean;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  isFilterOpen: boolean;
  
  // Modal states
  activeModal: string | null;
  modalData: Record<string, unknown> | null;
  
  // Toast/Notification
  toasts: Toast[];
  
  // Theme
  theme: 'light' | 'dark' | 'system';
  
  // Scroll
  scrollY: number;
  isScrolled: boolean;
  
  // Actions
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleSearch: () => void;
  setSearchOpen: (open: boolean) => void;
  toggleFilter: () => void;
  setFilterOpen: (open: boolean) => void;
  
  // Modal actions
  openModal: (modalId: string, data?: Record<string, unknown>) => void;
  closeModal: () => void;
  
  // Toast actions
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  
  // Theme actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Scroll actions
  setScrollY: (y: number) => void;
  setIsScrolled: (scrolled: boolean) => void;
}

// ============================================
// TOAST TYPE
// ============================================

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ============================================
// UI STORE IMPLEMENTATION
// ============================================

export const useUIStore = create<UIState>()((set, get) => ({
  // Initial state
  isCartOpen: false,
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isFilterOpen: false,
  activeModal: null,
  modalData: null,
  toasts: [],
  theme: 'light',
  scrollY: 0,
  isScrolled: false,
  
  // Cart
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  setCartOpen: (open) => set({ isCartOpen: open }),
  
  // Mobile menu
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  
  // Search
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  
  // Filter
  toggleFilter: () => set((state) => ({ isFilterOpen: !state.isFilterOpen })),
  setFilterOpen: (open) => set({ isFilterOpen: open }),
  
  // Modal
  openModal: (modalId, data) => set({ activeModal: modalId, modalData: data || null }),
  closeModal: () => set({ activeModal: null, modalData: null }),
  
  // Toast
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id, duration: toast.duration || 5000 };
    
    set((state) => ({ toasts: [...state.toasts, newToast] }));
    
    // Auto remove after duration
    setTimeout(() => {
      get().removeToast(id);
    }, newToast.duration);
  },
  
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
  
  clearToasts: () => set({ toasts: [] }),
  
  // Theme
  setTheme: (theme) => set({ theme }),
  
  // Scroll
  setScrollY: (y) => set({ scrollY: y }),
  setIsScrolled: (scrolled) => set({ isScrolled: scrolled }),
}));

// ============================================
// SELECTOR HOOKS
// ============================================

export const useIsCartOpen = () => useUIStore((state) => state.isCartOpen);
export const useIsMobileMenuOpen = () => useUIStore((state) => state.isMobileMenuOpen);
export const useIsSearchOpen = () => useUIStore((state) => state.isSearchOpen);
export const useIsFilterOpen = () => useUIStore((state) => state.isFilterOpen);
export const useActiveModal = () => useUIStore((state) => state.activeModal);
export const useToasts = () => useUIStore((state) => state.toasts);
export const useTheme = () => useUIStore((state) => state.theme);
export const useScrollY = () => useUIStore((state) => state.scrollY);
export const useIsScrolled = () => useUIStore((state) => state.isScrolled);
