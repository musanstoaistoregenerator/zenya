# StoreForge AI Deployment Guide

This guide covers deploying StoreForge AI using Render for the backend and Netlify for the frontend.

## Architecture Overview

- **Frontend**: Netlify (Static Site)
- **Backend**: Render (Node.js Web Service)
- **Database**: Supabase (Hosted PostgreSQL)
- **AI**: OpenAI API
- **Payments**: Ziina
- **Product Extraction**: ScrapingBee, Apify

## Prerequisites

1. GitHub repository with your StoreForge AI code
2. Render account (render.com)
3. Netlify account (netlify.com)
4. Supabase project
5. OpenAI API key
6. Ziina merchant account

## Step 1: Deploy Backend to Render

### 1.1 Create Render Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `storeforge-ai-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Choose based on your needs (Starter for testing)

### 1.2 Configure Environment Variables

1. In Render dashboard, go to your service
2. Navigate to "Environment" tab
3. Create an Environment Group named `storeforge-env`
4. Add the following variables:

```bash
# App Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-render-app.onrender.com
NEXTAUTH_URL=https://your-render-app.onrender.com
NEXTAUTH_SECRET=your-secure-random-string-here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1

# Product Extraction APIs
SCRAPINGBEE_API_KEY=your-scrapingbee-api-key
APIFY_API_TOKEN=your-apify-api-token

# Payment Processing
ZIINA_SECRET_KEY=your-ziina-secret-key
ZIINA_WEBHOOK_SECRET=your-ziina-webhook-secret

# E-commerce Platform Integration
SHOPIFY_API_KEY=your-shopify-api-key
SHOPIFY_API_SECRET=your-shopify-api-secret

# Authentication
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
```

### 1.3 Deploy

1. Click "Create Web Service"
2. Wait for the deployment to complete
3. Note your Render app URL (e.g., `https://your-app.onrender.com`)

## Step 2: Deploy Frontend to Netlify

### 2.1 Create Netlify Site

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: `npm install && npm run build && npm run export`
   - **Publish directory**: `out`
   - **Node version**: `18`

### 2.2 Configure Environment Variables

1. In Netlify dashboard, go to your site
2. Navigate to "Site settings" → "Environment variables"
3. Add the following variables:

```bash
# Frontend Configuration
NETLIFY=true
NEXT_PUBLIC_APP_URL=https://your-netlify-site.netlify.app
NEXT_PUBLIC_API_BASE_URL=https://your-render-app.onrender.com

# Supabase Configuration (Frontend)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 2.3 Update netlify.toml

1. Update the API proxy URL in `netlify.toml`:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-actual-render-app.onrender.com/api/:splat"
  status = 200
  force = true
```

### 2.4 Deploy

1. Click "Deploy site"
2. Wait for the deployment to complete
3. Note your Netlify app URL

## Step 3: Configure Supabase

### 3.1 Update CORS Settings

1. Go to Supabase Dashboard
2. Navigate to "Settings" → "API"
3. Add your Render and Netlify URLs to CORS origins:
   - `https://your-render-app.onrender.com`
   - `https://your-netlify-site.netlify.app`

### 3.2 Update Authentication Settings

1. Navigate to "Authentication" → "Settings"
2. Add your site URLs to "Site URL" and "Redirect URLs"
3. Configure Google OAuth with your production URLs

## Step 4: Configure External Services

### 4.1 OpenAI API

1. Ensure your OpenAI API key has sufficient credits
2. Monitor usage in OpenAI dashboard

### 4.2 Ziina Payment Gateway

1. Update webhook URLs in Ziina dashboard:
   - Webhook URL: `https://your-render-app.onrender.com/api/webhooks/ziina`
2. Test payment flows

### 4.3 Google OAuth

1. Go to Google Cloud Console
2. Update OAuth consent screen with production URLs
3. Add authorized redirect URIs:
   - `https://your-render-app.onrender.com/api/auth/callback/google`
   - `https://your-netlify-site.netlify.app/api/auth/callback/google`

## Step 5: Testing

### 5.1 Backend Health Check

Test your Render deployment:

```bash
curl https://your-render-app.onrender.com/api/health
```

### 5.2 Frontend Functionality

1. Visit your Netlify site
2. Test user authentication
3. Test store generation functionality
4. Verify API calls are proxied correctly

### 5.3 End-to-End Testing

1. Create a test account
2. Generate a test store
3. Test payment flow (if configured)
4. Verify database operations

## Step 6: Monitoring and Maintenance

### 6.1 Set Up Monitoring

1. **Render**: Monitor logs and metrics in dashboard
2. **Netlify**: Set up form notifications and deploy notifications
3. **Supabase**: Monitor database performance and API usage
4. **OpenAI**: Monitor API usage and costs

### 6.2 Regular Maintenance

1. Update dependencies regularly
2. Monitor API rate limits
3. Review and rotate API keys
4. Monitor application performance
5. Backup database regularly

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure all URLs are added to Supabase CORS settings
2. **API Proxy Issues**: Verify netlify.toml redirects are correct
3. **Environment Variables**: Double-check all required variables are set
4. **Build Failures**: Check Node.js version compatibility
5. **Authentication Issues**: Verify OAuth redirect URLs

### Logs and Debugging

1. **Render Logs**: Available in service dashboard
2. **Netlify Logs**: Available in deploy logs
3. **Supabase Logs**: Available in project dashboard
4. **Browser Console**: For frontend debugging

## Security Considerations

1. Use environment variables for all secrets
2. Enable HTTPS everywhere
3. Regularly rotate API keys
4. Monitor for suspicious activity
5. Keep dependencies updated
6. Use strong authentication policies

## Performance Optimization

1. **CDN**: Netlify provides global CDN automatically
2. **Caching**: Configure appropriate cache headers
3. **Database**: Optimize Supabase queries
4. **API**: Implement rate limiting
5. **Images**: Use optimized image formats

## Cost Management

1. **Render**: Monitor usage and upgrade plan as needed
2. **Netlify**: Track bandwidth and build minutes
3. **Supabase**: Monitor database size and API calls
4. **OpenAI**: Set usage alerts and limits
5. **External APIs**: Monitor usage and costs

---

**Need Help?**

If you encounter issues during deployment:

1. Check the troubleshooting section above
2. Review service-specific documentation
3. Check GitHub issues for known problems
4. Contact support for the respective services