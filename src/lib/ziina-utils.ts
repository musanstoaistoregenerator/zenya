import { ZiinaService } from './payments/ziina-service';

// Payment status types
export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'expired';

// Subscription status types
export type SubscriptionStatus = 
  | 'active'
  | 'cancelled'
  | 'expired'
  | 'pending';

// Payment tracking interface
export interface PaymentRecord {
  id: string;
  ziinaPaymentId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  customerEmail: string;
  customerName: string;
  productType: 'theme' | 'subscription' | 'custom';
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Subscription tracking interface
export interface SubscriptionRecord {
  id: string;
  ziinaSubscriptionId?: string;
  customerEmail: string;
  status: SubscriptionStatus;
  planType: string;
  amount: number;
  currency: string;
  startDate: Date;
  endDate?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Ziina utility class for payment management
export class ZiinaUtils {
  private ziinaService: ZiinaService;

  constructor() {
    this.ziinaService = new ZiinaService();
  }

  /**
   * Create a payment with proper error handling and validation
   */
  async createPayment({
    amount,
    currency = 'AED',
    customerEmail,
    customerName,
    productType,
    description,
    metadata = {}
  }: {
    amount: number;
    currency?: 'AED' | 'SAR' | 'USD';
    customerEmail: string;
    customerName: string;
    productType: 'theme' | 'subscription' | 'custom';
    description: string;
    metadata?: Record<string, any>;
  }) {
    try {
      // Validate input
      if (amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      
      if (!customerEmail || !customerEmail.includes('@')) {
        throw new Error('Valid customer email is required');
      }

      // Create payment request
      const paymentRequest = {
        amount,
        currency,
        customer: {
          email: customerEmail,
          name: customerName
        },
        description,
        metadata: {
          ...metadata,
          productType,
          source: 'storeforge-ai'
        }
      };

      const response = await this.ziinaService.createPayment(paymentRequest);
      
      if (!response.success) {
        throw new Error(response.error || 'Payment creation failed');
      }

      return {
        success: true,
        paymentId: response.payment_id,
        checkoutUrl: response.checkout_url,
        status: response.status
      };
    } catch (error) {
      console.error('Error creating Ziina payment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Create a subscription with proper validation
   */
  async createSubscription({
    planId,
    customerEmail,
    customerName,
    metadata = {}
  }: {
    planId: string;
    customerEmail: string;
    customerName: string;
    metadata?: Record<string, any>;
  }) {
    try {
      // Validate input
      if (!planId) {
        throw new Error('Plan ID is required');
      }
      
      if (!customerEmail || !customerEmail.includes('@')) {
        throw new Error('Valid customer email is required');
      }

      const subscriptionRequest = {
        plan_id: planId,
        customer_email: customerEmail,
        customer_name: customerName,
        metadata: {
          ...metadata,
          source: 'storeforge-ai'
        }
      };

      const response = await this.ziinaService.createSubscription(subscriptionRequest);
      
      if (!response.success) {
        throw new Error(response.error || 'Subscription creation failed');
      }

      return {
        success: true,
        subscriptionId: response.subscription_id,
        checkoutUrl: response.checkout_url,
        status: response.status
      };
    } catch (error) {
      console.error('Error creating Ziina subscription:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Verify payment status
   */
  async verifyPayment(paymentId: string) {
    try {
      if (!paymentId) {
        throw new Error('Payment ID is required');
      }

      const response = await this.ziinaService.verifyPayment(paymentId);
      
      if (!response.success) {
        throw new Error(response.error || 'Payment verification failed');
      }

      return {
        success: true,
        status: response.status,
        amount: response.amount,
        currency: response.currency,
        customer: response.customer
      };
    } catch (error) {
      console.error('Error verifying Ziina payment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Format amount for display
   */
  static formatAmount(amount: number, currency: string = 'AED'): string {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  }

  /**
   * Validate currency code
   */
  static isValidCurrency(currency: string): boolean {
    const supportedCurrencies = ['AED', 'USD', 'EUR', 'GBP', 'SAR', 'KWD', 'BHD', 'OMR', 'QAR'];
    return supportedCurrencies.includes(currency.toUpperCase());
  }

  /**
   * Get payment status color for UI
   */
  static getStatusColor(status: PaymentStatus): string {
    switch (status) {
      case 'completed':
        return 'green';
      case 'processing':
      case 'pending':
        return 'yellow';
      case 'failed':
      case 'cancelled':
        return 'red';
      case 'expired':
        return 'gray';
      default:
        return 'gray';
    }
  }

  /**
   * Get user-friendly status message
   */
  static getStatusMessage(status: PaymentStatus): string {
    switch (status) {
      case 'completed':
        return 'Payment completed successfully';
      case 'processing':
        return 'Payment is being processed';
      case 'pending':
        return 'Payment is pending';
      case 'failed':
        return 'Payment failed';
      case 'cancelled':
        return 'Payment was cancelled';
      case 'expired':
        return 'Payment link has expired';
      default:
        return 'Unknown payment status';
    }
  }
}

// Export singleton instance
export const ziinaUtils = new ZiinaUtils();

// Export helper functions
export {
  ZiinaUtils as ZiinaPaymentUtils
};