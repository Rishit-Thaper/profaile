import { createClient } from "@/libs/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const supabase = await createClient();
  console.log(process.env.NEXT_PUBLIC_BASE_URL);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });

  if (error || !data.url) {
    return redirect("/auth/auth-code-error");
  }

  return redirect(data.url); // 👈 redirects user to Google's OAuth page
}
