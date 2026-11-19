"use client";

import { PortfolioData } from "@/app/types";
import styles from "./ParsedDataPreview.module.css";

export default function ParsedDataPreview({
  data,
}: {
  data: PortfolioData;
}) {
  const sections = [
    {
      title: "Personal Info",
      icon: "👤",
      items: [
        { label: "Name", value: data.personal_info?.name },
        { label: "Title", value: data.personal_info?.title },
        { label: "Email", value: data.personal_info?.email },
        { label: "Location", value: data.personal_info?.location },
      ].filter((item) => item.value),
    },
    {
      title: "Skills",
      icon: "🛠",
      items: [
        {
          label: "Languages",
          value: data.skills?.languages?.join(", "),
        },
        {
          label: "Frameworks",
          value: data.skills?.frameworks?.join(", "),
        },
        { label: "Tools", value: data.skills?.tools?.join(", ") },
        {
          label: "Databases",
          value: data.skills?.databases?.join(", "),
        },
      ].filter((item) => item.value),
    },
    {
      title: "Experience",
      icon: "💼",
      items: data.experience?.map((exp) => ({
        label: exp.role,
        value: `${exp.company}${exp.duration ? ` • ${exp.duration}` : ""}`,
      })) ?? [],
    },
    {
      title: "Projects",
      icon: "🚀",
      items: data.projects?.map((proj) => ({
        label: proj.name,
        value: proj.tech_stack?.join(", ") || proj.description?.slice(0, 60),
      })) ?? [],
    },
    {
      title: "Education",
      icon: "🎓",
      items: data.education?.map((edu) => ({
        label: edu.degree,
        value: `${edu.institution}${edu.duration ? ` • ${edu.duration}` : ""}`,
      })) ?? [],
    },
  ];

  return (
    <div className={styles.grid}>
      {sections.map((section, i) => (
        <div
          key={section.title}
          className={`${styles.card} glass-card animate-fade-in-up stagger-${i + 1}`}
        >
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>{section.icon}</span>
            <h3 className={styles.cardTitle}>{section.title}</h3>
            <span className={styles.count}>{section.items.length}</span>
          </div>

          <div className={styles.items}>
            {section.items.map((item, j) => (
              <div key={j} className={styles.item}>
                <span className={styles.itemLabel}>{item.label}</span>
                <span className={styles.itemValue}>{item.value}</span>
              </div>
            ))}
            {section.items.length === 0 && (
              <p className={styles.empty}>No data found</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
