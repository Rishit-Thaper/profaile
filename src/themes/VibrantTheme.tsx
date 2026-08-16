"use client";

import { PortfolioData } from "@/app/types";
import Education from "@/app/template/vibrant/components/Education";
import Experience from "@/app/template/vibrant/components/Experience";
import Footer from "@/app/template/vibrant/components/Footer";
import Hero from "@/app/template/vibrant/components/Hero";
import Navbar from "@/app/template/vibrant/components/Navbar";
import Projects from "@/app/template/vibrant/components/Projects";
import Skills from "@/app/template/vibrant/components/Skills";

export default function VibrantTheme({ data }: { data: PortfolioData }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Inter:wght@400;500;600;700;800&display=swap');
        html { scroll-behavior: smooth; }
        body { background: #FFFFFF; color: #111111; }
        ::selection { background: rgba(255,77,109,0.3); color: #111111; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #FFFFFF; }
        ::-webkit-scrollbar-thumb { background: #111111; border-radius: 99px; }
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
