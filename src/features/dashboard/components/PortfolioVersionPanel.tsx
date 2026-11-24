"use client";

import { useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import type { PortfolioVersion } from "@/app/types";
import styles from "./PortfolioWorkspace.module.css";

export function PortfolioVersionPanel({ versions, publishedVersionId, publicUrl, draftUrl, onSaveVersion, onPublish, onRestore }: {
  versions: PortfolioVersion[];
  publishedVersionId: string | null;
  publicUrl: string;
  draftUrl: string;
  onSaveVersion: (label?: string, publish?: boolean) => Promise<void>;
  onPublish: (versionId: string | null) => Promise<void>;
  onRestore: (version: PortfolioVersion) => Promise<void>;
}) {
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update this portfolio. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const save = (publish: boolean) => run(async () => {
    await onSaveVersion(label, publish);
    setLabel("");
  });

  return <div className={styles.versionPanel} data-tour="versions">
    <div className={styles.versionPanelHeader}>
      <div>
        <h3>Manage your portfolio</h3>
        <p>Preview your latest draft, save a version, or go live when you are ready.</p>
      </div>
      <a className={styles.smallButton} href={draftUrl} target="_blank" rel="noopener noreferrer">View draft <FiExternalLink aria-hidden /></a>
    </div>

    <div className={styles.versionComposer}>
      <label htmlFor="version-note">Version note <span>Optional</span></label>
      <div className={styles.versionComposerActions}>
        <input id="version-note" className={styles.input} value={label} onChange={(event) => setLabel(event.target.value)} placeholder="What changed in this version?" />
        <button className={styles.smallButton} disabled={busy} onClick={() => void save(false)}>Save version</button>
        <button className={styles.primary} disabled={busy} onClick={() => void save(true)}>Go live</button>
      </div>
    </div>

    {error && <p className={styles.error} role="alert">{error}</p>}

    {publishedVersionId ? <div className={styles.publicationStatus}>
      <span className={styles.publishedBadge}>Live</span>
      {publicUrl && <a href={publicUrl} target="_blank" rel="noopener noreferrer">View published portfolio <FiExternalLink aria-hidden /></a>}
      <button className={styles.smallButton} disabled={busy} onClick={() => void run(() => onPublish(null))}>Unpublish</button>
    </div> : <p className={styles.draftNotice}>This portfolio is private until you publish a version.</p>}

    <div className={styles.versionHistoryHeader}>
      <h3>Version history</h3>
      <span>{versions.length} saved</span>
    </div>
    <div className={styles.versionList}>
      {versions.map((version) => <div className={styles.version} key={version.id}>
        <div className={styles.versionMeta}>
          <strong>Version {version.version_number}{version.label ? ` · ${version.label}` : ""}</strong>
          <span>{new Date(version.created_at).toLocaleString()}</span>
        </div>
        <div className={styles.versionActions}>
          {publishedVersionId === version.id
            ? <span className={styles.publishedBadge}>Published</span>
            : <button className={styles.smallButton} disabled={busy} onClick={() => void run(() => onPublish(version.id))}>Publish</button>}
          <button className={styles.smallButton} disabled={busy} onClick={() => void run(() => onRestore(version))}>Restore to draft</button>
        </div>
      </div>)}
      {!versions.length && <p className={styles.emptyVersions}>No saved versions yet. Save one to keep a point you can restore or publish later.</p>}
    </div>
  </div>;
}
