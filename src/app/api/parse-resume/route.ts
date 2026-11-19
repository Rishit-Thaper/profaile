export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { parseResumeFile } from "@/features/resume/server/parse-resume";

export async function POST(request: NextRequest) {
  try {
    const file = (await request.formData()).get("resume") as File | null;
    const parsedResume = await parseResumeFile(file);
    return NextResponse.json(parsedResume);
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    const status = /No resume|Unsupported|empty/.test(message) ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
