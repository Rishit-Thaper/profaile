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
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  const displayStats = (stats && stats.length > 0 ? stats : []).slice(0, 4);
  const stack = core_stack && core_stack.length > 0 ? core_stack : [];

  const lines = [
    { cmd: "whoami", out: data.name },
    { cmd: "role", out: data.title },
  ];

  return (
    <section id="hero" className="relative min-h-screen bg-[#0D0D0D] flex items-center overflow-hidden">
      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0 2px, #00FF9C 2px 3px)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 md:px-8 pt-32 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Terminal window */}
          <div
            className="bg-[#111111] border border-[#00FF9C]/30 rounded-lg overflow-hidden shadow-[0_0_60px_rgba(0,255,156,0.08)] transition-all duration-700"
            style={{ fontFamily: "'JetBrains Mono', monospace", opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(14px)" }}
          >
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#161616] border-b border-[#00FF9C]/20">
              <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <span className="w-3 h-3 rounded-full bg-[#28C840]" />
              <span className="ml-3 text-[#3D6B54] text-xs">guest@{data.name.toLowerCase().replace(/\s+/g, "-")}: ~/portfolio</span>
            </div>

            {/* Body */}
            <div className="p-6 md:p-8 text-sm space-y-4">
              {lines.map((line, i) => (
                <div key={i} className={loaded ? "opacity-100" : "opacity-0"}>
                  <div className="text-[#00B3FF]">
                    <span className="text-[#3D6B54]">guest@profaile</span>
                    <span className="text-[#3D6B54]">:</span>
                    <span className="text-[#00B3FF]">~</span>
                    <span className="text-[#3D6B54]">$</span>{" "}
                    <span className="text-[#D4FFEA]">{line.cmd}</span>
                  </div>
                  <div className="text-[#00FF9C] mt-1">
                    {line.out}
                    <span className="text-[#3D6B54]">;</span>
                  </div>
                </div>
              ))}

              <div className="text-[#00B3FF]">
                <span className="text-[#3D6B54]">guest@profaile</span>
                <span className="text-[#3D6B54]">:</span>
                <span className="text-[#00B3FF]">~</span>
                <span className="text-[#3D6B54]">$</span>{" "}
                <span className="animate-pulse text-[#00FF9C]">▊</span>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Photo */}
            {data.photo && data.photo_visible !== false && (
              <div
                className="bg-[#111111] border border-[#00FF9C]/30 rounded-lg p-3 transition-all duration-700"
                style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(14px)" }}
              >
                <Portrait
                  data={data}
                  className="w-full aspect-square object-cover rounded-md grayscale contrast-[0.85]"
                />
              </div>
            )}

            {/* Contact block */}
            <div
              className="bg-[#111111] border border-[#00FF9C]/30 rounded-lg p-6 text-sm space-y-2.5 transition-all duration-700 delay-100"
              style={{ fontFamily: "'JetBrains Mono', monospace", opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(14px)" }}
            >
              {data.email && (
                <div className="flex items-center justify-between gap-4 text-[#3D6B54]">
                  <span>email</span>
                  <a href={`mailto:${data.email}`} className="text-[#00B3FF] hover:text-[#00FF9C] transition-colors">{data.email}</a>
                </div>
              )}
              {data.location && (
                <div className="flex items-center justify-between gap-4 text-[#3D6B54]">
                  <span>location</span>
                  <span className="text-[#D4FFEA]">{data.location}</span>
                </div>
              )}
              {data.github && (
                <div className="flex items-center justify-between gap-4 text-[#3D6B54]">
                  <span>github</span>
                  <a href={data.github} target="_blank" rel="noreferrer" className="text-[#00B3FF] hover:text-[#00FF9C] transition-colors">@{data.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}</a>
                </div>
              )}
              {data.linkedin && (
                <div className="flex items-center justify-between gap-4 text-[#3D6B54]">
                  <span>linkedin</span>
                  <a href={data.linkedin} target="_blank" rel="noreferrer" className="text-[#00B3FF] hover:text-[#00FF9C] transition-colors">connect</a>
                </div>
              )}
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-2 gap-4 transition-all duration-700 delay-200"
              style={{ fontFamily: "'JetBrains Mono', monospace", opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(14px)" }}
            >
              {displayStats.map((s, i) => (
                <div key={i} className="bg-[#111111] border border-[#00FF9C]/30 rounded-lg p-5">
                  <div className="text-3xl text-[#00FF9C]">{s.val}</div>
                  <div className="text-xs text-[#3D6B54] mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Core stack */}
            {stack.length > 0 && (
              <div
                className="bg-[#111111] border border-[#00FF9C]/30 rounded-lg p-6 transition-all duration-700 delay-300"
                style={{ fontFamily: "'JetBrains Mono', monospace", opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(14px)" }}
              >
                <div className="text-[#3D6B54] text-xs mb-3">
                  $ skills --core
                </div>
                <div className="flex flex-wrap gap-2">
                  {stack.map((t) => (
                    <span key={t} className="text-xs text-[#00FF9C] border border-[#00FF9C]/30 rounded px-2.5 py-1">
                      [{t}]
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
