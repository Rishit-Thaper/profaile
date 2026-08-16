import { PersonalInfo } from "@/app/types";

export default function Footer({ data }: { data: PersonalInfo }) {
  const links: { label: string; href?: string }[] = [
    { label: "github", href: data.github },
    { label: "linkedin", href: data.linkedin },
    { label: "x", href: data.twitter },
    { label: "email", href: data.email ? `mailto:${data.email}` : undefined },
  ].filter((l) => l.href);

  return (
    <footer className="bg-[#0D0D0D] border-t border-[#00FF9C]/20">
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        <div className="text-sm">
          <span className="text-[#3D6B54]">guest@profaile</span>
          <span className="text-[#3D6B54]">:</span>
          <span className="text-[#00B3FF]">~</span>
          <span className="text-[#3D6B54]">$</span>{" "}
          <span className="text-[#00FF9C]">echo "{data.name} · built with profaile"</span>
          <span className="text-[#3D6B54]">;</span>
        </div>

        <div className="flex items-center gap-4">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#3D6B54] hover:text-[#00FF9C] transition-colors duration-150"
            >
              [{link.label}]
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
