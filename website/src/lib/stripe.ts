/**
 * Stripe Configuration and Helper Functions
 * 
 * This file contains Stripe integration setup for G3 CrossFit membership payments.
 * 
 * Setup Instructions:
 * 1. Install Stripe: npm install stripe @stripe/stripe-js
 * 2. Add environment variables to .env.local:
 *    - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
 *    - STRIPE_SECRET_KEY=sk_test_...
 *    - STRIPE_WEBHOOK_SECRET=whsec_...
 * 3. Create products and prices in Stripe Dashboard
 * 4. Update stripePriceIds in pricing/page.tsx with real Price IDs
 */

// Stripe Price IDs - Update these with real IDs from Stripe Dashboard
export const STRIPE_PRICE_IDS = {
  '2x_weekly': {
    monthly: 'price_xxx', // 140€/month
    sixMonth: 'price_xxx', // 110€/month
    twelveMonth: 'price_xxx', // 100€/month
  },
  '3x_weekly': {
    monthly: 'price_xxx', // 150€/month
    sixMonth: 'price_xxx', // 130€/month
    twelveMonth: 'price_xxx', // 120€/month
  },
  unlimited: {
    monthly: 'price_xxx', // 175€/month
    sixMonth: 'price_xxx', // 150€/month
    twelveMonth: 'price_xxx', // 140€/month
  },
  dropIn: 'price_xxx', // 25€ one-time
  tenPack: 'price_xxx', // 200€ one-time
  onboarding: 'price_xxx', // 49€ one-time (Aufnahmegebühr)
};

// Student discount amounts (in cents)
export const STUDENT_DISCOUNTS = {
  '2x_weekly': 1000, // 10€
  '3x_weekly': 1500, // 15€
  unlimited: 2000, // 20€
};

/**
 * Create a Stripe Checkout Session
 * This function should be called from a server-side API route
 */
export async function createCheckoutSession(params: {
  priceId: string;
  customerEmail: string;
  customerName: string;
  metadata?: Record<string, string>;
  successUrl: string;
  cancelUrl: string;
  isStudent?: boolean;
  planType?: '2x_weekly' | '3x_weekly' | 'unlimited';
}) {
  // This is a placeholder - implement in API route
  // See: website/src/app/api/create-checkout-session/route.ts
  
  const { priceId, customerEmail, customerName, metadata, successUrl, cancelUrl, isStudent, planType } = params;
  
  // Calculate discount if student
  let discountAmount = 0;
  if (isStudent && planType) {
    discountAmount = STUDENT_DISCOUNTS[planType] || 0;
  }

  return {
    priceId,
    customerEmail,
    customerName,
    metadata,
    successUrl,
    cancelUrl,
    discountAmount,
  };
}

/**
 * Stripe Webhook Event Types
 */
export const STRIPE_WEBHOOK_EVENTS = {
  CHECKOUT_COMPLETED: 'checkout.session.completed',
  PAYMENT_SUCCEEDED: 'payment_intent.succeeded',
  PAYMENT_FAILED: 'payment_intent.payment_failed',
  SUBSCRIPTION_CREATED: 'customer.subscription.created',
  SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
  INVOICE_PAID: 'invoice.paid',
  INVOICE_PAYMENT_FAILED: 'invoice.payment_failed',
};

/**
 * Format price for display
 */
export function formatPrice(amountInCents: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
  }).format(amountInCents / 100);
}

/**
 * Calculate total price with onboarding fee
 */
export function calculateTotalWithOnboarding(
  monthlyPrice: number,
  billingType: 'monthly' | 'sixMonth' | 'twelveMonth',
  onboardingFee: number = 49
): number {
  if (billingType === 'monthly') {
    return monthlyPrice;
  }
  return monthlyPrice + onboardingFee;
}

