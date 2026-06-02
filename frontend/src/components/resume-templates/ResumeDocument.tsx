import { memo, useLayoutEffect, useMemo, useRef, useState } from "react";
import { fitResumeData, type FitRenderMode } from "@/utils/fitResumeData";
import type { ResumeData } from "./types";
import { getCompactMode, resolveResumeMode } from "./templatePolicy";
import { A4_HEIGHT_PX, A4_WIDTH_PX } from "@/constants/resumeDesignSystem";
import { getSafeTemplateId } from "@/components/resume-templates/TemplateRegistry";
import ThemedResumeTemplate from "./ThemedResumeTemplate";

const ResumeDocumentStyles = () => (
  <style>{`
    .resume-document-shell {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .resume-document-shell h1,
    .resume-document-shell h2,
    .resume-document-shell h3,
    .resume-document-shell h4 {
      margin: 0 0 0.35em;
      line-height: 1.2;
    }

    .resume-document-shell p,
    .resume-document-shell li,
    .resume-document-shell dt,
    .resume-document-shell dd {
      line-height: 1.35;
    }

    .resume-document-shell ul,
    .resume-document-shell ol {
      margin: 0 0 0.75em 1.15em;
      padding-left: 1.15em;
    }

    .resume-document-shell a {
      color: inherit;
      text-decoration: underline;
    }

    .resume-document-shell[data-render-mode="pdf"] [class*="shadow-"] {
      box-shadow: none !important;
    }
  `}</style>
);

interface ResumeDocumentProps {
  templateId: number;
  data: ResumeData;
  className?: string;
  renderMode?: FitRenderMode;
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
  theme: data.theme,
});

const ResumeDocumentComponent = ({
  templateId,
  data,
  className = "",
  renderMode = "editor-preview",
}: ResumeDocumentProps) => {
  const safeTemplateId = getSafeTemplateId(templateId);
  const [compactLevel, setCompactLevel] = useState(0);
  const [measurements, setMeasurements] = useState({
    initialScrollHeight: 0,
    finalScrollHeight: 0,
    initialOverflow: false,
    finalOverflow: false,
  });
  const documentRef = useRef<HTMLDivElement | null>(null);
  const normalizedData = useMemo(() => normalizeResumeData(data), [data]);
  const fittedData = useMemo(
    () => fitResumeData(normalizedData, { renderMode, compactLevel }),
    [normalizedData, renderMode, compactLevel]
  );
  const resumeMode = resolveResumeMode(fittedData);
  const compactMode = renderMode === "pdf" ? getCompactMode(fittedData) : false;

  useLayoutEffect(() => {
    setCompactLevel(0);
    setMeasurements({
      initialScrollHeight: 0,
      finalScrollHeight: 0,
      initialOverflow: false,
      finalOverflow: false,
    });
  }, [normalizedData, renderMode]);

  useLayoutEffect(() => {
    if (renderMode !== "pdf") {
      return;
    }

    const pageElement = documentRef.current?.querySelector<HTMLElement>(".resume-theme-root");
    if (!pageElement) {
      return;
    }

    const scrollHeight = pageElement.scrollHeight;
    const overflow = scrollHeight > A4_HEIGHT_PX + 1;

    setMeasurements((previous) => ({
      initialScrollHeight:
        previous.initialScrollHeight || scrollHeight,
      finalScrollHeight: scrollHeight,
      initialOverflow:
        previous.initialScrollHeight > 0 ? previous.initialOverflow : overflow,
      finalOverflow: overflow,
    }));

    if (overflow && compactLevel < 10) {
      setCompactLevel((level) => level + 1);
    }
  }, [renderMode, fittedData, compactLevel]);

  return (
    <div
      ref={documentRef}
      className={`resume-document-shell ${className}`.trim()}
      data-template-id={safeTemplateId}
      data-resume-mode={resumeMode}
      data-compact-mode={compactMode ? "true" : "false"}
      data-compact-level={compactLevel}
      data-initial-scroll-height={measurements.initialScrollHeight}
      data-final-scroll-height={measurements.finalScrollHeight}
      data-initial-overflow={measurements.initialOverflow ? "true" : "false"}
      data-final-overflow={measurements.finalOverflow ? "true" : "false"}
      data-render-mode={renderMode}
      style={{
        width: `${A4_WIDTH_PX}px`,
        minHeight: `${A4_HEIGHT_PX}px`,
      }}
    >
      <ResumeDocumentStyles />
      <div className="resume-document-scale" style={{ width: `${A4_WIDTH_PX}px`, minHeight: `${A4_HEIGHT_PX}px` }}>
        <ThemedResumeTemplate templateId={safeTemplateId} data={fittedData} />
      </div>
    </div>
  );
};

export const ResumeDocument = memo(ResumeDocumentComponent);

export default ResumeDocument;
