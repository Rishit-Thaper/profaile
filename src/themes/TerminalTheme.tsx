"use client";

import { PortfolioData } from "@/app/types";
import Education from "@/app/template/terminal/components/Education";
import Experience from "@/app/template/terminal/components/Experience";
import Footer from "@/app/template/terminal/components/Footer";
import Hero from "@/app/template/terminal/components/Hero";
import Navbar from "@/app/template/terminal/components/Navbar";
import Projects from "@/app/template/terminal/components/Projects";
import Skills from "@/app/template/terminal/components/Skills";

export default function TerminalTheme({ data }: { data: PortfolioData }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');
        html { scroll-behavior: smooth; }
        body { background: #0D0D0D; color: #D4FFEA; font-family: 'JetBrains Mono', 'Courier New', monospace; }
        * { box-sizing: border-box; }
        ::selection { background: rgba(0,255,156,0.3); color: #0D0D0D; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0D0D0D; }
        ::-webkit-scrollbar-thumb { background: #00FF9C; border-radius: 99px; }
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
