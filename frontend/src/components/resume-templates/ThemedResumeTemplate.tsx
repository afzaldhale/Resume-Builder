import type { ResumeData } from "./types";
import templateMap from "@/utils/templateMap";

interface ThemedResumeTemplateProps {
  templateId: number;
  data: ResumeData;
}

const ThemedResumeTemplate = ({ templateId, data }: ThemedResumeTemplateProps) => {
  const key = `T${templateId}`;
  const TemplateComponent = templateMap[key];
  if (!TemplateComponent) {
    // fallback to empty render to avoid crashing during PDF generation
    return null;
  }

  return <TemplateComponent data={data} />;
};

export default ThemedResumeTemplate;
