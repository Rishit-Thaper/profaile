"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./UsernameInput.module.css";

export default function UsernameInput({
  currentUsername,
  onSet,
}: {
  currentUsername: string;
  onSet: (username: string) => void;
}) {
  const [value, setValue] = useState(currentUsername);
  const [status, setStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid"
  >("idle");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const checkAvailability = useCallback(async (username: string) => {
    if (username.length < 3) {
      setStatus("invalid");
      setError("At least 3 characters");
      return;
    }

    if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(username) && username.length > 2) {
      setStatus("invalid");
      setError("Lowercase letters, numbers, and hyphens only");
      return;
    }

    setStatus("checking");
    try {
      const res = await fetch(
        `/api/profile/check-username?username=${encodeURIComponent(username)}`,
      );
      const data = await res.json();

      if (data.available) {
        setStatus("available");
        setError("");
      } else {
        setStatus("taken");
        setError(data.error || "Username is already taken");
      }
    } catch {
      setStatus("invalid");
      setError("Failed to check availability");
    }
  }, []);

  useEffect(() => {
    if (!value || value === currentUsername) {
      setStatus("idle");
      setError("");
      return;
    }

    const timer = setTimeout(() => {
      checkAvailability(value);
    }, 400);

    return () => clearTimeout(timer);
  }, [value, currentUsername, checkAvailability]);

  const handleSubmit = async () => {
    if (status !== "available" && value !== currentUsername) return;

    setSaving(true);
    try {
      await onSet(value);
    } catch {
      setError("Failed to save username");
    } finally {
      setSaving(false);
    }
  };

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL;

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputGroup}>
        <span className={styles.prefix}>{baseUrl}/p/</span>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
          placeholder="your-name"
          className={styles.input}
          maxLength={30}
        />

        <div className={styles.statusIcon}>
          {status === "checking" && (
            <div className={styles.checkingSpinner} />
          )}
          {status === "available" && (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="9" fill="var(--success-bg)" />
              <path
                d="M5.5 9L7.5 11L12.5 6"
                stroke="var(--success)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {(status === "taken" || status === "invalid") && (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="9" fill="var(--error-bg)" />
              <path
                d="M6.5 6.5L11.5 11.5M11.5 6.5L6.5 11.5"
                stroke="var(--error)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {status === "available" && (
        <p className={styles.availableText}>
          ✨ This username is available!
        </p>
      )}

      <button
        className={styles.claimButton}
        disabled={
          (status !== "available" && value !== currentUsername) || saving
        }
        onClick={handleSubmit}
      >
        {saving ? (
          <span className={styles.savingSpinner} />
        ) : currentUsername ? (
          "Update username"
        ) : (
          "Claim this URL"
        )}
      </button>
    </div>
  );
}
