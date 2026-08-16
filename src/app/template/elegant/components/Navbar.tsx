"use client";

import { PortfolioData } from "@/app/types";
import { useEffect, useState } from "react";

const NAV = ["experience", "projects", "skills", "education"];

export default function Navbar({ data }: { data: PortfolioData }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#FAF7F0]/90 backdrop-blur-md border-b border-[#26221C]/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-8 py-5 flex items-center justify-between">
        <a href="#hero" className="flex items-baseline gap-2 group">
          <span
            className="text-[#26221C] font-semibold tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.4rem" }}
          >
            {data.personal_info.name}
          </span>
          <span className="text-[#A98647] group-hover:rotate-90 transition-transform duration-300 text-lg leading-none">✦</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {NAV.map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className="relative text-[#6B655A] hover:text-[#26221C] text-[13px] tracking-wide uppercase transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-[#A98647] hover:after:w-full after:transition-all after:duration-300"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
