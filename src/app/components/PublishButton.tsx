"use client";

import { useState } from "react";
import styles from "./PublishButton.module.css";

export default function PublishButton({
  isPublished,
  username,
  selectedTheme,
  onToggle,
}: {
  isPublished: boolean;
  username: string | null;
  selectedTheme: string;
  onToggle: (published: boolean) => void;
}) {
  const [toggling, setToggling] = useState(false);
  const [published, setPublished] = useState(isPublished);
  const [copied, setCopied] = useState(false);

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL;

  const portfolioUrl = `${baseUrl}/p/${username}`;

  const handleToggle = async () => {
    setToggling(true);
    try {
      const newState = !published;
      await onToggle(newState);
      setPublished(newState);
    } catch (err) {
      console.error("Failed to toggle publish:", err);
    } finally {
      setToggling(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const input = document.createElement("input");
      input.value = portfolioUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Status card */}
      <div
        className={`${styles.statusCard} ${published ? styles.live : styles.draft}`}
      >
        <div className={styles.statusHeader}>
          <div className={styles.statusDot}>
            <span
              className={`${styles.dot} ${published ? styles.dotLive : styles.dotDraft}`}
            />
          </div>
          <div className={styles.statusInfo}>
            <h3 className={styles.statusTitle}>
              {published ? "Your portfolio is live!" : "Your portfolio is ready"}
            </h3>
            <p className={styles.statusSub}>
              {published
                ? "Anyone with the link can view your portfolio"
                : "Click publish to make it public"}
            </p>
          </div>
        </div>

        {/* URL bar */}
        {username && (
          <div className={styles.urlBar}>
            <span className={styles.urlText}>{portfolioUrl}</span>
            <button
              className={styles.copyButton}
              onClick={handleCopy}
              title="Copy URL"
            >
              {copied ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3.5 8L6.5 11L12.5 5"
                    stroke="var(--success)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect
                    x="5"
                    y="5"
                    width="8"
                    height="8"
                    rx="1.5"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                  <path
                    d="M3 11V3.5C3 3.22 3.22 3 3.5 3H11"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          </div>
        )}

        {/* Theme label */}
        <div className={styles.themeBadge}>
          Theme: <strong>{selectedTheme}</strong>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            className={`${styles.publishButton} ${published ? styles.unpublishButton : ""}`}
            onClick={handleToggle}
            disabled={toggling}
          >
            {toggling ? (
              <span className={styles.spinner} />
            ) : published ? (
              "Unpublish"
            ) : (
              "🚀 Publish now"
            )}
          </button>

          {published && username && (
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.viewButton}
            >
              View portfolio ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
