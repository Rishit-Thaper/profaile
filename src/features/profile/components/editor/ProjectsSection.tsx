import { Projects } from "@/app/types";
import styles from "../ProfileEditor.module.css";
import { AddIcon, RemoveIcon } from "./EditorIcons";

type Props = {
  projects: Projects[];
  onChange: (projects: Projects[]) => void;
};

export default function ProjectsSection({ projects, onChange }: Props) {
  const updateProject = (index: number, values: Partial<Projects>) => {
    const next = [...projects];
    next[index] = { ...next[index], ...values };
    onChange(next);
  };

  return (
    <div className={styles.formSection}>
      {projects.map((project, index) => (
        <div className={styles.arrayItem} key={index}>
          <div className={styles.arrayItemHeader}>
            <span className={styles.arrayItemBadge}>Project {index + 1}</span>
            <button className={styles.removeButton} onClick={() => onChange(projects.filter((_, itemIndex) => itemIndex !== index))} aria-label="Remove project">
              <RemoveIcon />
              Remove
            </button>
          </div>
          <div className={styles.formGrid}>
            <TextField label="Project Name" value={project.name} onChange={(name) => updateProject(index, { name })} />
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label}>Description</label>
              <textarea className={styles.textarea} value={project.description ?? ""} onChange={(event) => updateProject(index, { description: event.target.value })} />
            </div>
            <TextField label="Tech Stack" value={(project.tech_stack ?? []).join(", ")} placeholder="React, Node.js" onChange={(value) => updateProject(index, { tech_stack: value.split(",").map((item) => item.trim()) })} />
            <TextField label="GitHub URL" value={project.github ?? ""} placeholder="https://github.com/..." onChange={(github) => updateProject(index, { github })} />
            <TextField label="Live URL" value={project.live ?? ""} placeholder="https://..." onChange={(live) => updateProject(index, { live })} />
          </div>
        </div>
      ))}
      <button className={styles.addButton} onClick={() => onChange([...projects, { name: "", description: "", tech_stack: [] }])}>
        <AddIcon />
        Add Project
      </button>
    </div>
  );
}

function TextField({ label, value, placeholder, onChange }: { label: string; value: string; placeholder?: string; onChange: (value: string) => void }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <input className={styles.input} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}
