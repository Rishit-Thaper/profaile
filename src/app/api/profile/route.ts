import { createClient } from "@/libs/supabase/server";
import { isValidTheme } from "@/libs/theme-registry";
import { NextRequest, NextResponse } from "next/server";

const USERNAME_REGEX = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;

/* ────────────────────────── GET /api/profile ────────────────────────── */
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("user", user)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Create the profile if it doesn't exist 
  // (happens if they signed up before the db trigger was added, or if the trigger failed)
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

/* ────────────────────────── PUT /api/profile ────────────────────────── */
export async function PUT(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Only allow updating specific fields
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
    if (
      typeof updates.username !== "string" ||
      updates.username.length < 3 ||
      updates.username.length > 30 ||
      !USERNAME_REGEX.test(updates.username)
    ) {
      return NextResponse.json(
        {
          error:
            "Username must be 3-30 characters using lowercase letters, numbers, and hyphens",
        },
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
    // Handle unique constraint on username
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
