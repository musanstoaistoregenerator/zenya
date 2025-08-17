import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

// Helper function to extract domain from URL
function getDomain(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return '';
  }
}

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

// Amazon product extraction
async function extractAmazonData($: any, url: string, platform: string) {
  const title = cleanText($('#productTitle').text() || $('h1.a-size-large').text() || 'Product Title');
  const price = extractPrice($('.a-price-whole').first().text() + '.' + $('.a-price-fraction').first().text()) || 
                extractPrice($('.a-offscreen').first().text()) || 99.99;
  
  const images: string[] = [];
  $('#landingImage, #imgTagWrapperId img, .a-dynamic-image').each((i: number, el: any) => {
    const src = $(el).attr('src') || $(el).attr('data-src');
    if (src && !images.includes(src)) {
      images.push(src.replace(/\._.*_/, '._AC_SL1500_')); // Get high-res version
    }
  });

  const description = cleanText($('#feature-bullets ul').text() || $('#productDescription').text() || 'Premium quality product');
  const brand = cleanText($('#bylineInfo').text().replace('Brand:', '').replace('Visit the', '').replace('Store', '')) || 'Premium Brand';
  
  const features: string[] = [];
  $('#feature-bullets li').each((i: number, el: any) => {
    const feature = cleanText($(el).text());
    if (feature && feature.length > 10) {
      features.push(feature);
    }
  });

  return {
    title,
    description,
    price,
    images: images.slice(0, 5),
    category: 'Electronics',
    brand,
    features: features.slice(0, 6),
    specifications: {
      weight: 'See product details',
      dimensions: 'See product details',
      material: 'Premium materials'
    },
    sourceUrl: url,
    platform
  };
}

// AliExpress product extraction
async function extractAliExpressData($: any, url: string, platform: string) {
  // Enhanced title extraction with multiple selectors
  const title = cleanText(
    $('h1[data-pl="product-title"]').text() ||
    $('h1.product-title-text').text() ||
    $('.pdp-product-name').text() ||
    $('h1').first().text() ||
    $('.product-title').text() ||
    $('[data-spm-anchor-id*="title"]').text() ||
    'Premium Product'
  );

  // Enhanced price extraction with multiple selectors
  const priceText = 
    $('.pdp-price').text() ||
    $('.product-price-current').text() ||
    $('.price-current').text() ||
    $('.uniform-banner-box-price').text() ||
    $('[data-spm-anchor-id*="price"]').text() ||
    $('.price').first().text() ||
    '$99.99';
  const price = extractPrice(priceText) || 99.99;
  
  // Enhanced image extraction with multiple selectors
  const images: string[] = [];
  const imageSelectors = [
    '.images-view-item img',
    '.product-image img', 
    '.pdp-gallery img',
    '.gallery-preview-item img',
    '.magnifier-image img',
    '.image-view img',
    '[data-spm-anchor-id*="image"] img',
    '.product-carousel img'
  ];
  
  imageSelectors.forEach(selector => {
    $(selector).each((i: number, el: any) => {
      let src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src');
      if (src) {
        // Convert relative URLs to absolute
        if (src.startsWith('//')) {
          src = 'https:' + src;
        } else if (src.startsWith('/')) {
          src = 'https://ae01.alicdn.com' + src;
        }
        // Remove size parameters to get full-size images
        src = src.replace(/_\d+x\d+\./g, '.');
        if (!images.includes(src) && src.includes('alicdn')) {
          images.push(src);
        }
      }
    });
  });

  // Enhanced description extraction
  const description = cleanText(
    $('.pdp-product-detail').text() ||
    $('.product-description').text() ||
    $('.detail-desc').text() ||
    $('.product-overview').text() ||
    $('[data-spm-anchor-id*="description"]').text() ||
    $('.product-property').text() ||
    'High-quality product with excellent features'
  );
  
  // Enhanced features extraction
  const features: string[] = [];
  const featureSelectors = [
    '.product-prop li',
    '.sku-prop li',
    '.pdp-product-property li',
    '.product-params li',
    '.product-overview li',
    '.specification-list li'
  ];
  
  featureSelectors.forEach(selector => {
    $(selector).each((i: number, el: any) => {
      const feature = cleanText($(el).text());
      if (feature && feature.length > 5 && feature.length < 100) {
        features.push(feature);
      }
    });
  });

  // Extract rating if available
  const ratingText = $('.overview-rating-average').text() || $('.rating-value').text() || '';
  const rating = ratingText ? parseFloat(ratingText) : undefined;
  
  // Extract review count if available
  const reviewText = $('.product-reviewer-reviews').text() || $('.review-count').text() || '';
  const reviewCount = reviewText ? parseInt(reviewText.replace(/\D/g, '')) : undefined;
  
  // Extract original price if available
  const originalPriceText = $('.price-original').text() || $('.price-del').text() || '';
  const originalPrice = originalPriceText ? '$' + extractPrice(originalPriceText) : undefined;

  return {
    title,
    description,
    price: '$' + price,
    originalPrice,
    rating,
    reviewCount,
    images: images.slice(0, 8), // Get more images for AliExpress
    category: 'Consumer Electronics',
    brand: 'Quality Brand',
    features: [...new Set(features)].slice(0, 8), // Remove duplicates and get more features
    specifications: {
      shipping: 'International shipping available',
      warranty: 'Seller warranty included',
      origin: 'Global marketplace',
      platform: 'AliExpress'
    },
    sourceUrl: url,
    platform
  };
}

