import { NextRequest, NextResponse } from 'next/server';

/**
 * Stripe Checkout Session API Route
 * 
 * This API route creates a Stripe Checkout session for membership payments.
 * 
 * SETUP REQUIRED:
 * 1. Install Stripe: npm install stripe
 * 2. Add STRIPE_SECRET_KEY to .env.local
 * 3. Uncomment the Stripe initialization code below
 * 4. Update Price IDs in src/lib/stripe.ts
 * 
 * Usage:
 * POST /api/create-checkout-session
 * Body: {
 *   priceId: string,
 *   customerEmail: string,
 *   customerName: string,
 *   metadata: { ... },
 *   isStudent: boolean,
 *   planType: '2x_weekly' | '3x_weekly' | 'unlimited'
 * }
 */

// Uncomment after installing Stripe
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2024-11-20.acacia',
// });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      priceId, 
      customerEmail, 
      customerName,
      metadata = {},
      isStudent = false,
      planType 
    } = body;

    // Validate required fields
    if (!priceId || !customerEmail || !customerName) {
      return NextResponse.json(
        { error: 'Missing required fields: priceId, customerEmail, customerName' },
        { status: 400 }
      );
    }

    // TODO: Uncomment after installing Stripe and adding API keys
    /*
    // Calculate student discount if applicable
    const discounts = [];
    if (isStudent && planType) {
      const discountAmounts = {
        '2x_weekly': 1000, // 10€ in cents
        '3x_weekly': 1500, // 15€
        'unlimited': 2000, // 20€
      };
      
      const discountAmount = discountAmounts[planType as keyof typeof discountAmounts];
      if (discountAmount) {
        // Create a coupon for the student discount
        const coupon = await stripe.coupons.create({
          amount_off: discountAmount,
          currency: 'eur',
          duration: 'repeating',
          duration_in_months: 12,
          name: 'Student/Azubi/Soldat Ermäßigung',
        });
        
        discounts.push({ coupon: coupon.id });
      }
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'sepa_debit'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: priceId.includes('subscription') ? 'subscription' : 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      customer_email: customerEmail,
      client_reference_id: metadata.userId || undefined,
      metadata: {
        customerName,
        planType: planType || 'unknown',
        isStudent: isStudent.toString(),
        ...metadata,
      },
      discounts: discounts.length > 0 ? discounts : undefined,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      locale: 'de',
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });
    */

    // Temporary response until Stripe is set up
    return NextResponse.json({
      message: 'Stripe integration pending. Please install Stripe and configure API keys.',
      debug: {
        priceId,
        customerEmail,
        customerName,
        isStudent,
        planType,
        metadata,
      }
    }, { status: 501 }); // 501 Not Implemented

  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    
    // Return a proper error response instead of crashing
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        message: error?.message || 'An unexpected error occurred',
        debug: {
          note: 'Stripe integration pending. This is a temporary response.',
          error: process.env.NODE_ENV === 'development' ? error?.toString() : undefined
        }
      },
      { status: 500 }
    );
  }
}

