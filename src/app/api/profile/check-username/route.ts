import { createClient } from "@/libs/supabase/server";
import { getUsernameValidationError } from "@/features/profile/utils/username";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");

  const usernameError = getUsernameValidationError(username);
  if (usernameError) {
    return NextResponse.json(
      {
        available: false,
        error: usernameError,
      },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  return NextResponse.json({ available: !data });
}
