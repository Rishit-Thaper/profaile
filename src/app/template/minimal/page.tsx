"use client";

import { data } from "@/libs/constants";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Projects from "./components/Project";
import Skills from "./components/Skills";

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function MinimalDarkPortfolio() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@300;400;500&display=swap');
        .font-serif { font-family: 'Instrument Serif', Georgia, serif; }
        .font-mono  { font-family: 'Geist Mono', 'Courier New', monospace; }
        html { scroll-behavior: smooth; }
        body { background: #0E0E0E; color: #E8E4DC; }
        * { box-sizing: border-box; }
        ::selection { background: rgba(127,166,136,0.2); color: #E8E4DC; }
        ::-webkit-scrollbar { width: 2px; }
        ::-webkit-scrollbar-track { background: #0E0E0E; }
        ::-webkit-scrollbar-thumb { background: #7FA688; }
      `}</style>
      <Navbar data={data} />
      <Hero data={data.personal_info} />
      <Experience data={data.experience} />
      <Education data={data.education} />
      <Projects data={data.projects} />
      <Skills data={data.skills} />
      <Footer data={data.personal_info} />
    </>
  );
}
