export default function SectionHeader({
  label,
  title,
  accent,
}: {
  label: string;
  title: string;
  accent: string;
}) {
  return (
    <div className="mb-12">
      <span
        className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 text-white"
        style={{ background: accent }}
      >
        {label}
      </span>
      <h2
        className="font-display text-4xl md:text-5xl text-[#1A1A2E] font-bold"
        style={{ letterSpacing: "-0.02em" }}
      >
        {title}
      </h2>
    </div>
  );
}
