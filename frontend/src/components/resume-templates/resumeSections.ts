import type {
  CertificationItem,
  EducationItem,
  ExperienceItem,
  ResumeData,
} from "./types";

export type ResumeMode = "fresher" | "experienced";

export type ResumeSectionKey =
  | "header"
  | "summary"
  | "skills"
  | "experience"
  | "education"
  | "certifications"
  | "languages"
  | "strengths"
  | "hobbies"
  | "projects"
  | "achievements"
  | "references"
  | "custom";

export const FRESHER_SECTION_ORDER: ResumeSectionKey[] = [
  "header",
  "summary",
  "skills",
  "experience",
  "education",
  "certifications",
  "languages",
  "strengths",
  "hobbies",
];

export const EXPERIENCED_SECTION_ORDER: ResumeSectionKey[] = [
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
];

const MONTH_INDEX: Record<string, string> = {
  jan: "01",
  january: "01",
  feb: "02",
  february: "02",
  mar: "03",
  march: "03",
  apr: "04",
  april: "04",
  may: "05",
  jun: "06",
  june: "06",
  jul: "07",
  july: "07",
  aug: "08",
  august: "08",
  sep: "09",
  sept: "09",
  september: "09",
  oct: "10",
  october: "10",
  nov: "11",
  november: "11",
  dec: "12",
  december: "12",
};

const hasText = (value?: string | null) => Boolean(value && value.trim());

const normalizeDateToken = (value?: string | null) => (value || "").trim();

const getComparableMonthValue = (value?: string | null) => {
  const rawValue = normalizeDateToken(value);
  if (!rawValue) return Number.NEGATIVE_INFINITY;

  if (/^(present|current|now)$/i.test(rawValue)) {
    return Number.POSITIVE_INFINITY;
  }

  const mmYyyyMatch = rawValue.match(/^(\d{1,2})[-/](\d{4})$/);
  if (mmYyyyMatch) {
    const month = Number.parseInt(mmYyyyMatch[1], 10);
    const year = Number.parseInt(mmYyyyMatch[2], 10);
    if (month >= 1 && month <= 12) {
      return year * 100 + month;
    }
  }

  const yyyyMmMatch = rawValue.match(/^(\d{4})[-/](\d{1,2})(?:[-/]\d{1,2})?$/);
  if (yyyyMmMatch) {
    const year = Number.parseInt(yyyyMmMatch[1], 10);
    const month = Number.parseInt(yyyyMmMatch[2], 10);
    if (month >= 1 && month <= 12) {
      return year * 100 + month;
    }
  }

  const monthNameMatch = rawValue.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (monthNameMatch) {
    const month = MONTH_INDEX[monthNameMatch[1].toLowerCase()];
    if (month) {
      return Number.parseInt(monthNameMatch[2], 10) * 100 + Number.parseInt(month, 10);
    }
  }

  const yearMatch = rawValue.match(/^(\d{4})$/);
  if (yearMatch) {
    return Number.parseInt(yearMatch[1], 10) * 100 + 1;
  }

  const parsed = new Date(rawValue);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.getFullYear() * 100 + (parsed.getMonth() + 1);
  }

  return Number.NEGATIVE_INFINITY;
};

const getDateSortScore = (startDate?: string, endDate?: string) => {
  const endScore = getComparableMonthValue(endDate);
  if (Number.isFinite(endScore)) {
    return endScore;
  }

  return getComparableMonthValue(startDate);
};

