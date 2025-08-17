import { GeneratedStore } from '../ai/store-generator';

export interface ShopifyCredentials {
  shopDomain: string;
  accessToken: string;
}

export interface DeploymentResult {
  success: boolean;
  storeUrl?: string;
  productId?: string;
  error?: string;
  details?: Record<string, unknown>;
}

export class ShopifyDeployer {
  private credentials: ShopifyCredentials;

  constructor(credentials: ShopifyCredentials) {
    this.credentials = credentials;
  }

  async deployStore(generatedStore: GeneratedStore): Promise<DeploymentResult> {
    try {
      console.log('🚀 Starting Shopify deployment...');
      
      // Step 1: Create the product
      const productResult = await this.createProduct(generatedStore);
      if (!productResult.success) {
        return productResult;
      }

      // Step 2: Update store settings
      await this.updateStoreSettings(generatedStore);

      // Step 3: Create pages
      await this.createPages(generatedStore);

      // Step 4: Set up email templates (if supported)
      await this.setupEmailTemplates();

      console.log('✅ Shopify deployment completed successfully!');
      
      return {
        success: true,
        storeUrl: `https://${this.credentials.shopDomain}`,
        productId: productResult.productId,
        details: {
          product: productResult.productId,
          pages: ['about', 'faq', 'shipping', 'returns'],
          emails: generatedStore.storeContent.emailSequences.length
        }
      };
    } catch (error) {
      console.error('Shopify deployment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown deployment error'
      };
    }
  }

  private async createProduct(generatedStore: GeneratedStore): Promise<DeploymentResult & { productId?: string }> {
    const { productData, storeContent, marketResearch } = generatedStore;
    
    const productPayload = {
      product: {
        title: productData.name,
        body_html: this.formatProductDescription(storeContent.productDescription),
        vendor: productData.vendor || 'StoreForge',
        product_type: productData.category,
        status: 'active',
        published: true,
        tags: marketResearch.keySellingPoints.join(', '),
        variants: [
          {
            price: marketResearch.recommendedPrice.toString(),
            compare_at_price: (marketResearch.recommendedPrice * 1.3).toString(),
            inventory_management: 'shopify',
            inventory_quantity: 100,
            requires_shipping: true,
            taxable: true,
            weight: 1,
            weight_unit: 'lb'
          }
        ],
        images: generatedStore.generatedImages.map(url => ({ src: url })),
        options: [
          {
            name: 'Title',
            values: ['Default Title']
          }
        ],
        seo: {
          title: `${productData.name} - ${marketResearch.keySellingPoints[0]}`,
          description: productData.description.substring(0, 160)
        }
      }
    };

    try {
      const response = await this.makeShopifyRequest('POST', '/admin/api/2023-10/products.json', productPayload);
      
      if (response.product && typeof response.product === 'object' && 'id' in response.product && response.product.id) {
        return {
          success: true,
          productId: response.product.id.toString()
        };
      } else {
        return {
          success: false,
          error: 'Failed to create product'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Product creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async updateStoreSettings(generatedStore: GeneratedStore): Promise<void> {
    
    // Update shop settings
    const shopPayload = {
      shop: {
        name: `${generatedStore.productData.name} Store`,
        customer_email: 'support@storeforge.ai',
        checkout_api_supported: true,
        multi_location_enabled: true,
        setup_required: false
      }
    };

    try {
      await this.makeShopifyRequest('PUT', '/admin/api/2023-10/shop.json', shopPayload);
    } catch (error) {
      console.warn('Could not update shop settings:', error);
    }
  }

  private async createPages(generatedStore: GeneratedStore): Promise<void> {
    const { storeContent } = generatedStore;
    
    const pages = [
      {
        title: 'About Us',
        body_html: this.formatContent(storeContent.aboutUs),
        handle: 'about-us',
        published: true
      },
      {
        title: 'FAQ',
        body_html: this.formatContent(storeContent.faq),
        handle: 'faq',
        published: true
      },
      {
        title: 'Shipping Policy',
        body_html: this.formatContent(storeContent.shippingPolicy),
        handle: 'shipping-policy',
        published: true
      },
      {
        title: 'Return Policy',
        body_html: this.formatContent(storeContent.returnPolicy),
        handle: 'return-policy',
        published: true
      }
    ];

    for (const pageData of pages) {
      try {
        await this.makeShopifyRequest('POST', '/admin/api/2023-10/pages.json', { page: pageData });
      } catch (error) {
        console.warn(`Could not create page ${pageData.title}:`, error);
      }
    }
  }

  private async setupEmailTemplates(): Promise<void> {
    // Note: Shopify email templates require theme customization
    // This is a placeholder for future implementation
    console.log('📧 Email templates prepared for manual setup');
  }

  private async makeShopifyRequest(method: string, endpoint: string, data?: Record<string, unknown>): Promise<Record<string, unknown>> {
    const url = `https://${this.credentials.shopDomain}${endpoint}`;
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': this.credentials.accessToken
      },
      body: data ? JSON.stringify(data) : undefined
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Shopify API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  private formatProductDescription(description: string): string {
    // Convert plain text to HTML with basic formatting
    return description
      .split('\n\n')
      .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
      .join('\n');
  }

  private formatContent(content: string): string {
    // Convert plain text to HTML with basic formatting
    return content
      .split('\n\n')
      .map(paragraph => {
        if (paragraph.startsWith('Q:')) {
          // Format FAQ items
          const [question, ...answerParts] = paragraph.split('A:');
          const answer = answerParts.join('A:');
          return `<h3>${question.replace('Q:', '').trim()}</h3><p>${answer.trim()}</p>`;
        }
        return `<p>${paragraph.replace(/\n/g, '<br>')}</p>`;
      })
      .join('\n');
  }

  // Utility method to test connection
  async testConnection(): Promise<boolean> {
    try {
      await this.makeShopifyRequest('GET', '/admin/api/2023-10/shop.json');
      return true;
    } catch (error) {
      console.error('Shopify connection test failed:', error);
      return false;
    }
  }
}