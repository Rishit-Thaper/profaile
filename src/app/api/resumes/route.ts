import { ResumeVersion } from "@/app/types";
import { createClient } from "@/libs/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const EXTENSIONS: Record<string, string> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabase.from("resume_versions")
    .select("id, original_filename, mime_type, parsed_data, created_at")
    .eq("user_id", user.id).order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data as ResumeVersion[]);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("resume");
  const parsedDataRaw = formData.get("parsed_data");
  if (!(file instanceof File)) return NextResponse.json({ error: "No resume file provided" }, { status: 400 });
  if (file.size === 0 || file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "Resume must be between 1 byte and 5MB" }, { status: 400 });
  const extension = EXTENSIONS[file.type];
  if (!extension) return NextResponse.json({ error: "Unsupported file type. Use PDF or DOCX." }, { status: 400 });
  if (typeof parsedDataRaw !== "string") return NextResponse.json({ error: "Parsed resume data is required" }, { status: 400 });

  let parsedData: unknown;
  try { parsedData = JSON.parse(parsedDataRaw); } catch { return NextResponse.json({ error: "Invalid parsed resume data" }, { status: 400 }); }
  if (!parsedData || typeof parsedData !== "object") return NextResponse.json({ error: "Invalid parsed resume data" }, { status: 400 });

  const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
  const { error: storageError } = await supabase.storage.from("resumes")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (storageError) return NextResponse.json({ error: storageError.message }, { status: 500 });

  const { data, error } = await supabase.from("resume_versions").insert({
    user_id: user.id,
    original_filename: file.name.slice(0, 255),
    mime_type: file.type,
    file_path: path,
    parsed_data: parsedData,
  }).select("id, original_filename, mime_type, parsed_data, created_at").single();
  if (error) {
    await supabase.storage.from("resumes").remove([path]);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data as ResumeVersion, { status: 201 });
}
