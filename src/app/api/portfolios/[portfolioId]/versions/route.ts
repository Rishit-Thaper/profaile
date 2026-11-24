import { PortfolioVersion } from "@/app/types";
import { isValidTheme } from "@/libs/theme-registry";
import { createClient } from "@/libs/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ portfolioId: string }> };

async function assertOwnership(portfolioId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, portfolio: null };
  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("id, draft_data, draft_theme")
    .eq("id", portfolioId).eq("user_id", user.id).maybeSingle();
  return { supabase, user, portfolio };
}

export async function GET(_: NextRequest, { params }: RouteContext) {
  const { portfolioId } = await params;
  const { supabase, user, portfolio } = await assertOwnership(portfolioId);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!portfolio) return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
  const { data, error } = await supabase.from("portfolio_versions")
    .select("*").eq("portfolio_id", portfolioId).order("version_number", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data as PortfolioVersion[]);
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { portfolioId } = await params;
  const { supabase, user, portfolio } = await assertOwnership(portfolioId);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!portfolio) return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
  const body = await req.json();
  const data = body.data ?? portfolio.draft_data;
  const theme = body.theme ?? portfolio.draft_theme;
  if (!data || typeof data !== "object") return NextResponse.json({ error: "Portfolio draft is empty" }, { status: 400 });
  if (!isValidTheme(theme)) return NextResponse.json({ error: "Unknown theme" }, { status: 400 });
  const sourceResumeId = typeof body.source_resume_version_id === "string" ? body.source_resume_version_id : null;
  if (sourceResumeId) {
    const { data: resume } = await supabase.from("resume_versions")
      .select("id").eq("id", sourceResumeId).eq("user_id", user.id).maybeSingle();
    if (!resume) return NextResponse.json({ error: "Resume version not found" }, { status: 404 });
  }

  const { data: latest, error: latestError } = await supabase.from("portfolio_versions")
    .select("version_number").eq("portfolio_id", portfolioId).order("version_number", { ascending: false }).limit(1).maybeSingle();
  if (latestError) return NextResponse.json({ error: latestError.message }, { status: 500 });
  const { data: version, error } = await supabase.from("portfolio_versions").insert({
    portfolio_id: portfolioId,
    version_number: (latest?.version_number ?? 0) + 1,
    label: typeof body.label === "string" ? body.label.trim().slice(0, 80) || null : null,
    data,
    theme,
    source_resume_version_id: sourceResumeId,
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: error.code === "23505" ? 409 : 500 });
  return NextResponse.json(version as PortfolioVersion, { status: 201 });
}
