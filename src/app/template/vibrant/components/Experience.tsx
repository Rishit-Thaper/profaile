"use client";

import { useInView } from "@/app/hooks/useInView";
import { Experience as ExperienceType } from "@/app/types";

const ACCENTS = ["#FF4D6D", "#8338EC", "#06D6A0", "#FFB703"];

export default function Experience({ data }: { data: ExperienceType[] }) {
  const [ref, inView] = useInView();

  return (
    <section id="experience" ref={ref} className="py-24 bg-[#FFF3D6] border-y-4 border-black">
      <div
        className={`max-w-6xl mx-auto px-6 md:px-8 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="font-extrabold text-black text-4xl md:text-6xl mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: "-0.02em" }}>
          Experience
        </h2>
        <p className="text-black/60 font-semibold mb-12" style={{ fontFamily: "'Inter', sans-serif" }}>
          Where I&apos;ve made things happen
        </p>

        <div className="space-y-8">
          {data.map((exp, i) => {
            const color = ACCENTS[i % ACCENTS.length];
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border-2 border-black p-7 md:p-9 transition-transform duration-200 hover:-translate-y-1"
                style={{ boxShadow: `8px 8px 0 0 ${color}` }}
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-14 h-14 rounded-xl text-white text-2xl font-extrabold flex items-center justify-center border-2 border-black -rotate-3"
                      style={{ background: color }}
                    >
                      {exp.company.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-black text-2xl font-extrabold leading-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                        {exp.role}
                      </h3>
                      <p className="text-black/70 font-bold text-sm mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                        @ {exp.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 rounded-lg bg-[#FF4D6D] text-white text-xs font-bold border-2 border-black" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {exp.duration}
                    </span>
                    {exp.location && (
                      <span className="px-3 py-1.5 rounded-lg bg-white text-black/70 text-xs font-bold border-2 border-black" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {exp.location}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
                  {exp.description.map((point, j) => (
                    <p key={j} className="text-black/70 text-sm leading-relaxed flex gap-2.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                      <span className="font-extrabold mt-0.5" style={{ color }}>→</span>
                      {point}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
