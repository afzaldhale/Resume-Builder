import { LazyTemplateRenderer } from "./TemplateRegistry";
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
    <div
      id="resume-preview"
      className="bg-white w-[794px] min-h-[1123px] mx-auto"
    >
      <LazyTemplateRenderer templateId={selectedTemplate} data={resumeData} />
    </div>
  );
}
