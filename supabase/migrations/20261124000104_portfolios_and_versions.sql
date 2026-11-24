-- Profaile — career portfolios, immutable portfolio versions, and optional
-- saved resume sources. Run after the existing profile migrations.

CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  draft_data JSONB DEFAULT '{}'::jsonb,
  draft_theme TEXT NOT NULL DEFAULT 'minimal' CHECK (draft_theme IN (
    'minimal', 'modern', 'professional', 'neon', 'elegant', 'vibrant', 'terminal'
  )),
  published_version_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, slug)
);

CREATE TABLE IF NOT EXISTS public.resume_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  parsed_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.portfolio_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL CHECK (version_number > 0),
  label TEXT,
  data JSONB NOT NULL,
  theme TEXT NOT NULL CHECK (theme IN (
    'minimal', 'modern', 'professional', 'neon', 'elegant', 'vibrant', 'terminal'
  )),
  source_resume_version_id UUID REFERENCES public.resume_versions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (portfolio_id, version_number)
);

ALTER TABLE public.portfolios
  ADD CONSTRAINT portfolios_published_version_id_fkey
  FOREIGN KEY (published_version_id) REFERENCES public.portfolio_versions(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_published_version_id ON public.portfolios(published_version_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_versions_portfolio_id ON public.portfolio_versions(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_resume_versions_user_id ON public.resume_versions(user_id);

CREATE TRIGGER on_portfolio_updated
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own portfolios"
  ON public.portfolios FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Visitors read published portfolios"
  ON public.portfolios FOR SELECT
  USING (published_version_id IS NOT NULL);

DROP POLICY IF EXISTS "Anyone can read published profiles" ON public.profiles;
CREATE POLICY "Visitors read profiles with a published portfolio"
  ON public.profiles FOR SELECT
  USING (
    is_published = true
    OR EXISTS (SELECT 1 FROM public.portfolios p WHERE p.user_id = profiles.id AND p.published_version_id IS NOT NULL)
  );

CREATE POLICY "Users manage own portfolio versions"
  ON public.portfolio_versions FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = portfolio_id AND p.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = portfolio_id AND p.user_id = auth.uid()));

CREATE POLICY "Visitors read published portfolio versions"
  ON public.portfolio_versions FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.portfolios p WHERE p.id = portfolio_id AND p.published_version_id = id));

CREATE POLICY "Users manage own resume versions"
  ON public.resume_versions FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Saved source files are deliberately private; only their owner can access
-- objects under resumes/<user-id>/.
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "resumes_read_own" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "resumes_insert_own" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "resumes_delete_own" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Backfill the one legacy portfolio as a default career portfolio. Existing
-- public links keep working through the legacy route, which resolves this row.
INSERT INTO public.portfolios (user_id, slug, name, draft_data, draft_theme)
SELECT id, 'portfolio', 'My Portfolio', COALESCE(portfolio_data, '{}'::jsonb), COALESCE(selected_theme, 'minimal')
FROM public.profiles
ON CONFLICT (user_id, slug) DO NOTHING;

INSERT INTO public.portfolio_versions (portfolio_id, version_number, label, data, theme)
SELECT p.id, 1, 'Imported portfolio', p.draft_data, p.draft_theme
FROM public.portfolios p
WHERE p.slug = 'portfolio'
  AND NOT EXISTS (SELECT 1 FROM public.portfolio_versions v WHERE v.portfolio_id = p.id);

UPDATE public.portfolios p
SET published_version_id = v.id
FROM public.profiles legacy, public.portfolio_versions v
WHERE p.user_id = legacy.id
  AND v.portfolio_id = p.id
  AND v.version_number = 1
  AND p.slug = 'portfolio'
  AND legacy.is_published = true;
