import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '../auth/config';
import { createServerSupabaseClient } from '../supabase/server';

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // Time window in milliseconds
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export interface UserQuota {
  plan: 'free' | 'basic' | 'premium';
  maxStoresPerMonth: number;
  maxRequestsPerHour: number;
  maxRequestsPerDay: number;
}

// Plan-based quotas
const PLAN_QUOTAS: Record<string, UserQuota> = {
  free: {
    plan: 'free',
    maxStoresPerMonth: 3,
    maxRequestsPerHour: 10,
    maxRequestsPerDay: 50
  },
  basic: {
    plan: 'basic',
    maxStoresPerMonth: 20,
    maxRequestsPerHour: 50,
    maxRequestsPerDay: 500
  },
  premium: {
    plan: 'premium',
    maxStoresPerMonth: 100,
    maxRequestsPerHour: 200,
    maxRequestsPerDay: 2000
  }
};

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  async checkRateLimit(request: NextRequest): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
    error?: string;
  }> {
    try {
      // Get user session
      const session = await getServerSession(authConfig);
      if (!session?.user?.email) {
        return {
          allowed: false,
          remaining: 0,
          resetTime: Date.now() + this.config.windowMs,
          error: 'Authentication required'
        };
      }

      const supabase = await createServerSupabaseClient();
      const userEmail = session.user.email;

      // Get user data and current plan
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, plan, created_at')
        .eq('email', userEmail)
        .single();

      if (userError || !user) {
        return {
          allowed: false,
          remaining: 0,
          resetTime: Date.now() + this.config.windowMs,
          error: 'User not found'
        };
      }

      const quota = PLAN_QUOTAS[user.plan] || PLAN_QUOTAS.free;
      const now = new Date();
      const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Check hourly rate limit
      const { data: hourlyRequests, error: hourlyError } = await supabase
        .from('api_usage')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', hourAgo.toISOString())
        .eq('endpoint', this.getEndpointFromRequest(request));

      if (hourlyError) {
        console.error('Error checking hourly rate limit:', hourlyError);
        return {
          allowed: false,
          remaining: 0,
          resetTime: Date.now() + this.config.windowMs,
          error: 'Rate limit check failed'
        };
      }

      const hourlyCount = hourlyRequests?.length || 0;
      if (hourlyCount >= quota.maxRequestsPerHour) {
        return {
          allowed: false,
          remaining: 0,
          resetTime: hourAgo.getTime() + 60 * 60 * 1000,
          error: `Hourly rate limit exceeded. Limit: ${quota.maxRequestsPerHour} requests per hour`
        };
      }

      // Check daily rate limit
      const { data: dailyRequests, error: dailyError } = await supabase
        .from('api_usage')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', dayAgo.toISOString())
        .eq('endpoint', this.getEndpointFromRequest(request));

      if (dailyError) {
        console.error('Error checking daily rate limit:', dailyError);
        return {
          allowed: false,
          remaining: 0,
          resetTime: Date.now() + this.config.windowMs,
          error: 'Rate limit check failed'
        };
      }

      const dailyCount = dailyRequests?.length || 0;
      if (dailyCount >= quota.maxRequestsPerDay) {
        return {
          allowed: false,
          remaining: 0,
          resetTime: dayAgo.getTime() + 24 * 60 * 60 * 1000,
          error: `Daily rate limit exceeded. Limit: ${quota.maxRequestsPerDay} requests per day`
        };
      }

      // Check monthly store generation limit for store generation endpoints
      if (this.isStoreGenerationEndpoint(request)) {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const { data: monthlyStores, error: monthlyError } = await supabase
          .from('stores')
          .select('id')
          .eq('user_id', user.id)
          .gte('created_at', monthStart.toISOString());

        if (monthlyError) {
          console.error('Error checking monthly store limit:', monthlyError);
          return {
            allowed: false,
            remaining: 0,
            resetTime: Date.now() + this.config.windowMs,
            error: 'Store limit check failed'
          };
        }

        const monthlyStoreCount = monthlyStores?.length || 0;
        if (monthlyStoreCount >= quota.maxStoresPerMonth) {
          return {
            allowed: false,
            remaining: quota.maxStoresPerMonth - monthlyStoreCount,
            resetTime: new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime(),
            error: `Monthly store generation limit exceeded. Limit: ${quota.maxStoresPerMonth} stores per month`
          };
        }
      }

      return {
        allowed: true,
        remaining: Math.min(
          quota.maxRequestsPerHour - hourlyCount,
          quota.maxRequestsPerDay - dailyCount
        ),
        resetTime: Math.min(
          hourAgo.getTime() + 60 * 60 * 1000,
          dayAgo.getTime() + 24 * 60 * 60 * 1000
        )
      };
    } catch (error) {
      console.error('Rate limiting error:', error);
      return {
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + this.config.windowMs,
        error: 'Rate limit check failed'
      };
    }
  }

  async logRequest(request: NextRequest, success: boolean = true): Promise<void> {
    try {
      const session = await getServerSession(authConfig);
      if (!session?.user?.email) return;

      const supabase = await createServerSupabaseClient();
      
      // Get user ID
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single();

      if (!user) return;

      // Log the API usage
      await supabase
        .from('api_usage')
        .insert({
          user_id: user.id,
          endpoint: this.getEndpointFromRequest(request),
          method: request.method,
          success,
          ip_address: this.getClientIP(request),
          user_agent: request.headers.get('user-agent') || '',
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error logging API request:', error);
    }
  }

  private getEndpointFromRequest(request: NextRequest): string {
    const url = new URL(request.url);
    return url.pathname;
  }

  private isStoreGenerationEndpoint(request: NextRequest): boolean {
    const endpoint = this.getEndpointFromRequest(request);
    return endpoint.includes('/api/generate') || endpoint.includes('/api/stores');
  }

  private getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    if (realIP) {
      return realIP;
    }
    
    return 'unknown';
  }
}

