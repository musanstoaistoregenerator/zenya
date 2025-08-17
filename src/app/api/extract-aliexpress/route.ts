import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

// Helper function to clean text
function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

// Helper function to extract price from text
function extractPrice(text: string): number | null {
  const priceMatch = text.match(/[\$£€¥]?([\d,]+\.?\d*)/g);
  if (priceMatch) {
    const numericPrice = priceMatch[0].replace(/[^\d.]/g, '');
    return parseFloat(numericPrice);
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'Product URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    try {
      // Fetch the page with proper headers to avoid blocking
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

      const html = await response.text();
      const $ = cheerio.load(html);

      // Extract product information using comprehensive CSS selectors
      const titleSelectors = [
        'h1',
        '.product-title-text',
        '[data-pl="product-title"]',
        '.product-title',
        '.pdp-product-name',
        '.x-item-title-label',
        '#productTitle',
        '.product-name',
        '.item-title',
        '.title'
      ];
      
      let title = 'Product title not found';
      for (const selector of titleSelectors) {
        const titleText = $(selector).first().text().trim();
        if (titleText && titleText.length > 3) {
          title = cleanText(titleText);
          break;
        }
      }

      // Try to extract price from various possible selectors
      const priceSelectors = [
        '.product-price-current',
        '.price-current',
        '.price-sale',
        '[data-pl="price"]',
        '.price',
        '.a-price-whole',
        '.a-price .a-offscreen',
        '.notranslate',
        '.price-now',
        '.current-price',
        '.sale-price',
        '.product-price',
        '.price-display',
        '.amount',
        '[data-testid="price"]'
      ];
      
      let price = 'Price not found';
      for (const selector of priceSelectors) {
        const priceText = $(selector).first().text().trim();
        if (priceText && (priceText.includes('$') || priceText.includes('€') || priceText.includes('£') || /\d/.test(priceText))) {
          price = cleanText(priceText);
          break;
        }
      }

      // Extract images with broader selectors
      const images: string[] = [];
      const imageSelectors = [
        'img[src*="product"]',
        'img[data-src*="product"]',
        '.product-image img',
        '.gallery img',
        '.image-gallery img',
        'img[alt*="product"]',
        'img'
      ];
      
      for (const selector of imageSelectors) {
        $(selector).each((_, img) => {
          const src = $(img).attr('src') || $(img).attr('data-src') || $(img).attr('data-lazy-src');
          if (src && src.length > 10) {
            // Convert relative URLs to absolute
            let imageUrl = src;
            if (src.startsWith('//')) {
              imageUrl = `https:${src}`;
            } else if (src.startsWith('/')) {
              const baseUrl = new URL(url).origin;
              imageUrl = `${baseUrl}${src}`;
            }
            
            // Filter out small icons and logos
            if (!imageUrl.includes('logo') && 
                !imageUrl.includes('icon') && 
                !imageUrl.includes('sprite') &&
                !images.includes(imageUrl) &&
                images.length < 15) {
              images.push(imageUrl);
            }
          }
        });
        if (images.length >= 5) break; // Stop if we have enough images
      }

      // Extract description (try multiple selectors)
      const descriptionSelectors = [
        '.product-description',
        '.description-content',
        '[data-pl="description"]',
        '.product-overview',
        '#feature-bullets',
        '.a-unordered-list',
        '.product-details',
        '.item-specifics',
        '.product-info',
        '.description',
        '.overview',
        '.features',
        '.product-summary',
        '[data-testid="description"]',
        '.product-description-text'
      ];
      
      let description = '';
      for (const selector of descriptionSelectors) {
        const desc = $(selector).first().text().trim();
        if (desc && desc.length > 20) {
          description = cleanText(desc).substring(0, 500); // Limit description length
          break;
        }
      }
      
      // If no description found, try to get meta description
      if (!description) {
        const metaDesc = $('meta[name="description"]').attr('content');
        if (metaDesc) {
          description = cleanText(metaDesc);
        }
      }

      // Extract rating
      const ratingSelectors = [
        '.rating-value',
        '.average-rating',
        '[data-pl="rating"]',
        '.a-icon-alt',
        '.stars',
        '.rating',
        '.review-rating',
        '.star-rating',
        '[data-testid="rating"]',
        '.score'
      ];
      
      let rating = null;
      for (const selector of ratingSelectors) {
        const ratingText = $(selector).first().text().trim();
        if (ratingText) {
          const ratingMatch = ratingText.match(/([0-9.]+)/);
          if (ratingMatch) {
            const ratingValue = parseFloat(ratingMatch[1]);
            if (ratingValue >= 0 && ratingValue <= 5) {
              rating = ratingValue;
              break;
            }
          }
        }
      }
      
      // Debug logging to see what we extracted
      console.log('Extraction Debug:', {
        url: url,
        title: title.substring(0, 50),
        price: price,
        imageCount: images.length,
        descriptionLength: description.length,
        rating: rating
      });

      // If we couldn't extract basic info, try alternative methods
      if (title === 'Product title not found') {
        // Try page title as fallback
        const pageTitle = $('title').text().trim();
        if (pageTitle && pageTitle.length > 5) {
          title = cleanText(pageTitle.split('|')[0].split('-')[0]);
        }
        
        // If still no title, try meta property
        if (title === 'Product title not found') {
          const metaTitle = $('meta[property="og:title"]').attr('content') || 
                           $('meta[name="title"]').attr('content');
          if (metaTitle) {
            title = cleanText(metaTitle);
          }
        }
        
        // Last resort: extract domain and create generic title
        if (title === 'Product title not found') {
          const domain = new URL(url).hostname.replace('www.', '');
          const platformName = domain.includes('aliexpress') ? 'AliExpress' : 
                              domain.includes('amazon') ? 'Amazon' : 
                              domain.includes('ebay') ? 'eBay' : 
                              'E-commerce';
          title = `${platformName} Product`;
        }
      }
      
      // If no images found, try to get any reasonable images
      if (images.length === 0) {
        $('img').each((_, img) => {
          const src = $(img).attr('src') || $(img).attr('data-src');
          if (src && src.length > 20 && !src.includes('data:image')) {
            let imageUrl = src;
            if (src.startsWith('//')) {
              imageUrl = `https:${src}`;
            } else if (src.startsWith('/')) {
              const baseUrl = new URL(url).origin;
              imageUrl = `${baseUrl}${src}`;
            }
            if (!images.includes(imageUrl) && images.length < 5) {
              images.push(imageUrl);
            }
          }
        });
      }

      // Create the product object
      const transformedProduct = {
        title: title,
        price: price,
        originalPrice: price, // For now, same as current price
        currency: 'USD', // Default currency
        images: images.slice(0, 10), // Limit to first 10 images
        description: description || 'Description not available',
        specifications: {}, // Would need more complex parsing
        rating: rating,
        reviewCount: null, // Would need additional parsing
        availability: 'Available', // Default assumption
        seller: {
          name: 'E-commerce Seller',
          rating: null,
          url: null
        },
        shipping: {
          cost: null,
          time: null,
          methods: []
        },
        url: url,
        extractedAt: new Date().toISOString(),
        source: 'basic-scraper',
        note: 'Basic extraction - some data may be limited due to anti-bot measures'
      };

      return NextResponse.json({
        success: true,
        product: transformedProduct
      });

    } catch (scrapeError: any) {
      console.error('Basic scraping failed:', scrapeError);
      
      // Extract domain for better fallback naming
      const domain = new URL(url).hostname.replace('www.', '');
      const platformName = domain.includes('aliexpress') ? 'AliExpress' : 
                          domain.includes('amazon') ? 'Amazon' : 
                          domain.includes('ebay') ? 'eBay' : 
                          'E-commerce';
      
      // Return a fallback response with minimal data
      const fallbackProduct = {
        title: `${platformName} Product`,
        price: 'Price not available',
        originalPrice: 'Price not available',
        currency: 'USD',
        images: [],
        description: `Product from ${platformName}. Description not available due to extraction limitations. This may be due to the site using dynamic content loading or anti-bot protection.`,
        specifications: {},
        rating: null,
        reviewCount: null,
        availability: 'Unknown',
        seller: {
          name: `${platformName} Seller`,
          rating: null,
          url: null
        },
        shipping: {
          cost: null,
          time: null,
          methods: []
        },
        url: url,
        extractedAt: new Date().toISOString(),
        source: 'fallback',
        note: `Limited data available - ${platformName} may be using dynamic content loading or blocking automated access. Consider using official APIs for better data extraction.`
      };

      return NextResponse.json({
        success: true,
        product: fallbackProduct,
        warning: 'Limited data extracted due to access restrictions or dynamic content loading'
      });
    }

  } catch (error: any) {
    console.error('AliExpress extraction error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to extract product data',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check API status
export async function GET() {
  return NextResponse.json({
    service: 'Universal E-commerce Product Extraction (Basic Scraper)',
    status: 'Ready',
    supportedPlatforms: ['AliExpress', 'Amazon', 'eBay', 'Shopify', 'WooCommerce', 'Other E-commerce'],
    features: [
      'Basic product data extraction',
      'Product title and price',
      'Product images',
      'Basic product information',
      'Fallback support'
    ],
    limitations: [
      'May be limited by anti-bot measures',
      'Basic data extraction only',
      'Some fields may not be available'
    ],
    setup: 'No additional configuration required'
  });
}