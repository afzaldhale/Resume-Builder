import type { ResumeData } from "@/components/resume-templates/types";

const MAX_ENTRIES = {
  education: 3,
  experience: 3,
  projects: 3,
  certifications: 3,
  languages: 5,
  skills: 10,
};

const MAX_LENGTH = {
  summary: 250,
  role: 50,
  address: 70,
  skill: 22,
  technology: 20,
  line: 80,
  projectDescription: 120,
};

const truncate = (value = "", max = 120) => {
  if (!value || value.length <= max) return value;
  return `${value.slice(0, Math.max(0, max - 3)).trim()}...`;
};

const truncateLines = (value = "", maxLines = 3, maxLineLength = MAX_LENGTH.line) => {
  const lines = value
    .split("\n")
    .map((line) => truncate(line.trim(), maxLineLength))
    .filter(Boolean);

  const limitedLines = lines.slice(0, maxLines);

  if (lines.length > maxLines && limitedLines.length > 0) {
    limitedLines[limitedLines.length - 1] = `${limitedLines[limitedLines.length - 1]} (+${lines.length - maxLines} more)`;
  }

  return limitedLines.join("\n");
};

const getDensityProfile = (resumeData: ResumeData) => {
  const sectionCount =
    resumeData.education.length +
    resumeData.experience.length +
    resumeData.projects.length +
    resumeData.certifications.length +
    resumeData.languages.length +
    resumeData.socialLinks.length +
    (resumeData.skills.length > 0 ? Math.ceil(resumeData.skills.length / 2) : 0) +
    (resumeData.customSections?.length || 0) +
    (resumeData.references?.length || 0);

  const textWeight =
    (resumeData.summary?.length || 0) +
    (resumeData.careerObjective?.length || 0) +
    resumeData.experience.reduce((total, item) => total + item.description.length, 0) +
    resumeData.projects.reduce((total, item) => total + item.description.length, 0);

  if (sectionCount >= 22 || textWeight >= 850) {
    return {
      maxExperience: 2,
      maxProjects: 2,
      maxSkills: 8,
      maxLanguages: 4,
      maxCertifications: 2,
      maxSummary: 180,
      maxDescriptionLines: 2,
      maxProjectDescription: 90,
      maxCustomSections: 1,
      maxReferences: 2,
    };
  }

  if (sectionCount >= 17 || textWeight >= 650) {
    return {
      maxExperience: 3,
      maxProjects: 2,
      maxSkills: 9,
      maxLanguages: 4,
      maxCertifications: 3,
      maxSummary: 210,
      maxDescriptionLines: 2,
      maxProjectDescription: 105,
      maxCustomSections: 2,
      maxReferences: 2,
    };
  }

  return {
    maxExperience: MAX_ENTRIES.experience,
    maxProjects: MAX_ENTRIES.projects,
    maxSkills: MAX_ENTRIES.skills,
    maxLanguages: MAX_ENTRIES.languages,
    maxCertifications: MAX_ENTRIES.certifications,
    maxSummary: MAX_LENGTH.summary,
    maxDescriptionLines: 3,
    maxProjectDescription: MAX_LENGTH.projectDescription,
    maxCustomSections: 2,
    maxReferences: 3,
  };
};

export const fitResumeData = (resumeData: ResumeData): ResumeData => {
  const density = getDensityProfile(resumeData);

  const education = resumeData.education.slice(0, MAX_ENTRIES.education).map((item) => ({
    ...item,
    degree: truncate(item.degree, 60),
    school: truncate(item.school, 48),
  }));

  const experience = resumeData.experience.slice(0, density.maxExperience).map((item) => ({
    ...item,
    role: truncate(item.role, 48),
    company: truncate(item.company, 42),
    description: truncateLines(item.description, density.maxDescriptionLines),
  }));

  const projects = resumeData.projects.slice(0, density.maxProjects).map((item) => ({
    ...item,
    name: truncate(item.name, 40),
    description: truncate(item.description, density.maxProjectDescription),
    technologies: item.technologies.slice(0, 4).map((tech) => truncate(tech, MAX_LENGTH.technology)),
  }));

  const skills = resumeData.skills
    .slice(0, density.maxSkills)
    .map((skill) => truncate(skill, MAX_LENGTH.skill));

  if (resumeData.skills.length > density.maxSkills && skills.length > 0) {
    skills[skills.length - 1] = `${skills[skills.length - 1]} (+${resumeData.skills.length - density.maxSkills} more)`;
  }

  return {
    ...resumeData,
    role: truncate(resumeData.role, MAX_LENGTH.role),
    address: truncate(resumeData.address, MAX_LENGTH.address),
    summary: truncate(resumeData.summary || "", density.maxSummary),
    careerObjective: truncate(resumeData.careerObjective || "", density.maxSummary),
    education,
    experience,
    projects,
    skills,
    certifications: resumeData.certifications.slice(0, density.maxCertifications).map((item) => ({
      ...item,
      name: truncate(item.name, 42),
      issuer: truncate(item.issuer, 30),
      credentialId: truncate(item.credentialId || "", 24),
    })),
    languages: resumeData.languages.slice(0, density.maxLanguages),
    socialLinks: resumeData.socialLinks.slice(0, 3),
    references: resumeData.references?.slice(0, density.maxReferences).map((item) => truncate(item, 60)),
    customSections: resumeData.customSections?.slice(0, density.maxCustomSections).map((item) => ({
      ...item,
      title: truncate(item.title, 28),
      description: truncate(item.description || "", 110),
      items: item.items?.slice(0, 3).map((entry) => truncate(entry, 55)),
      date: truncate(item.date || "", 22),
    })),
    hobbies: (resumeData.hobbies || []).slice(0, 4).map((item) => truncate(item, 26)),
    strengths: (resumeData.strengths || []).slice(0, 4).map((item) => truncate(item, 26)),
    candidateType: resumeData.candidateType || "experienced",
  };
};
