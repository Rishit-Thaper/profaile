"use client";

import { useInView } from "@/app/hooks/useInView";
import { Skills as SkillsType } from "@/app/types";

export default function Skills({ data }: { data: SkillsType }) {
  const [ref, inView] = useInView();
  const cats = [
    { label: "Languages", items: data.languages, icon: "</>" },
    { label: "Frameworks", items: data.frameworks, icon: "{ }" },
    { label: "Databases", items: data.databases, icon: "DB" },
    { label: "Tools", items: data.tools, icon: "⚙" },
  ];

  return (
    <section id="skills" ref={ref} className="py-32 bg-[#F5F0E8] relative">
      <div className="max-w-7xl mx-auto px-10">
        <div
          className={`flex items-start gap-6 mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <span className="font-display text-[#C4622D] text-sm font-bold tracking-widest mt-2">
            03
          </span>
          <div>
            <h2 className="font-display text-5xl text-[#0D1F16] font-bold leading-none">
              Skills
            </h2>
            <div className="w-12 h-1 bg-[#C4622D] mt-4" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cats.map((cat, i) => (
            <div
              key={cat.label}
              className={`group transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 100 + 200}ms` }}
            >
              <div className="bg-[#0D1F16] p-7 h-full hover:bg-[#122A1C] transition-colors duration-300">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-[#F5F0E8]/40 text-xs tracking-[0.3em] uppercase">
                    {cat.label}
                  </p>
                  <span className="font-display text-[#C4622D]/30 text-sm font-bold">
                    {cat.icon}
                  </span>
                </div>
                <ul className="space-y-3">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <div className="w-1 h-1 bg-[#C4622D] rounded-full flex-shrink-0" />
                      <span className="text-[#F5F0E8]/70 text-sm group-hover:text-[#F5F0E8]/90 transition-colors duration-200">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
