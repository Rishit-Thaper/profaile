"use client";

import { CareerPortfolio, ResumeVersion } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import styles from "./PortfolioWorkspace.module.css";

export function PortfolioWorkspace({ portfolios, currentId, resumes, draftUrl, onSelect, onCreate }: {
  portfolios: CareerPortfolio[]; currentId: string | null; resumes: ResumeVersion[]; draftUrl: string | null;
  onSelect: (id: string) => void;
  onCreate: (input: { name: string; slug: string; resumeId?: string }) => Promise<void>;
}) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [resumeId, setResumeId] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (creating && !dialogRef.current?.open) {
      dialogRef.current?.showModal();
      nameInputRef.current?.focus();
    }
  }, [creating]);

  const submit = async () => {
    if (!name.trim()) return setError("Give this portfolio a name first.");
    setSaving(true); setError("");
    try {
      await onCreate({ name: name.trim(), slug: slug || name, resumeId: resumeId || undefined });
      dialogRef.current?.close();
      setName(""); setSlug(""); setResumeId("");
    } catch (err) { setError(err instanceof Error ? err.message : "Could not create portfolio"); }
    finally { setSaving(false); }
  };

  return <section className={styles.workspace} data-tour="portfolio-switcher">
    <div className={styles.workspaceTop}>
      <div className={styles.workspaceHeading}><span className={styles.workspaceLabel}>Portfolio workspace</span><span className={styles.workspaceHint}>Switch between your portfolio drafts.</span></div>
      <select className={styles.select} value={currentId ?? ""} onChange={(e) => onSelect(e.target.value)} aria-label="Active portfolio" disabled={!portfolios.length}>
        {!portfolios.length && <option value="">No portfolios yet</option>}
        {portfolios.map((portfolio) => <option key={portfolio.id} value={portfolio.id}>{portfolio.name} · /{portfolio.slug}</option>)}
      </select>
      {draftUrl && <a className={styles.smallButton} href={draftUrl} target="_blank" rel="noopener noreferrer" aria-label="View private draft in a new tab">View draft <FiExternalLink aria-hidden /></a>}
      <button className={styles.primary} onClick={() => { setError(""); setCreating(true); }}>+ New portfolio</button>
    </div>
    {creating && <dialog ref={dialogRef} className={styles.createDialog} onClose={() => setCreating(false)} onClick={(event) => { if (event.target === event.currentTarget && !saving) dialogRef.current?.close(); }} aria-labelledby="create-portfolio-title">
      <form className={styles.createForm} onSubmit={(event) => { event.preventDefault(); void submit(); }}>
        <div className={styles.dialogHeader}>
          <div><h2 id="create-portfolio-title" className={styles.dialogTitle}>New portfolio</h2><p className={styles.dialogDescription}>Create a separate draft for a role, project, or audience.</p></div>
          <button type="button" className={styles.closeButton} onClick={() => dialogRef.current?.close()} aria-label="Close dialog">×</button>
        </div>
        <label className={styles.field}>Name<input ref={nameInputRef} className={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Frontend Engineer" required /></label>
        <label className={styles.field}>URL ending<input className={styles.input} value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} placeholder="frontend" /></label>
        <label className={styles.field}>Start from<select className={styles.select} value={resumeId} onChange={(e) => setResumeId(e.target.value)}><option value="">Blank portfolio</option>{resumes.map((resume) => <option key={resume.id} value={resume.id}>{resume.original_filename}</option>)}</select></label>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <div className={styles.dialogActions}><button type="button" className={styles.smallButton} onClick={() => dialogRef.current?.close()} disabled={saving}>Cancel</button><button type="submit" className={styles.primary} disabled={saving}>{saving ? "Creating..." : "Create portfolio"}</button></div>
      </form>
    </dialog>}
  </section>;
}
