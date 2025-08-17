'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requirePlan?: 'starter' | 'pro' | 'enterprise';
}

export function ProtectedRoute({ 
  children, 
  redirectTo = '/auth/signin',
  requirePlan 
}: ProtectedRouteProps) {
  const { session, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!session) {
        router.push(redirectTo);
        return;
      }

      if (requirePlan && user) {
        const planHierarchy = { starter: 1, pro: 2, enterprise: 3 };
        const userPlanLevel = planHierarchy[user.plan as keyof typeof planHierarchy] || 0;
        const requiredPlanLevel = planHierarchy[requirePlan];

        if (userPlanLevel < requiredPlanLevel) {
          router.push('/pricing');
          return;
        }
      }
    }
  }, [session, user, loading, router, redirectTo, requirePlan]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  if (requirePlan && user) {
    const planHierarchy = { starter: 1, pro: 2, enterprise: 3 };
    const userPlanLevel = planHierarchy[user.plan as keyof typeof planHierarchy] || 0;
    const requiredPlanLevel = planHierarchy[requirePlan];

    if (userPlanLevel < requiredPlanLevel) {
      return null; // Will redirect to pricing
    }
  }

  return <>{children}</>;
}