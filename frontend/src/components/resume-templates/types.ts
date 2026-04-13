// Education
export interface EducationItem {
  degree: string;
  school: string;
  startYear: string;
  endYear: string;
  gpa?: string;
}

// Experience
export interface ExperienceItem {
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

// Projects
export interface ProjectItem {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

// Languages
export interface LanguageItem {
  language: string;
  level: "Native" | "Fluent" | "Intermediate" | "Beginner";
}

// Certifications
export interface CertificationItem {
  name: string;
  issuer: string;
  year: string;
  credentialId?: string;
}

// Social Links
export interface SocialLink {
  platform: string; // LinkedIn, GitHub, Portfolio, etc.
  url: string;
  icon?: string;
}

// Custom Sections (fully dynamic blocks)
export interface CustomSectionItem {
  title: string;
  description?: string;
  date?: string;
  items?: string[];
}

// =========================
// MAIN RESUME DATA INTERFACE
// =========================
export interface ResumeData {
  // Basic Information
  fullName: string;
  email: string;
  phone: string;
  role: string;
  address: string;

  /**
   * Optional sections (user can remove these)
   */
  summary?: string; // Professional Summary (optional)
  careerObjective?: string; // Career Objective (fresher-focused)

  // Core Sections
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: string[];

  // Additional Sections
  projects: ProjectItem[];
  languages: LanguageItem[];
  certifications: CertificationItem[];
  socialLinks: SocialLink[];

  /**
   * Fresher / Personal Sections
   */
  strengths?: string[]; // ✅ NEW
  hobbies?: string[];
  candidateType?: "experienced" | "fresher";

  /**
   * Extra flexibility
   */
  references?: string[];
  customSections?: CustomSectionItem[];
}
