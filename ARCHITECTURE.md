# NoorMarket - Islamic Products E-Commerce Platform
## Architecture Documentation

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Next.js   │  │  Tailwind   │  │  ShadCN UI  │  │   React Query       │ │
│  │   App Router│  │    CSS      │  │  Components │  │   (State Mgmt)      │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FIREBASE SERVICES                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Firebase   │  │  Firestore  │  │   Storage   │  │  Realtime Database  │ │
│  │    Auth     │  │  (NoSQL DB) │  │   (Images)  │  │  (Live Updates)     │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          EXTERNAL SERVICES                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Stripe    │  │   Vercel    │  │   Algolia   │  │   SendGrid/         │ │
│  │  (Payments) │  │  (Hosting)  │  │   (Search)  │  │   Firebase Email    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Justification

| Technology | Purpose | Justification |
|------------|---------|---------------|
| **Next.js 15 (App Router)** | Frontend Framework | SSR/SSG for SEO, API routes, file-based routing, React 19 support |
| **TypeScript** | Type Safety | Catch errors at compile time, better IDE support, maintainability |
| **Tailwind CSS** | Styling | Utility-first, rapid development, consistent design system |
| **ShadCN UI** | Component Library | Accessible, customizable, Radix-based, modern aesthetics |
| **Firebase Auth** | Authentication | Built-in OAuth, email verification, secure, scalable |
| **Firestore** | Primary Database | Real-time sync, offline support, horizontal scaling |
| **Firebase Storage** | File Storage | CDN delivery, security rules integration, cost-effective |
| **Firebase Realtime DB** | Live Updates | Low-latency stock/tracking updates, presence detection |
| **Stripe** | Payments | PCI compliant, global support, subscription-ready |
| **React Query** | State Management | Caching, optimistic updates, background refetching |
| **Zustand** | Global State | Lightweight, TypeScript-friendly, minimal boilerplate |

---

## 3. Folder Structure

```
noormarket/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── verify-email/page.tsx
│   │   └── layout.tsx
│   ├── (shop)/                   # Shop route group
│   │   ├── page.tsx              # Home
│   │   ├── products/page.tsx
│   │   ├── products/[slug]/page.tsx
│   │   ├── categories/[slug]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── wishlist/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/              # Dashboard route group
│   │   ├── vendor/
│   │   │   ├── page.tsx
│   │   │   ├── products/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   └── analytics/page.tsx
│   │   ├── admin/
│   │   │   ├── page.tsx
│   │   │   ├── vendors/page.tsx
│   │   │   ├── products/page.tsx
│   │   │   └── orders/page.tsx
│   │   └── layout.tsx
│   ├── api/                      # API Routes
│   │   ├── stripe/
│   │   │   └── create-payment-intent/route.ts
│   │   └── webhooks/
│   │       └── stripe/route.ts
│   ├── layout.tsx
│   ├── globals.css
│   └── loading.tsx
├── components/                   # React Components
│   ├── ui/                       # ShadCN UI components
│   ├── common/                   # Shared components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   └── LoadingSpinner.tsx
│   ├── auth/                     # Auth components
│   ├── shop/                     # Shop components
│   ├── vendor/                   # Vendor components
│   └── admin/                    # Admin components
├── hooks/                        # Custom React Hooks
│   ├── useAuth.ts
│   ├── useCart.ts
│   ├── useProducts.ts
│   └── useRealtime.ts
├── lib/                          # Utilities & Config
│   ├── firebase/                 # Firebase config
│   │   ├── config.ts
│   │   ├── auth.ts
│   │   ├── firestore.ts
│   │   └── storage.ts
│   ├── stripe/                   # Stripe config
│   │   └── config.ts
│   ├── utils.ts
│   └── constants.ts
├── types/                        # TypeScript Types
│   ├── index.ts
│   ├── auth.ts
│   ├── product.ts
│   ├── order.ts
│   └── vendor.ts
├── store/                        # State Management
│   ├── index.ts
│   ├── authStore.ts
│   ├── cartStore.ts
│   └── uiStore.ts
├── services/                     # Business Logic
│   ├── authService.ts
│   ├── productService.ts
│   ├── orderService.ts
│   └── vendorService.ts
├── styles/                       # Global Styles
│   └── fonts.ts
├── public/                       # Static Assets
│   └── images/
├── tests/                        # Test Files
│   ├── unit/
│   └── integration/
├── firestore.rules               # Firestore Security Rules
├── storage.rules                 # Storage Security Rules
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. Data Modeling (Firestore Collections)

### Collection Structure

```
users/{userId}                    # User profiles
├── email: string
├── displayName: string
├── photoURL: string
├── role: 'user' | 'vendor' | 'admin'
├── phoneNumber: string
├── address: Address
├── createdAt: timestamp
├── updatedAt: timestamp
├── isEmailVerified: boolean
├── favorites: string[]           # Product IDs
└── metadata: object

