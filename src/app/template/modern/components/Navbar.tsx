"use client";

import { PortfolioData } from "@/app/types";
import { useEffect, useState } from "react";
import { ACCENTS } from "./constants";

export default function Navbar({ data }: { data: PortfolioData }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("hero");
  const [colorIdx, setColorIdx] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(e.target.id);
            const idx = [
              "hero",
              "experience",
              "projects",
              "skills",
              "education",
            ].indexOf(e.target.id);
            if (idx >= 0) setColorIdx(idx % ACCENTS.length);
          }
        }),
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

  const navItems = ["experience", "projects", "skills", "education"];

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#FFFBF5]/90 backdrop-blur-xl shadow-sm shadow-black/5" : "bg-transparent"}`}
    >
      <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
        <a href="#hero" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold transition-all duration-500"
            style={{ background: ACCENTS[colorIdx] }}
          >
            {data.personal_info.name.charAt(0)}
          </div>
          <span className="font-display text-[#1A1A2E] text-sm font-semibold">
            {data.personal_info.name}
          </span>
        </a>
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item, i) => (
            <a
              key={item}
              href={`#${item}`}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide capitalize transition-all duration-300 ${
                active === item
                  ? "text-white shadow-sm"
                  : "text-[#1A1A2E]/50 hover:text-[#1A1A2E] hover:bg-black/5"
              }`}
              style={
                active === item
                  ? { background: ACCENTS[i % ACCENTS.length] }
                  : {}
              }
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
