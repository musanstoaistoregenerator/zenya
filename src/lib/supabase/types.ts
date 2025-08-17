export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          plan: string;
          stores_created: number;
          stores_limit: number;
          metadata?: any | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          plan?: string;
          stores_created?: number;
          stores_limit?: number;
          metadata?: any | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          plan?: string;
          stores_created?: number;
          stores_limit?: number;
          metadata?: any | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      stores: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          product_url: string;
          platform: string;
          domain: string | null;
          status: string;
          success_score: number | null;
          market_research: any | null;
          content: any | null;
          images: any | null;
          platform_data: any | null;
          metadata: any | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          product_url: string;
          platform: string;
          domain?: string | null;
          status?: string;
          success_score?: number | null;
          market_research?: any | null;
          content?: any | null;
          images?: any | null;
          platform_data?: any | null;
          metadata?: any | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          product_url?: string;
          platform?: string;
          domain?: string | null;
          status?: string;
          success_score?: number | null;
          market_research?: any | null;
          content?: any | null;
          images?: any | null;
          platform_data?: any | null;
          metadata?: any | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          ziina_payment_id: string | null;
          amount: number;
          currency: string;
          status: string;
          customer_email: string;
          customer_name: string;
          product_type: string;
          metadata: any | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          ziina_payment_id?: string | null;
          amount: number;
          currency: string;
          status: string;
          customer_email: string;
          customer_name: string;
          product_type: string;
          metadata?: any | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          ziina_payment_id?: string | null;
          amount?: number;
          currency?: string;
          status?: string;
          customer_email?: string;
          customer_name?: string;
          product_type?: string;
          metadata?: any | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          ziina_subscription_id: string | null;
          customer_email: string;
          status: string;
          plan_type: string;
          amount: number;
          currency: string;
          start_date: string;
          end_date: string | null;
          metadata: any | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          ziina_subscription_id?: string | null;
          customer_email: string;
          status: string;
          plan_type: string;
          amount: number;
          currency: string;
          start_date: string;
          end_date?: string | null;
          metadata?: any | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          ziina_subscription_id?: string | null;
          customer_email?: string;
          status?: string;
          plan_type?: string;
          amount?: number;
          currency?: string;
          start_date?: string;
          end_date?: string | null;
          metadata?: any | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type User = Database['public']['Tables']['users']['Row'];
export type Store = Database['public']['Tables']['stores']['Row'];
export type Payment = Database['public']['Tables']['payments']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];

export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type StoreInsert = Database['public']['Tables']['stores']['Insert'];
export type PaymentInsert = Database['public']['Tables']['payments']['Insert'];
export type SubscriptionInsert = Database['public']['Tables']['subscriptions']['Insert'];

export type UserUpdate = Database['public']['Tables']['users']['Update'];
export type StoreUpdate = Database['public']['Tables']['stores']['Update'];
export type PaymentUpdate = Database['public']['Tables']['payments']['Update'];
export type SubscriptionUpdate = Database['public']['Tables']['subscriptions']['Update'];