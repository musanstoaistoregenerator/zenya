// OpenAI API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

// Direct OpenAI API call function
async function callOpenAI(prompt: string, temperature: number = 0.3): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: temperature
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  
  if (!content) {
    throw new Error('No response content from OpenAI');
  }

  return content;
}

export interface ProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  url: string;
  vendor?: string;
  debug?: any;
}

export interface MarketResearch {
  competitionLevel: number; // 1-10
  marketSize: 'Small' | 'Medium' | 'Large' | 'Huge';
  recommendedPrice: number;
  targetAudience: string;
  keySellingPoints: string[];
  marketingAngles: string[];
  successScore: number; // 1-100
  insights: string;
}

export interface EmailSequence {
  name: string;
  emails: Array<{
    subject: string;
    content: string;
    delay: number; // hours
  }>;
}

export interface StoreContent {
  homepage: string;
  productDescription: string;
  aboutUs: string;
  faq: string;
  shippingPolicy: string;
  returnPolicy: string;
  emailSequences: EmailSequence[];
}

export interface GeneratedStore {
  productData: ProductData;
  storeContent: StoreContent;
  marketResearch: MarketResearch;
  generatedImages: string[];
}

export class StoreGenerator {
  async generateFromUrl(productUrl: string): Promise<GeneratedStore> {
    try {
      console.log('🔍 Extracting product data from URL...');
      const productData = await this.extractProductData(productUrl);
      
      console.log('📊 Generating market research...');
      const marketResearch = await this.generateMarketResearch(productData);
      
      console.log('✍️ Creating store content...');
      const storeContent = await this.generateStoreContent(productData, marketResearch);
      
      console.log('🎨 Generating product images...');
      const generatedImages = await this.generateProductImages(productData);
      
      return {
        productData,
        storeContent,
        marketResearch,
        generatedImages
      };
    } catch (error) {
      console.error('Error generating store:', error);
      throw new Error('Failed to generate store. Please try again.');
    }
  }

  private async extractProductData(url: string): Promise<ProductData> {
    // Enhanced URL analysis for different e-commerce platforms
    const platformInfo = this.analyzePlatform(url);
    
    const prompt = `
    Extract detailed product information from this ${platformInfo.platform} URL: ${url}
    
    Platform: ${platformInfo.platform}
    URL Analysis: ${platformInfo.analysis}
    
    For AliExpress URLs, focus on:
    - Product titles often contain multiple keywords
    - Prices are typically wholesale/bulk pricing
    - Categories are usually very specific
    - Descriptions should highlight dropshipping potential
    
    For Amazon URLs, focus on:
    - ASIN codes and product variations
    - Brand information and seller details
    - Customer review insights
    - Competitive pricing analysis
    
    For other e-commerce URLs, analyze:
    - Domain authority and brand recognition
    - Product URL structure and parameters
    - Likely product categories and pricing tiers
    
    Return ONLY a valid JSON object with this exact structure:
    {
      "name": "Optimized product name for dropshipping (remove brand conflicts)",
      "description": "Compelling product description emphasizing benefits and unique selling points (3-4 sentences)",
      "price": realistic_retail_price_number,
      "category": "Specific product category (e.g., Electronics > Phone Accessories, Fashion > Women's Jewelry)",
      "images": ["placeholder_image_url_1", "placeholder_image_url_2"],
      "url": "${url}",
      "vendor": "Generic brand name or 'Premium Brand' (avoid trademark issues)"
    }
    
    Price Guidelines:
    - AliExpress: Multiply by 2-4x for retail markup
    - Amazon: Use competitive retail pricing
    - Other platforms: Research-based pricing
    
    Make the product appealing for dropshipping with proper markup and positioning.
    `;

    const content = await callOpenAI(prompt, 0.3);

    try {
      const productData = JSON.parse(content);
      // Additional validation and enhancement
      return this.enhanceProductData(productData, platformInfo);
    } catch {
      console.warn('JSON parsing failed, using enhanced fallback');
      return this.createFallbackProductData(url, platformInfo);
    }
  }

