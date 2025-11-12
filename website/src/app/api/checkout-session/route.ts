import { NextRequest, NextResponse } from 'next/server';

// TODO: Uncomment after installing Stripe SDK
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2024-11-20.acacia',
// });

/**
 * GET /api/checkout-session
 * 
 * Retrieves Stripe Checkout Session data for the success page.
 * This endpoint is called after a successful payment to display order details.
 * 
 * Query Parameters:
 * - session_id: The Stripe Checkout Session ID from the URL
 * 
 * Returns:
 * - Session data including customer email, amount, metadata, etc.
 * 
 * TODO: Uncomment the Stripe code after:
 * 1. Installing Stripe SDK: npm install stripe
 * 2. Adding STRIPE_SECRET_KEY to .env.local
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { 
          error: 'Missing session_id parameter',
          message: 'Stripe integration pending. Please install Stripe and configure API keys.',
          mockData: {
            id: 'mock-session',
            customer_email: 'kunde@example.com',
            customer_name: 'Max Mustermann',
            amount_total: 14900,
            amount_subtotal: 14000,
            currency: 'eur',
            payment_status: 'paid',
            status: 'complete',
            metadata: {
              plan_name: 'Unlimited',
              billing_type: '12 Monate',
              plan_type: 'unlimited',
            },
            line_items: [],
            created: Math.floor(Date.now() / 1000),
          }
        },
        { status: 200 }
      );
    }

    // TODO: Uncomment after installing Stripe and adding API keys
    /*
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer', 'subscription'],
    });

    // Extract relevant data
    const sessionData = {
      id: session.id,
      customer_email: session.customer_email || session.customer_details?.email,
      customer_name: session.customer_details?.name,
      amount_total: session.amount_total,
      amount_subtotal: session.amount_subtotal,
      currency: session.currency,
      payment_status: session.payment_status,
      status: session.status,
      metadata: session.metadata,
      line_items: session.line_items?.data.map(item => ({
        description: item.description,
        amount_total: item.amount_total,
        quantity: item.quantity,
      })),
      subscription_id: session.subscription,
      created: session.created,
    };

    return NextResponse.json(sessionData);
    */

    // Temporary mock response until Stripe is configured
    return NextResponse.json({
      message: 'Stripe integration pending. Please install Stripe and configure API keys.',
      debug: {
        sessionId,
        note: 'This is a mock response. Uncomment Stripe code in /api/checkout-session/route.ts'
      },
      // Mock data for testing
      mockData: {
        id: sessionId,
        customer_email: 'kunde@example.com',
        customer_name: 'Max Mustermann',
        amount_total: 14900, // 149€ in cents
        amount_subtotal: 14000,
        currency: 'eur',
        payment_status: 'paid',
        status: 'complete',
        metadata: {
          plan_name: 'Unlimited',
          billing_type: '12 Monate',
          plan_type: 'unlimited',
        },
        line_items: [
          {
            description: 'Unlimited - 12 Monate',
            amount_total: 14000,
            quantity: 1,
          },
          {
            description: 'Aufnahmegebühr',
            amount_total: 4900,
            quantity: 1,
          }
        ],
        created: Math.floor(Date.now() / 1000),
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error retrieving checkout session:', error);
    
    // Return a proper error response with mock data instead of crashing
    return NextResponse.json(
      { 
        error: 'Failed to retrieve checkout session',
        message: error?.message || 'An unexpected error occurred',
        debug: {
          sessionId,
          note: 'Stripe integration pending. Returning mock data.',
          error: process.env.NODE_ENV === 'development' ? error?.toString() : undefined
        },
        // Always return mockData so the frontend doesn't crash
        mockData: {
          id: sessionId || 'mock-session',
          customer_email: 'kunde@example.com',
          customer_name: 'Max Mustermann',
          amount_total: 14900,
          amount_subtotal: 14000,
          currency: 'eur',
          payment_status: 'paid',
          status: 'complete',
          metadata: {
            plan_name: 'Unlimited',
            billing_type: '12 Monate',
            plan_type: 'unlimited',
          },
          line_items: [
            {
              description: 'Unlimited - 12 Monate',
              amount_total: 14000,
              quantity: 1,
            },
          ],
          created: Math.floor(Date.now() / 1000),
        }
      },
      { status: 200 } // Return 200 with mock data instead of 500
    );
  }
}

