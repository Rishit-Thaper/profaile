import type { Metadata } from "next";
import Link from "next/link";
import PortfolioRenderer from "@/app/p/[username]/PortfolioRenderer";
import type { PortfolioData } from "@/app/types";
import { routes } from "@/config/routes";
import { createClient } from "@/libs/supabase/server";
import styles from "./draft.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Private draft preview | Profaile",
  robots: { index: false, follow: false },
};

export default async function DraftPreviewPage({
  params,
}: {
  params: Promise<{ portfolioId: string }>;
}) {
  const { portfolioId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // The owner check happens before draft data reaches the rendered page.
  const { data: portfolio } = user
    ? await supabase.from("portfolios")
        .select("draft_data, draft_theme")
        .eq("id", portfolioId)
        .eq("user_id", user.id)
        .maybeSingle()
    : { data: null };

  if (!portfolio) {
    return <main className={styles.messagePage}>
      <div className={styles.messageCard}>
        <span className={styles.eyebrow}>Private preview</span>
        <h1>Draft not published yet</h1>
        <p>Only the owner can view this draft. Ask them to publish a version to share their portfolio.</p>
        <Link href={routes.dashboard} className={styles.backLink}>Back to Profaile</Link>
      </div>
    </main>;
  }

  const data = portfolio.draft_data as PortfolioData | null;
  if (!data || !Object.keys(data).length) {
    return <main className={styles.messagePage}>
      <div className={styles.messageCard}>
        <span className={styles.eyebrow}>Private preview</span>
        <h1>Nothing to preview yet</h1>
        <p>Add content to this portfolio draft, then return to preview it here.</p>
        <Link href={routes.dashboard} className={styles.backLink}>Back to dashboard</Link>
      </div>
    </main>;
  }

  return <>
    <div className={styles.previewBar}>
      <div><strong>Draft preview</strong><span>Only you can view this version</span></div>
      <Link href={routes.dashboard} className={styles.backLink}>Back to dashboard</Link>
    </div>
    <PortfolioRenderer data={data} theme={portfolio.draft_theme} username="" showChat={false} editablePortfolioId={portfolioId} />
  </>;
}
