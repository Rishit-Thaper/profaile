"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "../components/DashboardHeader";
import { PortfolioData } from "../types";
import { useProfileQuery, useUpdateProfileMutation } from "@/hooks/useProfile";
import styles from "./EditClient.module.css";
import dashboardStyles from "../dashboard.module.css";
import "../dashboard-theme.css";

const TABS = ["Personal", "Skills", "Experience", "Projects", "Education", "Other"];

export default function EditClient({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const [data, setData] = useState<PortfolioData | null>(null);
  const { data: profileMeta, isLoading: loading } = useProfileQuery();
  const updateProfileMutation = useUpdateProfileMutation();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (profileMeta?.portfolio_data && !data) {
      setData(profileMeta.portfolio_data);
    }
  }, [profileMeta, data]);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);

    const cleanData = JSON.parse(JSON.stringify(data)) as PortfolioData;
    const cleanArray = (arr?: string[]) => arr?.map(s => s.trim()).filter(Boolean) || [];

    if (cleanData.skills) {
      if (cleanData.skills.languages) cleanData.skills.languages = cleanArray(cleanData.skills.languages);
      if (cleanData.skills.frameworks) cleanData.skills.frameworks = cleanArray(cleanData.skills.frameworks);
      if (cleanData.skills.tools) cleanData.skills.tools = cleanArray(cleanData.skills.tools);
      if (cleanData.skills.databases) cleanData.skills.databases = cleanArray(cleanData.skills.databases);
    }
    if (cleanData.core_stack) cleanData.core_stack = cleanArray(cleanData.core_stack);
    
    cleanData.projects?.forEach(p => {
       p.tech_stack = cleanArray(p.tech_stack);
    });

    const isObjEmpty = (obj: any) => Object.values(obj).every(v => {
      if (Array.isArray(v)) return v.length === 0;
      return !v || String(v).trim().length === 0;
    });

    if (cleanData.experience) cleanData.experience = cleanData.experience.filter(exp => !isObjEmpty(exp));
    if (cleanData.projects) cleanData.projects = cleanData.projects.filter(proj => !isObjEmpty(proj));
    if (cleanData.education) cleanData.education = cleanData.education.filter(edu => !isObjEmpty(edu));
    if (cleanData.stats) cleanData.stats = cleanData.stats.filter(stat => !isObjEmpty(stat));

    setData(cleanData);

    try {
      await updateProfileMutation.mutateAsync({ portfolio_data: cleanData });
      showToast("Profile updated successfully!", "success");
    } catch (e) {
      showToast("Error saving profile", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={dashboardStyles.loadingScreen}>
        <div className={dashboardStyles.loadingSpinner} />
        <p className={dashboardStyles.loadingText}>Loading editor...</p>
      </div>
    );
  }

  if (!data) {
    return <div style={{ padding: 40, textAlign: "center" }}>No portfolio data found. Please upload a resume first.</div>;
  }

  return (
    <div className={styles.container}>
      {toast && (
        <div className={`${styles.toastContainer} ${toast.type === "success" ? styles.toastSuccess : styles.toastError}`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.message}
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
            <button onClick={() => router.push("/")} className={dashboardStyles.secondaryButton} style={{ padding: "8px 16px" }}>
              ← Back
            </button>
            <h1 className={styles.title}>Edit Profile</h1>
          </div>
          <button className={styles.saveButton} onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Personal" && (
          <div className={styles.formSection}>
            {["name", "title", "email", "phone", "location", "github", "linkedin", "twitter", "medium", "youtube", "behance", "dribbble", "figma", "leetcode", "codechef", "codeforces"].map((field) => (
              <div className={styles.field} key={field}>
                <label className={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  className={styles.input}
                  value={(data.personal_info as any)[field] || ""}
                  onChange={(e) => setData({
                    ...data,
                    personal_info: { ...data.personal_info, [field]: e.target.value }
                  })}
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === "Skills" && (
          <div className={styles.formSection}>
            <p className={styles.label}>Enter comma-separated values</p>
            {["languages", "frameworks", "tools", "databases"].map((field) => (
              <div className={styles.field} key={field}>
                <label className={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <textarea
                  className={styles.textarea}
                  value={((data.skills as any)[field] || []).join(",")}
                  onChange={(e) => setData({
                    ...data,
                    skills: {
                      ...data.skills,
                      [field]: e.target.value.split(",")
                    }
                  })}
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === "Experience" && (
          <div className={styles.formSection}>
            {(data.experience || []).map((exp, index) => (
              <div className={styles.arrayItem} key={index}>
                <button
                  className={styles.removeButton}
                  onClick={() => setData({
                    ...data,
                    experience: data.experience.filter((_, i) => i !== index)
                  })}
                >
                  Remove
                </button>
                <div className={styles.field} style={{ marginBottom: "1rem" }}>
                  <label className={styles.label}>Company</label>
                  <input
                    className={styles.input}
                    value={exp.company || ""}
                    onChange={(e) => {
                      const newExp = [...data.experience];
                      newExp[index] = { ...newExp[index], company: e.target.value };
                      setData({ ...data, experience: newExp });
                    }}
                  />
                </div>
                <div className={styles.field} style={{ marginBottom: "1rem" }}>
                  <label className={styles.label}>Role</label>
                  <input
                    className={styles.input}
                    value={exp.role || ""}
                    onChange={(e) => {
                      const newExp = [...data.experience];
                      newExp[index] = { ...newExp[index], role: e.target.value };
                      setData({ ...data, experience: newExp });
                    }}
                  />
                </div>
                <div className={styles.field} style={{ marginBottom: "1rem" }}>
                  <label className={styles.label}>Duration</label>
                  <input
                    className={styles.input}
                    value={exp.duration || ""}
                    onChange={(e) => {
                      const newExp = [...data.experience];
                      newExp[index] = { ...newExp[index], duration: e.target.value };
                      setData({ ...data, experience: newExp });
                    }}
                  />
                </div>
                <div className={styles.field} style={{ marginBottom: "1rem" }}>
                  <label className={styles.label}>Location</label>
                  <input
                    className={styles.input}
                    value={exp.location || ""}
                    onChange={(e) => {
                      const newExp = [...data.experience];
                      newExp[index] = { ...newExp[index], location: e.target.value };
                      setData({ ...data, experience: newExp });
                    }}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Description (Points, comma-separated)</label>
                  <textarea
                    className={styles.textarea}
                    value={(exp.description || []).join("| ")}
                    onChange={(e) => {
                      const newExp = [...data.experience];
                      newExp[index] = { ...newExp[index], description: e.target.value.split("|").map(s => s.trim()) };
                      setData({ ...data, experience: newExp });
                    }}
                  />
                </div>
              </div>
            ))}
            <button
              className={styles.addButton}
              onClick={() => setData({
                ...data,
                experience: [...(data.experience || []), { company: "", role: "", duration: "", location: "", description: [] }]
              })}
            >
              + Add Experience
            </button>
          </div>
        )}

        {activeTab === "Projects" && (
          <div className={styles.formSection}>
            {(data.projects || []).map((proj, index) => (
              <div className={styles.arrayItem} key={index}>
                <button
                  className={styles.removeButton}
                  onClick={() => setData({
                    ...data,
                    projects: data.projects.filter((_, i) => i !== index)
                  })}
                >
                  Remove
                </button>
                <div className={styles.field} style={{ marginBottom: "1rem" }}>
                  <label className={styles.label}>Project Name</label>
                  <input
                    className={styles.input}
                    value={proj.name || ""}
                    onChange={(e) => {
                      const newProj = [...data.projects];
                      newProj[index] = { ...newProj[index], name: e.target.value };
                      setData({ ...data, projects: newProj });
                    }}
                  />
                </div>
                <div className={styles.field} style={{ marginBottom: "1rem" }}>
                  <label className={styles.label}>Description</label>
                  <textarea
                    className={styles.textarea}
                    value={proj.description || ""}
                    onChange={(e) => {
                      const newProj = [...data.projects];
                      newProj[index] = { ...newProj[index], description: e.target.value };
                      setData({ ...data, projects: newProj });
                    }}
                  />
                </div>
                <div className={styles.field} style={{ marginBottom: "1rem" }}>
                  <label className={styles.label}>Tech Stack (comma-separated)</label>
                  <input
                    className={styles.input}
                    value={(proj.tech_stack || []).join(",")}
                    onChange={(e) => {
                      const newProj = [...data.projects];
                      newProj[index] = { ...newProj[index], tech_stack: e.target.value.split(",") };
                      setData({ ...data, projects: newProj });
                    }}
                  />
                </div>
                <div className={styles.field} style={{ marginBottom: "1rem" }}>
                  <label className={styles.label}>GitHub URL</label>
                  <input
                    className={styles.input}
                    value={proj.github || ""}
                    onChange={(e) => {
                      const newProj = [...data.projects];
                      newProj[index] = { ...newProj[index], github: e.target.value };
                      setData({ ...data, projects: newProj });
                    }}
                  />
                </div>
                <div className={styles.field} style={{ marginBottom: "1rem" }}>
                  <label className={styles.label}>Live URL</label>
                  <input
                    className={styles.input}
                    value={proj.live || ""}
                    onChange={(e) => {
                      const newProj = [...data.projects];
                      newProj[index] = { ...newProj[index], live: e.target.value };
                      setData({ ...data, projects: newProj });
                    }}
                  />
                </div>
              </div>
            ))}
            <button
              className={styles.addButton}
              onClick={() => setData({
                ...data,
                projects: [...(data.projects || []), { name: "", description: "", tech_stack: [] }]
              })}
            >
              + Add Project
            </button>
          </div>
        )}

        {activeTab === "Education" && (
          <div className={styles.formSection}>
            {(data.education || []).map((edu, index) => (
              <div className={styles.arrayItem} key={index}>
                <button
                  className={styles.removeButton}
                  onClick={() => setData({
                    ...data,
                    education: data.education.filter((_, i) => i !== index)
                  })}
                >
                  Remove
                </button>
                <div className={styles.field} style={{ marginBottom: "1rem" }}>
                  <label className={styles.label}>Institution</label>
                  <input
                    className={styles.input}
                    value={edu.institution || ""}
                    onChange={(e) => {
                      const newEdu = [...data.education];
                      newEdu[index] = { ...newEdu[index], institution: e.target.value };
                      setData({ ...data, education: newEdu });
                    }}
                  />
                </div>
                <div className={styles.field} style={{ marginBottom: "1rem" }}>
                  <label className={styles.label}>Degree</label>
                  <input
                    className={styles.input}
                    value={edu.degree || ""}
                    onChange={(e) => {
                      const newEdu = [...data.education];
                      newEdu[index] = { ...newEdu[index], degree: e.target.value };
                      setData({ ...data, education: newEdu });
                    }}
                  />
                </div>
                <div className={styles.field} style={{ marginBottom: "1rem" }}>
                  <label className={styles.label}>Field</label>
                  <input
                    className={styles.input}
                    value={edu.field || ""}
                    onChange={(e) => {
                      const newEdu = [...data.education];
                      newEdu[index] = { ...newEdu[index], field: e.target.value };
                      setData({ ...data, education: newEdu });
                    }}
                  />
                </div>
                <div className={styles.field} style={{ marginBottom: "1rem" }}>
                  <label className={styles.label}>Duration</label>
                  <input
                    className={styles.input}
                    value={edu.duration || ""}
                    onChange={(e) => {
                      const newEdu = [...data.education];
                      newEdu[index] = { ...newEdu[index], duration: e.target.value };
                      setData({ ...data, education: newEdu });
                    }}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>GPA</label>
                  <input
                    className={styles.input}
                    value={edu.gpa || ""}
                    onChange={(e) => {
                      const newEdu = [...data.education];
                      newEdu[index] = { ...newEdu[index], gpa: e.target.value };
                      setData({ ...data, education: newEdu });
                    }}
                  />
                </div>
              </div>
            ))}
            <button
              className={styles.addButton}
              onClick={() => setData({
                ...data,
                education: [...(data.education || []), { institution: "", degree: "", field: "", duration: "" }]
              })}
            >
              + Add Education
            </button>
          </div>
        )}

        {activeTab === "Other" && (
          <div className={styles.formSection}>
            <div className={styles.field} style={{ marginBottom: "2rem" }}>
              <label className={styles.label} style={{ fontSize: "1rem", color: "var(--text-primary)" }}>Core Stack</label>
              <p className={styles.label}>Enter comma-separated values</p>
              <input
                className={styles.input}
                value={(data.core_stack || []).join(",")}
                onChange={(e) => setData({
                  ...data,
                  core_stack: e.target.value.split(",")
                })}
              />
            </div>
            
            <label className={styles.label} style={{ fontSize: "1rem", color: "var(--text-primary)" }}>Stats</label>
            {(data.stats || []).map((stat, index) => (
              <div className={styles.arrayItem} key={index}>
                <button
                  className={styles.removeButton}
                  onClick={() => setData({
                    ...data,
                    stats: data.stats?.filter((_, i) => i !== index)
                  })}
                >
                  Remove
                </button>
                <div className={styles.field} style={{ marginBottom: "1rem" }}>
                  <label className={styles.label}>Label</label>
                  <input
                    className={styles.input}
                    value={stat.label || ""}
                    onChange={(e) => {
                      const newStats = [...(data.stats || [])];
                      newStats[index] = { ...newStats[index], label: e.target.value };
                      setData({ ...data, stats: newStats });
                    }}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Value</label>
                  <input
                    className={styles.input}
                    value={stat.val || ""}
                    onChange={(e) => {
                      const newStats = [...(data.stats || [])];
                      newStats[index] = { ...newStats[index], val: e.target.value };
                      setData({ ...data, stats: newStats });
                    }}
                  />
                </div>
              </div>
            ))}
            <button
              className={styles.addButton}
              onClick={() => setData({
                ...data,
                stats: [...(data.stats || []), { label: "", val: "" }]
              })}
            >
              + Add Stat
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
