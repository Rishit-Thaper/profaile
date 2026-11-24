import { createClient } from "@/libs/supabase/server";
import { routes } from "@/config/routes";
import { redirect } from "next/navigation";
import ProfileEditor from "@/features/profile/components/ProfileEditor";

export default async function EditPage({ searchParams }: { searchParams: Promise<{ portfolio?: string }> }) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(routes.login);
  }

  const { portfolio } = await searchParams;
  return <ProfileEditor userEmail={session.user.email ?? ""} portfolioId={portfolio} />;
}
