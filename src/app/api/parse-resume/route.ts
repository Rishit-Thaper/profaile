export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { parseResumeFile } from "@/features/resume/server/parse-resume";
import { createClient } from "@/libs/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const file = (await request.formData()).get("resume") as File | null;
    const parsedResume = await parseResumeFile(file);
    return NextResponse.json(parsedResume);
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    const status = /No resume|Unsupported|empty/.test(message) ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
