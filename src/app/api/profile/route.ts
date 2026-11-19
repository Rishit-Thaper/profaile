import { createClient } from "@/libs/supabase/server";
import { isValidTheme } from "@/libs/theme-registry";
import { getUsernameValidationError } from "@/features/profile/utils/username";
import { NextRequest, NextResponse } from "next/server";
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    const baseName = user.email ? user.email.split("@")[0].toLowerCase() : "user";
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    
    const { data: newProfile, error: insertError } = await supabase
      .from("profiles")
      .insert({ 
        id: user.id, 
        username: `${baseName}-${randomSuffix}` 
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
    profile = newProfile;
  }

  return NextResponse.json(profile);
}

export async function PUT(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const allowedFields = [
    "username",
    "selected_theme",
    "is_published",
    "portfolio_data",
  ];
  const updates: Record<string, unknown> = {};

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  }

  if (updates.username !== undefined) {
    const usernameError = getUsernameValidationError(updates.username);
    if (usernameError) {
      return NextResponse.json(
        { error: usernameError },
        { status: 400 },
      );
    }
  }

  if (updates.selected_theme !== undefined && !isValidTheme(updates.selected_theme)) {
    return NextResponse.json({ error: "Unknown theme" }, { status: 400 });
  }

  if (updates.is_published !== undefined && typeof updates.is_published !== "boolean") {
    return NextResponse.json({ error: "is_published must be a boolean" }, { status: 400 });
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(profile);
}
