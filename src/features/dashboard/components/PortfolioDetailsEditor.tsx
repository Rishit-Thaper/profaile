"use client";

import { useState } from "react";
import type { PortfolioData } from "@/app/types";
import { prepareProfileDataForSave } from "@/features/profile/utils/profile-editor";
import PersonalInfoSection from "@/features/profile/components/editor/PersonalInfoSection";
import SkillsSection from "@/features/profile/components/editor/SkillsSection";
import ExperienceSection from "@/features/profile/components/editor/ExperienceSection";
import ProjectsSection from "@/features/profile/components/editor/ProjectsSection";
import EducationSection from "@/features/profile/components/editor/EducationSection";
import OtherSection from "@/features/profile/components/editor/OtherSection";
import styles from "./PortfolioDetailsEditor.module.css";

type Tab = "Personal" | "Skills" | "Experience" | "Projects" | "Education" | "Other";
const tabs: Tab[] = ["Personal", "Skills", "Experience", "Projects", "Education", "Other"];

export function PortfolioDetailsEditor({ initialData, onSave, onCancel }: {
  initialData: PortfolioData;
  onSave: (data: PortfolioData) => Promise<void>;
  onCancel: () => void;
}) {
  const [data, setData] = useState(initialData);
  const [tab, setTab] = useState<Tab>("Personal");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const dirty = JSON.stringify(data) !== JSON.stringify(initialData);

  const uploadPhoto = async (file: File) => {
    setUploading(true); setError("");
    try {
      const form = new FormData();
      form.append("photo", file);
      const response = await fetch("/api/profile/photo", { method: "POST", body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not upload photo");
      setData((current) => ({ ...current, personal_info: { ...current.personal_info, photo: result.url, photo_visible: true } }));
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not upload photo"); }
    finally { setUploading(false); }
  };
  const save = async () => {
    setSaving(true); setError("");
    try { await onSave(prepareProfileDataForSave(data)); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not save details"); }
    finally { setSaving(false); }
  };

  return <div className={styles.editor}>
    <div className={styles.header}><div><h3>Edit portfolio details</h3><p>Changes stay in your private draft until you go live.</p></div><button type="button" onClick={onCancel} disabled={saving}>Back to review</button></div>
    <div className={styles.tabs} role="tablist" aria-label="Portfolio detail sections">
      {tabs.map((item) => <button key={item} type="button" role="tab" aria-selected={tab === item} onClick={() => setTab(item)} className={tab === item ? styles.active : ""}>{item}</button>)}
    </div>
    <div className={styles.fields}>
      {tab === "Personal" && <PersonalInfoSection personalInfo={data.personal_info} uploading={uploading} onUpdate={(field, value) => setData((current) => ({ ...current, personal_info: { ...current.personal_info, [field]: value } }))} onUpload={(file) => void uploadPhoto(file)} onRemove={() => setData((current) => ({ ...current, personal_info: { ...current.personal_info, photo: "", photo_visible: false } }))} />}
      {tab === "Skills" && <SkillsSection skills={data.skills} onUpdate={(field, value) => setData((current) => ({ ...current, skills: { ...current.skills, [field]: value.split(",").map((part) => part.trim()).filter(Boolean) } }))} />}
      {tab === "Experience" && <ExperienceSection experiences={data.experience ?? []} onChange={(experience) => setData((current) => ({ ...current, experience }))} />}
      {tab === "Projects" && <ProjectsSection projects={data.projects ?? []} onChange={(projects) => setData((current) => ({ ...current, projects }))} />}
      {tab === "Education" && <EducationSection education={data.education ?? []} onChange={(education) => setData((current) => ({ ...current, education }))} />}
      {tab === "Other" && <OtherSection coreStack={data.core_stack ?? []} stats={data.stats ?? []} onCoreStackChange={(core_stack) => setData((current) => ({ ...current, core_stack }))} onStatsChange={(stats) => setData((current) => ({ ...current, stats }))} />}
    </div>
    <div className={styles.actions}>
      {error && <p role="alert">{error}</p>}
      <span>{dirty ? "Unsaved changes" : "No changes yet"}</span>
      <button type="button" onClick={() => void save()} disabled={!dirty || saving || uploading}>{saving ? "Saving..." : "Save details"}</button>
    </div>
  </div>;
}
