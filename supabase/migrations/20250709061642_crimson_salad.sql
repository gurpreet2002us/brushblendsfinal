/*
  # Fix foreign key relationships for admin dashboard

  1. Database Changes
    - Add missing foreign key constraint from orders.user_id to user_profiles.id
    - The user_profiles.id to auth.users.id relationship should already exist but we'll ensure it's properly set up
    
  2. Security
    - No changes to existing RLS policies
    
  3. Notes
    - This fixes the relationship issues preventing the admin dashboard from loading orders and user data
    - The orders table needs a proper foreign key to user_profiles, not directly to auth.users
*/

-- First, let's ensure the orders.user_id references user_profiles.id correctly
-- Drop the existing constraint if it exists and points to auth.users
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'orders_user_id_fkey' 
    AND table_name = 'orders'
  ) THEN
    ALTER TABLE public.orders DROP CONSTRAINT orders_user_id_fkey;
  END IF;
END $$;

-- Add the correct foreign key constraint from orders.user_id to user_profiles.id
ALTER TABLE public.orders 
ADD CONSTRAINT orders_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;

-- Ensure user_profiles.id properly references auth.users.id
-- This should already exist based on your schema, but let's make sure
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_profiles_id_fkey' 
    AND table_name = 'user_profiles'
  ) THEN
    ALTER TABLE public.user_profiles 
    ADD CONSTRAINT user_profiles_id_fkey 
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;