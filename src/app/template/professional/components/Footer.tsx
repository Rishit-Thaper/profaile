import { PersonalInfo } from "@/app/types";
import {
  IconBehance,
  IconDribbble,
  IconFigma,
  IconGithub,
  IconLinkedin,
  IconMail,
  IconMedium,
  IconTwitter,
  IconYoutube,
} from "./Icons";

export default function Footer({ data }: { data: PersonalInfo }) {
  const socialLinks = [
    { key: "github", icon: <IconGithub /> },
    { key: "linkedin", icon: <IconLinkedin /> },
    { key: "behance", icon: <IconBehance /> },
    { key: "dribbble", icon: <IconDribbble /> },
    { key: "figma", icon: <IconFigma /> },
    { key: "twitter", icon: <IconTwitter /> },
    { key: "medium", icon: <IconMedium /> },
    { key: "youtube", icon: <IconYoutube /> },
  ];

  return (
    <footer className="bg-[#091510] py-12 border-t border-[#F5F0E8]/5">
      <div className="max-w-7xl mx-auto px-10 flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="font-display text-[#F5F0E8]/80 text-xl font-bold">
            {data.name}
          </p>
          <p className="text-[#F5F0E8]/25 text-xs tracking-[0.2em] uppercase mt-1">
            {data.title}
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          {socialLinks.map((social) => {
            const href = data[social.key as keyof PersonalInfo];
            if (!href || typeof href !== "string") return null;

            return (
              <a
                key={social.key}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 border border-[#F5F0E8]/10 flex items-center justify-center text-[#F5F0E8]/30 hover:text-[#C4622D] hover:border-[#C4622D]/40 transition-all duration-200"
                title={social.key}
              >
                {social.icon}
              </a>
            );
          })}
          <a
            href={`mailto:${data.email}`}
            className="w-10 h-10 border border-[#F5F0E8]/10 flex items-center justify-center text-[#F5F0E8]/30 hover:text-[#C4622D] hover:border-[#C4622D]/40 transition-all duration-200"
            title="Email"
          >
            <IconMail />
          </a>
        </div>
        <p className="text-[#F5F0E8]/15 text-xs tracking-wider">
          Built with profAIle ✦
        </p>
      </div>
    </footer>
  );
}
