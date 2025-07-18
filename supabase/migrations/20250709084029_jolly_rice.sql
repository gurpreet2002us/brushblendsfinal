-- Create storage bucket for images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for the images bucket
CREATE POLICY "Images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'images');

CREATE POLICY "Users can update their own images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow admins to manage all images
CREATE POLICY "Admins can manage all images" ON storage.objects
  FOR ALL TO authenticated
  USING (
    bucket_id = 'images' AND 
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true)
  );