import type { ResumeData } from "./types";
import { renderTemplate } from "./shared";
import { templateThemes } from "./templateThemes";

interface ThemedResumeTemplateProps {
  templateId: number;
  data: ResumeData;
}

const ThemedResumeTemplate = ({ templateId, data }: ThemedResumeTemplateProps) =>
  renderTemplate(data, templateThemes[templateId] || templateThemes[1]);

export default ThemedResumeTemplate;
