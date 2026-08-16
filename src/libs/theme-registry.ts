export const THEME_IDS = [
  "minimal",
  "modern",
  "professional",
  "neon",
  "elegant",
  "vibrant",
  "terminal",
] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export function isValidTheme(value: unknown): value is ThemeId {
  return typeof value === "string" && (THEME_IDS as readonly string[]).includes(value);
}
