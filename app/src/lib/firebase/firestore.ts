// ============================================
// FIRESTORE DATABASE SERVICE
// ============================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  increment,
  serverTimestamp,
  writeBatch,
  onSnapshot,
  type QueryConstraint,
} from 'firebase/firestore';

// Re-export query functions for consistency in stores
export { where, limit, orderBy, query, startAfter, increment, onSnapshot };
import { db } from './config';
import type {
  Product,
  Category,
  Order,
  Review,
  Vendor,
  Cart,
  Notification,
  ProductFilters,
  PaginationParams,
  PaginatedResult,
  User,
} from '@/types';
import { MOCK_PRODUCTS, MOCK_REVIEWS, MOCK_VENDORS } from '../mockData';
import { PRODUCT_CATEGORIES } from '../constants';

// Flag to force mock data usage if needed (e.g. during dev without backend)
// Set to false for production
const FORCE_MOCK_DATA = false;

/**
 * Cleanup data before sending to Firestore
 * Removes undefined values recursively
 */
export const sanitizeData = (data: any): any => {
  if (data === null || data === undefined) return null;
  if (typeof data !== 'object') return data;
  if (data instanceof Date) return data;
  // Don't recurse into Firestore FieldValues (they are objects but have special internal structure)
  if (data.constructor && data.constructor.name === 'FieldValue') return data;

  if (Array.isArray(data)) return data.map(sanitizeData);

  const sanitized: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      sanitized[key] = sanitizeData(value);
    } else {
      sanitized[key] = null; // Convert undefined to null for Firestore
    }
  }
  return sanitized;
};

// ============================================
// GENERIC CRUD OPERATIONS
// ============================================

export const createDocument = async <T extends Record<string, unknown>>(
  collectionName: string,
  id: string,
  data: T
): Promise<void> => {
  const sanitizedData = sanitizeData(data);
  await setDoc(doc(db, collectionName, id), {
    ...sanitizedData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const getDocument = async <T>(
  collectionName: string,
  id: string
): Promise<T | null> => {
  try {
    const docSnap = await getDoc(doc(db, collectionName, id));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  } catch (error) {
    console.warn(`Error fetching document ${collectionName}/${id}:`, error);
    return null;
  }
};

export const updateDocument = async <T extends Record<string, unknown>>(
  collectionName: string,
  id: string,
  data: Partial<T>
): Promise<void> => {
  const sanitizedData = sanitizeData(data);
  await updateDoc(doc(db, collectionName, id), {
    ...sanitizedData,
    updatedAt: serverTimestamp(),
  });
};

export const deleteDocument = async (
  collectionName: string,
  id: string
): Promise<void> => {
  await deleteDoc(doc(db, collectionName, id));
};

// ============================================
// QUERY BUILDER
// ============================================

export const buildQuery = (
  collectionName: string,
  constraints: QueryConstraint[] = []
) => {
  return query(collection(db, collectionName), ...constraints);
};

export const executeQuery = async <T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  try {
    const q = buildQuery(collectionName, constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T);
  } catch (error) {
    console.error(`Error executing query on ${collectionName}:`, error);
    return [];
  }
};

// ============================================
// PAGINATION
// ============================================

export const getPaginated = async <T>(
  collectionName: string,
  pagination: PaginationParams,
  constraints: QueryConstraint[] = []
): Promise<PaginatedResult<T>> => {
  const { page: _page, limit: pageSize, cursor } = pagination;

  const queryConstraints: QueryConstraint[] = [
    ...constraints,
    limit(pageSize + 1), // Get one extra to check if there's more
  ];

  if (cursor) {
    try {
      const cursorDoc = await getDoc(doc(db, collectionName, cursor));
      if (cursorDoc.exists()) {
        queryConstraints.push(startAfter(cursorDoc));
      }
    } catch (e) {
      console.warn('Invalid cursor, starting from beginning', e);
    }
  }

  try {
    const q = buildQuery(collectionName, queryConstraints);
    const querySnapshot = await getDocs(q);

    const docs = querySnapshot.docs;
    const hasMore = docs.length > pageSize;

    // Remove the extra document
    const data = docs.slice(0, pageSize).map((doc) => ({ id: doc.id, ...doc.data() }) as T);

    return {
      data,
      hasMore,
      nextCursor: hasMore ? docs[pageSize - 1].id : undefined,
    };
  } catch (error) {
    console.error(`Error fetching paginated data from ${collectionName}:`, error);
    return { data: [], hasMore: false };
  }
};

// ============================================
// REAL-TIME SUBSCRIPTIONS
// ============================================

export const subscribeToDocument = <T>(
  collectionName: string,
  id: string,
  callback: (data: T | null) => void
) => {
  return onSnapshot(doc(db, collectionName, id), (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as T);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error(`Error subscribing to document ${collectionName}/${id}:`, error);
    callback(null);
  });
};

export const subscribeToCollection = <T>(
  collectionName: string,
  callback: (data: T[]) => void,
  constraints: QueryConstraint[] = []
) => {
  const q = buildQuery(collectionName, constraints);
  return onSnapshot(q, (querySnapshot) => {
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T);
    callback(data);
  }, (error) => {
    console.error(`Error subscribing to collection ${collectionName}:`, error);
    callback([]);
  });
};

