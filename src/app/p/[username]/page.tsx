import { createClient } from "@/libs/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PortfolioRenderer from "./PortfolioRenderer";
import { PortfolioData } from "@/app/types";

interface PageProps {
  params: Promise<{ username: string }>;
}

// Fetch profile data (shared between metadata and page)
async function getProfile(username: string) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .eq("is_published", true)
    .single();

  return profile;
}

// Dynamic SEO metadata
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfile(username);

  if (!profile || !profile.portfolio_data) {
    return { title: "Portfolio Not Found | Profaile" };
  }

  const data = profile.portfolio_data as PortfolioData;
  const name = data.personal_info?.name || username;
  const title = data.personal_info?.title || "Portfolio";

  return {
    title: `${name} — ${title} | Profaile`,
    description: `${name}'s portfolio. ${title}. Built with Profaile.`,
    openGraph: {
      title: `${name} — ${title}`,
      description: `View ${name}'s portfolio — ${title}.`,
      type: "profile",
    },
  };
}

export default async function PortfolioPage({ params }: PageProps) {
  const { username } = await params;
  const profile = await getProfile(username);

  if (!profile || !profile.portfolio_data) {
    notFound();
  }

  const portfolioData = profile.portfolio_data as PortfolioData;
  const theme = profile.selected_theme || "minimal";

  return <PortfolioRenderer data={portfolioData} theme={theme} />;
}
