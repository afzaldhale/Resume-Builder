import { memo, useLayoutEffect, useMemo, useRef, useState } from "react";
import { fitResumeData, type FitRenderMode } from "@/utils/fitResumeData";
import type { ResumeData } from "./types";
import splitTextIntoChunks from "@/utils/splitTextIntoChunks";
import { getCompactMode, resolveResumeMode } from "./templatePolicy";
import { A4_HEIGHT_PX, A4_WIDTH_PX } from "@/constants/resumeDesignSystem";
import { getSafeTemplateId } from "@/components/resume-templates/TemplateRegistry";
import ThemedResumeTemplate from "./ThemedResumeTemplate";

const TEMPLATE_PDF_MARGIN_MM = 12;
const MM_TO_PX = 96 / 25.4;
const TEMPLATE_PDF_MARGIN_PX = Math.round(TEMPLATE_PDF_MARGIN_MM * MM_TO_PX);
const TEMPLATE_PRINTABLE_WIDTH_PX = A4_WIDTH_PX - TEMPLATE_PDF_MARGIN_PX * 2;
const TEMPLATE_PRINTABLE_HEIGHT_PX = A4_HEIGHT_PX - TEMPLATE_PDF_MARGIN_PX * 2;
const TEMPLATE1_CONTINUATION_TOP_OFFSET_PX = 40;
const TEMPLATE2_CONTINUATION_TOP_OFFSET_PX = 0;
const TEMPLATE_WITH_CUSTOM_PDF_MARGIN = new Set([1, 2]);

