import { Experience } from "@/app/types";
import styles from "../ProfileEditor.module.css";
import { AddIcon, RemoveIcon } from "./EditorIcons";

type Props = {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
};

export default function ExperienceSection({ experiences, onChange }: Props) {
  const updateExperience = (index: number, values: Partial<Experience>) => {
    const next = [...experiences];
    next[index] = { ...next[index], ...values };
    onChange(next);
  };

  return (
    <div className={styles.formSection}>
      {experiences.map((experience, index) => (
        <div className={styles.arrayItem} key={index}>
          <div className={styles.arrayItemHeader}>
            <span className={styles.arrayItemBadge}>Experience {index + 1}</span>
            <button className={styles.removeButton} onClick={() => onChange(experiences.filter((_, itemIndex) => itemIndex !== index))} aria-label="Remove experience">
              <RemoveIcon />
              Remove
            </button>
          </div>
          <div className={styles.formGrid}>
            <TextField label="Company" value={experience.company} onChange={(company) => updateExperience(index, { company })} />
            <TextField label="Role" value={experience.role} onChange={(role) => updateExperience(index, { role })} />
            <TextField label="Duration" value={experience.duration} placeholder="Jan 2022 — Present" onChange={(duration) => updateExperience(index, { duration })} />
            <TextField label="Location" value={experience.location} onChange={(location) => updateExperience(index, { location })} />
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label}>Description (points, separated by &quot;|&quot;)</label>
              <textarea
                className={styles.textarea}
                value={(experience.description ?? []).join(" | ")}
                onChange={(event) => updateExperience(index, { description: event.target.value.split("|").map((item) => item.trim()) })}
              />
            </div>
          </div>
        </div>
      ))}
      <button
        className={styles.addButton}
        onClick={() => onChange([...experiences, { company: "", role: "", duration: "", location: "", description: [] }])}
      >
        <AddIcon />
        Add Experience
      </button>
    </div>
  );
}

function TextField({ label, value, placeholder, onChange }: { label: string; value: string; placeholder?: string; onChange: (value: string) => void }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <input className={styles.input} value={value ?? ""} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}
