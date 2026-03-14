import ArrowUpRight from "@/app/components/ArrowUpright";
import { Projects as ProjectsType } from "@/app/types";
import Section from "./Section";

export default function Projects({ data }: { data: ProjectsType[] }) {
  return (
    <Section id="projects" label="Projects">
      <div className="space-y-0">
        {data.map((p, i) => (
          <div
            key={i}
            className="group py-8 border-b border-[#E8E4DC]/6 first:border-t first:border-[#E8E4DC]/6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-serif text-2xl text-[#E8E4DC] group-hover:text-[#7FA688] transition-colors duration-300">
                    {p.name}
                  </h3>
                  <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {[
                      { key: "github", label: "src" },
                      { key: "behance", label: "behance" },
                      { key: "dribbble", label: "dribbble" },
                      { key: "figma", label: "figma" },
                      { key: "twitter", label: "twitter" },
                      { key: "medium", label: "medium" },
                      { key: "youtube", label: "youtube" },
                      { key: "live", label: "live" },
                    ]
                      .filter((link) => p[link.key as keyof ProjectsType])
                      .map((link) => (
                        <a
                          key={link.key}
                          href={p[link.key as keyof ProjectsType] as string}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-[10px] text-[#7FA688] tracking-wider uppercase flex items-center gap-0.5 hover:underline"
                        >
                          {link.label} <ArrowUpRight />
                        </a>
                      ))}
                  </div>
                </div>
                <p className="font-serif text-[#E8E4DC]/40 leading-relaxed mb-4">
                  {p.description}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {p.tech_stack.map((t, idx) => (
                    <span
                      key={t}
                      className="font-mono text-[10px] text-[#E8E4DC]/25 tracking-wider uppercase"
                    >
                      {t}
                      {idx < p.tech_stack.length - 1 && (
                        <span className="text-[#E8E4DC]/10 ml-2">·</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
              <span className="font-mono text-xs text-[#E8E4DC]/10 mt-1 flex-shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