// ============================================
// BATCH OPERATIONS
// ============================================

export const batchUpdate = async (
  operations: { collection: string; id: string; data: Record<string, unknown> }[]
): Promise<void> => {
  const batch = writeBatch(db);

  operations.forEach(({ collection: collectionName, id, data }) => {
    const docRef = doc(db, collectionName, id);
    batch.update(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();
};

// ============================================
// ADMIN OPERATIONS
// ============================================

export const getAllUsers = async (): Promise<User[]> => {
  try {
    return await executeQuery<User>('users', [
      orderBy('createdAt', 'desc'),
    ]);
  } catch (error) {
    console.error('Error fetching all users:', error);
    return [];
  }
};

export const getAllProductsAdmin = async (): Promise<Product[]> => {
  try {
    return await executeQuery<Product>('products', [
      orderBy('createdAt', 'desc'),
    ]);
  } catch (error) {
    console.error('Error fetching all products for admin:', error);
    return [];
  }
};

export const createReview = async (review: Omit<Review, 'id'>): Promise<string> => {
  const reviewRef = doc(collection(db, 'reviews'));
  const sanitizedReview = sanitizeData(review);
  await setDoc(reviewRef, {
    ...sanitizedReview,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Update product aggregation
  const productRef = doc(db, 'products', review.productId);
  const productSnap = await getDoc(productRef);

  if (productSnap.exists()) {
    const product = productSnap.data();
    const newReviewCount = (product.reviewCount || 0) + 1;
    const newRating = ((product.rating || 0) * (product.reviewCount || 0) + review.rating) / newReviewCount;

    await updateDoc(productRef, {
      reviewCount: newReviewCount,
      rating: Number(newRating.toFixed(1)),
      updatedAt: serverTimestamp(),
    });
  }

  return reviewRef.id;
};

// ============================================
// PRODUCT OPERATIONS
// ============================================

export const getProducts = async (
  filters: ProductFilters = {},
  pagination?: PaginationParams
): Promise<PaginatedResult<Product>> => {
  if (FORCE_MOCK_DATA) {
    return getMockProducts(filters, pagination);
  }

  try {
    const constraints: QueryConstraint[] = [];

    // Apply filters
    if (filters.category) {
      constraints.push(where('categoryId', '==', filters.category));
    }

    if (filters.vendor) {
      constraints.push(where('vendorId', '==', filters.vendor));
    }

    if (filters.inStock) {
      constraints.push(where('inventory', '>', 0));
    }

    if (filters.featured) {
      constraints.push(where('featured', '==', true));
    }

    if (filters.minPrice !== undefined) {
      constraints.push(where('price', '>=', filters.minPrice));
    }

    if (filters.maxPrice !== undefined) {
      constraints.push(where('price', '<=', filters.maxPrice));
    }

    if (filters.onSale) {
      constraints.push(where('salePrice', '!=', null));
    }

    if (filters.rating !== undefined) {
      constraints.push(where('rating', '>=', filters.rating));
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'price-asc':
        constraints.push(orderBy('price', 'asc'));
        break;
      case 'price-desc':
        constraints.push(orderBy('price', 'desc'));
        break;
      case 'rating':
        constraints.push(orderBy('rating', 'desc'));
        break;
      case 'bestselling':
        constraints.push(orderBy('salesCount', 'desc'));
        break;
      case 'featured':
        constraints.push(orderBy('featured', 'desc'));
        break;
      case 'newest':
      default:
        // Note: If we have an inequality filter on price, we MUST order by price first in Firestore
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
          constraints.push(orderBy('price', 'asc'));
        }
        constraints.push(orderBy('createdAt', 'desc'));
        break;
    }

    // Always filter by active status
    constraints.unshift(where('status', '==', 'active'));

    let result: PaginatedResult<Product>;
    if (pagination) {
      result = await getPaginated<Product>('products', pagination, constraints);
    } else {
      const data = await executeQuery<Product>('products', constraints);
      result = { data, hasMore: false };
    }

    // Fallback to mock data if empty and no specific filters (or if we want to ensure content)
    // Only fallback if absolutely no products found in the database at all (not just filtered)
    if (result.data.length === 0 && !filters.search && !pagination?.cursor && pagination?.page === 1) {
      // Check if DB is truly empty of products to avoid showing empty state on first load
      try {
        const anyProduct = await getDocs(query(collection(db, 'products'), limit(1)));
        if (anyProduct.empty) {
          console.log('Database empty, falling back to mock data');
          return getMockProducts(filters, pagination);
        }
      } catch (e) {
        console.warn("Could not check if DB is empty, defaulting to mock", e);
        return getMockProducts(filters, pagination);
      }
    }

    // Manual search (Firestore doesn't support full text search natively nicely)
    if (filters.search && result.data.length > 0) {
      const searchLower = filters.search.toLowerCase();
      result.data = result.data.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    return result;

  } catch (error) {
    console.error('Failed to get products from Firestore, falling back to mock:', error);
    return getMockProducts(filters, pagination);
  }
};

// Helper for Mock Products
const getMockProducts = (filters: ProductFilters, pagination?: PaginationParams): PaginatedResult<Product> => {
  let filteredProducts = [...MOCK_PRODUCTS];

  if (filters.category) {
    filteredProducts = filteredProducts.filter((p) => p.categoryId === filters.category);
  }
  if (filters.vendor) {
    filteredProducts = filteredProducts.filter((p) => p.vendorId === filters.vendor);
  }
  if (filters.inStock) {
    filteredProducts = filteredProducts.filter((p) => p.inventory > 0);
  }
  if (filters.featured) {
    filteredProducts = filteredProducts.filter((p) => p.featured);
  }
  if (filters.minPrice !== undefined) {
    filteredProducts = filteredProducts.filter((p) => (p.salePrice || p.price) >= (filters.minPrice || 0));
  }
  if (filters.maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter((p) => (p.salePrice || p.price) <= (filters.maxPrice || Infinity));
  }
  if (filters.onSale) {
    filteredProducts = filteredProducts.filter((p) => p.salePrice !== undefined && p.salePrice < p.price);
  }
  if (filters.rating !== undefined) {
    filteredProducts = filteredProducts.filter((p) => p.rating >= (filters.rating || 0));
  }
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
    );
  }

  filteredProducts.sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'bestselling': return b.salesCount - a.salesCount;
      case 'featured': return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      case 'newest': default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const page = pagination?.page || 1;
  const limit = pagination?.limit || 12;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const data = filteredProducts.slice(startIndex, endIndex);
  const hasMore = endIndex < filteredProducts.length;

  return {
    data,
    hasMore,
    nextCursor: hasMore ? String(page + 1) : undefined,
  };
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  if (FORCE_MOCK_DATA) return MOCK_PRODUCTS.find((p) => p.slug === slug) || null;

  try {
    const products = await executeQuery<Product>('products', [
      where('slug', '==', slug),
      where('status', 'in', ['active', 'draft']),
      limit(1),
    ]);
    const product = products[0] || null;
    if (!product) {
      // Only fallback if not found
      const mock = MOCK_PRODUCTS.find((p) => p.slug === slug);
      return mock || null;
    }
    return product;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
  }
};

export const getProductsByVendor = async (
  vendorId: string,
  status?: string
): Promise<Product[]> => {
  if (FORCE_MOCK_DATA) {
    let products = MOCK_PRODUCTS.filter((p) => p.vendorId === vendorId);
    if (status) products = products.filter((p) => p.status === status);
    return products;
  }

  try {
    const constraints: QueryConstraint[] = [where('vendorId', '==', vendorId)];
    if (status) {
      constraints.push(where('status', '==', status));
    }
    constraints.push(orderBy('createdAt', 'desc'));

    return await executeQuery<Product>('products', constraints);
  } catch (error) {
    console.error('Error fetching vendor products:', error);
    let products = MOCK_PRODUCTS.filter((p) => p.vendorId === vendorId);
    if (status) products = products.filter((p) => p.status === status);
    return products;
  }
};

export const incrementProductViews = async (productId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'products', productId), {
      viewsCount: increment(1),
    });
  } catch (e) {
    // Ignore errors for view increments
  }
};

