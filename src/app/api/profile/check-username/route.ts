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

  const { data: available, error } = await supabase.rpc("is_username_available", {
    candidate: username,
  });
  if (error) {
    return NextResponse.json({ available: false, error: "Could not check username" }, { status: 500 });
  }

  return NextResponse.json({ available });
}
