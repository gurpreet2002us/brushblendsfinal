-- Allow admins to delete orders
DO $$
BEGIN
  -- Enable RLS (if not already enabled)
  ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;

  -- Drop existing delete policy if present to avoid duplicates
  DROP POLICY IF EXISTS "Admins can delete orders" ON orders;

  -- Create delete policy for admins
  CREATE POLICY "Admins can delete orders" ON orders
    FOR DELETE TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM user_profiles
        WHERE id = auth.uid() AND is_admin = true
      )
    );
END $$; 