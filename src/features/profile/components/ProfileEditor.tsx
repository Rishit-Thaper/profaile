"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowRight } from "react-icons/fi";
import DashboardHeader from "@/features/dashboard/components/DashboardHeader";
import { PortfolioData } from "@/app/types";
import { routes } from "@/config/routes";
import { useProfileQuery } from "@/features/profile/hooks/useProfileQuery";
import { usePortfolioMutations, usePortfoliosQuery } from "@/features/portfolio/hooks/usePortfolioQueries";
import { prepareProfileDataForSave } from "../utils/profile-editor";
import PersonalInfoSection from "./editor/PersonalInfoSection";
import SkillsSection from "./editor/SkillsSection";
import ExperienceSection from "./editor/ExperienceSection";
import ProjectsSection from "./editor/ProjectsSection";
import EducationSection from "./editor/EducationSection";
import OtherSection from "./editor/OtherSection";
import styles from "./ProfileEditor.module.css";
import dashboardStyles from "@/app/dashboard.module.css";
import "@/app/dashboard-theme.css";

type TabKey = "Personal" | "Skills" | "Experience" | "Projects" | "Education" | "Other";

export default function ProfileEditor({ userEmail, portfolioId }: { userEmail: string; portfolioId?: string }) {
  const router = useRouter();
  const [data, setData] = useState<PortfolioData | null>(null);
  const { data: profileMeta, isLoading: loading } = useProfileQuery();
  const { data: portfolios = [], isLoading: portfoliosLoading } = usePortfoliosQuery();
  const portfolioMutations = usePortfolioMutations();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("Personal");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [uploading, setUploading] = useState(false);
  const savedSnapshot = useRef<string | null>(null);
  const selectedPortfolio = portfolios.find((portfolio) => portfolio.id === portfolioId) ?? portfolios[0] ?? null;
  const selectedPortfolioData = selectedPortfolio?.draft_data;

  useEffect(() => {
    if (selectedPortfolioData) {
      setData(selectedPortfolioData);
      savedSnapshot.current = JSON.stringify(selectedPortfolioData);
    }
  }, [selectedPortfolio?.id, selectedPortfolioData]);

  const dirty = useMemo(
    () => data !== null && savedSnapshot.current !== null && JSON.stringify(data) !== savedSnapshot.current,
    [data],
  );

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);

    const cleanData = prepareProfileDataForSave(data);

    setData(cleanData);

    try {
      if (!selectedPortfolio) return;
      await portfolioMutations.saveDraft.mutateAsync({
        id: selectedPortfolio.id,
        data: cleanData,
        theme: selectedPortfolio.draft_theme,
      });
      savedSnapshot.current = JSON.stringify(cleanData);
      showToast("Profile updated successfully!", "success");
    } catch {
      showToast("Error saving profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const updatePersonal = (field: keyof PortfolioData["personal_info"], value: string | boolean) => {
    setData((prev) => (prev ? { ...prev, personal_info: { ...prev.personal_info, [field]: value } } : prev));
  };

  const handlePhotoUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);
      const res = await fetch("/api/profile/photo", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      updatePersonal("photo", json.url);
      updatePersonal("photo_visible", true);
      showToast("Photo uploaded — click Save to apply it.", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoRemove = async () => {
    const current = data?.personal_info.photo;
    if (current) {
      try {
        await fetch("/api/profile/photo", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: current }),
        });
      } catch {
        // Storage cleanup is best-effort.
      }
    }
    updatePersonal("photo", "");
    updatePersonal("photo_visible", false);
  };

  const updateSkill = (field: keyof PortfolioData["skills"], value: string) => {
    setData((prev) =>
      prev
        ? {
          ...prev,
          skills: {
            ...prev.skills,
            [field]: value.split(",").map((s) => s.trim()).filter(Boolean),
          },
        }
        : prev,
    );
  };

  if (loading || portfoliosLoading) {
    return (
      <div className={dashboardStyles.loadingScreen}>
        <div className={dashboardStyles.loadingMark} aria-hidden>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2 4.09 12.69a.5.5 0 0 0 .39.81H10l-1.05 8.03a.5.5 0 0 0 .86.42L20.45 10.9a.5.5 0 0 0-.39-.9H14l1.12-7.26A.5.5 0 0 0 13.78 2H13z" />
          </svg>
        </div>
        <div className={dashboardStyles.loadingSpinner} />
        <p className={dashboardStyles.loadingText}>Loading editor...</p>
      </div>
    );
  }

  if (!data?.personal_info) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyCard}>
          <h2 className={styles.emptyTitle}>No portfolio data found</h2>
          <p className={styles.emptyDesc}>Upload a resume first to start editing your portfolio.</p>
          <button className={dashboardStyles.primaryButton} onClick={() => router.push(routes.dashboard)}>
            Go to dashboard <FiArrowRight aria-hidden />
          </button>
        </div>
      </div>
    );
  }

  const tabCounts: Record<TabKey, number> = {
    Personal: 0,
    Skills: 0,
    Experience: data.experience?.length ?? 0,
    Projects: data.projects?.length ?? 0,
    Education: data.education?.length ?? 0,
    Other: 0,
  };

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    {
      key: "Personal",
      label: "Personal",
      icon: (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="5" r="2.6" stroke="currentColor" strokeWidth="1.3" />
          <path d="M3 13.5c.6-2.6 2.6-4 5-4s4.4 1.4 5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      key: "Skills",
      label: "Skills",
      icon: (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M6 4.5a2.5 2.5 0 1 1 3.5 2.3l.5 3.7h-4l.5-3.7A2.5 2.5 0 0 1 6 4.5Z" stroke="currentColor" strokeWidth="1.3" />
          <path d="M8 2v1.5M8 12.5V14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      key: "Experience",
      label: "Experience",
      icon: (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <rect x="2.5" y="5.5" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M5.5 5.5V4a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1.5M2.5 9h11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      key: "Projects",
      label: "Projects",
      icon: (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M2.5 4.5a1 1 0 0 1 1-1h2l1 1.5h6a1 1 0 0 1 1 1v5.5a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-7Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      key: "Education",
      label: "Education",
      icon: (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M8 2.5 14.5 5.5 8 8.5 1.5 5.5 8 2.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M4.5 7v3.5c0 .8 1.6 1.5 3.5 1.5s3.5-.7 3.5-1.5V7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      key: "Other",
      label: "Other",
      icon: (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="4" cy="8" r="1.4" fill="currentColor" />
          <circle cx="8" cy="8" r="1.4" fill="currentColor" />
          <circle cx="12" cy="8" r="1.4" fill="currentColor" />
        </svg>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      {toast && (
        <div className={`${styles.toast} ${toast.type === "success" ? styles.toastSuccess : styles.toastError}`}>
          {toast.type === "success" ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" fill="var(--success-bg)" />
              <path d="M5 8.5 7 10.5 11 6" stroke="var(--success)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" fill="var(--error-bg)" />
              <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="var(--error)" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          )}
          {toast.message}
        </div>
      )}

      <DashboardHeader
        email={userEmail}
        isPublished={Boolean(selectedPortfolio?.published_version_id)}
        username={profileMeta?.username ?? null}
        portfolioSlug={selectedPortfolio?.slug}
        editProfileHref={selectedPortfolio ? routes.editProfileForPortfolio(selectedPortfolio.id) : routes.editProfile}
      />

      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <button onClick={() => router.push(routes.dashboard)} className={styles.backButton} aria-label="Back to dashboard">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M10 3.5 5.5 8 10 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div>
              <h1 className={styles.title}>Edit Profile</h1>
              <p className={styles.subtitle}>Editing {selectedPortfolio?.name ?? "your portfolio"} draft.</p>
            </div>
          </div>
        </div>

        <div className={styles.tabs} role="tablist" aria-label="Profile sections">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon}
              {tab.label}
              {tabCounts[tab.key] > 0 && <span className={styles.tabCount}>{tabCounts[tab.key]}</span>}
            </button>
          ))}
        </div>

        <div className={styles.section}>
          {activeTab === "Personal" && (
            <PersonalInfoSection
              personalInfo={data.personal_info}
              uploading={uploading}
              onUpdate={updatePersonal}
              onUpload={handlePhotoUpload}
              onRemove={handlePhotoRemove}
            />
          )}

          {activeTab === "Skills" && <SkillsSection skills={data.skills} onUpdate={updateSkill} />}

          {activeTab === "Experience" && (
            <ExperienceSection
              experiences={data.experience ?? []}
              onChange={(experience) => setData({ ...data, experience })}
            />
          )}

          {activeTab === "Projects" && (
            <ProjectsSection projects={data.projects ?? []} onChange={(projects) => setData({ ...data, projects })} />
          )}

          {activeTab === "Education" && (
            <EducationSection education={data.education ?? []} onChange={(education) => setData({ ...data, education })} />
          )}

          {activeTab === "Other" && (
            <OtherSection
              coreStack={data.core_stack ?? []}
              stats={data.stats ?? []}
              onCoreStackChange={(core_stack) => setData({ ...data, core_stack })}
              onStatsChange={(stats) => setData({ ...data, stats })}
            />
          )}
        </div>
      </main>

      <div className={styles.saveBar}>
        <div className={styles.saveBarInner}>
          <span className={`${styles.saveStatus} ${dirty ? styles.saveStatusDirty : ""}`}>
            <span className={`${styles.statusDot} ${dirty ? styles.statusDotDirty : ""}`} />
            {saving ? "Saving..." : dirty ? "Unsaved changes" : "All changes saved"}
          </span>
          <button className={styles.saveButton} onClick={handleSave} disabled={saving || !dirty}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