vendors/{vendorId}                # Vendor profiles
├── userId: string                # Reference to users
├── businessName: string
├── businessEmail: string
├── businessPhone: string
├── businessAddress: Address
├── description: string
├── logo: string                  # Storage URL
├── banner: string                # Storage URL
├── status: 'pending' | 'approved' | 'suspended'
├── rating: number
├── reviewCount: number
├── totalSales: number
├── totalOrders: number
├── createdAt: timestamp
├── updatedAt: timestamp
├── socialLinks: object
├── documents: object             # Verification docs
└── settings: object

categories/{categoryId}           # Product categories
├── name: string
├── slug: string
├── description: string
├── image: string
├── parentId: string?             # For subcategories
├── sortOrder: number
├── isActive: boolean
└── metadata: object

products/{productId}              # Product catalog
├── vendorId: string
├── categoryId: string
├── name: string
├── slug: string
├── description: string
├── shortDescription: string
├── price: number
├── compareAtPrice: number?
├── costPerItem: number           # For vendor analytics
├── sku: string
├── barcode: string?
├── inventory: number
├── trackInventory: boolean
├── allowBackorders: boolean
├── images: string[]              # Storage URLs
├── variants: ProductVariant[]    # Size, color, etc.
├── attributes: object            # Custom attributes
├── tags: string[]
├── status: 'draft' | 'active' | 'archived'
├── featured: boolean
├── rating: number
├── reviewCount: number
├── salesCount: number
├── viewsCount: number
├── seoTitle: string
├── seoDescription: string
├── shipping: ShippingInfo
├── createdAt: timestamp
├── updatedAt: timestamp
└── metadata: object

carts/{cartId}                    # Shopping carts
├── userId: string?
├── sessionId: string?            # For guest carts
├── items: CartItem[]
├── subtotal: number
├── tax: number
├── shipping: number
├── discount: number
├── total: number
├── currency: string
├── createdAt: timestamp
└── updatedAt: timestamp

orders/{orderId}                  # Customer orders
├── userId: string
├── orderNumber: string
├── status: OrderStatus
├── paymentStatus: PaymentStatus
├── fulfillmentStatus: FulfillmentStatus
├── items: OrderItem[]
├── subtotal: number
├── tax: number
├── shipping: number
├── discount: number
├── total: number
├── currency: string
├── shippingAddress: Address
├── billingAddress: Address
├── paymentMethod: object
├── stripePaymentIntentId: string
├── notes: string
├── internalNotes: string
├── trackingNumber: string?
├── trackingUrl: string?
├── shippedAt: timestamp?
├── deliveredAt: timestamp?
├── timeline: OrderTimelineEvent[]
├── createdAt: timestamp
└── updatedAt: timestamp

reviews/{reviewId}                # Product reviews
├── productId: string
├── userId: string
├── orderId: string
├── rating: number                # 1-5
├── title: string
├── content: string
├── images: string[]
├── helpful: number               # Upvotes
├── verified: boolean             # Verified purchase
├── status: 'pending' | 'approved' | 'rejected'
├── reply: object                 # Vendor reply
├── createdAt: timestamp
└── updatedAt: timestamp

notifications/{notificationId}    # User notifications
├── userId: string
├── type: NotificationType
├── title: string
├── message: string
├── data: object                  # Related entity IDs
├── read: boolean
├── readAt: timestamp?
├── createdAt: timestamp
└── actionUrl: string?

