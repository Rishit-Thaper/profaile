"use client";

import { useState } from "react";
import "./dashboard-theme.css";
import ResumeUploader from "./components/ResumeUploader";
import ThemePicker from "./components/ThemePicker";
import UsernameInput from "./components/UsernameInput";
import PublishButton from "./components/PublishButton";
import DashboardHeader from "./components/DashboardHeader";
import StepIndicator from "./components/StepIndicator";
import ParsedDataPreview from "./components/ParsedDataPreview";
import styles from "./dashboard.module.css";

import { useProfileQuery, useUpdateProfileMutation, Profile } from "@/hooks/useProfile";

type Step = "upload" | "preview" | "theme" | "username" | "publish";

const STEP_ORDER: Step[] = ["upload", "preview", "theme", "username", "publish"];
const STEP_HEADINGS: Record<Step, { eyebrow: string; title: string; accent: string; desc: string }> = {
  upload: {
    eyebrow: "Step 1 of 5",
    title: "Upload your resume",
    accent: "resume",
    desc: "Drop your PDF or DOCX — our AI will extract everything in seconds.",
  },
  preview: {
    eyebrow: "Step 2 of 5",
    title: "Here's what we extracted",
    accent: "extracted",
    desc: "Review the parsed data from your resume. You can always re-upload later.",
  },
  theme: {
    eyebrow: "Step 3 of 5",
    title: "Choose your theme",
    accent: "theme",
    desc: "Pick a design that represents you. Each theme is fully responsive.",
  },
  username: {
    eyebrow: "Step 4 of 5",
    title: "Claim your URL",
    accent: "URL",
    desc: "Pick a unique username for your portfolio link.",
  },
  publish: {
    eyebrow: "Step 5 of 5",
    title: "Go live",
    accent: "live",
    desc: "Your portfolio is ready. Hit publish to share it with the world.",
  },
};

function deriveStep(p: Profile): Step {
  if (!p.portfolio_data || Object.keys(p.portfolio_data).length === 0) {
    return "upload";
  }
  if (!p.selected_theme) {
    return "theme";
  }
  if (!p.username) {
    return "username";
  }
  return "publish";
}

export default function DashboardClient({
  userEmail,
}: {
  userEmail: string;
}) {
  const { data: profile, isLoading: loading } = useProfileQuery();
  const updateProfileMutation = useUpdateProfileMutation();
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [initialStepApplied, setInitialStepApplied] = useState(false);

  if (profile && !initialStepApplied) {
    setInitialStepApplied(true);
    setCurrentStep(deriveStep(profile));
  }

  async function updateProfile(updates: Partial<Profile>) {
    return updateProfileMutation.mutateAsync(updates);
  }

  function handleUploadComplete() {
    if (profile) {
      setCurrentStep("preview");
    }
  }

  function handlePreviewContinue() {
    setCurrentStep("theme");
  }

  async function handleThemeSelect(theme: string) {
    await updateProfile({ selected_theme: theme } as Partial<Profile>);
    setCurrentStep("username");
  }

  async function handleUsernameSet(username: string) {
    if (!username) {
      return;
    }
    await updateProfile({ username } as Partial<Profile>);
    setCurrentStep("publish");
  }

  async function handlePublishToggle(published: boolean) {
    await updateProfile({ is_published: published } as Partial<Profile>);
  }

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingMark} aria-hidden>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2 4.09 12.69a.5.5 0 0 0 .39.81H10l-1.05 8.03a.5.5 0 0 0 .86.42L20.45 10.9a.5.5 0 0 0-.39-.9H14l1.12-7.26A.5.5 0 0 0 13.78 2H13z" />
          </svg>
        </div>
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingText}>Setting things up...</p>
      </div>
    );
  }

  const steps: { key: Step; label: string }[] = STEP_ORDER.map((key) => ({
    key,
    label: STEP_HEADINGS[key].eyebrow.replace("Step ", "").replace(" of 5", ""),
  }));

  const currentStepIndex = STEP_ORDER.indexOf(currentStep);
  const meta = STEP_HEADINGS[currentStep];

  return (
    <div className={styles.dashboard}>
      <DashboardHeader
        email={userEmail}
        isPublished={profile?.is_published ?? false}
        username={profile?.username ?? null}
      />

      <main className={styles.main}>
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          onStepClick={(step) => {
            const s = step as Step;
            const targetIndex = STEP_ORDER.indexOf(s);
            // Only allow going back to completed steps
            if (targetIndex <= currentStepIndex) {
              setCurrentStep(s);
            }
          }}
        />

        <div className={styles.stepContent}>
          <div className={styles.stepCard}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowDot} />
              {meta.eyebrow}
            </div>
            <h2 className={styles.stepTitle}>
              {meta.title.split(" ").map((word, i) => {
                const last = meta.title.split(" ").length - 1;
                return i === last ? (
                  <span key={i} className="gradient-text">
                    {word}
                  </span>
                ) : (
                  <span key={i}>{word} </span>
                );
              })}
            </h2>
            <p className={styles.stepDescription}>{meta.desc}</p>

            {currentStep === "upload" && (
              <div className="animate-fade-in-up">
                <ResumeUploader onComplete={handleUploadComplete} />
                {profile?.portfolio_data &&
                  Object.keys(profile.portfolio_data).length > 0 && (
                    <button
                      className={styles.skipButton}
                      onClick={() => setCurrentStep("preview")}
                    >
                      Already uploaded? Skip to preview →
                    </button>
                  )}
              </div>
            )}

            {currentStep === "preview" && profile?.portfolio_data && (
              <div className="animate-fade-in-up">
                <ParsedDataPreview data={profile.portfolio_data} />
                <div className={styles.previewActions}>
                  <button
                    className={styles.secondaryButton}
                    onClick={() => setCurrentStep("upload")}
                  >
                    ← Re-upload
                  </button>
                  <button
                    className={styles.primaryButton}
                    onClick={handlePreviewContinue}
                  >
                    Looks good, pick a theme
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {currentStep === "theme" && (
              <div className="animate-fade-in-up">
                <ThemePicker
                  currentTheme={profile?.selected_theme ?? "minimal"}
                  onSelect={handleThemeSelect}
                />
              </div>
            )}

            {currentStep === "username" && (
              <div className="animate-fade-in-up">
                <UsernameInput
                  currentUsername={profile?.username ?? ""}
                  onSet={handleUsernameSet}
                />
              </div>
            )}

            {currentStep === "publish" && profile && (
              <div className="animate-fade-in-up">
                <PublishButton
                  isPublished={profile.is_published}
                  username={profile.username}
                  selectedTheme={profile.selected_theme}
                  onToggle={handlePublishToggle}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
