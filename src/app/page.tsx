import { createClient } from "@/libs/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "@/features/dashboard/components/DashboardClient";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return <DashboardClient userEmail={session.user.email ?? ""} />;
}
