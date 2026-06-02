import type { ResumeData } from "@/components/resume-templates/types";
import { getCompactMode, resolveResumeMode } from "@/components/resume-templates/templatePolicy";

export type FitRenderMode = "editor-preview" | "pdf" | "thumbnail";

interface FitResumeDataOptions {
  renderMode?: FitRenderMode;
  compactLevel?: number;
}

const BASE_MAX_ENTRIES = {
  education: 3,
  experience: 4,
  projects: 3,
  certifications: 3,
  languages: 4,
  skills: 12,
  strengths: 6,
  hobbies: 5,
  achievements: 4,
  references: 2,
  customSections: 2,
  socialLinks: 3,
};

const MAX_LENGTH = {
  summary: 320,
  role: 60,
  address: 80,
  skill: 24,
  technology: 22,
  line: 95,
  projectDescription: 170,
  achievement: 100,
  hobby: 32,
  reference: 100,
  customSection: 140,
};

const truncate = (value = "", max = 120) => {
  if (!value || value.length <= max) return value;
  return `${value.slice(0, max - 1).trim()}...`;
};

const truncateLines = (value = "", maxLines = 3, maxLineLength = MAX_LENGTH.line) => {
  const lines = value
    .split("\n")
    .map((line) => truncate(line.trim(), maxLineLength))
    .filter(Boolean);

  const limitedLines = lines.slice(0, maxLines);

  if (lines.length > maxLines && limitedLines.length > 0) {
    limitedLines[limitedLines.length - 1] = `${limitedLines[limitedLines.length - 1]} (+${
      lines.length - maxLines
    } more)`;
  }

  return limitedLines.join("\n");
};

const getContentScore = (resumeData: ResumeData) => {
  const textScore =
    (resumeData.summary || resumeData.careerObjective || "").length / 120 +
    (resumeData.role || "").length / 40 +
    (resumeData.address || "").length / 60;

  const listScore =
    resumeData.education.length * 0.9 +
    resumeData.experience.length * 1.5 +
    resumeData.projects.length * 1.2 +
    resumeData.certifications.length * 0.7 +
    resumeData.languages.length * 0.5 +
    resumeData.skills.length * 0.25 +
    (resumeData.strengths?.length || 0) * 0.35 +
    (resumeData.hobbies?.length || 0) * 0.25 +
    (resumeData.achievements?.length || 0) * 0.6 +
    (resumeData.references?.length || 0) * 0.7 +
    (resumeData.customSections?.length || 0) * 1.2 +
    resumeData.socialLinks.length * 0.25;

  return textScore + listScore;
};

const buildEntryLimits = (resumeData: ResumeData, compactLevel = 0) => {
  const limits = { ...BASE_MAX_ENTRIES };
  const score = getContentScore(resumeData);
  const resumeMode = resolveResumeMode(resumeData);
  const compactMode = getCompactMode(resumeData);

  if (compactMode || score > 13 || compactLevel >= 1) {
    if (resumeMode === "experienced") {
      limits.experience = 3;
      limits.projects = 2;
      limits.skills = 10;
      limits.achievements = 3;
      limits.customSections = 1;
    } else {
      limits.skills = 11;
      limits.customSections = 2;
    }
  }

  if (score > 18 && resumeMode === "experienced") {
    limits.education = 2;
    limits.certifications = 2;
    limits.languages = 3;
    limits.skills = 8;
    limits.references = 1;
    limits.socialLinks = 2;
  }

  if (score > 17 && resumeMode === "fresher") {
    limits.projects = 2;
    limits.skills = 10;
    limits.references = 1;
  }

  // Content density optimization for compact levels 3-6
  if (compactLevel >= 3) {
    limits.certifications = Math.min(limits.certifications, 2);
    // Level 3: Experience bullet reduction + project description cap
    limits.projects = Math.min(limits.projects, 2);
  }

  if (compactLevel >= 4) {
    // Level 4: Project description reduction and duplicate tech suppression
    limits.certifications = Math.min(limits.certifications, 2);
  }

  if (compactLevel >= 5) {
    limits.hobbies = Math.min(limits.hobbies, 2);
    limits.projects = Math.min(limits.projects, 2);
    // Level 5: Education compression, hide GPA when critical
    limits.education = Math.min(limits.education, 3);
  }

  if (compactLevel >= 6) {
    limits.strengths = Math.min(limits.strengths, 3);
    // Level 6: Keep only 2 most recent jobs
    limits.experience = Math.min(limits.experience, 2);
    // Level 6: Keep only 2 most recent education entries
    limits.education = Math.min(limits.education, 2);
    // Level 6: Hide custom sections (Additional Information)
    limits.customSections = 0;
    limits.projects = Math.min(limits.projects, 2);
  }

  if (compactLevel >= 7) {
    // Level 7: Strength reduction
    limits.strengths = Math.min(limits.strengths, 2);
  }

  if (compactLevel >= 8) {
    // Level 8: Additional information removal
    limits.customSections = 0;
  }

  if (compactLevel >= 9) {
    // Level 9: Keep only latest 2 projects
    limits.projects = Math.min(limits.projects, 2);
  }

  if (compactLevel >= 10) {
    // Level 10: Keep latest 2 jobs and prioritize latest content
    limits.experience = Math.min(limits.experience, 2);
    limits.projects = Math.min(limits.projects, 2);
  }

  return limits;
};