export const updateProductInventory = async (
  productId: string,
  quantity: number
): Promise<void> => {
  await updateDoc(doc(db, 'products', productId), {
    inventory: increment(quantity),
    updatedAt: serverTimestamp(),
  });
};

// ============================================
// CATEGORY OPERATIONS
// ============================================

export const getCategories = async (includeInactive = false): Promise<Category[]> => {
  if (FORCE_MOCK_DATA) return [...PRODUCT_CATEGORIES] as unknown as Category[];

  try {
    const constraints: QueryConstraint[] = [orderBy('sortOrder', 'asc')];
    if (!includeInactive) {
      constraints.unshift(where('isActive', '==', true));
    }
    const categories = await executeQuery<Category>('categories', constraints);

    if (categories.length === 0) {
      // Fallback if no categories in DB
      return [...PRODUCT_CATEGORIES] as unknown as Category[];
    }
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [...PRODUCT_CATEGORIES] as unknown as Category[];
  }
};

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  try {
    const categories = await executeQuery<Category>('categories', [
      where('slug', '==', slug),
      limit(1),
    ]);
    return categories[0] || ([...PRODUCT_CATEGORIES] as unknown as Category[]).find(c => c.slug === slug) || null;
  } catch (e) {
    return ([...PRODUCT_CATEGORIES] as unknown as Category[]).find(c => c.slug === slug) || null;
  }
};

