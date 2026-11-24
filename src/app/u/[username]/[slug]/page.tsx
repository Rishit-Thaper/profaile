import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PortfolioRenderer from "@/app/p/[username]/PortfolioRenderer";
import { getPublicPortfolio } from "@/features/portfolio/server/public-portfolio";

interface PageProps { params: Promise<{ username: string; slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username, slug } = await params;
  const result = await getPublicPortfolio(username, slug);
  if (!result) return { title: "Portfolio Not Found | Profaile" };
  const data = result.version.data;
  const name = data.personal_info?.name || username;
  const title = data.personal_info?.title || result.portfolio.name;
  return {
    title: `${name} — ${title} | Profaile`,
    description: `${name}'s ${result.portfolio.name} portfolio. Built with Profaile.`,
    openGraph: { title: `${name} — ${title}`, description: `View ${name}'s portfolio — ${title}.`, type: "profile" },
  };
}

export default async function PublicPortfolioPage({ params }: PageProps) {
  const { username, slug } = await params;
  const result = await getPublicPortfolio(username, slug);
  if (!result) notFound();
  return <PortfolioRenderer data={result.version.data} theme={result.version.theme} username={username} slug={slug} />;
}
