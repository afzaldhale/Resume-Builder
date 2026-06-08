// Phase 11: preserve all user content server-side as well.
const BASE_MAX_ENTRIES = {
  education: Infinity,
  experience: Infinity,
  projects: Infinity,
  certifications: Infinity,
  languages: Infinity,
  skills: Infinity,
  strengths: Infinity,
  hobbies: Infinity,
  achievements: Infinity,
  references: Infinity,
  customSections: Infinity,
  socialLinks: Infinity,
};

const MAX_LENGTH = {
  // permissive fallbacks only — do not truncate user content.
  summary: 10000,
  role: 1024,
  address: 1024,
  skill: 1024,
  technology: 1024,
  line: 10000,
  projectDescription: 10000,
  achievement: 10000,
  hobby: 10000,
  reference: 10000,
  customSection: 10000,
};

const truncate = (value = "", max = 10000) => {
  if (!value) return value;
  if (value.length <= max) return value;
  return value;
};

const truncateLines = (value = "") => {
  if (!value) return "";
  return String(value);
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

const getDensityLevel = () => "open";
const buildEntryLimits = () => ({ ...BASE_MAX_ENTRIES });

const fitArray = (arr, _max, formatter) => {
  if (!Array.isArray(arr)) return [];
  return arr.map((item) => formatter(item));
};

const fitSimpleList = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr.map((item) => String(item || ""));
};

export const fitResumeData = (resumeData = {}, options = {}) => {
  // Preserve full arrays and fields
  const education = Array.isArray(resumeData.education) ? resumeData.education.map((item) => ({ ...item })) : [];
  const experience = Array.isArray(resumeData.experience)
    ? resumeData.experience.map((item) => ({ ...item }))
    : [];
  const projects = Array.isArray(resumeData.projects) ? resumeData.projects.map((item) => ({ ...item })) : [];
  const certifications = Array.isArray(resumeData.certifications)
    ? resumeData.certifications.map((item) => ({ ...item }))
    : [];
  const achievements = Array.isArray(resumeData.achievements) ? resumeData.achievements.map((a) => a) : [];
  const references = Array.isArray(resumeData.references) ? resumeData.references.map((r) => ({ ...r })) : [];
  const customSections = Array.isArray(resumeData.customSections)
    ? resumeData.customSections.map((s) => ({ ...s }))
    : [];

  return {
    ...resumeData,
    role: resumeData.role || "",
    address: resumeData.address || "",
    summary: resumeData.summary || resumeData.careerObjective || "",
    careerObjective: resumeData.careerObjective || resumeData.summary || "",
    candidateType:
      resumeData.candidateType ||
      ((resumeData.experience || []).length === 0 ? "fresher" : "experienced"),
    education,
    experience,
    projects,
    skills: Array.isArray(resumeData.skills) ? resumeData.skills.map((s) => s) : [],
    certifications,
    languages: Array.isArray(resumeData.languages) ? resumeData.languages.map((l) => l) : [],
    strengths: Array.isArray(resumeData.strengths) ? resumeData.strengths.map((s) => s) : [],
    hobbies: Array.isArray(resumeData.hobbies) ? resumeData.hobbies.map((h) => h) : [],
    achievements,
    references,
    customSections,
    socialLinks: Array.isArray(resumeData.socialLinks) ? resumeData.socialLinks.map((s) => s) : [],
    _fitMeta: {
      densityLevel: "open",
      limits: {},
      truncated: {
        education: 0,
        experience: 0,
        projects: 0,
      },
    },
  };
};
