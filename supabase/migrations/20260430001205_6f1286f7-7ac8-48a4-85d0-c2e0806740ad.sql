-- Replace broad public SELECT with a safer policy:
-- Public can still GET file by direct URL (Supabase storage public URLs work via the storage-render endpoint),
-- but to prevent listing, restrict SELECT on storage.objects to the file owner.
DROP POLICY IF EXISTS "Media: public read" ON storage.objects;

CREATE POLICY "Media: owner list"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'media'
  AND auth.uid()::text = (storage.foldername(name))[1]
);