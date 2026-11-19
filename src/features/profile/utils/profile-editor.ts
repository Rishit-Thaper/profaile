import { PortfolioData } from "@/app/types";
import { normalizeExternalUrl } from "@/features/portfolio/utils/external-links";
import { socialFields } from "../constants/editor-fields";

function cleanArray(values?: string[]): string[] {
  return values?.map((value) => value.trim()).filter(Boolean) ?? [];
}

function isEmptyObject<T extends object>(value: T): boolean {
  return Object.values(value).every((item) => {
    if (Array.isArray(item)) return item.length === 0;
    return !item || String(item).trim().length === 0;
  });
}

export function prepareProfileDataForSave(data: PortfolioData): PortfolioData {
  const cleaned = JSON.parse(JSON.stringify(data)) as PortfolioData;

  if (cleaned.skills) {
    cleaned.skills.languages = cleanArray(cleaned.skills.languages);
    cleaned.skills.frameworks = cleanArray(cleaned.skills.frameworks);
    cleaned.skills.tools = cleanArray(cleaned.skills.tools);
    cleaned.skills.databases = cleanArray(cleaned.skills.databases);
  }
  if (cleaned.core_stack) cleaned.core_stack = cleanArray(cleaned.core_stack);

  if (cleaned.projects) {
    cleaned.projects = cleaned.projects
      .map((project) => ({
        ...project,
        tech_stack: cleanArray(project.tech_stack),
        github: project.github ? normalizeExternalUrl(project.github) ?? project.github.trim() : project.github,
        live: project.live ? normalizeExternalUrl(project.live) ?? project.live.trim() : project.live,
      }))
      .filter((project) => !isEmptyObject(project));
  }

  for (const field of socialFields) {
    const value = cleaned.personal_info[field.key];
    if (typeof value === "string" && value) {
      cleaned.personal_info[field.key] = normalizeExternalUrl(value) ?? value.trim();
    }
  }

  if (cleaned.experience) cleaned.experience = cleaned.experience.filter((experience) => !isEmptyObject(experience));
  if (cleaned.education) cleaned.education = cleaned.education.filter((education) => !isEmptyObject(education));
  cleaned.stats = cleaned.stats?.filter((stat) => !isEmptyObject(stat));

  return cleaned;
}
