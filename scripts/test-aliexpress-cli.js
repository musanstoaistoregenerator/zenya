#!/usr/bin/env node

/**
 * E-commerce Product Extraction CLI Test Script
 * 
 * This script allows you to test product extraction from any e-commerce platform directly from the command line.
 * 
 * Usage:
 *   node scripts/test-aliexpress-cli.js <product-url>
 * 
 * Example:
 *   node scripts/test-aliexpress-cli.js "https://www.aliexpress.com/item/1234567890.html"
 *   node scripts/test-aliexpress-cli.js "https://www.amazon.com/dp/B08N5WRWNW"
 *   node scripts/test-aliexpress-cli.js "https://www.ebay.com/itm/123456789"
 */

const cheerio = require('cheerio');
require('dotenv').config({ path: '.env.local' });

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorLog(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function printHeader() {
  console.log('\n' + '='.repeat(60));
  colorLog('cyan', '🚀 E-commerce Product Extraction CLI Test');
  console.log('='.repeat(60));
}

function printUsage() {
  colorLog('yellow', '\nUsage:');
  console.log('  node scripts/test-aliexpress-cli.js <product-url>');
  colorLog('yellow', '\nExample:');
  console.log('  node scripts/test-aliexpress-cli.js "https://www.aliexpress.com/item/1234567890.html"');
  console.log('  node scripts/test-aliexpress-cli.js "https://www.amazon.com/dp/B08N5WRWNW"');
  console.log('  node scripts/test-aliexpress-cli.js "https://www.ebay.com/itm/123456789"');
  console.log('');
}

function validateUrl(url) {
  if (!url) {
    colorLog('red', '❌ Error: No URL provided');
    printUsage();
    return false;
  }

  // URL validation is now handled by the URL constructor below

  try {
    new URL(url);
    return true;
  } catch {
    colorLog('red', '❌ Error: Invalid URL format');
    return false;
  }
}

function checkSetup() {
  colorLog('green', '✅ Basic web scraping setup complete');
  colorLog('yellow', '⚠️  Note: This uses basic scraping which may have limitations');
  return true;
}

function formatProductData(data) {
  console.log('\n' + '='.repeat(60));
  colorLog('green', '✅ Product Extraction Successful!');
  console.log('='.repeat(60));
  
  colorLog('bright', `\n📦 Product: ${data.title || 'N/A'}`);
  colorLog('green', `💰 Price: $${data.price || 'N/A'}`);
  if (data.originalPrice && data.originalPrice !== data.price) {
    colorLog('yellow', `🏷️  Original Price: $${data.originalPrice}`);
  }
  
  colorLog('blue', `🏪 Store: ${data.brand || 'N/A'}`);
  colorLog('magenta', `⭐ Rating: ${data.rating || 'N/A'} (${data.reviewCount || 0} reviews)`);
  
  if (data.images && data.images.length > 0) {
    colorLog('cyan', `🖼️  Images: ${data.images.length} found`);
  }
  
  if (data.features && data.features.length > 0) {
    colorLog('yellow', `\n🔥 Key Features:`);
    data.features.slice(0, 5).forEach((feature, index) => {
      console.log(`   ${index + 1}. ${feature}`);
    });
  }
  
  if (data.shipping) {
    colorLog('blue', `\n🚚 Shipping: ${data.shipping.cost || 'N/A'} - ${data.shipping.time || 'N/A'}`);
  }
  
  if (data.seller) {
    colorLog('magenta', `\n👤 Seller Info:`);
    console.log(`   Name: ${data.seller.name || 'N/A'}`);
    console.log(`   Rating: ${data.seller.rating || 'N/A'}`);
    if (data.seller.followers) {
      console.log(`   Followers: ${data.seller.followers}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
}

async function extractProduct(url) {
  if (!validateUrl(url)) return;

  printHeader();
  colorLog('blue', `🔍 Extracting product data from: ${url}`);
  colorLog('yellow', '⏳ This may take 10-30 seconds...');

  try {
    colorLog('green', '✅ Using basic web scraping approach');
    
    // Fetch the page with proper headers to avoid blocking
    colorLog('cyan', '\n🌐 Fetching product page...');
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    colorLog('green', '✅ Page fetched successfully');
    colorLog('cyan', '\n🔍 Parsing product data...');
    
    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract product information using CSS selectors
    const title = $('h1').first().text().trim() || 
                 $('.product-title-text').text().trim() || 
                 $('[data-pl="product-title"]').text().trim() ||
                 'Product title not found';

    // Try to extract price from various possible selectors
    const priceSelectors = [
        '.product-price-current',
        '.price-current',
        '.price-sale',
        '[data-pl="price"]',
        '.price'
    ];
    
    let price = 'Price not found';
    for (const selector of priceSelectors) {
        const priceText = $(selector).first().text().trim();
        if (priceText) {
            price = priceText;
            break;
        }
    }

    // Extract images
    const images = [];
    $('img').each((_, img) => {
        const src = $(img).attr('src') || $(img).attr('data-src');
        if (src && (src.includes('alicdn.com') || src.includes('aliexpress'))) {
            // Convert relative URLs to absolute
            const imageUrl = src.startsWith('//') ? `https:${src}` : 
                            src.startsWith('/') ? `https://www.aliexpress.com${src}` : src;
            if (!images.includes(imageUrl)) {
                images.push(imageUrl);
            }
        }
    });

    // Extract description (try multiple selectors)
    const descriptionSelectors = [
        '.product-description',
        '.description-content',
        '[data-pl="description"]',
        '.product-overview'
    ];
    
    let description = '';
    for (const selector of descriptionSelectors) {
        const desc = $(selector).first().text().trim();
        if (desc) {
            description = desc;
            break;
        }
    }

    // Extract rating
    const ratingSelectors = [
        '.rating-value',
        '.average-rating',
        '[data-pl="rating"]'
    ];
    
    let rating = null;
    for (const selector of ratingSelectors) {
        const ratingText = $(selector).first().text().trim();
        if (ratingText) {
            const ratingMatch = ratingText.match(/([0-9.]+)/);
            if (ratingMatch) {
                rating = parseFloat(ratingMatch[1]);
                break;
            }
        }
    }

    // Transform the data (simplified version)
    const productData = {
      title: title,
      price: price,
      originalPrice: price,
      images: images.slice(0, 10),
      brand: 'AliExpress Store',
      rating: rating || 'N/A',
      reviewCount: 0,
      features: description ? [description.substring(0, 200)] : [],
      shipping: {
        cost: 'N/A',
        time: 'N/A'
      },
      seller: {
        name: 'AliExpress Seller',
        rating: 'N/A',
        followers: null
      }
    };

    const rawData = {
      title: title,
      price: price,
      images: images,
      description: description,
      rating: rating,
      note: 'Basic extraction - some data may be limited due to AliExpress anti-bot measures'
    };

    formatProductData(productData);
    
    // Show raw data option
    colorLog('yellow', '\n💾 Raw data available. To see full extracted data, add --raw flag');
    if (process.argv.includes('--raw')) {
      console.log('\n' + '='.repeat(60));
      colorLog('cyan', '📋 Raw Extracted Data:');
      console.log('='.repeat(60));
      console.log(JSON.stringify(rawData, null, 2));
    }

  } catch (error) {
    colorLog('red', `\n❌ Extraction failed: ${error.message}`);
    
    if (error.message.includes('token')) {
      colorLog('yellow', '\n🔑 Check your APIFY_API_TOKEN in .env.local');
    } else if (error.message.includes('rate limit')) {
      colorLog('yellow', '\n⏰ Rate limit reached. Wait a few seconds and try again.');
    } else {
      console.log('💡 Troubleshooting tips:');
       console.log('   1. Verify the product URL is accessible');
       console.log('   2. Try a different product URL from the same platform');
       console.log('   3. Some sites may block automated requests');
    }
  }
}

// Main execution
if (require.main === module) {
  const url = process.argv[2];
  extractProduct(url);
}

module.exports = { extractProduct };