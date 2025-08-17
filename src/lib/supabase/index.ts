// Supabase client exports
export { supabase, createSupabaseClient } from './client';

// Database service
export { DatabaseService, db } from './database';

// Type definitions
export type {
  Database,
  User,
  Store,
  Payment,
  Subscription,
  UserInsert,
  StoreInsert,
  PaymentInsert,
  SubscriptionInsert,
  UserUpdate,
  StoreUpdate,
  PaymentUpdate,
  SubscriptionUpdate
} from './types';