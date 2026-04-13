// utils/resumeDataConverter.ts
import { ResumeData, LanguageItem, CertificationItem, SocialLink, ExperienceItem } from "@/components/resume-templates/types";

export type CandidateType = "experienced" | "fresher";

export interface FormData {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  address: string;
  summary: string;
  education: string;
  experience: string;
  skills: string;
  projects: string;
  strengths: string; // For freshers
  hobbies: string;   // For freshers
}

/**
 * Convert form data to template-ready data structure
 */
export const convertToTemplateData = (
  formData: FormData,
  languages: LanguageItem[],
  certifications: CertificationItem[],
  socialLinks: SocialLink[],
  candidateType: CandidateType = "experienced"
): ResumeData => {
  // Parse skills from comma-separated string to array
  const skillsArray = formData.skills
    .split(',')
    .map(skill => skill.trim())
    .filter(skill => skill !== '');
  
  // Parse education
  const educationArray = parseEducation(formData.education);
  
  // Parse experience
  const experienceArray = parseExperience(formData.experience, candidateType);
  
  // Parse projects
  const projectsArray = parseProjects(formData.projects);

  // Parse strengths (for freshers)
  const strengthsArray = candidateType === "fresher" 
    ? formData.strengths
        .split(',')
        .map(strength => strength.trim())
        .filter(strength => strength !== '')
    : [];

  // Parse hobbies (for freshers)
  const hobbiesArray = candidateType === "fresher"
    ? formData.hobbies
        .split(',')
        .map(hobby => hobby.trim())
        .filter(hobby => hobby !== '')
    : [];

  // Decide summary vs careerObjective based on candidate type
  const resumeData: ResumeData = {
    fullName: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    role: formData.role,
    address: formData.address,
    education: educationArray,
    experience: experienceArray,
    skills: skillsArray,
    projects: projectsArray,
    languages: languages,
    certifications: certifications,
    socialLinks: socialLinks,
    strengths: strengthsArray.length > 0 ? strengthsArray : undefined,
    hobbies: hobbiesArray.length > 0 ? hobbiesArray : undefined,
    candidateType,
  };

  // Add summary or careerObjective based on candidate type
  if (candidateType === "experienced") {
    if (formData.summary.trim()) {
      resumeData.summary = formData.summary;
    }
  } else {
    if (formData.summary.trim()) {
      resumeData.careerObjective = formData.summary;
    }
  }

  return resumeData;
};

export const convertFromTemplateData = (
  resumeData: ResumeData
): {
  formData: FormData;
  languages: LanguageItem[];
  certifications: CertificationItem[];
  socialLinks: SocialLink[];
  candidateType: CandidateType;
} => {
  const candidateType: CandidateType =
    resumeData.candidateType ||
    (resumeData.careerObjective || resumeData.strengths?.length || resumeData.hobbies?.length
      ? "fresher"
      : "experienced");

  const formData: FormData = {
    fullName: resumeData.fullName || "",
    email: resumeData.email || "",
    phone: resumeData.phone || "",
    role: resumeData.role || "",
    address: resumeData.address || "",
    summary: resumeData.summary || resumeData.careerObjective || "",
    education: (resumeData.education || [])
      .map(
        (edu) =>
          [edu.degree, edu.school, edu.startYear, edu.endYear, edu.gpa]
            .filter(Boolean)
            .join(" | ")
      )
      .join("\n"),
    experience: (resumeData.experience || [])
      .map((exp) => {
        const titleLine =
          candidateType === "experienced"
            ? `${exp.role}${exp.company ? ` at ${exp.company}` : ""}`
            : exp.role;
        const companyLine =
          candidateType === "fresher" && exp.company ? `\n${exp.company}` : "";
        const dateLine = `\n${exp.startDate || ""} - ${exp.endDate || ""}`.trimEnd();
        const descriptionLine = exp.description ? `\n${exp.description}` : "";
        return `${titleLine}${companyLine}${dateLine}${descriptionLine}`.trim();
      })
      .join("\n\n"),
    skills: (resumeData.skills || []).join(", "),
    projects: (resumeData.projects || [])
      .map((project) =>
        [project.name, project.description, project.technologies?.join(", ")]
          .filter(Boolean)
          .join("\n")
      )
      .join("\n\n"),
    strengths: (resumeData.strengths || []).join(", "),
    hobbies: (resumeData.hobbies || []).join(", "),
  };

  return {
    formData,
    languages: resumeData.languages || [],
    certifications: resumeData.certifications || [],
    socialLinks: resumeData.socialLinks || [],
    candidateType,
  };
};

/**
 * Parse education string into structured array
 */
const parseEducation = (educationStr: string) => {
  return educationStr
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(line => {
      const parts = line.split('|').map(part => part.trim());
      return {
        degree: parts[0] || "",
        school: parts[1] || "",
        startYear: parts[2] || "",
        endYear: parts[3] || "",
        gpa: parts[4] || "",
      };
    });
};

