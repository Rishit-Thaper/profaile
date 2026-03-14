"use client";

import { useInView } from "@/app/hooks/useInView";
import { Projects as ProjectType } from "@/app/types";
import {
  IconArrow,
  IconBehance,
  IconDribbble,
  IconFigma,
  IconGithub,
  IconMedium,
  IconTwitter,
  IconYoutube,
} from "./Icons";

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
    { key: "live", icon: <IconArrow /> },
  ];

  return (
    <section
      id="projects"
      ref={ref}
      className="py-32 bg-[#0D1F16] relative overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(#F5F0E8 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="max-w-7xl mx-auto px-10 relative">
        <div
          className={`flex items-start gap-6 mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <span className="font-display text-[#C4622D] text-sm font-bold tracking-widest mt-2">
            02
          </span>
          <div>
            <h2 className="font-display text-5xl text-[#F5F0E8] font-bold leading-none">
              Projects
            </h2>
            <div className="w-12 h-1 bg-[#C4622D] mt-4" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-[#F5F0E8]/10">
          {data.map((p, i) => (
            <div
              key={i}
              className={`bg-[#0D1F16] p-8 group hover:bg-[#122A1C] transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${i * 100 + 200}ms` }}
            >
              {/* Project number */}
              <div className="flex items-start justify-between mb-6">
                <span className="font-display text-6xl text-[#F5F0E8]/[0.06] font-bold leading-none select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {projectLinks.map((link) => {
                    const href = p[link.key as keyof ProjectType];
                    if (!href || typeof href !== "string") return null;

                    return (
                      <a
                        key={link.key}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="w-9 h-9 border border-[#F5F0E8]/20 flex items-center justify-center text-[#F5F0E8]/50 hover:text-[#C4622D] hover:border-[#C4622D]/40 transition-colors"
                        title={link.key === "live" ? "Live Demo" : link.key}
                      >
                        {link.icon}
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="w-8 h-px bg-[#C4622D] mb-5 group-hover:w-16 transition-all duration-500" />
              <h3 className="font-display text-[#F5F0E8] text-2xl font-bold mb-3 group-hover:text-[#C4622D] transition-colors duration-300">
                {p.name}
              </h3>
              <p className="text-[#F5F0E8]/50 text-sm leading-relaxed mb-6">
                {p.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {p.tech_stack.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-3 py-1 bg-[#F5F0E8]/5 text-[#F5F0E8]/40 border border-[#F5F0E8]/10 group-hover:border-[#C4622D]/20 group-hover:text-[#C4622D]/70 transition-all duration-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
