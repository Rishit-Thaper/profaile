import { Stat } from "@/app/types";
import styles from "../ProfileEditor.module.css";
import { AddIcon, RemoveIcon } from "./EditorIcons";

type Props = {
  coreStack: string[];
  stats: Stat[];
  onCoreStackChange: (coreStack: string[]) => void;
  onStatsChange: (stats: Stat[]) => void;
};

export default function OtherSection({ coreStack, stats, onCoreStackChange, onStatsChange }: Props) {
  const updateStat = (index: number, values: Partial<Stat>) => {
    const next = [...stats];
    next[index] = { ...next[index], ...values };
    onStatsChange(next);
  };

  return (
    <div className={styles.formSection}>
      <div className={styles.formGrid}>
        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label className={styles.label}>Core Stack</label>
          <p className={styles.hint}>Enter comma-separated values.</p>
          <input
            className={styles.input}
            value={coreStack.join(", ")}
            placeholder="TypeScript, React, Postgres"
            onChange={(event) => onCoreStackChange(event.target.value.split(",").map((item) => item.trim()).filter(Boolean))}
          />
        </div>
      </div>

      <div className={styles.divider}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerLabel}>Stats</span>
        <span className={styles.dividerLine} />
      </div>

      {stats.map((stat, index) => (
        <div className={styles.arrayItem} key={index}>
          <div className={styles.arrayItemHeader}>
            <span className={styles.arrayItemBadge}>Stat {index + 1}</span>
            <button className={styles.removeButton} onClick={() => onStatsChange(stats.filter((_, itemIndex) => itemIndex !== index))} aria-label="Remove stat">
              <RemoveIcon />
              Remove
            </button>
          </div>
          <div className={styles.formGrid}>
            <TextField label="Label" value={stat.label} placeholder="Years of experience" onChange={(label) => updateStat(index, { label })} />
            <TextField label="Value" value={stat.val} placeholder="5+" onChange={(val) => updateStat(index, { val })} />
          </div>
        </div>
      ))}
      <button className={styles.addButton} onClick={() => onStatsChange([...stats, { label: "", val: "" }])}>
        <AddIcon />
        Add Stat
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
