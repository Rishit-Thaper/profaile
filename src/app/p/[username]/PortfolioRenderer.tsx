"use client";

import { useState, type CSSProperties } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { PortfolioData } from "@/app/types";
import { normalizePortfolioExternalUrls } from "@/features/portfolio/utils/external-links";
import { updatePortfolio } from "@/features/portfolio/api/portfolio-client";
import { cardPalette, defaultAppearance, type Appearance } from "@/features/dashboard/card/card-themes";
import THEMES from "@/themes";
import PortfolioChat from "./PortfolioChat";
import styles from "./PortfolioRenderer.module.css";

const CHAT_ACCENTS: Record<string, string> = {
  minimal: "#7FA688", modern: "#FF6B6B", professional: "#C4622D",
  neon: "#6366f1", elegant: "#B08D57", vibrant: "#FF4D6D", terminal: "#00FF9C",
};

export default function PortfolioRenderer({ data, theme, username, slug, showChat = true, editablePortfolioId }: {
  data: PortfolioData;
  theme: string;
  username: string;
  slug?: string;
  showChat?: boolean;
  editablePortfolioId?: string;
}) {
  const [appearance, setAppearance] = useState<Appearance>(data.personal_info?.appearance ?? defaultAppearance(theme));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const ThemeComponent = THEMES[theme] || THEMES.minimal;
  const normalizedData = normalizePortfolioExternalUrls(data);
  const palette = cardPalette(theme, appearance);
  const style = { "--portfolio-bg": palette.bg, "--portfolio-surface": palette.surface, "--portfolio-text": palette.text, "--portfolio-muted": palette.muted, "--portfolio-accent": palette.accent } as CSSProperties;

  const changeAppearance = async (next: Appearance) => {
    setAppearance(next);
    setMessage("");
    if (!editablePortfolioId) return;
    setBusy(true);
    try {
      await updatePortfolio(editablePortfolioId, { draft_data: { ...data, personal_info: { ...data.personal_info, appearance: next } } });
      setMessage("Saved to draft");
    } catch {
      setAppearance(appearance);
      setMessage("Could not save appearance");
    } finally { setBusy(false); }
  };

  return <div className={styles.surface} data-portfolio-theme={theme} data-portfolio-appearance={appearance} style={style}>
    <ThemeComponent data={normalizedData} />
    <div className={styles.appearanceControl} aria-label="Portfolio appearance">
      <span>{editablePortfolioId ? "Draft appearance" : "Appearance"}</span>
      {(["light", "dark"] as const).map((mode) => <button type="button" key={mode} aria-pressed={appearance === mode} disabled={busy} onClick={() => void changeAppearance(mode)}>{mode === "light" ? <FiSun aria-hidden /> : <FiMoon aria-hidden />} {mode}</button>)}
      {message && <small role="status">{message}</small>}
    </div>
    {showChat && <PortfolioChat name={data.personal_info?.name || username} username={username} slug={slug} accent={CHAT_ACCENTS[theme] || "#6366f1"} />}
  </div>;
}
