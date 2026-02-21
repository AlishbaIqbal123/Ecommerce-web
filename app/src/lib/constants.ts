// ============================================
// APPLICATION CONSTANTS
// ============================================

// ============================================
// APP INFORMATION
// ============================================

export const APP_NAME = 'NoorMarket';
export const APP_TAGLINE = 'Discover Islamic Treasures for Your Home & Heart';
export const APP_DESCRIPTION = 'Your premier destination for Islamic products including prayer essentials, home decor, modest fashion, books, and more.';
export const APP_URL = 'https://noormarket.com';
export const SUPPORT_EMAIL = 'support@example.com';
export const SUPPORT_PHONE = '+1 (555) 000-0000';

// ============================================
// NAVIGATION
// ============================================

export const NAV_LINKS = {
  main: [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Categories', href: '/categories' },
    { label: 'Vendors', href: '/vendors' },
    { label: 'About', href: '/about' },
  ],
  footer: [
    {
      title: 'Shop',
      links: [
        { label: 'All Products', href: '/shop' },
        { label: 'New Arrivals', href: '/shop?sort=newest' },
        { label: 'Featured', href: '/shop?featured=true' },
        { label: 'Sale', href: '/shop?sale=true' },
      ],
    },
    {
      title: 'Categories',
      links: [
        { label: 'Prayer Essentials', href: '/category/prayer-essentials' },
        { label: 'Home Decor', href: '/category/home-decor' },
        { label: 'Modest Fashion', href: '/category/modest-fashion' },
        { label: 'Islamic Books', href: '/category/books' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact Us', href: '/contact' },
        { label: 'FAQs', href: '/faqs' },
        { label: 'Shipping Info', href: '/shipping' },
        { label: 'Returns', href: '/returns' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Our Story', href: '/our-story' },
        { label: 'Careers', href: '/careers' },
        { label: 'Press', href: '/press' },
      ],
    },
  ],
};

// ============================================
// PRODUCT CATEGORIES
// ============================================

export const PRODUCT_CATEGORIES = [
  {
    id: 'prayer-essentials',
    name: 'Prayer Essentials',
    description: 'Premium prayer mats, tasbihs, and spiritual tools',
    icon: 'Praying',
    image: '/images/categories/prayer-essentials.jpg',
    featured: true,
  },
  {
    id: 'home-decor',
    name: 'Home Decor',
    description: 'Islamic art, calligraphy, and decorative pieces',
    icon: 'Home',
    image: '/images/categories/home-decor.jpg',
    featured: true,
  },
  {
    id: 'modest-fashion',
    name: 'Abayas & Modest Wear',
    description: 'Full-coverage abayas, hijabs, and modest clothing',
    icon: 'Shirt',
    image: '/images/categories/modest-fashion.jpg',
    featured: true,
  },
  {
    id: 'books',
    name: 'Islamic Books',
    description: 'Quran, Hadith, and Islamic literature',
    icon: 'BookOpen',
    image: '/images/categories/books.jpg',
    featured: true,
  },
  {
    id: 'halal-food',
    name: 'Halal Food',
    description: 'Premium halal food products',
    icon: 'Utensils',
    image: '/images/products/dates-gift-1.jpg',
    featured: false,
  },
  {
    id: 'gifts',
    name: 'Gifts',
    description: 'Thoughtful Islamic gifts for loved ones',
    icon: 'Gift',
    image: '/images/categories/gifts.jpg',
    featured: false,
  },
  {
    id: 'kids',
    name: 'Kids',
    description: 'Islamic toys, books, and educational items',
    icon: 'Baby',
    image: '/images/categories/kids.jpg',
    featured: false,
  },
  {
    id: 'fragrances',
    name: 'Fragrances',
    description: 'Oud, attar, and Islamic perfumes',
    icon: 'Sparkles',
    image: '/images/products/tasbih-1.jpg',
    featured: false,
  },
] as const;

// ============================================
// PRODUCT FILTERS
// ============================================

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'bestselling', label: 'Best Selling' },
  { value: 'featured', label: 'Featured' },
] as const;

export const PRICE_RANGES = [
  { value: '0-25', label: 'Under $25', min: 0, max: 25 },
  { value: '25-50', label: '$25 - $50', min: 25, max: 50 },
  { value: '50-100', label: '$50 - $100', min: 50, max: 100 },
  { value: '100-200', label: '$100 - $200', min: 100, max: 200 },
  { value: '200+', label: '$200 & Above', min: 200, max: null },
] as const;

export const RATING_FILTERS = [
  { value: '4', label: '4★ & above' },
  { value: '3', label: '3★ & above' },
  { value: '2', label: '2★ & above' },
] as const;

// ============================================
// PAGINATION
// ============================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  LIMIT_OPTIONS: [12, 24, 48, 96],
  MAX_LIMIT: 100,
} as const;

// ============================================
// CART
// ============================================

