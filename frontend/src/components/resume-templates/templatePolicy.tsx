import type { ResumeData } from "./types";

export type ResumeMode = "fresher" | "experienced";

export const FRESHER_SECTION_PRIORITY = [
  "personalDetails",
  "careerObjective",
  "education",
  "skills",
  "strengths",
  "projects",
  "certifications",
  "achievements",
  "languages",
  "hobbies",
  "contactDetails",
  "socialLinks",
  "customSections",
] as const;

export const EXPERIENCED_SECTION_PRIORITY = [
  "personalDetails",
  "professionalSummary",
  "workExperience",
  "skills",
  "projects",
  "education",
  "certifications",
  "achievements",
  "languages",
  "contactDetails",
  "socialLinks",
  "customSections",
  "strengths",
  "hobbies",
] as const;

export const resolveResumeMode = (data: ResumeData): ResumeMode => {
  if (data.candidateType === "fresher" || data.candidateType === "experienced") {
    return data.candidateType;
  }

  if ((data.careerObjective || "").trim().length > 0) {
    return "fresher";
  }

  if ((data.strengths?.length || 0) > 0 || (data.hobbies?.length || 0) > 0) {
    return "fresher";
  }

  return (data.experience?.length || 0) > 0 ? "experienced" : "fresher";
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
