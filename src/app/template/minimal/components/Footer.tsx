import { PersonalInfo } from "@/app/types";

export default function Footer({ data }: { data: PersonalInfo }) {
  return (
    <footer className="bg-[#0E0E0E] border-t border-[#E8E4DC]/6 py-12">
      <div className="max-w-3xl mx-auto px-8 flex flex-wrap items-center justify-between gap-4">
        <span className="font-serif italic text-[#E8E4DC]/20 text-sm">
          {data.name}
        </span>
        <div className="flex gap-6">
          {[
            { key: "github", label: "Github" },
            { key: "linkedin", label: "Linkedin" },
            { key: "behance", label: "Behance" },
            { key: "dribbble", label: "Dribbble" },
            { key: "figma", label: "Figma" },
            { key: "twitter", label: "Twitter" },
            { key: "medium", label: "Medium" },
            { key: "youtube", label: "Youtube" },
          ]
            .filter((social) => data[social.key as keyof PersonalInfo])
            .map((social) => (
              <a
                key={social.key}
                href={data[social.key as keyof PersonalInfo] as string}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[10px] text-[#E8E4DC]/20 hover:text-[#7FA688] tracking-widest uppercase transition-colors"
              >
                {social.label}
              </a>
            ))}
        </div>
        <span className="font-mono text-[10px] text-[#E8E4DC]/10 tracking-[0.2em] uppercase">
          Built with profAIle
        </span>
      </div>
    </footer>
  );
}
