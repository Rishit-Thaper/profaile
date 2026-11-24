import { CareerPortfolio, PortfolioData, PortfolioVersion, ResumeVersion } from "@/app/types";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data as T;
}

export function fetchPortfolios() { return request<CareerPortfolio[]>("/api/portfolios", { cache: "no-store" }); }
export function createPortfolio(input: { name: string; slug?: string; draft_data?: PortfolioData; draft_theme?: string }) {
  return request<CareerPortfolio>("/api/portfolios", { method: "POST", body: JSON.stringify(input) });
}
export function updatePortfolio(id: string, input: Partial<Pick<CareerPortfolio, "name" | "slug" | "draft_data" | "draft_theme">>) {
  return request<CareerPortfolio>(`/api/portfolios/${id}`, { method: "PATCH", body: JSON.stringify(input) });
}
export function fetchPortfolioVersions(id: string) { return request<PortfolioVersion[]>(`/api/portfolios/${id}/versions`); }
export function createPortfolioVersion(id: string, input: { label?: string; data?: PortfolioData; theme?: string; source_resume_version_id?: string | null }) {
  return request<PortfolioVersion>(`/api/portfolios/${id}/versions`, { method: "POST", body: JSON.stringify(input) });
}
export function publishPortfolioVersion(id: string, versionId: string | null) {
  return request<CareerPortfolio>(`/api/portfolios/${id}/publish`, { method: "PUT", body: JSON.stringify({ version_id: versionId }) });
}
export function fetchResumeVersions() { return request<ResumeVersion[]>("/api/resumes"); }
export async function saveResumeVersion(file: File, parsedData: PortfolioData): Promise<ResumeVersion> {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("parsed_data", JSON.stringify(parsedData));
  const response = await fetch("/api/resumes", { method: "POST", body: formData });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Could not save resume");
  return data as ResumeVersion;
}
