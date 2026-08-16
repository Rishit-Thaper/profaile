"use client";

import { PersonalInfo, Stat } from "@/app/types";
import { useEffect, useState } from "react";
import Portrait from "../../_shared/Portrait";
import { ACCENTS } from "./constants";
import {
  Blob,
  IconBehance,
  IconDribbble,
  IconFigma,
  IconGithub,
  IconLinkedin,
  IconMail,
  IconMedium,
  IconPin,
  IconTwitter,
  IconYoutube,
} from "./Icons";

export default function Hero({ data, stats, core_stack }: { data: PersonalInfo; stats?: Stat[]; core_stack?: string[] }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setTimeout(() => setLoaded(true), 80);
  }, []);

  const defaultStats = [
    { val: "1+", label: "Years Exp.", color: "#FF6B6B", bg: "#FFF0F0" },
    { val: "4+", label: "Projects", color: "#5C6BC0", bg: "#F0F1FF" },
    { val: "25%", label: "Perf. Gain", color: "#FFB347", bg: "#FFF8EE" },
    { val: "8.5", label: "CGPA", color: "#26C6B0", bg: "#EDFCFA" },
  ];
  const displayStats = stats && stats.length > 0
    ? stats.map((s, i) => ({
      ...s,
      color: defaultStats[i % defaultStats.length].color,
      bg: defaultStats[i % defaultStats.length].bg
    }))
    : defaultStats;

  const socialLinks = [
    {
      key: "github",
      label: "GitHub",
      icon: <IconGithub />,
      color: "#1A1A2E",
      bg: "#F0F0F0",
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      icon: <IconLinkedin />,
      color: "#0077B5",
      bg: "#E1F1F8",
    },
    {
      key: "behance",
      label: "Behance",
      icon: <IconBehance />,
      color: "#0057ff",
      bg: "#E6EEFF",
    },
    {
      key: "dribbble",
      label: "Dribbble",
      icon: <IconDribbble />,
      color: "#ea4c89",
      bg: "#FDEEF4",
    },
    {
      key: "figma",
      label: "Figma",
      icon: <IconFigma />,
      color: "#F24E1E",
      bg: "#FEEBE6",
    },
    {
      key: "twitter",
      label: "Twitter",
      icon: <IconTwitter />,
      color: "#000000",
      bg: "#F0F0F0",
    },
    {
      key: "medium",
      label: "Medium",
      icon: <IconMedium />,
      color: "#000000",
      bg: "#F0F0F0",
    },
    {
      key: "youtube",
      label: "YouTube",
      icon: <IconYoutube />,
      color: "#FF0000",
      bg: "#FFE6E6",
    },
  ];

  return (
    <section
      id="hero"
      className="min-h-screen bg-[#FFFBF5] relative overflow-hidden flex items-center"
    >
      {/* Animated blobs */}
      <Blob
        color="#FF6B6B"
        className="w-96 h-96 animate-blob"
        style={{ top: "-5%", left: "-5%" }}
      />
      <Blob
        color="#5C6BC0"
        className="w-80 h-80 animate-blob-delay-2"
        style={{ top: "10%", right: "5%" }}
      />
      <Blob
        color="#FFB347"
        className="w-72 h-72 animate-blob-delay-4"
        style={{ bottom: "10%", left: "30%" }}
      />
      <Blob
        color="#26C6B0"
        className="w-64 h-64 animate-blob"
        style={{ bottom: "5%", right: "10%" }}
      />

      <div className="max-w-6xl mx-auto px-8 pt-28 pb-16 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            {/* Available badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EDFCFA] border border-[#26C6B0]/20 mb-8 transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <span className="w-2 h-2 rounded-full bg-[#26C6B0] animate-pulse" />
              <span className="text-[#26C6B0] text-xs font-semibold">
                Available for work
              </span>
            </div>

            <h1
              className={`font-display leading-tight text-[#1A1A2E] mb-4 transition-all duration-700 delay-100 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{
                fontSize: "clamp(3rem, 8vw, 5.5rem)",
                letterSpacing: "-0.03em",
              }}
            >
              Hi, I'm{" "}
              <span className="relative inline-block">
                <span className="relative z-10">{data.name}</span>
                <span
                  className="absolute bottom-2 left-0 right-0 h-4 rounded-full opacity-30 -z-0"
                  style={{ background: "#FF6B6B" }}
                />
              </span>{" "}
              👋
            </h1>

            <p
              className={`text-[#1A1A2E]/60 text-xl leading-relaxed mb-8 transition-all duration-700 delay-200 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              {data.title} — building fast, beautiful, and accessible web
              experiences.
            </p>

            <div
              className={`flex items-center gap-2 text-[#1A1A2E]/40 text-sm mb-10 transition-all duration-700 delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <IconPin /> {data.location}
            </div>

            <div
              className={`flex flex-wrap gap-3 transition-all duration-700 delay-[400ms] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <a
                href={`mailto:${data.email}`}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white text-sm font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{
                  background: "#FF6B6B",
                  boxShadow: "0 8px 24px rgba(255,107,107,0.35)",
                }}
              >
                <IconMail /> Get in touch
              </a>
              {socialLinks.map((social) => {
                const href = data[social.key as keyof PersonalInfo];
                if (!href || typeof href !== "string") return null;

                const isDark =
                  social.color === "#1A1A2E" || social.color === "#000000";

                return (
                  <a
                    key={social.key}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg border border-black/8 shadow-sm"
                    style={{
                      background: isDark ? "white" : social.color,
                      color: isDark ? "#1A1A2E" : "white",
                      boxShadow: isDark
                        ? "0 4px 12px rgba(0,0,0,0.05)"
                        : `0 8px 24px ${social.color}35`,
                    }}
                  >
                    {social.icon} {social.label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right — photo + stat cards */}
          <div
            className={`grid grid-cols-2 gap-4 transition-all duration-700 delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {data.photo && data.photo_visible !== false && (
              <div className="col-span-2 flex justify-center lg:justify-start">
                <Portrait
                  data={data}
                  className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl"
                />
              </div>
            )}
            {displayStats.map((s, i) => (
              <div
                key={i}
                className="rounded-3xl p-6 flex flex-col gap-2 hover:scale-105 transition-transform duration-300"
                style={{ background: s.bg }}
              >
                <span
                  className="font-display text-5xl font-bold"
                  style={{ color: s.color }}
                >
                  {s.val}
                </span>
                <span className="text-[#1A1A2E]/50 text-sm font-medium">
                  {s.label}
                </span>
              </div>
            ))}
            {/* Core stack card spanning full width */}
            {core_stack && core_stack.length > 0 && <div className="col-span-2 rounded-3xl p-6 bg-[#1A1A2E]">
              <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">
                Core Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {(core_stack && core_stack.length > 0 ? core_stack : [
                  "React.js",
                  "Next.js",
                  "TypeScript",
                  "Node.js",
                  "MongoDB",
                ]).map((t, i) => (
                  <span
                    key={t}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold text-white/80"
                    style={{
                      background: ACCENTS[i % ACCENTS.length] + "30",
                      border: `1px solid ${ACCENTS[i % ACCENTS.length]}40`,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>}
          </div>
        </div>
      </div>
    </section>
  );
}
