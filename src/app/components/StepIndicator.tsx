"use client";

import styles from "./StepIndicator.module.css";

interface Step {
  key: string;
  label: string;
}

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

  return (
    <div className={styles.container}>
      {steps.map((step, i) => {
        const isActive = step.key === currentStep;
        const isCompleted = i < currentIndex;
        const isFuture = i > currentIndex;

        return (
          <button
            key={step.key}
            className={`${styles.step} ${isActive ? styles.active : ""} ${isCompleted ? styles.completed : ""} ${isFuture ? styles.future : ""}`}
            onClick={() => onStepClick(step.key)}
            disabled={isFuture}
          >
            <div className={styles.dot}>
              {isCompleted ? (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M2 5L4 7L8 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <span className={styles.dotInner} />
              )}
            </div>
            <span className={styles.label}>{step.label}</span>
            {i < steps.length - 1 && <div className={styles.connector} />}
          </button>
        );
      })}
    </div>
  );
}
