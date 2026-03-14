"use client";

import { useInView } from "@/app/hooks/useInView";
import { Experience as ExperienceType } from "@/app/types";

export default function Experience({ data }: { data: ExperienceType[] }) {
  const [ref, inView] = useInView();

  return (
    <section
      id="experience"
      ref={ref}
      className="py-32 bg-[#F5F0E8] relative overflow-hidden"
    >
      {/* Big decorative label */}
      <div
        className="absolute -left-8 top-1/2 -translate-y-1/2 font-display text-[14rem] text-[#0D1F16]/[0.04] leading-none select-none pointer-events-none font-bold"
        style={{ writingMode: "vertical-rl" }}
      >
        WORK
      </div>

      <div className="max-w-7xl mx-auto px-10">
        <div
          className={`flex items-start gap-6 mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <span className="font-display text-[#C4622D] text-sm font-bold tracking-widest mt-2">
            01
          </span>
          <div>
            <h2 className="font-display text-5xl text-[#0D1F16] font-bold leading-none">
              Experience
            </h2>
            <div className="w-12 h-1 bg-[#C4622D] mt-4" />
          </div>
        </div>

        <div className="space-y-12">
          {data.map((exp, i) => (
            <div
              key={i}
              className={`transition-all duration-700 delay-200 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              {/* Company banner */}
              <div className="bg-[#0D1F16] px-10 py-6 flex flex-wrap items-center justify-between gap-4 mb-0">
                <div>
                  <h3 className="font-display text-[#F5F0E8] text-3xl font-bold mb-1">
                    {exp.role}
                  </h3>
                  <p className="text-[#C4622D] text-sm tracking-wide">
                    {exp.company}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[#F5F0E8]/70 text-sm">{exp.duration}</p>
                  <p className="text-[#F5F0E8]/30 text-xs mt-1">
                    {exp.location}
                  </p>
                </div>
              </div>
              {/* Achievements */}
              <div className="border-l-4 border-[#C4622D] ml-5 pl-8 pr-6 py-8 bg-white shadow-sm">
                <div className="grid md:grid-cols-2 gap-6">
                  {exp.description.map((point, j) => (
                    <div key={j} className="flex gap-4 group">
                      <div className="mt-2 w-5 h-5 bg-[#C4622D]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C4622D]/20 transition-colors">
                        <div className="w-1.5 h-1.5 bg-[#C4622D] rounded-full" />
                      </div>
                      <p className="text-[#0D1F16]/70 text-sm leading-relaxed">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