analytics/{vendorId}/daily/{date} # Vendor analytics
├── date: string                  # YYYY-MM-DD
├── revenue: number
├── orders: number
├── itemsSold: number
├── visitors: number
├── pageViews: number
├── conversionRate: number
├── averageOrderValue: number
└── productStats: object
```

### Type Definitions

```typescript
// Address
interface Address {
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

// Product Variant
interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  price: number;
  inventory: number;
  options: Record<string, string>; // { size: 'M', color: 'Black' }
  image?: string;
}

// Cart Item
interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

// Order Item
interface OrderItem {
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

// Order Status
 type OrderStatus = 
  | 'placed'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

// Order Timeline
interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: Timestamp;
  note?: string;
  updatedBy: string;
}
```

---

## 5. Security Rules Strategy

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isVendor() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'vendor';
    }
    
    function isApprovedVendor() {
      return isVendor() && 
        get(/databases/$(database)/documents/vendors/$(request.auth.uid)).data.status == 'approved';
    }

    // Users collection
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isOwner(userId);
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }

    // Vendors collection
    match /vendors/{vendorId} {
      allow read: if true;
      allow create: if isAuthenticated() && request.auth.uid == vendorId;
      allow update: if isOwner(vendorId) || isAdmin();
      allow delete: if isAdmin();
    }

    // Products collection
    match /products/{productId} {
      allow read: if true;
      allow create: if isApprovedVendor() && request.resource.data.vendorId == request.auth.uid;
      allow update: if (isVendor() && resource.data.vendorId == request.auth.uid) || isAdmin();
      allow delete: if (isVendor() && resource.data.vendorId == request.auth.uid) || isAdmin();
    }

    // Categories collection
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Carts collection
    match /carts/{cartId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }

    // Orders collection
    match /orders/{orderId} {
      allow read: if isAuthenticated() && 
        (resource.data.userId == request.auth.uid || 
         resource.data.items[0].vendorId == request.auth.uid ||
         isAdmin());
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update: if isAdmin() || 
        (isVendor() && resource.data.items[0].vendorId == request.auth.uid);
    }

    // Reviews collection
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if isAuthenticated() && 
        request.resource.data.userId == request.auth.uid;
      allow update: if isAdmin();
      allow delete: if isAdmin() || isOwner(resource.data.userId);
    }

    // Notifications collection
    match /notifications/{notificationId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAdmin() || isVendor();
      allow update: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }

    // Analytics collection
    match /analytics/{vendorId}/{document=**} {
      allow read: if isOwner(vendorId) || isAdmin();
      allow write: if isAdmin() || isOwner(vendorId);
    }
  }
}
```

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isImage() {
      return request.resource.contentType.matches('image/.*');
    }

    // User avatars
    match /avatars/{userId}/{fileName} {
      allow read: if true;
      allow write: if isOwner(userId) && isImage() && request.resource.size < 5 * 1024 * 1024;
    }

    // Vendor logos and banners
    match /vendors/{vendorId}/{fileName} {
      allow read: if true;
      allow write: if isOwner(vendorId) && isImage() && request.resource.size < 10 * 1024 * 1024;
    }

    // Product images
    match /products/{vendorId}/{productId}/{fileName} {
      allow read: if true;
      allow write: if isOwner(vendorId) && isImage() && request.resource.size < 10 * 1024 * 1024;
    }

    // Review images
    match /reviews/{userId}/{reviewId}/{fileName} {
      allow read: if true;
      allow write: if isOwner(userId) && isImage() && request.resource.size < 5 * 1024 * 1024;
    }

    // Vendor documents (verification)
    match /documents/{vendorId}/{fileName} {
      allow read: if isOwner(vendorId) || isAdmin();
      allow write: if isOwner(vendorId);
    }
  }
}
```

---

## 6. Scalability & Performance Strategy

### Database Optimization

| Strategy | Implementation |
|----------|----------------|
| **Denormalization** | Embed frequently accessed data (vendor name in products) |
| **Composite Indexes** | Pre-define indexes for common query patterns |
| **Pagination** | Cursor-based pagination for large collections |
| **Caching** | React Query for client-side caching |
| **CDN** | Firebase Storage with CDN for images |

### Query Patterns

```typescript
// Products with filters - Uses composite index
const productsQuery = query(
  collection(db, 'products'),
  where('status', '==', 'active'),
  where('categoryId', '==', categoryId),
  orderBy('createdAt', 'desc'),
  limit(20)
);

