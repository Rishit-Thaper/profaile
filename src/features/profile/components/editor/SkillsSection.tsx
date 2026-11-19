import { Skills } from "@/app/types";
import { skillFields } from "../../constants/editor-fields";
import styles from "../ProfileEditor.module.css";

type Props = {
  skills: Skills;
  onUpdate: (field: keyof Skills, value: string) => void;
};

export default function SkillsSection({ skills, onUpdate }: Props) {
  return (
    <div className={styles.formSection}>
      <p className={styles.hint}>Enter comma-separated values.</p>
      <div className={styles.formGrid}>
        {skillFields.map((field) => (
          <div className={styles.field} key={field.key}>
            <label className={styles.label} htmlFor={`sk-${field.key}`}>{field.label}</label>
            <textarea
              id={`sk-${field.key}`}
              className={styles.textarea}
              value={(skills[field.key] ?? []).join(", ")}
              placeholder="React, TypeScript, Node.js"
              onChange={(event) => onUpdate(field.key, event.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