const ResumeDocumentStyles = ({
  useTemplatePdfMargins,
}: {
  useTemplatePdfMargins: boolean;
}) => (
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
    /* Disable UI truncation helpers when rendering for PDF to preserve all user content */
    .resume-document-shell[data-render-mode="pdf"] .truncate,
    .resume-document-shell[data-render-mode="pdf"] .whitespace-nowrap,
    .resume-document-shell[data-render-mode="pdf"] [class*="line-clamp"],
    .resume-document-shell[data-render-mode="pdf"] [class*="line-clamp"] * {
      overflow: visible !important;
      white-space: normal !important;
      -webkit-line-clamp: unset !important;
      text-overflow: clip !important;
    }

    .resume-page-body-offset {
      padding-top: 88px;
    }

    .resume-document-shell[data-template-id="1"] .resume-page-body-offset {
      padding-top: 104px;
    }

    .resume-document-shell[data-template-id="1"] .resume-page-body-offset-template1 {
      padding-top: ${TEMPLATE1_CONTINUATION_TOP_OFFSET_PX}px;
    }

    .resume-document-shell[data-template-id="2"] .resume-page-body-offset-template2 {
      padding-top: ${TEMPLATE2_CONTINUATION_TOP_OFFSET_PX}px;
    }

    .page {
      width: ${A4_WIDTH_PX}px;
      min-height: ${A4_HEIGHT_PX}px;
      box-sizing: border-box;
      page-break-after: always;
    }

    @page {
      size: A4;
      margin: ${useTemplatePdfMargins ? `${TEMPLATE_PDF_MARGIN_MM}mm` : "0"};
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
  const useTemplatePdfMargins =
    renderMode === "pdf" && TEMPLATE_WITH_CUSTOM_PDF_MARGIN.has(safeTemplateId);
  const pageWidthPx = useTemplatePdfMargins ? TEMPLATE_PRINTABLE_WIDTH_PX : A4_WIDTH_PX;
  const pageHeightPx = useTemplatePdfMargins ? TEMPLATE_PRINTABLE_HEIGHT_PX : A4_HEIGHT_PX;
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
  const splitStateRef = useRef<{ splitDone: boolean }>({ splitDone: false });

  useLayoutEffect(() => {
    setCompactLevel(0);
    setMeasurements({
      initialScrollHeight: 0,
      finalScrollHeight: 0,
      initialOverflow: false,
      finalOverflow: false,
    });
    splitStateRef.current.splitDone = false;
  }, [normalizedData, renderMode]);

  useLayoutEffect(() => {
    if (renderMode !== "pdf") {
      return;
    }

    const pageElement = documentRef.current?.querySelector<HTMLElement>(".resume-theme-root");
    if (!pageElement) {
      return;
    }

    // Pagination-first splitting: measure and split into multiple .page containers.
    // Run once per render change to avoid infinite loops.
    const scrollHeight = pageElement.scrollHeight;
    const overflow = scrollHeight > pageHeightPx + 1;

    setMeasurements((previous) => ({
      initialScrollHeight:
        previous.initialScrollHeight || scrollHeight,
      finalScrollHeight: scrollHeight,
      initialOverflow:
        previous.initialScrollHeight > 0 ? previous.initialOverflow : overflow,
      finalOverflow: overflow,
    }));

    if (!overflow) {
      splitStateRef.current.splitDone = true;
      return;
    }

    if (!splitStateRef.current.splitDone) {
      splitStateRef.current.splitDone = true;
      // Perform DOM-based pagination split. We clone headers and atomic entries so
      // content is never truncated. Sections are treated atomically; where a
      // section contains multiple entry nodes (e.g., experience items), those
      // entries are considered atomic and moved one-by-one.
      const pageRoot = documentRef.current?.querySelector<HTMLElement>(".resume-theme-root");
      const pageParent = pageRoot?.parentElement;
      if (!pageRoot || !pageParent) {
        return;
      }

      const nonStyleChild = Array.from(pageRoot.children).find(
        (child) =>
          child.nodeType === Node.ELEMENT_NODE &&
          child.nodeName !== "STYLE" &&
          child.childElementCount > 0
      ) as HTMLElement | undefined;

      const fallbackChild = Array.from(pageRoot.children).find(
        (child) => child.nodeType === Node.ELEMENT_NODE && child.nodeName !== "STYLE"
      ) as HTMLElement | undefined;

      const contentWrapper =
        pageRoot.querySelector<HTMLElement>(".resume-content") ||
        pageRoot.querySelector<HTMLElement>("[data-resume-content]") ||
        nonStyleChild ||
        fallbackChild ||
        pageRoot;

      const sectionElements = Array.from(
        contentWrapper.querySelectorAll<HTMLElement>(".resume-section")
      );

      const headerElement = contentWrapper.querySelector<HTMLElement>("header");
      const headerNodes: HTMLElement[] = [];
      if (headerElement) {
        headerNodes.push(headerElement);
      }
      

      // pagination instrumentation removed for production

      const pageTemplate = pageRoot.cloneNode(false) as HTMLElement;
      const pageBodyTemplate = contentWrapper.cloneNode(false) as HTMLElement;

      pageParent.innerHTML = "";

      const pages: HTMLElement[] = [];

      const createPageBody = (page: HTMLElement) => {
        const body = pageBodyTemplate.cloneNode(false) as HTMLElement;
        if (pages.length > 1) {
          body.classList.add(
            safeTemplateId === 1
              ? "resume-page-body-offset-template1"
              : safeTemplateId === 2
              ? "resume-page-body-offset-template2"
              : "resume-page-body-offset"
          );
        }
        page.appendChild(body);
        return body;
      };

      const makePage = () => {
        const page = pageTemplate.cloneNode(false) as HTMLElement;
        pageParent.appendChild(page);
        pages.push(page);
        return page;
      };

      let currentPage = makePage();
      let currentPageBody = createPageBody(currentPage);

      const appendToCurrent = (node: Node) => {
        currentPageBody.appendChild(node);
      };

      const moveToNewPage = () => {
        currentPage = makePage();
        currentPageBody = createPageBody(currentPage);
      };

      const cloneHeaderOnly = (node: Node, sectionSource?: HTMLElement) => {
        if (!(node instanceof HTMLElement)) {
          return node.cloneNode(false);
        }

        const sourceSection = node.matches(".resume-section")
          ? node
          : node.closest<HTMLElement>(".resume-section") || sectionSource;

        if (sourceSection) {
          const headerOnly = sourceSection.cloneNode(false) as HTMLElement;
          const title = sourceSection.querySelector<HTMLElement>(".resume-section-title");
          if (title) {
            headerOnly.appendChild(title.cloneNode(true));
          }
          return headerOnly;
        }

        return node.cloneNode(false);
      };

      const isEmptyNode = (wrapper: Node) => {
        if (!(wrapper instanceof HTMLElement)) {
          return false;
        }
        return !Array.from(wrapper.childNodes).some((child) => {
          if (child.nodeType === Node.TEXT_NODE) {
            return Boolean(child.textContent?.trim());
          }
          if (child instanceof HTMLElement) {
            if (child.matches(".resume-section-title")) {
              return false;
            }
            return Boolean(child.textContent?.trim());
          }
          return true;
        });
      };

      const splitLargeNode = (node: Node, sectionSource?: HTMLElement) => {
        const textContent = node.textContent?.trim() || "";
        const hasChildren = (node as HTMLElement).children?.length > 0;

        if (!hasChildren && textContent) {
          currentPageBody = splitTextIntoChunks(
            textContent,
            makePage,
            currentPageBody,
            pageHeightPx
          );
          return;
        }

        const shallow = node.cloneNode(false);
        appendToCurrent(shallow);

        for (const child of Array.from(node.childNodes)) {
          const childClone = child.cloneNode(true);
          const hadBefore = currentPageBody.childNodes.length > 0;
          shallow.appendChild(childClone);

          if (currentPageBody.scrollHeight > pageHeightPx + 2) {
            shallow.removeChild(childClone);
                if (hadBefore) {
              moveToNewPage();
              const nextWrapper = cloneHeaderOnly(node, sectionSource);
              appendToCurrent(nextWrapper);
              currentPageBody = nextWrapper as HTMLElement;
                if (childClone.nodeType === Node.ELEMENT_NODE) {
                  splitLargeNode(
                    childClone,
                    sectionSource || (childClone instanceof HTMLElement && childClone.matches(".resume-section") ? childClone : undefined)
                  );
                } else if (childClone.textContent?.trim()) {
                  currentPageBody = splitTextIntoChunks(
                    childClone.textContent.trim(),
                    makePage,
                    currentPageBody,
                    pageHeightPx
                  );
                } else {
                  appendToCurrent(childClone);
                }
            } else {
              currentPageBody.removeChild(shallow);
              if (childClone.nodeType === Node.ELEMENT_NODE) {
                splitLargeNode(
                  childClone,
                  sectionSource || (childClone instanceof HTMLElement && childClone.matches(".resume-section") ? childClone : undefined)
                );
              } else if (childClone.textContent?.trim()) {
                currentPageBody = splitTextIntoChunks(
                  childClone.textContent.trim(),
                  makePage,
                  currentPageBody,
                  pageHeightPx
                );
              } else {
                appendToCurrent(childClone);
              }
            }
          }
        }
        if (isEmptyNode(shallow)) {
          shallow.parentNode?.removeChild(shallow);
        }
      };

      const appendSection = (sectionEl: Element) => {
        const sectionClone = sectionEl.cloneNode(true);
        const hadContent = currentPageBody.childNodes.length > 0;
        appendToCurrent(sectionClone);

        if (currentPageBody.scrollHeight <= pageHeightPx + 2) {
          return;
        }

        currentPageBody.removeChild(sectionClone);

        if (hadContent) {
          moveToNewPage();
          appendToCurrent(sectionClone);
          if (currentPageBody.scrollHeight <= pageHeightPx + 2) {
            return;
          }
          currentPageBody.removeChild(sectionClone);
        }

        splitLargeNode(sectionClone, sectionClone as HTMLElement);
      };

      const getMeaningfulChildren = (element: HTMLElement) =>
        Array.from(element.children).filter((child) => {
          if (!(child instanceof HTMLElement)) {
            return false;
          }
          return Boolean(child.textContent?.trim()) || child.children.length > 0;
        }) as HTMLElement[];

      const getTemplate1SectionContent = (sectionSource: HTMLElement) =>
        sectionSource.querySelector<HTMLElement>(".resume-section-content");

      const createStructuredSection = (sectionSource: HTMLElement) => {
        const section = sectionSource.cloneNode(false) as HTMLElement;
        const title = sectionSource.querySelector<HTMLElement>(".resume-section-title");
        if (title) {
          section.appendChild(title.cloneNode(true));
        }

        const contentSource = getTemplate1SectionContent(sectionSource);
        const content = contentSource
          ? (contentSource.cloneNode(false) as HTMLElement)
          : document.createElement("div");
        if (!content.classList.contains("resume-section-content")) {
          content.classList.add("resume-section-content");
        }

        section.appendChild(content);
        appendToCurrent(section);

        return { section, content };
      };

      const startStructuredSection = (sectionSource: HTMLElement) => {
        if (currentPageBody.childNodes.length > 0) {
          const minimumSection = sectionSource.cloneNode(false) as HTMLElement;
          const title = sectionSource.querySelector<HTMLElement>(".resume-section-title");
          const contentSource = getTemplate1SectionContent(sectionSource);
          const content = contentSource
            ? (contentSource.cloneNode(false) as HTMLElement)
            : document.createElement("div");

          if (title) {
            minimumSection.appendChild(title.cloneNode(true));
          }

          const directChildren = contentSource ? getMeaningfulChildren(contentSource) : [];
          if (directChildren.length > 0) {
            const firstChild = directChildren[0];
            if (firstChild.matches("ul, ol")) {
              const listClone = firstChild.cloneNode(false) as HTMLElement;
              const firstItem = firstChild.firstElementChild;
              if (firstItem) {
                listClone.appendChild(firstItem.cloneNode(true));
              }
              content.appendChild(listClone);
            } else if (firstChild.children.length > 1 && !firstChild.matches(".resume-summary-box")) {
              const wrapperClone = firstChild.cloneNode(false) as HTMLElement;
              const firstUnit = firstChild.firstElementChild;
              if (firstUnit) {
                wrapperClone.appendChild(firstUnit.cloneNode(true));
              }
              content.appendChild(wrapperClone);
            } else {
              content.appendChild(firstChild.cloneNode(true));
            }
          }

          minimumSection.appendChild(content);
          appendToCurrent(minimumSection);
          const fits = currentPage.scrollHeight <= pageHeightPx + 2;
          currentPageBody.removeChild(minimumSection);

          if (!fits) {
            moveToNewPage();
          }
        }

        return createStructuredSection(sectionSource);
      };

      const appendStructuredMetaBlocks = (sectionSource: HTMLElement) => {
        const contentSource = getTemplate1SectionContent(sectionSource);
        const wrapperSource = contentSource?.firstElementChild as HTMLElement | null;
        if (!contentSource || !wrapperSource) {
          appendSection(sectionSource);
          return;
        }

        let { content } = startStructuredSection(sectionSource);
        let wrapperTarget = wrapperSource.cloneNode(false) as HTMLElement;
        content.appendChild(wrapperTarget);

        for (const block of getMeaningfulChildren(wrapperSource)) {
          const blockClone = block.cloneNode(true);
          wrapperTarget.appendChild(blockClone);

          if (currentPage.scrollHeight <= pageHeightPx + 2) {
            continue;
          }

          wrapperTarget.removeChild(blockClone);
          moveToNewPage();
          ({ content } = createStructuredSection(sectionSource));
          wrapperTarget = wrapperSource.cloneNode(false) as HTMLElement;
          content.appendChild(wrapperTarget);
          wrapperTarget.appendChild(blockClone);

          if (currentPage.scrollHeight > pageHeightPx + 2) {
            wrapperTarget.removeChild(blockClone);
            content.parentElement?.remove();
            appendSection(sectionSource);
            return;
          }
        }
      };

      const appendStructuredListSection = (sectionSource: HTMLElement) => {
        const contentSource = getTemplate1SectionContent(sectionSource);
        const listSource = contentSource?.querySelector<HTMLElement>("ul, ol");
        if (!contentSource || !listSource) {
          appendSection(sectionSource);
          return;
        }

        let { content } = startStructuredSection(sectionSource);
        let listTarget = listSource.cloneNode(false) as HTMLElement;
        content.appendChild(listTarget);

        for (const item of getMeaningfulChildren(listSource)) {
          const itemClone = item.cloneNode(true);
          listTarget.appendChild(itemClone);

          if (currentPage.scrollHeight <= pageHeightPx + 2) {
            continue;
          }

          listTarget.removeChild(itemClone);
          moveToNewPage();
          ({ content } = createStructuredSection(sectionSource));
          listTarget = listSource.cloneNode(false) as HTMLElement;
          content.appendChild(listTarget);
          listTarget.appendChild(itemClone);

          if (currentPage.scrollHeight > pageHeightPx + 2) {
            listTarget.removeChild(itemClone);
            content.parentElement?.remove();
            appendSection(sectionSource);
            return;
          }
        }
      };

      const appendStructuredSimpleSection = (sectionSource: HTMLElement) => {
        const contentSource = getTemplate1SectionContent(sectionSource);
        const directChildren = contentSource ? getMeaningfulChildren(contentSource) : [];
        if (!contentSource || directChildren.length === 0) {
          appendSection(sectionSource);
          return;
        }

        const { content } = startStructuredSection(sectionSource);
        directChildren.forEach((child) => {
          content.appendChild(child.cloneNode(true));
        });

        if (currentPage.scrollHeight <= pageHeightPx + 2) {
          return;
        }

        const section = content.parentElement;
        section?.remove();
        appendSection(sectionSource);
      };

      const appendStructuredSection = (sectionEl: Element) => {
        const sectionSource = sectionEl as HTMLElement;
        const contentSource = getTemplate1SectionContent(sectionSource);
        const directChildren = contentSource ? getMeaningfulChildren(contentSource) : [];
        const firstChild = directChildren[0];

        if (firstChild?.matches("ul, ol")) {
          appendStructuredListSection(sectionSource);
          return;
        }

        if (
          firstChild &&
          firstChild.children.length > 1 &&
          getMeaningfulChildren(firstChild).every((child) => child.classList.contains("resume-meta-block"))
        ) {
          appendStructuredMetaBlocks(sectionSource);
          return;
        }

        appendStructuredSimpleSection(sectionSource);
      };

      headerNodes.forEach((node) => {
        appendToCurrent(node.cloneNode(true));
      });

      sectionElements.forEach((sectionEl) =>
        safeTemplateId === 1 || safeTemplateId === 2
          ? appendStructuredSection(sectionEl)
          : appendSection(sectionEl)
      );

      const pageElements = Array.from(pageParent.querySelectorAll<HTMLElement>(".resume-theme-root.resume-page"));
      pageElements.forEach((page, index) => {
        if (page.scrollHeight > pageHeightPx + 2) {
          console.warn(
            `[resume-pagination] Page ${index + 1} exceeds printable height: ${page.scrollHeight}px > ${pageHeightPx}px`,
            page
          );
        }
      });

      pageElements.forEach((page) => {
        const sections = Array.from(page.querySelectorAll<HTMLElement>(".resume-section"));
        // remove pages that contain no sections (including spacer-only pages)
        if (sections.length === 0) {
          page.remove();
          return;
        }
        if (sections.length !== 1) {
          return;
        }
        const section = sections[0];
        const title = section.querySelector<HTMLElement>(".resume-section-title");
        const textOnly = section.textContent?.trim() || "";
        const titleText = title?.textContent?.trim() || "";
        const bodyText = textOnly.replace(titleText, "").trim();
        const content = section.querySelector<HTMLElement>(".resume-section-content");
        const hasMeaningfulContent = Boolean(bodyText) || Boolean(content?.children.length);
        if (!hasMeaningfulContent) {
          page.remove();
        }
      });

      // post-pagination instrumentation removed for production
    }
  }, [renderMode, fittedData, compactLevel, pageHeightPx, safeTemplateId]);

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
        width: `${pageWidthPx}px`,
        minHeight: `${pageHeightPx}px`,
        ["--resume-page-width" as string]: `${pageWidthPx}px`,
        ["--resume-page-height" as string]: `${pageHeightPx}px`,
      }}
    >
      <ResumeDocumentStyles useTemplatePdfMargins={useTemplatePdfMargins} />
      <div
        className="resume-document-scale"
        style={{ width: `${pageWidthPx}px`, minHeight: `${pageHeightPx}px` }}
      >
        <ThemedResumeTemplate templateId={safeTemplateId} data={fittedData} />
      </div>
    </div>
  );
};

export const ResumeDocument = memo(ResumeDocumentComponent);

export default ResumeDocument;
