import { createClient } from "@/libs/supabase/server";
import { NextRequest, NextResponse } from "next/server";

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
