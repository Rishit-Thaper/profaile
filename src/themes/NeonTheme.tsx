"use client";

import { PortfolioData } from "@/app/types";
import Education from "@/app/template/neon/components/Education";
import Experience from "@/app/template/neon/components/Experience";
import Footer from "@/app/template/neon/components/Footer";
import Hero from "@/app/template/neon/components/Hero";
import Navbar from "@/app/template/neon/components/Navbar";
import Projects from "@/app/template/neon/components/Projects";
import Skills from "@/app/template/neon/components/Skills";

export default function NeonTheme({ data }: { data: PortfolioData }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        html { scroll-behavior: smooth; }
        body { background: #0A0A12; color: #EAF6FF; }
        ::selection { background: rgba(124,92,252,0.35); color: #fff; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0A0A12; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(#00E5FF, #FF2E93); border-radius: 99px; }
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
