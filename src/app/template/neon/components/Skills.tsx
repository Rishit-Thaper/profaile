"use client";

import { useInView } from "@/app/hooks/useInView";
import { Skills as SkillsType } from "@/app/types";

const CAT_COLORS: Record<string, string> = {
  languages: "#00E5FF",
  frameworks: "#7C5CFC",
  databases: "#FF2E93",
  tools: "#4DEEA8",
};

export default function Skills({ data }: { data: SkillsType }) {
  const [ref, inView] = useInView();

  const categories = (Object.entries(data) as [string, string[]][]).filter(
    ([, items]) => Array.isArray(items) && items.length > 0,
  );

  return (
    <section id="skills" ref={ref} className="py-24 bg-[#0A0A12]">
      <div
        className={`max-w-6xl mx-auto px-6 md:px-8 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div
          className="font-mono text-xs tracking-widest uppercase text-[#FF2E93] mb-4"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {"// skills --list"}
        </div>
        <h2
          className="text-white font-bold text-4xl md:text-5xl mb-12"
          style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
        >
          My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E93] to-[#00E5FF]">toolbox</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {categories.map(([cat, items]) => {
            const color = CAT_COLORS[cat] || "#00E5FF";
            return (
              <div
                key={cat}
                className="rounded-2xl bg-[#12121D] border border-white/5 p-7 hover:border-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="font-mono text-xs uppercase tracking-widest text-white/80" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {cat}
                  </span>
                  <span className="h-px flex-1" style={{ background: `${color}40` }} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <span
                      key={item}
                      className="font-mono text-xs px-3 py-1.5 rounded-md border transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        color,
                        borderColor: `${color}40`,
                        background: `${color}0D`,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {item}
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
