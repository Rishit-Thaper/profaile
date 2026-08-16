import { createClient } from "@/libs/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

function extractPath(url: string): string | null {
  const m = url.match(/\/object\/public\/photos\/(.+)$/);
  return m ? decodeURIComponent(m[1]) : null;
}

/* ──────────────────── POST /api/profile/photo ──────────────────────────── */
export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("photo");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No photo file provided" }, { status: 400 });
  }

  if (file.size > MAX_PHOTO_SIZE) {
    return NextResponse.json(
      { error: "Photo must be 5MB or smaller" },
      { status: 413 },
    );
  }

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Unsupported file type. Use JPG, PNG, WebP or AVIF." },
      { status: 400 },
    );
  }

  const path = `${user.id}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("photos")
    .upload(path, file, { contentType: file.type });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: publicUrl } = supabase.storage.from("photos").getPublicUrl(path);
  return NextResponse.json({ url: publicUrl.publicUrl });
}

/* ──────────────────── DELETE /api/profile/photo ────────────────────────── */
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const path = typeof body?.url === "string" ? extractPath(body.url) : null;
  if (!path) {
    return NextResponse.json({ error: "Invalid photo URL" }, { status: 400 });
  }

  const { error } = await supabase.storage.from("photos").remove([path]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
