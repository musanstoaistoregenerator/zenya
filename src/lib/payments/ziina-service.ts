// Ziina Payment Integration for StoreForge AI
// Ziina is a popular payment gateway in the MENA region

export interface ZiinaPaymentRequest {
  amount: number; // Amount in fils (1 AED = 100 fils)
  currency: 'AED' | 'SAR' | 'USD';
  description: string;
  customer_email?: string;
  customer_name?: string;
  metadata?: Record<string, string | number | boolean>;
  success_url?: string;
  cancel_url?: string;
}

export interface ZiinaPaymentResponse {
  success: boolean;
  payment_id?: string;
  checkout_url?: string;
  status?: 'pending' | 'completed' | 'failed' | 'cancelled';
  error?: string;
}

export interface ZiinaSubscriptionRequest {
  plan_id: string;
  customer_email: string;
  customer_name: string;
  trial_days?: number;
}

export class ZiinaService {
  private apiKey: string;
  private secretKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.ZIINA_API_KEY || '';
    this.secretKey = process.env.ZIINA_SECRET_KEY || '';
    this.baseUrl = process.env.ZIINA_BASE_URL || 'https://api.ziina.com/v1';
    
    if (!this.apiKey || !this.secretKey) {
      console.warn('Ziina API keys not configured');
    }
  }

  // Create one-time payment
  async createPayment(request: ZiinaPaymentRequest): Promise<ZiinaPaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'X-Ziina-Secret': this.secretKey
        },
        body: JSON.stringify({
          amount: request.amount,
          currency: request.currency,
          description: request.description,
          customer: {
            email: request.customer_email,
            name: request.customer_name
          },
          metadata: request.metadata,
          redirect_urls: {
            success: request.success_url,
            cancel: request.cancel_url
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Payment creation failed'
        };
      }

      return {
        success: true,
        payment_id: data.id,
        checkout_url: data.checkout_url,
        status: data.status
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Create subscription
  async createSubscription(request: ZiinaSubscriptionRequest): Promise<ZiinaPaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'X-Ziina-Secret': this.secretKey
        },
        body: JSON.stringify({
          plan_id: request.plan_id,
          customer: {
            email: request.customer_email,
            name: request.customer_name
          },
          trial_period_days: request.trial_days || 0
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Subscription creation failed'
        };
      }

      return {
        success: true,
        payment_id: data.id,
        checkout_url: data.checkout_url,
        status: data.status
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Verify payment status
  async verifyPayment(paymentId: string): Promise<ZiinaPaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Ziina-Secret': this.secretKey
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Payment verification failed'
        };
      }

      return {
        success: true,
        payment_id: data.id,
        status: data.status
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get pricing plans for StoreForge AI
  static getPricingPlans() {
    return {
      starter: {
        id: 'starter',
        name: 'Starter',
        price: 19, // USD
        price_aed: 70, // AED equivalent
        currency: 'USD',
        interval: 'month',
        features: [
          '10 AI-generated stores per month',
          'Shopify + WooCommerce deployment',
          'Basic market research',
          'Email marketing templates',
          'Standard support'
        ],
        limits: {
          stores_per_month: 10,
          platforms: ['shopify', 'woocommerce']
        }
      },
      professional: {
        id: 'professional',
        name: 'Professional',
        price: 49, // USD
        price_aed: 180, // AED equivalent
        currency: 'USD',
        interval: 'month',
        features: [
          '50 AI-generated stores per month',
          'All platforms + integrations',
          'Advanced market research & analytics',
          'Custom email sequences',
          'Priority support',
          'Performance tracking'
        ],
        limits: {
          stores_per_month: 50,
          platforms: ['shopify', 'woocommerce', 'bigcommerce']
        }
      },
      agency: {
        id: 'agency',
        name: 'Agency',
        price: 149, // USD
        price_aed: 550, // AED equivalent
        currency: 'USD',
        interval: 'month',
        features: [
          'Unlimited AI-generated stores',
          'White-label solution',
          'Multi-client dashboard',
          'Advanced analytics & reporting',
          'Dedicated account manager',
          'Custom integrations'
        ],
        limits: {
          stores_per_month: -1, // unlimited
          platforms: ['all']
        }
      }
    };
  }

  // Create payment for subscription plan
  async createPlanPayment(planId: string, customerEmail: string, customerName: string): Promise<ZiinaPaymentResponse> {
    const plans = ZiinaService.getPricingPlans();
    const plan = plans[planId as keyof typeof plans];

    if (!plan) {
      return {
        success: false,
        error: 'Invalid plan selected'
      };
    }

    // Convert to fils (AED cents)
    const amountInFils = plan.price_aed * 100;

    return this.createPayment({
      amount: amountInFils,
      currency: 'AED',
      description: `StoreForge AI - ${plan.name} Plan`,
      customer_email: customerEmail,
      customer_name: customerName,
      metadata: {
        plan_id: planId,
        plan_name: plan.name,
        billing_cycle: plan.interval
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=cancelled`
    });
  }

  // Create payment for theme access
  async createThemePayment(amount: number, customerEmail: string, customerName: string): Promise<ZiinaPaymentResponse> {
    // Convert USD to AED (approximate rate: 1 USD = 3.67 AED)
    const amountInAED = amount * 3.67;
    // Convert to fils (AED cents)
    const amountInFils = Math.round(amountInAED * 100);

    return this.createPayment({
      amount: amountInFils,
      currency: 'AED',
      description: `StoreForge AI - Premium Themes Access`,
      customer_email: customerEmail,
      customer_name: customerName,
      metadata: {
        product_type: 'theme_access',
        amount_usd: amount,
        access_type: 'lifetime'
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success&type=themes`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=cancelled`
    });
  }

  async createCustomPayment(
    amount: number,
    customerEmail: string,
    customerName: string,
    paymentMethod?: string,
    billingInfo?: { address?: string; city?: string; country?: string; postal_code?: string }
  ): Promise<{ success: boolean; message?: string; error?: string; payment_id?: string; checkout_url?: string }> {
    try {
      // Convert USD to AED (approximate rate: 1 USD = 3.67 AED)
      const aedAmount = Math.round(amount * 3.67 * 100); // Convert to fils (1 AED = 100 fils)
      
      // Create payment through Ziina API
      const paymentResult = await this.createPayment({
        amount: aedAmount,
        currency: 'AED',
        description: `Premium Themes Access - $${amount} (Custom Checkout)`,
        customer_email: customerEmail,
        customer_name: customerName,
        metadata: {
          type: 'theme_access_custom',
          usd_amount: amount.toString(),
          access_type: 'premium_themes',
          payment_method: paymentMethod || 'card',
          billing_info: JSON.stringify(billingInfo),
          checkout_type: 'custom'
        },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/success?type=themes`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout?payment=cancelled`
      });

      if (paymentResult.success && paymentResult.checkout_url) {
        return {
          success: true,
          message: 'Payment created successfully! Redirecting to secure payment...',
          payment_id: paymentResult.payment_id,
          checkout_url: paymentResult.checkout_url
        };
      } else {
        return {
          success: false,
          error: paymentResult.error || 'Failed to create payment. Please try again.'
        };
      }
    } catch (error) {
      console.error('Custom payment creation failed:', error);
      return {
        success: false,
        error: 'Payment processing error. Please try again.'
      };
    }
  }
}

// Export singleton instance
export const ziinaService = new ZiinaService();