"use client";

import { useInView } from "@/app/hooks/useInView";
import { Projects as ProjectType } from "@/app/types";

export default function Projects({ data }: { data: ProjectType[] }) {
  const [ref, inView] = useInView();

  return (
    <section id="projects" ref={ref} className="py-24 bg-[#FAF7F0]">
      <div
        className={`max-w-5xl mx-auto px-6 md:px-8 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="flex items-center gap-4 mb-3">
          <span className="text-[#A98647] text-sm" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            (02)
          </span>
          <span className="h-px flex-1 bg-[#A98647]/40" />
        </div>
        <h2
          className="text-[#26221C] text-4xl md:text-5xl mb-12"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "-0.01em" }}
        >
          Selected <span className="italic text-[#A98647]">Work</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {data.map((p, i) => (
            <a
              key={i}
              href={p.live || p.github || "#"}
              target="_blank"
              rel="noreferrer"
              className="group bg-white border border-[#26221C]/10 hover:border-[#A98647]/50 hover:-translate-y-1 transition-all duration-300 p-8 flex flex-col"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="text-[#A98647] text-xs tracking-[0.2em] uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {String(i + 1).padStart(2, "0")} / Project
                </span>
                <span className="text-[#6B655A] group-hover:text-[#A98647] group-hover:rotate-45 transition-all duration-300 text-lg leading-none">↗</span>
              </div>

              <h3
                className="text-[#26221C] text-3xl mb-3 group-hover:text-[#A98647] transition-colors duration-300"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {p.name}
              </h3>

              <p className="text-[#4A443B] text-sm leading-relaxed mb-6 flex-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                {p.description}
              </p>

              <div className="flex flex-wrap gap-x-4 gap-y-1.5 border-t border-[#26221C]/10 pt-4">
                {p.tech_stack.map((t) => (
                  <span key={t} className="text-[#6B655A] text-xs uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
