-- Phase 1: add narrow public RPCs before deploying the application code.
-- Existing public reads remain available until migration 006 is applied.

BEGIN;

CREATE OR REPLACE FUNCTION public.get_published_portfolio(p_username text, p_slug text)
RETURNS TABLE (portfolio_name text, version_data jsonb, version_theme text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT p.name, v.data, v.theme
  FROM public.profiles AS pr
  JOIN public.portfolios AS p ON p.user_id = pr.id
  JOIN public.portfolio_versions AS v
    ON v.id = p.published_version_id AND v.portfolio_id = p.id
  WHERE pr.username = p_username AND p.slug = p_slug
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_published_portfolio(text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_published_portfolio(text, text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.is_username_available(candidate text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE username = candidate
  );
$$;

REVOKE ALL ON FUNCTION public.is_username_available(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_username_available(text) TO anon, authenticated;

COMMIT;
