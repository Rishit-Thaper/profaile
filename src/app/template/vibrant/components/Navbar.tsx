"use client";

import { PortfolioData } from "@/app/types";
import { useEffect, useState } from "react";

const NAV = ["experience", "projects", "skills", "education"];
const NAV_COLORS = ["#06D6A0", "#FFB703", "#FF4D6D", "#8338EC"];

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
        scrolled ? "bg-white/90 backdrop-blur-md border-b-2 border-black" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2">
          <span
            className="w-9 h-9 rounded-xl text-white font-extrabold flex items-center justify-center -rotate-6 border-2 border-black"
            style={{ background: "linear-gradient(135deg, #FF4D6D, #8338EC)", fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            {data.personal_info.name.charAt(0)}
          </span>
          <span className="font-extrabold text-black text-lg tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            {data.personal_info.name}
          </span>
        </a>

        <div className="hidden md:flex items-center gap-2">
          {NAV.map((item, i) => (
            <a
              key={item}
              href={`#${item}`}
              className={`px-4 py-2 rounded-xl text-sm font-bold border-2 border-black transition-all duration-200 hover:-translate-y-0.5 ${
                active === item ? "text-black" : "text-black/60 hover:text-black"
              }`}
              style={{
                background: active === item ? NAV_COLORS[i % NAV_COLORS.length] : "transparent",
                boxShadow: active === item ? "4px 4px 0 0 #000" : "none",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
