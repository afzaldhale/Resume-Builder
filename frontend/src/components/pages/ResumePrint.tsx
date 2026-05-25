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

  useEffect(() => {
    document.body.classList.add("resume-print-mode");
    document.documentElement.classList.add("resume-pdf-mode");
    if (renderMode === "pdf") {
      document.documentElement.classList.add("pdf-render-mode");
    }
    document.documentElement.classList.remove("resume-print-ready");
    document.documentElement.removeAttribute("data-resume-print-ready");
    window.__RESUME_PRINT_READY__ = false;

    const applyPayload = () => {
      const nextPayload = window.__RESUME_PRINT_PAYLOAD__;
      if (!nextPayload?.resumeData) {
        return;
      }

      const requestedTemplateId = Number(nextPayload.templateId);
      const safeTemplateId = getSafeTemplateId(requestedTemplateId);

      if (!isValidTemplateId(requestedTemplateId)) {
        console.warn(
          `[resume-print] Invalid template ID "${nextPayload.templateId}" received. Falling back to template ${safeTemplateId}.`
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
  }, [renderMode]);

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

      document.documentElement.classList.add("resume-print-ready");
      document.documentElement.setAttribute("data-resume-print-ready", "true");
      window.__RESUME_PRINT_READY__ = true;
    };

    markReady();
  }, [payload]);

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
