import { PortfolioData } from "@/app/types";

export interface Profile {
  id: string;
  username: string | null;
  portfolio_data: PortfolioData | null;
  selected_theme: string;
  is_published: boolean;
}

export async function fetchProfile(): Promise<Profile> {
  const response = await fetch("/api/profile");
  if (!response.ok) throw new Error("Failed to fetch profile");
  return response.json();
}

export async function updateProfile(updates: Partial<Profile>): Promise<Profile> {
  const response = await fetch("/api/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error("Failed to update profile");
  return response.json();
}

export async function checkUsername(username: string): Promise<{ available: boolean; error?: string }> {
  const response = await fetch(`/api/profile/check-username?username=${encodeURIComponent(username)}`);
  return response.json();
}
