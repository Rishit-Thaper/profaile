"use client";

import { useInView } from "@/app/hooks/useInView";
import { Education as EducationType } from "@/app/types";

export default function Education({ data }: { data: EducationType[] }) {
  const [ref, inView] = useInView();
  const edu = data[0];

  if (!edu) return null;

  return (
    <section id="education" ref={ref} className="py-24 bg-white">
      <div
        className={`max-w-6xl mx-auto px-6 md:px-8 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="font-extrabold text-black text-4xl md:text-6xl mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: "-0.02em" }}>
          Education
        </h2>
        <p className="text-black/60 font-semibold mb-12" style={{ fontFamily: "'Inter', sans-serif" }}>
          Where I learned the craft
        </p>

        <div
          className="rounded-2xl bg-[#D9FBF0] border-2 border-black p-8 md:p-12 flex flex-wrap items-center gap-10 transition-transform duration-200 hover:-translate-y-1"
          style={{ boxShadow: "8px 8px 0 0 #06D6A0" }}
        >
          <div
            className="w-20 h-20 rounded-2xl bg-[#06D6A0] border-2 border-black flex items-center justify-center text-white text-3xl font-extrabold -rotate-3"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            {edu.institution.charAt(0)}
          </div>
          <div className="flex-1 min-w-[220px]">
            <h3 className="text-black text-3xl font-extrabold mb-1" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              {edu.institution}
            </h3>
            <p className="text-black/70 font-bold mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
              {edu.degree}
              {edu.field ? ` · ${edu.field}` : ""}
            </p>
            <span className="px-3 py-1.5 rounded-lg bg-[#06D6A0] text-white text-xs font-bold border-2 border-black inline-block" style={{ fontFamily: "'Inter', sans-serif" }}>
              {edu.duration}
            </span>
          </div>
          {edu.gpa && (
            <div className="text-center">
              <div className="text-6xl font-extrabold text-black" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                {edu.gpa}
              </div>
              <div className="text-black/60 text-xs font-bold uppercase tracking-widest mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                GPA
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