export const formatMonthYear = (value?: string | null) => {
  const rawValue = normalizeDateToken(value);
  if (!rawValue) return "";

  if (/^(present|current|now)$/i.test(rawValue)) {
    return "Present";
  }

  const mmYyyyMatch = rawValue.match(/^(\d{1,2})[-/](\d{4})$/);
  if (mmYyyyMatch) {
    return `${mmYyyyMatch[1].padStart(2, "0")}-${mmYyyyMatch[2]}`;
  }

  const yyyyMmMatch = rawValue.match(/^(\d{4})[-/](\d{1,2})(?:[-/]\d{1,2})?$/);
  if (yyyyMmMatch) {
    return `${yyyyMmMatch[2].padStart(2, "0")}-${yyyyMmMatch[1]}`;
  }

  const monthNameMatch = rawValue.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (monthNameMatch) {
    const month = MONTH_INDEX[monthNameMatch[1].toLowerCase()];
    if (month) {
      return `${month}-${monthNameMatch[2]}`;
    }
  }

  const parsed = new Date(rawValue);
  if (!Number.isNaN(parsed.getTime())) {
    return `${`${parsed.getMonth() + 1}`.padStart(2, "0")}-${parsed.getFullYear()}`;
  }

  return rawValue;
};

export const isFresherResume = (resumeData: ResumeData) => {
  if (resumeData.candidateType === "fresher") {
    return true;
  }

  if (resumeData.candidateType === "experienced") {
    return false;
  }

  if ((resumeData.experience || []).length === 0) {
    return true;
  }

  if (hasText(resumeData.careerObjective)) {
    return true;
  }

  if ((resumeData.strengths || []).length > 0 || (resumeData.hobbies || []).length > 0) {
    return true;
  }

  return false;
};

export const getResumeSectionOrder = (
  resumeOrCandidateType: ResumeData | ResumeMode
): ResumeSectionKey[] => {
  const mode =
    typeof resumeOrCandidateType === "string"
      ? resumeOrCandidateType
      : isFresherResume(resumeOrCandidateType)
      ? "fresher"
      : "experienced";

  return mode === "fresher"
    ? [...FRESHER_SECTION_ORDER]
    : [...EXPERIENCED_SECTION_ORDER];
};

export const sortExperienceReverseChronological = (experience: ExperienceItem[] = []) =>
  [...experience].sort((left, right) => {
    const difference =
      getDateSortScore(right.startDate, right.endDate) -
      getDateSortScore(left.startDate, left.endDate);

    return difference !== 0 ? difference : 0;
  });

export const sortEducationReverseChronological = (education: EducationItem[] = []) =>
  [...education].sort((left, right) => {
    const difference =
      getDateSortScore(right.startYear, right.endYear) -
      getDateSortScore(left.startYear, left.endYear);

    return difference !== 0 ? difference : 0;
  });

export const sortCertificationsReverseChronological = (
  certifications: CertificationItem[] = []
) =>
  [...certifications].sort((left, right) => {
    const difference = getComparableMonthValue(right.year) - getComparableMonthValue(left.year);
    return difference !== 0 ? difference : 0;
  });

export const hasSectionData = (sectionKey: ResumeSectionKey, resumeData: ResumeData) => {
  switch (sectionKey) {
    case "header":
      return Boolean(
        hasText(resumeData.fullName) ||
          hasText(resumeData.email) ||
          hasText(resumeData.phone) ||
          hasText(resumeData.address) ||
          hasText(resumeData.role) ||
          (resumeData.socialLinks || []).length > 0
      );
    case "summary":
      return Boolean(hasText(resumeData.careerObjective) || hasText(resumeData.summary));
    case "skills":
      return (resumeData.skills || []).length > 0;
    case "experience":
      return isFresherResume(resumeData) || (resumeData.experience || []).length > 0;
    case "education":
      return (resumeData.education || []).length > 0;
    case "certifications":
      return (resumeData.certifications || []).length > 0;
    case "languages":
      return (resumeData.languages || []).length > 0;
    case "strengths":
      return (resumeData.strengths || []).length > 0;
    case "hobbies":
      return (resumeData.hobbies || []).length > 0;
    case "projects":
      return (resumeData.projects || []).length > 0;
    case "achievements":
      return (resumeData.achievements || []).length > 0;
    case "references":
      return (resumeData.references || []).length > 0;
    case "custom":
      return (resumeData.customSections || []).some(
        (section) =>
          hasText(section.title) &&
          (hasText(section.description) ||
            hasText(section.date) ||
            (section.items || []).length > 0)
      );
    default:
      return false;
  }
};
