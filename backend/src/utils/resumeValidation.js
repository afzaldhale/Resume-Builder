const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const isArray = (value) => Array.isArray(value);

export const validateResumePayload = ({ title, resumeData, templateId }) => {
  const errors = [];

  if (!isNonEmptyString(title)) {
    errors.push("title is required");
  }

  if (!Number.isFinite(Number(templateId))) {
    errors.push("templateId must be a valid number");
  }

  if (!resumeData || typeof resumeData !== "object") {
    errors.push("resumeData is required");
    return errors;
  }

  if (!isNonEmptyString(resumeData.fullName)) {
    errors.push("resumeData.fullName is required");
  }

  if (!isNonEmptyString(resumeData.email)) {
    errors.push("resumeData.email is required");
  }

  if (!isArray(resumeData.education)) {
    errors.push("resumeData.education must be an array");
  }

  if (!isArray(resumeData.experience)) {
    errors.push("resumeData.experience must be an array");
  }

  if (!isArray(resumeData.skills)) {
    errors.push("resumeData.skills must be an array");
  }

  if (!isArray(resumeData.projects)) {
    errors.push("resumeData.projects must be an array");
  }

  if (!isArray(resumeData.languages)) {
    errors.push("resumeData.languages must be an array");
  }

  if (!isArray(resumeData.certifications)) {
    errors.push("resumeData.certifications must be an array");
  }

  if (!isArray(resumeData.socialLinks)) {
    errors.push("resumeData.socialLinks must be an array");
  }

  return errors;
};
