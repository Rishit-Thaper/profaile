"use client";

import { useInView } from "@/app/hooks/useInView";
import { Experience as ExperienceType } from "@/app/types";

export default function Experience({ data }: { data: ExperienceType[] }) {
  const [ref, inView] = useInView();

  return (
    <section id="experience" ref={ref} className="py-24 bg-[#0D0D0D]">
      <div
        className={`max-w-6xl mx-auto px-6 md:px-8 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        <div className="text-[#3D6B54] text-sm mb-3">
          <span className="text-[#00B3FF]">$</span> cat experience.txt
        </div>
        <h2 className="text-[#00FF9C] text-3xl md:text-4xl mb-12">
          # Experience
        </h2>

        <div className="space-y-6">
          {data.map((exp, i) => (
            <div key={i} className="bg-[#111111] border border-[#00FF9C]/25 rounded-lg p-7 hover:border-[#00FF9C]/60 transition-colors duration-200">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                <div>
                  <div className="text-[#00FF9C] text-lg">
                    <span className="text-[#3D6B54]">› </span>{exp.role}
                    <span className="text-[#3D6B54]"> @ </span>
                    <span className="text-[#00B3FF]">{exp.company}</span>
                  </div>
                  <div className="text-[#3D6B54] text-xs mt-1.5">
                    {exp.duration}
                    {exp.location ? ` · ${exp.location}` : ""}
                  </div>
                </div>
                <span className="text-[#3D6B54] text-xs">
                  [ 0{i + 1} ]
                </span>
              </div>

              <div className="space-y-2.5 mt-4">
                {exp.description.map((point, j) => (
                  <p key={j} className="text-[#D4FFEA]/70 text-sm leading-relaxed">
                    <span className="text-[#3D6B54]">• </span>
                    {point}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
