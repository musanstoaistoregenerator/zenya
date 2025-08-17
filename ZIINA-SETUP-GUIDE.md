# Ziina Payment Integration Setup Guide

## Overview
Ziina is a leading payment gateway in the MENA region that supports multiple currencies including AED, SAR, and USD. This guide will help you set up Ziina payments for StoreForge AI.

## Prerequisites
- Ziina merchant account
- Valid business registration in supported countries
- Bank account for settlement

## Step 1: Create Ziina Account

1. **Sign up for Ziina**
   - Visit [Ziina Business](https://business.ziina.com/)
   - Click "Get Started" or "Sign Up"
   - Complete the business registration form

2. **Business Verification**
   - Upload required documents:
     - Trade license
     - Emirates ID (for UAE)
     - Bank statements
     - MOA (Memorandum of Association)
   - Wait for approval (typically 1-3 business days)

3. **Account Activation**
   - Complete KYB (Know Your Business) verification
   - Set up bank account for settlements
   - Configure business details

## Step 2: Get API Credentials

1. **Access Developer Dashboard**
   - Log into your Ziina business account
   - Navigate to "Developers" or "API" section
   - Generate API credentials

2. **Required Credentials**
   ```bash
   ZIINA_API_KEY=your_api_key_here
   ZIINA_SECRET_KEY=your_secret_key_here
   ZIINA_BASE_URL=https://api.ziina.com/v1
   ```

3. **Test vs Production**
   - **Sandbox**: Use for testing
     - Base URL: `https://sandbox-api.ziina.com/v1`
   - **Production**: Use for live transactions
     - Base URL: `https://api.ziina.com/v1`

## Step 3: Configure Environment Variables

1. **Update Vercel Environment Variables**
   ```bash
   # In Vercel Dashboard > Settings > Environment Variables
   ZIINA_API_KEY=pk_live_your_actual_api_key
   ZIINA_SECRET_KEY=sk_live_your_actual_secret_key
   ZIINA_BASE_URL=https://api.ziina.com/v1
   ```

2. **Local Development**
   ```bash
   # In .env.local
   ZIINA_API_KEY=pk_test_your_test_api_key
   ZIINA_SECRET_KEY=sk_test_your_test_secret_key
   ZIINA_BASE_URL=https://sandbox-api.ziina.com/v1
   ```

## Step 4: Configure Payment Settings

### Supported Currencies
- **AED** (UAE Dirham) - Primary
- **SAR** (Saudi Riyal)
- **USD** (US Dollar)

### Current Pricing Configuration
```javascript
// Premium Themes Access
const THEME_PRICE = {
  AED: 18.30,  // ~$4.99
  SAR: 18.71,  // ~$4.99
  USD: 4.99
};
```

### Payment Flow
1. Customer fills checkout form
2. Payment request sent to Ziina API
3. Customer redirected to Ziina checkout
4. Payment processed by Ziina
5. Customer redirected back to success page
6. Webhook confirms payment status

## Step 5: Test Payment Integration

1. **Test with Sandbox**
   ```bash
   # Use test credentials
   ZIINA_API_KEY=pk_test_...
   ZIINA_SECRET_KEY=sk_test_...
   ZIINA_BASE_URL=https://sandbox-api.ziina.com/v1
   ```

2. **Test Cards**
   - **Success**: 4242424242424242
   - **Decline**: 4000000000000002
   - **Insufficient Funds**: 4000000000009995

3. **Test Process**
   - Go to `/checkout` page
   - Fill customer information
   - Click "Complete Payment"
   - Use test card on Ziina checkout
   - Verify redirect to success page

## Step 6: Webhook Configuration (Recommended for Production)

Webhooks are essential for handling payment confirmations and status updates in real-time:

### 6.1 Set Up Webhook Endpoint

1. **Configure Webhook URL in Ziina Dashboard**:
   - Go to your Ziina dashboard → Webhooks section
   - Add webhook URL: `https://yourdomain.com/api/webhooks/ziina`
   - Select events to receive:
     - `payment.completed` - When payment is successful
     - `payment.failed` - When payment fails
     - `payment.cancelled` - When payment is cancelled
     - `subscription.created` - When subscription is created
     - `subscription.cancelled` - When subscription is cancelled

2. **Add Webhook Secret**:
   ```bash
   ZIINA_WEBHOOK_SECRET=your_webhook_secret_from_ziina_dashboard
   ```

### 6.2 Webhook Handler Features

The webhook handler (`/api/webhooks/ziina/route.ts`) includes:

- **Signature Verification**: Ensures webhooks are from Ziina
- **Event Processing**: Handles different payment and subscription events
- **Error Handling**: Robust error handling and logging
- **Security**: HMAC signature verification for authenticity

### 6.3 Webhook Event Processing

When webhooks are received, the system will:

1. **Payment Completed**:
   - Log successful payment details
   - Update user's access status (implement based on your database)
   - Send confirmation email (implement based on your email service)
   - Grant access to premium features

2. **Payment Failed/Cancelled**:
   - Log failure details for analytics
   - Send failure notification email
   - Update payment status

3. **Subscription Events**:
   - Handle subscription creation and cancellation
   - Update user subscription status
   - Manage access permissions

## Step 7: Go Live

1. **Switch to Production**
   ```bash
   # Update environment variables
   ZIINA_API_KEY=pk_live_your_live_key
   ZIINA_SECRET_KEY=sk_live_your_live_secret
   ZIINA_BASE_URL=https://api.ziina.com/v1
   ```

2. **Final Testing**
   - Test with small amount
   - Verify webhook delivery
   - Check settlement in dashboard

## Security Best Practices

1. **API Key Security**
   - Never expose secret keys in frontend
   - Use environment variables only
   - Rotate keys regularly

2. **Webhook Security**
   - Verify webhook signatures
   - Use HTTPS endpoints
   - Implement rate limiting

3. **Data Protection**
   - Never store card details
   - Log minimal payment data
   - Comply with PCI DSS

## Troubleshooting

### Common Issues

1. **"Invalid API Key"**
   - Check environment variables
   - Verify key format
   - Ensure using correct environment

2. **"Payment Failed"**
   - Check customer information
   - Verify amount format (fils for AED)
   - Check currency support

3. **"Webhook Not Received"**
   - Verify webhook URL
   - Check endpoint accessibility
   - Review webhook logs in Ziina dashboard

### Support
- **Ziina Support**: support@ziina.com
- **Developer Docs**: https://docs.ziina.com
- **Status Page**: https://status.ziina.com

## Integration Status

✅ **Completed Features**
- One-time payments
- Customer information collection
- Checkout flow
- Success/failure handling
- Environment configuration

🔄 **Pending Features**
- Webhook handling
- Subscription payments
- Refund processing
- Payment analytics

## Next Steps

1. Set up Ziina merchant account
2. Get API credentials
3. Configure environment variables in Vercel
4. Test payment flow
5. Set up webhooks
6. Go live with production credentials

Your StoreForge AI application is ready for Ziina payment processing once you complete the setup above!