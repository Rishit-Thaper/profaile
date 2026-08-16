"use client";

import { useInView } from "@/app/hooks/useInView";
import { Skills as SkillsType } from "@/app/types";

export default function Skills({ data }: { data: SkillsType }) {
  const [ref, inView] = useInView();

  const categories = (Object.entries(data) as [string, string[]][]).filter(
    ([, items]) => Array.isArray(items) && items.length > 0,
  );

  return (
    <section id="skills" ref={ref} className="py-24 bg-[#0D0D0D]">
      <div
        className={`max-w-6xl mx-auto px-6 md:px-8 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        <div className="text-[#3D6B54] text-sm mb-3">
          <span className="text-[#00B3FF]">$</span> skills --list
        </div>
        <h2 className="text-[#00FF9C] text-3xl md:text-4xl mb-12">
          # Skills
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {categories.map(([cat, items]) => (
            <div key={cat} className="bg-[#111111] border border-[#00FF9C]/25 rounded-lg p-6 hover:border-[#00FF9C]/60 transition-colors duration-200">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[#00B3FF] text-sm uppercase tracking-wider">
                  {cat}/
                </span>
                <span className="text-[#3D6B54] text-xs">
                  {items.length} installed
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span key={item} className="text-xs text-[#00FF9C] border border-[#00FF9C]/30 rounded px-2.5 py-1">
                    [{item}]
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
