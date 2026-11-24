export type Appearance = "dark" | "light";

export const cardThemes = {
  minimal: { name: "Minimal", accent: "#7FA688", dark: { bg: "#111713", surface: "#1B241E", text: "#F1F4EE", muted: "#AAB9AB" }, light: { bg: "#F5F5F0", surface: "#FFFFFF", text: "#17251B", muted: "#526456" } },
  modern: { name: "Modern", accent: "#FF6B6B", dark: { bg: "#241B2A", surface: "#35283A", text: "#FFF5F0", muted: "#D7C3CE" }, light: { bg: "#FFFBF5", surface: "#FFF0F0", text: "#1A1A2E", muted: "#655C67" } },
  professional: { name: "Professional", accent: "#C4622D", dark: { bg: "#0D1F16", surface: "#183325", text: "#F5F0E8", muted: "#B8C3B9" }, light: { bg: "#F5F0E8", surface: "#FFFCF6", text: "#163122", muted: "#526A58" } },
  neon: { name: "Neon", accent: "#00D9EC", dark: { bg: "#0A0A12", surface: "#171827", text: "#EAF6FF", muted: "#A3A9C5" }, light: { bg: "#EEF8FC", surface: "#FFFFFF", text: "#152033", muted: "#56647A" } },
  elegant: { name: "Elegant", accent: "#A98647", dark: { bg: "#25211E", surface: "#352F2A", text: "#F7F0E6", muted: "#C6BBAA" }, light: { bg: "#FAF7F0", surface: "#FFFFFF", text: "#26221C", muted: "#756F66" } },
  vibrant: { name: "Vibrant", accent: "#FF4D6D", dark: { bg: "#17121F", surface: "#2B2034", text: "#FFF6F8", muted: "#D6C1CF" }, light: { bg: "#FFFFFF", surface: "#FFE3E9", text: "#111111", muted: "#575057" } },
  terminal: { name: "Terminal", accent: "#00E18A", dark: { bg: "#0D0D0D", surface: "#171B18", text: "#D4FFEA", muted: "#8FBBA3" }, light: { bg: "#F2FAF4", surface: "#FFFFFF", text: "#15281C", muted: "#55705D" } },
} as const;

export type CardThemeId = keyof typeof cardThemes;

export function isCardThemeId(value: string): value is CardThemeId {
  return value in cardThemes;
}

export function defaultAppearance(theme: string): Appearance {
  return ["modern", "elegant", "vibrant"].includes(theme) ? "light" : "dark";
}

export function cardPalette(theme: string, appearance: Appearance) {
  const entry = isCardThemeId(theme) ? cardThemes[theme] : cardThemes.minimal;
  return { ...entry[appearance], accent: entry.accent, name: entry.name };
}
