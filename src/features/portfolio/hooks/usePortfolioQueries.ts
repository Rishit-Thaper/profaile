import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CareerPortfolio, PortfolioData } from "@/app/types";
import { createPortfolio, createPortfolioVersion, fetchPortfolioVersions, fetchPortfolios, fetchResumeVersions, publishPortfolioVersion, updatePortfolio } from "../api/portfolio-client";

const portfoliosKey = ["portfolios"] as const;
const resumeVersionsKey = ["resumeVersions"] as const;
const versionsKey = (id: string) => ["portfolioVersions", id] as const;

export function usePortfoliosQuery() { return useQuery({ queryKey: portfoliosKey, queryFn: fetchPortfolios, refetchOnWindowFocus: "always" }); }
export function useResumeVersionsQuery() { return useQuery({ queryKey: resumeVersionsKey, queryFn: fetchResumeVersions }); }
export function usePortfolioVersionsQuery(id: string | null) {
  return useQuery({ queryKey: versionsKey(id ?? ""), queryFn: () => fetchPortfolioVersions(id!), enabled: Boolean(id) });
}
export function usePortfolioMutations() {
  const client = useQueryClient();
  const invalidate = () => client.invalidateQueries({ queryKey: portfoliosKey });
  return {
    create: useMutation({ mutationFn: createPortfolio, onSuccess: invalidate }),
    update: useMutation({ mutationFn: ({ id, ...input }: { id: string } & Partial<Pick<CareerPortfolio, "name" | "slug" | "draft_data" | "draft_theme">>) => updatePortfolio(id, input), onSuccess: invalidate }),
    saveDraft: useMutation({ mutationFn: ({ id, data, theme }: { id: string; data: PortfolioData; theme?: string }) => updatePortfolio(id, { draft_data: data, draft_theme: theme }), onSuccess: invalidate }),
    snapshot: useMutation({ mutationFn: ({ id, ...input }: { id: string; label?: string; data?: PortfolioData; theme?: string; source_resume_version_id?: string | null }) => createPortfolioVersion(id, input), onSuccess: (_, vars) => client.invalidateQueries({ queryKey: versionsKey(vars.id) }) }),
    publish: useMutation({ mutationFn: ({ id, versionId }: { id: string; versionId: string | null }) => publishPortfolioVersion(id, versionId), onSuccess: invalidate }),
  };
}
