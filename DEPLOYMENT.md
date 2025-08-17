# StoreForge AI - Production Deployment Guide

This guide will help you deploy StoreForge AI to production and start generating revenue.

## 🚀 Quick Deployment to Vercel

### Step 1: Prepare for Deployment

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

### Step 2: Deploy to Vercel

1. **Deploy the application**:
   ```bash
   vercel --prod
   ```

2. **Follow the prompts**:
   - Set up and deploy: `Y`
   - Which scope: Choose your account
   - Link to existing project: `N` (for first deployment)
   - Project name: `storeforge-ai` (or your preferred name)
   - Directory: `./` (current directory)
   - Override settings: `N`

### Step 3: Configure Environment Variables

After deployment, configure your environment variables in Vercel:

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `storeforge-ai` project
3. Go to **Settings** → **Environment Variables**
4. Add the following **REQUIRED** variables:

#### Essential Variables for Basic Functionality:
```
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
SCRAPINGBEE_API_KEY=your_scrapingbee_api_key
OPENROUTER_API_KEY=sk-or-v1-your_openrouter_key
```

#### For Revenue Generation (Payment Processing):
```
ZIINA_API_KEY=your_ziina_api_key
ZIINA_SECRET_KEY=your_ziina_secret_key
```

#### For User Management:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXTAUTH_SECRET=your_generated_secret
```

### Step 4: Set Up Required Services

#### 1. ScrapingBee (Product Extraction)
- Sign up at [ScrapingBee](https://www.scrapingbee.com/)
- Get API key from [Account Dashboard](https://app.scrapingbee.com/account/api)
- Add to Vercel environment variables

#### 2. OpenRouter (AI Content Generation)
- Sign up at [OpenRouter](https://openrouter.ai/)
- Get API key from [Keys Page](https://openrouter.ai/keys)
- Add to Vercel environment variables

#### 3. Ziina (Payment Processing)
- Sign up at [Ziina](https://ziina.com/developers)
- Get API credentials
- Add to Vercel environment variables

#### 4. Supabase (Database & Auth)
- Create project at [Supabase](https://supabase.com/dashboard)
- Get URL and anon key from project settings
- Add to Vercel environment variables

### Step 5: Custom Domain (Optional but Recommended)

1. In Vercel Dashboard → **Settings** → **Domains**
2. Add your custom domain
3. Update `NEXT_PUBLIC_APP_URL` environment variable
4. Configure DNS settings as instructed by Vercel

## 💰 Revenue Generation Setup

### Pricing Strategy

1. **Freemium Model**:
   - 1 free store generation
   - Limited customization
   - Basic templates

2. **Pro Plan** ($29/month):
   - Unlimited store generations
   - Premium templates
   - Advanced customization
   - Priority support

3. **Enterprise** ($99/month):
   - White-label solution
   - Custom integrations
   - Dedicated support

### Payment Integration

The application is pre-configured with Ziina payment gateway. To activate:

1. Complete Ziina merchant verification
2. Add API credentials to environment variables
3. Test payment flow in staging
4. Enable production payments

## 📊 Monitoring & Analytics

### Essential Monitoring

1. **Vercel Analytics** (Built-in):
   - Automatically enabled
   - Track page views and performance

2. **Error Tracking**:
   - Add Sentry DSN to environment variables
   - Monitor API errors and user issues

3. **Revenue Tracking**:
   - Ziina dashboard for payment analytics
   - Supabase for user analytics

## 🔧 Post-Deployment Checklist

- [ ] Application loads correctly
- [ ] Product extraction works (test with AliExpress URL)
- [ ] AI content generation functions
- [ ] Payment flow completes successfully
- [ ] User registration/login works
- [ ] Email notifications sent
- [ ] Mobile responsiveness verified
- [ ] SEO meta tags configured
- [ ] SSL certificate active
- [ ] Custom domain configured (if applicable)

## 🚨 Troubleshooting

### Common Issues

1. **API Errors**:
   - Check environment variables are set correctly
   - Verify API keys are valid and have sufficient credits
   - Check Vercel function logs

2. **Payment Issues**:
   - Verify Ziina credentials
   - Check webhook endpoints
   - Test in sandbox mode first

3. **Database Errors**:
   - Verify Supabase connection
   - Check database permissions
   - Review SQL policies

### Getting Help

- Check Vercel deployment logs
- Review browser console for client-side errors
- Monitor API endpoint responses
- Contact support for service-specific issues

## 📈 Scaling Considerations

### Performance Optimization

1. **Vercel Pro Plan**: For higher limits and better performance
2. **CDN Configuration**: Optimize static asset delivery
3. **Database Scaling**: Upgrade Supabase plan as needed
4. **API Rate Limits**: Monitor and upgrade service plans

### Marketing & Growth

1. **SEO Optimization**: Implement meta tags and structured data
2. **Content Marketing**: Create tutorials and case studies
3. **Social Media**: Share success stories and features
4. **Partnerships**: Integrate with e-commerce platforms

---

**Ready to launch?** Follow this guide step by step, and your StoreForge AI application will be live and generating revenue in under an hour!

For technical support, check the troubleshooting section or review the application logs in your Vercel dashboard.