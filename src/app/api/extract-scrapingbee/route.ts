import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

// ScrapingBee API configuration
const SCRAPINGBEE_API_KEY = process.env.SCRAPINGBEE_API_KEY;
const SCRAPINGBEE_BASE_URL = 'https://app.scrapingbee.com/api/v1/';

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

// Helper function to extract meta tags
function extractMetaTags($: cheerio.Root) {
  const metaData: any = {};
  
  // Extract Open Graph and Twitter meta tags
  $('meta[property^="og:"], meta[name^="twitter:"]').each((_, meta) => {
    const property = $(meta).attr('property') || $(meta).attr('name');
    const content = $(meta).attr('content');
    if (property && content) {
      metaData[property] = content;
    }
  });
  
  return metaData;
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

    // Check if ScrapingBee API key is configured
    if (!SCRAPINGBEE_API_KEY) {
      return NextResponse.json(
        { error: 'ScrapingBee API key not configured' },
        { status: 500 }
      );
    }

    try {
      // Use ScrapingBee API to fetch the page
      const scrapingBeeUrl = new URL(SCRAPINGBEE_BASE_URL);
      scrapingBeeUrl.searchParams.append('api_key', SCRAPINGBEE_API_KEY);
      scrapingBeeUrl.searchParams.append('url', url);
      scrapingBeeUrl.searchParams.append('render_js', 'true'); // Enable JavaScript rendering
      scrapingBeeUrl.searchParams.append('premium_proxy', 'true'); // Use premium proxies
      scrapingBeeUrl.searchParams.append('country_code', 'us'); // Use US proxies
      scrapingBeeUrl.searchParams.append('wait', '3000'); // Wait 3 seconds for page to load
      scrapingBeeUrl.searchParams.append('wait_for', '.product-title, h1, [data-testid="title"]'); // Wait for product title to appear

      const response = await fetch(scrapingBeeUrl.toString());

      if (!response.ok) {
        throw new Error(`ScrapingBee API error! status: ${response.status}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Extract meta tags for fallback data
      const metaData = extractMetaTags($);

      // Enhanced product title extraction with AliExpress-specific selectors
      const titleSelectors = [
        // AliExpress specific selectors (prioritized)
        '.product-title-text',
        '.pdp-product-name',
        '[data-pl="product-title"]',
        '.product-name',
        '.title-wrap h1',
        '.product-info .title',
        '.product-detail .title',
        '.item-title',
        // Generic selectors
        'h1',
        '.product-title',
        '.x-item-title-label',
        '#productTitle',
        '.title',
        '[data-testid="title"]',
        '[data-testid="product-title"]',
        '.product-info h1',
        '.product-details h1',
        '.main-title',
        '.product-header h1'
      ];
      
      let title = 'Product title not found';
      for (const selector of titleSelectors) {
        const titleText = $(selector).first().text().trim();
        if (titleText && titleText.length > 3) {
          title = cleanText(titleText);
          break;
        }
      }

      // Fallback to meta tags for title
      if (title === 'Product title not found') {
        title = metaData['og:title'] || metaData['twitter:title'] || $('title').text().trim() || 'Product title not found';
      }

      // Enhanced price extraction with AliExpress-specific selectors
      const priceSelectors = [
        // AliExpress specific selectors (prioritized)
        '.product-price-current',
        '[data-pl="price"]',
        '.price-current',
        '.price-sale',
        '.notranslate',
        '.price-now',
        '.current-price',
        '.product-price',
        '.price-display',
        // Generic selectors
        '.price',
        '.a-price-whole',
        '.a-price .a-offscreen',
        '.sale-price',
        '.amount',
        '[data-testid="price"]',
        '[data-testid="current-price"]',
        '.price-box .price',
        '.product-price-value',
        '.price-wrapper .price',
        '.pricing .price'
      ];
      
      let price = 'Price not found';
      for (const selector of priceSelectors) {
        const priceText = $(selector).first().text().trim();
        if (priceText && (priceText.includes('$') || priceText.includes('€') || priceText.includes('£') || /\d/.test(priceText))) {
          price = cleanText(priceText);
          break;
        }
      }

      // Enhanced image extraction
      const images: string[] = [];
      const imageSelectors = [
        'img[src*="product"]',
        'img[data-src*="product"]',
        '.product-image img',
        '.gallery img',
        '.image-gallery img',
        'img[alt*="product"]',
        '[data-testid="product-image"] img',
        '.product-photos img',
        '.product-gallery img',
        '.main-image img',
        'img'
      ];
      
      for (const selector of imageSelectors) {
        $(selector).each((_, img) => {
          const src = $(img).attr('src') || $(img).attr('data-src') || $(img).attr('data-lazy-src') || $(img).attr('data-original');
          if (src && src.length > 10) {
            // Convert relative URLs to absolute
            let imageUrl = src;
            if (src.startsWith('//')) {
              imageUrl = `https:${src}`;
            } else if (src.startsWith('/')) {
              const baseUrl = new URL(url).origin;
              imageUrl = `${baseUrl}${src}`;
            }
            
            // Enhanced filtering for product images only
            const isValidProductImage = (
              // Must not be tracking pixels or ads
              !imageUrl.includes('doubleclick.net') &&
              !imageUrl.includes('adnxs.com') &&
              !imageUrl.includes('casalemedia.com') &&
              !imageUrl.includes('setuid') &&
              !imageUrl.includes('pixel') &&
              !imageUrl.includes('tracking') &&
              // Must not be small icons or logos
              !imageUrl.includes('logo') && 
              !imageUrl.includes('icon') && 
              !imageUrl.includes('sprite') &&
              !imageUrl.includes('favicon') &&
              !imageUrl.includes('badge') &&
              // Must not be very small images (likely icons)
              !imageUrl.match(/\d+x\d+\.(png|jpg|gif|webp)/) ||
              (imageUrl.match(/(\d+)x(\d+)/) && 
               parseInt(imageUrl.match(/(\d+)x(\d+)/)?.[1] || '0') >= 200 &&
               parseInt(imageUrl.match(/(\d+)x(\d+)/)?.[2] || '0') >= 200) &&
              // Must not be duplicate
              !images.includes(imageUrl) &&
              // Reasonable limit
              images.length < 10
            );
            
            if (isValidProductImage) {
              images.push(imageUrl);
            }
          }
        });
        if (images.length >= 5) break; // Stop if we have enough images
      }

      // Fallback to meta tags for images
      if (images.length === 0) {
        const ogImage = metaData['og:image'] || metaData['twitter:image'];
        if (ogImage) {
          images.push(ogImage);
        }
      }

      // Enhanced description extraction
      const descriptionSelectors = [
        '.product-description',
        '.product-details',
        '.description',
        '[data-testid="description"]',
        '.product-info .description',
        '.product-summary',
        '.product-overview',
        '.item-description',
        '.product-content',
        '.product-text'
      ];
      
      let description = 'No description available';
      for (const selector of descriptionSelectors) {
        const descText = $(selector).first().text().trim();
        if (descText && descText.length > 20) {
          description = cleanText(descText).substring(0, 500);
          break;
        }
      }

      // Fallback to meta tags for description
      if (description === 'No description available') {
        description = metaData['og:description'] || metaData['twitter:description'] || $('meta[name="description"]').attr('content') || 'No description available';
      }

      // Extract rating
      const ratingSelectors = [
        '.rating',
        '.stars',
        '.review-rating',
        '[data-testid="rating"]',
        '.product-rating',
        '.star-rating',
        '.rating-value'
      ];
      
      let rating = 'N/A';
      for (const selector of ratingSelectors) {
        const ratingText = $(selector).first().text().trim();
        if (ratingText && /\d/.test(ratingText)) {
          rating = ratingText;
          break;
        }
      }

      // Extract brand
      const brandSelectors = [
        '.brand',
        '.product-brand',
        '[data-testid="brand"]',
        '.brand-name',
        '.manufacturer'
      ];
      
      let brand = 'Unknown';
      for (const selector of brandSelectors) {
        const brandText = $(selector).first().text().trim();
        if (brandText && brandText.length > 1) {
          brand = cleanText(brandText);
          break;
        }
      }

      const extractedData = {
        title,
        price,
        description,
        images,
        rating,
        brand,
        url,
        extractionMethod: 'ScrapingBee Enhanced',
        extractedAt: new Date().toISOString(),
        metaDataAvailable: Object.keys(metaData).length > 0,
        // Debug information
        debug: {
          htmlLength: html.length,
          h1Count: $('h1').length,
          h1Texts: $('h1').map((i, el) => $(el).text().trim().substring(0, 100)).get(),
          metaTags: {
            ogTitle: metaData['og:title'],
            twitterTitle: metaData['twitter:title'],
            pageTitle: $('title').text().trim()
          },
          foundSelectors: {
            titleSelector: titleSelectors.find(sel => $(sel).first().text().trim().length > 3) || 'none',
            priceSelector: priceSelectors.find(sel => $(sel).first().text().trim().length > 0) || 'none'
          }
        }
      };

      return NextResponse.json({
        success: true,
        data: extractedData,
        message: 'Product data extracted successfully using ScrapingBee'
      });

    } catch (error) {
      console.error('ScrapingBee extraction error:', error);
      
      return NextResponse.json({
        success: false,
        error: 'Failed to extract product data using ScrapingBee',
        details: error instanceof Error ? error.message : 'Unknown error',
        fallbackSuggestion: 'Try using manual entry or the basic extraction method'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Request processing error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}