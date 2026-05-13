import type { ResumeData } from "./types";
import { getResumeSectionOrder, isFresherResume } from "./resumeSections";

export type ResumeMode = "fresher" | "experienced";

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

export const getCompactMode = (data: ResumeData) => {
  const mode = resolveResumeMode(data);

  if (mode === "fresher") {
    return true;
  }

  const contentScore =
    (data.experience?.length || 0) * 2 +
    (data.projects?.length || 0) * 1.5 +
    (data.education?.length || 0) +
    (data.skills?.length || 0) * 0.25 +
    (data.certifications?.length || 0) * 0.5 +
    (data.languages?.length || 0) * 0.35;

  return contentScore >= 11;
};
