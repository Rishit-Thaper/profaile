"use client";

import { useInView } from "@/app/hooks/useInView";
import { Experience as ExperienceType } from "@/app/types";

export default function Experience({ data }: { data: ExperienceType[] }) {
  const [ref, inView] = useInView();

  return (
    <section id="experience" ref={ref} className="py-24 bg-[#F4EFE4]">
      <div
        className={`max-w-5xl mx-auto px-6 md:px-8 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="flex items-center gap-4 mb-3">
          <span className="text-[#A98647] text-sm" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            (01)
          </span>
          <span className="h-px flex-1 bg-[#A98647]/40" />
        </div>
        <h2
          className="text-[#26221C] text-4xl md:text-5xl mb-12"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "-0.01em" }}
        >
          Professional <span className="italic text-[#A98647]">Experience</span>
        </h2>

        <div className="space-y-10">
          {data.map((exp, i) => (
            <div key={i} className="relative pl-10 md:pl-14">
              {/* Timeline dot */}
              <div className="absolute left-0 top-2 w-3.5 h-3.5 rounded-full border-2 border-[#A98647] bg-[#F4EFE4]" />
              <div className="absolute left-[6px] top-10 bottom-[-3.5rem] w-px bg-[#A98647]/30 last:hidden" />

              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                <h3 className="text-[#26221C] text-2xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  {exp.role}
                  <span className="text-[#6B655A] italic"> · {exp.company}</span>
                </h3>
                <span className="text-[#6B655A] text-xs uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {exp.duration}
                  {exp.location ? ` — ${exp.location}` : ""}
                </span>
              </div>

              <ul className="space-y-2.5 mt-4 max-w-3xl">
                {exp.description.map((point, j) => (
                  <li key={j} className="text-[#4A443B] text-[15px] leading-relaxed flex gap-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <span className="text-[#A98647] mt-[2px] text-xs">—</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
