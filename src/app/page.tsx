import { createClient } from "@/libs/supabase/server";
import { routes } from "@/config/routes";
import { redirect } from "next/navigation";
import DashboardClient from "@/features/dashboard/components/DashboardClient";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(routes.login);
  }

  return <DashboardClient userEmail={session.user.email ?? ""} />;
}
