export const portfolioSlugPattern = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;

export function getPortfolioSlugValidationError(slug: unknown): string | null {
  if (typeof slug !== "string" || slug.length < 2 || slug.length > 40) {
    return "Portfolio URL must be 2-40 characters using lowercase letters, numbers, and hyphens";
  }
  if (!portfolioSlugPattern.test(slug)) {
    return "Portfolio URL must be 2-40 characters using lowercase letters, numbers, and hyphens";
  }
  return null;
}
