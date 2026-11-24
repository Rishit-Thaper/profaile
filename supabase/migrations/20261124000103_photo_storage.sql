-- ============================================================================
-- PROFAILE — Migration 003: Profile photo storage
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
--
-- Creates a public "photos" bucket plus RLS policies so each authenticated
-- user can upload/replace/delete images inside their own folder:
--   photos/<user-id>/<file>
-- Public read is enabled, so the stored photo URL works on the public
-- portfolio pages without any auth.
-- ============================================================================

-- 1. Create the public bucket (idempotent).
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Anyone can read (public bucket).
CREATE POLICY "photos_public_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'photos');

-- 3. Authenticated users can upload into their own folder.
CREATE POLICY "photos_upload_own"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Users can replace their own images.
CREATE POLICY "photos_update_own"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 5. Users can delete their own images.
CREATE POLICY "photos_delete_own"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
