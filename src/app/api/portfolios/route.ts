import { CareerPortfolio, PortfolioData } from "@/app/types";
import { getPortfolioSlugValidationError } from "@/features/portfolio/utils/slug";
import { isValidTheme } from "@/libs/theme-registry";
import { createClient } from "@/libs/supabase/server";
import { NextRequest, NextResponse } from "next/server";

function toSlug(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("portfolios")
    .select("*, published_version:portfolio_versions!portfolios_published_version_id_fkey(*)")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data as CareerPortfolio[]);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
  const slug = typeof body.slug === "string" ? toSlug(body.slug) : toSlug(name);
  const slugError = getPortfolioSlugValidationError(slug);
  if (!name) return NextResponse.json({ error: "Portfolio name is required" }, { status: 400 });
  if (slugError) return NextResponse.json({ error: slugError }, { status: 400 });
  if (body.draft_theme !== undefined && !isValidTheme(body.draft_theme)) {
    return NextResponse.json({ error: "Unknown theme" }, { status: 400 });
  }

  const draftData = body.draft_data && typeof body.draft_data === "object" ? body.draft_data as PortfolioData : {};
  const { data, error } = await supabase
    .from("portfolios")
    .insert({
      user_id: user.id,
      name,
      slug,
      draft_data: draftData,
      draft_theme: body.draft_theme ?? "minimal",
    })
    .select("*, published_version:portfolio_versions!portfolios_published_version_id_fkey(*)")
    .single();

  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "You already have a portfolio using this URL" }, { status: 409 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data as CareerPortfolio, { status: 201 });
}
