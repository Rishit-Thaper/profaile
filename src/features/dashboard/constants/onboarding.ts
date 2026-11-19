export type DashboardStep = "upload" | "preview" | "theme" | "username" | "publish";

export const dashboardSteps: DashboardStep[] = ["upload", "preview", "theme", "username", "publish"];

export const dashboardStepHeadings: Record<
  DashboardStep,
  { eyebrow: string; title: string; accent: string; desc: string }
> = {
  upload: {
    eyebrow: "Step 1 of 5",
    title: "Upload your resume",
    accent: "resume",
    desc: "Drop your PDF or DOCX — our AI will extract everything in seconds.",
  },
  preview: {
    eyebrow: "Step 2 of 5",
    title: "Here's what we extracted",
    accent: "extracted",
    desc: "Review the parsed data from your resume. You can always re-upload later.",
  },
  theme: {
    eyebrow: "Step 3 of 5",
    title: "Choose your theme",
    accent: "theme",
    desc: "Pick a design that represents you. Each theme is fully responsive.",
  },
  username: {
    eyebrow: "Step 4 of 5",
    title: "Claim your URL",
    accent: "URL",
    desc: "Pick a unique username for your portfolio link.",
  },
  publish: {
    eyebrow: "Step 5 of 5",
    title: "Go live",
    accent: "live",
    desc: "Your portfolio is ready. Hit publish to share it with the world.",
  },
};