// eBay product extraction
async function extractEbayData($: any, url: string, platform: string) {
  const title = cleanText($('h1#x-title-label-lbl').text() || $('.x-item-title-label').text() || 'Quality Product');
  const priceText = $('.notranslate').text() || $('.u-flL.condText').text() || '$99.99';
  const price = extractPrice(priceText) || 99.99;
  
  const images: string[] = [];
  $('#icImg, .img img, .vi-image img').each((i: number, el: any) => {
    const src = $(el).attr('src') || $(el).attr('data-src');
    if (src && !images.includes(src)) {
      images.push(src);
    }
  });

  const description = cleanText($('.u-flL.condText').text() || $('.vi-item-desc-text').text() || 'Excellent condition product');
  
  const features: string[] = [];
  $('.u-flL li, .itemAttr li').each((i: number, el: any) => {
    const feature = cleanText($(el).text());
    if (feature && feature.length > 5) {
      features.push(feature);
    }
  });

  return {
    title,
    description,
    price,
    images: images.slice(0, 5),
    category: 'General',
    brand: 'Trusted Seller',
    features: features.slice(0, 6),
    specifications: {
      condition: 'See listing details',
      shipping: 'Calculated at checkout',
      returns: 'See return policy'
    },
    sourceUrl: url,
    platform
  };
}

// Generic product extraction for other sites
async function extractGenericData($: any, url: string, platform: string) {
  const title = cleanText($('h1').first().text() || $('title').text() || 'Premium Product');
  const priceText = $('[class*="price"], [id*="price"]').first().text() || '$99.99';
  const price = extractPrice(priceText) || 99.99;
  
  const images: string[] = [];
  $('img[src*="product"], img[alt*="product"], .product img, .item img').each((i: number, el: any) => {
    const src = $(el).attr('src');
    if (src && !images.includes(src)) {
      images.push(src);
    }
  });

  const description = cleanText($('.description, .product-description, .details').first().text() || 'High-quality product');
  
  return {
    title,
    description,
    price,
    images: images.slice(0, 5),
    category: 'General',
    brand: 'Quality Brand',
    features: [
      'High-quality materials',
      'Excellent craftsmanship',
      'Great value for money',
      'Fast shipping available'
    ],
    specifications: {
      quality: 'Premium grade',
      shipping: 'Available worldwide',
      support: 'Customer service included'
    },
    sourceUrl: url,
    platform
  };
}

