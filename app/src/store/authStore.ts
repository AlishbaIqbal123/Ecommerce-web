// ============================================
// AUTHENTICATION STORE (ZUSTAND)
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '@/types';
import {
  subscribeToAuthChanges,
  registerWithEmail,
  loginWithEmail,
  logout,
  signInWithGoogle,
  signInWithFacebook,
  resetPassword,
  updateUserDocument,
} from '@/lib/firebase/auth';

// ============================================
// AUTH STORE STATE & ACTIONS
// ============================================

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  authInitialized: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Auth operations
  register: (email: string, password: string, displayName: string, role?: UserRole) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;

  // Initialization
  initializeAuth: () => () => void;
}

// ============================================
// AUTH STORE IMPLEMENTATION
// ============================================

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      authInitialized: false,

      // Setters
      setUser: (user) => set({
        user,
        isAuthenticated: !!user,
        authInitialized: true
      }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Register
      register: async (email, password, displayName, role = 'user') => {
        set({ isLoading: true, error: null });
        try {
          const user = await registerWithEmail(email, password, displayName, role);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Registration failed';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      // Login
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const user = await loginWithEmail(email, password);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Login failed';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      // Google Login
      loginWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
          const user = await signInWithGoogle();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Google login failed';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      // Facebook Login
      loginWithFacebook: async () => {
        set({ isLoading: true, error: null });
        try {
          const user = await signInWithFacebook();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Facebook login failed';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      // Logout
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await logout();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Logout failed';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      // Forgot Password
      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          await resetPassword(email);
          set({ isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Password reset failed';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      // Update Profile
      updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const { user } = get();
          if (!user) throw new Error('Not authenticated');

          await updateUserDocument(user.id, data);
          set({
            user: { ...user, ...data },
            isLoading: false
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Profile update failed';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      // Initialize auth listener
      initializeAuth: () => {
        let unsubscribe = () => { };

        // Safety timeout: If Firebase takes too long (e.g., bad config), allow app to load
        const safetyTimeout = setTimeout(() => {
          if (!get().authInitialized) {
            console.warn('Auth initialization timed out - proceeding as unauthenticated');
            set({ authInitialized: true, user: null, isAuthenticated: false });
          }
        }, 3000);

        try {
          unsubscribe = subscribeToAuthChanges((user) => {
            clearTimeout(safetyTimeout);
            set({ user, isAuthenticated: !!user, authInitialized: true });
          });
        } catch (error) {
          clearTimeout(safetyTimeout);
          console.error("Auth subscription failed:", error);
          set({ authInitialized: true, user: null, isAuthenticated: false });
        }

        return () => {
          clearTimeout(safetyTimeout);
          unsubscribe();
        };
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// ============================================
// SELECTOR HOOKS
// ============================================

export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useUserRole = () => useAuthStore((state) => state.user?.role);
export const useIsAdmin = () => useAuthStore((state) => state.user?.role === 'admin');
export const useIsVendor = () => useAuthStore((state) => state.user?.role === 'vendor');
