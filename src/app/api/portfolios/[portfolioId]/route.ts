import { CareerPortfolio } from "@/app/types";
import { getPortfolioSlugValidationError } from "@/features/portfolio/utils/slug";
import { isValidTheme } from "@/libs/theme-registry";
import { createClient } from "@/libs/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ portfolioId: string }> };

async function ownedPortfolio(portfolioId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, portfolio: null };
  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("*")
    .eq("id", portfolioId)
    .eq("user_id", user.id)
    .maybeSingle();
  return { supabase, user, portfolio };
}

export async function GET(_: NextRequest, { params }: RouteContext) {
  const { portfolioId } = await params;
  const { supabase, user, portfolio } = await ownedPortfolio(portfolioId);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!portfolio) return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });

  const { data, error } = await supabase
    .from("portfolios")
    .select("*, published_version:portfolio_versions!portfolios_published_version_id_fkey(*)")
    .eq("id", portfolio.id)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data as CareerPortfolio);
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { portfolioId } = await params;
  const { supabase, user, portfolio } = await ownedPortfolio(portfolioId);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!portfolio) return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });

  const body = await req.json();
  const updates: Record<string, unknown> = {};
  if (body.name !== undefined) {
    if (typeof body.name !== "string" || !body.name.trim()) return NextResponse.json({ error: "Portfolio name is required" }, { status: 400 });
    updates.name = body.name.trim().slice(0, 80);
  }
  if (body.slug !== undefined) {
    const error = getPortfolioSlugValidationError(body.slug);
    if (error) return NextResponse.json({ error }, { status: 400 });
    updates.slug = body.slug;
  }
  if (body.draft_data !== undefined && (typeof body.draft_data !== "object" || body.draft_data === null)) {
    return NextResponse.json({ error: "Invalid portfolio data" }, { status: 400 });
  }
  if (body.draft_data !== undefined) updates.draft_data = body.draft_data;
  if (body.draft_theme !== undefined) {
    if (!isValidTheme(body.draft_theme)) return NextResponse.json({ error: "Unknown theme" }, { status: 400 });
    updates.draft_theme = body.draft_theme;
  }
  if (!Object.keys(updates).length) return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });

  const { data, error } = await supabase
    .from("portfolios")
    .update(updates)
    .eq("id", portfolio.id)
    .select("*, published_version:portfolio_versions!portfolios_published_version_id_fkey(*)")
    .single();
  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "You already have a portfolio using this URL" }, { status: 409 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data as CareerPortfolio);
}
