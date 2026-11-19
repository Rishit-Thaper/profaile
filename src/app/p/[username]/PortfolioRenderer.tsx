"use client";

import { PortfolioData } from "@/app/types";
import { normalizePortfolioExternalUrls } from "@/features/portfolio/utils/external-links";
import THEMES from "@/themes";
import PortfolioChat from "./PortfolioChat";

const CHAT_ACCENTS: Record<string, string> = {
  minimal: "#7FA688",
  modern: "#FF6B6B",
  professional: "#C4622D",
  neon: "#6366f1",
  elegant: "#B08D57",
  vibrant: "#FF4D6D",
  terminal: "#00FF9C",
};

export default function PortfolioRenderer({
  data,
  theme,
  username,
}: {
  data: PortfolioData;
  theme: string;
  username: string;
}) {
  const ThemeComponent = THEMES[theme] || THEMES["minimal"];
  const normalizedData = normalizePortfolioExternalUrls(data);

  return (
    <>
      <ThemeComponent data={normalizedData} />
      <PortfolioChat
        name={data.personal_info?.name || username}
        username={username}
        accent={CHAT_ACCENTS[theme] || "#6366f1"}
      />
    </>
  );
}
