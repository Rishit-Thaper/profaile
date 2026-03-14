import { useInView } from "@/app/hooks/useInView";

export default function Section({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  const [ref, inView] = useInView();
  return (
    <section id={id} ref={ref} className="py-24 bg-[#0E0E0E]">
      <div
        className={`max-w-3xl mx-auto px-8 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <div className="flex items-center gap-4 mb-16">
          <span className="font-mono text-[10px] text-[#7FA688] tracking-[0.3em] uppercase">
            {label}
          </span>
          <div className="flex-1 h-px bg-[#E8E4DC]/6" />
        </div>
        {children}
      </div>
    </section>
  );
}
