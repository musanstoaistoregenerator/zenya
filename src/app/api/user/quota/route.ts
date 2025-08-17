import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { getUserQuota, getUserUsageStats } from '@/lib/middleware/rateLimiting';
import { withRateLimit } from '@/lib/middleware/rateLimiting';

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting for quota endpoint
    const rateLimitResult = await withRateLimit(request, {
      maxRequests: 60, // 60 requests per hour for quota checks
      windowMs: 60 * 60 * 1000 // 1 hour
    });

    if (rateLimitResult instanceof NextResponse) {
      return rateLimitResult;
    }

    const { rateLimiter } = rateLimitResult;

    // Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      await rateLimiter.logRequest(request, false);
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    // Get user quota information
    const quota = await getUserQuota(userEmail);
    if (!quota) {
      await rateLimiter.logRequest(request, false);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get current usage statistics
    const usageStats = await getUserUsageStats(userEmail);
    if (!usageStats) {
      await rateLimiter.logRequest(request, false);
      return NextResponse.json(
        { error: 'Unable to fetch usage statistics' },
        { status: 500 }
      );
    }

    // Calculate remaining quotas
    const response = {
      plan: quota.plan,
      quotas: {
        stores: {
          max: quota.maxStoresPerMonth,
          used: usageStats.monthlyStores,
          remaining: Math.max(0, quota.maxStoresPerMonth - usageStats.monthlyStores),
          resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()
        },
        requests: {
          hourly: {
            max: quota.maxRequestsPerHour,
            used: usageStats.hourlyRequests,
            remaining: Math.max(0, quota.maxRequestsPerHour - usageStats.hourlyRequests),
            resetDate: new Date(Date.now() + 60 * 60 * 1000).toISOString()
          },
          daily: {
            max: quota.maxRequestsPerDay,
            used: usageStats.dailyRequests,
            remaining: Math.max(0, quota.maxRequestsPerDay - usageStats.dailyRequests),
            resetDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          }
        }
      },
      usage: {
        hourlyRequests: usageStats.hourlyRequests,
        dailyRequests: usageStats.dailyRequests,
        monthlyStores: usageStats.monthlyStores
      },
      limits: {
        storeGeneration: usageStats.monthlyStores >= quota.maxStoresPerMonth,
        hourlyRequests: usageStats.hourlyRequests >= quota.maxRequestsPerHour,
        dailyRequests: usageStats.dailyRequests >= quota.maxRequestsPerDay
      }
    };

    // Log successful request
    await rateLimiter.logRequest(request, true);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching user quota:', error);
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  );
}