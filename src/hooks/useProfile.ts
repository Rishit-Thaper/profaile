import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PortfolioData } from "@/app/types";

export interface Profile {
  id: string;
  username: string | null;
  portfolio_data: PortfolioData | null;
  selected_theme: string;
  is_published: boolean;
}

// --- API Functions ---

async function fetchProfile(): Promise<Profile> {
  const res = await fetch("/api/profile");
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

async function updateProfile(updates: Partial<Profile>): Promise<Profile> {
  const res = await fetch("/api/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
}

async function parseResume(file: File): Promise<PortfolioData> {
  const formData = new FormData();
  formData.append("resume", file);
  
  const res = await fetch("/api/parse-resume", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to parse resume");
  }

  return data;
}

export async function checkUsername(username: string): Promise<{ available: boolean; error?: string }> {
  const res = await fetch(`/api/profile/check-username?username=${encodeURIComponent(username)}`);
  return res.json();
}

// --- React Query Hooks ---

export function useProfileQuery() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["profile"], updatedProfile);
      // Fallback in case we want to trigger a refetch too:
      // queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useParseResumeMutation() {
  return useMutation({
    mutationFn: parseResume,
  });
}

export function useCheckUsernameQuery(username: string, enabled: boolean) {
  return useQuery({
    queryKey: ["usernameCheck", username],
    queryFn: () => checkUsername(username),
    enabled: enabled && username.length > 0,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
}
