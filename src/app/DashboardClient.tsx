"use client";

import { useState, useEffect, useCallback } from "react";
import { PortfolioData } from "@/app/types";
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

export default function DashboardClient({
  userEmail,
}: {
  userEmail: string;
}) {
  const { data: profile, isLoading: loading } = useProfileQuery();
  const updateProfileMutation = useUpdateProfileMutation();
  const [currentStep, setCurrentStep] = useState<Step>("upload");

  useEffect(() => {
    if (profile) {
      determineStep(profile);
    }
  }, [profile]);

  function determineStep(p: Profile) {
    if (
      !p.portfolio_data ||
      Object.keys(p.portfolio_data).length === 0
    ) {
      setCurrentStep("upload");
    } else if (!p.selected_theme) {
      setCurrentStep("theme");
    } else if (!p.username) {
      setCurrentStep("username");
    } else if (!p.is_published) {
      setCurrentStep("publish");
    } else {
      setCurrentStep("publish");
    }
  }

  async function updateProfile(updates: Partial<Profile>) {
    return updateProfileMutation.mutateAsync(updates);
  }

  function handleUploadComplete(data: PortfolioData) {
    if (profile) {
      // The update to DB is handled in ResumeUploader now, or we can rely on React Query refetching
      // But we immediately switch to preview step.
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
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingText}>Setting things up...</p>
      </div>
    );
  }

  const steps: { key: Step; label: string }[] = [
    { key: "upload", label: "Upload" },
    { key: "preview", label: "Preview" },
    { key: "theme", label: "Theme" },
    { key: "username", label: "Username" },
    { key: "publish", label: "Publish" },
  ];

  const stepOrder: Step[] = ["upload", "preview", "theme", "username", "publish"];
  const currentStepIndex = stepOrder.indexOf(currentStep);

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
            const targetIndex = stepOrder.indexOf(s);
            // Only allow going back to completed steps
            if (targetIndex <= currentStepIndex) {
              setCurrentStep(s);
            }
          }}
        />

        <div className={styles.stepContent}>
          {currentStep === "upload" && (
            <div className="animate-fade-in-up">
              <h2 className={styles.stepTitle}>
                Upload your <span className="gradient-text">resume</span>
              </h2>
              <p className={styles.stepDescription}>
                Drop your PDF or DOCX — our AI will extract everything in seconds.
              </p>
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
              <h2 className={styles.stepTitle}>
                Here&apos;s what we <span className="gradient-text">extracted</span>
              </h2>
              <p className={styles.stepDescription}>
                Review the parsed data from your resume. You can always re-upload later.
              </p>
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
                  Looks good, pick a theme →
                </button>
              </div>
            </div>
          )}

          {currentStep === "theme" && (
            <div className="animate-fade-in-up">
              <h2 className={styles.stepTitle}>
                Choose your <span className="gradient-text">theme</span>
              </h2>
              <p className={styles.stepDescription}>
                Pick a design that represents you. Each theme is fully responsive.
              </p>
              <ThemePicker
                currentTheme={profile?.selected_theme ?? "minimal"}
                onSelect={handleThemeSelect}
              />
            </div>
          )}

          {currentStep === "username" && (
            <div className="animate-fade-in-up">
              <h2 className={styles.stepTitle}>
                Claim your <span className="gradient-text">URL</span>
              </h2>
              <p className={styles.stepDescription}>
                Pick a unique username for your portfolio link.
              </p>
              <UsernameInput
                currentUsername={profile?.username ?? ""}
                onSet={handleUsernameSet}
              />
            </div>
          )}

          {currentStep === "publish" && profile && (
            <div className="animate-fade-in-up">
              <h2 className={styles.stepTitle}>
                Go <span className="gradient-text">live</span>
              </h2>
              <p className={styles.stepDescription}>
                Your portfolio is ready. Hit publish to share it with the world.
              </p>
              <PublishButton
                isPublished={profile.is_published}
                username={profile.username}
                selectedTheme={profile.selected_theme}
                onToggle={handlePublishToggle}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
