import { memo, useLayoutEffect, useMemo, useRef, useState } from "react";
import { fitResumeData } from "@/utils/fitResumeData";
import type { ResumeData } from "./types";
import { getCompactMode, resolveResumeMode } from "./templatePolicy";
import { A4_HEIGHT_PX, A4_WIDTH_PX, getSafeTemplateId } from "./TemplateRegistry";
import ThemedResumeTemplate from "./ThemedResumeTemplate";

interface ResumeDocumentProps {
  templateId: number;
  data: ResumeData;
  scale?: number;
  className?: string;
  fitToOnePage?: boolean;
}

const normalizeResumeData = (data: ResumeData): ResumeData => ({
  ...data,
  fullName: data.fullName || "",
  email: data.email || "",
  phone: data.phone || "",
  role: data.role || "",
  address: data.address || "",
  summary: data.summary || "",
  careerObjective: data.careerObjective || "",
  education: Array.isArray(data.education) ? data.education : [],
  experience: Array.isArray(data.experience) ? data.experience : [],
  skills: Array.isArray(data.skills) ? data.skills : [],
  projects: Array.isArray(data.projects) ? data.projects : [],
  languages: Array.isArray(data.languages) ? data.languages : [],
  certifications: Array.isArray(data.certifications) ? data.certifications : [],
  socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
  strengths: Array.isArray(data.strengths) ? data.strengths : [],
  hobbies: Array.isArray(data.hobbies) ? data.hobbies : [],
  references: Array.isArray(data.references) ? data.references : [],
  customSections: Array.isArray(data.customSections) ? data.customSections : [],
  candidateType:
    data.candidateType ||
    ((Array.isArray(data.experience) ? data.experience : []).length === 0
      ? "fresher"
      : "experienced"),
});

const ResumeDocumentComponent = ({
  templateId,
  data,
  scale = 1,
  className = "",
  fitToOnePage = true,
}: ResumeDocumentProps) => {
  const safeTemplateId = getSafeTemplateId(templateId);
  const fittedData = useMemo(
    () => fitResumeData(normalizeResumeData(data)),
    [data]
  );
  const resumeMode = resolveResumeMode(fittedData);
  const compactMode = getCompactMode(fittedData);
  const contentRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);
  const effectiveScale = scale * fitScale;

  useLayoutEffect(() => {
    if (!fitToOnePage || !contentRef.current) {
      setFitScale(1);
      return;
    }

    let frameId = 0;
    const measure = () => {
      const page = contentRef.current;
      if (!page) {
        return;
      }

      const contentBottom = Math.max(
        page.scrollHeight,
        page.offsetHeight,
        page.clientHeight,
        A4_HEIGHT_PX
      );

      const nextFitScale =
        contentBottom > A4_HEIGHT_PX
          ? Math.max(
              compactMode && resumeMode === "fresher" ? 0.74 : 0.76,
              Math.min(1, A4_HEIGHT_PX / contentBottom)
            )
          : 1;

      setFitScale((prev) => (Math.abs(prev - nextFitScale) > 0.005 ? nextFitScale : prev));
    };

    measure();

    if (document.fonts?.ready) {
      document.fonts.ready.then(measure);
    }

    const resizeObserver = new ResizeObserver(() => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(measure);
    });
    resizeObserver.observe(contentRef.current);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, [fitToOnePage, compactMode, resumeMode, effectiveScale, fittedData]);

  return (
    <div
      className={`resume-document-shell ${className}`.trim()}
      data-template-id={safeTemplateId}
      data-resume-mode={resumeMode}
      data-compact-mode={compactMode ? "true" : "false"}
      data-fit-scale={fitScale.toFixed(4)}
      style={{
        width: `${A4_WIDTH_PX * effectiveScale}px`,
        minHeight: `${A4_HEIGHT_PX * effectiveScale}px`,
      }}
    >
      <div
        ref={contentRef}
        className="resume-document-scale"
        style={{
          width: `${A4_WIDTH_PX}px`,
          minHeight: `${A4_HEIGHT_PX}px`,
          transform: `scale(${effectiveScale})`,
          transformOrigin: "top left",
        }}
      >
        <ThemedResumeTemplate templateId={safeTemplateId} data={fittedData} />
      </div>
    </div>
  );
};

export const ResumeDocument = memo(ResumeDocumentComponent);

export default ResumeDocument;
