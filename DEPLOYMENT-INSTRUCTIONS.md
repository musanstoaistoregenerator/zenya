# StoreForge AI Deployment Instructions

This guide provides step-by-step instructions for deploying StoreForge AI to GitHub, Render (backend), and Netlify (frontend).

## Prerequisites

- Git repository initialized ✅
- GitHub account
- Render account
- Netlify account
- All environment variables configured

## 1. Deploy to GitHub

### Step 1: Create GitHub Repository
1. Go to [GitHub](https://github.com) and sign in
2. Click "New repository" or go to https://github.com/new
3. Repository name: `storeforge-ai`
4. Description: `AI-powered e-commerce store builder with competitive analysis`
5. Set to Public or Private (your choice)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

### Step 2: Connect Local Repository to GitHub
```bash
# Add GitHub remote (replace 'yourusername' with your actual GitHub username)
git remote add origin https://github.com/yourusername/storeforge-ai.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 2. Deploy Backend to Render

### Step 1: Create Render Account
1. Go to [Render](https://render.com) and sign up/sign in
2. Connect your GitHub account

### Step 2: Create Environment Variable Group
1. In Render dashboard, go to "Environment Groups"
2. Click "New Environment Group"
3. Name: `storeforge-env`
4. Add the following environment variables:

```
NEXT_PUBLIC_APP_URL=https://your-app-name.netlify.app
NEXTAUTH_URL=https://your-render-app.onrender.com
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
OPENAI_API_KEY=your-openai-api-key
SCRAPINGBEE_API_KEY=your-scrapingbee-api-key
APIFY_API_TOKEN=your-apify-api-token
ZIINA_SECRET_KEY=your-ziina-secret-key
ZIINA_WEBHOOK_SECRET=your-ziina-webhook-secret
```

### Step 3: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `yourusername/storeforge-ai`
3. Configure:
   - **Name**: `storeforge-ai-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Under "Advanced":
   - **Auto-Deploy**: Yes
   - **Environment Variables**: Select `storeforge-env` group
5. Click "Create Web Service"

### Step 4: Configure Health Check
1. After deployment, go to service settings
2. Set **Health Check Path**: `/api/health`
3. Save changes

## 3. Deploy Frontend to Netlify

### Step 1: Create Netlify Account
1. Go to [Netlify](https://netlify.com) and sign up/sign in
2. Connect your GitHub account

### Step 2: Create New Site
1. Click "New site from Git"
2. Choose "GitHub" and authorize
3. Select your repository: `yourusername/storeforge-ai`
4. Configure build settings:
   - **Branch**: `main`
   - **Build command**: `npm install && npm run build && npm run export`
   - **Publish directory**: `out`
5. Click "Deploy site"

### Step 3: Configure Environment Variables
1. Go to Site settings → Environment variables
2. Add the following variables:

```
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_APP_URL=https://your-site-name.netlify.app
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
```

### Step 4: Update API Proxy
1. After Render deployment completes, note your Render app URL
2. Update `netlify.toml` file:
   ```toml
   [[redirects]]
     from = "/api/*"
     to = "https://your-actual-render-app.onrender.com/api/:splat"
     status = 200
     force = true
   ```
3. Commit and push changes:
   ```bash
   git add netlify.toml
   git commit -m "Update API proxy URL for production"
   git push origin main
   ```

## 4. Verification

### Test Backend (Render)
1. Visit: `https://your-render-app.onrender.com/api/health`
2. Should return: `{"status":"healthy","services":{...}}`

### Test Frontend (Netlify)
1. Visit: `https://your-site-name.netlify.app`
2. Verify the application loads correctly
3. Test API endpoints through the frontend

### Test Integration
1. Try creating a store analysis
2. Verify OpenAI integration works
3. Check Supabase data persistence

## 5. Custom Domains (Optional)

### Render Custom Domain
1. In Render dashboard → Settings → Custom Domains
2. Add your domain (e.g., `api.yourdomain.com`)
3. Configure DNS records as instructed

### Netlify Custom Domain
1. In Netlify dashboard → Domain settings
2. Add custom domain (e.g., `yourdomain.com`)
3. Configure DNS records as instructed

## 6. Monitoring and Maintenance

### Render Monitoring
- Monitor logs in Render dashboard
- Set up alerts for service health
- Monitor resource usage

### Netlify Monitoring
- Check build logs for any issues
- Monitor site analytics
- Set up form notifications if needed

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check environment variables are set correctly
   - Verify Node.js version compatibility
   - Review build logs for specific errors

2. **API Connection Issues**
   - Verify Render service is running
   - Check API proxy configuration in netlify.toml
   - Ensure CORS settings allow frontend domain

3. **Environment Variable Issues**
   - Double-check all required variables are set
   - Verify variable names match exactly
   - Ensure sensitive keys are not exposed in frontend

### Support
- Render Documentation: https://render.com/docs
- Netlify Documentation: https://docs.netlify.com
- GitHub Issues: Create issues in your repository

## Security Notes

- Never commit API keys or secrets to the repository
- Use environment variables for all sensitive data
- Regularly rotate API keys and secrets
- Monitor access logs for suspicious activity
- Keep dependencies updated

---

**Deployment Status:**
- ✅ Local Git Repository
- ⏳ GitHub Repository (follow Step 1)
- ⏳ Render Backend (follow Step 2)
- ⏳ Netlify Frontend (follow Step 3)
- ⏳ Integration Testing (follow Step 4)