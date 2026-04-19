import { Skills as SkillsType } from "@/app/types";
import Section from "./Section";

export default function Skills({ data }: { data: SkillsType }) {
  const cats = [
    { label: "Languages", items: data.languages },
    { label: "Frameworks", items: data.frameworks },
    { label: "Databases", items: data.databases },
    { label: "Tools", items: data.tools },
  ];

  return (
    <Section id="skills" label="Skills">
      <div className="space-y-10">
        {cats.filter(cat => cat.items && cat.items.length > 0).map((cat) => (
          <div key={cat.label} className="flex flex-col sm:flex-row sm:gap-16">
            <p className="font-mono text-[10px] text-[#E8E4DC]/20 tracking-[0.25em] uppercase w-28 flex-shrink-0 mt-0.5 mb-3 sm:mb-0">
              {cat.label}
            </p>
            <p className="font-serif text-[#E8E4DC]/55 text-lg leading-relaxed">
              {cat.items.join(", ")}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
