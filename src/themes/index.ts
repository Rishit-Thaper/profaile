import { PortfolioData } from "@/app/types";
import { ComponentType } from "react";
import MinimalTheme from "./MinimalTheme";
import ModernTheme from "./ModernTheme";
import ProfessionalTheme from "./ProfessionalTheme";

export type ThemeComponent = ComponentType<{ data: PortfolioData }>;

const THEMES: Record<string, ThemeComponent> = {
  minimal: MinimalTheme,
  modern: ModernTheme,
  professional: ProfessionalTheme,
};

export default THEMES;
