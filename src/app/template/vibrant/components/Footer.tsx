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
  { key: "github", icon: <IconGithub size={16} /> },
  { key: "linkedin", icon: <IconLinkedin size={16} /> },
  { key: "twitter", icon: <IconTwitter size={16} /> },
  { key: "behance", icon: <IconBehance size={16} /> },
  { key: "dribbble", icon: <IconDribbble size={16} /> },
  { key: "figma", icon: <IconFigma size={16} /> },
  { key: "medium", icon: <IconMedium size={16} /> },
  { key: "youtube", icon: <IconYoutube size={16} /> },
];

export default function Footer({ data }: { data: PersonalInfo }) {
  return (
    <footer className="bg-black border-t-4 border-black">
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <span
            className="w-9 h-9 rounded-xl text-white font-extrabold flex items-center justify-center -rotate-6 border-2 border-white"
            style={{ background: "linear-gradient(135deg, #FF4D6D, #8338EC)", fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            {data.name.charAt(0)}
          </span>
          <span className="text-white font-extrabold" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            {data.name}
          </span>
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
                className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black border-2 border-white hover:-translate-y-1 hover:rotate-6 transition-transform duration-200"
                title={social.key}
              >
                {social.icon}
              </a>
            );
          })}
        </div>

        <span className="text-white/50 text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>
          ⚡ Built with Profaile
        </span>
      </div>
    </footer>
  );
}
