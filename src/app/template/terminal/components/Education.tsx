"use client";

import { useInView } from "@/app/hooks/useInView";
import { Education as EducationType } from "@/app/types";

export default function Education({ data }: { data: EducationType[] }) {
  const [ref, inView] = useInView();
  const edu = data[0];

  if (!edu) return null;

  return (
    <section id="education" ref={ref} className="py-24 bg-[#0B0B0B]">
      <div
        className={`max-w-6xl mx-auto px-6 md:px-8 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        <div className="text-[#3D6B54] text-sm mb-3">
          <span className="text-[#00B3FF]">$</span> cat education.txt
        </div>
        <h2 className="text-[#00FF9C] text-3xl md:text-4xl mb-12">
          # Education
        </h2>

        <div className="bg-[#111111] border border-[#00FF9C]/25 rounded-lg p-8 flex flex-wrap items-center gap-8 hover:border-[#00FF9C]/60 transition-colors duration-200">
          <div
            className="w-14 h-14 rounded-lg bg-[#00FF9C]/10 border border-[#00FF9C]/40 flex items-center justify-center text-[#00FF9C] text-2xl font-bold"
          >
            {edu.institution.charAt(0)}
          </div>
          <div className="flex-1 min-w-[220px]">
            <div className="text-[#00FF9C] text-lg mb-1">{edu.institution}</div>
            <div className="text-[#00B3FF] text-sm mb-2">
              {edu.degree}
              {edu.field ? ` · ${edu.field}` : ""}
            </div>
            <span className="text-xs text-[#3D6B54] border border-[#3D6B54]/40 rounded px-2 py-0.5">
              {edu.duration}
            </span>
          </div>
          {edu.gpa && (
            <div className="text-center">
              <div className="text-4xl text-[#00FF9C]">{edu.gpa}</div>
              <div className="text-[#3D6B54] text-xs mt-1">GPA</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
