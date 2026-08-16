export const runtime = "nodejs";

import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { PortfolioData } from "@/app/types";
import { retrieveRelevantChunks } from "@/libs/rag";
import { createClient } from "@/libs/supabase/server";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_GEMINI_API_KEY!,
});

const MODEL = "gemini-2.5-flash";

const USERNAME_REGEX = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;

const MAX_MESSAGE_LENGTH = 600;
const MAX_HISTORY_TURNS = 8;

interface ChatMessage {
  role: "user" | "model";
  content: string;
}

/* ---------------------------- RATE LIMITING ---------------------------- */

const rateLimits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (rateLimits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimits.set(key, recent);
    return true;
  }
  recent.push(now);
  rateLimits.set(key, recent);
  return false;
}

/* ------------------------------ PROMPTING ------------------------------ */

function buildSystemPrompt(name: string, context: string): string {
  return `You are the personal AI assistant for ${name || "this portfolio owner"}, an agent running on Profaile. Visitors to ${name || "their"} portfolio ask you questions to learn more about them.

STRICT RULES:
1. Answer ONLY using the retrieved context below. Never invent experience, projects, skills, numbers, links, or contact details.
2. If the context does not contain the answer, say you don't have that information and suggest one thing they could ask about instead.
3. Never mention sources or cite anything (no "(Source: ...)", no "according to", no source lists). Just answer naturally.
4. Never reproduce full URLs unless they are in the context. It is fine to name a project or company.
5. Be warm, professional, and concise. Use short paragraphs and bullet points when it improves readability.
6. If asked something unrelated to the portfolio, politely bring the conversation back to the owner.
7. Only ever discuss this portfolio owner. Do not answer as if you are a general assistant.

RETRIEVED CONTEXT:
${context}`;
}

/* ------------------- POST-PROCESSING / GUARDS ------------------- */

function stripSourceCitations(text: string): string {
  return text
    // "(Source: ...)" or "(Sources: ...)" inline citations
    .replace(/\(\s*sources?\s*[:\-][^)]*\)/gi, "")
    // A bullet or standalone "Source: ..." line (also **Source:** bold)
    .replace(/^[\s*\-–]*source[s]?\s*[:\-].*$/gim, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/* ------------------------------ ROUTE ------------------------------ */

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 },
      );
    }

    let body: { username?: unknown; message?: unknown; history?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { username, message } = body;
    if (typeof username !== "string" || !USERNAME_REGEX.test(username)) {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }
    if (typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message must be under ${MAX_MESSAGE_LENGTH} characters` },
        { status: 400 },
      );
    }

    // Sanitize chat history
    const history: ChatMessage[] = [];
    if (Array.isArray(body.history)) {
      for (const msg of body.history.slice(-MAX_HISTORY_TURNS)) {
        if (
          msg &&
          typeof msg === "object" &&
          (msg.role === "user" || msg.role === "model") &&
          typeof msg.content === "string" &&
          msg.content.trim().length > 0
        ) {
          history.push({
            role: msg.role,
            content: msg.content.slice(0, MAX_MESSAGE_LENGTH),
          });
        }
      }
    }

    // Load the published profile (source of truth for grounding)
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("portfolio_data, selected_theme")
      .eq("username", username)
      .eq("is_published", true)
      .maybeSingle();

    if (!profile?.portfolio_data) {
      return NextResponse.json(
        { error: "Portfolio not found or not published" },
        { status: 404 },
      );
    }

    const portfolio = profile.portfolio_data as PortfolioData;
    const ownerName = portfolio.personal_info?.name?.trim() || username;

    const { context } = retrieveRelevantChunks(portfolio, message);

    const contents: { role: string; parts: { text: string }[] }[] = [];
    for (const msg of history) {
      contents.push({ role: msg.role, parts: [{ text: msg.content }] });
    }
    contents.push({ role: "user", parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: MODEL,
      contents,
      config: {
        systemInstruction: buildSystemPrompt(ownerName, context),
        temperature: 0.4,
        maxOutputTokens: 1024,
      },
    });

    const reply = stripSourceCitations(response.text?.trim() ?? "");
    if (!reply) {
      throw new Error("AI returned an empty response.");
    }

    return NextResponse.json({ reply });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
