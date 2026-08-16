import { PersonalInfo } from "@/app/types";

export default function Portrait({
  data,
  className,
}: {
  data: PersonalInfo;
  className?: string;
}) {
  if (!data.photo || data.photo_visible === false) return null;

  return (
    <img
      src={data.photo}
      alt={data.name || "Portrait"}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
}
