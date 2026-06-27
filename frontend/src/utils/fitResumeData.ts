import type { ResumeData } from "@/components/resume-templates/types";

export type FitRenderMode = "editor-preview" | "pdf" | "thumbnail";

interface FitResumeDataOptions {
  renderMode?: FitRenderMode;
  compactLevel?: number;
}

/**
 * Phase 11: Preserve all user content. Remove truncation, slicing,
 * and any "(+N more)" markers. Pagination is handled by the renderer.
 */
export const fitResumeData = (
  resumeData: ResumeData,
  _options: FitResumeDataOptions = {}
): ResumeData => {
  const normalizeList = (value?: string[] | string | null) =>
    Array.isArray(value)
      ? [...value]
      : typeof value === "string"
      ? value
          .split(/\r?\n|,/)
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

  return {
    ...resumeData,
    summary: resumeData.summary || "",
    careerObjective: resumeData.careerObjective || "",
    education: Array.isArray(resumeData.education) ? [...resumeData.education] : [],
    experience: Array.isArray(resumeData.experience) ? [...resumeData.experience] : [],
    skills: Array.isArray(resumeData.skills) ? [...resumeData.skills] : [],
    projects: Array.isArray(resumeData.projects) ? [...resumeData.projects] : [],
    certifications: Array.isArray(resumeData.certifications) ? [...resumeData.certifications] : [],
    languages: Array.isArray(resumeData.languages) ? [...resumeData.languages] : [],
    strengths: normalizeList(resumeData.strengths),
    hobbies: normalizeList(resumeData.hobbies),
    achievements: Array.isArray(resumeData.achievements) ? [...resumeData.achievements] : [],
    references: Array.isArray(resumeData.references) ? [...resumeData.references] : [],
    customSections: Array.isArray(resumeData.customSections) ? [...resumeData.customSections] : [],
    socialLinks: Array.isArray(resumeData.socialLinks) ? [...resumeData.socialLinks] : [],
    theme: resumeData.theme,
    compactLevel: _options.compactLevel ?? 0,
  } as ResumeData;
};
