import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "@/api/axios";
import ResumeRenderer from "@/components/resume-templates/ResumeRenderer";
import type { ResumeData } from "@/components/resume-templates/types";

const A4_WIDTH = 794;
const A4_HEIGHT = 1123;
const MIN_SCALE = 0.85;
const MAX_SCALE = 1;
const SCALE_THRESHOLD = 0.85;

interface ResumeRenderResponse {
  resume: {
    id: number;
    title: string;
    template_id?: number;
    templateId?: number;
    resume_data?: ResumeData;
    resumeData?: ResumeData;
  };
}

const ResumePDF = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const [searchParams] = useSearchParams();
  const pdfToken = searchParams.get("pdfToken");

  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [templateId, setTemplateId] = useState<number>(1);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [rendererMounted, setRendererMounted] = useState(false);
  const [contentScale, setContentScale] = useState(1);
  const [isCompact, setIsCompact] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const setResumeWindowState = (nextState: {
    ready?: boolean;
    error?: string | null;
  }) => {
    const pdfWindow = window as Window & {
      __RESUME_READY__?: boolean;
      __RESUME_ERROR__?: string | null;
      __RESUME_METRICS__?: Record<string, number | boolean | string> | null;
    };

    if (typeof nextState.ready === "boolean") {
      pdfWindow.__RESUME_READY__ = nextState.ready;
    }

    if ("error" in nextState) {
      pdfWindow.__RESUME_ERROR__ = nextState.error ?? null;
    }
  };

  useEffect(() => {
    const loadResume = async () => {
      if (!resumeId) {
        setResumeWindowState({
          ready: false,
          error: "Missing resume id",
        });
        setStatus("error");
        return;
      }

      try {
        const endpoint = pdfToken
          ? `/api/resumes/${resumeId}/render-data?pdfToken=${encodeURIComponent(pdfToken)}`
          : `/api/resumes/${resumeId}`;

        const response = await api.get<ResumeRenderResponse>(endpoint);

        const resume = response.data.resume;
        const nextTemplateId = Number(resume.template_id ?? resume.templateId ?? 1);
        const nextResumeData = (resume.resume_data ?? resume.resumeData) as ResumeData;

        // Defensive: ensure data is valid before proceeding
        if (!nextResumeData || Object.keys(nextResumeData).length === 0) {
          console.error("Invalid resume data: empty or missing");
          setResumeWindowState({
            ready: false,
            error: "Resume data is empty or missing",
          });
          setStatus("error");
          return;
        }

        console.log("Resume data loaded successfully:", {
          templateId: nextTemplateId,
          hasFullName: !!nextResumeData.fullName,
          hasHobbies: !!(nextResumeData.hobbies && nextResumeData.hobbies.length > 0),
          hasStrengths: !!(nextResumeData.strengths && nextResumeData.strengths.length > 0),
          hasSummary: !!nextResumeData.summary,
          hasCareerObjective: !!nextResumeData.careerObjective,
          candidateType: nextResumeData.candidateType,
        });

        setRendererMounted(false);
        setContentScale(1);
        setIsCompact(false);
        setTemplateId(nextTemplateId);
        setResumeData(nextResumeData);
        setResumeWindowState({
          ready: false,
          error: null,
        });
        (window as Window & { __RESUME_METRICS__?: Record<string, number | boolean | string> | null }).__RESUME_METRICS__ = null;
        setStatus("ready");
      } catch (error) {
        console.error("Failed to load resume for PDF rendering:", JSON.stringify(error, null, 2));
        const message =
          error instanceof Error ? error.message : "Failed to load resume data";
        setResumeWindowState({
          ready: false,
          error: message,
        });
        setStatus("error");
      }
    };

    loadResume();
  }, [pdfToken, resumeId]);

  const bodyClassName = useMemo(
    () => (status === "ready" ? "resume-pdf-body is-ready" : "resume-pdf-body"),
    [status]
  );

  useEffect(() => {
    document.body.className = bodyClassName;
    setResumeWindowState({
      ready: false,
      error: null,
    });
    (window as Window & { __RESUME_METRICS__?: Record<string, number | boolean | string> | null }).__RESUME_METRICS__ = null;

    return () => {
      document.body.className = "";
      setResumeWindowState({
        ready: false,
        error: null,
      });
      (window as Window & { __RESUME_METRICS__?: Record<string, number | boolean | string> | null }).__RESUME_METRICS__ = null;
    };
  }, [bodyClassName]);

  useEffect(() => {
    if (status !== "ready" || !resumeData || !rendererMounted) {
      return;
    }

    const calculateScale = (contentHeight: number) => {
      if (contentHeight <= A4_HEIGHT) {
        return 1; // Expand mode
      } else {
        const scale = A4_HEIGHT / contentHeight;
        return scale < MIN_SCALE ? MIN_SCALE : scale; // Scale mode with minimum scale
      }
    };

    const getRenderedBounds = (root: HTMLElement) => {
      const rootRect = root.getBoundingClientRect();
      const elements = [root, ...Array.from(root.querySelectorAll("*"))] as HTMLElement[];

      let minLeft = rootRect.left;
      let maxRight = rootRect.right;
      let minTop = rootRect.top;
      let maxBottom = rootRect.bottom;

      for (const element of elements) {
        const rect = element.getBoundingClientRect();

        if (rect.width === 0 && rect.height === 0) {
          continue;
        }

        minLeft = Math.min(minLeft, rect.left);
        maxRight = Math.max(maxRight, rect.right);
        minTop = Math.min(minTop, rect.top);
        maxBottom = Math.max(maxBottom, rect.bottom);
      }

      return {
        width: Math.ceil(maxRight - minLeft),
        height: Math.ceil(maxBottom - minTop),
      };
    };

    const measureAndScale = () => {
      const content = contentRef.current;

      if (!content) {
        return;
      }

      // Reset all transforms and classes first
      content.style.transform = "scale(1)";
      content.style.width = `${A4_WIDTH}px`;
      content.classList.remove("resume-pdf-content--compact");
      content.classList.remove("resume-pdf-content--expanded");

      const rendererRoot = content.querySelector(".resume-renderer") as HTMLElement | null;

      if (!rendererRoot) {
        return;
      }

      // Get content dimensions
      const naturalBounds = getRenderedBounds(rendererRoot);
      const contentWidth = Math.max(naturalBounds.width, 1);
      const contentHeight = Math.max(naturalBounds.height, 1);

      // Calculate scales
      const widthScale = A4_WIDTH / contentWidth;
      const heightScale = A4_HEIGHT / contentHeight;

      let finalScale = 1;
      let mode: "none" | "expand" | "scale" = "none";

      // STEP 3: SMART DECISION LOGIC
      if (contentHeight <= A4_HEIGHT) {
        // CASE 1: Content fits within A4 height - EXPAND to fill space
        // NO scaling needed - content will stretch to fill via CSS
        mode = "expand";
        finalScale = 1;
        content.classList.add("resume-pdf-content--expanded");
      } else {
        // CASE 2: Content exceeds A4 height - need to scale
        // Use the smaller scale to fit both dimensions
        finalScale = Math.min(widthScale, heightScale);
        
        // STEP 6: PAGINATION MODE - if scale is too small, allow page 2
        if (finalScale < SCALE_THRESHOLD) {
          // Content is too large - use minimum scale but allow overflow
          finalScale = Math.max(finalScale, MIN_SCALE);
          mode = "scale";
        } else {
          mode = "scale";
        }
        
        content.classList.add("resume-pdf-content--compact");
      }

      // Apply the scale
      if (mode === "scale" && finalScale < 1) {
        // STEP 5: SCALE MODE - increase width proportionally
        content.style.width = `${Math.round(A4_WIDTH / finalScale)}px`;
        content.style.transform = `scale(${finalScale})`;
      }
      // mode === "expand" or "none" - no width change, content fits at A4 width

      const rect = content.getBoundingClientRect();
      const metrics = {
        templateId,
        contentWidth,
        contentHeight,
        finalScale: Number(finalScale.toFixed(4)),
        mode,
        scaleHeight: Number((A4_HEIGHT / contentHeight).toFixed(4)),
        scaleWidth: Number((A4_WIDTH / contentWidth).toFixed(4)),
        scrollHeight: content.scrollHeight,
        scrollWidth: content.scrollWidth,
        renderedWidth: Number(rect.width.toFixed(2)),
        renderedHeight: Number(rect.height.toFixed(2)),
        shouldCompact: mode === "scale",
        shouldExpand: mode === "expand",
      };

      (
        window as Window & {
          __RESUME_METRICS__?: Record<string, number | boolean | string> | null;
        }
      ).__RESUME_METRICS__ = metrics;

      console.log("RESUME_METRICS", JSON.stringify(metrics));

      setIsCompact(mode === "scale");
      setContentScale(finalScale);
    };

    const firstFrame = requestAnimationFrame(() => {
      requestAnimationFrame(measureAndScale);
    });

    return () => window.cancelAnimationFrame(firstFrame);
  }, [rendererMounted, resumeData, status, templateId]);

  useEffect(() => {
    if (status !== "ready" || !resumeData || !rendererMounted) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      setResumeWindowState({
        ready: true,
        error: null,
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [contentScale, isCompact, rendererMounted, resumeData, status]);

  return (
    <main className="resume-pdf-root">
      <div className="resume-pdf-page page">
        <div id="resume-ready">
          {status === "loading" && (
            <div className="resume-pdf-status">Preparing resume...</div>
          )}

          {status === "error" && (
            <div className="resume-pdf-status">
              Unable to render this resume.
            </div>
          )}

          {status === "ready" && resumeData && (
            <div id="resume-container">
              <div
                id="resume-content"
                ref={contentRef}
                className={isCompact ? "resume-pdf-content resume-pdf-content--compact" : "resume-pdf-content"}
                style={{
                  // Width is set by measureAndScale function
                  width: `${A4_WIDTH}px`,
                  transform: contentScale < 1 ? `scale(${contentScale})` : undefined,
                  transformOrigin: "top left",
                }}
              >
                <ResumeRenderer
                  data={resumeData}
                  templateId={templateId}
                  mode="pdf"
                  onReady={() => setRendererMounted(true)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ResumePDF;
