import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function useCoupons() {
  const [loading, setLoading] = useState(false);

  async function validateCoupon(code: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('active', true)
        .maybeSingle();

      if (error) {
        return { valid: false, error: 'Invalid coupon code' };
      }

      if (!data) {
        return { valid: false, error: 'Invalid coupon code' };
      }

      // Check if coupon is still valid
      const now = new Date();
      const validUntil = data.valid_until ? new Date(data.valid_until) : null;
      const validFrom = new Date(data.valid_from);

      if (now < validFrom) {
        return { valid: false, error: 'Coupon is not yet active' };
      }

      if (validUntil && now > validUntil) {
        return { valid: false, error: 'Coupon has expired' };
      }

      if (data.usage_limit && data.used_count >= data.usage_limit) {
        return { valid: false, error: 'Coupon usage limit reached' };
      }

      return {
        valid: true,
        coupon: {
          code: data.code,
          discount: data.discount_percentage
        }
      };
    } catch (err) {
      return { valid: false, error: 'Error validating coupon' };
    } finally {
      setLoading(false);
    }
  }

  async function incrementCouponUsage(code: string) {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ used_count: supabase.sql`used_count + 1` })
        .eq('code', code);

      return { error };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'An error occurred' };
    }
  }

  return {
    loading,
    validateCoupon,
    incrementCouponUsage
  };
}