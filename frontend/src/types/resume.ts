/**
 * Resume Data Types and Interfaces
 * Defines TypeScript types for both experienced and fresher candidate resumes
 */

export type CandidateType = 'fresher' | 'experienced';

export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  technologiesUsed: string[];
  achievements: string[];
}

export interface Internship {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  technologiesUsed: string[];
}

export interface Project {
  name: string;
  description: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  technologiesUsed: string[];
  links?: {
    github?: string;
    liveDemo?: string;
  };
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  credentialId?: string;
  credentialURL?: string;
}

export interface Language {
  language: string;
  level: 'Native' | 'Fluent' | 'Intermediate' | 'Beginner';
}

export interface SocialLink {
  platform: 'LinkedIn' | 'GitHub' | 'Portfolio' | 'Twitter' | 'Other';
  url: string;
}

// Base resume interface (common fields)
export interface BaseResume {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  address: string;
  profileImageURL?: string;
  skills: Skill[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  socialLinks: SocialLink[];
  additionalInfo: string;
}

// Experienced candidate resume
export interface ExperiencedResume extends BaseResume {
  professionalSummary: string;
  workExperience: WorkExperience[];
}

// Fresher candidate resume
export interface FresherResume extends BaseResume {
  careerObjective: string;
  strengths: string[];
  hobbies: string[];
  internships: Internship[];
}

// Union type for any resume
export type AnyResume = ExperiencedResume | FresherResume;

// Type guards
export const isExperiencedResume = (resume: AnyResume): resume is ExperiencedResume => {
  return 'professionalSummary' in resume && 'workExperience' in resume;
};

export const isFresherResume = (resume: AnyResume): resume is FresherResume => {
  return 'careerObjective' in resume && 'strengths' in resume;
};

// Form state type
export interface FormState {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  address: string;
  profileImageURL?: string;
  
  // Experienced-specific
  professionalSummary?: string;
  
  // Fresher-specific
  careerObjective?: string;
  strengths?: string[];
  hobbies?: string[];
  
  // Common
  skills: Skill[];
  education: Education[];
  workExperience?: WorkExperience[];
  internships?: Internship[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  socialLinks: SocialLink[];
  additionalInfo: string;
}

// Resume metadata
export interface ResumeMetadata {
  id: string;
  title: string;
  templateId: number;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
}
