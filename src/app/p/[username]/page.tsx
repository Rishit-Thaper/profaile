import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function PortfolioPage({ params }: PageProps) {
  const { username } = await params;
  redirect(`/u/${username}/portfolio`);
}
