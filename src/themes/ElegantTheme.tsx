"use client";

import { PortfolioData } from "@/app/types";
import Education from "@/app/template/elegant/components/Education";
import Experience from "@/app/template/elegant/components/Experience";
import Footer from "@/app/template/elegant/components/Footer";
import Hero from "@/app/template/elegant/components/Hero";
import Navbar from "@/app/template/elegant/components/Navbar";
import Projects from "@/app/template/elegant/components/Projects";
import Skills from "@/app/template/elegant/components/Skills";

export default function ElegantTheme({ data }: { data: PortfolioData }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');
        html { scroll-behavior: smooth; }
        body { background: #FAF7F0; color: #26221C; }
        ::selection { background: rgba(169,134,71,0.25); color: #26221C; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #FAF7F0; }
        ::-webkit-scrollbar-thumb { background: #A98647; border-radius: 99px; }
      `}</style>
      <Navbar data={data} />
      <Hero data={data.personal_info} stats={data.stats} core_stack={data.core_stack} />
      <Experience data={data.experience} />
      <Projects data={data.projects} />
      <Skills data={data.skills} />
      <Education data={data.education} />
      <Footer data={data.personal_info} />
    </>
  );
}
