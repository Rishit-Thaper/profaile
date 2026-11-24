import { createClient } from "@/libs/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ portfolioId: string }> };

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const { portfolioId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const versionId = body.version_id;
  if (versionId !== null && typeof versionId !== "string") return NextResponse.json({ error: "Invalid version" }, { status: 400 });

  const { data: portfolio } = await supabase.from("portfolios")
    .select("id").eq("id", portfolioId).eq("user_id", user.id).maybeSingle();
  if (!portfolio) return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
  if (versionId) {
    const { data: version } = await supabase.from("portfolio_versions")
      .select("id").eq("id", versionId).eq("portfolio_id", portfolioId).maybeSingle();
    if (!version) return NextResponse.json({ error: "Version not found" }, { status: 404 });
  }
  const { data, error } = await supabase.from("portfolios")
    .update({ published_version_id: versionId }).eq("id", portfolioId).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
