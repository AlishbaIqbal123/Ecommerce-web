// ============================================
// USER & AUTHENTICATION TYPES
// ============================================

export type UserRole = 'user' | 'vendor' | 'admin';

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  role: UserRole;
  phoneNumber?: string | null;
  address?: Address;
  createdAt: Date;
  updatedAt: Date;
  isEmailVerified: boolean;
  favorites: string[];
  metadata?: Record<string, unknown>;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ============================================
// VENDOR TYPES
// ============================================

export type VendorStatus = 'pending' | 'approved' | 'suspended';

export interface Vendor {
  id: string;
  userId: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: Address;
  description: string;
  logo?: string;
  banner?: string;
  status: VendorStatus;
  rating: number;
  reviewCount: number;
  totalSales: number;
  totalOrders: number;
  createdAt: Date;
  updatedAt: Date;
  vendorType?: 'Brand' | 'Maker' | 'Artisan' | 'Curator';
  collaboratorStatus?: 'Solo' | 'Collaborator' | 'Enterprise';
  socialLinks?: {
    website?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  documents?: {
    businessLicense?: string;
    taxId?: string;
  };
  settings?: {
    autoFulfill: boolean;
    notificationPreferences: Record<string, boolean>;
  };
}

// ============================================
// CATEGORY TYPES
// ============================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
  metadata?: Record<string, unknown>;
}

// ============================================
// PRODUCT TYPES
// ============================================

export interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  price: number;
  inventory: number;
  options: Record<string, string>;
  image?: string;
}

export interface ShippingInfo {
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  freeShipping: boolean;
  shippingRate?: number;
}

export type ProductStatus = 'draft' | 'active' | 'archived';

export interface Product {
  id: string;
  vendorId: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  compareAtPrice?: number;
  costPerItem?: number;
  sku: string;
  barcode?: string;
  inventory: number;
  trackInventory: boolean;
  allowBackorders: boolean;
  images: string[];
  variants?: ProductVariant[];
  attributes?: Record<string, string | string[]>;
  tags: string[];
  status: ProductStatus;
  featured: boolean;
  rating: number;
  reviewCount: number;
  salesCount: number;
  viewsCount: number;
  seoTitle?: string;
  seoDescription?: string;
  shipping?: ShippingInfo;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>;
  // Denormalized fields
  vendorName?: string;
  categoryName?: string;
}

// ============================================
// CART TYPES
// ============================================

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  variant?: Record<string, string>;
  quantity: number;
  price: number;
  originalPrice?: number;
  name: string;
  slug: string;
  image: string;
  vendorId?: string;
  vendorName?: string;
  maxQuantity?: number;
}

export interface Cart {
  id: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// ORDER TYPES
// ============================================

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
export type FulfillmentStatus = 'unfulfilled' | 'partial' | 'fulfilled';

export interface OrderItem {
  productId: string;
  variantId?: string;
  vendorId: string;
  name: string;
  sku: string;
  image: string;
  quantity: number;
  price: number;
  total: number;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
  updatedBy: string;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: {
    type: 'card' | 'paypal';
    last4?: string;
    brand?: string;
  };
  stripePaymentIntentId?: string;
  notes?: string;
  internalNotes?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
  timeline: OrderTimelineEvent[];
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// REVIEW TYPES
// ============================================

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface ReviewReply {
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  orderId: string;
  rating: number;
  title: string;
  content: string;
  images: string[];
  helpful: number;
  verified: boolean;
  status: ReviewStatus;
  reply?: ReviewReply;
  createdAt: Date;
  updatedAt: Date;
  // Denormalized fields
  userName?: string;
  userPhotoURL?: string;
  productName?: string;
  productImage?: string;
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export type NotificationType =
  | 'order_placed'
  | 'order_confirmed'
  | 'order_shipped'
  | 'order_delivered'
  | 'order_cancelled'
  | 'product_low_stock'
  | 'review_received'
  | 'vendor_approved'
  | 'promotion'
  | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  readAt?: Date;
  actionUrl?: string;
  createdAt: Date;
}

// ============================================
// ANALYTICS TYPES
// ============================================

export interface DailyAnalytics {
  date: string;
  revenue: number;
  orders: number;
  itemsSold: number;
  visitors: number;
  pageViews: number;
  conversionRate: number;
  averageOrderValue: number;
  productStats: Record<string, {
    sales: number;
    revenue: number;
    views: number;
  }>;
}

export interface VendorAnalytics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  averageRating: number;
  dailyStats: DailyAnalytics[];
}

// ============================================
// FILTER & QUERY TYPES
// ============================================

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number | null;
  rating?: number;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'bestselling' | 'featured';
  search?: string;
  inStock?: boolean;
  featured?: boolean;
  onSale?: boolean;
  vendor?: string;
  tags?: string[];
}

export interface PaginationParams {
  page: number;
  limit: number;
  cursor?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  hasMore: boolean;
  nextCursor?: string;
  totalCount?: number;
}

// ============================================
// UI STATE TYPES
// ============================================

export interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  cartOpen: boolean;
  searchQuery: string;
  notifications: Notification[];
  toasts: Toast[];
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// ============================================
// STRIPE TYPES
// ============================================

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface ShippingRate {
  id: string;
  displayName: string;
  amount: number;
  estimatedDays: number;
}
