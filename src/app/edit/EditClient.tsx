"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DashboardHeader from "../components/DashboardHeader";
import { PortfolioData } from "../types";
import { useProfileQuery, useUpdateProfileMutation } from "@/hooks/useProfile";
import styles from "./EditClient.module.css";
import dashboardStyles from "../dashboard.module.css";
import "../dashboard-theme.css";

type TabKey = "Personal" | "Skills" | "Experience" | "Projects" | "Education" | "Other";

type StringPersonalField = Exclude<keyof PortfolioData["personal_info"], "photo_visible">;

const PERSONAL_FIELDS: { key: StringPersonalField; label: string; placeholder?: string }[] = [
  { key: "name", label: "Full Name", placeholder: "Jane Doe" },
  { key: "title", label: "Title", placeholder: "Software Engineer" },
  { key: "email", label: "Email", placeholder: "jane@example.com" },
  { key: "phone", label: "Phone", placeholder: "+1 555 000 0000" },
  { key: "location", label: "Location", placeholder: "San Francisco, CA" },
];

const SOCIAL_FIELDS: { key: StringPersonalField; label: string }[] = [
  { key: "github", label: "GitHub" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "twitter", label: "Twitter / X" },
  { key: "medium", label: "Medium" },
  { key: "youtube", label: "YouTube" },
  { key: "behance", label: "Behance" },
  { key: "dribbble", label: "Dribbble" },
  { key: "figma", label: "Figma" },
  { key: "leetcode", label: "LeetCode" },
  { key: "codechef", label: "CodeChef" },
  { key: "codeforces", label: "Codeforces" },
];

const SKILL_FIELDS: { key: keyof PortfolioData["skills"]; label: string }[] = [
  { key: "languages", label: "Languages" },
  { key: "frameworks", label: "Frameworks" },
  { key: "tools", label: "Tools" },
  { key: "databases", label: "Databases" },
];

function cleanArray(arr?: string[]): string[] {
  return arr?.map((s) => s.trim()).filter(Boolean) ?? [];
}

function isObjEmpty<T extends object>(obj: T): boolean {
  return Object.values(obj).every((v) => {
    if (Array.isArray(v)) return v.length === 0;
    return !v || String(v).trim().length === 0;
  });
}

