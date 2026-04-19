"use client";

import { PortfolioData } from "@/app/types";
import CustomCursor from "@/app/template/professional/components/CustomCursor";
import Education from "@/app/template/professional/components/Education";
import Experience from "@/app/template/professional/components/Experience";
import Footer from "@/app/template/professional/components/Footer";
import Hero from "@/app/template/professional/components/Hero";
import Navbar from "@/app/template/professional/components/Navbar";
import Projects from "@/app/template/professional/components/Projects";
import Skills from "@/app/template/professional/components/Skills";

export default function ProfessionalTheme({ data }: { data: PortfolioData }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Jost:wght@300;400;500;600&display=swap');
        * { cursor: none !important; }
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        body { font-family: 'Jost', sans-serif; }
        html { scroll-behavior: smooth; }
        ::selection { background: rgba(196,98,45,0.3); color: #F5F0E8; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #0D1F16; }
        ::-webkit-scrollbar-thumb { background: #C4622D; }
      `}</style>
      <CustomCursor />
      <Navbar data={data.personal_info} />
      <Hero data={data.personal_info} stats={data.stats} core_stack={data.core_stack} />
      <Experience data={data.experience} />
      <Projects data={data.projects} />
      <Skills data={data.skills} />
      <Education data={data.education} />
      <Footer data={data.personal_info} />
    </>
  );
}
