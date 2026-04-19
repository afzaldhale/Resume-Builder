import { ResumeData } from "./types";
import ResumeRenderer from "./ResumeRenderer";

interface Props {
  selectedTemplate: number;
  resumeData: ResumeData;
}

export default function ResumePreview({
  selectedTemplate,
  resumeData,
}: Props) {
  return (
    <div id="resume-preview" className="mx-auto">
      <ResumeRenderer
        templateId={selectedTemplate}
        data={resumeData}
        mode="preview"
      />
    </div>
  );
}
