"use client";

import { useInView } from "@/app/hooks/useInView";
import { Education as EducationType } from "@/app/types";
import SectionHeader from "./SectionHeader";

export default function Education({ data }: { data: EducationType[] }) {
  const [ref, inView] = useInView();
  const edu = data[0];
  return (
    <section id="education" ref={ref} className="py-24 bg-[#EDFCFA]">
      <div
        className={`max-w-6xl mx-auto px-8 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <SectionHeader
          label="Education"
          title="Where I studied"
          accent="#26C6B0"
        />

        <div className="rounded-3xl bg-white border border-black/5 shadow-sm p-8 md:p-10 flex flex-wrap items-center gap-10">
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
            style={{
              background: "#26C6B0",
              boxShadow: "0 8px 24px rgba(38,198,176,0.35)",
            }}
          >
            🎓
          </div>
          <div className="flex-1">
            <h3 className="font-display text-3xl text-[#1A1A2E] font-bold mb-1">
              {edu.institution}
            </h3>
            <p className="text-[#26C6B0] font-semibold mb-2">
              {edu.degree} · {edu.field}
            </p>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#EDFCFA] text-[#26C6B0]">
              {edu.duration}
            </span>
          </div>
          {edu.gpa && <div className="flex flex-col items-center gap-1">
            <span
              className="font-display text-6xl font-bold"
              style={{ color: "#26C6B0" }}
            >
              {edu.gpa}
            </span>
          </div>}
        </div>
      </div>
    </section>
  );
}
