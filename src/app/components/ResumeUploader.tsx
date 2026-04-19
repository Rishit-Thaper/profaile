"use client";

import { useState, useRef, useCallback } from "react";
import { PortfolioData } from "@/app/types";
import styles from "./ResumeUploader.module.css";

type UploadState = "idle" | "dragging" | "uploading" | "success" | "error";

export default function ResumeUploader({
  onComplete,
}: {
  onComplete: (data: PortfolioData) => void;
}) {
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!validTypes.includes(file.type)) {
        setState("error");
        setErrorMsg("Please upload a PDF or DOCX file.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setState("error");
        setErrorMsg("File size must be under 5MB.");
        return;
      }

      setFileName(file.name);
      setState("uploading");
      setProgress(0);

      // Simulate progress while waiting for API
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 300);

      try {
        const formData = new FormData();
        formData.append("resume", file);

        const res = await fetch("/api/parse-resume", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to parse resume");
        }

        const parsedData = await res.json();

        // Save to profile
        await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ portfolio_data: parsedData }),
        });

        setProgress(100);
        setState("success");

        setTimeout(() => {
          onComplete(parsedData as PortfolioData);
        }, 800);
      } catch (err) {
        clearInterval(progressInterval);
        setState("error");
        setErrorMsg(
          err instanceof Error ? err.message : "Something went wrong",
        );
      }
    },
    [onComplete],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setState("idle");
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState("dragging");
  }, []);

  const handleDragLeave = useCallback(() => {
    setState("idle");
  }, []);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRetry = () => {
    setState("idle");
    setErrorMsg("");
    setProgress(0);
    setFileName("");
  };

  return (
    <div className={styles.wrapper}>
      {state === "uploading" ? (
        <div className={`${styles.uploadZone} ${styles.uploading}`}>
          <div className={styles.uploadingContent}>
            <div className={styles.spinnerRing}>
              <svg viewBox="0 0 64 64" className={styles.spinnerSvg}>
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="var(--border-subtle)"
                  strokeWidth="3"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="176"
                  strokeDashoffset={176 - (176 * progress) / 100}
                  className={styles.progressCircle}
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#7c5cfc" />
                    <stop offset="100%" stopColor="#5cfcb5" />
                  </linearGradient>
                </defs>
              </svg>
              <span className={styles.progressText}>
                {Math.round(progress)}%
              </span>
            </div>
            <p className={styles.uploadingLabel}>
              Parsing <strong>{fileName}</strong>
            </p>
            <p className={styles.uploadingSub}>
              AI is extracting your skills, experience, and projects...
            </p>
          </div>
        </div>
      ) : state === "success" ? (
        <div className={`${styles.uploadZone} ${styles.success}`}>
          <div className={styles.successIcon}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="var(--success-bg)" />
              <path
                d="M10 16L14 20L22 12"
                stroke="var(--success)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className={styles.successLabel}>Resume parsed successfully!</p>
        </div>
      ) : state === "error" ? (
        <div className={`${styles.uploadZone} ${styles.error}`}>
          <div className={styles.errorIcon}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="var(--error-bg)" />
              <path
                d="M12 12L20 20M20 12L12 20"
                stroke="var(--error)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className={styles.errorLabel}>{errorMsg}</p>
          <button className={styles.retryButton} onClick={handleRetry}>
            Try again
          </button>
        </div>
      ) : (
        <div
          className={`${styles.uploadZone} ${state === "dragging" ? styles.dragging : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={handleInputChange}
            className={styles.hiddenInput}
          />

          <div className={styles.iconWrapper}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              className={styles.uploadIcon}
            >
              <rect
                x="2"
                y="2"
                width="36"
                height="36"
                rx="8"
                stroke="var(--border-default)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <path
                d="M20 14V26M14 20L20 14L26 20"
                stroke="var(--accent-primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className={styles.dropText}>
            <p className={styles.dropTitle}>
              Drop your resume here, or{" "}
              <span className={styles.browseLink}>browse</span>
            </p>
            <p className={styles.dropSubtext}>PDF or DOCX • Max 5MB</p>
          </div>
        </div>
      )}
    </div>
  );
}
