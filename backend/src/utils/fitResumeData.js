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

const getContentScore = (resumeData = {}) => {
  const textScore =
    (resumeData.summary || resumeData.careerObjective || "").length / 120 +
    (resumeData.role || "").length / 40 +
    (resumeData.address || "").length / 60;

  const listScore =
    (resumeData.education?.length || 0) * 0.9 +
    (resumeData.experience?.length || 0) * 1.5 +
    (resumeData.projects?.length || 0) * 1.2 +
    (resumeData.certifications?.length || 0) * 0.7 +
    (resumeData.languages?.length || 0) * 0.5 +
    (resumeData.skills?.length || 0) * 0.25 +
    (resumeData.strengths?.length || 0) * 0.35 +
    (resumeData.hobbies?.length || 0) * 0.25 +
    (resumeData.achievements?.length || 0) * 0.6 +
    (resumeData.references?.length || 0) * 0.7 +
    (resumeData.customSections?.length || 0) * 1.2 +
    (resumeData.socialLinks?.length || 0) * 0.25;

  return textScore + listScore;
};

const getDensityLevel = (resumeData, templateId) => {
  const contentScore = getContentScore(resumeData);
  const tightTemplate = new Set([4, 5, 6, 8, 9, 10, 11, 12, 13, 15]).has(templateId);

  if (contentScore > (tightTemplate ? 18 : 20)) return "tight";
  if (contentScore > (tightTemplate ? 13 : 15)) return "balanced";
  return "open";
};

const buildEntryLimits = (densityLevel) => {
  const limits = { ...BASE_MAX_ENTRIES };

  if (densityLevel === "balanced") {
    limits.experience = 3;
    limits.projects = 2;
    limits.skills = 10;
    limits.strengths = 5;
    limits.hobbies = 4;
    limits.achievements = 3;
    limits.customSections = 1;
  }

  if (densityLevel === "tight") {
    limits.education = 2;
    limits.experience = 2;
    limits.projects = 2;
    limits.certifications = 2;
    limits.languages = 3;
    limits.skills = 7;
    limits.strengths = 4;
    limits.hobbies = 3;
    limits.achievements = 2;
    limits.references = 1;
    limits.customSections = 1;
    limits.socialLinks = 2;
  }

  return limits;
};

const fitArray = (arr, max, formatter, field) => {
  if (!Array.isArray(arr)) return [];

  const items = arr.slice(0, max).map(formatter);
  if (arr.length > max && items.length > 0) {
    items[items.length - 1] = {
      ...items[items.length - 1],
      _more: arr.length - max,
      _field: field,
    };
  }

  return items;
};

const fitSimpleList = (arr, max, maxLength) => {
  if (!Array.isArray(arr)) return [];

  const items = arr.slice(0, max).map((item) => truncate(String(item || ""), maxLength));
  if (arr.length > max && items.length > 0) {
    items[items.length - 1] = `${items[items.length - 1]} (+${arr.length - max} more)`;
  }

  return items;
};

export const fitResumeData = (resumeData = {}, options = {}) => {
  const templateId = Number(options.templateId || 0);
  const densityLevel = getDensityLevel(resumeData, templateId);
  const limits = buildEntryLimits(densityLevel);

  const education = fitArray(
    resumeData.education,
    limits.education,
    (item) => ({
      ...item,
      degree: truncate(item.degree, 60),
      school: truncate(item.school, 48),
    }),
    "education"
  );

  const experience = fitArray(
    resumeData.experience,
    limits.experience,
    (item) => ({
      ...item,
      role: truncate(item.role, 48),
      company: truncate(item.company, 42),
      description: truncateLines(item.description, densityLevel === "tight" ? 2 : 3),
    }),
    "experience"
  );

  const projects = fitArray(
    resumeData.projects,
    limits.projects,
    (item) => ({
      ...item,
      name: truncate(item.name, 40),
      description: truncate(item.description, MAX_LENGTH.projectDescription),
      technologies: (item.technologies || [])
        .slice(0, densityLevel === "tight" ? 3 : 4)
        .map((tech) => truncate(tech, MAX_LENGTH.technology)),
    }),
    "projects"
  );

  const certifications = fitArray(
    resumeData.certifications,
    limits.certifications,
    (item) => ({
      ...item,
      name: truncate(item.name, 40),
      issuer: truncate(item.issuer, 24),
    }),
    "certifications"
  );

  const achievements = fitArray(
    resumeData.achievements,
    limits.achievements,
    (item) =>
      typeof item === "string"
        ? truncate(item, MAX_LENGTH.achievement)
        : {
            ...item,
            title: truncate(item.title || item.name, 48),
            description: truncate(item.description, MAX_LENGTH.achievement),
          },
    "achievements"
  );

  const references = fitArray(
    resumeData.references,
    limits.references,
    (item) =>
      typeof item === "string"
        ? truncate(item, MAX_LENGTH.reference)
        : {
            ...item,
            name: truncate(item.name, 40),
            designation: truncate(item.designation || item.role, 32),
            company: truncate(item.company || item.organization, 32),
          },
    "references"
  );

  const customSections = fitArray(
    resumeData.customSections,
    limits.customSections,
    (item) => ({
      ...item,
      title: truncate(item.title, 36),
      content: truncate(item.content || item.description, MAX_LENGTH.customSection),
      description: truncate(item.description || item.content, MAX_LENGTH.customSection),
      items: fitSimpleList(item.items, densityLevel === "tight" ? 2 : 3, 48),
    }),
    "customSections"
  );

  return {
    ...resumeData,
    role: truncate(resumeData.role, MAX_LENGTH.role),
    address: truncate(resumeData.address, MAX_LENGTH.address),
    summary: truncate(resumeData.summary || resumeData.careerObjective, MAX_LENGTH.summary),
    careerObjective: truncate(
      resumeData.careerObjective || resumeData.summary,
      MAX_LENGTH.summary
    ),
    candidateType:
      resumeData.candidateType ||
      ((resumeData.experience || []).length === 0 ? "fresher" : "experienced"),
    education,
    experience,
    projects,
    skills: fitSimpleList(resumeData.skills, limits.skills, MAX_LENGTH.skill),
    certifications,
    languages: fitArray(
      resumeData.languages,
      limits.languages,
      (item) =>
        typeof item === "string"
          ? item
          : {
              ...item,
              language: truncate(item.language, 24),
              level: truncate(item.level, 18),
            },
      "languages"
    ),
    strengths: fitSimpleList(resumeData.strengths, limits.strengths, MAX_LENGTH.skill),
    hobbies: fitSimpleList(resumeData.hobbies, limits.hobbies, MAX_LENGTH.hobby),
    achievements,
    references,
    customSections,
    socialLinks: fitArray(
      resumeData.socialLinks,
      limits.socialLinks,
      (item) => ({
        ...item,
        platform: truncate(item.platform, 18),
        url: truncate(item.url, 50),
      }),
      "socialLinks"
    ),
    _fitMeta: {
      densityLevel,
      limits,
      truncated: {
        education: Math.max(0, (resumeData.education?.length || 0) - education.length),
        experience: Math.max(0, (resumeData.experience?.length || 0) - experience.length),
        projects: Math.max(0, (resumeData.projects?.length || 0) - projects.length),
      },
    },
  };
};
