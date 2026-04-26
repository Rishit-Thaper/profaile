"use client";

import { PortfolioData } from "@/app/types";
import { useEffect, useState } from "react";

export default function Navbar({ data }: { data: PortfolioData }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    document
      .querySelectorAll("section[id]")
      .forEach((el) => observer.observe(el));
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#0E0E0E]/95 backdrop-blur-sm" : "bg-transparent"}`}
    >
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-4 md:py-6 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
        <a
          href="#hero"
          className="font-mono text-xs text-[#E8E4DC] tracking-[0.15em] uppercase opacity-30 hover:opacity-100 transition-opacity text-center truncate w-full md:w-auto"
        >
          {data.personal_info.name}
        </a>
        <div className="flex items-center justify-center flex-wrap gap-4 md:gap-8 w-full md:w-auto">
          {["experience", "projects", "skills", "education"].map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className={`font-mono text-[10px] sm:text-xs tracking-[0.1em] uppercase transition-all duration-200 whitespace-nowrap ${active === item ? "text-[#7FA688]" : "text-[#E8E4DC]/25 hover:text-[#E8E4DC]/60"}`}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
