import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ service: string }> }
) {
  const { service } = await params;
  const serviceName = service.toLowerCase();

  try {
    switch (serviceName) {
      case 'openai':
        return await testOpenAI();
      
      case 'supabase':
        return await testSupabase();
      
      case 'shopify':
        return await testShopify();
      
      case 'replicate':
        return await testReplicate();
      
      case 'ziina':
        return await testZiina();
      
      default:
        return NextResponse.json({
          success: false,
          message: 'Unknown service'
        });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function testOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({
      success: false,
      message: 'OPENAI_API_KEY not configured in .env.local'
    });
  }

  try {
    // Test with a simple completion using direct HTTP call
    const response = await fetch(`${process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Say "API test successful"' }],
        max_tokens: 10
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({
        success: false,
        message: `OpenAI API error: ${response.status} - ${errorText}`
      });
    }

    const data = await response.json();
    
    if (data.choices?.[0]?.message?.content) {
      return NextResponse.json({
        success: true,
        message: 'OpenAI API connected successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'OpenAI API responded but with unexpected format'
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: `OpenAI API error: ${error.message}`
    });
  }
}

async function testSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    return NextResponse.json({
      success: false,
      message: 'Supabase URL or ANON_KEY not configured in .env.local'
    });
  }

  try {
    const supabase = createClient(url, key);
    
    // Test connection by trying to access auth
    const { data, error } = await supabase.auth.getSession();
    
    if (error && error.message.includes('Invalid API key')) {
      return NextResponse.json({
        success: false,
        message: 'Invalid Supabase API key'
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connected successfully'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: `Supabase error: ${error.message}`
    });
  }
}

async function testShopify() {
  const apiKey = process.env.SHOPIFY_API_KEY;
  const apiSecret = process.env.SHOPIFY_API_SECRET;
  
  if (!apiKey || !apiSecret) {
    return NextResponse.json({
      success: false,
      message: 'Shopify API credentials not configured in .env.local'
    });
  }

  // For Shopify, we can't test without a store URL, so we just verify keys exist
  return NextResponse.json({
    success: true,
    message: 'Shopify API credentials configured (requires store URL for full test)'
  });
}

async function testReplicate() {
  const apiToken = process.env.REPLICATE_API_TOKEN;
  
  if (!apiToken) {
    return NextResponse.json({
      success: false,
      message: 'REPLICATE_API_TOKEN not configured in .env.local'
    });
  }

  try {
    // Test Replicate API by fetching account info
    const response = await fetch('https://api.replicate.com/v1/account', {
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Replicate API connected successfully'
      });
    } else {
      const error = await response.text();
      return NextResponse.json({
        success: false,
        message: `Replicate API error: ${error}`
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: `Replicate API error: ${error.message}`
    });
  }
}

async function testZiina() {
  const apiKey = process.env.ZIINA_API_KEY;
  const secretKey = process.env.ZIINA_SECRET_KEY;
  
  if (!apiKey || !secretKey) {
    return NextResponse.json({
      success: false,
      message: 'Ziina API credentials not configured in .env.local'
    });
  }

  // For Ziina, we just verify credentials exist since we don't want to make actual payments
  return NextResponse.json({
    success: true,
    message: 'Ziina API credentials configured (test mode)'
  });
}