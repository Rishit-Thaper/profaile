"use client";

import { useInView } from "@/app/hooks/useInView";
import { Skills as SkillsType } from "@/app/types";
import { SKILL_COLORS } from "./constants";
import SectionHeader from "./SectionHeader";

export default function Skills({ data }: { data: SkillsType }) {
  const [ref, inView] = useInView();
  return (
    <section id="skills" ref={ref} className="py-24 bg-[#FFFBF5]">
      <div
        className={`max-w-6xl mx-auto px-8 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <SectionHeader
          label="Skills"
          title="What I work with"
          accent="#FFB347"
        />

        <div className="grid md:grid-cols-2 gap-6">
          {(Object.entries(data) as [keyof SkillsType, string[]][])
            .filter(([_, items]) => items && items.length > 0)
            .map(([cat, items], catIdx) => {
              const { color, bg } = SKILL_COLORS[catIdx % SKILL_COLORS.length];
              return (
                <div
                  key={cat}
                  className="rounded-3xl bg-white border border-black/5 p-7 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: bg }}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ background: color }}
                      />
                    </div>
                    <h3 className="font-display text-lg font-bold text-[#1A1A2E]">
                      {cat}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item, j) => (
                      <span
                        key={item}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105 cursor-default"
                        style={{
                          background: j % 2 === 0 ? bg : "transparent",
                          color: color,
                          border: `1.5px solid ${color}30`,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}
