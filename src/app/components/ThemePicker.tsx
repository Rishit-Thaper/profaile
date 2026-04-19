"use client";

import { useState } from "react";
import styles from "./ThemePicker.module.css";

const themes = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean dark aesthetic with Instrument Serif typography",
    colors: ["#0E0E0E", "#7FA688", "#E8E4DC"],
    preview: {
      bg: "#0E0E0E",
      accent: "#7FA688",
      text: "#E8E4DC",
      card: "#161616",
    },
  },
  {
    id: "modern",
    name: "Modern",
    description: "Warm tones with playful gradients and blob animations",
    colors: ["#FFFBF5", "#FF6B6B", "#5C6BC0"],
    preview: {
      bg: "#FFFBF5",
      accent: "#FF6B6B",
      text: "#1A1A2E",
      card: "#FFF5EE",
    },
  },
  {
    id: "professional",
    name: "Professional",
    description: "Rich forest greens with copper accents and custom cursor",
    colors: ["#0D1F16", "#C4622D", "#F5F0E8"],
    preview: {
      bg: "#0D1F16",
      accent: "#C4622D",
      text: "#F5F0E8",
      card: "#132B1E",
    },
  },
];

export default function ThemePicker({
  currentTheme,
  onSelect,
}: {
  currentTheme: string;
  onSelect: (theme: string) => void;
}) {
  const [selected, setSelected] = useState(currentTheme);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleSelect = (themeId: string) => {
    setSelected(themeId);
    onSelect(themeId);
  };

  return (
    <div className={styles.grid}>
      {themes.map((theme, i) => {
        const isSelected = selected === theme.id;
        const isHovered = hoveredId === theme.id;

        return (
          <button
            key={theme.id}
            className={`${styles.card} ${isSelected ? styles.selected : ""} animate-fade-in-up stagger-${i + 1}`}
            onClick={() => handleSelect(theme.id)}
            onMouseEnter={() => setHoveredId(theme.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Mini preview */}
            <div
              className={styles.preview}
              style={{ background: theme.preview.bg }}
            >
              {/* Mock navbar */}
              <div className={styles.mockNav}>
                <div
                  className={styles.mockNavDot}
                  style={{ background: theme.preview.accent }}
                />
                <div className={styles.mockNavLines}>
                  <span
                    style={{
                      background: theme.preview.text,
                      opacity: 0.4,
                    }}
                  />
                  <span
                    style={{
                      background: theme.preview.text,
                      opacity: 0.4,
                    }}
                  />
                  <span
                    style={{
                      background: theme.preview.text,
                      opacity: 0.4,
                    }}
                  />
                </div>
              </div>

              {/* Mock hero */}
              <div className={styles.mockHero}>
                <div
                  className={styles.mockTitle}
                  style={{
                    background: theme.preview.text,
                    opacity: 0.8,
                  }}
                />
                <div
                  className={styles.mockSubtitle}
                  style={{
                    background: theme.preview.accent,
                    opacity: 0.6,
                  }}
                />
                <div className={styles.mockParagraph}>
                  <span
                    style={{
                      background: theme.preview.text,
                      opacity: 0.2,
                    }}
                  />
                  <span
                    style={{
                      background: theme.preview.text,
                      opacity: 0.15,
                    }}
                  />
                </div>
              </div>

              {/* Mock cards */}
              <div className={styles.mockCards}>
                <div
                  className={styles.mockCard}
                  style={{ background: theme.preview.card }}
                />
                <div
                  className={styles.mockCard}
                  style={{ background: theme.preview.card }}
                />
              </div>

              {/* Hover glow */}
              {(isHovered || isSelected) && (
                <div
                  className={styles.previewGlow}
                  style={{
                    background: `radial-gradient(circle at center, ${theme.preview.accent}20 0%, transparent 70%)`,
                  }}
                />
              )}
            </div>

            {/* Info */}
            <div className={styles.info}>
              <div className={styles.infoHeader}>
                <h3 className={styles.name}>{theme.name}</h3>
                {isSelected && (
                  <span className={styles.selectedBadge}>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2.5 6L5 8.5L9.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Selected
                  </span>
                )}
              </div>
              <p className={styles.description}>{theme.description}</p>
              <div className={styles.colorDots}>
                {theme.colors.map((color, j) => (
                  <span
                    key={j}
                    className={styles.colorDot}
                    style={{ background: color }}
                  />
                ))}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
