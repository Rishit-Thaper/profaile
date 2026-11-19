"use client";

import { useRef } from "react";
import Image from "next/image";
import { PersonalInfo } from "@/app/types";
import { personalFields, socialFields } from "../../constants/editor-fields";
import styles from "../ProfileEditor.module.css";

type Props = {
  personalInfo: PersonalInfo;
  uploading: boolean;
  onUpdate: (field: keyof PersonalInfo, value: string | boolean) => void;
  onUpload: (file: File) => void;
  onRemove: () => void;
};

export default function PersonalInfoSection({ personalInfo, uploading, onUpdate, onUpload, onRemove }: Props) {
  const photoInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={styles.formSection}>
      <div className={styles.photoSection}>
        <div className={styles.photoPreviewWrap}>
          {personalInfo.photo ? (
            <Image
              src={personalInfo.photo}
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
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onUpload(file);
                event.target.value = "";
              }}
            />
            <button
              type="button"
              className={styles.photoUploadButton}
              onClick={() => photoInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : personalInfo.photo ? "Replace photo" : "Upload photo"}
            </button>
            {personalInfo.photo && (
              <button type="button" className={styles.photoRemoveButton} onClick={onRemove} disabled={uploading}>
                Remove
              </button>
            )}
          </div>
          <label className={styles.photoToggle}>
            <input
              type="checkbox"
              className={styles.photoToggleInput}
              checked={personalInfo.photo_visible !== false}
              onChange={(event) => onUpdate("photo_visible", event.target.checked)}
            />
            <span className={styles.toggleTrack} aria-hidden><span className={styles.toggleThumb} /></span>
            <span className={styles.photoToggleLabel}>Show photo in my portfolio</span>
          </label>
        </div>
      </div>

      <Divider label="Basic Info" />
      <div className={styles.formGrid}>
        {personalFields.map((field) => (
          <div className={styles.field} key={field.key}>
            <label className={styles.label} htmlFor={`pf-${field.key}`}>{field.label}</label>
            <input
              id={`pf-${field.key}`}
              className={styles.input}
              value={personalInfo[field.key] ?? ""}
              placeholder={field.placeholder}
              onChange={(event) => onUpdate(field.key, event.target.value)}
            />
          </div>
        ))}
      </div>

      <Divider label="Social Links" />
      <div className={styles.formGrid}>
        {socialFields.map((field) => (
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
                value={personalInfo[field.key] ?? ""}
                placeholder={`${field.label.toLowerCase()} username or URL`}
                onChange={(event) => onUpdate(field.key, event.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className={styles.divider}>
      <span className={styles.dividerLine} />
      <span className={styles.dividerLabel}>{label}</span>
      <span className={styles.dividerLine} />
    </div>
  );
}
