"use client";

import { PersonalInfo } from "@/app/types";
import { useEffect, useState } from "react";
import { IconMail } from "./Icons";

export default function Navbar({ data }: { data: PersonalInfo }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
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
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${scrolled ? "py-3 bg-[#0D1F16]/90 backdrop-blur-xl" : "py-6"}`}
    >
      <div className="max-w-7xl mx-auto px-10 flex justify-between items-center">
        <a href="#hero" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-[#C4622D] flex items-center justify-center">
            <span className="font-display text-[#F5F0E8] text-sm font-bold">
              {data.name.split(" ")[0][0]}
            </span>
          </div>
          <span className="font-display text-[#F5F0E8] text-sm tracking-[0.25em] uppercase opacity-70 group-hover:opacity-100 transition-opacity">
            {data.name}
          </span>
        </a>
        <div className="hidden md:flex items-center gap-10">
          {["Experience", "Projects", "Skills", "Education"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className={`text-xs tracking-[0.2em] uppercase transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-px after:bg-[#C4622D] after:transition-all after:duration-300 ${active === item.toLowerCase() ? "text-[#C4622D] after:w-full" : "text-[#F5F0E8]/50 hover:text-[#F5F0E8] after:w-0 hover:after:w-full"}`}
            >
              {item}
            </a>
          ))}
        </div>
        <a
          href={`mailto:${data.email}`}
          className="hidden md:flex items-center gap-2 px-5 py-2.5 border border-[#C4622D]/40 text-[#C4622D] text-xs tracking-[0.15em] uppercase hover:bg-[#C4622D] hover:text-[#F5F0E8] transition-all duration-300"
        >
          <IconMail /> Hire Me
        </a>
      </div>
    </nav>
  );
}
