# 🚀 StoreForge AI - CLI Usage Guide

## Overview

StoreForge AI now includes powerful Command Line Interface (CLI) tools for AliExpress product extraction using the Apify API. This allows you to extract real product data directly from your terminal.

## Available CLI Commands

### 1. Test AliExpress Extraction

```bash
# Test with a specific AliExpress URL
npm run test-aliexpress "https://www.aliexpress.com/item/1234567890.html"

# Or run the script directly
node scripts/test-aliexpress-cli.js "https://www.aliexpress.com/item/1234567890.html"

# Show raw extracted data
npm run test-aliexpress "https://www.aliexpress.com/item/1234567890.html" -- --raw
```

### 2. Setup Help

```bash
# Get setup instructions
npm run setup-apify
```

## Quick Start

### 1. Install Dependencies

```bash
# Install Apify CLI globally (optional)
npm install -g apify-cli

# Install project dependencies
npm install
```

### 2. Configure API Token

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local and add your Apify token
# APIFY_API_TOKEN=your_actual_token_here
```

### 3. Test the Setup

```bash
# Test with a real AliExpress URL
npm run test-aliexpress "https://www.aliexpress.com/item/3256807676950174.html"
```

## CLI Features

### ✅ Real-time Product Extraction
- Extract live product data from AliExpress
- Get accurate pricing, images, and specifications
- Retrieve seller information and ratings

### ✅ Detailed Output
- Formatted, colorized console output
- Product details, pricing, and features
- Seller and shipping information
- Error handling with helpful suggestions

### ✅ Raw Data Access
- View complete extracted data with `--raw` flag
- Perfect for debugging and development
- JSON formatted output

## Example Output

```
============================================================
🚀 AliExpress Product Extraction CLI Test
============================================================
🔍 Extracting product data from: https://www.aliexpress.com/item/...
⏳ This may take 10-30 seconds...

🤖 Starting Apify actor...
✅ Actor run completed: abc123
📊 Fetching extracted data...

============================================================
✅ Product Extraction Successful!
============================================================

📦 Product: Wireless Bluetooth Headphones
💰 Price: $29.99
🏷️  Original Price: $59.99
🏪 Store: TechStore Official
⭐ Rating: 4.8 (1,234 reviews)
🖼️  Images: 8 found

🔥 Key Features:
   1. Bluetooth 5.0 connectivity
   2. 30-hour battery life
   3. Active noise cancelling
   4. Premium sound quality
   5. Comfortable fit

🚚 Shipping: Free - 7-15 days

👤 Seller Info:
   Name: TechStore Official
   Rating: 4.8
   Followers: 15,420

============================================================
```

## Advanced Usage

### Using Apify CLI Directly

```bash
# Login to Apify
apify login

# Run AliExpress extraction directly
echo '{
  "productUrl": "https://www.aliexpress.com/item/1234567890.html",
  "currency": "USD"
}' | apify call pintostudio/aliexpress-product-description --silent
```

### Batch Processing

```bash
# Create a script to process multiple URLs
#!/bin/bash
URLS=(
  "https://www.aliexpress.com/item/1234567890.html"
  "https://www.aliexpress.com/item/0987654321.html"
)

for url in "${URLS[@]}"; do
  echo "Processing: $url"
  npm run test-aliexpress "$url"
  sleep 2  # Rate limiting
done
```

## Troubleshooting

### Common Issues

1. **"APIFY_API_TOKEN not found"**
   ```bash
   # Check if .env.local exists
   ls -la .env.local
   
   # Copy from template if missing
   cp .env.example .env.local
   ```

2. **"No product data extracted"**
   - Verify the AliExpress URL is accessible
   - Try a different product URL
   - Check your Apify account credits

3. **Rate limiting errors**
   ```bash
   # Wait between requests
   sleep 5
   npm run test-aliexpress "$URL"
   ```

### Debug Mode

```bash
# Enable verbose logging
DEBUG=* npm run test-aliexpress "$URL"

# View raw extracted data
npm run test-aliexpress "$URL" -- --raw
```

## Integration with Web App

The CLI uses the same extraction logic as the web application:

- **Web App**: Automatically detects AliExpress URLs and uses Apify API
- **CLI**: Direct testing and debugging of extraction functionality
- **API Endpoint**: `/api/extract-aliexpress` powers both interfaces

## Cost Management

### Monitor Usage

```bash
# Check Apify account usage
apify info

# View recent runs
apify runs list
```

### Optimize Costs

1. **Cache results**: Store extracted data locally
2. **Batch processing**: Group multiple extractions
3. **Rate limiting**: Add delays between requests
4. **Selective extraction**: Only extract when needed

## Next Steps

1. **Set up your Apify account** and get API token
2. **Configure environment** variables
3. **Test with real URLs** using the CLI
4. **Integrate with your workflow** for automated extraction
5. **Monitor usage** and optimize costs

## Support

- **Setup Guide**: See `apify-setup-guide.md`
- **API Documentation**: Visit `/api/extract-aliexpress` endpoint
- **Apify Docs**: [https://docs.apify.com/](https://docs.apify.com/)
- **CLI Help**: `npm run test-aliexpress` (without URL for usage info)

---

**Ready to extract real AliExpress data from the command line!** 🎯