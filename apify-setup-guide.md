# AliExpress Product Extraction Setup Guide

This guide explains the AliExpress product extraction system in your StoreForge AI application.

## Overview

The AliExpress integration uses a basic web scraping approach to extract product information from AliExpress listings. While this provides fundamental product data, it may have limitations due to AliExpress's anti-bot measures.

### Key Features
- **Basic product data extraction** from AliExpress
- **Product titles and pricing** (when available)
- **Product images** from AliExpress CDN
- **Fallback support** for blocked requests
- **No external API dependencies**
- **Free to use** (no additional costs)

## Setup Instructions

### 1. No Additional Setup Required

The basic scraping approach requires no additional configuration or API tokens. The system is ready to use out of the box.

### 2. Verify Setup

Test the extraction using the CLI tool:

```bash
npm run test-aliexpress "https://www.aliexpress.com/item/YOUR_PRODUCT_ID.html"
```

## How It Works

### Automatic Detection
The system automatically detects AliExpress URLs and routes them to the specialized extraction endpoint:
- **AliExpress URLs** → `/api/extract-aliexpress` (Basic scraping)
- **Other URLs** → `/api/extract-product` (existing extraction)

### API Endpoints

- **New**: `/api/extract-aliexpress` - Basic scraping for AliExpress URLs
- **Existing**: `/api/extract-product` - For other platforms

### Data Quality

The basic scraping approach provides:

- **Limited accuracy** due to anti-bot measures
- **Basic product information** when accessible
- **Fallback responses** when extraction fails
- **No external costs** or dependencies
- **Simple and reliable** operation

### Limitations
- Product titles may not be extracted due to dynamic loading
- Prices may not be available due to JavaScript rendering
- Limited product specifications and details
- Seller information may be generic
- Some requests may be blocked by AliExpress

## Pricing

### No Additional Costs
- **Completely free** to use
- **No API tokens** required
- **No usage limits** from external services
- **Only server resources** used

## Troubleshooting

### Common Issues

1. **"Product title not found"**:
   - AliExpress may be using dynamic content loading
   - The page structure may have changed
   - Anti-bot measures may be blocking access

2. **"Price not found"**:
   - Prices may be loaded via JavaScript
   - Different page layouts may use different selectors
   - Geographic restrictions may apply

3. **"Limited data extracted"**:
   - This is expected with basic scraping
   - AliExpress actively prevents automated access
   - Consider manual data entry for critical products

4. **"Access restrictions"**:
   - AliExpress may block automated requests
   - Try different product URLs
   - Use the fallback data provided

### Fallback Options

If basic extraction fails:
1. **Manual Entry**: Use the built-in manual product entry form
2. **Generic Extraction**: Falls back to basic web scraping
3. **Retry**: Try again with a different AliExpress URL

## Example Usage

### Supported AliExpress URLs
```
https://www.aliexpress.com/item/1234567890.html
https://www.aliexpress.us/item/1234567890.html
https://aliexpress.com/item/1234567890.html
```

### Sample Extracted Data
```json
{
  "title": "Wireless Bluetooth Headphones",
  "price": 29.99,
  "originalPrice": 59.99,
  "images": ["https://...", "https://..."],
  "description": "High-quality wireless headphones...",
  "brand": "TechStore Official",
  "features": ["Bluetooth 5.0", "30-hour battery", "Noise cancelling"],
  "specifications": {
    "material": "Premium ABS plastic",
    "weight": "250g",
    "warranty": "1 year"
  },
  "seller": {
    "name": "TechStore Official",
    "rating": 4.8,
    "followers": 15420
  },
  "shipping": {
    "cost": "Free",
    "time": "7-15 days"
  }
}
```

## Next Steps

1. **Set up your Apify account** and get your API token
2. **Configure your environment** with the token
3. **Test with real AliExpress URLs** to see the improved data quality
4. **Monitor your usage** in the Apify console
5. **Consider upgrading** your plan based on your extraction volume

## Support

- **Apify Documentation**: [https://docs.apify.com/](https://docs.apify.com/)
- **AliExpress Actor**: [https://apify.com/pintostudio/aliexpress-product-description](https://apify.com/pintostudio/aliexpress-product-description)
- **API Reference**: Check `/api/extract-aliexpress` endpoint for status

---

**Ready to extract real AliExpress product data!** 🚀