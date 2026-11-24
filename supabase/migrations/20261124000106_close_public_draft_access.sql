-- Phase 2: run only after application code using migration 005 is deployed.
-- Remove direct public row access; the RPC returns published snapshots only.

BEGIN;

DROP POLICY IF EXISTS "Visitors read published portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Visitors read published portfolio versions" ON public.portfolio_versions;
DROP POLICY IF EXISTS "Visitors read profiles with a published portfolio" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can read published profiles" ON public.profiles;

COMMIT;
