import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types
export interface Database {
  public: {
    Tables: {
      artworks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          price: number;
          medium: 'fabric' | 'oil' | 'handcraft';
          category: string;
          style: string | null;
          dimensions: any;
          images: string[];
          in_stock: boolean;
          stock_count: number;
          featured: boolean;
          tags: string[];
          date_created: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          price: number;
          medium: 'fabric' | 'oil' | 'handcraft';
          category: string;
          style?: string | null;
          dimensions?: any;
          images?: string[];
          in_stock?: boolean;
          stock_count?: number;
          featured?: boolean;
          tags?: string[];
          date_created?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          price?: number;
          medium?: 'fabric' | 'oil' | 'handcraft';
          category?: string;
          style?: string | null;
          dimensions?: any;
          images?: string[];
          in_stock?: boolean;
          stock_count?: number;
          featured?: boolean;
          tags?: string[];
          date_created?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          name: string | null;
          phone: string | null;
          address: any | null;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          phone?: string | null;
          address?: any | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          phone?: string | null;
          address?: any | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          items: any;
          total: number;
          subtotal: number;
          discount_amount: number;
          coupon_code: string | null;
          shipping_cost: number;
          gst_amount: number;
          status: string;
          shipping_address: any;
          payment_method: string | null;
          payment_status: string;
          tracking_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          items: any;
          total: number;
          subtotal: number;
          discount_amount?: number;
          coupon_code?: string | null;
          shipping_cost?: number;
          gst_amount?: number;
          status?: string;
          shipping_address: any;
          payment_method?: string | null;
          payment_status?: string;
          tracking_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          items?: any;
          total?: number;
          subtotal?: number;
          discount_amount?: number;
          coupon_code?: string | null;
          shipping_cost?: number;
          gst_amount?: number;
          status?: string;
          shipping_address?: any;
          payment_method?: string | null;
          payment_status?: string;
          tracking_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      wishlist: {
        Row: {
          id: string;
          user_id: string;
          artwork_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          artwork_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          artwork_id?: string;
          created_at?: string;
        };
      };
      cart: {
        Row: {
          id: string;
          user_id: string;
          artwork_id: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          artwork_id: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          artwork_id?: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          discount_percentage: number;
          active: boolean;
          valid_from: string;
          valid_until: string | null;
          usage_limit: number | null;
          used_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          discount_percentage: number;
          active?: boolean;
          valid_from?: string;
          valid_until?: string | null;
          usage_limit?: number | null;
          used_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          discount_percentage?: number;
          active?: boolean;
          valid_from?: string;
          valid_until?: string | null;
          usage_limit?: number | null;
          used_count?: number;
          created_at?: string;
        };
      };
      order_requests: {
        Row: {
          id: string;
          artwork_id: string;
          name: string;
          email: string;
          phone: string;
          message: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          artwork_id: string;
          name: string;
          email: string;
          phone: string;
          message?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          artwork_id?: string;
          name?: string;
          email?: string;
          phone?: string;
          message?: string | null;
          status?: string;
          created_at?: string;
        };
      };
    };
  };
}