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
} from "./Icons";

export default function Footer({ data }: { data: PersonalInfo }) {
  const socialLinks = [
    { key: "github", icon: <IconGithub size={16} /> },
    { key: "linkedin", icon: <IconLinkedin size={16} /> },
    { key: "behance", icon: <IconBehance size={16} /> },
    { key: "dribbble", icon: <IconDribbble size={16} /> },
    { key: "figma", icon: <IconFigma size={16} /> },
    { key: "twitter", icon: <IconTwitter size={16} /> },
    { key: "medium", icon: <IconMedium size={16} /> },
    { key: "youtube", icon: <IconYoutube size={16} /> },
  ];

  return (
    <footer className="bg-[#1A1A2E] py-14">
      <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B6B] to-[#5C6BC0] flex items-center justify-center text-white text-sm font-bold">
            {data.name.charAt(0)}
          </div>
          <span className="font-display text-white font-semibold">
            {data.name}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {socialLinks.map((social) => {
            const href = data[social.key as keyof PersonalInfo];
            if (!href || typeof href !== "string") return null;

            return (
              <a
                key={social.key}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all duration-300"
                title={social.key}
              >
                {social.icon}
              </a>
            );
          })}
        </div>

        <span className="text-white/20 text-xs font-medium tracking-wider uppercase">
          Built with profAIle ✦
        </span>
      </div>
    </footer>
  );
}
