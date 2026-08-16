"use client";

import { PortfolioData } from "@/app/types";
import { useEffect, useState } from "react";

const NAV = ["experience", "projects", "skills", "education"];

export default function Navbar({ data }: { data: PortfolioData }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    document.querySelectorAll("section[id]").forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0D0D0D]/90 backdrop-blur-md border-b border-[#00FF9C]/20" : "bg-transparent"
      }`}
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2 text-[#00FF9C] text-sm">
          <span className="text-[#3D6B54]">guest@profaile</span>
          <span>:</span>
          <span className="text-[#00B3FF]">~</span>
          <span className="text-[#3D6B54]">$</span>
          <span className="text-[#D4FFEA]">{data.personal_info.name.toLowerCase().replace(/\s+/g, "-")}</span>
          <span className="w-2 h-4 bg-[#00FF9C] animate-pulse" />
        </a>

        <div className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className={`px-3 py-1.5 text-xs transition-colors duration-150 ${
                active === item
                  ? "text-black bg-[#00FF9C]"
                  : "text-[#3D6B54] hover:text-[#00FF9C]"
              }`}
            >
              ./{item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
