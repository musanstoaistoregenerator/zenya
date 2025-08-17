import { NextRequest, NextResponse } from 'next/server';
import { StoreGenerator } from '@/lib/ai/store-generator';
import { ShopifyDeployer } from '@/lib/platforms/shopify-deployer';
import { getSession, checkUserLimits, incrementUserStoreCount } from '@/lib/auth/utils';
import { db } from '@/lib/supabase';
import { withRateLimit } from '@/lib/middleware/rateLimiting';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting store generation process...');

    // Step 1: Apply rate limiting
    const rateLimitResult = await withRateLimit(request, {
      maxRequests: 10, // 10 requests per hour for store generation
      windowMs: 60 * 60 * 1000 // 1 hour
    });

    if (rateLimitResult instanceof NextResponse) {
      // Rate limit exceeded, return the error response
      return rateLimitResult;
    }

    const { rateLimiter } = rateLimitResult;

    // Step 2: Parse and validate request
    const body = await request.json();
    const { productUrl, platform, credentials } = body;

    // Validate input
    if (!productUrl) {
      await rateLimiter.logRequest(request, false);
      return NextResponse.json(
        { error: 'Product URL is required' },
        { status: 400 }
      );
    }

    if (!platform) {
      await rateLimiter.logRequest(request, false);
      return NextResponse.json(
        { error: 'Platform is required (shopify or woocommerce)' },
        { status: 400 }
      );
    }

    console.log(`📝 Request details:`, {
      productUrl,
      platform,
      hasCredentials: !!credentials
    });

    // Step 3: Check authentication
    const session = await getSession();
    if (!session?.user?.email) {
      await rateLimiter.logRequest(request, false);
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user data from database
    const user = await db.getUserByEmail(session.user.email);
    if (!user) {
      await rateLimiter.logRequest(request, false);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log(`👤 User authenticated: ${user.email}`);

    // Check user limits
    const limitCheck = await checkUserLimits(user.id);
    if (!limitCheck.canCreate) {
      await rateLimiter.logRequest(request, false);
      return NextResponse.json(
        { 
          error: limitCheck.reason,
          current: limitCheck.current,
          limit: limitCheck.limit
        },
        { status: 403 }
      );
    }

    console.log(`✅ User limits check passed: ${limitCheck.current}/${limitCheck.limit}`);

    console.log(`🚀 Starting store generation for: ${productUrl}`);
    console.log(`📦 Target platform: ${platform}`);

    // Step 4: Generate store content using AI
    console.log('🤖 Initializing AI store generator...');
    const storeGenerator = new StoreGenerator();
    
    console.log('🔄 Generating store content...');
    const generatedStore = await storeGenerator.generateFromUrl(productUrl);

    console.log('✅ Store content generated successfully');

    // Step 2: Deploy to selected platform
    let deploymentResult = null;

    if (platform === 'shopify' && credentials?.shopDomain && credentials?.accessToken) {
      console.log('🛍️ Deploying to Shopify...');
      const shopifyDeployer = new ShopifyDeployer({
        shopDomain: credentials.shopDomain,
        accessToken: credentials.accessToken
      });

      deploymentResult = await shopifyDeployer.deployStore(generatedStore);
    } else if (platform === 'woocommerce') {
      // WooCommerce deployment would go here
      console.log('🛒 WooCommerce deployment not yet implemented');
      deploymentResult = {
        success: false,
        error: 'WooCommerce deployment coming soon'
      };
    } else {
      console.log('📋 No deployment credentials provided, returning generated content only');
    }

    // Step 3: Save store to database
    const storeData = {
      user_id: user.id,
      name: generatedStore.productData.name,
      product_url: productUrl,
      platform,
      domain: deploymentResult?.success ? deploymentResult.storeUrl : null,
      status: deploymentResult?.success ? 'deployed' : 'building',
      success_score: generatedStore.marketResearch.successScore,
      market_research: generatedStore.marketResearch,
      content: generatedStore.storeContent,
      images: generatedStore.generatedImages,
      platform_data: deploymentResult || null
    };

    const savedStore = await db.createStore(storeData);

    // Step 4: Update user's store count
    await incrementUserStoreCount(user.id);

    // Step 5: Return results
    const response = {
      success: true,
      storeId: savedStore?.id,
      generatedStore,
      deployment: deploymentResult,
      timestamp: new Date().toISOString(),
      platform,
      summary: {
        productName: generatedStore.productData.name,
        category: generatedStore.productData.category,
        recommendedPrice: generatedStore.marketResearch.recommendedPrice,
        successScore: generatedStore.marketResearch.successScore,
        competitionLevel: generatedStore.marketResearch.competitionLevel,
        marketSize: generatedStore.marketResearch.marketSize,
        pagesCreated: deploymentResult?.success ? 4 : 0,
        emailSequences: generatedStore.storeContent.emailSequences.length,
        imagesGenerated: generatedStore.generatedImages.length,
        storesRemaining: (limitCheck.limit || 0) - (limitCheck.current || 0) - 1
      }
    };

    console.log('🎉 Store generation completed successfully!');
    
    // Log successful request
    await rateLimiter.logRequest(request, true);
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Store generation failed:', error);
    
    // Log failed request if rateLimiter is available
    try {
      const rateLimitResult = await withRateLimit(request, {
        maxRequests: 10,
        windowMs: 60 * 60 * 1000
      });
      if (!(rateLimitResult instanceof NextResponse)) {
        await rateLimitResult.rateLimiter.logRequest(request, false);
      }
    } catch (logError) {
      console.error('Error logging failed request:', logError);
    }
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'StoreForge AI - Store Generation API',
    version: '1.0.0',
    endpoints: {
      'POST /api/generate-store': {
        description: 'Generate and deploy an AI-powered store',
        parameters: {
          productUrl: 'string (required) - URL of the product to build store around',
          platform: 'string (required) - "shopify" or "woocommerce"',
          credentials: 'object (optional) - Platform-specific credentials for deployment'
        },
        example: {
          productUrl: 'https://example.com/product',
          platform: 'shopify',
          credentials: {
            shopDomain: 'your-shop.myshopify.com',
            accessToken: 'your-access-token'
          }
        }
      }
    },
    features: [
      'AI-powered product analysis',
      'Market research and pricing optimization',
      'Complete store content generation',
      'Multi-platform deployment',
      'Email marketing sequences',
      'SEO-optimized content'
    ]
  });
}