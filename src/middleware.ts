import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Rate limiting configuration for different endpoints
const RATE_LIMITS: Record<string, { requests: number; windowMs: number }> = {
  '/api/generate-store': { requests: 10, windowMs: 60 * 60 * 1000 }, // 10 per hour
  '/api/user/quota': { requests: 60, windowMs: 60 * 60 * 1000 }, // 60 per hour
  '/api/payments': { requests: 30, windowMs: 60 * 60 * 1000 }, // 30 per hour
  '/api/webhooks': { requests: 100, windowMs: 60 * 60 * 1000 }, // 100 per hour
  default: { requests: 100, windowMs: 60 * 60 * 1000 } // Default: 100 per hour
};

async function checkRateLimit(
  userId: string,
  endpoint: string,
  ip: string
): Promise<{ allowed: boolean; remaining: number; resetTime: Date }> {
  const config = RATE_LIMITS[endpoint] || RATE_LIMITS.default;
  const windowStart = new Date(Date.now() - config.windowMs);
  
  try {
    // Count requests in the current window
    const { data: requests, error } = await supabase
      .from('api_usage')
      .select('id')
      .eq('user_id', userId)
      .eq('endpoint', endpoint)
      .gte('created_at', windowStart.toISOString());

    if (error) {
      console.error('Rate limit check error:', error);
      return { allowed: true, remaining: config.requests, resetTime: new Date(Date.now() + config.windowMs) };
    }

    const requestCount = requests?.length || 0;
    const remaining = Math.max(0, config.requests - requestCount);
    const resetTime = new Date(Date.now() + config.windowMs);

    return {
      allowed: requestCount < config.requests,
      remaining,
      resetTime
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return { allowed: true, remaining: config.requests, resetTime: new Date(Date.now() + config.windowMs) };
  }
}

async function logRequest(
  userId: string,
  endpoint: string,
  method: string,
  success: boolean,
  ip: string,
  userAgent: string
) {
  try {
    await supabase
      .from('api_usage')
      .insert({
        user_id: userId,
        endpoint,
        method,
        success,
        ip_address: ip,
        user_agent: userAgent
      });
  } catch (error) {
    console.error('Failed to log API request:', error);
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only apply rate limiting to API routes
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Skip rate limiting for certain endpoints
  const skipRateLimit = [
    '/api/auth/',
    '/api/health',
    '/api/status',
    '/api/test/'
  ].some(path => pathname.startsWith(path));

  if (skipRateLimit) {
    return NextResponse.next();
  }

  try {
    // Get user from JWT token
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token?.sub) {
      // For unauthenticated requests, apply IP-based rate limiting
      const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
      const response = NextResponse.json(
        { error: 'Authentication required for API access' },
        { status: 401 }
      );
      return response;
    }

    const userId = token.sub;
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Check rate limit
    const { allowed, remaining, resetTime } = await checkRateLimit(
      userId,
      pathname,
      ip
    );

    // Create response
    const response = allowed 
      ? NextResponse.next()
      : NextResponse.json(
          { 
            error: 'Rate limit exceeded',
            message: `Too many requests. Try again after ${resetTime.toISOString()}`,
            resetTime: resetTime.toISOString()
          },
          { status: 429 }
        );

    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', String(RATE_LIMITS[pathname]?.requests || RATE_LIMITS.default.requests));
    response.headers.set('X-RateLimit-Remaining', String(remaining));
    response.headers.set('X-RateLimit-Reset', String(Math.ceil(resetTime.getTime() / 1000)));

    // Log the request (async, don't wait)
    logRequest(
      userId,
      pathname,
      request.method,
      allowed,
      ip,
      userAgent
    ).catch(console.error);

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/api/((?!auth/|health|status).*)',
  ],
};