import type { ResumeData } from "./types";
import { renderTemplate } from "./shared";
import { resolveTemplateTheme } from "./themeConfig";

interface ThemedResumeTemplateProps {
  templateId: number;
  data: ResumeData;
}

const ThemedResumeTemplate = ({ templateId, data }: ThemedResumeTemplateProps) =>
  renderTemplate(data, resolveTemplateTheme(templateId, data));

export default ThemedResumeTemplate;
