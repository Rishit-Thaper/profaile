"use client";

import { useInView } from "@/app/hooks/useInView";
import { Experience as ExperienceType } from "@/app/types";

function SectionLabel({ children }: { children: string }) {
  return (
    <div
      className="font-mono text-xs tracking-widest uppercase text-[#00E5FF] mb-4"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      {"{"} {children} {"}"}
    </div>
  );
}

export default function Experience({ data }: { data: ExperienceType[] }) {
  const [ref, inView] = useInView();

  return (
    <section id="experience" ref={ref} className="py-24 bg-[#0A0A12]">
      <div
        className={`max-w-6xl mx-auto px-6 md:px-8 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <SectionLabel>experience.ts</SectionLabel>
        <h2
          className="text-white font-bold text-4xl md:text-5xl mb-12"
          style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
        >
          Where I&apos;ve <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#7C5CFC]">worked</span>
        </h2>

        <div className="space-y-5">
          {data.map((exp, i) => (
            <div
              key={i}
              className="group rounded-2xl bg-[#12121D] border border-white/5 hover:border-[#00E5FF]/40 transition-all duration-300 p-7 md:p-8 relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#00E5FF] via-[#7C5CFC] to-[#FF2E93]" />
              <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                <div>
                  <h3
                    className="text-white text-xl font-semibold mb-1"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {exp.role}
                  </h3>
                  <p className="text-[#00E5FF] font-mono text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    @ {exp.company}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 font-mono text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  <span className="px-3 py-1.5 rounded-md bg-white/[0.04] border border-white/10 text-white/60">
                    {exp.duration}
                  </span>
                  {exp.location && (
                    <span className="px-3 py-1.5 rounded-md bg-white/[0.04] border border-white/10 text-white/40">
                      {exp.location}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
                {exp.description.map((point, j) => (
                  <p key={j} className="text-white/60 text-sm leading-relaxed flex gap-3">
                    <span className="text-[#7C5CFC] font-mono mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      +
                    </span>
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
