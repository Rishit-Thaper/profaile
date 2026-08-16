import { PersonalInfo } from "@/app/types";

export default function Footer({ data }: { data: PersonalInfo }) {
  const links: { label: string; href?: string }[] = [
    { label: "GitHub", href: data.github },
    { label: "LinkedIn", href: data.linkedin },
    { label: "Email", href: data.email ? `mailto:${data.email}` : undefined },
    { label: "X", href: data.twitter },
  ].filter((l) => l.href);

  return (
    <footer className="bg-[#26221C]">
      <div className="max-w-5xl mx-auto px-6 md:px-8 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <p
            className="text-[#FAF7F0] text-2xl"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {data.name}
          </p>
          <p className="text-[#FAF7F0]/50 text-xs tracking-[0.2em] uppercase mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
            {data.title}
          </p>
        </div>

        <div className="flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="text-[#FAF7F0]/60 hover:text-[#A98647] text-sm transition-colors duration-200 underline-offset-4 hover:underline decoration-[#A98647]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <span
          className="text-[#FAF7F0]/30 text-xs tracking-[0.2em] uppercase"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          ✦ Built with Profaile
        </span>
      </div>
    </footer>
  );
}