  private analyzePlatform(url: string): { platform: string; analysis: string } {
    const domain = new URL(url).hostname.toLowerCase();
    
    if (domain.includes('aliexpress')) {
      return {
        platform: 'AliExpress',
        analysis: 'Wholesale marketplace - expect bulk pricing, international shipping, and supplier-focused listings'
      };
    } else if (domain.includes('amazon')) {
      return {
        platform: 'Amazon',
        analysis: 'Retail marketplace - established pricing, customer reviews, and brand presence'
      };
    } else if (domain.includes('ebay')) {
      return {
        platform: 'eBay',
        analysis: 'Auction/retail hybrid - varied pricing, both new and used items'
      };
    } else if (domain.includes('shopify') || domain.includes('woocommerce')) {
      return {
        platform: 'Independent Store',
        analysis: 'Direct-to-consumer store - brand-focused, premium positioning'
      };
    } else {
      return {
        platform: 'E-commerce Store',
        analysis: 'General e-commerce platform - analyze for product positioning and pricing strategy'
      };
    }
  }

  private enhanceProductData(productData: ProductData, platformInfo: { platform: string; analysis: string }): ProductData {
    // Apply platform-specific enhancements
    if (platformInfo.platform === 'AliExpress') {
      // Ensure proper markup for dropshipping
      productData.price = Math.max(productData.price * 2.5, 9.99);
      // Clean up product name for retail appeal
      productData.name = productData.name.replace(/\b(wholesale|bulk|lot|pcs|pieces)\b/gi, '').trim();
    }
    
    // Ensure minimum viable pricing
    productData.price = Math.max(productData.price, 5.99);
    
    return productData;
  }

  private createFallbackProductData(url: string, platformInfo: { platform: string; analysis: string }): ProductData {
    const basePrice = platformInfo.platform === 'AliExpress' ? 19.99 : 29.99;
    
    return {
      name: "Premium Quality Product",
      description: "High-quality product designed for modern consumers. Features excellent craftsmanship, durable materials, and outstanding performance. Perfect for those seeking value and reliability.",
      price: basePrice,
      category: "General > Premium Products",
      images: ["https://via.placeholder.com/400x400", "https://via.placeholder.com/400x400"],
      url: url,
      vendor: "Premium Brand"
    };
  }

  private async generateMarketResearch(productData: ProductData): Promise<MarketResearch> {
    const prompt = `
    Conduct comprehensive market research for this product:
    
    Product: ${productData.name}
    Category: ${productData.category}
    Current Price: $${productData.price}
    Description: ${productData.description}
    
    Analyze and return ONLY a valid JSON object:
    {
      "competitionLevel": number_1_to_10,
      "marketSize": "Small|Medium|Large|Huge",
      "recommendedPrice": optimal_price_number,
      "targetAudience": "Primary demographic and psychographics",
      "keySellingPoints": ["benefit 1", "benefit 2", "benefit 3"],
      "marketingAngles": ["angle 1", "angle 2", "angle 3"],
      "successScore": number_1_to_100,
      "insights": "2-3 sentence summary of market opportunity and strategy"
    }
    
    Base analysis on:
    - Market demand and trends
    - Competition saturation
    - Profit margin potential
    - Marketing difficulty
    - Seasonal factors
    - Target audience size
    `;

    const content = await callOpenRouter(prompt, 0.3);

    try {
      return JSON.parse(content);
    } catch {
      // Fallback market research
      return {
        competitionLevel: 5,
        marketSize: 'Medium' as const,
        recommendedPrice: productData.price * 1.2,
        targetAudience: "General consumers interested in quality products",
        keySellingPoints: ["High Quality", "Great Value", "Fast Shipping"],
        marketingAngles: ["Problem-Solution", "Lifestyle Enhancement", "Limited Time Offer"],
        successScore: 75,
        insights: "Moderate competition with good profit potential. Focus on unique value proposition and targeted marketing."
      };
    }
  }

