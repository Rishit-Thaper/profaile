"use client";

import { PersonalInfo, Stat } from "@/app/types";
import { useEffect, useState } from "react";
import Portrait from "../../_shared/Portrait";
import {
  IconBehance,
  IconDribbble,
  IconFigma,
  IconGithub,
  IconLinkedin,
  IconMail,
  IconMedium,
  IconTwitter,
  IconYoutube,
} from "../../_shared/icons";

const SOCIALS = [
  { key: "github", label: "github", icon: <IconGithub /> },
  { key: "linkedin", label: "linkedin", icon: <IconLinkedin /> },
  { key: "twitter", label: "x", icon: <IconTwitter /> },
  { key: "behance", label: "behance", icon: <IconBehance /> },
  { key: "dribbble", label: "dribbble", icon: <IconDribbble /> },
  { key: "figma", label: "figma", icon: <IconFigma /> },
  { key: "medium", label: "medium", icon: <IconMedium /> },
  { key: "youtube", label: "youtube", icon: <IconYoutube /> },
];

const STAT_COLORS = ["#00E5FF", "#7C5CFC", "#FF2E93", "#4DEEA8"];

export default function Hero({
  data,
  stats,
  core_stack,
}: {
  data: PersonalInfo;
  stats?: Stat[];
  core_stack?: string[];
}) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(t);
  }, []);

  const displayStats = (stats && stats.length > 0 ? stats : []).slice(0, 4);
  const stack = core_stack && core_stack.length > 0 ? core_stack : [];

  return (
    <section id="hero" className="relative min-h-screen bg-[#0A0A12] overflow-hidden flex items-center">
      {/* Grid + glow backdrop */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,229,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full bg-[#7C5CFC]/20 blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 w-[480px] h-[480px] rounded-full bg-[#FF2E93]/15 blur-[120px]" />

      <div className="relative max-w-6xl mx-auto px-6 md:px-8 pt-32 pb-20 w-full z-10">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <div>
            <div
              className={`font-mono text-[#00E5FF] text-xs tracking-widest uppercase mb-6 transition-all duration-700 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {"// hello, i'm"}
            </div>

            <h1
              className="text-white font-bold leading-[1.05] mb-5 transition-all duration-700 delay-100"
              style={{
                fontSize: "clamp(2.8rem, 7vw, 5rem)",
                letterSpacing: "-0.03em",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {data.name}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#7C5CFC] to-[#FF2E93]">
                {data.title}
              </span>
            </h1>

            <div
              className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/50 text-sm mb-8 transition-all duration-700 delay-200 font-mono"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {data.location && <span>📍 {data.location}</span>}
              {data.email && <span>{data.email}</span>}
            </div>

            <div
              className="flex flex-wrap items-center gap-3 mb-10 transition-all duration-700 delay-300"
              style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(12px)" }}
            >
              <a
                href={`mailto:${data.email}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00E5FF] via-[#7C5CFC] to-[#FF2E93] text-[#0A0A12] font-semibold text-sm transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(124,92,252,0.45)]"
              >
                <IconMail size={16} /> Get in touch
              </a>
              {SOCIALS.map((s) => {
                const href = data[s.key as keyof PersonalInfo];
                if (!href || typeof href !== "string") return null;
                return (
                  <a
                    key={s.key}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    title={s.label}
                    className="w-11 h-11 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/60 hover:text-[#00E5FF] hover:border-[#00E5FF]/50 hover:shadow-[0_0_20px_rgba(0,229,255,0.25)] transition-all duration-300"
                  >
                    {s.icon}
                  </a>
                );
              })}
            </div>

            {stack.length > 0 && (
              <div
                className="flex flex-wrap gap-2 transition-all duration-700 delay-[400ms]"
                style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(12px)" }}
              >
                {stack.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-xs px-3 py-1.5 rounded-md border border-white/10 text-white/60"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right — photo + stats */}
          <div className="space-y-6">
            {data.photo && data.photo_visible !== false && (
              <div
                className="flex justify-center lg:justify-end transition-all duration-700 delay-100"
                style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(16px)" }}
              >
                <Portrait
                  data={data}
                  className="w-40 h-40 rounded-full object-cover border-2 border-[#00E5FF]/60 shadow-[0_0_40px_rgba(0,229,255,0.25)]"
                />
              </div>
            )}

            <div
              className="grid grid-cols-2 gap-4 transition-all duration-700 delay-200"
              style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(16px)" }}
            >
            {displayStats.map((s, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 bg-[#12121D] border border-white/5 hover:border-white/10 hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className="text-4xl md:text-5xl font-bold mb-2"
                  style={{
                    color: STAT_COLORS[i % STAT_COLORS.length],
                    fontFamily: "'Space Grotesk', sans-serif",
                    textShadow: `0 0 30px ${STAT_COLORS[i % STAT_COLORS.length]}55`,
                  }}
                >
                  {s.val}
                </div>
                <div className="text-white/45 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