// Vendor orders - Single field index
const vendorOrdersQuery = query(
  collection(db, 'orders'),
  where('items', 'array-contains', { vendorId: vendorId }),
  orderBy('createdAt', 'desc')
);

// User notifications - Single field index
const notificationsQuery = query(
  collection(db, 'notifications'),
  where('userId', '==', userId),
  where('read', '==', false),
  orderBy('createdAt', 'desc')
);
```

### Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| API Response Time | < 200ms |
| Image Load Time | < 500ms |
| Real-time Update Latency | < 100ms |

### Scaling Considerations

1. **Horizontal Scaling**: Firebase automatically scales
2. **Regional Deployment**: Multi-region for global audience
3. **Edge Caching**: Vercel Edge Network
4. **Image Optimization**: Next.js Image component with WebP
5. **Code Splitting**: Route-based and component-based
6. **Lazy Loading**: Images, heavy components, below-fold content

---

## 7. UI/UX Design System

### Color Palette

```css
:root {
  /* Base Colors */
  --cream: #FAF7F2;
  --warm-beige: #F5EDE0;
  --sand: #E8DCC8;
  
  /* Accent Colors */
  --blush: #E8D5D0;
  --blush-dark: #D4B5AD;
  --sage: #C5D1C8;
  --sage-dark: #9DB5A0;
  
  /* Contrast */
  --charcoal: #2D2D2D;
  --charcoal-light: #4A4A4A;
  
  /* Highlights */
  --gold: #C9A962;
  --gold-light: #D9C994;
  
  /* Semantic */
  --success: #7CB69D;
  --warning: #E8C547;
  --error: #D47373;
  --info: #7BA7D9;
}
```

### Typography

```css
/* Headings - Playfair Display */
--font-heading: 'Playfair Display', serif;

/* Body - Inter */
--font-body: 'Inter', sans-serif;

/* Scale */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */
```

### Spacing Scale

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### Shadow System

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.02);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.04), 0 4px 6px rgba(0, 0, 0, 0.02);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.04), 0 10px 10px rgba(0, 0, 0, 0.02);
--shadow-soft: 0 8px 32px rgba(0, 0, 0, 0.06);
```

### Border Radius

```css
--radius-sm: 0.375rem;   /* 6px */
--radius-md: 0.5rem;     /* 8px */
--radius-lg: 0.75rem;    /* 12px */
--radius-xl: 1rem;       /* 16px */
--radius-2xl: 1.5rem;    /* 24px */
--radius-full: 9999px;
```

---

## 8. Implementation Roadmap

### Phase 1: Foundation (Week 1)
- [x] Project setup
- [x] Firebase configuration
- [x] Design system implementation
- [x] Base components

### Phase 2: Authentication (Week 1-2)
- [x] Email/password auth
- [x] OAuth providers
- [x] RBAC implementation
- [x] Protected routes

### Phase 3: Core Marketplace (Week 2)
- [x] Product catalog
- [x] Categories
- [x] Cart functionality
- [x] Reviews system

### Phase 4: Vendor System (Week 3)
- [x] Vendor onboarding
- [x] Vendor dashboard
- [x] Product management
- [x] Basic analytics

### Phase 5: Payments (Week 3-4)
- [x] Stripe integration
- [x] Checkout flow
- [x] Order management
- [x] Invoice generation

### Phase 6: Real-Time Features (Week 4)
- [x] Stock updates
- [x] Order tracking
- [x] Notifications

### Phase 7: Admin Panel (Week 4-5)
- [x] Admin dashboard
- [x] Vendor approval
- [x] Order management
- [x] User management

### Phase 8: Optimization (Week 5)
- [x] Performance optimization
- [x] Testing
- [x] Security hardening
- [x] SEO optimization
- [x] Deployment

---

*Document Version: 1.0*
*Last Updated: 2024*
