import type { ResumeData } from "./types";
import { getResumeSectionOrder, isFresherResume } from "./resumeSections";

export type ResumeMode = "fresher" | "experienced";
export type DensityMode = "comfortable" | "compact" | "ultra-compact";

export const FRESHER_SECTION_PRIORITY = getResumeSectionOrder("fresher");

export const EXPERIENCED_SECTION_PRIORITY = [
  "header",
  "summary",
  "experience",
  "skills",
  "projects",
  "education",
  "certifications",
  "achievements",
  "languages",
  "references",
  "custom",
  "strengths",
  "hobbies",
] as const;

export const resolveResumeMode = (data: ResumeData): ResumeMode =>
  isFresherResume(data) ? "fresher" : "experienced";

const getContentScore = (data: ResumeData) => {
  return (
    ((data.summary || data.careerObjective || "").length || 0) / 120 +
    ((data.role || "").length || 0) / 40 +
    ((data.address || "").length || 0) / 60 +
    (data.experience?.length || 0) * 1.5 +
    (data.projects?.length || 0) * 1.2 +
    (data.education?.length || 0) * 0.9 +
    (data.skills?.length || 0) * 0.35 +
    (data.certifications?.length || 0) * 0.7 +
    (data.languages?.length || 0) * 0.4 +
    (data.strengths?.length || 0) * 0.35 +
    (data.hobbies?.length || 0) * 0.25 +
    (data.achievements?.length || 0) * 0.6 +
    (data.references?.length || 0) * 0.75 +
    (data.customSections?.length || 0) * 1.1 +
    (data.socialLinks?.length || 0) * 0.25
  );
};

export const getDensityMode = (data: ResumeData): DensityMode => {
  const mode = resolveResumeMode(data);
  const score = getContentScore(data);

  if (mode === "fresher") {
    if (score >= 18) return "compact";
    if (score >= 11) return "compact";
    return "comfortable";
  }

  if (score >= 18) return "ultra-compact";
  if (score >= 11) return "compact";
  return "comfortable";
};

export const getSummaryConfig = (data: ResumeData) => {
  const mode = resolveResumeMode(data);
  const summaryTitle = mode === "fresher" ? "Career Objective" : "Professional Summary";
  const summaryText =
    mode === "fresher"
      ? data.careerObjective || data.summary || ""
      : data.summary || data.careerObjective || "";

  return {
    mode,
    isFresher: mode === "fresher",
    summaryTitle,
    summaryText,
    sectionPriority:
      mode === "fresher" ? [...FRESHER_SECTION_PRIORITY] : [...EXPERIENCED_SECTION_PRIORITY],
  };
};

export const getCompactMode = (data: ResumeData) => getDensityMode(data) !== "comfortable";