export const CART = {
  MAX_QUANTITY_PER_ITEM: 99,
  MIN_ORDER_AMOUNT: 10,
  FREE_SHIPPING_THRESHOLD: 75,
  TAX_RATE: 0.08, // 8%
} as const;

// ============================================
// SHIPPING
// ============================================

export const SHIPPING = {
  METHODS: [
    { id: 'standard', name: 'Standard Shipping', price: 5.99, days: '5-10' },
    { id: 'express', name: 'Express Shipping', price: 14.99, days: '2-5' },
    { id: 'overnight', name: 'Overnight Shipping', price: 29.99, days: '1-2' },
  ],
  FREE_THRESHOLD: 75,
  INTERNATIONAL_RATE: 24.99,
} as const;

// ============================================
// ORDER STATUS
// ============================================

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

export const ORDER_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  processing: { label: 'Processing', color: 'bg-purple-100 text-purple-800' },
  shipped: { label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800' },
};

// ============================================
// PAYMENT STATUS
// ============================================

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
} as const;

// ============================================
// VENDOR STATUS
// ============================================

export const VENDOR_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
} as const;

export const VENDOR_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-800' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
  suspended: { label: 'Suspended', color: 'bg-gray-100 text-gray-800' },
};

// ============================================
// USER ROLES
// ============================================

export const USER_ROLES = {
  USER: 'user',
  VENDOR: 'vendor',
  ADMIN: 'admin',
} as const;

// ============================================
// REVIEW
// ============================================

export const REVIEW = {
  MIN_LENGTH: 10,
  MAX_LENGTH: 1000,
  MIN_RATING: 1,
  MAX_RATING: 5,
} as const;

// ============================================
// NOTIFICATION TYPES
// ============================================

export const NOTIFICATION_TYPES = {
  ORDER: 'order',
  PRODUCT: 'product',
  VENDOR: 'vendor',
  REVIEW: 'review',
  SYSTEM: 'system',
  PROMOTION: 'promotion',
} as const;

// ============================================
// IMAGE UPLOAD
// ============================================

export const IMAGE_UPLOAD = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES_PER_PRODUCT: 10,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_DIMENSION: 2048,
} as const;

// ============================================
// SEO
// ============================================

export const SEO = {
  DEFAULT_TITLE: `${APP_NAME} - ${APP_TAGLINE}`,
  DEFAULT_DESCRIPTION: APP_DESCRIPTION,
  DEFAULT_IMAGE: '/images/og-image.jpg',
  TWITTER_HANDLE: '@noormarket',
  FACEBOOK_APP_ID: '',
} as const;

// ============================================
// SOCIAL LINKS
// ============================================

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/noormarket',
  instagram: 'https://instagram.com/noormarket',
  twitter: 'https://twitter.com/noormarket',
  pinterest: 'https://pinterest.com/noormarket',
  youtube: 'https://youtube.com/noormarket',
} as const;

// ============================================
// BUSINESS HOURS
// ============================================

export const BUSINESS_HOURS = {
  monday: '9:00 AM - 6:00 PM',
  tuesday: '9:00 AM - 6:00 PM',
  wednesday: '9:00 AM - 6:00 PM',
  thursday: '9:00 AM - 6:00 PM',
  friday: '9:00 AM - 6:00 PM',
  saturday: '10:00 AM - 4:00 PM',
  sunday: 'Closed',
} as const;

// ============================================
// ANIMATION DURATIONS
// ============================================

export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  PAGE_TRANSITION: 400,
} as const;

// ============================================
// BREAKPOINTS
// ============================================

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// ============================================
// ERROR MESSAGES
// ============================================

export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  SERVER: 'Server error. Please try again later.',
  TIMEOUT: 'Request timed out. Please try again.',
  CART_EMPTY: 'Your cart is empty.',
  OUT_OF_STOCK: 'This item is currently out of stock.',
  INVALID_COUPON: 'Invalid or expired coupon code.',
  MIN_ORDER: `Minimum order amount is $${CART.MIN_ORDER_AMOUNT}.`,
} as const;

// ============================================
// SUCCESS MESSAGES
// ============================================

export const SUCCESS_MESSAGES = {
  LOGIN: 'Welcome back!',
  REGISTER: 'Account created successfully!',
  LOGOUT: 'You have been logged out.',
  PROFILE_UPDATE: 'Profile updated successfully.',
  PASSWORD_RESET: 'Password reset email sent.',
  ORDER_PLACED: 'Order placed successfully!',
  ITEM_ADDED_TO_CART: 'Item added to cart.',
  ITEM_REMOVED_FROM_CART: 'Item removed from cart.',
  WISHLIST_ADDED: 'Added to wishlist.',
  WISHLIST_REMOVED: 'Removed from wishlist.',
  REVIEW_SUBMITTED: 'Review submitted successfully.',
  VENDOR_APPLIED: 'Vendor application submitted.',
  PRODUCT_CREATED: 'Product created successfully.',
  PRODUCT_UPDATED: 'Product updated successfully.',
  PRODUCT_DELETED: 'Product deleted successfully.',
} as const;
