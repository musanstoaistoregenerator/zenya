# ScrapingBee Setup Guide for StoreForge AI

This guide will help you set up ScrapingBee for enhanced product URL extraction in StoreForge AI.

## Why ScrapingBee?

ScrapingBee provides several advantages over basic web scraping:

- **JavaScript Rendering**: Handles dynamic content loaded by JavaScript
- **Anti-Bot Protection**: Bypasses common anti-bot measures
- **Premium Proxies**: Uses high-quality residential and datacenter proxies
- **Reliability**: Higher success rates for modern e-commerce sites
- **Global Coverage**: Access sites from different geographical locations

## Setup Instructions

### Step 1: Sign Up for ScrapingBee

1. Visit [ScrapingBee.com](https://www.scrapingbee.com/)
2. Click "Sign Up" and create your account
3. Choose a plan that fits your needs:
   - **Free Plan**: 1,000 API calls/month (good for testing)
   - **Starter Plan**: $29/month for 100,000 API calls
   - **Growth Plan**: $99/month for 500,000 API calls

### Step 2: Get Your API Key

1. Log into your ScrapingBee dashboard
2. Navigate to [Account > API](https://app.scrapingbee.com/account/api)
3. Copy your API key

### Step 3: Configure StoreForge AI

1. In your StoreForge AI project, copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and add your ScrapingBee API key:
   ```env
   SCRAPINGBEE_API_KEY=your_actual_api_key_here
   ```

3. Restart your development server:
   ```bash
   npm run dev
   ```

### Step 4: Test the Integration

1. Go to your StoreForge AI application
2. Try extracting a product from a challenging site (like AliExpress)
3. The system will automatically try ScrapingBee first, then fallback to basic extraction if needed

## Features Enabled with ScrapingBee

### Enhanced Extraction Capabilities

- **JavaScript Rendering**: Waits for dynamic content to load
- **Premium Proxies**: Reduces blocking and rate limiting
- **Geographic Targeting**: Access region-specific content
- **Custom Wait Conditions**: Waits for specific elements to appear

### Supported E-commerce Platforms

- ✅ AliExpress
- ✅ Amazon
- ✅ eBay
- ✅ Shopify stores
- ✅ WooCommerce stores
- ✅ Most modern e-commerce sites

### Extraction Improvements

- **Better Product Titles**: More accurate title extraction
- **Enhanced Price Detection**: Handles dynamic pricing
- **Improved Image Extraction**: Finds high-quality product images
- **Meta Tag Fallbacks**: Uses Open Graph and Twitter meta tags
- **Brand Detection**: Identifies product brands
- **Rating Extraction**: Captures product ratings and reviews

## API Usage and Costs

### Free Plan Limits
- 1,000 API calls per month
- JavaScript rendering included
- Premium proxy rotation
- Perfect for testing and small projects

### Paid Plan Benefits
- Higher API call limits
- Priority support
- Advanced features (screenshots, PDF generation)
- Custom integrations

### Cost Optimization Tips

1. **Use Fallback Logic**: The system tries ScrapingBee first, then falls back to basic extraction
2. **Cache Results**: Store successful extractions to avoid repeat calls
3. **Monitor Usage**: Check your dashboard regularly
4. **Optimize Selectors**: Better selectors reduce failed attempts

## Troubleshooting

### Common Issues

**Issue**: "ScrapingBee API key not configured"
- **Solution**: Make sure your `.env.local` file contains the correct API key
- **Check**: Restart your development server after adding the key

**Issue**: "ScrapingBee API error! status: 401"
- **Solution**: Your API key is invalid or expired
- **Check**: Verify the key in your ScrapingBee dashboard

**Issue**: "ScrapingBee API error! status: 402"
- **Solution**: You've exceeded your monthly quota
- **Check**: Upgrade your plan or wait for the next billing cycle

**Issue**: Still getting "Product title not found"
- **Solution**: The site might have very strong anti-bot protection
- **Try**: Use the manual entry option as a fallback

### Getting Help

1. **ScrapingBee Support**: [support@scrapingbee.com](mailto:support@scrapingbee.com)
2. **Documentation**: [ScrapingBee API Docs](https://www.scrapingbee.com/documentation/)
3. **StoreForge AI Issues**: Check the console for detailed error messages

## Alternative Solutions

If ScrapingBee doesn't work for your use case, consider:

1. **Apify**: Alternative scraping service (already integrated)
2. **Manual Entry**: Always available as a fallback
3. **Browserless**: Another headless browser service
4. **Custom Scrapers**: Build platform-specific extractors

## Security Best Practices

1. **Never commit API keys**: Keep `.env.local` in your `.gitignore`
2. **Use environment variables**: Never hardcode API keys in your code
3. **Monitor usage**: Set up alerts for unusual API usage
4. **Rotate keys**: Regularly update your API keys

## Next Steps

Once ScrapingBee is set up:

1. Test with various e-commerce URLs
2. Monitor your API usage in the ScrapingBee dashboard
3. Consider upgrading your plan based on usage patterns
4. Explore advanced features like custom headers and cookies

---

**Need help?** Check the console logs for detailed error messages, or refer to the ScrapingBee documentation for advanced configuration options.