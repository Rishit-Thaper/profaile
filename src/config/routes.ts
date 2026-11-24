export const routes = {
  home: "/",
  dashboard: "/dashboard",
  editProfile: "/edit",
  editProfileForPortfolio: (portfolioId: string) => `/edit?portfolio=${encodeURIComponent(portfolioId)}`,
  login: "/login",
  portfolio: (username: string) => `/p/${username}`,
  portfolioBySlug: (username: string, slug: string) => `/u/${username}/${slug}`,
  portfolioDraft: (portfolioId: string) => `/draft/${portfolioId}`,
} as const;
