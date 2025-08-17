import { NextRequest, NextResponse } from 'next/server';
import { ziinaUtils } from '@/lib/ziina-utils';
import { db } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('payment_id');

    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    // Verify payment with Ziina
    const result = await ziinaUtils.verifyPayment(paymentId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    // Update payment status in database
    try {
      const payment = await db.getPaymentByZiinaId(paymentId);
      if (payment) {
        await db.updatePayment(payment.id, {
          status: result.status,
          updated_at: new Date().toISOString()
        });

        // If payment is completed, update user plan if it's a subscription
        if (result.status === 'completed' && payment.product_type === 'subscription') {
          const user = await db.getUserById(payment.user_id);
          if (user) {
            // Update user plan based on payment metadata
            const planType = payment.metadata?.planType || 'starter';
            await db.updateUser(payment.user_id, {
              plan: planType,
              stores_limit: planType === 'pro' ? 10 : planType === 'enterprise' ? 50 : 3
            });
          }
        }
      }
    } catch (dbError) {
      console.error('Database update error:', dbError);
      // Continue with response even if DB update fails
    }

    return NextResponse.json({
      success: true,
      status: result.status,
      amount: result.amount,
      currency: result.currency,
      customer: result.customer
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}

// Handle POST requests for webhook-style verification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { payment_id } = body;

    if (!payment_id) {
      return NextResponse.json(
        { success: false, error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    // Verify payment with Ziina
    const result = await ziinaUtils.verifyPayment(payment_id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    // Update payment status in database
    try {
      const payment = await db.getPaymentByZiinaId(payment_id);
      if (payment) {
        await db.updatePayment(payment.id, {
          status: result.status,
          updated_at: new Date().toISOString()
        });

        // If payment is completed, update user plan if it's a subscription
        if (result.status === 'completed' && payment.product_type === 'subscription') {
          const user = await db.getUserById(payment.user_id);
          if (user) {
            // Update user plan based on payment metadata
            const planType = payment.metadata?.planType || 'starter';
            await db.updateUser(payment.user_id, {
              plan: planType,
              stores_limit: planType === 'pro' ? 10 : planType === 'enterprise' ? 50 : 3
            });
          }
        }
      }
    } catch (dbError) {
      console.error('Database update error:', dbError);
      // Continue with response even if DB update fails
    }

    return NextResponse.json({
      success: true,
      status: result.status,
      amount: result.amount,
      currency: result.currency,
      customer: result.customer
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}