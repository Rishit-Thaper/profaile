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
        scrolled
          ? "bg-[#0A0A12]/85 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2.5 group">
          <span
            className="font-mono text-sm text-[#00E5FF]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            ~/
          </span>
          <span className="text-white font-semibold tracking-tight">
            {data.personal_info.name}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#FF2E93] group-hover:animate-pulse" />
        </a>

        <div className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className={`px-4 py-2 rounded-lg font-mono text-xs tracking-wide uppercase transition-all duration-200 ${
                active === item
                  ? "text-[#00E5FF] bg-white/5 border border-[#00E5FF]/30"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
