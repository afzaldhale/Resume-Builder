import { useLayoutEffect, useRef, useState } from "react";
import { fitResumeData } from "@/utils/fitResumeData";
import type { ResumeData } from "./types";
import { getCompactMode, resolveResumeMode } from "./templatePolicy";
import {
  A4_HEIGHT_PX,
  A4_WIDTH_PX,
  getSafeTemplateId,
  getTemplateComponent,
} from "./TemplateRegistry";

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

export const ResumeDocument = ({
  templateId,
  data,
  scale = 1,
  className = "",
  fitToOnePage = true,
}: ResumeDocumentProps) => {
  const safeTemplateId = getSafeTemplateId(templateId);
  const TemplateComponent = getTemplateComponent(safeTemplateId);
  const fittedData = fitResumeData(normalizeResumeData(data));
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

    const measure = () => {
      const page = contentRef.current;
      if (!page) {
        return;
      }

      const currentScale = effectiveScale || 1;
      const pageRect = page.getBoundingClientRect();
      const descendants = page.querySelectorAll("*");
      let contentBottom = Math.max(pageRect.height / currentScale, A4_HEIGHT_PX);

      descendants.forEach((node) => {
        const element = node as HTMLElement;
        const style = window.getComputedStyle(element);

        if (style.display === "none" || style.visibility === "hidden" || style.position === "fixed") {
          return;
        }

        const rect = element.getBoundingClientRect();
        if (!rect.width && !rect.height) {
          return;
        }

        const marginBottom = Number.parseFloat(style.marginBottom || "0") || 0;
        const scaledBottom = rect.bottom - pageRect.top + marginBottom;
        const naturalBottom = scaledBottom / currentScale;

        if (naturalBottom > contentBottom) {
          contentBottom = naturalBottom;
        }
      });

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

    const resizeObserver = new ResizeObserver(() => measure());
    resizeObserver.observe(contentRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [effectiveScale, fitToOnePage, fittedData]);

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
        <TemplateComponent data={fittedData} />
      </div>
    </div>
  );
};

export default ResumeDocument;