export default function EditClient({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const [data, setData] = useState<PortfolioData | null>(null);
  const { data: profileMeta, isLoading: loading } = useProfileQuery();
  const updateProfileMutation = useUpdateProfileMutation();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("Personal");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [uploading, setUploading] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const savedSnapshot = useRef<string | null>(null);

  useEffect(() => {
    if (profileMeta?.portfolio_data && !data) {
      setData(profileMeta.portfolio_data);
      savedSnapshot.current = JSON.stringify(profileMeta.portfolio_data);
    }
  }, [profileMeta, data]);

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

    const cleanData = JSON.parse(JSON.stringify(data)) as PortfolioData;

    if (cleanData.skills) {
      cleanData.skills.languages = cleanArray(cleanData.skills.languages);
      cleanData.skills.frameworks = cleanArray(cleanData.skills.frameworks);
      cleanData.skills.tools = cleanArray(cleanData.skills.tools);
      cleanData.skills.databases = cleanArray(cleanData.skills.databases);
    }
    if (cleanData.core_stack) cleanData.core_stack = cleanArray(cleanData.core_stack);

    cleanData.projects?.forEach((p) => {
      p.tech_stack = cleanArray(p.tech_stack);
    });

    if (cleanData.experience) cleanData.experience = cleanData.experience.filter((exp) => !isObjEmpty(exp));
    if (cleanData.projects) cleanData.projects = cleanData.projects.filter((proj) => !isObjEmpty(proj));
    if (cleanData.education) cleanData.education = cleanData.education.filter((edu) => !isObjEmpty(edu));
    if (cleanData.stats) cleanData.stats = cleanData.stats.filter((stat) => !isObjEmpty(stat));

    setData(cleanData);

    try {
      await updateProfileMutation.mutateAsync({ portfolio_data: cleanData });
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
        // ignore storage cleanup errors — the field is cleared regardless
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

  if (loading) {
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

  if (!data) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyCard}>
          <h2 className={styles.emptyTitle}>No portfolio data found</h2>
          <p className={styles.emptyDesc}>Upload a resume first to start editing your portfolio.</p>
          <button className={dashboardStyles.primaryButton} onClick={() => router.push("/")}>
            Go to dashboard →
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
        isPublished={profileMeta?.is_published ?? false}
        username={profileMeta?.username ?? null}
      />

      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <button onClick={() => router.push("/")} className={styles.backButton} aria-label="Back to dashboard">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M10 3.5 5.5 8 10 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div>
              <h1 className={styles.title}>Edit Profile</h1>
              <p className={styles.subtitle}>Fine-tune everything your visitors will see.</p>
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
            <div className={styles.formSection}>
              <div className={styles.photoSection}>
                <div className={styles.photoPreviewWrap}>
                  {data.personal_info.photo ? (
                    <Image
                      src={data.personal_info.photo}
                      alt="Profile photo preview"
                      width={160}
                      height={160}
                      className={styles.photoPreview}
                    />
                  ) : (
                    <div className={styles.photoPlaceholder} aria-hidden>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M4.5 20c1.2-4.2 4-6 7.5-6s6.3 1.8 7.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className={styles.photoControls}>
                  <div className={styles.photoLabel}>Profile photo</div>
                  <p className={styles.photoHint}>JPG, PNG, WebP or AVIF — up to 5MB.</p>
                  <div className={styles.photoActions}>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      className={styles.photoInputHidden}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePhotoUpload(file);
                        e.target.value = "";
                      }}
                    />
                    <button
                      type="button"
                      className={styles.photoUploadButton}
                      onClick={() => photoInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading
                        ? "Uploading..."
                        : data.personal_info.photo
                          ? "Replace photo"
                          : "Upload photo"}
                    </button>
                    {data.personal_info.photo && (
                      <button
                        type="button"
                        className={styles.photoRemoveButton}
                        onClick={handlePhotoRemove}
                        disabled={uploading}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <label className={styles.photoToggle}>
                    <input
                      type="checkbox"
                      className={styles.photoToggleInput}
                      checked={data.personal_info.photo_visible !== false}
                      onChange={(e) => updatePersonal("photo_visible", e.target.checked)}
                    />
                    <span className={styles.toggleTrack} aria-hidden>
                      <span className={styles.toggleThumb} />
                    </span>
                    <span className={styles.photoToggleLabel}>Show photo in my portfolio</span>
                  </label>
                </div>
              </div>

              <div className={styles.divider}>
                <span className={styles.dividerLine} />
                <span className={styles.dividerLabel}>Basic Info</span>
                <span className={styles.dividerLine} />
              </div>

              <div className={styles.formGrid}>
                {PERSONAL_FIELDS.map((field) => (
                  <div className={styles.field} key={field.key}>
                    <label className={styles.label} htmlFor={`pf-${field.key}`}>{field.label}</label>
                    <input
                      id={`pf-${field.key}`}
                      className={styles.input}
                      value={data.personal_info[field.key] ?? ""}
                      placeholder={field.placeholder}
                      onChange={(e) => updatePersonal(field.key, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className={styles.divider}>
                <span className={styles.dividerLine} />
                <span className={styles.dividerLabel}>Social Links</span>
                <span className={styles.dividerLine} />
              </div>

              <div className={styles.formGrid}>
                {SOCIAL_FIELDS.map((field) => (
                  <div className={styles.field} key={field.key}>
                    <label className={styles.label} htmlFor={`pf-${field.key}`}>{field.label}</label>
                    <div className={styles.inputIconWrap}>
                      <span className={styles.inputIcon} aria-hidden>
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                          <path d="M8 2.5a5.5 5.5 0 1 0 5.5 5.5A5.5 5.5 0 0 0 8 2.5ZM2.9 8h10.2M8 2.5c1.2 1.4 1.9 3.4 1.9 5.5S9.2 12.1 8 13.5c-1.2-1.4-1.9-3.4-1.9-5.5S6.8 3.9 8 2.5Z" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                      </span>
                      <input
                        id={`pf-${field.key}`}
                        className={styles.inputWithIcon}
                        value={data.personal_info[field.key] ?? ""}
                        placeholder={`${field.label.toLowerCase()} username or URL`}
                        onChange={(e) => updatePersonal(field.key, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Skills" && (
            <div className={styles.formSection}>
              <p className={styles.hint}>Enter comma-separated values.</p>
              <div className={styles.formGrid}>
                {SKILL_FIELDS.map((field) => (
                  <div className={styles.field} key={field.key}>
                    <label className={styles.label} htmlFor={`sk-${field.key}`}>{field.label}</label>
                    <textarea
                      id={`sk-${field.key}`}
                      className={styles.textarea}
                      value={(data.skills[field.key] ?? []).join(", ")}
                      placeholder="React, TypeScript, Node.js"
                      onChange={(e) => updateSkill(field.key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Experience" && (
            <div className={styles.formSection}>
              {(data.experience ?? []).map((exp, index) => (
                <div className={styles.arrayItem} key={index}>
                  <div className={styles.arrayItemHeader}>
                    <span className={styles.arrayItemBadge}>Experience {index + 1}</span>
                    <button
                      className={styles.removeButton}
                      onClick={() =>
                        setData({
                          ...data,
                          experience: data.experience.filter((_, i) => i !== index),
                        })
                      }
                      aria-label="Remove experience"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M2.5 4h11M6.5 4V2.8a.8.8 0 0 1 .8-.8h1.4a.8.8 0 0 1 .8.8V4M4 4l.6 9a1 1 0 0 0 1 .9h4.8a1 1 0 0 0 1-.9L12 4M6.5 7v4.5M9.5 7v4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Remove
                    </button>
                  </div>
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <label className={styles.label}>Company</label>
                      <input
                        className={styles.input}
                        value={exp.company ?? ""}
                        onChange={(e) => {
                          const next = [...data.experience];
                          next[index] = { ...next[index], company: e.target.value };
                          setData({ ...data, experience: next });
                        }}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Role</label>
                      <input
                        className={styles.input}
                        value={exp.role ?? ""}
                        onChange={(e) => {
                          const next = [...data.experience];
                          next[index] = { ...next[index], role: e.target.value };
                          setData({ ...data, experience: next });
                        }}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Duration</label>
                      <input
                        className={styles.input}
                        value={exp.duration ?? ""}
                        placeholder="Jan 2022 — Present"
                        onChange={(e) => {
                          const next = [...data.experience];
                          next[index] = { ...next[index], duration: e.target.value };
                          setData({ ...data, experience: next });
                        }}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Location</label>
                      <input
                        className={styles.input}
                        value={exp.location ?? ""}
                        onChange={(e) => {
                          const next = [...data.experience];
                          next[index] = { ...next[index], location: e.target.value };
                          setData({ ...data, experience: next });
                        }}
                      />
                    </div>
                    <div className={`${styles.field} ${styles.fieldFull}`}>
                      <label className={styles.label}>Description (points, separated by &quot;|&quot;)</label>
                      <textarea
                        className={styles.textarea}
                        value={(exp.description ?? []).join(" | ")}
                        onChange={(e) => {
                          const next = [...data.experience];
                          next[index] = { ...next[index], description: e.target.value.split("|").map((s) => s.trim()) };
                          setData({ ...data, experience: next });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                className={styles.addButton}
                onClick={() =>
                  setData({
                    ...data,
                    experience: [...(data.experience ?? []), { company: "", role: "", duration: "", location: "", description: [] }],
                  })
                }
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                Add Experience
              </button>
            </div>
          )}

          {activeTab === "Projects" && (
            <div className={styles.formSection}>
              {(data.projects ?? []).map((proj, index) => (
                <div className={styles.arrayItem} key={index}>
                  <div className={styles.arrayItemHeader}>
                    <span className={styles.arrayItemBadge}>Project {index + 1}</span>
                    <button
                      className={styles.removeButton}
                      onClick={() =>
                        setData({
                          ...data,
                          projects: data.projects.filter((_, i) => i !== index),
                        })
                      }
                      aria-label="Remove project"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M2.5 4h11M6.5 4V2.8a.8.8 0 0 1 .8-.8h1.4a.8.8 0 0 1 .8.8V4M4 4l.6 9a1 1 0 0 0 1 .9h4.8a1 1 0 0 0 1-.9L12 4M6.5 7v4.5M9.5 7v4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Remove
                    </button>
                  </div>
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <label className={styles.label}>Project Name</label>
                      <input
                        className={styles.input}
                        value={proj.name ?? ""}
                        onChange={(e) => {
                          const next = [...data.projects];
                          next[index] = { ...next[index], name: e.target.value };
                          setData({ ...data, projects: next });
                        }}
                      />
                    </div>
                    <div className={`${styles.field} ${styles.fieldFull}`}>
                      <label className={styles.label}>Description</label>
                      <textarea
                        className={styles.textarea}
                        value={proj.description ?? ""}
                        onChange={(e) => {
                          const next = [...data.projects];
                          next[index] = { ...next[index], description: e.target.value };
                          setData({ ...data, projects: next });
                        }}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Tech Stack</label>
                      <input
                        className={styles.input}
                        value={(proj.tech_stack ?? []).join(", ")}
                        placeholder="React, Node.js"
                        onChange={(e) => {
                          const next = [...data.projects];
                          next[index] = { ...next[index], tech_stack: e.target.value.split(",").map((s) => s.trim()) };
                          setData({ ...data, projects: next });
                        }}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>GitHub URL</label>
                      <input
                        className={styles.input}
                        value={proj.github ?? ""}
                        placeholder="https://github.com/..."
                        onChange={(e) => {
                          const next = [...data.projects];
                          next[index] = { ...next[index], github: e.target.value };
                          setData({ ...data, projects: next });
                        }}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Live URL</label>
                      <input
                        className={styles.input}
                        value={proj.live ?? ""}
                        placeholder="https://..."
                        onChange={(e) => {
                          const next = [...data.projects];
                          next[index] = { ...next[index], live: e.target.value };
                          setData({ ...data, projects: next });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                className={styles.addButton}
                onClick={() =>
                  setData({
                    ...data,
                    projects: [...(data.projects ?? []), { name: "", description: "", tech_stack: [] }],
                  })
                }
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                Add Project
              </button>
            </div>
          )}

          {activeTab === "Education" && (
            <div className={styles.formSection}>
              {(data.education ?? []).map((edu, index) => (
                <div className={styles.arrayItem} key={index}>
                  <div className={styles.arrayItemHeader}>
                    <span className={styles.arrayItemBadge}>Education {index + 1}</span>
                    <button
                      className={styles.removeButton}
                      onClick={() =>
                        setData({
                          ...data,
                          education: data.education.filter((_, i) => i !== index),
                        })
                      }
                      aria-label="Remove education"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M2.5 4h11M6.5 4V2.8a.8.8 0 0 1 .8-.8h1.4a.8.8 0 0 1 .8.8V4M4 4l.6 9a1 1 0 0 0 1 .9h4.8a1 1 0 0 0 1-.9L12 4M6.5 7v4.5M9.5 7v4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Remove
                    </button>
                  </div>
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <label className={styles.label}>Institution</label>
                      <input
                        className={styles.input}
                        value={edu.institution ?? ""}
                        onChange={(e) => {
                          const next = [...data.education];
                          next[index] = { ...next[index], institution: e.target.value };
                          setData({ ...data, education: next });
                        }}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Degree</label>
                      <input
                        className={styles.input}
                        value={edu.degree ?? ""}
                        onChange={(e) => {
                          const next = [...data.education];
                          next[index] = { ...next[index], degree: e.target.value };
                          setData({ ...data, education: next });
                        }}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Field</label>
                      <input
                        className={styles.input}
                        value={edu.field ?? ""}
                        onChange={(e) => {
                          const next = [...data.education];
                          next[index] = { ...next[index], field: e.target.value };
                          setData({ ...data, education: next });
                        }}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Duration</label>
                      <input
                        className={styles.input}
                        value={edu.duration ?? ""}
                        placeholder="2018 — 2022"
                        onChange={(e) => {
                          const next = [...data.education];
                          next[index] = { ...next[index], duration: e.target.value };
                          setData({ ...data, education: next });
                        }}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>GPA</label>
                      <input
                        className={styles.input}
                        value={edu.gpa ?? ""}
                        onChange={(e) => {
                          const next = [...data.education];
                          next[index] = { ...next[index], gpa: e.target.value };
                          setData({ ...data, education: next });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                className={styles.addButton}
                onClick={() =>
                  setData({
                    ...data,
                    education: [...(data.education ?? []), { institution: "", degree: "", field: "", duration: "" }],
                  })
                }
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                Add Education
              </button>
            </div>
          )}

          {activeTab === "Other" && (
            <div className={styles.formSection}>
              <div className={styles.formGrid}>
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label className={styles.label}>Core Stack</label>
                  <p className={styles.hint}>Enter comma-separated values.</p>
                  <input
                    className={styles.input}
                    value={(data.core_stack ?? []).join(", ")}
                    placeholder="TypeScript, React, Postgres"
                    onChange={(e) =>
                      setData({
                        ...data,
                        core_stack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                  />
                </div>
              </div>

              <div className={styles.divider}>
                <span className={styles.dividerLine} />
                <span className={styles.dividerLabel}>Stats</span>
                <span className={styles.dividerLine} />
              </div>

              {(data.stats ?? []).map((stat, index) => (
                <div className={styles.arrayItem} key={index}>
                  <div className={styles.arrayItemHeader}>
                    <span className={styles.arrayItemBadge}>Stat {index + 1}</span>
                    <button
                      className={styles.removeButton}
                      onClick={() =>
                        setData({
                          ...data,
                          stats: data.stats?.filter((_, i) => i !== index),
                        })
                      }
                      aria-label="Remove stat"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M2.5 4h11M6.5 4V2.8a.8.8 0 0 1 .8-.8h1.4a.8.8 0 0 1 .8.8V4M4 4l.6 9a1 1 0 0 0 1 .9h4.8a1 1 0 0 0 1-.9L12 4M6.5 7v4.5M9.5 7v4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Remove
                    </button>
                  </div>
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <label className={styles.label}>Label</label>
                      <input
                        className={styles.input}
                        value={stat.label ?? ""}
                        placeholder="Years of experience"
                        onChange={(e) => {
                          const next = [...(data.stats ?? [])];
                          next[index] = { ...next[index], label: e.target.value };
                          setData({ ...data, stats: next });
                        }}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>Value</label>
                      <input
                        className={styles.input}
                        value={stat.val ?? ""}
                        placeholder="5+"
                        onChange={(e) => {
                          const next = [...(data.stats ?? [])];
                          next[index] = { ...next[index], val: e.target.value };
                          setData({ ...data, stats: next });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                className={styles.addButton}
                onClick={() =>
                  setData({
                    ...data,
                    stats: [...(data.stats ?? []), { label: "", val: "" }],
                  })
                }
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                Add Stat
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Sticky save bar */}
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
