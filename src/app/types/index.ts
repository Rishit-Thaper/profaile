export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  location: string;
  phone: string;
  photo?: string;
  photo_visible?: boolean;
  leetcode?: string;
  codechef?: string;
  codeforces?: string;
  github?: string;
  linkedin?: string;
  behance?: string;
  dribbble?: string;
  figma?: string;
  twitter?: string;
  medium?: string;
  youtube?: string;
}

export interface Skills {
  languages: string[];
  frameworks: string[];
  databases: string[];
  tools: string[];
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  location: string;
  description: string[];
}

export interface Projects {
  name: string;
  description: string;
  tech_stack: string[];
  github?: string;
  live?: string;
  behance?: string;
  dribbble?: string;
  figma?: string;
  twitter?: string;
  medium?: string;
  youtube?: string;
  bg?: string;
  color?: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  duration: string;
  gpa?: string;
}

export interface Stat {
  val: string;
  label: string;
}

export interface PortfolioData {
  personal_info: PersonalInfo;

  skills: Skills;

  experience: Experience[];

  projects: Projects[];

  education: Education[];

  stats?: Stat[];

  core_stack?: string[];
}
