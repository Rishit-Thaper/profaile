import { createClient } from "@/libs/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");

  if (!username || username.length < 3) {
    return NextResponse.json(
      { available: false, error: "Username must be at least 3 characters" },
      { status: 400 },
    );
  }

  // Only allow alphanumeric and hyphens
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(username) && username.length > 2) {
    return NextResponse.json(
      {
        available: false,
        error: "Only lowercase letters, numbers, and hyphens allowed",
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
