"use client";

import { useInView } from "@/app/hooks/useInView";
import { Skills as SkillsType } from "@/app/types";

const CAT_COLORS: Record<string, { color: string; bg: string }> = {
  languages: { color: "#FF4D6D", bg: "#FFE3E9" },
  frameworks: { color: "#8338EC", bg: "#EBE1FF" },
  databases: { color: "#06D6A0", bg: "#D9FBF0" },
  tools: { color: "#FFB703", bg: "#FFF3D6" },
};

export default function Skills({ data }: { data: SkillsType }) {
  const [ref, inView] = useInView();

  const categories = (Object.entries(data) as [string, string[]][]).filter(
    ([, items]) => Array.isArray(items) && items.length > 0,
  );

  return (
    <section id="skills" ref={ref} className="py-24 bg-[#EBE1FF] border-y-4 border-black">
      <div
        className={`max-w-6xl mx-auto px-6 md:px-8 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="font-extrabold text-black text-4xl md:text-6xl mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: "-0.02em" }}>
          Skills
        </h2>
        <p className="text-black/60 font-semibold mb-12" style={{ fontFamily: "'Inter', sans-serif" }}>
          What I bring to the table
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {categories.map(([cat, items]) => {
            const palette = CAT_COLORS[cat] || CAT_COLORS.languages;
            return (
              <div
                key={cat}
                className="bg-white rounded-2xl border-2 border-black p-7 transition-transform duration-200 hover:-translate-y-1"
                style={{ boxShadow: `6px 6px 0 0 ${palette.color}` }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-black text-xl font-extrabold capitalize" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                    {cat}
                  </h3>
                  <span
                    className="px-2.5 py-1 rounded-lg text-xs font-extrabold border-2 border-black"
                    style={{ background: palette.bg, color: palette.color, fontFamily: "'Inter', sans-serif" }}
                  >
                    {items.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1.5 rounded-lg border-2 border-black text-black text-xs font-bold hover:-translate-y-0.5 hover:rotate-1 transition-transform duration-150"
                      style={{ background: palette.bg, color: palette.color, fontFamily: "'Inter', sans-serif" }}
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
