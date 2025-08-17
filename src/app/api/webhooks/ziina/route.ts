import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/supabase';

// Ziina webhook event types
interface ZiinaWebhookEvent {
  id: string;
  type: 'payment.completed' | 'payment.failed' | 'payment.cancelled' | 'subscription.created' | 'subscription.cancelled';
  data: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    customer: {
      email: string;
      name: string;
    };
    metadata?: Record<string, any>;
    created_at: string;
  };
  created_at: string;
}

// Verify webhook signature
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return false;
  }
}

// Handle payment completion
async function handlePaymentCompleted(event: ZiinaWebhookEvent) {
  const { data } = event;
  
  try {
    // Log successful payment
    console.log('Payment completed:', {
      paymentId: data.id,
      amount: data.amount,
      currency: data.currency,
      customer: data.customer.email
    });

    // Find payment in database
    const payment = await db.getPaymentByZiinaId(data.id);
    if (!payment) {
      console.error(`Payment not found for Ziina ID: ${data.id}`);
      return { success: false, message: 'Payment not found in database' };
    }

    // Update payment status
    await db.updatePayment(payment.id, {
      status: 'completed',
      updated_at: new Date().toISOString()
    });

    // Get user and update plan if needed
    const user = await db.getUserById(payment.user_id);
    if (user) {
      // Update user plan for subscription payments
      if (payment.product_type === 'subscription') {
        const planType = payment.metadata?.planType || 'starter';
        const storeLimit = planType === 'pro' ? 10 : planType === 'enterprise' ? 50 : 3;
        
        await db.updateUser(payment.user_id, {
          plan: planType,
          stores_limit: storeLimit
        });

        console.log(`User ${user.email} upgraded to ${planType} plan`);
      }

      // Handle theme payments
      if (payment.product_type === 'theme') {
        const currentMetadata = user.metadata || {};
        await db.updateUser(payment.user_id, {
          metadata: {
            ...currentMetadata,
            premium_themes: true,
            theme_purchase_date: new Date().toISOString()
          }
        });

        console.log(`User ${user.email} granted premium theme access`);
      }
    }
    
    return { success: true, message: 'Payment processed successfully' };
  } catch (error) {
    console.error('Error processing payment completion:', error);
    throw error;
  }
}

// Handle payment failure
async function handlePaymentFailed(event: ZiinaWebhookEvent) {
  const { data } = event;
  
  try {
    // Log failed payment
    console.log('Payment failed:', {
      paymentId: data.id,
      customer: data.customer.email,
      reason: data.status
    });

    // Find and update payment in database
    const payment = await db.getPaymentByZiinaId(data.id);
    if (payment) {
      await db.updatePayment(payment.id, {
        status: 'failed',
        updated_at: new Date().toISOString()
      });
      console.log(`Payment ${data.id} marked as failed in database`);
    } else {
      console.error(`Payment not found for failed Ziina ID: ${data.id}`);
    }
    
    return { success: true, message: 'Payment failure processed' };
  } catch (error) {
    console.error('Error processing payment failure:', error);
    throw error;
  }
}

// Handle subscription events
async function handleSubscriptionEvent(event: ZiinaWebhookEvent) {
  const { data, type } = event;
  
  try {
    if (type === 'subscription.created') {
      console.log('Subscription created:', {
        subscriptionId: data.id,
        customer: data.customer.email
      });
      
      // Find and update subscription in database
      const subscription = await db.getSubscriptionByZiinaId(data.id);
      if (subscription) {
        await db.updateSubscription(subscription.id, {
          status: 'active',
          updated_at: new Date().toISOString()
        });
        console.log(`Subscription ${data.id} activated`);
      }
    } else if (type === 'subscription.cancelled') {
      console.log('Subscription cancelled:', {
        subscriptionId: data.id,
        customer: data.customer.email
      });
      
      // Find and update subscription in database
      const subscription = await db.getSubscriptionByZiinaId(data.id);
      if (subscription) {
        await db.updateSubscription(subscription.id, {
          status: 'cancelled',
          end_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

        // Downgrade user to starter plan
        const user = await db.getUserById(subscription.user_id);
        if (user) {
          await db.updateUser(subscription.user_id, {
            plan: 'starter',
            stores_limit: 3
          });
          console.log(`User ${user.email} downgraded to starter plan`);
        }
      }
    }
    
    return { success: true, message: 'Subscription event processed' };
  } catch (error) {
    console.error('Error processing subscription event:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get webhook secret from environment
    const webhookSecret = process.env.ZIINA_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('ZIINA_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Get request body and signature
    const body = await request.text();
    const signature = request.headers.get('x-ziina-signature');
    
    if (!signature) {
      console.error('Missing webhook signature');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature, webhookSecret)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse webhook event
    const event: ZiinaWebhookEvent = JSON.parse(body);
    
    console.log('Received Ziina webhook:', {
      type: event.type,
      id: event.id,
      paymentId: event.data.id
    });

    // Process event based on type
    let result;
    switch (event.type) {
      case 'payment.completed':
        result = await handlePaymentCompleted(event);
        break;
        
      case 'payment.failed':
      case 'payment.cancelled':
        result = await handlePaymentFailed(event);
        break;
        
      case 'subscription.created':
      case 'subscription.cancelled':
        result = await handleSubscriptionEvent(event);
        break;
        
      default:
        console.log('Unhandled webhook event type:', event.type);
        return NextResponse.json(
          { message: 'Event type not handled' },
          { status: 200 }
        );
    }

    return NextResponse.json(result, { status: 200 });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Handle GET requests (for webhook verification)
export async function GET(request: NextRequest) {
  // Some webhook providers send GET requests for verification
  const challenge = request.nextUrl.searchParams.get('challenge');
  
  if (challenge) {
    return NextResponse.json({ challenge });
  }
  
  return NextResponse.json(
    { message: 'Ziina webhook endpoint is active' },
    { status: 200 }
  );
}