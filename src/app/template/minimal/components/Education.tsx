import { Education as EducationType } from "@/app/types";
import Section from "./Section";

export default function Education({ data }: { data: EducationType[] }) {
  return (
    <Section id="education" label="Education">
      {data.map((edu, index) => (
        <div key={index} className={index > 0 ? "mt-12" : ""}>
          <div className="flex flex-wrap items-baseline justify-between gap-4 mb-2">
            <h2 className="font-serif text-3xl text-[#E8E4DC]">
              {edu.institution}
            </h2>
            <span className="font-mono text-xs text-[#E8E4DC]/20 tracking-wider">
              {edu.duration}
            </span>
          </div>
          <p className="font-mono text-xs text-[#7FA688] tracking-[0.15em] uppercase mb-10">
            {edu.degree} · {edu.field}
          </p>
          {edu.gpa && <div className="flex items-baseline gap-3">
            <span className="font-serif text-6xl text-[#E8E4DC]">
              {edu.gpa}
            </span>
          </div>}
        </div>
      ))}
    </Section>
  );
}
