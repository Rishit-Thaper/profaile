import type { PortfolioData } from "@/app/types";
import { createClient } from "@/libs/supabase/server";

export async function getPublicPortfolio(username: string, slug: string) {
  const supabase = await createClient();
  const { data: published } = await supabase.rpc("get_published_portfolio", {
    p_username: username,
    p_slug: slug,
  }).maybeSingle();
  if (!published) return null;
  const row = published as {
    portfolio_name: string;
    version_data: PortfolioData;
    version_theme: string;
  };

  return {
    portfolio: { name: row.portfolio_name },
    version: {
      data: row.version_data,
      theme: row.version_theme,
    },
  };
}
