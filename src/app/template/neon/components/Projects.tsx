"use client";

import { useInView } from "@/app/hooks/useInView";
import { Projects as ProjectType } from "@/app/types";
import { IconArrowUpRight, IconBehance, IconDribbble, IconFigma, IconGithub, IconLink, IconMedium, IconTwitter, IconYoutube } from "../../_shared/icons";

const LINKS = [
  { key: "github", icon: <IconGithub size={14} /> },
  { key: "behance", icon: <IconBehance size={14} /> },
  { key: "dribbble", icon: <IconDribbble size={14} /> },
  { key: "figma", icon: <IconFigma size={14} /> },
  { key: "twitter", icon: <IconTwitter size={14} /> },
  { key: "medium", icon: <IconMedium size={14} /> },
  { key: "youtube", icon: <IconYoutube size={14} /> },
  { key: "live", icon: <IconLink size={14} /> },
];

const ACCENTS = ["#00E5FF", "#7C5CFC", "#FF2E93", "#4DEEA8"];

export default function Projects({ data }: { data: ProjectType[] }) {
  const [ref, inView] = useInView();

  return (
    <section id="projects" ref={ref} className="py-24 bg-[#0B0B14]">
      <div
        className={`max-w-6xl mx-auto px-6 md:px-8 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div
          className="font-mono text-xs tracking-widest uppercase text-[#7C5CFC] mb-4"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {"ls ./projects"}
        </div>
        <h2
          className="text-white font-bold text-4xl md:text-5xl mb-12"
          style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
        >
          Things I&apos;ve <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFC] to-[#FF2E93]">built</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {data.map((p, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <div
                key={i}
                className="group relative rounded-2xl bg-[#12121D] border border-white/5 hover:border-white/15 transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />
                <div className="p-7 flex flex-col gap-4 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center font-mono text-sm font-bold"
                        style={{ color: accent, background: `${accent}14`, border: `1px solid ${accent}30` }}
                      >
                        {p.name.charAt(0)}
                      </div>
                      <h3
                        className="text-white text-lg font-semibold leading-snug"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {p.name}
                      </h3>
                    </div>
                    <a
                      href={p.live || p.github || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white/40 hover:text-[#00E5FF] transition-colors duration-200"
                      aria-label={`Open ${p.name}`}
                    >
                      <IconArrowUpRight />
                    </a>
                  </div>

                  <p className="text-white/55 text-sm leading-relaxed">{p.description}</p>

                  <div className="flex flex-wrap gap-2 mt-auto pt-2">
                    {p.tech_stack.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[11px] px-2.5 py-1 rounded-md border border-white/10 text-white/50"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    {LINKS.map((link) => {
                      const href = p[link.key as keyof ProjectType];
                      if (!href || typeof href !== "string") return null;
                      return (
                        <a
                          key={link.key}
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="w-8 h-8 rounded-md bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/40 hover:text-[#00E5FF] hover:border-[#00E5FF]/40 transition-all duration-200"
                          title={link.key}
                        >
                          {link.icon}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
