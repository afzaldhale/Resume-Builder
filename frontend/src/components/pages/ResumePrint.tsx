import { useEffect, useMemo, useState } from "react";
import ResumeDocument from "@/components/resume-templates/ResumeDocument";
import type { ResumeData } from "@/components/resume-templates/types";
import {
  getSafeTemplateId,
  isValidTemplateId,
} from "@/components/resume-templates/TemplateRegistry";
import { useSearchParams } from "react-router-dom";

declare global {
  interface Window {
    __RESUME_PRINT_PAYLOAD__?: {
      templateId?: number;
      resumeData?: ResumeData;
    };
    __RESUME_PRINT_READY__?: boolean;
    __RESUME_PRINT_DEBUG__?: boolean;
  }
}

interface PrintPayload {
  templateId: number;
  resumeData: ResumeData;
}

const ResumePrint = () => {
  const [searchParams] = useSearchParams();
  const [payload, setPayload] = useState<PrintPayload | null>(null);
  const renderMode = useMemo(
    () => (searchParams.get("mode") === "pdf" ? "pdf" : "preview"),
    [searchParams]
  );
  const debugMode = useMemo(() => searchParams.get("debug") === "1", [searchParams]);

  useEffect(() => {
    document.body.classList.add("resume-print-mode");
    document.documentElement.classList.add("resume-pdf-mode");
    if (renderMode === "pdf") {
      document.documentElement.classList.add("pdf-render-mode");
    }
    document.documentElement.classList.remove("resume-print-ready");
    document.documentElement.removeAttribute("data-resume-print-ready");
    window.__RESUME_PRINT_READY__ = false;
    window.__RESUME_PRINT_DEBUG__ = debugMode;

    const parseTemplateId = (rawTemplateId: unknown) => {
      if (typeof rawTemplateId === "number") return rawTemplateId;
      if (typeof rawTemplateId === "string") {
        const numeric = Number(rawTemplateId);
        if (Number.isInteger(numeric) && numeric > 0) return numeric;

        const match = rawTemplateId.match(/template\s*(\d+)/i);
        if (match) return Number(match[1]);
      }
      return NaN;
    };

    const applyPayload = () => {
      const nextPayload = window.__RESUME_PRINT_PAYLOAD__;
      if (!nextPayload?.resumeData) {
        return;
      }

      const requestedTemplateId = parseTemplateId(nextPayload.templateId);
      const safeTemplateId = getSafeTemplateId(requestedTemplateId);

      if (!isValidTemplateId(requestedTemplateId)) {
        console.warn(
          `[resume-print] Invalid template ID "${nextPayload.templateId}" received. Falling back to template ${safeTemplateId}.`
        );
      }

      if (debugMode) {
        console.log(
          "[pdf-debug][stage-2][resume-print-payload]",
          JSON.stringify({
            templateId: safeTemplateId,
            educationLength: nextPayload.resumeData.education?.length ?? 0,
            certificationsLength: nextPayload.resumeData.certifications?.length ?? 0,
            projectsLength: nextPayload.resumeData.projects?.length ?? 0,
            skillsLength: nextPayload.resumeData.skills?.length ?? 0,
            experienceLength: nextPayload.resumeData.experience?.length ?? 0,
            education: nextPayload.resumeData.education ?? [],
          })
        );
      }

      setPayload({
        templateId: safeTemplateId,
        resumeData: nextPayload.resumeData,
      });
    };

    applyPayload();
    window.addEventListener("resume-print-payload", applyPayload);

    return () => {
      document.body.classList.remove("resume-print-mode");
      document.documentElement.classList.remove("resume-pdf-mode");
      document.documentElement.classList.remove("pdf-render-mode");
      window.removeEventListener("resume-print-payload", applyPayload);
    };
  }, [debugMode, renderMode]);

  useEffect(() => {
    if (!payload) {
      return;
    }

    document.documentElement.classList.remove("resume-print-ready");
    document.documentElement.removeAttribute("data-resume-print-ready");
    window.__RESUME_PRINT_READY__ = false;

    const markReady = async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      await new Promise((resolve) => window.requestAnimationFrame(() => resolve(undefined)));
      await new Promise((resolve) => window.requestAnimationFrame(() => resolve(undefined)));

      if (debugMode) {
        const sectionSelector = ".resume-main-section, .resume-section";
        const sectionTitles = Array.from(document.querySelectorAll<HTMLElement>(sectionSelector)).map(
          (section) => ({
            title:
              section.querySelector<HTMLElement>(".resume-section-title")?.textContent?.trim() ||
              "(untitled)",
            height: section.offsetHeight,
            top: section.offsetTop,
          })
        );

        console.log(
          "[pdf-debug][stage-8][resume-print-ready-snapshot]",
          JSON.stringify({
            sectionCount: sectionTitles.length,
            sectionTitles,
            pageCount: document.querySelectorAll(".resume-page").length,
          })
        );
      }

      document.documentElement.classList.add("resume-print-ready");
      document.documentElement.setAttribute("data-resume-print-ready", "true");
      window.__RESUME_PRINT_READY__ = true;
    };

    markReady();
  }, [debugMode, payload]);

  if (!payload) {
    return <div className="resume-print-loading">Preparing resume...</div>;
  }

  return (
    <main className="resume-print-root">
      <ResumeDocument templateId={payload.templateId} data={payload.resumeData} renderMode="pdf" />
    </main>
  );
};

export default ResumePrint;
