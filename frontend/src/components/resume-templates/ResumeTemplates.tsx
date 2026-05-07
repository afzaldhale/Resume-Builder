import ResumeDocument from "./ResumeDocument";
import { ResumeData } from "./types";

interface Props {
  selectedTemplate: number;
  resumeData: ResumeData;
}

export default function ResumePreview({
  selectedTemplate,
  resumeData,
}: Props) {
  return (
    <ResumeDocument templateId={selectedTemplate} data={resumeData} />
  );
}
