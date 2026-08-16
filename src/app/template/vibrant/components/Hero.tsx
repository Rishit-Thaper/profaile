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

const PALETTE = ["#FF4D6D", "#FFB703", "#8338EC", "#06D6A0"];
const BG_PALETTE = ["#FFE3E9", "#FFF3D6", "#EBE1FF", "#D9FBF0"];

const SOCIALS = [
  { key: "github", icon: <IconGithub />, color: "#111111" },
  { key: "linkedin", icon: <IconLinkedin />, color: "#0A66C2" },
  { key: "twitter", icon: <IconTwitter />, color: "#111111" },
  { key: "behance", icon: <IconBehance />, color: "#0057FF" },
  { key: "dribbble", icon: <IconDribbble />, color: "#EA4C89" },
  { key: "figma", icon: <IconFigma />, color: "#F24E1E" },
  { key: "medium", icon: <IconMedium />, color: "#111111" },
  { key: "youtube", icon: <IconYoutube />, color: "#FF0000" },
];

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

  const nameParts = data.name.split(" ");

  return (
    <section id="hero" className="relative min-h-screen bg-white overflow-hidden">
      {/* Colorful floating blobs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#FF4D6D]/20 blur-3xl" />
      <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-[#8338EC]/20 blur-3xl" />
      <div className="absolute -bottom-24 left-1/4 w-72 h-72 rounded-full bg-[#06D6A0]/20 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6 md:px-8 pt-32 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#06D6A0] border-2 border-black text-black text-xs font-extrabold uppercase tracking-wider mb-8 -rotate-2 transition-all duration-500 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
              Available for work
            </div>

            <h1
              className="font-extrabold text-black leading-[0.98] mb-6 transition-all duration-500 delay-100"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: "clamp(3rem, 8vw, 5.2rem)",
                letterSpacing: "-0.03em",
              }}
            >
              {nameParts.map((part, i) => (
                <span key={i} className="inline-block mr-[0.25em]" style={{ color: PALETTE[i % PALETTE.length] }}>
                  {part}
                </span>
              ))}
            </h1>

            <p className="text-black/60 text-xl leading-relaxed mb-8 max-w-md transition-all duration-500 delay-200" style={{ fontFamily: "'Inter', sans-serif" }}>
              {data.title}
            </p>

            <div
              className="flex flex-wrap items-center gap-4 mb-10 transition-all duration-500 delay-300"
              style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(12px)" }}
            >
              <a
                href={`mailto:${data.email}`}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-black text-white font-bold text-sm border-2 border-black transition-transform duration-200 hover:-translate-y-1 hover:rotate-1"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <IconMail size={16} /> Hire me
              </a>
              {data.linkedin && (
                <a
                  href={data.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#FFB703] text-black font-bold text-sm border-2 border-black transition-transform duration-200 hover:-translate-y-1 hover:-rotate-1"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <IconLinkedin size={16} /> LinkedIn
                </a>
              )}
            </div>

            {/* Socials */}
            <div
              className="flex flex-wrap gap-3 transition-all duration-500 delay-[400ms]"
              style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(12px)" }}
            >
              {SOCIALS.map((s) => {
                const href = data[s.key as keyof PersonalInfo];
                if (!href || typeof href !== "string") return null;
                return (
                  <a
                    key={s.key}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    title={s.key}
                    className="w-11 h-11 rounded-xl border-2 border-black flex items-center justify-center hover:-translate-y-1 hover:rotate-6 transition-transform duration-200"
                    style={{ background: s.color, color: s.color === "#111111" ? "#fff" : "#fff" }}
                  >
                    {s.icon}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right — photo + stats */}
          <div
            className="grid grid-cols-2 gap-5 transition-all duration-500 delay-200"
            style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(16px)" }}
          >
            {data.photo && data.photo_visible !== false && (
              <div className="col-span-2 flex justify-center lg:justify-end">
                <Portrait
                  data={data}
                  className="w-40 h-40 rounded-full object-cover border-2 border-black shadow-[6px_6px_0_0_#000]"
                />
              </div>
            )}
            {displayStats.map((s, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 border-2 border-black transition-transform duration-200 hover:-translate-y-1.5 hover:rotate-1"
                style={{
                  background: BG_PALETTE[i % BG_PALETTE.length],
                  boxShadow: "6px 6px 0 0 #000",
                }}
              >
                <div
                  className="text-4xl md:text-5xl font-extrabold mb-2"
                  style={{ color: PALETTE[i % PALETTE.length], fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  {s.val}
                </div>
                <div className="text-black/60 text-sm font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {s.label}
                </div>
              </div>
            ))}

            {stack.length > 0 && (
              <div className="col-span-2 rounded-2xl bg-black p-6 border-2 border-black" style={{ boxShadow: "6px 6px 0 0 #FF4D6D" }}>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Core stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {stack.map((t, i) => (
                    <span
                      key={t}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-black"
                      style={{ background: PALETTE[i % PALETTE.length], fontFamily: "'Inter', sans-serif" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
