"use client";

import { useInView } from "@/app/hooks/useInView";
import { Projects as ProjectType } from "@/app/types";

export default function Projects({ data }: { data: ProjectType[] }) {
  const [ref, inView] = useInView();

  return (
    <section id="projects" ref={ref} className="py-24 bg-[#0B0B0B]">
      <div
        className={`max-w-6xl mx-auto px-6 md:px-8 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        <div className="text-[#3D6B54] text-sm mb-3">
          <span className="text-[#00B3FF]">$</span> ls ./projects
        </div>
        <h2 className="text-[#00FF9C] text-3xl md:text-4xl mb-12">
          # Projects
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {data.map((p, i) => (
            <div key={i} className="group bg-[#111111] border border-[#00B3FF]/25 rounded-lg overflow-hidden hover:border-[#00B3FF]/60 transition-colors duration-200 flex flex-col">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-[#161616] border-b border-[#00B3FF]/20">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3D6B54]" />
                <span className="text-[#3D6B54] text-xs truncate">
                  ./projects/{p.name.toLowerCase().replace(/\s+/g, "-")}
                </span>
              </div>

              <div className="p-6 flex flex-col gap-4 flex-1">
                <h3 className="text-[#00B3FF] text-lg">
                  <span className="text-[#3D6B54]">› </span>
                  {p.name}
                </h3>
                <p className="text-[#D4FFEA]/70 text-sm leading-relaxed flex-1">
                  {p.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {p.tech_stack.map((t) => (
                    <span key={t} className="text-[11px] text-[#00FF9C] border border-[#00FF9C]/30 rounded px-2 py-1">
                      {t}
                    </span>
                  ))}
                </div>

                {(p.live || p.github) && (
                  <div className="flex items-center gap-3 pt-1">
                    {p.live && (
                      <a
                        href={p.live}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#00FF9C] hover:bg-[#00FF9C] hover:text-black px-2.5 py-1.5 border border-[#00FF9C]/40 rounded transition-colors duration-150"
                      >
                        ./run ↗
                      </a>
                    )}
                    {p.github && (
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#00B3FF] hover:bg-[#00B3FF] hover:text-black px-2.5 py-1.5 border border-[#00B3FF]/40 rounded transition-colors duration-150"
                      >
                        ./source
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
