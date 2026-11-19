import { PortfolioData } from "@/app/types";

export async function parseResume(file: File): Promise<PortfolioData> {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await fetch("/api/parse-resume", { method: "POST", body: formData });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to parse resume");
  return data;
}
