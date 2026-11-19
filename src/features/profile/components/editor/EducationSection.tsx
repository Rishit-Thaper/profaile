import { Education } from "@/app/types";
import styles from "../ProfileEditor.module.css";
import { AddIcon, RemoveIcon } from "./EditorIcons";

type Props = {
  education: Education[];
  onChange: (education: Education[]) => void;
};

export default function EducationSection({ education, onChange }: Props) {
  const updateEducation = (index: number, values: Partial<Education>) => {
    const next = [...education];
    next[index] = { ...next[index], ...values };
    onChange(next);
  };

  return (
    <div className={styles.formSection}>
      {education.map((item, index) => (
        <div className={styles.arrayItem} key={index}>
          <div className={styles.arrayItemHeader}>
            <span className={styles.arrayItemBadge}>Education {index + 1}</span>
            <button className={styles.removeButton} onClick={() => onChange(education.filter((_, itemIndex) => itemIndex !== index))} aria-label="Remove education">
              <RemoveIcon />
              Remove
            </button>
          </div>
          <div className={styles.formGrid}>
            <TextField label="Institution" value={item.institution} onChange={(institution) => updateEducation(index, { institution })} />
            <TextField label="Degree" value={item.degree} onChange={(degree) => updateEducation(index, { degree })} />
            <TextField label="Field" value={item.field} onChange={(field) => updateEducation(index, { field })} />
            <TextField label="Duration" value={item.duration} placeholder="2018 — 2022" onChange={(duration) => updateEducation(index, { duration })} />
            <TextField label="GPA" value={item.gpa ?? ""} onChange={(gpa) => updateEducation(index, { gpa })} />
          </div>
        </div>
      ))}
      <button className={styles.addButton} onClick={() => onChange([...education, { institution: "", degree: "", field: "", duration: "" }])}>
        <AddIcon />
        Add Education
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
