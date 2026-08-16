"use client";

import { useInView } from "@/app/hooks/useInView";
import { Education as EducationType } from "@/app/types";

export default function Education({ data }: { data: EducationType[] }) {
  const [ref, inView] = useInView();
  const edu = data[0];

  if (!edu) return null;

  return (
    <section id="education" ref={ref} className="py-24 bg-[#FAF7F0]">
      <div
        className={`max-w-5xl mx-auto px-6 md:px-8 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="flex items-center gap-4 mb-3">
          <span className="text-[#A98647] text-sm" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            (04)
          </span>
          <span className="h-px flex-1 bg-[#A98647]/40" />
        </div>
        <h2
          className="text-[#26221C] text-4xl md:text-5xl mb-12"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "-0.01em" }}
        >
          Education
        </h2>

        <div className="bg-white border border-[#26221C]/10 p-8 md:p-12 flex flex-wrap items-center gap-10">
          <div
            className="w-20 h-20 rounded-full border border-[#A98647] flex items-center justify-center text-[#A98647] text-3xl"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {edu.institution.charAt(0)}
          </div>
          <div className="flex-1 min-w-[220px]">
            <h3 className="text-[#26221C] text-3xl mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              {edu.institution}
            </h3>
            <p className="text-[#6B655A] text-sm mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
              {edu.degree}
              {edu.field ? ` · ${edu.field}` : ""}
            </p>
            <span className="text-[#A98647] text-xs uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>
              {edu.duration}
            </span>
          </div>
          {edu.gpa && (
            <div className="text-center border-l border-[#26221C]/10 pl-10">
              <div className="text-5xl text-[#A98647]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                {edu.gpa}
              </div>
              <div className="text-[#6B655A] text-xs uppercase tracking-widest mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                GPA
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
