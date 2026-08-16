"use client";

import { useInView } from "@/app/hooks/useInView";
import { Skills as SkillsType } from "@/app/types";

export default function Skills({ data }: { data: SkillsType }) {
  const [ref, inView] = useInView();

  const categories = (Object.entries(data) as [string, string[]][]).filter(
    ([, items]) => Array.isArray(items) && items.length > 0,
  );

  return (
    <section id="skills" ref={ref} className="py-24 bg-[#F4EFE4]">
      <div
        className={`max-w-5xl mx-auto px-6 md:px-8 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="flex items-center gap-4 mb-3">
          <span className="text-[#A98647] text-sm" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            (03)
          </span>
          <span className="h-px flex-1 bg-[#A98647]/40" />
        </div>
        <h2
          className="text-[#26221C] text-4xl md:text-5xl mb-12"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "-0.01em" }}
        >
          Areas of <span className="italic text-[#A98647]">Expertise</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
          {categories.map(([cat, items]) => (
            <div key={cat}>
              <div className="flex items-baseline justify-between mb-4">
                <h3
                  className="text-[#26221C] text-xl uppercase tracking-widest"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {cat}
                </h3>
                <span className="text-[#A98647] text-xs">{items.length}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className="px-4 py-1.5 border border-[#26221C]/15 text-[#4A443B] text-[13px] hover:border-[#A98647] hover:text-[#A98647] transition-colors duration-200"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {item}
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
