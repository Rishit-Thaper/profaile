import ArrowUpRight from "@/app/components/ArrowUpright";
import Portrait from "../../_shared/Portrait";
import { PersonalInfo, Stat } from "@/app/types";
import { useEffect, useState } from "react";

export default function Hero({ data, stats, core_stack }: { data: PersonalInfo; stats?: Stat[]; core_stack?: string[] }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setTimeout(() => setLoaded(true), 80);
  }, []);

  return (
    <section id="hero" className="min-h-screen bg-[#0E0E0E] flex items-center">
      <div className="max-w-3xl mx-auto px-8 pt-32 pb-24 w-full">
        {/* Top rule + label */}
        <div
          className={`flex items-center gap-4 mb-20 transition-all duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
        >
          <div className="flex-1 h-px bg-[#E8E4DC]/8" />
          <span className="font-mono text-xs text-[#E8E4DC]/20 tracking-[0.2em] uppercase">
            Portfolio
          </span>
        </div>

        {/* Portrait */}
        <div
          className={`transition-all duration-700 delay-[50ms] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <Portrait
            data={data}
            className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover grayscale contrast-[0.9] border border-[#E8E4DC]/15"
          />
        </div>

        {/* Name */}
        <div
          className={`transition-all duration-700 delay-100 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <h1
            className="font-serif text-[5rem] md:text-[7rem] leading-[0.9] text-[#E8E4DC] mb-8"
            style={{ letterSpacing: "-0.02em" }}
          >
            {data.name}
          </h1>
        </div>

        {/* Role + location row */}
        <div
          className={`flex flex-wrap items-baseline justify-between gap-4 mb-16 transition-all duration-700 delay-200 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <p className="font-serif italic text-[#E8E4DC]/40 text-2xl">
            {data.title}
          </p>
          <p className="font-mono text-xs text-[#E8E4DC]/20 tracking-wider">
            {data.location}
          </p>
        </div>

        {/* Divider */}
        <div
          className={`h-px bg-[#E8E4DC]/8 mb-10 transition-all duration-700 delay-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        />

        {/* Contact row */}
        <div
          className={`flex flex-wrap gap-8 transition-all duration-700 delay-[400ms] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          {[
            {
              label: "Email",
              href: `mailto:${data.email}`,
              text: data.email,
            },
            {
              label: "GitHub",
              href: data.github,
              text: data.github?.replace("https://", ""),
            },
            {
              label: "LinkedIn",
              href: data.linkedin,
              text:
                "linkedin.com/in/" +
                data.linkedin?.split("/in/")[1]?.replace("/", ""),
            },
            {
              label: "Behance",
              href: data.behance,
              text: data.behance?.replace("https://", ""),
            },
            {
              label: "Dribbble",
              href: data.dribbble,
              text: data.dribbble?.replace("https://", ""),
            },
            {
              label: "Figma",
              href: data.figma,
              text: data.figma?.replace("https://", ""),
            },
            {
              label: "Twitter",
              href: data.twitter,
              text: data.twitter?.replace("https://", ""),
            },
            {
              label: "Medium",
              href: data.medium,
              text: data.medium?.replace("https://", ""),
            },
            {
              label: "YouTube",
              href: data.youtube,
              text: data.youtube?.replace("https://", ""),
            },
            {
              label: "LeetCode",
              href: data.leetcode,
              text: "leetcode.com/" + data.leetcode?.split("leetcode.com/")[1],
            },
            {
              label: "CodeChef",
              href: data.codechef,
              text: "codechef.com/users/" + data.codechef?.split("/users/")[1],
            },
            {
              label: "CodeForces",
              href: data.codeforces,
              text:
                "codeforces.com/profile/" +
                data.codeforces?.split("/profile/")[1],
            },
          ]
            .filter((link) => link.href)
            .map((link) => (
              <div key={link.label}>
                <p className="font-mono text-[10px] text-[#E8E4DC]/15 tracking-[0.2em] uppercase mb-1">
                  {link.label}
                </p>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs text-[#E8E4DC]/40 hover:text-[#7FA688] transition-colors duration-200 flex items-center gap-1 group"
                >
                  {link.text}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight />
                  </span>
                </a>
              </div>
            ))}
        </div>

        {/* Bottom rule */}
        <div
          className={`h-px bg-[#E8E4DC]/8 mt-10 transition-all duration-700 delay-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      </div>
    </section>
  );
}
