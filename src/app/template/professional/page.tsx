"use client";

import { data } from "@/libs/constants";
import CustomCursor from "./components/CustomCursor";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Skills from "./components/Skills";

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function ProfessionalPortfolio() {
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
      <Hero data={data.personal_info} />
      <Experience data={data.experience} />
      <Education data={data.education} />
      <Projects data={data.projects} />
      <Skills data={data.skills} />
      <Footer data={data.personal_info} />
    </>
  );
}
