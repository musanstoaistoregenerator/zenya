'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Store, Package, CreditCard, TrendingUp, Calendar } from 'lucide-react';
import { Payment, Store as StoreType } from '@/lib/supabase/types';
import { db } from '@/lib/supabase';
import Link from 'next/link';

interface DashboardStats {
  totalStores: number;
  totalPayments: number;
  activeSubscriptions: number;
  storeUsage: number;
}

interface QuotaInfo {
  plan: string;
  quotas: {
    stores: {
      max: number;
      used: number;
      remaining: number;
      resetDate: string;
    };
    requests: {
      hourly: {
        max: number;
        used: number;
        remaining: number;
        resetDate: string;
      };
      daily: {
        max: number;
        used: number;
        remaining: number;
        resetDate: string;
      };
    };
  };
  usage: {
    hourlyRequests: number;
    dailyRequests: number;
    monthlyStores: number;
  };
  limits: {
    storeGeneration: boolean;
    hourlyRequests: boolean;
    dailyRequests: boolean;
  };
}

export function UserDashboard() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({ 
    totalStores: 0, 
    totalPayments: 0, 
    activeSubscriptions: 0,
    storeUsage: 0
  });
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stores, setStores] = useState<StoreType[]>([]);
  const [quotaInfo, setQuotaInfo] = useState<QuotaInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && !loading) {
      loadDashboardData();
    }
  }, [user, loading]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Load user stores
      const userStores = await db.getUserStores(user.id);
      setStores(userStores);

      // Load user payments
      const userPayments = await db.getUserPayments(user.id);
      setPayments(userPayments);

      // Load user subscriptions
      const userSubscriptions = await db.getUserSubscriptions(user.id);
      const activeSubscriptions = userSubscriptions.filter((sub: any) => sub.status === 'active').length;

      // Load quota information
      try {
        const quotaResponse = await fetch('/api/user/quota');
        if (quotaResponse.ok) {
          const quotaData = await quotaResponse.json();
          setQuotaInfo(quotaData);
        }
      } catch (quotaError) {
        console.error('Error loading quota info:', quotaError);
      }

      // Calculate stats
      const storeUsage = (userStores.length / (user.stores_limit || 3)) * 100;
      
      setStats({
        totalStores: userStores.length,
        totalPayments: userPayments.length,
        activeSubscriptions,
        storeUsage
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'pro': return 'bg-blue-500';
      case 'enterprise': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading || isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Please sign in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Info */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name || user.email}</h1>
          <p className="text-muted-foreground">Manage your stores and account</p>
        </div>
        <Badge className={getPlanBadgeColor(user.plan)} variant="secondary">
          {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStores}</div>
            <p className="text-xs text-muted-foreground">
              {user.stores_limit - stats.totalStores} remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Store Usage</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.storeUsage)}%</div>
            <Progress value={stats.storeUsage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPayments}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeSubscriptions} active subscriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Since</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))} days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quota Information */}
      {quotaInfo && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">API Usage & Quotas</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Hourly Requests */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hourly Requests</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {quotaInfo.quotas.requests.hourly.used}/{quotaInfo.quotas.requests.hourly.max}
                </div>
                <Progress 
                  value={(quotaInfo.quotas.requests.hourly.used / quotaInfo.quotas.requests.hourly.max) * 100} 
                  className="mt-2" 
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {quotaInfo.quotas.requests.hourly.remaining} remaining
                </p>
              </CardContent>
            </Card>

            {/* Daily Requests */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Daily Requests</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {quotaInfo.quotas.requests.daily.used}/{quotaInfo.quotas.requests.daily.max}
                </div>
                <Progress 
                  value={(quotaInfo.quotas.requests.daily.used / quotaInfo.quotas.requests.daily.max) * 100} 
                  className="mt-2" 
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {quotaInfo.quotas.requests.daily.remaining} remaining
                </p>
              </CardContent>
            </Card>

            {/* Monthly Stores */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Stores</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {quotaInfo.quotas.stores.used}/{quotaInfo.quotas.stores.max}
                </div>
                <Progress 
                  value={(quotaInfo.quotas.stores.used / quotaInfo.quotas.stores.max) * 100} 
                  className="mt-2" 
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {quotaInfo.quotas.stores.remaining} remaining this month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Rate Limit Warnings */}
          {(quotaInfo.limits.hourlyRequests || quotaInfo.limits.dailyRequests || quotaInfo.limits.storeGeneration) && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-yellow-800">Rate Limit Warnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-yellow-700">
                  {quotaInfo.limits.hourlyRequests && (
                    <p>• You've reached your hourly request limit. Resets at {new Date(quotaInfo.quotas.requests.hourly.resetDate).toLocaleTimeString()}</p>
                  )}
                  {quotaInfo.limits.dailyRequests && (
                    <p>• You've reached your daily request limit. Resets at {new Date(quotaInfo.quotas.requests.daily.resetDate).toLocaleDateString()}</p>
                  )}
                  {quotaInfo.limits.storeGeneration && (
                    <p>• You've reached your monthly store generation limit. Resets on {new Date(quotaInfo.quotas.stores.resetDate).toLocaleDateString()}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="stores" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stores">My Stores</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="stores" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Your Stores</h3>
            <Button asChild>
              <Link href="/generate">Create New Store</Link>
            </Button>
          </div>
          
          {stores.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No stores yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first AI-powered store to get started.
                  </p>
                  <Button asChild>
                    <Link href="/generate">Create Your First Store</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stores.map((store) => (
                <Card key={store.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{store.name}</CardTitle>
                    <CardDescription>
                      {store.platform} • Created {new Date(store.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        Products: {store.metadata?.productCount || 0}
                      </div>
                      {store.deployment_url && (
                        <Button variant="outline" size="sm" asChild className="w-full">
                          <a href={store.deployment_url} target="_blank" rel="noopener noreferrer">
                            View Store
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <h3 className="text-lg font-medium">Payment History</h3>
          
          {payments.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No payments yet</h3>
                  <p className="text-muted-foreground">
                    Your payment history will appear here.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <Card key={payment.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">
                          {payment.product_type === 'subscription' ? 'Subscription' : 
                           payment.product_type === 'theme' ? 'Premium Themes' : 'Payment'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(payment.created_at).toLocaleDateString()} • 
                          {payment.amount} {payment.currency}
                        </div>
                      </div>
                      <Badge className={getPaymentStatusColor(payment.status)} variant="secondary">
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <h3 className="text-lg font-medium">Account Settings</h3>
          
          <Card>
            <CardHeader>
              <CardTitle>Plan Information</CardTitle>
              <CardDescription>
                Manage your subscription and billing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Current Plan</div>
                  <div className="text-sm text-muted-foreground">
                    {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} Plan
                  </div>
                </div>
                <Badge className={getPlanBadgeColor(user.plan)} variant="secondary">
                  {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Store Limit</div>
                  <div className="text-sm text-muted-foreground">
                    {stats.totalStores} of {user.stores_limit} stores used
                  </div>
                </div>
                <Progress value={stats.storeUsage} className="w-24" />
              </div>

              {user.plan === 'starter' && (
                <Button asChild className="w-full">
                  <Link href="/pricing">Upgrade Plan</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}