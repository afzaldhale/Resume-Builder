const MAX_ENTRIES = {
  education: 3,
  experience: 4,
  projects: 3,
  certifications: 3,
  languages: 4,
  skills: 12,
};

const MAX_LENGTH = {
  summary: 320,
  role: 60,
  address: 80,
  skill: 24,
  technology: 22,
  line: 95,
  projectDescription: 170,
};

const truncate = (value = "", max = 120) => {
  if (!value || value.length <= max) return value;
  return `${value.slice(0, max - 1).trim()}…`;
};

const truncateLines = (value = "", maxLines = 3, maxLineLength = MAX_LENGTH.line) => {
  const lines = value
    .split("\n")
    .map((line) => truncate(line.trim(), maxLineLength))
    .filter(Boolean);

  const limitedLines = lines.slice(0, maxLines);

  if (lines.length > maxLines) {
    limitedLines[limitedLines.length - 1] = `${limitedLines[limitedLines.length - 1]} (+${lines.length - maxLines} more)`;
  }

  return limitedLines.join("\n");
};

const appendMoreIndicator = (items, omittedCount, field, formatter) => {
  if (omittedCount <= 0 || items.length === 0) return items;

  const next = [...items];
  next[next.length - 1] = formatter(next[next.length - 1], omittedCount, field);
  return next;
};

export const fitResumeData = (resumeData = {}) => {
  const education = [...(resumeData.education || [])]
    .slice(0, MAX_ENTRIES.education)
    .map((item) => ({
      ...item,
      degree: truncate(item.degree, 60),
      school: truncate(item.school, 48),
    }));

  const experienceBase = [...(resumeData.experience || [])]
    .slice(0, MAX_ENTRIES.experience)
    .map((item) => ({
      ...item,
      role: truncate(item.role, 48),
      company: truncate(item.company, 42),
      description: truncateLines(item.description, 3),
    }));

  const projectsBase = [...(resumeData.projects || [])]
    .slice(0, MAX_ENTRIES.projects)
    .map((item) => ({
      ...item,
      name: truncate(item.name, 40),
      description: truncate(item.description, MAX_LENGTH.projectDescription),
      technologies: (item.technologies || [])
        .slice(0, 4)
        .map((tech) => truncate(tech, MAX_LENGTH.technology)),
    }));

  const educationOmitted = Math.max(
    0,
    (resumeData.education || []).length - education.length
  );
  const experienceOmitted = Math.max(
    0,
    (resumeData.experience || []).length - experienceBase.length
  );
  const projectsOmitted = Math.max(
    0,
    (resumeData.projects || []).length - projectsBase.length
  );

  const experience = appendMoreIndicator(
    experienceBase,
    experienceOmitted,
    "experience",
    (item, omitted) => ({
      ...item,
      description: `${item.description}\nAdditional experience available (+${omitted} more).`,
    })
  );

  const projects = appendMoreIndicator(
    projectsBase,
    projectsOmitted,
    "projects",
    (item, omitted) => ({
      ...item,
      description: `${item.description} (+${omitted} more projects)`,
    })
  );

  const skills = (resumeData.skills || [])
    .slice(0, MAX_ENTRIES.skills)
    .map((skill) => truncate(skill, MAX_LENGTH.skill));

  if ((resumeData.skills || []).length > MAX_ENTRIES.skills) {
    skills[skills.length - 1] = `${skills[skills.length - 1]} (+${
      resumeData.skills.length - MAX_ENTRIES.skills
    } more)`;
  }

  const certifications = [...(resumeData.certifications || [])]
    .slice(0, MAX_ENTRIES.certifications)
    .map((item) => ({
      ...item,
      name: truncate(item.name, 40),
      issuer: truncate(item.issuer, 24),
    }));

  const languages = [...(resumeData.languages || [])].slice(
    0,
    MAX_ENTRIES.languages
  );

  const nextEducation =
    educationOmitted > 0 && education.length > 0
      ? appendMoreIndicator(education, educationOmitted, "education", (item, omitted) => ({
          ...item,
          school: `${item.school} (+${omitted} more)`,
        }))
      : education;

  return {
    ...resumeData,
    role: truncate(resumeData.role, MAX_LENGTH.role),
    address: truncate(resumeData.address, MAX_LENGTH.address),
    summary: truncate(resumeData.summary || resumeData.careerObjective, MAX_LENGTH.summary),
    careerObjective: truncate(
      resumeData.careerObjective || resumeData.summary,
      MAX_LENGTH.summary
    ),
    education: nextEducation,
    experience,
    projects,
    skills,
    certifications,
    languages,
    socialLinks: [...(resumeData.socialLinks || [])].slice(0, 3),
  };
};