// Middleware function to be used in API routes
export async function withRateLimit(
  request: NextRequest,
  config: RateLimitConfig = {
    maxRequests: 100,
    windowMs: 60 * 60 * 1000 // 1 hour
  }
) {
  const rateLimiter = new RateLimiter(config);
  const result = await rateLimiter.checkRateLimit(request);
  
  if (!result.allowed) {
    return NextResponse.json(
      {
        error: result.error || 'Rate limit exceeded',
        retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.resetTime.toString(),
          'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString()
        }
      }
    );
  }

  return { rateLimiter, result };
}

// Helper function to get user quota information
export async function getUserQuota(userEmail: string): Promise<UserQuota | null> {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: user, error } = await supabase
      .from('users')
      .select('plan')
      .eq('email', userEmail)
      .single();

    if (error || !user) {
      return null;
    }

    return PLAN_QUOTAS[user.plan] || PLAN_QUOTAS.free;
  } catch (error) {
    console.error('Error getting user quota:', error);
    return null;
  }
}

// Helper function to get current usage statistics
export async function getUserUsageStats(userEmail: string): Promise<{
  hourlyRequests: number;
  dailyRequests: number;
  monthlyStores: number;
  quota: UserQuota;
} | null> {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, plan')
      .eq('email', userEmail)
      .single();

    if (userError || !user) {
      return null;
    }

    const quota = PLAN_QUOTAS[user.plan] || PLAN_QUOTAS.free;
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get hourly requests
    const { data: hourlyRequests } = await supabase
      .from('api_usage')
      .select('id')
      .eq('user_id', user.id)
      .gte('created_at', hourAgo.toISOString());

    // Get daily requests
    const { data: dailyRequests } = await supabase
      .from('api_usage')
      .select('id')
      .eq('user_id', user.id)
      .gte('created_at', dayAgo.toISOString());

    // Get monthly stores
    const { data: monthlyStores } = await supabase
      .from('stores')
      .select('id')
      .eq('user_id', user.id)
      .gte('created_at', monthStart.toISOString());

    return {
      hourlyRequests: hourlyRequests?.length || 0,
      dailyRequests: dailyRequests?.length || 0,
      monthlyStores: monthlyStores?.length || 0,
      quota
    };
  } catch (error) {
    console.error('Error getting usage stats:', error);
    return null;
  }
}