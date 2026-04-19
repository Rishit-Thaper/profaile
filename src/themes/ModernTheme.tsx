"use client";

import { PortfolioData } from "@/app/types";
import Education from "@/app/template/modern/components/Education";
import Experience from "@/app/template/modern/components/Experience";
import Footer from "@/app/template/modern/components/Footer";
import Hero from "@/app/template/modern/components/Hero";
import Navbar from "@/app/template/modern/components/Navbar";
import Projects from "@/app/template/modern/components/Projects";
import Skills from "@/app/template/modern/components/Skills";

export default function ModernTheme({ data }: { data: PortfolioData }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #FFFBF5; color: #1A1A2E; }
        html { scroll-behavior: smooth; }
        ::selection { background: rgba(255,107,107,0.2); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #FFFBF5; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(#FF6B6B, #5C6BC0); border-radius: 99px; }

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes blob2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 30px) scale(1.08); }
          66% { transform: translate(30px, -20px) scale(0.92); }
        }
        .animate-blob { animation: blob 10s ease-in-out infinite; }
        .animate-blob-delay-2 { animation: blob2 12s ease-in-out infinite; }
        .animate-blob-delay-4 { animation: blob 14s ease-in-out infinite 2s; }
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
