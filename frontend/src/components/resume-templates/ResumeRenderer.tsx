import { useMemo } from "react";
import { LazyTemplateRenderer } from "./TemplateRegistry";
import type { ResumeData } from "./types";
import { fitResumeData } from "@/utils/fitResumeData";

export type ResumeRenderMode = "preview" | "pdf";

interface ResumeRendererProps {
  data: ResumeData;
  templateId: number;
  mode: ResumeRenderMode;
  onReady?: () => void;
}

const ResumeRenderer = ({
  data,
  templateId,
  mode,
  onReady,
}: ResumeRendererProps) => {
  const preparedData = useMemo(() => fitResumeData(data), [data]);

  return (
    <div
      className="resume-renderer"
      data-render-mode={mode}
      data-template-id={templateId}
    >
      <LazyTemplateRenderer
        templateId={templateId}
        data={preparedData}
        onReady={onReady}
      />
    </div>
  );
};

export default ResumeRenderer;
