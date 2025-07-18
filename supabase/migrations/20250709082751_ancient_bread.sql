-- Create media_gallery table for storing image metadata
CREATE TABLE IF NOT EXISTS media_gallery (
  id text PRIMARY KEY,
  filename text NOT NULL,
  original_filename text NOT NULL,
  file_path text NOT NULL,
  public_url text NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE media_gallery ENABLE ROW LEVEL SECURITY;

-- Create policies for media_gallery
CREATE POLICY "Media gallery is viewable by authenticated users" 
  ON media_gallery FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can upload to media gallery" 
  ON media_gallery FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete their own uploads" 
  ON media_gallery FOR DELETE 
  TO authenticated 
  USING (auth.uid() = uploaded_by);

CREATE POLICY "Admins can manage all media" 
  ON media_gallery FOR ALL 
  TO authenticated 
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_media_gallery_uploaded_by ON media_gallery(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_media_gallery_created_at ON media_gallery(created_at);
CREATE INDEX IF NOT EXISTS idx_media_gallery_mime_type ON media_gallery(mime_type);

-- Add updated_at trigger
CREATE TRIGGER update_media_gallery_updated_at 
  BEFORE UPDATE ON media_gallery 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add mainImageIndex column to artworks table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'artworks' AND column_name = 'main_image_index'
  ) THEN
    ALTER TABLE artworks ADD COLUMN main_image_index integer DEFAULT 0;
  END IF;
END $$;