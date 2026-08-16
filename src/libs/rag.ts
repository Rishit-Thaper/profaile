import { PortfolioData } from "@/app/types";

/* ────────────────────────────────────────────────────────────────────────────
   Lightweight RAG for portfolio chat.
   Chunks the owner's structured portfolio data into retrievable units and
   ranks them against a user query using token-overlap scoring. The top chunks
   become the grounded context the AI is allowed to answer from.
   ──────────────────────────────────────────────────────────────────────────── */

export interface Chunk {
  id: string;
  source: string;
  text: string;
}

export interface RetrievalResult {
  chunks: Chunk[];
  context: string;
}

const SOCIAL_KEYS = [
  "github",
  "linkedin",
  "twitter",
  "behance",
  "dribbble",
  "figma",
  "medium",
  "youtube",
  "leetcode",
  "codechef",
  "codeforces",
] as const;

function joinTruthy(lines: Array<string | null | undefined>): string {
  return lines.filter((l) => l && l.trim().length > 0).join("\n");
}

/* ------------------------------ CHUNKING ------------------------------- */

export function chunkPortfolio(data: PortfolioData): Chunk[] {
  const chunks: Chunk[] = [];

  const p = data.personal_info;
  if (p) {
    const socials = SOCIAL_KEYS.filter((k) => p[k])
      .map((k) => `${k}: ${p[k]}`)
      .join(", ");

    const text = joinTruthy([
      `Name: ${p.name || "N/A"}`,
      `Title: ${p.title || "N/A"}`,
      p.location && `Location: ${p.location}`,
      p.email && `Email: ${p.email}`,
      p.phone && `Phone: ${p.phone}`,
      socials && `Social: ${socials}`,
    ]);

    if (text) chunks.push({ id: "personal", source: "About", text });
  }

  const skills = data.skills;
  if (skills) {
    (Object.entries(skills) as [string, string[]][]).forEach(([cat, items]) => {
      if (Array.isArray(items) && items.length > 0) {
        chunks.push({
          id: `skills-${cat}`,
          source: `Skills · ${cat[0].toUpperCase()}${cat.slice(1)}`,
          text: `Skills — ${cat[0].toUpperCase()}${cat.slice(1)}: ${items.join(", ")}`,
        });
      }
    });
  }

  if (Array.isArray(data.experience)) {
    data.experience.forEach((exp, i) => {
      if (!exp) return;
      const text = joinTruthy([
        `Role: ${exp.role}`,
        `Company: ${exp.company}`,
        exp.duration && `Duration: ${exp.duration}`,
        exp.location && `Location: ${exp.location}`,
        Array.isArray(exp.description) && exp.description.length
          ? `Highlights:\n${exp.description.map((d) => `- ${d}`).join("\n")}`
          : null,
      ]);
      if (text) chunks.push({ id: `exp-${i}`, source: `Experience · ${exp.company}`, text });
    });
  }

  if (Array.isArray(data.projects)) {
    data.projects.forEach((proj, i) => {
      if (!proj) return;
      const text = joinTruthy([
        `Project: ${proj.name}`,
        proj.description && `Description: ${proj.description}`,
        Array.isArray(proj.tech_stack) && proj.tech_stack.length
          ? `Tech Stack: ${proj.tech_stack.join(", ")}`
          : null,
        proj.github && `GitHub: ${proj.github}`,
        proj.live && `Live Demo: ${proj.live}`,
      ]);
      if (text) chunks.push({ id: `proj-${i}`, source: `Projects · ${proj.name}`, text });
    });
  }

  if (Array.isArray(data.education)) {
    data.education.forEach((edu, i) => {
      if (!edu) return;
      const text = joinTruthy([
        `Institution: ${edu.institution}`,
        `Degree: ${edu.degree}`,
        edu.field && `Field: ${edu.field}`,
        edu.duration && `Duration: ${edu.duration}`,
        edu.gpa && `GPA: ${edu.gpa}`,
      ]);
      if (text) chunks.push({ id: `edu-${i}`, source: `Education · ${edu.institution}`, text });
    });
  }

  if (Array.isArray(data.core_stack) && data.core_stack.length > 0) {
    chunks.push({
      id: "core-stack",
      source: "Core Stack",
      text: `Core Stack: ${data.core_stack.join(", ")}`,
    });
  }

  if (Array.isArray(data.stats) && data.stats.length > 0) {
    chunks.push({
      id: "stats",
      source: "Highlights",
      text: "Notable stats: " + data.stats.map((s) => `${s.val} ${s.label}`).join(", "),
    });
  }

  return chunks;
}

/* ------------------------------ RETRIEVAL ------------------------------ */

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "about", "can", "could", "does", "do", "for",
  "from", "have", "has", "her", "his", "how", "is", "their", "the", "they",
  "tell", "them", "this", "that", "what", "which", "who", "why", "with",
  "you", "your", "portfolio", "resume", "me", "my", "will", "would",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function scoreChunk(chunk: Chunk, queryTokens: string[]): number {
  if (queryTokens.length === 0) return 0;
  // Score against the source label too, so queries like "skills" match the
  // "Skills · Languages" chunk even when the chunk text lacks the keyword.
  const tokens = new Set(tokenize(`${chunk.source} ${chunk.text}`));

  let matches = 0;
  for (const t of queryTokens) {
    // Direct token match
    if (tokens.has(t)) {
      matches += 1;
      continue;
    }
    // Fuzzy: chunk token containing the query token as a stem (e.g. "react" vs "react.js")
    if (Array.from(tokens).some((ct) => ct.startsWith(t) || t.startsWith(ct))) {
      matches += 0.5;
    }
  }

  return matches / queryTokens.length;
}

export function retrieveRelevantChunks(
  data: PortfolioData,
  query: string,
  k = 5,
): RetrievalResult {
  const chunks = chunkPortfolio(data);
  if (chunks.length === 0) return { chunks: [], context: "" };

  const rawTokens = tokenize(query);
  const queryTokens = rawTokens.filter((t) => !STOP_WORDS.has(t));

  const scored = chunks
    .map((chunk) => ({ chunk, score: scoreChunk(chunk, queryTokens) }))
    .sort((a, b) => b.score - a.score);

  const matched = scored.filter((s) => s.score > 0);

  // RAG: use only relevant chunks when we have a match. If nothing matched
  // (e.g. a broad question like "tell me about them"), fall back to the whole
  // document — portfolios are small enough that this keeps answers grounded.
  const selected =
    matched.length > 0 ? matched.slice(0, k).map((s) => s.chunk) : chunks;

  const context = selected.map((c) => c.text).join("\n\n");

  return { chunks: selected, context };
}
