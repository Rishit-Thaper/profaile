export const runtime = "nodejs";
import { GoogleGenAI } from "@google/genai";
import mammoth from "mammoth";
import { NextRequest, NextResponse } from "next/server";
import { extractText as extractPdfText } from "unpdf";

import { v4 as uuidv4 } from "uuid";
/* -------------------------------- CONFIG --------------------------------- */
const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_GEMINI_API_KEY!,
});

const MODEL = "gemini-2.5-flash";

/* ----------------------------- SYSTEM PROMPT ----------------------------- */

const SYSTEM_PROMPT = `You are a Resume Parsing AI.
Your task is to extract structured resume data strictly matching the provided schema.
Rules:
- Return ONLY valid JSON.
- Do NOT include markdown or code blocks.
- Do NOT include explanations.
- If any field is missing, return empty string or empty array.
- For the 'gpa' field, extract ONLY the numeric value (e.g., '8.5' or '3.8', NOT '8.5/10 Aggregate CGPA').
- Analyze the resume and generate a \`stats\` array containing 4 impressive metrics (e.g., Years of Experience, Number of Projects, Performance Gain, CGPA).
- Analyze the resume and generate a \`core_stack\` array containing 3-5 impressive technical skills(e.g., React, Node.js, Python, SQL, Figma, etc.)`;

/* --------------------------- RESPONSE SCHEMA ----------------------------- */

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    personal_info: {
      type: "OBJECT",
      properties: {
        name: { type: "STRING" },
        title: { type: "STRING" },
        email: { type: "STRING" },
        phone: { type: "STRING" },
        github: { type: "STRING" },
        leetcode: { type: "STRING" },
        codechef: { type: "STRING" },
        codeforces: { type: "STRING" },
        linkedin: { type: "STRING" },
        location: { type: "STRING" },
        behance: { type: "STRING" },
        dribbble: { type: "STRING" },
        figma: { type: "STRING" },
        twitter: { type: "STRING" },
        medium: { type: "STRING" },
        youtube: { type: "STRING" },
      },
      required: ["name"],
    },
    summary: { type: "STRING" },
    skills: {
      type: "OBJECT",
      properties: {
        languages: { type: "ARRAY", items: { type: "STRING" } },
        frameworks: { type: "ARRAY", items: { type: "STRING" } },
        tools: { type: "ARRAY", items: { type: "STRING" } },
        databases: { type: "ARRAY", items: { type: "STRING" } },
      },
    },
    experience: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          company: { type: "STRING" },
          role: { type: "STRING" },
          duration: { type: "STRING" },
          location: { type: "STRING" },
          description: { type: "ARRAY", items: { type: "STRING" } },
        },
        required: ["company", "role", "description"],
      },
    },
    projects: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          description: { type: "STRING" },
          tech_stack: { type: "ARRAY", items: { type: "STRING" } },
          github: { type: "STRING" },
          live: { type: "STRING" },
        },
        required: ["name", "description"],
      },
    },
    education: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          institution: { type: "STRING" },
          degree: { type: "STRING" },
          field: { type: "STRING" },
          duration: { type: "STRING" },
          gpa: { type: "STRING" },
        },
        required: ["institution", "degree"],
      },
    },
    certifications: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          issuer: { type: "STRING" },
          date: { type: "STRING" },
        },
      },
    },
    stats: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          val: { type: "STRING" },
          label: { type: "STRING" },
        },
        required: ["val", "label"],
      },
    },
    core_stack: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
  },
  required: ["personal_info", "skills", "experience", "projects", "education", "stats", "core_stack"],
};

/* ----------------------------- SUPPORTED TYPES --------------------------- */

type SupportedMimeType =
  | "application/pdf"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const SUPPORTED_TYPES: SupportedMimeType[] = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

/* -------------------------------- HELPERS -------------------------------- */

function validateFile(file: File | null): asserts file is File {
  if (!file) throw new Error("No resume file uploaded.");
  if (file.size === 0) throw new Error("Uploaded file is empty.");
  if (file.size > 5 * 1024 * 1024)
    throw new Error("File size exceeds 5MB limit.");
  if (!SUPPORTED_TYPES.includes(file.type as SupportedMimeType)) {
    throw new Error("Unsupported file type. Please upload a PDF or DOCX file.");
  }
}

/* ---------------------------- AI PARSE LOGIC ----------------------------- */
async function extractText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  if (file.type === "application/pdf") {
    const { text } = await extractPdfText(new Uint8Array(arrayBuffer));
    const rawText = text.join("\n").trim();
    if (!rawText) throw new Error("Unable to extract text from PDF.");
    return rawText;
  }
  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const { value } = await mammoth.extractRawText({
      buffer: Buffer.from(arrayBuffer),
    });
    return value;
  }

  throw new Error("Unsupported file type");
}
async function parseResumeWithAI(
  resumeText: string,
): Promise<Record<string, unknown>> {
  // Convert to base64 and pass directly to Gemini — no text extraction needed
  // const base64Data = Buffer.from(fileBuffer).toString("base64");

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      {
        role: "user",
        parts: [
          { text: resumeText },
          { text: "Parse this resume into structured JSON." },
        ],
      },
    ],
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseSchema: RESPONSE_SCHEMA,
      responseMimeType: "application/json",
      maxOutputTokens: 8192,
      temperature: 0.1,
    },
  });

  const text = response.text;
  console.log("text", text)
  if (!text) {
    throw new Error("AI model returned an empty response.");
  }

  // Safeguard: strip markdown fences if model wraps response anyway
  const cleaned = text
    .replace(/^```json\n?/, "")
    .replace(/\n?```$/, "")
    .trim();

  console.log("cleaned", cleaned)
  console.log("JSON.parse(cleaned)", JSON.parse(cleaned));

  return JSON.parse(cleaned);
}

/* -------------------------------- ROUTE --------------------------------- */

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;

    validateFile(file);

    const resumeText = await extractText(file);
    console.log("resuyme", resumeText)
    if (!resumeText || resumeText.trim().length < 50) {
      throw new Error("Unable to extract meaningful text from resume.");
    }

    const parsedResume = await parseResumeWithAI(resumeText);

    console.log("Parsed Resume:", parsedResume);
    return NextResponse.json(
      {
        ...parsedResume,
        resumeUUID: uuidv4(),
        createdAt: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("error", error)
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    const status =
      message.includes("No resume") ||
        message.includes("Unsupported") ||
        message.includes("empty")
        ? 400
        : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
