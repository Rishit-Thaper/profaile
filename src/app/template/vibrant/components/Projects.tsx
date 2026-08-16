"use client";

import { useInView } from "@/app/hooks/useInView";
import { Projects as ProjectType } from "@/app/types";

const PALETTE = [
  { color: "#FF4D6D", bg: "#FFE3E9" },
  { color: "#8338EC", bg: "#EBE1FF" },
  { color: "#06D6A0", bg: "#D9FBF0" },
  { color: "#FFB703", bg: "#FFF3D6" },
];

export default function Projects({ data }: { data: ProjectType[] }) {
  const [ref, inView] = useInView();

  return (
    <section id="projects" ref={ref} className="py-24 bg-white">
      <div
        className={`max-w-6xl mx-auto px-6 md:px-8 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="font-extrabold text-black text-4xl md:text-6xl mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: "-0.02em" }}>
          Things I&apos;ve{" "}
          <span className="inline-block -rotate-2" style={{ color: "#8338EC" }}>
            built
          </span>
        </h2>
        <p className="text-black/60 font-semibold mb-12" style={{ fontFamily: "'Inter', sans-serif" }}>
          Projects I&apos;m proud of
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {data.map((p, i) => {
            const palette = PALETTE[i % PALETTE.length];
            return (
              <div
                key={i}
                className="group rounded-2xl border-2 border-black p-7 flex flex-col transition-transform duration-200 hover:-translate-y-1.5"
                style={{ background: palette.bg, boxShadow: `6px 6px 0 0 ${palette.color}` }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-12 h-12 rounded-xl text-white text-xl font-extrabold flex items-center justify-center border-2 border-black rotate-3 group-hover:-rotate-3 transition-transform duration-200"
                    style={{ background: palette.color }}
                  >
                    {p.name.charAt(0)}
                  </div>
                  <span className="text-black/50 text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="text-black text-2xl font-extrabold mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  {p.name}
                </h3>
                <p className="text-black/70 text-sm leading-relaxed mb-6 flex-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {p.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {p.tech_stack.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg bg-white text-black/70 text-xs font-bold border-2 border-black"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  {p.live && (
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-xs font-bold border-2 border-black hover:bg-white hover:text-black transition-colors duration-200"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Live demo ↗
                    </a>
                  )}
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-xs font-bold border-2 border-black hover:bg-black hover:text-white transition-colors duration-200"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
