"use client";

import { useInView } from "@/app/hooks/useInView";
import { Education as EducationType } from "@/app/types";

export default function Education({ data }: { data: EducationType[] }) {
  const [ref, inView] = useInView();
  const edu = data[0];

  return (
    <section
      id="education"
      ref={ref}
      className="py-32 bg-[#0D1F16] relative overflow-hidden"
    >
      {/* Giant decorative text */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-display text-[18rem] text-[#F5F0E8]/[0.02] font-bold leading-none select-none pointer-events-none">
        EDU
      </div>

      <div className="max-w-7xl mx-auto px-10 relative">
        <div
          className={`flex items-start gap-6 mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <span className="font-display text-[#C4622D] text-sm font-bold tracking-widest mt-2">
            04
          </span>
          <div>
            <h2 className="font-display text-5xl text-[#F5F0E8] font-bold leading-none">
              Education
            </h2>
            <div className="w-12 h-1 bg-[#C4622D] mt-4" />
          </div>
        </div>

        <div
          className={`transition-all duration-700 delay-200 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="grid md:grid-cols-3 gap-px bg-[#F5F0E8]/10">
            <div className="bg-[#0D1F16] p-10 md:col-span-2">
              <p className="text-[#C4622D] text-xs tracking-[0.3em] uppercase mb-4">
                Institution
              </p>
              <h3 className="font-display text-[#F5F0E8] text-4xl font-bold mb-3">
                {edu.institution}
              </h3>
              <p className="text-[#F5F0E8]/50 text-lg mb-6">
                {edu.degree} — {edu.field}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-6 h-px bg-[#C4622D]" />
                <span className="text-[#F5F0E8]/30 text-sm">
                  {edu.duration}
                </span>
              </div>
            </div>
            <div className="bg-[#C4622D] p-10 flex flex-col justify-center items-center text-center">
              <p className="text-[#F5F0E8]/70 text-xs tracking-[0.3em] uppercase mb-4">
                CGPA
              </p>
              <p className="font-display text-8xl text-[#F5F0E8] font-bold leading-none">
                {edu.gpa}
              </p>
              <p className="text-[#F5F0E8]/60 text-sm mt-2">out of 10</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
