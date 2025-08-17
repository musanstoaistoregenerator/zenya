import { createSupabaseClient } from './client';
import { Database, User, Store, Payment, Subscription, UserInsert, StoreInsert, PaymentInsert, SubscriptionInsert } from './types';

export class DatabaseService {
  private supabase;

  constructor() {
    this.supabase = createSupabaseClient();
  }

  // User operations
  async createUser(userData: UserInsert): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return null;
    }

    return data;
  }

  async getUserById(userId: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }

    return data;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return null;
    }

    return data;
  }

  // Store operations
  async createStore(storeData: StoreInsert): Promise<Store | null> {
    const { data, error } = await this.supabase
      .from('stores')
      .insert(storeData)
      .select()
      .single();

    if (error) {
      console.error('Error creating store:', error);
      return null;
    }

    return data;
  }

  async getStoresByUserId(userId: string): Promise<Store[]> {
    const { data, error } = await this.supabase
      .from('stores')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user stores:', error);
      return [];
    }

    return data || [];
  }

  async getStoreById(storeId: string): Promise<Store | null> {
    const { data, error } = await this.supabase
      .from('stores')
      .select('*')
      .eq('id', storeId)
      .single();

    if (error) {
      console.error('Error fetching store:', error);
      return null;
    }

    return data;
  }

  async updateStore(storeId: string, updates: Partial<Store>): Promise<Store | null> {
    const { data, error } = await this.supabase
      .from('stores')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', storeId)
      .select()
      .single();

    if (error) {
      console.error('Error updating store:', error);
      return null;
    }

    return data;
  }

  // Payment operations
  async createPayment(paymentData: PaymentInsert): Promise<Payment | null> {
    const { data, error } = await this.supabase
      .from('payments')
      .insert(paymentData)
      .select()
      .single();

    if (error) {
      console.error('Error creating payment:', error);
      return null;
    }

    return data;
  }

  async getPaymentsByUserId(userId: string): Promise<Payment[]> {
    const { data, error } = await this.supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user payments:', error);
      return [];
    }

    return data || [];
  }

  async getPaymentById(id: string): Promise<Payment | null> {
    const { data, error } = await this.supabase
      .from('payments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching payment:', error);
      return null;
    }

    return data;
  }

  async getPaymentByZiinaId(ziinaId: string): Promise<Payment | null> {
    const { data, error } = await this.supabase
      .from('payments')
      .select('*')
      .eq('ziina_payment_id', ziinaId)
      .single();

    if (error) {
      console.error('Error fetching payment by Ziina ID:', error);
      return null;
    }

    return data;
  }

  async updatePayment(paymentId: string, updates: Partial<Payment>): Promise<Payment | null> {
    const { data, error } = await this.supabase
      .from('payments')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', paymentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating payment:', error);
      return null;
    }

    return data;
  }

  // Subscription operations
  async createSubscription(subscriptionData: SubscriptionInsert): Promise<Subscription | null> {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .insert(subscriptionData)
      .select()
      .single();

    if (error) {
      console.error('Error creating subscription:', error);
      return null;
    }

    return data;
  }

  async getSubscriptionsByUserId(userId: string): Promise<Subscription[]> {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user subscriptions:', error);
      return [];
    }

    return data || [];
  }

  async getSubscriptionById(id: string): Promise<Subscription | null> {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }

    return data;
  }

  async getSubscriptionByZiinaId(ziinaId: string): Promise<Subscription | null> {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .select('*')
      .eq('ziina_subscription_id', ziinaId)
      .single();

    if (error) {
      console.error('Error fetching subscription by Ziina ID:', error);
      return null;
    }

    return data;
  }

  async updateSubscription(subscriptionId: string, updates: Partial<Subscription>): Promise<Subscription | null> {
    const { data, error } = await this.supabase
      .from('subscriptions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', subscriptionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating subscription:', error);
      return null;
    }

    return data;
  }

  // Analytics and reporting
  async getUserStats(userId: string) {
    const [user, stores, payments, subscriptions] = await Promise.all([
      this.getUserById(userId),
      this.getStoresByUserId(userId),
      this.getPaymentsByUserId(userId),
      this.getSubscriptionsByUserId(userId)
    ]);

    return {
      user,
      totalStores: stores.length,
      totalPayments: payments.length,
      totalRevenue: payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0),
      activeSubscriptions: subscriptions.filter(s => s.status === 'active').length,
      stores,
      payments,
      subscriptions
    };
  }

  // Check user limits
  async canCreateStore(userId: string): Promise<boolean> {
    const user = await this.getUserById(userId);
    if (!user) return false;

    return user.stores_created < user.stores_limit;
  }

  async incrementStoreCount(userId: string): Promise<boolean> {
    const user = await this.getUserById(userId);
    if (!user) return false;

    const updated = await this.updateUser(userId, {
      stores_created: user.stores_created + 1
    });

    return !!updated;
  }

  // API Usage tracking methods
  async logApiUsage(data: {
    user_id: string;
    endpoint: string;
    method: string;
    success: boolean;
    ip_address?: string;
    user_agent?: string;
  }): Promise<boolean> {
    const { error } = await this.supabase
      .from('api_usage')
      .insert({
        user_id: data.user_id,
        endpoint: data.endpoint,
        method: data.method,
        success: data.success,
        ip_address: data.ip_address || null,
        user_agent: data.user_agent || null,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error logging API usage:', error);
      return false;
    }

    return true;
  }

  async getApiUsageCount(userId: string, endpoint: string, timeWindow: Date): Promise<number> {
    const { data, error } = await this.supabase
      .from('api_usage')
      .select('id')
      .eq('user_id', userId)
      .eq('endpoint', endpoint)
      .gte('created_at', timeWindow.toISOString());

    if (error) {
      console.error('Error getting API usage count:', error);
      return 0;
    }

    return data?.length || 0;
  }

  async getUserApiStats(userId: string): Promise<{
    hourlyRequests: number;
    dailyRequests: number;
    monthlyStores: number;
  }> {
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get hourly API requests
    const { data: hourlyData } = await this.supabase
      .from('api_usage')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', hourAgo.toISOString());

    // Get daily API requests
    const { data: dailyData } = await this.supabase
      .from('api_usage')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', dayAgo.toISOString());

    // Get monthly stores created
    const { data: monthlyStores } = await this.supabase
      .from('stores')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', monthStart.toISOString());

    return {
      hourlyRequests: hourlyData?.length || 0,
      dailyRequests: dailyData?.length || 0,
      monthlyStores: monthlyStores?.length || 0
    };
  }

  // Alias methods for UserDashboard compatibility
  async getUserStores(userId: string): Promise<Store[]> {
    return this.getStoresByUserId(userId);
  }

  async getUserPayments(userId: string): Promise<Payment[]> {
    return this.getPaymentsByUserId(userId);
  }

  async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    return this.getSubscriptionsByUserId(userId);
  }
}

// Singleton instance
export const db = new DatabaseService();