/**
 * Parse experience string into structured array
 * Note: We'll need to add a custom property to ExperienceItem for isFresherExperience
 * Since TypeScript doesn't allow adding properties to imported interfaces directly,
 * we'll use intersection types or handle it differently in templates
 */
const parseExperience = (experienceStr: string, candidateType: CandidateType): ExperienceItem[] => {
  return experienceStr
    .split('\n\n')
    .filter(block => block.trim() !== '')
    .map(block => {
      const lines = block.split('\n').filter(line => line.trim() !== '');
      
      // Different parsing for freshers vs experienced
      if (candidateType === "fresher") {
        return {
          role: lines[0]?.trim() || "",
          company: lines[1]?.trim() || "",
          startDate: lines[2]?.split('-')[0]?.trim() || "",
          endDate: lines[2]?.split('-')[1]?.trim() || "",
          description: lines.slice(3).join('\n').trim() || "",
        };
      } else {
        const firstLine = lines[0] || "";
        const atIndex = firstLine.toLowerCase().indexOf(' at ');
        
        return {
          role: atIndex !== -1 ? firstLine.substring(0, atIndex).trim() : firstLine,
          company: atIndex !== -1 ? firstLine.substring(atIndex + 4).trim() : "",
          startDate: lines[1]?.split('-')[0]?.trim() || "",
          endDate: lines[1]?.split('-')[1]?.trim() || "",
          description: lines.slice(2).join('\n').trim() || "",
        };
      }
    });
};

/**
 * Parse projects string into structured array
 */
const parseProjects = (projectsStr: string) => {
  return projectsStr
    .split('\n\n')
    .filter(block => block.trim() !== '')
    .map(block => {
      const lines = block.split('\n').filter(line => line.trim() !== '');
      return {
        name: lines[0] || "",
        description: lines[1] || "",
        technologies: lines[2]?.split(',').map(tech => tech.trim()) || [],
      };
    });
};

/**
 * Generate sample data for testing/demo
 */
export const generateSampleData = (candidateType: CandidateType = "experienced"): {
  formData: FormData;
  languages: LanguageItem[];
  certifications: CertificationItem[];
  socialLinks: SocialLink[];
} => {
  if (candidateType === "experienced") {
    return {
      formData: {
        fullName: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 234 567 8900",
        role: "Senior Software Engineer",
        address: "New York, NY",
        summary: "Experienced software engineer with 5+ years in full-stack development. Passionate about creating scalable web applications and mentoring junior developers.",
        education: "Bachelor of Computer Science | MIT | 2015 | 2019 | 3.8\nMaster of Computer Science | Stanford | 2019 | 2021 | 3.9",
        experience: "Senior Software Engineer at TechCorp\n2021 - Present\nLed a team of 5 developers in building a microservices architecture\nImplemented CI/CD pipeline reducing deployment time by 60%\n\nSoftware Developer at StartupXYZ\n2019 - 2021\nDeveloped RESTful APIs using Node.js and Express\nBuilt responsive frontend with React and TypeScript",
        skills: "JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, MongoDB, PostgreSQL",
        projects: "E-commerce Platform\nBuilt a full-stack e-commerce platform with React and Node.js\nTechnologies: React, Node.js, MongoDB, Stripe API\n\nTask Management App\nDeveloped a collaborative task management application\nTechnologies: TypeScript, Next.js, Prisma, PostgreSQL",
        strengths: "",
        hobbies: "",
      },
      languages: [
        { language: "English", level: "Native" },
        { language: "Hindi", level: "Fluent" },
        { language: "Spanish", level: "Intermediate" },
      ],
      certifications: [
        { name: "AWS Certified Solutions Architect", issuer: "Amazon", year: "2023" },
        { name: "React Advanced Certification", issuer: "Meta", year: "2022" },
        { name: "Google Cloud Professional", issuer: "Google", year: "2021" },
      ],
      socialLinks: [
        { platform: "LinkedIn", url: "linkedin.com/in/johndoe" },
        { platform: "GitHub", url: "github.com/johndoe" },
        { platform: "Portfolio", url: "johndoeportfolio.com" },
      ],
    };
  } else {
    // Fresher sample data
    return {
      formData: {
        fullName: "Alex Johnson",
        email: "alex.johnson@example.com",
        phone: "+1 987 654 3210",
        role: "Software Developer (Fresher)",
        address: "San Francisco, CA",
        summary: "Recent Computer Science graduate passionate about software development. Seeking an entry-level position to apply academic knowledge and grow as a professional developer.",
        education: "Bachelor of Computer Science | UC Berkeley | 2020 | 2024 | 3.7\nMinor in Mathematics | UC Berkeley | 2020 | 2024 | 3.8",
        experience: "Summer Intern at TechStart\nJun 2023 - Aug 2023\nAssisted in frontend development using React.js\nParticipated in code reviews and team meetings\n\nIndustrial Training at DevAcademy\nJan 2023 - Mar 2023\nLearned full-stack development fundamentals\nBuilt a CRUD application using MERN stack",
        skills: "JavaScript, Python, React, Node.js, HTML/CSS, Git, MongoDB, SQL",
        projects: "Student Management System\nDeveloped a comprehensive system for tracking student records\nTechnologies: Java, MySQL, Spring Boot\n\nE-commerce Website\nBuilt a responsive e-commerce site as a college project\nTechnologies: React, Node.js, MongoDB, Express",
        strengths: "Quick learner, Team player, Problem-solving, Adaptable, Attention to detail",
        hobbies: "Coding competitions, Open source contributions, Reading tech blogs, Playing chess",
      },
      languages: [
        { language: "English", level: "Native" },
        { language: "French", level: "Intermediate" },
      ],
      certifications: [
        { name: "Java Programming Certification", issuer: "Oracle", year: "2023" },
        { name: "Web Development Bootcamp", issuer: "Udemy", year: "2022" },
      ],
      socialLinks: [
        { platform: "LinkedIn", url: "linkedin.com/in/alexjohnson" },
        { platform: "GitHub", url: "github.com/alexjohnson" },
        { platform: "Portfolio", url: "alexjohnson.dev" },
      ],
    };
  }
};

