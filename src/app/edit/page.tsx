import { createClient } from "@/libs/supabase/server";
import { redirect } from "next/navigation";
import EditClient from "./EditClient";

export default async function EditPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return <EditClient userEmail={session.user.email ?? ""} />;
}
