"use client";

import { useInView } from "@/app/hooks/useInView";
import { Experience as ExperienceType } from "@/app/types";
import { ACCENTS } from "./constants";
import SectionHeader from "./SectionHeader";

export default function Experience({ data }: { data: ExperienceType[] }) {
  const [ref, inView] = useInView();
  return (
    <section id="experience" ref={ref} className="py-24 bg-[#FFFBF5]">
      <div
        className={`max-w-6xl mx-auto px-8 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <SectionHeader
          label="Experience"
          title="Where I've worked"
          accent="#FF6B6B"
        />

        <div className="space-y-6">
          {data.map((exp, i) => (
            <div
              key={i}
              className="rounded-3xl bg-white border border-black/5 shadow-sm p-8 md:p-10"
            >
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ background: "#FF6B6B" }}
                  >
                    {exp.company[0]}
                  </div>
                  <div>
                    <h3 className="font-display text-2xl text-[#1A1A2E] font-bold">
                      {exp.role}
                    </h3>
                    <p className="text-[#FF6B6B] font-semibold text-sm mt-0.5">
                      {exp.company}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-4 py-2 rounded-full text-xs font-semibold bg-[#FFF0F0] text-[#FF6B6B]">
                    {exp.duration}
                  </span>
                  <span className="px-4 py-2 rounded-full text-xs font-semibold bg-black/5 text-[#1A1A2E]/50">
                    {exp.location}
                  </span>
                </div>
              </div>

              {/* Achievements grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {exp.description.map((point, j) => (
                  <div
                    key={j}
                    className="flex gap-3 p-4 rounded-2xl bg-[#FFFBF5] border border-black/4 hover:border-[#FF6B6B]/20 transition-colors duration-200"
                  >
                    <div
                      className="w-6 h-6 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: ACCENTS[j % ACCENTS.length] + "20" }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: ACCENTS[j % ACCENTS.length] }}
                      />
                    </div>
                    <p className="text-[#1A1A2E]/65 text-sm leading-relaxed">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