/**
 * Clear all form data
 */
export const clearFormData = (candidateType: CandidateType = "experienced"): {
  formData: FormData;
  languages: LanguageItem[];
  certifications: CertificationItem[];
  socialLinks: SocialLink[];
} => {
  return {
    formData: {
      fullName: "",
      email: "",
      phone: "",
      role: "",
      address: "",
      summary: "",
      education: "",
      experience: "",
      skills: "",
      projects: "",
      strengths: candidateType === "fresher" ? "Quick learner, Team player" : "",
      hobbies: candidateType === "fresher" ? "Reading, Sports, Coding" : "",
    },
    languages: candidateType === "experienced" 
      ? [{ language: "English", level: "Native" }]
      : [],
    certifications: [],
    socialLinks: [],
  };
};

/**
 * Parse strengths string into array
 */
export const parseStrengths = (strengthsStr: string): string[] => {
  return strengthsStr
    .split(',')
    .map(strength => strength.trim())
    .filter(strength => strength !== '');
};

/**
 * Parse hobbies string into array
 */
export const parseHobbies = (hobbiesStr: string): string[] => {
  return hobbiesStr
    .split(',')
    .map(hobby => hobby.trim())
    .filter(hobby => hobby !== '');
};

/**
 * Get default placeholder text based on candidate type
 */
export const getPlaceholderText = (field: keyof FormData, candidateType: CandidateType): string => {
  const placeholders = {
    experienced: {
      summary: "Brief overview of your professional background and achievements...",
      experience: "Senior Developer at TechCorp\n2021 - Present\nLed development of web applications...",
      role: "Senior Software Engineer",
    },
    fresher: {
      summary: "Career goals, academic achievements, and what you bring as a fresher...",
      experience: "Summer Intern at TechCorp\nJun 2023 - Aug 2023\nAssisted in frontend development...",
      role: "Software Developer (Fresher)",
      strengths: "Hardworking, Quick learner, Team player, Adaptable",
      hobbies: "Coding competitions, Reading tech blogs, Open source contributions",
    },
  };

  const typePlaceholders = placeholders[candidateType];
  if (field in typePlaceholders) {
    return typePlaceholders[field as keyof typeof typePlaceholders];
  }

  // Default placeholders for fields not specific to candidate type
  const defaults: Partial<Record<keyof FormData, string>> = {
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    address: "New York, NY",
    education: "Bachelor of Computer Science | University | 2020 | 2024 | 3.8",
    skills: "JavaScript, React, Node.js, Python",
    projects: "Project Name\nDescription\nTechnologies: React, Node.js, MongoDB",
  };

  return defaults[field] || "";
};

/**
 * Check if an experience item is fresher experience (internship/training)
 * This is a helper for templates to identify fresher vs professional experience
 */
export const isFresherExperience = (experienceItem: ExperienceItem): boolean => {
  const fresherKeywords = [
    "intern", "internship", "training", "fresher", "trainee", 
    "student", "apprentice", "volunteer"
  ];
  
  const role = experienceItem.role.toLowerCase();
  const company = experienceItem.company.toLowerCase();
  const description = experienceItem.description.toLowerCase();
  
  return fresherKeywords.some(keyword => 
    role.includes(keyword) || 
    company.includes(keyword) || 
    description.includes(keyword)
  );
};

/**
 * Format experience for display based on candidate type
 */
export const formatExperienceForDisplay = (
  experienceItem: ExperienceItem, 
  candidateType: CandidateType
): string => {
  if (candidateType === "fresher") {
    return `${experienceItem.role}\n${experienceItem.company}\n${experienceItem.startDate} - ${experienceItem.endDate}\n${experienceItem.description}`;
  } else {
    return `${experienceItem.role} at ${experienceItem.company}\n${experienceItem.startDate} - ${experienceItem.endDate}\n${experienceItem.description}`;
  }
};