// ============================================
// ORDER OPERATIONS
// ============================================

export const getOrdersByUser = async (userId: string): Promise<Order[]> => {
  try {
    return await executeQuery<Order>('orders', [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
    ]);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
};

export const getOrdersByVendor = async (vendorId: string): Promise<Order[]> => {
  // Note: This requires a composite index on orders.items array or similar structure
  // For now fetching all and filtering is safest without complex indexing setup instructions for the user immediately
  try {
    const allOrders = await executeQuery<Order>('orders', [
      orderBy('createdAt', 'desc'),
      limit(100)
    ]);

    return allOrders.filter((order) =>
      order.items.some((item) => item.vendorId === vendorId)
    );
  } catch (error) {
    console.error('Error fetching vendor orders:', error);
    return [];
  }
};

export const getAllOrders = async (limitCount = 100): Promise<Order[]> => {
  try {
    return await executeQuery<Order>('orders', [
      orderBy('createdAt', 'desc'),
      limit(limitCount),
    ]);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return [];
  }
};

export const updateOrderStatus = async (
  orderId: string,
  status: Order['status'],
  note?: string
): Promise<void> => {
  const orderRef = doc(db, 'orders', orderId);
  const orderSnap = await getDoc(orderRef);

  if (!orderSnap.exists()) {
    throw new Error('Order not found');
  }

  const order = orderSnap.data() as Order;
  const timelineEvent = {
    status,
    timestamp: new Date(),
    note,
    updatedBy: 'system', // Should be current user ID
  };

  await updateDoc(orderRef, {
    status,
    timeline: [...order.timeline, timelineEvent],
    updatedAt: serverTimestamp(),
    ...(status === 'shipped' && { shippedAt: serverTimestamp() }),
    ...(status === 'delivered' && { deliveredAt: serverTimestamp() }),
  });
};

export const createOrder = async (order: Omit<Order, 'id'>): Promise<string> => {
  const orderRef = doc(collection(db, 'orders'));
  const sanitizedOrder = sanitizeData(order);
  await setDoc(orderRef, {
    ...sanitizedOrder,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    timeline: [
      {
        status: 'placed',
        timestamp: new Date(),
        note: 'Order placed successfully',
        updatedBy: 'customer',
      },
    ],
  });
  return orderRef.id;
};





// ============================================
// REVIEW OPERATIONS
// ============================================

export const getReviewsByProduct = async (productId: string): Promise<Review[]> => {
  try {
    return await executeQuery<Review>('reviews', [
      where('productId', '==', productId),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc'),
    ]);
  } catch (e) {
    if (productId && MOCK_PRODUCTS.find(p => p.id === productId)) {
      return MOCK_REVIEWS.filter(r => r.productId === productId);
    }
    return [];
  }
};

export const getReviewsByUser = async (userId: string): Promise<Review[]> => {
  return executeQuery<Review>('reviews', [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  ]);
};


// ============================================
// VENDOR OPERATIONS
// ============================================

export const getVendors = async (status?: Vendor['status']): Promise<Vendor[]> => {
  // Default to only approved vendors for public-facing pages.
  const effectiveStatus = status ?? 'approved';
  try {
    const constraints: QueryConstraint[] = [
      where('status', '==', effectiveStatus),
      orderBy('createdAt', 'desc'),
    ];
    const vendors = await executeQuery<Vendor>('vendors', constraints);

    // Only fallback to mock data if the collection is truly empty
    // (To avoid showing mock data when real vendors exist but are suspended)
    if (vendors.length === 0) {
      const allVendors = await executeQuery<Vendor>('vendors', [limit(1)]);
      if (allVendors.length === 0) {
        return MOCK_VENDORS.filter((v) => v.status === effectiveStatus);
      }
    }
    return vendors;
  } catch (e) {
    console.error('Error fetching vendors:', e);
    if (FORCE_MOCK_DATA) {
      return MOCK_VENDORS.filter((v) => v.status === effectiveStatus);
    }
    return [];
  }
};

// Admin-only: fetch ALL vendors regardless of status
export const getAllVendorsAdmin = async (): Promise<Vendor[]> => {
  try {
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
    const vendors = await executeQuery<Vendor>('vendors', constraints);
    if (vendors.length === 0) return MOCK_VENDORS;
    return vendors;
  } catch (e) {
    return MOCK_VENDORS;
  }
};

export const getVendorById = async (vendorId: string): Promise<Vendor | null> => {
  if (FORCE_MOCK_DATA) return MOCK_VENDORS.find((v) => v.id === vendorId) || null;

  try {
    const vendor = await getDocument<Vendor>('vendors', vendorId);
    if (!vendor) {
      return MOCK_VENDORS.find((v) => v.id === vendorId) || null;
    }
    return vendor;
  } catch (error) {
    return MOCK_VENDORS.find((v) => v.id === vendorId) || null;
  }
};

export const createVendor = async (vendor: any): Promise<string> => {
  const vendorRef = doc(collection(db, 'vendors'));
  const sanitizedVendor = sanitizeData(vendor);
  await setDoc(vendorRef, {
    ...sanitizedVendor,
    status: 'pending',
    rating: 0,
    reviewCount: 0,
    totalSales: 0,
    totalOrders: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return vendorRef.id;
};

export const getVendorByUserId = async (userId: string): Promise<Vendor | null> => {
  try {
    const vendors = await executeQuery<Vendor>('vendors', [
      where('userId', '==', userId),
      limit(1),
    ]);
    return vendors[0] || null;
  } catch (error) {
    console.error('Error fetching vendor by userId:', error);
    return null;
  }
};

export const approveVendor = async (vendorId: string): Promise<void> => {
  await updateDoc(doc(db, 'vendors', vendorId), {
    status: 'approved',
    updatedAt: serverTimestamp(),
  });

  // Update user role
  const vendor = await getDocument<Vendor>('vendors', vendorId);
  if (vendor) {
    await updateDoc(doc(db, 'users', vendor.userId), {
      role: 'vendor',
      updatedAt: serverTimestamp(),
    });
  }
};

export const rejectVendor = async (vendorId: string): Promise<void> => {
  await updateDoc(doc(db, 'vendors', vendorId), {
    status: 'suspended',
    updatedAt: serverTimestamp(),
  });
};

export const deleteProductAdmin = async (productId: string): Promise<void> => {
  await deleteDoc(doc(db, 'products', productId));
};

export const deleteUserAdmin = async (userId: string): Promise<void> => {
  await deleteDoc(doc(db, 'users', userId));
};

export const promoteToAdmin = async (userId: string): Promise<void> => {
  await updateDoc(doc(db, 'users', userId), {
    role: 'admin',
    updatedAt: serverTimestamp(),
  });
};

// ============================================
// CART OPERATIONS
// ============================================

export const getCart = async (userId: string): Promise<Cart | null> => {
  try {
    const carts = await executeQuery<Cart>('carts', [
      where('userId', '==', userId),
      limit(1),
    ]);
    return carts[0] || null;
  } catch (e) {
    return null;
  }
};

export const saveCart = async (cart: Cart): Promise<void> => {
  const sanitizedCart = sanitizeData(cart);
  await setDoc(doc(db, 'carts', cart.id), {
    ...sanitizedCart,
    updatedAt: serverTimestamp(),
  });
};

// ============================================
// NOTIFICATION OPERATIONS
// ============================================

export const getNotifications = async (userId: string): Promise<Notification[]> => {
  return executeQuery<Notification>('notifications', [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(50),
  ]);
};

export const getUnreadNotificationsCount = async (userId: string): Promise<number> => {
  const notifications = await executeQuery<Notification>('notifications', [
    where('userId', '==', userId),
    where('read', '==', false),
  ]);
  return notifications.length;
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  await updateDoc(doc(db, 'notifications', notificationId), {
    read: true,
    readAt: serverTimestamp(),
  });
};

export const createNotification = async (
  notification: Omit<Notification, 'id'>
): Promise<string> => {
  const notificationRef = doc(collection(db, 'notifications'));
  const sanitizedNotification = sanitizeData(notification);
  await setDoc(notificationRef, {
    ...sanitizedNotification,
    createdAt: serverTimestamp(),
  });
  return notificationRef.id;
};

// ============================================
// DATABASE SEEDING (Admin Use)
// ============================================
export const seedDatabase = async () => {
  console.log("Seeding database...");

  // 1. Seed Demo Accounts (Auth + User Docs)
  try {
    const { seedDemoAccounts } = await import('../dev-seed');
    await seedDemoAccounts();
  } catch (e) {
    console.warn("User seeding failed (likely already seeded):", e);
  }

  const batch = writeBatch(db);

  // 2. Seed Categories
  for (const cat of PRODUCT_CATEGORIES) {
    const catRef = doc(db, 'categories', cat.id);
    batch.set(catRef, { ...cat, isActive: true, sortOrder: 0, createdAt: serverTimestamp() });
  }

  // 3. Seed Vendors
  for (const vendor of MOCK_VENDORS) {
    const vendorRef = doc(db, 'vendors', vendor.id);
    batch.set(vendorRef, vendor);
  }

  // 4. Seed Products
  for (const product of MOCK_PRODUCTS) {
    const prodRef = doc(db, 'products', product.id);
    const { id, ...prodData } = product;
    const sanitizedProdData = sanitizeData({
      ...prodData,
      price: Number(prodData.price),
      rating: Number(prodData.rating),
      inventory: Number(prodData.inventory),
    });
    batch.set(prodRef, {
      ...sanitizedProdData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  await batch.commit();
  console.log("Database seeded successfully!");
};
