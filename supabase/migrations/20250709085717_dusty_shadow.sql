/*
  # Add media gallery table and main image index column

  1. New Tables
    - `media_gallery`
      - `id` (text, primary key) - Storage file ID or path
      - `filename` (text) - Display filename
      - `original_filename` (text) - Original uploaded filename
      - `file_path` (text) - Storage file path
      - `public_url` (text) - Public URL for the image
      - `file_size` (integer) - File size in bytes
      - `mime_type` (text) - MIME type of the file
      - `uploaded_by` (uuid) - User who uploaded the file
      - `created_at` (timestamp) - Upload timestamp

  2. Table Updates
    - Add `main_image_index` column to `artworks` table

  3. Security
    - Enable RLS on `media_gallery` table
    - Add policies for authenticated users to manage their uploads
    - Add policy for admins to manage all uploads
*/

-- Create media_gallery table
CREATE TABLE IF NOT EXISTS media_gallery (
  id text PRIMARY KEY,
  filename text NOT NULL,
  original_filename text NOT NULL,
  file_path text NOT NULL,
  public_url text NOT NULL,
  file_size integer NOT NULL DEFAULT 0,
  mime_type text NOT NULL,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Add main_image_index column to artworks table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'artworks' AND column_name = 'main_image_index'
  ) THEN
    ALTER TABLE artworks ADD COLUMN main_image_index integer DEFAULT 0;
  END IF;
END $$;

-- Enable RLS on media_gallery
ALTER TABLE media_gallery ENABLE ROW LEVEL SECURITY;

-- Policies for media_gallery
CREATE POLICY "Users can view all media"
  ON media_gallery
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can upload media"
  ON media_gallery
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete own media"
  ON media_gallery
  FOR DELETE
  TO authenticated
  USING (auth.uid() = uploaded_by);

CREATE POLICY "Admins can manage all media"
  ON media_gallery
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() AND user_profiles.is_admin = true
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_media_gallery_uploaded_by ON media_gallery(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_media_gallery_created_at ON media_gallery(created_at);
CREATE INDEX IF NOT EXISTS idx_media_gallery_mime_type ON media_gallery(mime_type);