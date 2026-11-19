import { PersonalInfo, PortfolioData, Projects } from "@/app/types";

const PERSONAL_LINK_FIELDS: (keyof Pick<
  PersonalInfo,
  | "leetcode"
  | "codechef"
  | "codeforces"
  | "github"
  | "linkedin"
  | "behance"
  | "dribbble"
  | "figma"
  | "twitter"
  | "medium"
  | "youtube"
>)[] = [
  "leetcode",
  "codechef",
  "codeforces",
  "github",
  "linkedin",
  "behance",
  "dribbble",
  "figma",
  "twitter",
  "medium",
  "youtube",
];

const PROJECT_LINK_FIELDS: (keyof Pick<
  Projects,
  "github" | "live" | "behance" | "dribbble" | "figma" | "twitter" | "medium" | "youtube"
>)[] = ["github", "live", "behance", "dribbble", "figma", "twitter", "medium", "youtube"];

/**
 * Converts a pasted domain such as `github.com/octocat` into an absolute URL.
 * Only HTTP(S) destinations are returned, so profile data cannot create a
 * relative or executable link.
 */
export function normalizeExternalUrl(value?: string): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;

  const candidate = trimmed.startsWith("//")
    ? `https:${trimmed}`
    : /^[a-z][a-z\d+.-]*:/i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;

  try {
    const url = new URL(candidate);
    return url.hostname && (url.protocol === "http:" || url.protocol === "https:")
      ? url.href
      : undefined;
  } catch {
    return undefined;
  }
}

/** Normalizes every external profile/project link before it is rendered. */
export function normalizePortfolioExternalUrls(data: PortfolioData): PortfolioData {
  const personalInfo = { ...data.personal_info };
  for (const field of PERSONAL_LINK_FIELDS) {
    personalInfo[field] = normalizeExternalUrl(personalInfo[field]);
  }

  const projects = data.projects.map((project) => {
    const normalizedProject = { ...project };
    for (const field of PROJECT_LINK_FIELDS) {
      normalizedProject[field] = normalizeExternalUrl(normalizedProject[field]);
    }
    return normalizedProject;
  });

  return { ...data, personal_info: personalInfo, projects };
}
