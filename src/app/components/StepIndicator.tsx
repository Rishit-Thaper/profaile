"use client";

import styles from "./StepIndicator.module.css";

interface Step {
  key: string;
  label: string;
}

const STEP_META: Record<string, { title: string; desc: string }> = {
  upload: { title: "Upload", desc: "Add your resume" },
  preview: { title: "Preview", desc: "Review your data" },
  theme: { title: "Theme", desc: "Pick a design" },
  username: { title: "URL", desc: "Claim your link" },
  publish: { title: "Publish", desc: "Go live" },
};

export default function StepIndicator({
  steps,
  currentStep,
  onStepClick,
}: {
  steps: Step[];
  currentStep: string;
  onStepClick: (step: string) => void;
}) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);
  const progress =
    steps.length > 1
      ? Math.max(0, Math.min(100, (currentIndex / (steps.length - 1)) * 100))
      : 100;

  return (
    <div className={styles.card}>
      <ol className={styles.track}>
        {steps.map((step, i) => {
          const meta = STEP_META[step.key];
          const isActive = step.key === currentStep;
          const isCompleted = i < currentIndex;
          const isFuture = i > currentIndex;

          return (
            <li
              key={step.key}
              className={`${styles.node} ${isActive ? styles.active : ""} ${isCompleted ? styles.completed : ""} ${isFuture ? styles.future : ""}`}
            >
              <button
                className={styles.stepButton}
                onClick={() => onStepClick(step.key)}
                disabled={isFuture}
                aria-current={isActive ? "step" : undefined}
              >
                <span className={styles.badge}>
                  {isCompleted ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                      <path
                        d="M3 7.5L6 10.5L11 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span className={styles.badgeNumber}>{i + 1}</span>
                  )}
                </span>
                <span className={styles.meta}>
                  <span className={styles.title}>{meta?.title ?? step.label}</span>
                  {meta?.desc && <span className={styles.desc}>{meta.desc}</span>}
                </span>
              </button>
              {i < steps.length - 1 && <span className={styles.connector} aria-hidden />}
            </li>
          );
        })}
      </ol>
      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
