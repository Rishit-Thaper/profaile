"use client";

import { useInView } from "@/app/hooks/useInView";
import { Education as EducationType } from "@/app/types";

export default function Education({ data }: { data: EducationType[] }) {
  const [ref, inView] = useInView();
  const edu = data[0];

  if (!edu) return null;

  return (
    <section id="education" ref={ref} className="py-24 bg-[#0B0B14]">
      <div
        className={`max-w-6xl mx-auto px-6 md:px-8 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div
          className="font-mono text-xs tracking-widest uppercase text-[#4DEEA8] mb-4"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {"cat education.txt"}
        </div>
        <h2
          className="text-white font-bold text-4xl md:text-5xl mb-12"
          style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
        >
          Where I <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4DEEA8] to-[#00E5FF]">studied</span>
        </h2>

        <div className="rounded-2xl bg-[#12121D] border border-white/5 p-8 md:p-10 flex flex-wrap items-center gap-8">
          <div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4DEEA8] to-[#00E5FF] flex items-center justify-center text-[#0A0A12] font-bold text-2xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {edu.institution.charAt(0)}
          </div>
          <div className="flex-1 min-w-[220px]">
            <h3 className="text-white text-2xl font-semibold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {edu.institution}
            </h3>
            <p className="text-[#4DEEA8] font-mono text-sm mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {edu.degree}
              {edu.field ? ` · ${edu.field}` : ""}
            </p>
            <span className="font-mono text-xs px-3 py-1.5 rounded-md bg-white/[0.04] border border-white/10 text-white/50" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {edu.duration}
            </span>
          </div>
          {edu.gpa && (
            <div className="text-center">
              <div className="text-5xl font-bold text-[#4DEEA8]" style={{ fontFamily: "'Space Grotesk', sans-serif", textShadow: "0 0 30px rgba(77,238,168,0.4)" }}>
                {edu.gpa}
              </div>
              <div className="font-mono text-xs text-white/40 mt-1 uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                gpa
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
