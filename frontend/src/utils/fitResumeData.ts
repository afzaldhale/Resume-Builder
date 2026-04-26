import type { ResumeData } from "@/components/resume-templates/types";

const MAX_ENTRIES = {
  education: 3,
  experience: 3,
  projects: 3,
  certifications: 4,
  languages: 5,
  skills: 16,
  references: 3,
};

const MAX_LENGTH = {
  summary: 520,
  role: 64,
  address: 72,
  skill: 24,
  technology: 22,
  heading: 64,
  line: 88,
  projectDescription: 220,
  customDescription: 180,
};

const truncate = (value = "", max = 120) => {
  if (!value || value.length <= max) return value.trim();
  return `${value.slice(0, max - 1).trim()}...`;
};

const truncateParagraphs = (value = "", maxLines = 5, maxLineLength = MAX_LENGTH.line) => {
  const lines = value
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => truncate(line.replace(/\s+/g, " ").trim(), maxLineLength))
    .filter(Boolean);

  const limitedLines = lines.slice(0, maxLines);
  if (lines.length > maxLines && limitedLines.length > 0) {
    limitedLines[limitedLines.length - 1] = `${limitedLines[limitedLines.length - 1]} (+${lines.length - maxLines} more)`;
  }

  return limitedLines.join("\n");
};

export const fitResumeData = (resumeData: ResumeData): ResumeData => {
  const education = resumeData.education.slice(0, MAX_ENTRIES.education).map((item) => ({
    ...item,
    degree: truncate(item.degree, MAX_LENGTH.heading),
    school: truncate(item.school, 52),
  }));

  const experience = resumeData.experience.slice(0, MAX_ENTRIES.experience).map((item) => ({
    ...item,
    role: truncate(item.role, MAX_LENGTH.heading),
    company: truncate(item.company, 42),
    description: truncateParagraphs(item.description, 5),
  }));

  const projects = resumeData.projects.slice(0, MAX_ENTRIES.projects).map((item) => ({
    ...item,
    name: truncate(item.name, 46),
    description: truncateParagraphs(item.description, 4, 78),
    technologies: item.technologies
      .slice(0, 5)
      .map((tech) => truncate(tech, MAX_LENGTH.technology)),
  }));

  const skills = resumeData.skills
    .slice(0, MAX_ENTRIES.skills)
    .map((skill) => truncate(skill, MAX_LENGTH.skill));

  return {
    ...resumeData,
    role: truncate(resumeData.role, MAX_LENGTH.role),
    address: truncate(resumeData.address, MAX_LENGTH.address),
    summary: truncateParagraphs(resumeData.summary || "", 6, 96),
    careerObjective: truncateParagraphs(resumeData.careerObjective || "", 6, 96),
    education,
    experience,
    projects,
    skills,
    certifications: resumeData.certifications.slice(0, MAX_ENTRIES.certifications),
    languages: resumeData.languages.slice(0, MAX_ENTRIES.languages),
    socialLinks: resumeData.socialLinks.slice(0, 4),
    strengths: (resumeData.strengths || []).slice(0, 5).map((item) => truncate(item, 44)),
    hobbies: (resumeData.hobbies || []).slice(0, 5).map((item) => truncate(item, 44)),
    references: (resumeData.references || [])
      .slice(0, MAX_ENTRIES.references)
      .map((item) => truncate(item, 84)),
    customSections: (resumeData.customSections || []).slice(0, 2).map((section) => ({
      ...section,
      title: truncate(section.title, 32),
      description: truncateParagraphs(section.description || "", 4, 76),
      items: (section.items || []).slice(0, 4).map((item) => truncate(item, 52)),
    })),
  };
};
