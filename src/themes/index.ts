import { PortfolioData } from "@/app/types";
import { ComponentType } from "react";
import MinimalTheme from "./MinimalTheme";
import ModernTheme from "./ModernTheme";
import ProfessionalTheme from "./ProfessionalTheme";
import NeonTheme from "./NeonTheme";
import ElegantTheme from "./ElegantTheme";
import VibrantTheme from "./VibrantTheme";
import TerminalTheme from "./TerminalTheme";

export type ThemeComponent = ComponentType<{ data: PortfolioData }>;

const THEMES: Record<string, ThemeComponent> = {
  minimal: MinimalTheme,
  modern: ModernTheme,
  professional: ProfessionalTheme,
  neon: NeonTheme,
  elegant: ElegantTheme,
  vibrant: VibrantTheme,
  terminal: TerminalTheme,
};

export default THEMES;
