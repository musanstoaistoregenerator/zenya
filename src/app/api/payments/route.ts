import { NextRequest, NextResponse } from 'next/server';
import { ZiinaService } from '@/lib/payments/ziina-service';
import { ziinaUtils } from '@/lib/ziina-utils';
import { getSession } from '@/lib/auth/utils';
import { db } from '@/lib/supabase';

const ziinaService = new ZiinaService();

export async function POST(request: NextRequest) {
  try {
    // Check authentication for most payment operations
    const session = await getSession();
    
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'create_payment':
        if (!session?.user?.email) {
          return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
          );
        }

        const user = await db.getUserByEmail(session.user.email);
        if (!user) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        const payment = await ziinaService.createPayment(data);
        
        // Save payment to database
        if (payment.success) {
          await db.createPayment({
            user_id: user.id,
            ziina_payment_id: payment.payment_id,
            amount: data.amount,
            currency: data.currency || 'AED',
            status: 'pending',
            customer_email: data.customerEmail || session.user.email,
            customer_name: data.customerName || session.user.name || 'Unknown',
            product_type: data.productType || 'general',
            metadata: data.metadata || {}
          });
        }
        
        return NextResponse.json(payment);

      case 'create_subscription':
        if (!session?.user?.email) {
          return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
          );
        }

        const subUser = await db.getUserByEmail(session.user.email);
        if (!subUser) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        const subscriptionResult = await ziinaUtils.createSubscription({
          planId: data.planId,
          customerEmail: data.customer?.email || data.customerEmail || session.user.email,
          customerName: data.customer?.name || data.customerName || session.user.name || 'Unknown',
          metadata: {
            type: 'subscription',
            ...data.metadata
          }
        });

        // Save subscription to database
        if (subscriptionResult.success) {
          await db.createSubscription({
            user_id: subUser.id,
            ziina_subscription_id: subscriptionResult.subscriptionId,
            customer_email: data.customer?.email || data.customerEmail || session.user.email,
            status: 'pending',
            plan_type: data.planId,
            amount: 0, // Amount not returned in subscription result
            currency: 'AED', // Default currency
            start_date: new Date().toISOString(),
            metadata: data.metadata || {}
          });
        }

        return NextResponse.json(subscriptionResult);

      case 'create_plan_payment':
        const { planId, customerEmail, customerName } = data;
        const planPayment = await ziinaService.createPlanPayment(planId, customerEmail, customerName);
        return NextResponse.json(planPayment);

      case 'create_theme_payment':
        if (!session?.user?.email) {
          return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
          );
        }

        const themeUser = await db.getUserByEmail(session.user.email);
        if (!themeUser) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }

        const themePaymentResult = await ziinaUtils.createPayment({
          amount: data.amount || 4.99,
          currency: data.currency || 'USD',
          customerEmail: data.customer?.email || data.customerEmail || session.user.email,
          customerName: data.customer?.name || data.customerName || session.user.name || 'Unknown',
          productType: 'theme',
          description: data.description || 'Premium Themes Access - StoreForge AI',
          metadata: {
            type: 'theme_payment',
            ...data.metadata
          }
        });

        // Save theme payment to database
        if (themePaymentResult.success) {
          await db.createPayment({
            user_id: themeUser.id,
            ziina_payment_id: themePaymentResult.paymentId,
            amount: data.amount || 4.99,
            currency: data.currency || 'USD',
            status: 'pending',
            customer_email: data.customer?.email || data.customerEmail || session.user.email,
            customer_name: data.customer?.name || data.customerName || session.user.name || 'Unknown',
            product_type: 'theme',
            metadata: data.metadata || {}
          });
        }

        return NextResponse.json(themePaymentResult);

      case 'create_custom_payment':
        const { 
          amount: customAmount, 
          customerEmail: customEmail, 
          customerName: customName,
          paymentMethod,
          billingInfo
        } = data;
        
        if (!customAmount || !customEmail || !customName) {
          return NextResponse.json(
            { success: false, error: 'Missing required fields' },
            { status: 400 }
          );
        }

        // Process custom checkout payment
        const customPaymentResult = await ziinaService.createCustomPayment(
          customAmount,
          customEmail,
          customName,
          paymentMethod,
          billingInfo
        );

        return NextResponse.json(customPaymentResult);

      case 'verify_payment':
        const { paymentId } = data;
        const verification = await ziinaService.verifyPayment(paymentId);
        return NextResponse.json(verification);

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Payment API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'StoreForge AI - Ziina Payment API',
    endpoints: {
      'POST /api/payments': {
        description: 'Handle payment operations',
        actions: {
          create_payment: 'Create one-time payment',
          create_subscription: 'Create subscription',
          create_plan_payment: 'Create payment for pricing plan',
          create_theme_payment: 'Create payment for theme access',
          create_custom_payment: 'Create custom checkout payment',
          verify_payment: 'Verify payment status'
        }
      }
    },
    pricing_plans: ZiinaService.getPricingPlans()
  });
}