const fitSimpleList = (items: string[] = [], max: number, maxLength: number) => {
  const fitted = items.slice(0, max).map((item) => truncate(item, maxLength));
  if (items.length > max && fitted.length > 0) {
    fitted[fitted.length - 1] = `${fitted[fitted.length - 1]} (+${items.length - max} more)`;
  }
  return fitted;
};

const fitSummary = (resumeData: ResumeData, compactLevel: number) => {
  // Move summary truncation earlier: apply at compact level >= 2
  const maxSummary = compactLevel >= 2 ? 180 : MAX_LENGTH.summary;
  const text = resumeData.summary || resumeData.careerObjective || "";
  const alternate = resumeData.careerObjective || resumeData.summary || "";

  return {
    summary: truncate(text, maxSummary),
    careerObjective: truncate(alternate, maxSummary),
  };
};

export const fitResumeData = (
  resumeData: ResumeData,
  options: FitResumeDataOptions = {}
): ResumeData => {
  const { renderMode = "editor-preview", compactLevel = 0 } = options;
  const level = Math.max(0, Math.min(compactLevel, 10));
  const summaryConfig = fitSummary(resumeData, level);
  const limits = buildEntryLimits(resumeData, level);

  // Education: Keep most recent entries, assuming latest-first data ordering
  const educationToFit = resumeData.education.slice(0, limits.education);
  const education = educationToFit.map((item, index, list) => {
    const fitted = {
      ...item,
      degree: truncate(item.degree, 60),
      school: truncate(item.school, 48),
    };
    // Level 4+: Hide redundant labels
    if (level >= 4) {
      fitted.school = truncate(item.school, 48);
    }
    // Level 5+: Hide GPA if space is critical
    if (level >= 5 && item.gpa) {
      fitted.gpa = undefined;
    }
    if (resumeData.education.length > limits.education && index === list.length - 1) {
      fitted._more = resumeData.education.length - limits.education;
      fitted._field = "education";
    }
    return fitted;
  });

  // Experience: Keep most recent jobs, assuming latest-first data ordering
  const experienceToFit = resumeData.experience.slice(0, limits.experience);
  const experience = experienceToFit.map((item, index, list) => {
    let descriptionLines = 3;
    let bulletMax = undefined;
    let bulletCharMax = Infinity;

    // Level 3: Limit to 2 bullets per role
    if (level >= 3) {
      bulletMax = 2;
    }
    // Level 4: Limit each bullet to 120 characters
    if (level >= 4) {
      bulletCharMax = 120;
    }
    // Level 5: Limit role description block to max 3 rendered lines
    if (level >= 5) {
      descriptionLines = 3;
    }
    // Level 7: Limit to 1 bullet per role
    if (level >= 7) {
      bulletMax = 1;
      descriptionLines = 1;
    }
    // Level 9: Limit to very short description
    if (level >= 9) {
      bulletMax = 1;
      bulletCharMax = 80;
      descriptionLines = 1;
    }

    const description = item.description || "";
    let descLines = description
      .split("\n")
      .filter((line) => line.trim().length > 0);

    // Apply bullet limit if specified
    if (bulletMax !== undefined) {
      descLines = descLines.slice(0, bulletMax);
    }

    // Apply character limit to each bullet
    if (bulletCharMax !== Infinity) {
      descLines = descLines.map((line) => truncate(line, bulletCharMax));
    }

    const finalDesc = truncateLines(descLines.join("\n"), descriptionLines);

    const fitted = {
      ...item,
      role: truncate(item.role, 48),
      company: truncate(item.company, 42),
      description: finalDesc,
    };

    if (resumeData.experience.length > limits.experience && index === list.length - 1) {
      fitted._more = resumeData.experience.length - limits.experience;
      fitted._field = "experience";
    }

    return fitted;
  });

  // Projects: Keep most recent projects, assuming latest-first data ordering
  const projectsToFit = resumeData.projects.slice(0, limits.projects);
  const skillSet = new Set((resumeData.skills || []).map((skill) => skill.toLowerCase().trim()));
  const projects = projectsToFit.map((item, index, list) => {
    let descriptionMaxLength = MAX_LENGTH.projectDescription;
    let projectDescLines = Infinity;

    // Level 3: Limit project description to 160 chars
    if (level >= 3) {
      descriptionMaxLength = 160;
    }
    // Level 6: Limit project description to 2 rendered lines
    if (level >= 6) {
      projectDescLines = 2;
    }
    // Level 7: Limit to 1 line
    if (level >= 7) {
      descriptionMaxLength = 100;
      projectDescLines = 1;
    }
    // Level 9: Hide description
    if (level >= 9) {
      descriptionMaxLength = 0;
      projectDescLines = 0;
    }

    const duplicateTechLine =
      level >= 4 &&
      item.technologies.length > 0 &&
      item.technologies.every((tech) => skillSet.has(tech.toLowerCase().trim()));

    if (projectDescLines === 0 || descriptionMaxLength === 0) {
      return {
        ...item,
        name: truncate(item.name, 40),
        description: "",
        technologies: duplicateTechLine ? [] : item.technologies.slice(0, level >= 9 ? 0 : 2).map((tech) => truncate(tech, MAX_LENGTH.technology)),
        ...(resumeData.projects.length > limits.projects && index === list.length - 1
          ? { _more: resumeData.projects.length - limits.projects, _field: "projects" }
          : {}),
      };
    }

    if (projectDescLines !== Infinity && level >= 6) {
      const descLines = (item.description || "")
        .split("\n")
        .map((line) => truncate(line, MAX_LENGTH.line))
        .filter(Boolean)
        .slice(0, projectDescLines);
      return {
        ...item,
        name: truncate(item.name, 40),
        description: descLines.join("\n"),
        technologies: duplicateTechLine
          ? []
          : item.technologies
              .slice(0, level >= 9 ? 0 : level >= 7 ? 1 : 2)
              .map((tech) => truncate(tech, MAX_LENGTH.technology)),
        ...(resumeData.projects.length > limits.projects && index === list.length - 1
          ? { _more: resumeData.projects.length - limits.projects, _field: "projects" }
          : {}),
      };
    }

    const fitted = {
      ...item,
      name: truncate(item.name, 40),
      description: truncate(item.description, descriptionMaxLength),
      technologies: duplicateTechLine
        ? []
        : item.technologies
            .slice(0, limits.projects < 3 ? 2 : 3)
            .map((tech) => truncate(tech, MAX_LENGTH.technology)),
    };

    if (resumeData.projects.length > limits.projects && index === list.length - 1) {
      fitted._more = resumeData.projects.length - limits.projects;
      fitted._field = "projects";
    }

    return fitted;
  });

  const fittedStrengths = fitSimpleList(resumeData.strengths || [], limits.strengths, MAX_LENGTH.line);
  const fittedHobbies = fitSimpleList(resumeData.hobbies || [], limits.hobbies, MAX_LENGTH.hobby);
  const fittedAchievements = level >= 7 ? [] : fitSimpleList(resumeData.achievements || [], limits.achievements, MAX_LENGTH.achievement);
  const fittedReferences = fitSimpleList(resumeData.references || [], limits.references, MAX_LENGTH.reference);

  return {
    ...resumeData,
    ...summaryConfig,
    education,
    experience,
    projects,
    skills: fitSimpleList(resumeData.skills, limits.skills, MAX_LENGTH.skill),
    certifications: resumeData.certifications.slice(0, limits.certifications),
    languages: resumeData.languages.slice(0, limits.languages),
    strengths: fittedStrengths,
    hobbies: fittedHobbies,
    achievements: fittedAchievements,
    references: fittedReferences,
    customSections: resumeData.customSections?.slice(0, limits.customSections) || [],
    socialLinks: resumeData.socialLinks,
    theme: resumeData.theme,
    compactLevel: level,
  };
};
