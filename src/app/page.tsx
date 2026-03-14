import { createClient } from "@/libs/supabase/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import LogoutButton from "./components/LogoutButton";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <main>
        <Image
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        <h1>Welcome {session.user.email}</h1>

        <LogoutButton />
      </main>
    </div>
  );
}
