import type { ResumeData } from "@/components/resume-templates/types";
import { getCompactMode, resolveResumeMode } from "@/components/resume-templates/templatePolicy";

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

const buildEntryLimits = (resumeData: ResumeData) => {
  const limits = { ...BASE_MAX_ENTRIES };
  const score = getContentScore(resumeData);
  const resumeMode = resolveResumeMode(resumeData);
  const compactMode = getCompactMode(resumeData);

  if (compactMode || score > 13) {
    if (resumeMode === "experienced") {
      limits.experience = 3;
      limits.projects = 2;
      limits.skills = 10;
      limits.achievements = 3;
      limits.customSections = 1;
    } else {
      // Fresher mode should prefer denser layout over dropping visible sections.
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

  return limits;
};

const fitSimpleList = (items: string[] = [], max: number, maxLength: number) => {
  const fitted = items.slice(0, max).map((item) => truncate(item, maxLength));
  if (items.length > max && fitted.length > 0) {
    fitted[fitted.length - 1] = `${fitted[fitted.length - 1]} (+${items.length - max} more)`;
  }
  return fitted;
};

export const fitResumeData = (resumeData: ResumeData): ResumeData => {
  const limits = buildEntryLimits(resumeData);

  const education = resumeData.education.slice(0, limits.education).map((item, index, list) => ({
    ...item,
    degree: truncate(item.degree, 60),
    school: truncate(item.school, 48),
    ...(resumeData.education.length > limits.education && index === list.length - 1
      ? { _more: resumeData.education.length - limits.education, _field: "education" }
      : {}),
  }));

  const experience = resumeData.experience.slice(0, limits.experience).map((item, index, list) => ({
    ...item,
    role: truncate(item.role, 48),
    company: truncate(item.company, 42),
    description: truncateLines(item.description, limits.experience < 4 ? 2 : 3),
    ...(resumeData.experience.length > limits.experience && index === list.length - 1
      ? { _more: resumeData.experience.length - limits.experience, _field: "experience" }
      : {}),
  }));

  const projects = resumeData.projects.slice(0, limits.projects).map((item, index, list) => ({
    ...item,
    name: truncate(item.name, 40),
    description: truncate(item.description, MAX_LENGTH.projectDescription),
    technologies: item.technologies
      .slice(0, limits.projects < 3 ? 3 : 4)
      .map((tech) => truncate(tech, MAX_LENGTH.technology)),
    ...(resumeData.projects.length > limits.projects && index === list.length - 1
      ? { _more: resumeData.projects.length - limits.projects, _field: "projects" }
      : {}),
  }));

  return {
    ...resumeData,
    role: truncate(resumeData.role, MAX_LENGTH.role),
    address: truncate(resumeData.address, MAX_LENGTH.address),
    summary: truncate(resumeData.summary || resumeData.careerObjective || "", MAX_LENGTH.summary),
    careerObjective: truncate(
      resumeData.careerObjective || resumeData.summary || "",
      MAX_LENGTH.summary
    ),
    education,
    experience,
    projects,
    skills: fitSimpleList(resumeData.skills, limits.skills, MAX_LENGTH.skill),
    certifications: resumeData.certifications,
    languages: resumeData.languages,
    strengths: resumeData.strengths || [],
    hobbies: resumeData.hobbies || [],
    achievements: resumeData.achievements || [],
    references: (resumeData.references || []).slice(0, limits.references),
    customSections: resumeData.customSections || [],
    socialLinks: resumeData.socialLinks,
  };
};
