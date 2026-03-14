import { Experience as ExperienceType } from "@/app/types";
import Section from "./Section";

export default function Experience({ data }: { data: ExperienceType[] }) {
  return (
    <Section id="experience" label="Experience">
      {data.map((exp, i) => (
        <div key={i}>
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
            <h2 className="font-serif text-3xl text-[#E8E4DC]">{exp.role}</h2>
            <span className="font-mono text-xs text-[#E8E4DC]/20 tracking-wider">
              {exp.duration}
            </span>
          </div>
          <p className="font-mono text-xs text-[#7FA688] tracking-[0.15em] uppercase mb-10">
            {exp.company} · {exp.location}
          </p>
          <div className="space-y-5 pl-4 border-l border-[#E8E4DC]/8">
            {exp.description.map((point, j) => (
              <p
                key={j}
                className="font-serif text-[#E8E4DC]/45 leading-relaxed text-lg"
              >
                {point}
              </p>
            ))}
          </div>
        </div>
      ))}
    </Section>
  );
}
