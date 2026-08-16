"use client";

import { PersonalInfo, Stat } from "@/app/types";
import { useEffect, useState } from "react";
import Portrait from "../../_shared/Portrait";
import {
  IconArrow,
  IconBehance,
  IconDribbble,
  IconFigma,
  IconGithub,
  IconLinkedin,
  IconMedium,
  IconPin,
  IconTwitter,
  IconYoutube,
} from "./Icons";

export default function Hero({ data, stats, core_stack }: { data: PersonalInfo; stats?: Stat[]; core_stack?: string[] }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  const displayStats = stats && stats.length > 0
    ? stats
    : [
      { val: "1+", label: "Years" },
      { val: "4+", label: "Projects" },
      { val: "25%", label: "Avg. Perf. Gain" },
      { val: "8.5", label: "CGPA" },
    ];

  const socialLinks = [
    { key: "github", label: "GitHub" },
    { key: "linkedin", label: "LinkedIn" },
    { key: "behance", label: "Behance" },
    { key: "dribbble", label: "Dribbble" },
    { key: "figma", label: "Figma" },
    { key: "twitter", label: "Twitter" },
    { key: "medium", label: "Medium" },
    { key: "youtube", label: "YouTube" },
  ];

  const getIcon = (key: string) => {
    switch (key) {
      case "github":
        return <IconGithub />;
      case "linkedin":
        return <IconLinkedin />;
      case "behance":
        return <IconBehance />;
      case "dribbble":
        return <IconDribbble />;
      case "figma":
        return <IconFigma />;
      case "twitter":
        return <IconTwitter />;
      case "medium":
        return <IconMedium />;
      case "youtube":
        return <IconYoutube />;
      default:
        return null;
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen bg-[#0D1F16] overflow-hidden flex items-end pb-20"
    >
      {/* Diagonal slice background remains same */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#0D1F16]" />
        <div
          className="absolute right-0 top-0 w-[45%] h-full bg-[#122A1C]"
          style={{ clipPath: "polygon(8% 0, 100% 0, 100% 100%, 0% 100%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: "200px",
          }}
        />
        <div
          className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(196,98,45,0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="absolute top-20 right-12 font-display text-[22rem] text-[#F5F0E8]/[0.02] leading-none select-none pointer-events-none">
        {data.name.split(" ")[0]}
      </div>

      <div className="relative max-w-7xl mx-auto px-10 w-full pt-32">
        <div className="grid grid-cols-12 gap-8 items-end">
          <div className="col-span-12 lg:col-span-7">
            <div
              className={`transition-all duration-1000 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-px bg-[#C4622D]" />
                <span className="text-[#C4622D] text-xs tracking-[0.4em] uppercase">
                  Available for work
                </span>
              </div>
              <h1 className="font-display leading-[0.95] mb-6">
                <span className="block text-[#F5F0E8]/30 text-2xl tracking-[0.3em] uppercase mb-4">
                  {data.title}
                </span>
                <span
                  className="block text-[4rem] sm:text-7xl md:text-[8rem] lg:text-[10rem] text-[#F5F0E8] font-bold break-words leading-none"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  {data.name.split(" ")[0]}
                </span>
                <span
                  className="block text-[4rem] sm:text-7xl md:text-[8rem] lg:text-[10rem] font-bold break-words leading-none mt-2 md:mt-4"
                  style={{
                    letterSpacing: "-0.03em",
                    WebkitTextStroke: "1px rgba(245,240,232,0.25)",
                    color: "transparent",
                  }}
                >
                  {data.name.split(" ").slice(1).join(" ")}
                </span>
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-8">
                {socialLinks.map((social) => {
                  const href = data[social.key as keyof PersonalInfo];
                  if (!href || typeof href !== "string") return null;

                  if (social.key === "github") {
                    return (
                      <a
                        key={social.key}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 px-8 py-4 bg-[#C4622D] text-[#F5F0E8] text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#D4733E] transition-colors duration-200 group"
                      >
                        <IconGithub /> {social.label}
                        <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
                          <IconArrow />
                        </span>
                      </a>
                    );
                  }

                  return (
                    <a
                      key={social.key}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2.5 px-8 py-4 border border-[#F5F0E8]/20 text-[#F5F0E8]/70 text-xs tracking-[0.2em] uppercase hover:border-[#F5F0E8]/60 hover:text-[#F5F0E8] transition-all duration-200 group"
                    >
                      {getIcon(social.key)} {social.label}
                      <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 ml-1">
                        <IconArrow />
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right panel — spans 5 cols */}
          <div
            className={`col-span-12 lg:col-span-5 transition-all duration-1000 delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="border border-[#F5F0E8]/10 bg-[#F5F0E8]/[0.03] backdrop-blur-sm p-8">
              {/* Portrait */}
              {data.photo && data.photo_visible !== false && (
                <div className="mb-6 pb-6 border-b border-[#F5F0E8]/10 flex justify-center">
                  <Portrait
                    data={data}
                    className="w-40 h-40 rounded-full object-cover border-2 border-[#C4622D]/60"
                  />
                </div>
              )}
              {/* Location & contact */}
              <div className="flex items-center gap-2 text-[#F5F0E8]/40 text-xs mb-6 pb-6 border-b border-[#F5F0E8]/10">
                <IconPin />
                <span>{data.location}</span>
                <span className="ml-auto text-[#C4622D]">{data.email}</span>
              </div>
              {/* Stats */}
              <div className="grid grid-cols-2 gap-px bg-[#F5F0E8]/10">
                {displayStats.map((s, i) => (
                  <div
                    key={i}
                    className="bg-[#0D1F16] p-5 hover:bg-[#122A1C] transition-colors duration-200"
                  >
                    <p className="font-display text-4xl text-[#C4622D] font-bold leading-none mb-2">
                      {s.val}
                    </p>
                    <p className="text-[#F5F0E8]/40 text-xs tracking-wider uppercase">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
              {/* Core stack */}
              {core_stack && core_stack.length > 0 && <div className="mt-6">
                <p className="text-[#F5F0E8]/30 text-xs tracking-[0.3em] uppercase mb-3">
                  Core Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {(core_stack && core_stack.length > 0 ? core_stack : ["React.js", "Next.js", "TypeScript", "Node.js"]).map((t) => (
                    <span
                      key={t}
                      className="text-xs px-3 py-1.5 bg-[#C4622D]/10 text-[#C4622D] border border-[#C4622D]/20 hover:bg-[#C4622D]/20 transition-colors cursor-default"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[#F5F0E8]/20 text-xs tracking-[0.3em] uppercase">
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-[#F5F0E8]/20 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
