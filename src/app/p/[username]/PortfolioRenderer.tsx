"use client";

import { PortfolioData } from "@/app/types";
import THEMES from "@/themes";

export default function PortfolioRenderer({
  data,
  theme,
}: {
  data: PortfolioData;
  theme: string;
}) {
  const ThemeComponent = THEMES[theme] || THEMES["minimal"];

  return <ThemeComponent data={data} />;
}
