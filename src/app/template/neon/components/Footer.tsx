import { PersonalInfo } from "@/app/types";
import {
  IconBehance,
  IconDribbble,
  IconFigma,
  IconGithub,
  IconLinkedin,
  IconMedium,
  IconTwitter,
  IconYoutube,
} from "../../_shared/icons";

const SOCIALS = [
  { key: "github", icon: <IconGithub size={15} /> },
  { key: "linkedin", icon: <IconLinkedin size={15} /> },
  { key: "twitter", icon: <IconTwitter size={15} /> },
  { key: "behance", icon: <IconBehance size={15} /> },
  { key: "dribbble", icon: <IconDribbble size={15} /> },
  { key: "figma", icon: <IconFigma size={15} /> },
  { key: "medium", icon: <IconMedium size={15} /> },
  { key: "youtube", icon: <IconYoutube size={15} /> },
];

export default function Footer({ data }: { data: PersonalInfo }) {
  return (
    <footer className="bg-[#0A0A12] border-t border-white/5">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#7C5CFC] to-transparent" />
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-sm text-[#00E5FF]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            ~/
          </span>
          <span className="text-white font-semibold">{data.name}</span>
        </div>

        <div className="flex items-center gap-3">
          {SOCIALS.map((social) => {
            const href = data[social.key as keyof PersonalInfo];
            if (!href || typeof href !== "string") return null;
            return (
              <a
                key={social.key}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/40 hover:text-[#00E5FF] hover:border-[#00E5FF]/50 transition-all duration-300"
                title={social.key}
              >
                {social.icon}
              </a>
            );
          })}
        </div>

        <span
          className="font-mono text-xs text-white/25 uppercase tracking-widest"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {"// built with profaile"}
        </span>
      </div>
    </footer>
  );
}
