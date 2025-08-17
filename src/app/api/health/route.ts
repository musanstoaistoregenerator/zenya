import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Check environment variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'OPENAI_API_KEY'
    ];
    
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingEnvVars.length > 0) {
      return NextResponse.json({
        status: 'error',
        message: 'Missing required environment variables',
        missing: missingEnvVars,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
    
    // Test Supabase connection
    let supabaseStatus = 'unknown';
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      // Test connection by trying to access auth (safer than querying tables)
      const { data, error } = await supabase.auth.getSession();
      
      supabaseStatus = (error && error.message.includes('Invalid API key')) ? 'error' : 'connected';
    } catch (error) {
      supabaseStatus = 'error';
    }
    
    // Test OpenAI API connection
    let openaiStatus = 'unknown';
    try {
      const response = await fetch(`${process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      openaiStatus = response.ok ? 'connected' : 'error';
    } catch (error) {
      openaiStatus = 'error';
    }
    
    const responseTime = Date.now() - startTime;
    const overallStatus = supabaseStatus === 'connected' && openaiStatus === 'connected' ? 'healthy' : 'degraded';
    
    return NextResponse.json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        supabase: supabaseStatus,
        openai: openaiStatus
      },
      deployment: {
        platform: process.env.RENDER ? 'render' : 'local',
        region: process.env.RENDER_REGION || 'unknown'
      }
    }, { 
      status: overallStatus === 'healthy' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`
    }, { status: 500 });
  }
}

// Also support HEAD requests for simple health checks
export async function HEAD() {
  try {
    // Quick health check without detailed testing
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'OPENAI_API_KEY'
    ];
    
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingEnvVars.length > 0) {
      return new NextResponse(null, { status: 503 });
    }
    
    return new NextResponse(null, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    return new NextResponse(null, { status: 503 });
  }
}