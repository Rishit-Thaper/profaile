"use client";

import { PersonalInfo, Stat } from "@/app/types";
import { useEffect, useState } from "react";
import Portrait from "../../_shared/Portrait";

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
    <section id="hero" className="relative min-h-screen bg-[#FAF7F0] flex items-center overflow-hidden">
      <div className="absolute inset-0 opacity-[0.5]" style={{
        backgroundImage: "radial-gradient(#26221C08 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }} />

      <div className="relative max-w-5xl mx-auto px-6 md:px-8 pt-32 pb-24 w-full">
        {/* Portrait */}
        {data.photo && data.photo_visible !== false && (
          <div
            className={`mb-10 flex justify-center md:justify-end transition-all duration-700 delay-50 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Portrait
              data={data}
              className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border border-[#A98647]/40 shadow-[0_16px_40px_rgba(38,34,28,0.12)]"
            />
          </div>
        )}

        {/* Eyebrow */}
        <div
          className={`flex items-center gap-3 mb-8 transition-all duration-700 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="h-px w-12 bg-[#A98647]" />
          <span
            className="text-[#A98647] text-xs tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {data.title}
          </span>
        </div>

        {/* Name */}
        <h1
          className="text-[#26221C] leading-[1.05] mb-8 transition-all duration-700 delay-100"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(3.4rem, 9vw, 6.5rem)",
            letterSpacing: "-0.01em",
          }}
        >
          {data.name}
          <span className="block text-[#A98647] italic">{data.title}</span>
        </h1>

        <div
          className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[#6B655A] text-sm mb-12 transition-all duration-700 delay-200"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {data.location && (
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A98647]" />
              {data.location}
            </span>
          )}
          {data.email && (
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6E8B5E]" />
              {data.email}
            </span>
          )}
        </div>

        {/* Actions */}
        <div
          className="flex flex-wrap items-center gap-8 mb-14 transition-all duration-700 delay-300"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <a
            href={`mailto:${data.email}`}
            className="inline-flex items-center gap-3 px-7 py-3 bg-[#26221C] text-[#FAF7F0] text-sm tracking-wide hover:bg-[#A98647] transition-colors duration-300"
          >
            Get in touch <span aria-hidden>→</span>
          </a>
          {data.github && (
            <a
              href={data.github}
              target="_blank"
              rel="noreferrer"
              className="text-[#6B655A] hover:text-[#26221C] text-sm underline underline-offset-4 decoration-[#A98647] decoration-1 transition-colors duration-200"
            >
              GitHub
            </a>
          )}
          {data.linkedin && (
            <a
              href={data.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-[#6B655A] hover:text-[#26221C] text-sm underline underline-offset-4 decoration-[#A98647] decoration-1 transition-colors duration-200"
            >
              LinkedIn
            </a>
          )}
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-[#26221C]/15 pt-10 transition-all duration-700 delay-[400ms]"
          style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(12px)" }}
        >
          {displayStats.map((s, i) => (
            <div key={i}>
              <div
                className="text-[#A98647] text-4xl font-medium leading-none mb-2"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {s.val}
              </div>
              <div className="text-[#6B655A] text-xs uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {stack.length > 0 && (
          <div
            className="flex flex-wrap gap-x-6 gap-y-2 mt-10 transition-all duration-700 delay-500"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {stack.map((t) => (
              <span key={t} className="text-[#6B655A] text-sm italic">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
