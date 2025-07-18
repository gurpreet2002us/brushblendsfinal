/*
  # Complete Database Schema Setup
  
  1. Tables
    - artworks (with sample data)
    - user_profiles 
    - orders
    - cart
    - wishlist
    - coupons (with sample data)
    - order_requests
    
  2. Security
    - Row Level Security enabled
    - Proper RLS policies for all tables
    - Auth triggers for user creation
    
  3. Performance
    - Indexes on frequently queried columns
    - Optimized queries
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create artworks table
CREATE TABLE IF NOT EXISTS artworks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  price numeric NOT NULL,
  medium text NOT NULL CHECK (medium IN ('fabric', 'oil', 'handcraft')),
  category text NOT NULL,
  style text,
  dimensions jsonb,
  images text[] DEFAULT '{}',
  in_stock boolean DEFAULT true,
  stock_count integer DEFAULT 0,
  featured boolean DEFAULT false,
  tags text[] DEFAULT '{}',
  date_created timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  phone text,
  address jsonb,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  items jsonb NOT NULL,
  total numeric NOT NULL,
  subtotal numeric NOT NULL,
  discount_amount numeric DEFAULT 0,
  coupon_code text,
  shipping_cost numeric DEFAULT 0,
  gst_amount numeric DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address jsonb NOT NULL,
  payment_method text,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'confirmed', 'failed')),
  tracking_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cart table
CREATE TABLE IF NOT EXISTS cart (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  artwork_id uuid REFERENCES artworks(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, artwork_id)
);

-- Create wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  artwork_id uuid REFERENCES artworks(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, artwork_id)
);

-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_percentage numeric NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  active boolean DEFAULT true,
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,
  usage_limit integer,
  used_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create order_requests table
CREATE TABLE IF NOT EXISTS order_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id uuid REFERENCES artworks(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  message text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$ 
BEGIN
    -- Artworks policies
    DROP POLICY IF EXISTS "Artworks are viewable by everyone" ON artworks;
    DROP POLICY IF EXISTS "Admins can manage artworks" ON artworks;
    
    CREATE POLICY "Artworks are viewable by everyone" ON artworks FOR SELECT TO public USING (true);
    CREATE POLICY "Admins can manage artworks" ON artworks FOR ALL TO authenticated 
      USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true));

    -- User profiles policies
    DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
    
    CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT TO authenticated USING (auth.uid() = id);
    CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
    CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

    -- Orders policies
    DROP POLICY IF EXISTS "Users can view own orders" ON orders;
    DROP POLICY IF EXISTS "Users can create own orders" ON orders;
    DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
    DROP POLICY IF EXISTS "Admins can update orders" ON orders;
    
    CREATE POLICY "Users can view own orders" ON orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
    CREATE POLICY "Users can create own orders" ON orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Admins can view all orders" ON orders FOR SELECT TO authenticated 
      USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true));
    CREATE POLICY "Admins can update orders" ON orders FOR UPDATE TO authenticated 
      USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true));

    -- Cart policies
    DROP POLICY IF EXISTS "Users can manage own cart" ON cart;
    CREATE POLICY "Users can manage own cart" ON cart FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

    -- Wishlist policies
    DROP POLICY IF EXISTS "Users can manage own wishlist" ON wishlist;
    CREATE POLICY "Users can manage own wishlist" ON wishlist FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

    -- Coupons policies
    DROP POLICY IF EXISTS "Coupons are viewable by authenticated users" ON coupons;
    DROP POLICY IF EXISTS "Admins can manage coupons" ON coupons;
    
    CREATE POLICY "Coupons are viewable by authenticated users" ON coupons FOR SELECT TO authenticated USING (active = true);
    CREATE POLICY "Admins can manage coupons" ON coupons FOR ALL TO authenticated 
      USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true));

    -- Order requests policies
    DROP POLICY IF EXISTS "Anyone can create order requests" ON order_requests;
    DROP POLICY IF EXISTS "Admins can view all order requests" ON order_requests;
    DROP POLICY IF EXISTS "Admins can update order requests" ON order_requests;
    
    CREATE POLICY "Anyone can create order requests" ON order_requests FOR INSERT TO public WITH CHECK (true);
    CREATE POLICY "Admins can view all order requests" ON order_requests FOR SELECT TO authenticated 
      USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true));
    CREATE POLICY "Admins can update order requests" ON order_requests FOR UPDATE TO authenticated 
      USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true));
END $$;

-- Create triggers for updated_at (drop first if exists)
DROP TRIGGER IF EXISTS update_artworks_updated_at ON artworks;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS update_cart_updated_at ON cart;

CREATE TRIGGER update_artworks_updated_at BEFORE UPDATE ON artworks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON cart FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create handle_new_user function for auth trigger
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user (drop first if exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert sample artworks (only if table is empty)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM artworks LIMIT 1) THEN
    INSERT INTO artworks (title, description, price, medium, category, style, dimensions, images, in_stock, stock_count, featured, tags) VALUES
    ('Sunset Meadow', 'A vibrant fabric painting capturing the golden hour in a meadow filled with wildflowers. This piece uses mixed textiles to create depth and texture.', 1850, 'fabric', 'Landscape', 'Contemporary', '{"width": 40, "height": 30, "unit": "cm"}', '{"https://images.pexels.com/photos/1568607/pexels-photo-1568607.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}', true, 1, true, '{"landscape", "sunset", "meadow", "textiles"}'),
    ('Abstract Dreams', 'An expressive oil painting featuring bold brushstrokes and vibrant colors that evoke emotion and movement.', 2800, 'oil', 'Abstract', 'Modern', '{"width": 50, "height": 40, "unit": "cm"}', '{"https://images.pexels.com/photos/1570264/pexels-photo-1570264.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}', true, 1, true, '{"abstract", "colorful", "modern", "expressive"}'),
    ('Ocean Waves', 'A serene fabric painting depicting rolling ocean waves with intricate beadwork and embroidery details.', 2150, 'fabric', 'Seascape', 'Traditional', '{"width": 35, "height": 45, "unit": "cm"}', '{"https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}', true, 0, false, '{"ocean", "waves", "blue", "beadwork"}'),
    ('City Lights', 'A dynamic oil painting of the city skyline at dusk, with warm lights beginning to twinkle across the urban landscape.', 3100, 'oil', 'Urban', 'Impressionist', '{"width": 60, "height": 40, "unit": "cm"}', '{"https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}', true, 1, true, '{"city", "lights", "urban", "dusk"}'),
    ('Floral Harmony', 'A delicate fabric painting featuring hand-embroidered flowers in soft pastels, perfect for any living space.', 1580, 'fabric', 'Floral', 'Traditional', '{"width": 30, "height": 35, "unit": "cm"}', '{"https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}', true, 2, false, '{"floral", "embroidery", "pastels", "delicate"}'),
    ('Mountain Majesty', 'A powerful oil painting capturing the grandeur of snow-capped mountains with dramatic lighting and rich textures.', 3680, 'oil', 'Landscape', 'Realistic', '{"width": 70, "height": 50, "unit": "cm"}', '{"https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}', true, 1, true, '{"mountains", "snow", "landscape", "dramatic"}'),
    ('Brass Ganesha Sculpture', 'Exquisitely handcrafted brass sculpture of Lord Ganesha with intricate detailing and traditional finish. Perfect for home decoration and spiritual spaces.', 2250, 'handcraft', 'Sculpture', 'Traditional', '{"width": 15, "height": 20, "unit": "cm"}', '{"https://images.pexels.com/photos/8828598/pexels-photo-8828598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}', true, 3, true, '{"brass", "ganesha", "sculpture", "spiritual", "traditional"}'),
    ('Wooden Elephant Carving', 'Beautiful hand-carved wooden elephant with intricate patterns and smooth finish. A symbol of wisdom and good fortune.', 1680, 'handcraft', 'Wood Carving', 'Traditional', '{"width": 25, "height": 18, "unit": "cm"}', '{"https://images.pexels.com/photos/6069112/pexels-photo-6069112.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}', true, 0, false, '{"wood", "elephant", "carving", "handmade", "decorative"}'),
    ('Ceramic Decorative Vase', 'Hand-painted ceramic vase with traditional Indian motifs and vibrant colors. Perfect for displaying flowers or as standalone decor.', 1350, 'handcraft', 'Ceramics', 'Traditional', '{"width": 12, "height": 25, "unit": "cm"}', '{"https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}', true, 4, false, '{"ceramic", "vase", "decorative", "painted", "traditional"}'),
    ('Handwoven Jute Wall Hanging', 'Eco-friendly jute wall hanging with macrame design and natural fibers. Adds rustic charm to any space.', 980, 'handcraft', 'Textile Art', 'Contemporary', '{"width": 30, "height": 40, "unit": "cm"}', '{"https://images.pexels.com/photos/6207842/pexels-photo-6207842.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}', true, 5, true, '{"jute", "macrame", "wall hanging", "eco-friendly", "rustic"}'),
    ('Copper Wind Chimes', 'Melodious copper wind chimes with traditional Indian bells. Creates soothing sounds and positive energy in your space.', 1150, 'handcraft', 'Decorative', 'Traditional', '{"width": 8, "height": 35, "unit": "cm"}', '{"https://images.pexels.com/photos/7319070/pexels-photo-7319070.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}', true, 6, false, '{"copper", "wind chimes", "bells", "melodious", "traditional"}'),
    ('Marble Inlay Jewelry Box', 'Exquisite marble jewelry box with traditional Pietra Dura inlay work. Features intricate floral patterns and velvet interior.', 3250, 'handcraft', 'Marble Work', 'Traditional', '{"width": 20, "height": 8, "unit": "cm"}', '{"https://images.pexels.com/photos/8828598/pexels-photo-8828598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"}', true, 2, true, '{"marble", "inlay", "jewelry box", "pietra dura", "luxury"}');
  END IF;
END $$;

-- Insert sample coupons (only if table is empty)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM coupons LIMIT 1) THEN
    INSERT INTO coupons (code, discount_percentage, active, valid_from, valid_until, usage_limit, used_count) VALUES
    ('BB202510', 10, true, now(), now() + interval '30 days', 100, 0),
    ('WELCOME15', 15, true, now(), now() + interval '60 days', 50, 0),
    ('NEWYEAR25', 25, true, now(), now() + interval '15 days', 25, 0);
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_artworks_medium ON artworks(medium);
CREATE INDEX IF NOT EXISTS idx_artworks_category ON artworks(category);
CREATE INDEX IF NOT EXISTS idx_artworks_featured ON artworks(featured);
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(active);