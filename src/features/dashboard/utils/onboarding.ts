import { Profile } from "@/features/profile/api/profile-client";
import { DashboardStep } from "../constants/onboarding";

export function deriveDashboardStep(profile: Profile): DashboardStep {
  if (!profile.portfolio_data || Object.keys(profile.portfolio_data).length === 0) {
    return "upload";
  }
  if (!profile.selected_theme) return "theme";
  if (!profile.username) return "username";
  return "publish";
}