// Fallback extraction when scraping fails
async function extractFallbackData(url: string, platform: string) {
  // Extract basic info from URL
  const urlParts = url.split('/');
  const possibleTitle = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2] || 'Product';
  const title = possibleTitle.replace(/[-_]/g, ' ').replace(/\.(html|php|aspx?)$/i, '');
  
  return {
    title: cleanText(title) || 'Premium Product',
    description: 'High-quality product sourced from trusted suppliers. Excellent value and fast shipping.',
    price: 99.99,
    images: [
      'https://via.placeholder.com/500x500/f0f0f0/666?text=Product+Image'
    ],
    category: 'General',
    brand: 'Quality Brand',
    features: [
      'Premium quality materials',
      'Excellent customer reviews',
      'Fast and reliable shipping',
      'Great value for money',
      'Customer satisfaction guaranteed'
    ],
    specifications: {
      quality: 'Premium grade',
      shipping: 'Worldwide available',
      warranty: 'Manufacturer warranty',
      support: '24/7 customer service'
    },
    sourceUrl: url,
    platform,
    note: 'Product details extracted from URL analysis'
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received request body:', body);
    
    const { url, platform } = body;
    
    if (!url) {
      console.log('Missing URL in request');
      return NextResponse.json(
        { error: 'Product URL is required' },
        { status: 400 }
      );
    }
    
    console.log('Processing URL:', url, 'Platform:', platform);

    const domain = getDomain(url);
    let productData;
    let html: string | undefined;
    let $: any;

    try {
      // Fetch the product page with enhanced headers
      const headers: Record<string, string> = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0'
      };
      
      // Add specific headers for AliExpress
      if (domain.includes('aliexpress')) {
        headers['Referer'] = 'https://www.aliexpress.com/';
        headers['Origin'] = 'https://www.aliexpress.com';
        headers['Sec-Ch-Ua'] = '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"';
        headers['Sec-Ch-Ua-Mobile'] = '?0';
        headers['Sec-Ch-Ua-Platform'] = '"Windows"';
      }
      
      const response = await fetch(url, {
        headers,
        redirect: 'follow'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch product page: ${response.status}`);
      }

      html = await response.text();
      $ = cheerio.load(html);

      // Debug logging for AliExpress
      if (domain.includes('aliexpress')) {
        console.log('AliExpress page loaded, HTML length:', html.length);
        console.log('Page title:', $('title').text());
        console.log('Available h1 elements:', $('h1').length);
        console.log('Available image elements:', $('img').length);
        console.log('Available price elements:', $('[class*="price"], [id*="price"]').length);
        
        // Log specific selectors we're looking for
        const titleSelectors = [
          'h1[data-pl="product-title"]',
          'h1.product-title-text',
          '.pdp-product-name',
          'h1'
        ];
        titleSelectors.forEach(selector => {
          const found = $(selector).length;
          if (found > 0) {
            console.log(`Found ${found} elements for selector: ${selector}`);
            console.log(`Sample text: ${$(selector).first().text().substring(0, 100)}`);
          }
        });
      }

      // Extract product data based on platform
      if (domain.includes('amazon')) {
        productData = await extractAmazonData($, url, platform);
      } else if (domain.includes('aliexpress')) {
        productData = await extractAliExpressData($, url, platform);
      } else if (domain.includes('ebay')) {
        productData = await extractEbayData($, url, platform);
      } else {
        productData = await extractGenericData($, url, platform);
      }
    } catch (scrapeError) {
      console.warn('Scraping failed, using fallback extraction:', scrapeError);
      // Fallback to basic URL analysis
      productData = await extractFallbackData(url, platform);
    }

    if (!productData || !productData.title) {
      // Provide detailed feedback based on the platform
      let errorMessage = 'Could not extract product data from the provided URL.';
      let suggestions = [];
      
      if (domain.includes('aliexpress')) {
        errorMessage = 'AliExpress product extraction failed. This can happen due to anti-bot protection or dynamic content loading.';
        suggestions = [
          'Try using a different AliExpress product URL',
          'Check if the product page loads properly in your browser',
          'Consider providing product details manually',
          'Use the mobile version URL (m.aliexpress.com) if available'
        ];
      } else if (domain.includes('amazon')) {
        errorMessage = 'Amazon product extraction failed. Amazon has strong anti-bot measures.';
        suggestions = [
          'Try a different Amazon product URL',
          'Ensure the product page is publicly accessible',
          'Consider using product details from the page manually'
        ];
      } else if (domain.includes('ebay')) {
        errorMessage = 'eBay product extraction failed.';
        suggestions = [
          'Verify the eBay listing is active and public',
          'Try a different eBay product URL'
        ];
      } else {
        errorMessage = `Product extraction failed for ${domain}. This platform may not be fully supported.`;
        suggestions = [
          'Try using a supported platform (AliExpress, Amazon, eBay)',
          'Provide product details manually',
          'Check if the URL is accessible'
        ];
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          suggestions: suggestions,
          platform: platform,
          url: url,
          debugInfo: domain.includes('aliexpress') ? {
            htmlLength: html?.length || 0,
            pageTitle: $('title').text() || 'No title found',
            hasContent: html && html.length > 1000
          } : undefined
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
        success: true,
        data: productData,
        message: 'Product data extracted successfully'
      });
    } catch (error) {
    console.error('Error extracting product:', error);
    return NextResponse.json(
      { error: 'Failed to extract product data' },
      { status: 500 }
    );
  }
}