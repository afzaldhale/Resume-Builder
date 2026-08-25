import { useEffect, useRef, useState } from "react";
import ResumeDocument from "./ResumeDocument";
import { convertToTemplateData, generateSampleData } from "@/types/resumeDataConverter";

const PAGE_WIDTH_PX = 794;
const DEFAULT_SCALE = 0.36;

const samplePreview = generateSampleData("fresher");
const sampleResumeData = convertToTemplateData(
  samplePreview.formData,
  samplePreview.languages,
  samplePreview.certifications,
  samplePreview.socialLinks,
  "fresher"
);

interface TemplateThumbnailProps {
  templateId: number;
  compact?: boolean;
}

const TemplateThumbnail = ({ templateId, compact = false }: TemplateThumbnailProps) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(DEFAULT_SCALE);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateScale = () => {
      const availableWidth = viewport.clientWidth;
      const nextScale = Math.max(0.1, availableWidth / PAGE_WIDTH_PX);
      setScale((currentScale) =>
        Math.abs(currentScale - nextScale) < 0.001 ? currentScale : nextScale
      );
    };

    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(viewport);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      ref={viewportRef}
      className={`template-thumbnail-viewport ${compact ? "template-thumbnail-viewport-compact" : ""}`.trim()}
      aria-hidden="true"
    >
      <div
        className="template-thumbnail-canvas"
        style={{
          width: `${PAGE_WIDTH_PX * scale}px`,
          ["--thumbnail-scale" as string]: scale,
        }}
      >
        <div className="template-thumbnail-document">
          <ResumeDocument templateId={templateId} data={sampleResumeData} renderMode="thumbnail" />
        </div>
      </div>
    </div>
  );
};

export default TemplateThumbnail;
