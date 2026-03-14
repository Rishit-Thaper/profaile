import { PortfolioData } from "@/app/types";

// ─── RESUME DATA ─────────────────────────────────────────────────────────────
export const data: PortfolioData = {
  personal_info: {
    name: "Rishit Thaper",
    email: "rishit@gmail.com",
    linkedin: "https://www.linkedin.com/in/rishit-5463261a6/",
    github: "https://github.com/Rishit-Thaper",
    twitter: "https://twitter.com/rishit_thaper",
    behance: "https://www.behance.net/rishitthaper",
    location: "Ambala, India",
    phone: "7056761469",
    title: "Full Stack Software Engineer",
  },
  skills: {
    databases: ["MongoDB", "SQL"],
    frameworks: ["React.js", "Next.js", "Node.js", "Express.js", "Chakra UI"],
    languages: ["JavaScript", "TypeScript", "C++", "HTML5", "CSS3", "SCSS"],
    tools: ["Git", "GitHub", "Bash", "Postman", "Firebase", "REST APIs"],
  },
  experience: [
    {
      company: "Logicease Tecno Solutions Pvt. Ltd.",
      role: "Software Engineer",
      description: [
        "Enhanced a streamlined order flow management system for Globhe using React.js, cutting order processing time by 25% and reducing Client Delivery Team inquiries by 30% with real-time status updates.",
        "Implemented a Site Evaluation feature for Globhe, enabling efficient mission planning by consolidating data, cutting planning time by 30% for the Client Delivery Team.",
        "Improved a data evaluation tool allowing seamless approval, rejection, or change requests for drone operator file submissions, boosting review efficiency by 20%.",
        "Upgraded Firebase Functions from v1 to v2, improving backend performance and reducing API latency by 15%.",
      ],
      duration: "March 2024 – Present",
      location: "Ambala, India",
    },
  ],
  projects: [
    {
      name: "SummarEase",
      description:
        "AI webpage summarizer Chrome extension using React.js and Google Gemini API to generate concise, accessible summaries.",
      github: "https://github.com/Rishit-Thaper/SummarEase",
      live: "",
      tech_stack: ["React.js", "Vite", "Gemini API"],
      color: "#FF6B6B",
      bg: "#FFF0F0",
    },
    {
      name: "Dareventure",
      description:
        "Engaging party game app with Truth or Dare, Never Have I Ever and more — built for groups who love a good time.",
      github: "",
      live: "https://dareventure.vercel.app/",
      tech_stack: ["Next.js", "MongoDB"],
      color: "#5C6BC0",
      bg: "#F0F1FF",
    },
    {
      name: "Flirtfolio",
      description:
        "Playful pickup line generator — users can generate or contribute their own clever lines with a slick Next.js frontend.",
      github: "",
      live: "https://flirtfolio.vercel.app/",
      tech_stack: ["Next.js", "Appwrite"],
      color: "#FFB347",
      bg: "#FFF8EE",
    },
    {
      name: "Linkify",
      description:
        "Versatile web application for efficient management and sharing of links, built with a full TypeScript stack.",
      github: "",
      live: "https://linkify-kappa.vercel.app/home",
      tech_stack: ["Node.js", "Express", "MongoDB", "React.js", "TypeScript"],
      color: "#26C6B0",
      bg: "#EDFCFA",
    },
    {
      name: "Brand Identity Design",
      description:
        "Complete brand identity system for a sustainable fashion startup, including logo, typography, and mobile app design.",
      behance: "https://www.behance.net/gallery/123456/Brand-Identity-Design",
      figma: "https://www.figma.com/file/123456/Design-System",
      dribbble: "https://dribbble.com/shots/123456-Brand-Identity",
      tech_stack: ["Figma", "Illustrator", "Photoshop"],
      color: "#5C6BC0",
      bg: "#F0F1FF",
    },
  ],
  education: [
    {
      institution: "Kurukshetra University",
      degree: "Bachelor of Technology",
      duration: "June 2024",
      field: "Computer Science",
      gpa: "8.5",
    },
  ],
};
