"use client";

import { useInView } from "@/app/hooks/useInView";
import { Projects as ProjectType } from "@/app/types";
import { SKILL_COLORS } from "./constants";
import {
  IconBehance,
  IconDribbble,
  IconFigma,
  IconGithub,
  IconLink,
  IconMedium,
  IconTwitter,
  IconYoutube,
} from "./Icons";
import SectionHeader from "./SectionHeader";

export default function Projects({ data }: { data: ProjectType[] }) {
  const [ref, inView] = useInView();

  const projectLinks = [
    { key: "github", icon: <IconGithub /> },
    { key: "behance", icon: <IconBehance /> },
    { key: "dribbble", icon: <IconDribbble /> },
    { key: "figma", icon: <IconFigma /> },
    { key: "twitter", icon: <IconTwitter /> },
    { key: "medium", icon: <IconMedium /> },
    { key: "youtube", icon: <IconYoutube /> },
    { key: "live", icon: <IconLink /> },
  ];

  return (
    <section id="projects" ref={ref} className="py-24 bg-[#F7F3FF]">
      <div
        className={`max-w-6xl mx-auto px-8 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <SectionHeader
          label="Projects"
          title="Things I've built"
          accent="#5C6BC0"
        />

        <div className="grid md:grid-cols-2 gap-6">
          {data.map((p, i) => {
            // Use specific colors if provided, otherwise cycle through defaults
            const fallback = SKILL_COLORS[i % SKILL_COLORS.length];
            const pColor = p.color || fallback.color;
            const pBg = p.bg || fallback.bg;

            return (
              <div
                key={i}
                className="rounded-3xl p-7 flex flex-col gap-4 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 group"
                style={{
                  background: pBg,
                  boxShadow: `0 4px 24px ${pColor}15`,
                }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: pColor }}
                  >
                    {p.name[0]}
                  </div>
                  <div className="flex gap-2">
                    {projectLinks.map((link) => {
                      const href = p[link.key as keyof ProjectType];
                      if (!href || typeof href !== "string") return null;

                      return (
                        <a
                          key={link.key}
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center hover:bg-white transition-colors duration-200"
                          style={{ color: pColor }}
                          title={link.key === "live" ? "Live Demo" : link.key}
                        >
                          {link.icon}
                        </a>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-[#1A1A2E] mb-2">
                    {p.name}
                  </h3>
                  <p className="text-[#1A1A2E]/55 text-sm leading-relaxed">
                    {p.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-auto pt-2">
                  {p.tech_stack.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                      style={{ background: pColor }}
                    >
                      {t}
                    </span>
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
