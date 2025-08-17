# 🚀 StoreForge AI - API Setup Guide

## Quick Setup Checklist

### ✅ **Step 1: OpenRouter (REQUIRED)**
- [ ] Create account at [openrouter.ai](https://openrouter.ai/keys)
- [ ] Add billing method ($10-20 recommended)
- [ ] Create API key
- [ ] Add to `.env.local`: `OPENROUTER_API_KEY=sk-or-v1-...`

### ✅ **Step 2: Supabase Database**
- [ ] Create project at [supabase.com](https://supabase.com/dashboard)
- [ ] Get Project URL and anon key
- [ ] Add to `.env.local`:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
  ```

### ✅ **Step 3: Shopify (For Store Deployment)**
- [ ] Create partner account at [partners.shopify.com](https://partners.shopify.com/)
- [ ] Create new app
- [ ] Get API key and secret
- [ ] Add to `.env.local`:
  ```
  SHOPIFY_API_KEY=your_api_key
  SHOPIFY_API_SECRET=your_secret
  ```

### ✅ **Step 4: Replicate (AI Images)**
- [ ] Create account at [replicate.com](https://replicate.com/account/api-tokens)
- [ ] Create API token
- [ ] Add to `.env.local`: `REPLICATE_API_TOKEN=r8_...`

### ✅ **Step 5: Ziina Payments**
- [ ] Create business account at [ziina.com/business](https://ziina.com/business)
- [ ] Complete verification
- [ ] Get API credentials
- [ ] Add to `.env.local`:
  ```
  ZIINA_API_KEY=your_api_key
  ZIINA_SECRET_KEY=your_secret
  NEXT_PUBLIC_ZIINA_PUBLISHABLE_KEY=your_publishable_key
  ```

## 🎯 **Priority Order**

1. **OpenRouter** - Start here (required for core functionality)
2. **Supabase** - Database and auth
3. **Shopify** - Store deployment
4. **Replicate** - Enhanced AI images (optional)
5. **Ziina** - Payments and subscriptions (optional)

## 💰 **Cost Breakdown**

| Service | Cost | Usage |
|---------|------|-------|
| OpenRouter | $0.02-0.05 per store | Pay per use |
| Supabase | Free tier available | 500MB database |
| Shopify | Free for development | Partner account |
| Replicate | $0.01-0.10 per image | Pay per use |
| Ziina | 2.9% + 1 AED per transaction | Commission based |

## 🚀 **Test Your Setup**

After adding API keys, test with:

```bash
# Start development server
npm run dev

# Test API endpoints
curl http://localhost:3000/api/generate-store
curl http://localhost:3000/api/payments
```

## 🔒 **Security Notes**

- Never commit `.env.local` to git
- Use different keys for development/production
- Rotate keys regularly
- Monitor API usage and costs

## 📞 **Support**

If you need help with any API setup:
- OpenRouter: [openrouter.ai/docs](https://openrouter.ai/docs)
- Supabase: [supabase.com/docs](https://supabase.com/docs)
- Shopify: [partners.shopify.com/help](https://partners.shopify.com/help)
- Replicate: [replicate.com/docs](https://replicate.com/docs)
- Ziina: [ziina.com/support](https://ziina.com/support)