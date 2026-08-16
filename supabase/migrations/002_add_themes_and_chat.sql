-- ============================================================================
-- PROFAILE — Migration 002: New themes + AI chat
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================================

-- 1. Widen the theme CHECK constraint to include the 4 new themes.
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_selected_theme_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_selected_theme_check
  CHECK (selected_theme IN (
    'minimal', 'modern', 'professional',
    'neon', 'elegant', 'vibrant', 'terminal'
  ));
