-- Create public bucket for user media uploads (images & videos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  104857600, -- 100 MB
  ARRAY['image/jpeg','image/png','image/webp','image/gif','image/svg+xml','video/mp4','video/webm','video/quicktime']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Public read
CREATE POLICY "Media: public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- Authenticated users upload to their own folder (first folder = user_id)
CREATE POLICY "Media: users upload own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'media'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users update own files
CREATE POLICY "Media: users update own"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'media'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users delete own files
CREATE POLICY "Media: users delete own"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'media'
  AND auth.uid()::text = (storage.foldername(name))[1]
);