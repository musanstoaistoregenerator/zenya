import { getServerSession } from 'next-auth/next';
import { authOptions } from './config';
import { redirect } from 'next/navigation';
import { db } from '@/lib/supabase';

/**
 * Get the current session on the server side
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Get the current user from the session
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

/**
 * Require authentication - redirect to sign in if not authenticated
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    redirect('/auth/signin');
  }
  return session.user;
}

/**
 * Get user with database information
 */
export async function getUserWithData() {
  const user = await getCurrentUser();
  if (!user?.email) return null;

  try {
    const userData = await db.getUserByEmail(user.email);
    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

/**
 * Check if user has reached their store creation limit
 */
export async function checkUserLimits(userId: string) {
  try {
    const user = await db.getUserById(userId);
    if (!user) return { canCreate: false, reason: 'User not found' };

    if (user.stores_created >= user.stores_limit) {
      return {
        canCreate: false,
        reason: `You have reached your limit of ${user.stores_limit} stores. Upgrade your plan to create more.`,
        current: user.stores_created,
        limit: user.stores_limit
      };
    }

    return {
      canCreate: true,
      current: user.stores_created,
      limit: user.stores_limit
    };
  } catch (error) {
    console.error('Error checking user limits:', error);
    return { canCreate: false, reason: 'Error checking limits' };
  }
}

/**
 * Update user's store count after successful creation
 */
export async function incrementUserStoreCount(userId: string) {
  try {
    const user = await db.getUserById(userId);
    if (!user) throw new Error('User not found');

    await db.updateUser(userId, {
      stores_created: user.stores_created + 1
    });

    return true;
  } catch (error) {
    console.error('Error incrementing store count:', error);
    return false;
  }
}