  private async generateStoreContent(productData: ProductData, marketResearch: MarketResearch): Promise<StoreContent> {
    const prompt = `
    Create high-converting e-commerce store content for:
    
    Product: ${productData.name}
    Target Audience: ${marketResearch.targetAudience}
    Key Selling Points: ${marketResearch.keySellingPoints.join(', ')}
    Marketing Angles: ${marketResearch.marketingAngles.join(', ')}
    Success Score: ${marketResearch.successScore}/100
    
    Generate content using direct-response copywriting principles. Return ONLY valid JSON:
    {
      "homepage": "Compelling homepage copy with headline, benefits, social proof, and strong CTA",
      "productDescription": "Detailed product description focusing on benefits and transformation",
      "aboutUs": "Trust-building brand story that connects with customers",
      "faq": "5-7 common questions and detailed answers addressing objections",
      "shippingPolicy": "Clear, customer-friendly shipping policy",
      "returnPolicy": "Generous return policy that builds confidence",
      "emailSequences": [
        {
          "name": "Welcome Series",
          "emails": [
            {
              "subject": "Welcome! Here's your exclusive 15% discount 🎁",
              "content": "Welcome email with discount and brand introduction",
              "delay": 0
            },
            {
              "subject": "The story behind ${productData.name}",
              "content": "Brand story and product development narrative",
              "delay": 24
            },
            {
              "subject": "How ${productData.name} transforms your [benefit]",
              "content": "Benefit-focused email with customer testimonials",
              "delay": 72
            }
          ]
        },
        {
          "name": "Abandoned Cart",
          "emails": [
            {
              "subject": "Forgot something? Your ${productData.name} is waiting...",
              "content": "Gentle reminder with product benefits",
              "delay": 1
            },
            {
              "subject": "Still thinking? Here's 10% off your ${productData.name}",
              "content": "Discount incentive with urgency",
              "delay": 24
            }
          ]
        }
      ]
    }
    
    Focus on:
    - Emotional benefits over features
    - Social proof and testimonials
    - Urgency and scarcity
    - Clear value propositions
    - Addressing common objections
    `;

    const content = await callOpenAI(prompt, 0.7);

    try {
      return JSON.parse(content);
    } catch {
      // Fallback store content
      return {
        homepage: `Transform Your Life with ${productData.name}! Get yours today with FREE shipping and 30-day money-back guarantee. Join thousands of satisfied customers!`,
        productDescription: `${productData.description} This premium product delivers exceptional value and results you can see immediately.`,
        aboutUs: "We're passionate about bringing you the highest quality products that make a real difference in your life. Our mission is your satisfaction.",
        faq: "Q: How long does shipping take? A: 3-7 business days with free tracking. Q: What's your return policy? A: 30-day money-back guarantee.",
        shippingPolicy: "Free shipping on all orders. 3-7 business days delivery with tracking included.",
        returnPolicy: "30-day money-back guarantee. Return for any reason within 30 days for a full refund.",
        emailSequences: [
          {
            name: "Welcome Series",
            emails: [
              {
                subject: `Welcome! Here's your exclusive 15% discount 🎁`,
                content: `Welcome to our community! Use code WELCOME15 for 15% off your first order of ${productData.name}.`,
                delay: 0
              }
            ]
          }
        ]
      };
    }
  }

  private async generateProductImages(productData: ProductData): Promise<string[]> {
    // For MVP, return placeholder images
    // In production, integrate with Replicate or similar service
    return [
      `https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=${encodeURIComponent(productData.name)}`,
      `https://via.placeholder.com/400x400/7C3AED/FFFFFF?text=Lifestyle`,
      `https://via.placeholder.com/400x400/059669/FFFFFF?text=Detail`,
      `https://via.placeholder.com/400x400/DC2626/FFFFFF?text=In+Use`
    ];
  }
}