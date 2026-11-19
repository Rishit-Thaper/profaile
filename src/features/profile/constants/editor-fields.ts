import { PortfolioData } from "@/app/types";

export type StringPersonalField = Exclude<keyof PortfolioData["personal_info"], "photo_visible">;

export const personalFields: { key: StringPersonalField; label: string; placeholder?: string }[] = [
  { key: "name", label: "Full Name", placeholder: "Jane Doe" },
  { key: "title", label: "Title", placeholder: "Software Engineer" },
  { key: "email", label: "Email", placeholder: "jane@example.com" },
  { key: "phone", label: "Phone", placeholder: "+1 555 000 0000" },
  { key: "location", label: "Location", placeholder: "San Francisco, CA" },
];

export const socialFields: { key: StringPersonalField; label: string }[] = [
  { key: "github", label: "GitHub" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "twitter", label: "Twitter / X" },
  { key: "medium", label: "Medium" },
  { key: "youtube", label: "YouTube" },
  { key: "behance", label: "Behance" },
  { key: "dribbble", label: "Dribbble" },
  { key: "figma", label: "Figma" },
  { key: "leetcode", label: "LeetCode" },
  { key: "codechef", label: "CodeChef" },
  { key: "codeforces", label: "Codeforces" },
];

export const skillFields: { key: keyof PortfolioData["skills"]; label: string }[] = [
  { key: "languages", label: "Languages" },
  { key: "frameworks", label: "Frameworks" },
  { key: "tools", label: "Tools" },
  { key: "databases", label: "Databases" },
];
