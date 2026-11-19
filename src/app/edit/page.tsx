import { createClient } from "@/libs/supabase/server";
import { routes } from "@/config/routes";
import { redirect } from "next/navigation";
import ProfileEditor from "@/features/profile/components/ProfileEditor";

export default async function EditPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(routes.login);
  }

  return <ProfileEditor userEmail={session.user.email ?? ""} />;
}
