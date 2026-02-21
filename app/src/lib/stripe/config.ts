// ============================================
// STRIPE CONFIGURATION
// ============================================

import { loadStripe, type Stripe } from '@stripe/stripe-js';

// Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

// Initialize Stripe
let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

// ============================================
// STRIPE APPEARANCE CONFIGURATION
// ============================================

export const stripeAppearance = {
  theme: 'stripe' as const,
  variables: {
    colorPrimary: '#C9A962',
    colorBackground: '#FAF7F2',
    colorText: '#2D2D2D',
    colorDanger: '#EF4444',
    fontFamily: 'Inter, system-ui, sans-serif',
    spacingUnit: '4px',
    borderRadius: '8px',
  },
  rules: {
    '.Input': {
      border: '1px solid #E8DCC8',
      boxShadow: 'none',
    },
    '.Input:focus': {
      border: '1px solid #C9A962',
      boxShadow: '0 0 0 2px rgba(201, 169, 98, 0.2)',
    },
    '.Tab': {
      border: '1px solid #E8DCC8',
    },
    '.Tab--selected': {
      border: '1px solid #C9A962',
      backgroundColor: 'rgba(201, 169, 98, 0.1)',
    },
  },
};

// ============================================
// PAYMENT METHODS CONFIGURATION
// ============================================

export const paymentMethods = {
  card: true,
  // Additional payment methods can be configured here
  // applePay: true,
  // googlePay: true,
  // paypal: false, // Requires separate PayPal integration
};

// ============================================
// CURRENCY CONFIGURATION
// ============================================

export const DEFAULT_CURRENCY = 'usd';
export const SUPPORTED_CURRENCIES = ['usd', 'eur', 'gbp', 'cad', 'aud'] as const;

export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number];

export const currencySymbols: Record<SupportedCurrency, string> = {
  usd: '$',
  eur: '€',
  gbp: '£',
  cad: 'C$',
  aud: 'A$',
};

// ============================================
// PAYMENT INTENT STATUS
// ============================================

export type PaymentIntentStatus =
  | 'requires_payment_method'
  | 'requires_confirmation'
  | 'requires_action'
  | 'processing'
  | 'requires_capture'
  | 'canceled'
  | 'succeeded';

// ============================================
// CHECKOUT SESSION CONFIGURATION
// ============================================

export interface CheckoutSessionConfig {
  lineItems: {
    price_data: {
      currency: string;
      product_data: {
        name: string;
        description?: string;
        images?: string[];
      };
      unit_amount: number; // Amount in cents
    };
    quantity: number;
  }[];
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

// ============================================
// SHIPPING RATES CONFIGURATION
// ============================================

export interface ShippingRate {
  id: string;
  name: string;
  amount: number; // Amount in cents
  currency: string;
  deliveryEstimate?: {
    minimum?: number; // Days
    maximum?: number; // Days
  };
}

export const defaultShippingRates: ShippingRate[] = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    amount: 599, // $5.99
    currency: 'usd',
    deliveryEstimate: { minimum: 5, maximum: 10 },
  },
  {
    id: 'express',
    name: 'Express Shipping',
    amount: 1499, // $14.99
    currency: 'usd',
    deliveryEstimate: { minimum: 2, maximum: 5 },
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    amount: 2999, // $29.99
    currency: 'usd',
    deliveryEstimate: { minimum: 1, maximum: 2 },
  },
];

// ============================================
// TAX CONFIGURATION
// ============================================

export interface TaxRate {
  id: string;
  name: string;
  percentage: number;
  country?: string;
  state?: string;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export const formatAmountForStripe = (amount: number): number => {
  // Convert dollars to cents
  return Math.round(amount * 100);
};

export const formatAmountFromStripe = (amount: number): number => {
  // Convert cents to dollars
  return amount / 100;
};

export const formatPrice = (amount: number, currency: SupportedCurrency = 'usd'): string => {
  const symbol = currencySymbols[currency];
  return `${symbol}${amount.toFixed(2)}`;
};

export const calculateOrderTotal = (
  subtotal: number,
  shipping: number,
  tax: number,
  discount: number = 0
): number => {
  return subtotal + shipping + tax - discount;
};

export const calculateTax = (subtotal: number, taxRate: number): number => {
  return Math.round(subtotal * taxRate * 100) / 100;
};
