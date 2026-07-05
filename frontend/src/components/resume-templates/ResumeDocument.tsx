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
const TEMPLATE_WITH_CUSTOM_PDF_MARGIN = new Set<number>();

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

const normalizeStringList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeResumeData = (data: ResumeData): ResumeData => ({
  ...data,
  strengths: normalizeStringList(data.strengths),
  hobbies: normalizeStringList(data.hobbies),
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
  references: Array.isArray(data.references) ? data.references : [],
  customSections: Array.isArray(data.customSections) ? data.customSections : [],
  candidateType:
    data.candidateType ||
    ((Array.isArray(data.experience) ? data.experience : []).length === 0
      ? "fresher"
      : "experienced"),
  theme: data.theme,
});

const isPdfDebugEnabled = () => {
  if (typeof window === "undefined") return false;
  return Boolean((window as Window & { __RESUME_PRINT_DEBUG__?: boolean }).__RESUME_PRINT_DEBUG__);
};

const getSectionTitle = (section: Element) =>
  section.querySelector<HTMLElement>(".resume-section-title")?.textContent?.trim() || "(untitled)";

const getPageSectionSnapshot = (pages: HTMLElement[], selector: string) =>
  pages.map((page, index) => ({
    page: index + 1,
    sections: Array.from(page.querySelectorAll<HTMLElement>(selector)).map((section) => ({
      title: getSectionTitle(section),
      height: section.offsetHeight,
      top: section.offsetTop,
    })),
  }));

const getDomPath = (node: Node | null) => {
  if (!(node instanceof Element)) {
    return node?.nodeName || "unknown";
  }

  const segments: string[] = [];
  let current: Element | null = node;

  while (current && current.nodeType === Node.ELEMENT_NODE) {
    const tag = current.tagName.toLowerCase();
    const id = current.id ? `#${current.id}` : "";
    const className =
      typeof current.className === "string" && current.className.trim().length > 0
        ? `.${current.className.trim().split(/\s+/).join(".")}`
        : "";
    let index = 1;
    let sibling = current.previousElementSibling;
    while (sibling) {
      if (sibling.tagName === current.tagName) {
        index += 1;
      }
      sibling = sibling.previousElementSibling;
    }
    segments.unshift(`${tag}${id}${className}:nth-of-type(${index})`);
    current = current.parentElement;
  }

  return segments.join(" > ");
};

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
  const pageHeightPx =
    safeTemplateId === 1
      ? A4_HEIGHT_PX
      : useTemplatePdfMargins
      ? TEMPLATE_PRINTABLE_HEIGHT_PX
      : A4_HEIGHT_PX;
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
  const compactMode =
    safeTemplateId === 9 ? false : renderMode === "pdf" ? getCompactMode(fittedData) : false;
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
    const debugPdf = isPdfDebugEnabled() && safeTemplateId === 9;

    if (debugPdf) {
      const prePaginationSections = Array.from(
        pageElement.querySelectorAll<HTMLElement>(".resume-main-section, .resume-section")
      ).map((section) => ({
        title: getSectionTitle(section),
        height: section.offsetHeight,
        top: section.offsetTop,
        left: section.offsetLeft,
      }));

      console.log(
        "[pdf-debug][stage-3][pre-pagination-dom]",
        JSON.stringify({
          pageHeightPx,
          scrollHeight,
          overflow,
          sectionCount: prePaginationSections.length,
          sections: prePaginationSections,
        })
      );
    }

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

      const headerElement = contentWrapper.querySelector<HTMLElement>("header");
      const headerNodes: HTMLElement[] = [];
      if (headerElement && safeTemplateId !== 1) {
        headerNodes.push(headerElement);
      }
      

      // pagination instrumentation removed for production

      const template1ShellTemplate =
        safeTemplateId === 1 ? (contentWrapper.cloneNode(false) as HTMLElement) : null;
      if (template1ShellTemplate) {
        // Template 1 uses an outer `h-full` column wrapper. Keeping that as the
        // paginated body makes the splitter measure a different layout from the
        // live template, which leaves large unused white areas.
        template1ShellTemplate.classList.remove("h-full", "min-h-full");
        template1ShellTemplate.style.height = "auto";
        template1ShellTemplate.style.minHeight = "0";
        template1ShellTemplate.style.flex = "0 0 auto";
      }
      const template1HeaderTemplate =
        safeTemplateId === 1
          ? (Array.from(contentWrapper.children).find(
              (child) => child instanceof HTMLElement && child.tagName === "HEADER"
            ) as HTMLElement | undefined)
          : undefined;
      const template1BodyTemplate =
        safeTemplateId === 1
          ? (Array.from(contentWrapper.children).find(
              (child) => child instanceof HTMLElement && child !== template1HeaderTemplate
            ) as HTMLElement | undefined)
          : undefined;
      const sectionElements =
        safeTemplateId === 1 && template1BodyTemplate
          ? Array.from(template1BodyTemplate.querySelectorAll<HTMLElement>(":scope > .resume-section"))
          : Array.from(contentWrapper.querySelectorAll<HTMLElement>(".resume-section"));
      const pageTemplate = pageRoot.cloneNode(false) as HTMLElement;
      const pageBodyTemplate =
        safeTemplateId === 1 && template1BodyTemplate
          ? (template1BodyTemplate.cloneNode(false) as HTMLElement)
          : (contentWrapper.cloneNode(false) as HTMLElement);
      const templateStyleNodes = Array.from(pageRoot.children).filter(
        (child) => child.nodeType === Node.ELEMENT_NODE && child.nodeName === "STYLE"
      );

      pageParent.innerHTML = "";

      const pages: HTMLElement[] = [];

      if (safeTemplateId === 3) {
        const shellTemplate = contentWrapper.cloneNode(false) as HTMLElement;
        const sidebarTemplate = pageRoot.querySelector<HTMLElement>(".template3-sidebar-fill");
        const headerTemplate = contentWrapper.querySelector<HTMLElement>("header");
        const dividerTemplate = contentWrapper.querySelector<HTMLElement>(".template3-divider");
        const bodyTemplate =
          contentWrapper.querySelector<HTMLElement>(".template3-body") ||
          document.createElement("div");
        const sectionSources = Array.from(
          bodyTemplate.querySelectorAll<HTMLElement>(":scope > .resume-section")
        );

        const applyTemplate3PageMetrics = (
          page: HTMLElement,
          shell: HTMLElement,
          sidebar?: HTMLElement | null
        ) => {
          const pageHeight = `${pageHeightPx}px`;
          const sidebarHeight = `${Math.max(pageHeightPx - 72, 0)}px`;

          page.style.position = "relative";
          page.style.height = pageHeight;
          page.style.minHeight = pageHeight;

          shell.style.height = pageHeight;
          shell.style.minHeight = pageHeight;

          if (sidebar) {
            sidebar.style.position = "absolute";
            sidebar.style.top = "36px";
            sidebar.style.bottom = "36px";
            sidebar.style.left = "36px";
            sidebar.style.width = "80px";
            sidebar.style.minHeight = sidebarHeight;
            sidebar.style.height = sidebarHeight;
          }
        };

        const makeTemplate3Page = (includeHeader: boolean) => {
          const page = pageTemplate.cloneNode(false) as HTMLElement;
          templateStyleNodes.forEach((styleNode) => {
            page.appendChild(styleNode.cloneNode(true));
          });

          const sidebarClone = sidebarTemplate?.cloneNode(true) as HTMLElement | undefined;
          if (sidebarClone) {
            page.appendChild(sidebarClone);
          }

          const shell = shellTemplate.cloneNode(false) as HTMLElement;
          const body = bodyTemplate.cloneNode(false) as HTMLElement;
          applyTemplate3PageMetrics(page, shell, sidebarClone);

          if (includeHeader && headerTemplate) {
            shell.appendChild(headerTemplate.cloneNode(true));
          }

          if (includeHeader && dividerTemplate) {
            shell.appendChild(dividerTemplate.cloneNode(true));
          }

          shell.appendChild(body);
          page.appendChild(shell);
          pageParent.appendChild(page);
          pages.push(page);

          return { page, body };
        };

        let currentTemplate3Page = makeTemplate3Page(true);
        let currentPage = currentTemplate3Page.page;
        let currentPageBody = currentTemplate3Page.body;

        const appendToCurrent = (node: Node) => {
          currentPageBody.appendChild(node);
        };

        const moveToNewPage = () => {
          currentTemplate3Page = makeTemplate3Page(false);
          currentPage = currentTemplate3Page.page;
          currentPageBody = currentTemplate3Page.body;
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
              () => {
                moveToNewPage();
                return currentPage;
              },
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

            if (currentPage.scrollHeight > pageHeightPx + 2) {
              shallow.removeChild(childClone);
              if (hadBefore) {
                moveToNewPage();
                const nextWrapper = cloneHeaderOnly(node, sectionSource);
                appendToCurrent(nextWrapper);
                currentPageBody = nextWrapper as HTMLElement;
                if (childClone.nodeType === Node.ELEMENT_NODE) {
                  splitLargeNode(
                    childClone,
                    sectionSource ||
                      (childClone instanceof HTMLElement && childClone.matches(".resume-section")
                        ? childClone
                        : undefined)
                  );
                } else if (childClone.textContent?.trim()) {
                  currentPageBody = splitTextIntoChunks(
                    childClone.textContent.trim(),
                    () => {
                      moveToNewPage();
                      return currentPage;
                    },
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
                    sectionSource ||
                      (childClone instanceof HTMLElement && childClone.matches(".resume-section")
                        ? childClone
                        : undefined)
                  );
                } else if (childClone.textContent?.trim()) {
                  currentPageBody = splitTextIntoChunks(
                    childClone.textContent.trim(),
                    () => {
                      moveToNewPage();
                      return currentPage;
                    },
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

        const appendSection = (sectionSource: HTMLElement) => {
          const sectionClone = sectionSource.cloneNode(true);
          const hadContent = currentPageBody.childNodes.length > 0;
          appendToCurrent(sectionClone);

          if (currentPage.scrollHeight <= pageHeightPx + 2) {
            return;
          }

          currentPageBody.removeChild(sectionClone);

          if (hadContent) {
            moveToNewPage();
            appendToCurrent(sectionClone);
            if (currentPage.scrollHeight <= pageHeightPx + 2) {
              return;
            }
            currentPageBody.removeChild(sectionClone);
          }

          splitLargeNode(sectionClone, sectionClone as HTMLElement);
        };

        sectionSources.forEach((sectionSource) => appendSection(sectionSource));

        const pageElements = Array.from(
          pageParent.querySelectorAll<HTMLElement>(".resume-theme-root.resume-page")
        );
        pageElements.forEach((page, index) => {
          if (page.scrollHeight > pageHeightPx + 2) {
            console.warn(
              `[resume-pagination] Page ${index + 1} exceeds printable height: ${page.scrollHeight}px > ${pageHeightPx}px`,
              page
            );
          }
        });

        return;
      }

      if (safeTemplateId === 6) {
        const layoutTemplate = contentWrapper.cloneNode(false) as HTMLElement;
        const sidebarTemplate =
          Array.from(contentWrapper.children).find(
            (child) => child instanceof HTMLElement && child.classList.contains("resume-sidebar")
          ) as HTMLElement | undefined;
        const mainTemplate =
          Array.from(contentWrapper.children).find(
            (child) => child instanceof HTMLElement && child.classList.contains("resume-main")
          ) as HTMLElement | undefined;
        const mainInnerTemplate = mainTemplate?.firstElementChild as HTMLElement | null;
        const mainFlowTemplate = mainInnerTemplate?.firstElementChild as HTMLElement | null;
        const headerTemplate =
          Array.from(mainFlowTemplate?.children || []).find(
            (child) => child instanceof HTMLElement && child.tagName === "HEADER"
          ) as HTMLElement | undefined;
        const sectionSources = Array.from(mainFlowTemplate?.children || []).filter(
          (child) => child instanceof HTMLElement && child.classList.contains("resume-section")
        ) as HTMLElement[];

        if (!sidebarTemplate || !mainTemplate || !mainInnerTemplate || !mainFlowTemplate) {
          return;
        }

        const makeTemplate6Page = (includeHeader: boolean) => {
          const page = pageTemplate.cloneNode(false) as HTMLElement;
          templateStyleNodes.forEach((styleNode) => {
            page.appendChild(styleNode.cloneNode(true));
          });

          const pageHeight = `${pageHeightPx}px`;

          const layout = layoutTemplate.cloneNode(false) as HTMLElement;
          const sidebar = sidebarTemplate.cloneNode(false) as HTMLElement;
          const main = mainTemplate.cloneNode(false) as HTMLElement;
          const mainInner = mainInnerTemplate.cloneNode(false) as HTMLElement;
          const mainFlow = mainFlowTemplate.cloneNode(false) as HTMLElement;

          page.style.height = pageHeight;
          page.style.minHeight = pageHeight;
          layout.style.height = pageHeight;
          layout.style.minHeight = pageHeight;
          sidebar.style.height = pageHeight;
          sidebar.style.minHeight = pageHeight;
          main.style.height = pageHeight;
          main.style.minHeight = pageHeight;
          mainInner.style.height = "100%";
          mainInner.style.minHeight = "100%";

          if (includeHeader) {
            Array.from(sidebarTemplate.childNodes).forEach((child) => {
              sidebar.appendChild(child.cloneNode(true));
            });
          } else {
            const sidebarShell = sidebarTemplate.firstElementChild;
            if (sidebarShell instanceof HTMLElement) {
              sidebar.appendChild(sidebarShell.cloneNode(false));
            }
          }

          const sidebarShell = sidebar.firstElementChild;
          if (sidebarShell instanceof HTMLElement) {
            sidebarShell.style.flex = "1 1 auto";
            sidebarShell.style.height = "100%";
            sidebarShell.style.minHeight = "100%";
          }

          if (includeHeader && headerTemplate) {
            mainFlow.appendChild(headerTemplate.cloneNode(true));
          }

          mainInner.appendChild(mainFlow);
          main.appendChild(mainInner);
          layout.appendChild(sidebar);
          layout.appendChild(main);
          page.appendChild(layout);
          pageParent.appendChild(page);
          pages.push(page);

          return { page, body: mainFlow };
        };

        let currentTemplate6Page = makeTemplate6Page(true);
        let currentPage = currentTemplate6Page.page;
        let currentPageBody = currentTemplate6Page.body;

        const appendToCurrent = (node: Node) => {
          currentPageBody.appendChild(node);
        };

        const moveToNewPage = () => {
          currentTemplate6Page = makeTemplate6Page(false);
          currentPage = currentTemplate6Page.page;
          currentPageBody = currentTemplate6Page.body;
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
          logTemplate9Height("split-large-node-start", node, {
            originalNodeHeight: node instanceof HTMLElement ? node.offsetHeight : null,
            sectionTitle: sectionSource ? getSectionTitle(sectionSource) : undefined,
            currentTargetPath: getDomPath(currentPageBody),
          });

          if (node instanceof HTMLElement && node.matches("ul, ol")) {
            const listClone = node.cloneNode(false) as HTMLElement;
            appendToCurrent(listClone);
            logTemplate9Height("split-list-wrapper-cloned", listClone, {
              originalNodeHeight: node.offsetHeight,
              clonedWrapperHeight: listClone.offsetHeight,
            });

            for (const child of Array.from(node.children)) {
              const itemClone = child.cloneNode(true);
              logTemplate9Height("split-list-child-before-move", itemClone, {
                originalNodeHeight: node.offsetHeight,
                clonedWrapperHeight: listClone.offsetHeight,
                movedChildHeight: child instanceof HTMLElement ? child.offsetHeight : null,
                remainingPageHeight: pageHeightPx - currentPage.scrollHeight,
              });
              listClone.appendChild(itemClone);
              logTemplate9Height("split-list-child-after-move", itemClone, {
                originalNodeHeight: node.offsetHeight,
                clonedWrapperHeight: listClone.offsetHeight,
                movedChildHeight: child instanceof HTMLElement ? child.offsetHeight : null,
                remainingPageHeight: pageHeightPx - currentPage.scrollHeight,
              });
              assertPageWithinLimit("split-list-child-after-move", itemClone, {
                originalNodeHeight: node.offsetHeight,
                clonedWrapperHeight: listClone.offsetHeight,
                movedChildHeight: child instanceof HTMLElement ? child.offsetHeight : null,
              });

              if (currentPage.scrollHeight <= pageHeightPx + 2) {
                continue;
              }

              listClone.removeChild(itemClone);

              const listHadItems = listClone.children.length > 0;
              if (listHadItems) {
                moveToNewPage();
                const nextWrapper = cloneHeaderOnly(node, sectionSource);
                appendToCurrent(nextWrapper);
                let nextContent =
                  nextWrapper instanceof HTMLElement
                    ? nextWrapper.querySelector<HTMLElement>(".resume-section-content")
                    : null;
                if (!nextContent && nextWrapper instanceof HTMLElement) {
                  nextContent = document.createElement("div");
                  nextContent.classList.add("resume-section-content");
                  nextWrapper.appendChild(nextContent);
                }
                currentPageBody = nextContent || (nextWrapper as HTMLElement);
                const nextList = node.cloneNode(false) as HTMLElement;
                currentPageBody.appendChild(nextList);
                nextList.appendChild(itemClone);
                logTemplate9Height("split-list-child-moved-to-new-page", itemClone, {
                  originalNodeHeight: node.offsetHeight,
                  clonedWrapperHeight: nextList.offsetHeight,
                  movedChildHeight: child instanceof HTMLElement ? child.offsetHeight : null,
                  remainingPageHeight: pageHeightPx - currentPage.scrollHeight,
                });
                assertPageWithinLimit("split-list-child-moved-to-new-page", itemClone, {
                  originalNodeHeight: node.offsetHeight,
                  clonedWrapperHeight: nextList.offsetHeight,
                  movedChildHeight: child instanceof HTMLElement ? child.offsetHeight : null,
                });

                if (currentPage.scrollHeight > pageHeightPx + 2) {
                  nextList.removeChild(itemClone);
                  splitLargeNode(itemClone, sectionSource);
                }
              } else {
                currentPageBody.removeChild(listClone);
                splitLargeNode(itemClone, sectionSource);
              }
            }

            if (isEmptyNode(listClone)) {
              listClone.parentNode?.removeChild(listClone);
            }
            return;
          }

          const textContent = node.textContent?.trim() || "";
          const hasChildren = (node as HTMLElement).children?.length > 0;

          if (!hasChildren && textContent) {
            currentPageBody = splitTextIntoChunks(
              textContent,
              () => {
                moveToNewPage();
                return currentPage;
              },
              currentPageBody,
              pageHeightPx
            );
            return;
          }

          const shallow = node.cloneNode(false);
          appendToCurrent(shallow);
          logTemplate9Height("split-wrapper-cloned", shallow, {
            originalNodeHeight: node instanceof HTMLElement ? node.offsetHeight : null,
            clonedWrapperHeight: shallow instanceof HTMLElement ? shallow.offsetHeight : null,
            sectionTitle: sectionSource ? getSectionTitle(sectionSource) : undefined,
          });

          for (const child of Array.from(node.childNodes)) {
            const childClone = child.cloneNode(true);
            const hadBefore = currentPageBody.childNodes.length > 0;
            logTemplate9Height("split-child-before-move", childClone, {
              originalNodeHeight: node instanceof HTMLElement ? node.offsetHeight : null,
              clonedWrapperHeight: shallow instanceof HTMLElement ? shallow.offsetHeight : null,
              movedChildHeight: child instanceof HTMLElement ? child.offsetHeight : null,
              hadBefore,
              remainingPageHeight: pageHeightPx - currentPage.scrollHeight,
            });
            shallow.appendChild(childClone);
            logTemplate9Height("split-child-after-move", childClone, {
              originalNodeHeight: node instanceof HTMLElement ? node.offsetHeight : null,
              clonedWrapperHeight: shallow instanceof HTMLElement ? shallow.offsetHeight : null,
              movedChildHeight: child instanceof HTMLElement ? child.offsetHeight : null,
              hadBefore,
              remainingPageHeight: pageHeightPx - currentPage.scrollHeight,
            });
            assertPageWithinLimit("split-child-after-move", childClone, {
              originalNodeHeight: node instanceof HTMLElement ? node.offsetHeight : null,
              clonedWrapperHeight: shallow instanceof HTMLElement ? shallow.offsetHeight : null,
              movedChildHeight: child instanceof HTMLElement ? child.offsetHeight : null,
              hadBefore,
            });

            if (currentPage.scrollHeight > pageHeightPx + 2) {
              shallow.removeChild(childClone);
              logTemplate9Height("split-child-overflow-removed", childClone, {
                originalNodeHeight: node instanceof HTMLElement ? node.offsetHeight : null,
                clonedWrapperHeight: shallow instanceof HTMLElement ? shallow.offsetHeight : null,
                movedChildHeight: child instanceof HTMLElement ? child.offsetHeight : null,
                hadBefore,
              });
              if (hadBefore) {
                moveToNewPage();
                const nextWrapper = cloneHeaderOnly(node, sectionSource);
                appendToCurrent(nextWrapper);
                currentPageBody = nextWrapper as HTMLElement;
                logTemplate9Height("split-child-new-wrapper", nextWrapper, {
                  originalNodeHeight: node instanceof HTMLElement ? node.offsetHeight : null,
                  clonedWrapperHeight: nextWrapper.offsetHeight,
                  movedChildHeight: child instanceof HTMLElement ? child.offsetHeight : null,
                  hadBefore,
                });
                if (childClone.nodeType === Node.ELEMENT_NODE) {
                  splitLargeNode(
                    childClone,
                    sectionSource ||
                      (childClone instanceof HTMLElement && childClone.matches(".resume-section")
                        ? childClone
                        : undefined)
                  );
                } else if (childClone.textContent?.trim()) {
                  currentPageBody = splitTextIntoChunks(
                    childClone.textContent.trim(),
                    () => {
                      moveToNewPage();
                      return currentPage;
                    },
                    currentPageBody,
                    pageHeightPx
                  );
                } else {
                  appendToCurrent(childClone);
                }
              } else {
                currentPageBody.removeChild(shallow);
                logTemplate9Height("split-child-first-item-overflow", childClone, {
                  originalNodeHeight: node instanceof HTMLElement ? node.offsetHeight : null,
                  clonedWrapperHeight: shallow instanceof HTMLElement ? shallow.offsetHeight : null,
                  movedChildHeight: child instanceof HTMLElement ? child.offsetHeight : null,
                });
                if (childClone.nodeType === Node.ELEMENT_NODE) {
                  splitLargeNode(
                    childClone,
                    sectionSource ||
                      (childClone instanceof HTMLElement && childClone.matches(".resume-section")
                        ? childClone
                        : undefined)
                  );
                } else if (childClone.textContent?.trim()) {
                  currentPageBody = splitTextIntoChunks(
                    childClone.textContent.trim(),
                    () => {
                      moveToNewPage();
                      return currentPage;
                    },
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

        const getMeaningfulTextNodes = (element: HTMLElement) =>
          Array.from(element.childNodes).filter(
            (child) => child.nodeType === Node.TEXT_NODE && Boolean(child.textContent?.trim())
          );

        const getTemplate6SplitPlan = (sectionSource: HTMLElement) => {
          const sectionTitle = Array.from(sectionSource.children).find(
            (child) => child instanceof HTMLElement && child.classList.contains("resume-section-title")
          ) as HTMLElement | undefined;
          const sectionContent = Array.from(sectionSource.children).find(
            (child) => child instanceof HTMLElement && child.classList.contains("resume-section-content")
          ) as HTMLElement | undefined;

          if (!sectionTitle || !sectionContent || getMeaningfulTextNodes(sectionContent).length > 0) {
            return null;
          }

          const contentElements = Array.from(sectionContent.children).filter(
            (child): child is HTMLElement => child instanceof HTMLElement
          );

          let wrapperTemplate: HTMLElement | null = null;
          let itemSources: HTMLElement[] = [];

          if (contentElements.length === 1) {
            const wrapperCandidate = contentElements[0];
            if (getMeaningfulTextNodes(wrapperCandidate).length > 0) {
              return null;
            }

            const nestedItems = Array.from(wrapperCandidate.children).filter(
              (child): child is HTMLElement => child instanceof HTMLElement
            );

            if (nestedItems.length < 2) {
              return null;
            }

            wrapperTemplate = wrapperCandidate;
            itemSources = nestedItems;
          } else if (contentElements.length > 1) {
            itemSources = contentElements;
          } else {
            return null;
          }

          return {
            itemSources,
            createSectionShell() {
              const section = sectionSource.cloneNode(false) as HTMLElement;
              section.appendChild(sectionTitle.cloneNode(true));

              const content = sectionContent.cloneNode(false) as HTMLElement;
              let appendTarget: HTMLElement = content;

              if (wrapperTemplate) {
                const wrapper = wrapperTemplate.cloneNode(false) as HTMLElement;
                content.appendChild(wrapper);
                appendTarget = wrapper;
              }

              section.appendChild(content);

              return { section, appendTarget };
            },
          };
        };

        const appendSplitSection = (sectionSource: HTMLElement) => {
          const splitPlan = getTemplate6SplitPlan(sectionSource);
          if (!splitPlan) {
            return false;
          }

          const [firstItem] = splitPlan.itemSources;
          if (!firstItem) {
            return false;
          }

          const startProbe = splitPlan.createSectionShell();
          startProbe.appendTarget.appendChild(firstItem.cloneNode(true));
          appendToCurrent(startProbe.section);
          const startFitsCurrentPage = currentPage.scrollHeight <= pageHeightPx + 2;
          currentPageBody.removeChild(startProbe.section);

          if (!startFitsCurrentPage && currentPageBody.childNodes.length > 0) {
            moveToNewPage();
          }

          let activeSection = splitPlan.createSectionShell();
          appendToCurrent(activeSection.section);
          let appendedCount = 0;

          for (const itemSource of splitPlan.itemSources) {
            const itemClone = itemSource.cloneNode(true);
            activeSection.appendTarget.appendChild(itemClone);

            if (currentPage.scrollHeight <= pageHeightPx + 2) {
              appendedCount += 1;
              continue;
            }

            activeSection.appendTarget.removeChild(itemClone);

            if (appendedCount === 0) {
              currentPageBody.removeChild(activeSection.section);
              const fallbackSection = sectionSource.cloneNode(true);
              splitLargeNode(fallbackSection, fallbackSection as HTMLElement);
              return true;
            }

            moveToNewPage();
            activeSection = splitPlan.createSectionShell();
            appendToCurrent(activeSection.section);
            activeSection.appendTarget.appendChild(itemClone);

            if (currentPage.scrollHeight > pageHeightPx + 2) {
              activeSection.appendTarget.removeChild(itemClone);
              currentPageBody.removeChild(activeSection.section);
              const fallbackSection = sectionSource.cloneNode(true);
              splitLargeNode(fallbackSection, fallbackSection as HTMLElement);
              return true;
            }

            appendedCount = 1;
          }

          return true;
        };

        const appendSection = (sectionSource: HTMLElement) => {
          const sectionClone = sectionSource.cloneNode(true);
          const hadContent = currentPageBody.childNodes.length > 0;
          appendToCurrent(sectionClone);

          if (currentPage.scrollHeight <= pageHeightPx + 2) {
            return;
          }

          currentPageBody.removeChild(sectionClone);

          if (appendSplitSection(sectionSource)) {
            return;
          }

          if (hadContent) {
            moveToNewPage();
            appendToCurrent(sectionClone);
            if (currentPage.scrollHeight <= pageHeightPx + 2) {
              return;
            }
            currentPageBody.removeChild(sectionClone);
          }

          splitLargeNode(sectionClone, sectionClone as HTMLElement);
        };

        sectionSources.forEach((sectionSource) => appendSection(sectionSource));

        const pageElements = Array.from(
          pageParent.querySelectorAll<HTMLElement>(".resume-theme-root.resume-page")
        );
        pageElements.forEach((page, index) => {
          if (page.scrollHeight > pageHeightPx + 2) {
            console.warn(
              `[resume-pagination] Page ${index + 1} exceeds printable height: ${page.scrollHeight}px > ${pageHeightPx}px`,
              page
            );
          }
        });

        return;
      }

      if (safeTemplateId === 9) {
        const layoutTemplate = contentWrapper.cloneNode(false) as HTMLElement;
        const template9SectionSelector = ".resume-main-section, .resume-section";
        const styleNodes = Array.from(pageRoot.children).filter(
          (child) => child.nodeType === Node.ELEMENT_NODE && child.nodeName === "STYLE"
        );
        const decorationTemplates = Array.from(pageRoot.children).filter(
          (child) =>
            child instanceof HTMLElement &&
            child !== contentWrapper &&
            child.nodeName !== "STYLE"
        ) as HTMLElement[];
        const sidebarFillTemplate =
          Array.from(contentWrapper.children).find(
            (child) => child instanceof HTMLElement && child.classList.contains("resume-sidebar-fill")
          ) as HTMLElement | undefined;
        const sidebarTemplate =
          Array.from(contentWrapper.children).find(
            (child) => child instanceof HTMLElement && child.classList.contains("resume-sidebar")
          ) as HTMLElement | undefined;
        const mainTemplate =
          Array.from(contentWrapper.children).find(
            (child) => child instanceof HTMLElement && child.classList.contains("resume-main")
          ) as HTMLElement | undefined;
        const mainInnerTemplate = mainTemplate?.firstElementChild as HTMLElement | null;
        const mainFlowTemplate =
          mainInnerTemplate?.querySelector<HTMLElement>(".resume-main-content") ||
          (mainInnerTemplate?.firstElementChild as HTMLElement | null);
        const headerTemplate =
          Array.from(mainFlowTemplate?.children || []).find(
            (child) => child instanceof HTMLElement && child.tagName === "HEADER"
          ) as HTMLElement | undefined;
        const sectionSources = Array.from(mainFlowTemplate?.children || []).filter(
          (child) =>
            child instanceof HTMLElement &&
            (child.classList.contains("resume-main-section") || child.classList.contains("resume-section"))
        ) as HTMLElement[];

        if (debugPdf) {
          console.log(
            "[pdf-debug][stage-4][template9-section-sources]",
            JSON.stringify({
              selector: template9SectionSelector,
              sectionCount: sectionSources.length,
              sections: sectionSources.map((section) => ({
                title: getSectionTitle(section),
                height: section.offsetHeight,
                top: section.offsetTop,
              })),
            })
          );
        }

        if (!sidebarTemplate || !mainTemplate || !mainInnerTemplate || !mainFlowTemplate) {
          return;
        }

        const sidebarWidth =
          getComputedStyle(pageRoot).getPropertyValue("--resume-sidebar-width").trim() || "24%";

        const makeTemplate9Page = (includeHeader: boolean) => {
          const page = pageTemplate.cloneNode(false) as HTMLElement;
          styleNodes.forEach((styleNode) => {
            page.appendChild(styleNode.cloneNode(true));
          });
          decorationTemplates.forEach((node) => {
            page.appendChild(node.cloneNode(true));
          });

          const layout = layoutTemplate.cloneNode(false) as HTMLElement;
          const sidebarFill = sidebarFillTemplate?.cloneNode(true) as HTMLElement | undefined;
          const sidebar = sidebarTemplate.cloneNode(false) as HTMLElement;
          const main = mainTemplate.cloneNode(false) as HTMLElement;
          const mainInner = mainInnerTemplate.cloneNode(false) as HTMLElement;
          const mainFlow = mainFlowTemplate.cloneNode(false) as HTMLElement;
          mainFlow.classList.add("resume-main-content");
          const pageHeight = `${pageHeightPx}px`;

          page.style.height = pageHeight;
          page.style.minHeight = pageHeight;
          layout.style.height = pageHeight;
          layout.style.minHeight = pageHeight;
          layout.style.display = "grid";
          layout.style.gridTemplateColumns = `minmax(0, ${sidebarWidth}) minmax(0, calc(100% - ${sidebarWidth}))`;

          if (sidebarFill) {
            sidebarFill.style.position = "absolute";
            sidebarFill.style.left = "0";
            sidebarFill.style.top = "0";
            sidebarFill.style.bottom = "0";
            sidebarFill.style.width = sidebarWidth;
            page.appendChild(sidebarFill);
          }

          sidebar.style.width = "100%";
          sidebar.style.minWidth = "0";
          sidebar.style.maxWidth = "none";
          sidebar.style.height = "100%";
          sidebar.style.minHeight = "100%";

          main.style.width = "100%";
          main.style.minWidth = "0";
          main.style.maxWidth = "none";
          main.style.height = "100%";
          main.style.minHeight = "100%";
          mainInner.style.height = "100%";
          mainInner.style.minHeight = "100%";

          if (includeHeader) {
            Array.from(sidebarTemplate.childNodes).forEach((child) => {
              sidebar.appendChild(child.cloneNode(true));
            });
          } else {
            const sidebarShell = sidebarTemplate.firstElementChild;
            if (sidebarShell instanceof HTMLElement) {
              const sidebarShellClone = sidebarShell.cloneNode(false) as HTMLElement;
              sidebarShellClone.style.height = "100%";
              sidebarShellClone.style.minHeight = "100%";
              sidebar.appendChild(sidebarShellClone);
            }
          }

          if (includeHeader && headerTemplate) {
            mainFlow.appendChild(headerTemplate.cloneNode(true));
          }

          mainInner.appendChild(mainFlow);
          main.appendChild(mainInner);
          layout.appendChild(sidebar);
          layout.appendChild(main);
          page.appendChild(layout);
          pageParent.appendChild(page);
          pages.push(page);

          return { page, mainContent: mainFlow };
        };

        let currentTemplate9Page = makeTemplate9Page(true);
        let currentPage = currentTemplate9Page.page;
        let currentPageMainContent = currentTemplate9Page.mainContent;

        const getUsedPageHeight = (page = currentPage, mainContent = currentPageMainContent) => {
          const pageRect = page.getBoundingClientRect();
          const meaningfulChildren = Array.from(mainContent.children).filter(
            (child) => child instanceof HTMLElement
          ) as HTMLElement[];
          const anchor = meaningfulChildren[meaningfulChildren.length - 1] || mainContent;
          const anchorRect = anchor.getBoundingClientRect();
          return Math.max(0, anchorRect.bottom - pageRect.top);
        };

        const elementFitsOnCurrentPage = (element: HTMLElement) => {
          const pageRect = currentPage.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();
          return elementRect.bottom - pageRect.top <= pageHeightPx + 2;
        };

        const pageFits = () => getUsedPageHeight() <= pageHeightPx + 2;
        const pageHasSections = () =>
          currentPageMainContent.querySelectorAll(":scope > .resume-main-section, :scope > .resume-section")
            .length > 0;

        const getCurrentPageMetrics = () => ({
          page: pages.length,
          scrollHeight: currentPage.scrollHeight,
          clientHeight: currentPage.clientHeight,
          usedHeight: getUsedPageHeight(),
          remainingHeight: pageHeightPx - getUsedPageHeight(),
          currentPageBody: getDomPath(currentPageMainContent),
          currentMainContainer: getDomPath(currentPageMainContent),
          appendTarget: getDomPath(currentPageMainContent),
        });

        const logTemplate9Height = (
          stage: string,
          node?: Node | null,
          extra?: Record<string, unknown>
        ) => {
          if (!debugPdf) {
            return;
          }

          console.log(
            `[pdf-debug][pagination][${stage}]`,
            JSON.stringify({
              ...getCurrentPageMetrics(),
              currentSection:
                node instanceof Element ? getSectionTitle(node.closest(template9SectionSelector) || node) : undefined,
              nodeText:
                node?.textContent?.trim()?.replace(/\s+/g, " ").slice(0, 160) || undefined,
              nodePath: getDomPath(node || null),
              ...extra,
            })
          );
        };

        const assertPageWithinLimit = (
          stage: string,
          node?: Node | null,
          extra?: Record<string, unknown>
        ) => {
          const usedHeight = getUsedPageHeight();
          if (usedHeight <= pageHeightPx + 2) {
            return;
          }

          const payload = {
            stage,
            pageNumber: pages.length,
            currentAccumulatedHeight: usedHeight,
            printableHeight: pageHeightPx,
            overflowBy: usedHeight - pageHeightPx,
            nodePath: getDomPath(node || null),
            nodeText:
              node?.textContent?.trim()?.replace(/\s+/g, " ").slice(0, 200) || undefined,
            ...extra,
          };

          console.error("[pdf-debug][pagination][overflow-assertion]", JSON.stringify(payload));
        };

        const appendNodeTo = (target: HTMLElement, node: Node, stage: string) => {
          logTemplate9Height(stage, node, {
            appendTarget: getDomPath(target),
            childHeight: node instanceof HTMLElement ? node.offsetHeight : null,
          });
          target.appendChild(node);
          logTemplate9Height(`${stage}-after`, node, {
            appendTarget: getDomPath(target),
            childHeight: node instanceof HTMLElement ? node.offsetHeight : null,
            overflowOccurred: !pageFits(),
          });
          assertPageWithinLimit(`${stage}-after`, node, {
            appendTarget: getDomPath(target),
          });
        };

        const appendToCurrent = (node: Node, stage = "append-main") => {
          appendNodeTo(currentPageMainContent, node, stage);
        };

        const moveToNewPage = () => {
          logTemplate9Height("before-new-page");
          currentTemplate9Page = makeTemplate9Page(false);
          currentPage = currentTemplate9Page.page;
          currentPageMainContent = currentTemplate9Page.mainContent;
          logTemplate9Height("after-new-page");
        };

        const getMeaningfulChildren = (element: HTMLElement) =>
          Array.from(element.children).filter(
            (child): child is HTMLElement =>
              child instanceof HTMLElement && (Boolean(child.textContent?.trim()) || child.children.length > 0)
          );

        const sectionContentSource = (sectionSource: HTMLElement) =>
          sectionSource.querySelector<HTMLElement>(":scope > .resume-section-content");

        const createSectionShell = (sectionSource: HTMLElement) => {
          const section = sectionSource.cloneNode(false) as HTMLElement;
          const header = Array.from(sectionSource.children).find(
            (child) =>
              child instanceof HTMLElement && child.classList.contains("resume-main-section-header")
          ) as HTMLElement | undefined;
          const contentSource = sectionContentSource(sectionSource);
          const content = contentSource
            ? (contentSource.cloneNode(false) as HTMLElement)
            : document.createElement("div");
          content.classList.add("resume-section-content");
          if (header) {
            section.appendChild(header.cloneNode(true));
          }
          section.appendChild(content);
          return { section, content, contentSource };
        };

        const getSectionSplitPlan = (sectionSource: HTMLElement) => {
          const contentSource = sectionContentSource(sectionSource);
          if (!contentSource) {
            return null;
          }

          const directChildren = getMeaningfulChildren(contentSource);
          if (directChildren.length === 0) {
            return null;
          }

          if (directChildren.length === 1) {
            const wrapperSource = directChildren[0];
            if (
              wrapperSource.matches(".grid, ul, ol, .resume-pill-grid, .resume-two-column-list")
            ) {
              const itemSources = getMeaningfulChildren(wrapperSource);
              return {
                itemSources,
                createSectionShell: () => {
                  const shell = createSectionShell(sectionSource);
                  const wrapper = wrapperSource.cloneNode(false) as HTMLElement;
                  shell.content.appendChild(wrapper);
                  return { section: shell.section, appendTarget: wrapper };
                },
              };
            }
          }

          return {
            itemSources: directChildren,
            createSectionShell: () => {
              const shell = createSectionShell(sectionSource);
              return { section: shell.section, appendTarget: shell.content };
            },
          };
        };

        const splitParagraphText = (
          text: string,
          appendChunk: (chunk: string) => boolean
        ) => {
          const paragraphs = String(text || "")
            .split(/\n\s*\n|\r\n\s*\r\n|\n/)
            .map((part) => part.trim())
            .filter(Boolean);

          const sentencesFor = (paragraph: string) =>
            paragraph.match(/[^.!?\n]+[.!?\n]*/g)?.map((part) => part.trim()).filter(Boolean) || [paragraph];

          for (const paragraph of paragraphs) {
            if (appendChunk(paragraph)) {
              continue;
            }

            const sentences = sentencesFor(paragraph);
            let sentenceBuffer = "";
            for (const sentence of sentences) {
              const candidate = sentenceBuffer ? `${sentenceBuffer} ${sentence}` : sentence;
              if (appendChunk(candidate)) {
                sentenceBuffer = candidate;
                continue;
              }

              if (sentenceBuffer && !appendChunk(sentenceBuffer)) {
                return false;
              }

              let wordBuffer: string[] = [];
              const words = sentence.split(/\s+/).filter(Boolean);
              for (const word of words) {
                const wordCandidate = [...wordBuffer, word].join(" ");
                if (appendChunk(wordCandidate)) {
                  wordBuffer.push(word);
                  continue;
                }

                if (wordBuffer.length > 0 && !appendChunk(wordBuffer.join(" "))) {
                  return false;
                }

                wordBuffer = [word];
                if (!appendChunk(wordBuffer.join(" "))) {
                  return false;
                }
              }

              sentenceBuffer = "";
            }
          }

          return true;
        };

        const splitMetaBlockAcrossPages = (itemSource: HTMLElement, sectionSource: HTMLElement) => {
          const plan = getSectionSplitPlan(sectionSource);
          if (!plan) {
            return false;
          }

          const directChildren = Array.from(itemSource.children);
          const bodySource = directChildren.find(
            (child) => child instanceof HTMLElement && child.tagName === "DIV"
          ) as HTMLElement | undefined;
          const bodyChildren = bodySource ? getMeaningfulChildren(bodySource) : [];
          const listSource =
            bodyChildren.length === 1 && bodyChildren[0].matches("ul, ol") ? bodyChildren[0] : null;

          const createMetaBlockShell = () => {
            const block = itemSource.cloneNode(false) as HTMLElement;
            directChildren.forEach((child) => {
              if (child === bodySource) {
                return;
              }
              block.appendChild(child.cloneNode(true));
            });

            let bodyTarget: HTMLElement | null = null;
            if (bodySource) {
              bodyTarget = bodySource.cloneNode(false) as HTMLElement;
              block.appendChild(bodyTarget);
            }

            return { block, bodyTarget };
          };

          let activeSection = plan.createSectionShell();
          appendToCurrent(activeSection.section, "append-meta-section-shell");

          const startNewMetaPage = () => {
            moveToNewPage();
            activeSection = plan.createSectionShell();
            appendToCurrent(activeSection.section, "append-meta-section-shell");
          };

          if (listSource) {
            let activeBlock = createMetaBlockShell();
            activeSection.appendTarget.appendChild(activeBlock.block);
            const activeList = listSource.cloneNode(false) as HTMLElement;
            activeBlock.bodyTarget?.appendChild(activeList);
            let appendedCount = 0;

            for (const item of getMeaningfulChildren(listSource)) {
              const clone = item.cloneNode(true);
              activeList.appendChild(clone);
              if (elementFitsOnCurrentPage(clone as HTMLElement)) {
                appendedCount += 1;
                continue;
              }

              clone.remove();

              if (appendedCount > 0) {
                startNewMetaPage();
                activeBlock = createMetaBlockShell();
                activeSection.appendTarget.appendChild(activeBlock.block);
                const nextList = listSource.cloneNode(false) as HTMLElement;
                activeBlock.bodyTarget?.appendChild(nextList);
                nextList.appendChild(clone);
                if (!elementFitsOnCurrentPage(clone as HTMLElement)) {
                  throw new Error(
                    `[template9-pagination] Meta block list item too tall for a fresh page: ${getDomPath(item)}`
                  );
                }
                appendedCount = 1;
                continue;
              }

              throw new Error(
                `[template9-pagination] Unable to split oversized meta block list item: ${getDomPath(item)}`
              );
            }

            return true;
          }

          if (bodyChildren.length > 0) {
            let activeBlock = createMetaBlockShell();
            activeSection.appendTarget.appendChild(activeBlock.block);

            for (const child of bodyChildren) {
              if (child.matches("p") && activeBlock.bodyTarget) {
                const paragraphClassName = child.className || "resume-body-copy";
                const text = child.textContent?.trim() || "";
                const appendChunk = (chunk: string) => {
                  const paragraph = document.createElement("p");
                  paragraph.className = paragraphClassName;
                  paragraph.textContent = chunk;
                  activeBlock.bodyTarget?.appendChild(paragraph);
                  if (elementFitsOnCurrentPage(paragraph)) {
                    return true;
                  }
                  paragraph.remove();
                  startNewMetaPage();
                  activeBlock = createMetaBlockShell();
                  activeSection.appendTarget.appendChild(activeBlock.block);
                  const retryParagraph = document.createElement("p");
                  retryParagraph.className = paragraphClassName;
                  retryParagraph.textContent = chunk;
                  activeBlock.bodyTarget?.appendChild(retryParagraph);
                  if (!elementFitsOnCurrentPage(retryParagraph)) {
                    retryParagraph.remove();
                    return false;
                  }
                  return true;
                };

                if (!splitParagraphText(text, appendChunk)) {
                  throw new Error(
                    `[template9-pagination] Unable to split oversized paragraph in meta block: ${getDomPath(child)}`
                  );
                }
                continue;
              }

              const clone = child.cloneNode(true);
              activeBlock.bodyTarget?.appendChild(clone);
              if (elementFitsOnCurrentPage(clone as HTMLElement)) {
                continue;
              }
              clone.remove();
              startNewMetaPage();
              activeBlock = createMetaBlockShell();
              activeSection.appendTarget.appendChild(activeBlock.block);
              activeBlock.bodyTarget?.appendChild(clone);
              if (!elementFitsOnCurrentPage(clone as HTMLElement)) {
                throw new Error(
                  `[template9-pagination] Oversized meta block child does not fit on a fresh page: ${getDomPath(child)}`
                );
              }
            }

            return true;
          }

          throw new Error(
            `[template9-pagination] Oversized meta block could not be split safely: ${getDomPath(itemSource)}`
          );
        };

        const paginateSectionByPlan = (sectionSource: HTMLElement) => {
          const splitPlan = getSectionSplitPlan(sectionSource);
          if (!splitPlan) {
            return false;
          }

          const [firstItem] = splitPlan.itemSources;
          if (!firstItem) {
            return false;
          }

          const probe = splitPlan.createSectionShell();
          probe.appendTarget.appendChild(firstItem.cloneNode(true));
          appendToCurrent(probe.section, "append-section-probe");
          const probeFits = pageFits();
          probe.section.remove();

          if (!probeFits && pageHasSections()) {
            moveToNewPage();
          }

          let activeSection: ReturnType<typeof splitPlan.createSectionShell> | null = null;
          let appendedCount = 0;

          const ensureActiveSection = () => {
            if (activeSection) {
              return activeSection;
            }
            activeSection = splitPlan.createSectionShell();
            appendToCurrent(activeSection.section, "append-section-shell");
            appendedCount = 0;
            return activeSection;
          };

          const resetActiveSection = () => {
            activeSection = null;
            appendedCount = 0;
          };

          for (const itemSource of splitPlan.itemSources) {
            const shouldPreSplitMetaBlock =
              itemSource.classList.contains("resume-meta-block") &&
              itemSource.querySelectorAll("li").length > 12;

            if (shouldPreSplitMetaBlock) {
              logTemplate9Height("pre-split-meta-block", itemSource, {
                listItemCount: itemSource.querySelectorAll("li").length,
                itemHeight: itemSource.getBoundingClientRect().height,
              });
              if (appendedCount > 0) {
                moveToNewPage();
              } else if (activeSection?.section.isConnected) {
                activeSection.section.remove();
              }

              resetActiveSection();

              if (!splitMetaBlockAcrossPages(itemSource, sectionSource)) {
                return false;
              }

              continue;
            }

            const sectionShell = ensureActiveSection();
            const itemClone = itemSource.cloneNode(true);
            sectionShell.appendTarget.appendChild(itemClone);
            if (pageFits()) {
              appendedCount += 1;
              continue;
            }

            itemClone.remove();

            if (appendedCount > 0) {
              moveToNewPage();
              resetActiveSection();
              const nextSectionShell = ensureActiveSection();
              nextSectionShell.appendTarget.appendChild(itemClone);
              if (pageFits()) {
                appendedCount = 1;
                continue;
              }
              itemClone.remove();
            }

            sectionShell.section.remove();
            resetActiveSection();

            if (itemSource.classList.contains("resume-meta-block")) {
              if (!splitMetaBlockAcrossPages(itemSource, sectionSource)) {
                return false;
              }
              continue;
            }

            throw new Error(
              `[template9-pagination] Oversized section item does not fit on a fresh page: ${getDomPath(itemSource)}`
            );
          }

          return true;
        };

        const appendSection = (sectionSource: HTMLElement) => {
          if (debugPdf) {
            console.log(
              "[pdf-debug][stage-5][append-section-attempt]",
              JSON.stringify({
                title: getSectionTitle(sectionSource),
                currentPage: pages.length,
                currentPageHeight: currentPage.scrollHeight,
                currentFlowHeight: currentPageMainContent.scrollHeight,
                sectionHeight: sectionSource.offsetHeight,
                remainingPageHeight: pageHeightPx - currentPage.scrollHeight,
                currentPageBody: getDomPath(currentPageMainContent),
                currentMainContainer: getDomPath(currentPageMainContent),
                appendTarget: getDomPath(currentPageMainContent),
              })
            );
          }

          const sectionClone = sectionSource.cloneNode(true);
          const hadContent = pageHasSections();
          appendToCurrent(sectionClone, "append-whole-section");

          if (pageFits()) {
            return;
          }

          sectionClone.remove();

          if (hadContent) {
            moveToNewPage();
            appendToCurrent(sectionClone, "append-whole-section");
            if (pageFits()) {
              return;
            }
            sectionClone.remove();
          }

          if (!paginateSectionByPlan(sectionSource)) {
            throw new Error(
              `[template9-pagination] Unable to paginate oversized section: ${getSectionTitle(sectionSource)}`
            );
          }
        };

        sectionSources.forEach((sectionSource) => appendSection(sectionSource));

        const pageElements = Array.from(
          pageParent.querySelectorAll<HTMLElement>(".resume-theme-root.resume-page")
        );

        const validateTemplate9Page = (page: HTMLElement, pageNumber: number) => {
          const mainContents = page.querySelectorAll<HTMLElement>(".resume-main-content");
          if (mainContents.length !== 1) {
            const message = `[template9-pagination] Page ${pageNumber} must contain exactly one .resume-main-content, found ${mainContents.length}.`;
            if (debugPdf) {
              console.error(message);
              return;
            }
            throw new Error(message);
          }

          const invalidSection = Array.from(
            page.querySelectorAll<HTMLElement>(template9SectionSelector)
          ).find((section) => !section.parentElement?.classList.contains("resume-main-content"));
          if (invalidSection) {
            const message = `[template9-pagination] Invalid section nesting on page ${pageNumber}: ${getDomPath(
              invalidSection
            )}`;
            if (debugPdf) {
              console.error(message);
              return;
            }
            throw new Error(message);
          }

          const mainContent = page.querySelector<HTMLElement>(".resume-main-content");
          const usedHeight = mainContent ? getUsedPageHeight(page, mainContent) : page.scrollHeight;
          if (usedHeight > pageHeightPx + 2) {
            const message = `[template9-pagination] Page ${pageNumber} exceeds printable height: ${usedHeight}px > ${pageHeightPx}px`;
            if (debugPdf) {
              console.error(message);
              return;
            }
            throw new Error(message);
          }
        };

        if (debugPdf) {
          console.log(
            "[pdf-debug][stage-6][post-pagination-pre-cleanup]",
            JSON.stringify({
              pageCount: pageElements.length,
              pages: getPageSectionSnapshot(pageElements, template9SectionSelector),
            })
          );
        }

        pageElements.forEach((page, index) => validateTemplate9Page(page, index + 1));

        if (debugPdf) {
          console.log(
            "[pdf-debug][stage-7][template9-return-before-global-cleanup]",
            JSON.stringify({
              pageCount: pageElements.length,
              pages: getPageSectionSnapshot(pageElements, template9SectionSelector),
            })
          );
        }

        return;
      }

      const createPageBody = (page: HTMLElement) => {
        if (safeTemplateId === 1 && template1ShellTemplate && template1BodyTemplate) {
          const shell = template1ShellTemplate.cloneNode(false) as HTMLElement;
          if (pages.length > 1) {
            shell.classList.add("resume-page-body-offset-template1");
          }
          if (pages.length === 1 && template1HeaderTemplate) {
            shell.appendChild(template1HeaderTemplate.cloneNode(true));
          }
          const body = pageBodyTemplate.cloneNode(false) as HTMLElement;
          shell.appendChild(body);
          page.appendChild(shell);
          return body;
        }

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
        templateStyleNodes.forEach((styleNode) => {
          page.appendChild(styleNode.cloneNode(true));
        });
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

      const hasCurrentPageContent = () =>
        currentPageBody.childNodes.length > 0 || Boolean(currentPage.querySelector("header"));

      const pageFits = () =>
        (safeTemplateId === 1 ? currentPage.scrollHeight : currentPageBody.scrollHeight) <=
        pageHeightPx + 2;

      const getSectionDebugLabel = (sectionSource?: HTMLElement | null) =>
        sectionSource?.querySelector<HTMLElement>(".resume-section-title")?.textContent?.trim() ||
        sectionSource?.textContent?.trim()?.slice(0, 40) ||
        "unknown-section";

      const logTemplate1Pagination = (
        message: string,
        sectionSource?: HTMLElement | null,
        extra?: Record<string, unknown>
      ) => {
        if (safeTemplateId !== 1) {
          return;
        }

        console.warn("[template1-pagination]", {
          message,
          section: getSectionDebugLabel(sectionSource),
          pageIndex: pages.length,
          pageHeightPx,
          currentPageHeight: currentPage.scrollHeight,
          currentBodyHeight: currentPageBody.scrollHeight,
          fits: pageFits(),
          ...extra,
        });
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

          if (!pageFits()) {
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
        const sectionSource = sectionEl as HTMLElement;
        const sectionClone = sectionEl.cloneNode(true);
        const hadContent = hasCurrentPageContent();
        appendToCurrent(sectionClone);

        logTemplate1Pagination("append-section-attempt", sectionSource, {
          hadContent,
        });

        if (pageFits()) {
          logTemplate1Pagination("append-section-fit", sectionSource);
          return;
        }

        currentPageBody.removeChild(sectionClone);
        logTemplate1Pagination("append-section-overflow", sectionSource, {
          hadContent,
        });

        if (hadContent) {
          moveToNewPage();
          appendToCurrent(sectionClone);
          logTemplate1Pagination("append-section-after-new-page", sectionSource);
          if (pageFits()) {
            logTemplate1Pagination("append-section-fit-after-new-page", sectionSource);
            return;
          }
          currentPageBody.removeChild(sectionClone);
        }

        logTemplate1Pagination("append-section-fallback-split", sectionSource);
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
        if (hasCurrentPageContent()) {
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
          logTemplate1Pagination("structured-heading-first-item-probe", sectionSource, {
            fits,
            probeHeight: currentPage.scrollHeight,
          });
          currentPageBody.removeChild(minimumSection);

          if (!fits) {
            logTemplate1Pagination("structured-move-to-new-page", sectionSource);
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

      const appendStructuredTagSection = (sectionSource: HTMLElement) => {
        const contentSource = getTemplate1SectionContent(sectionSource);
        const tagSource = contentSource?.querySelector<HTMLElement>(".resume-skills");
        const tagItems =
          tagSource?.textContent
            ?.split(",")
            .map((item) => item.trim())
            .filter(Boolean) || [];

        if (!contentSource || !tagSource || tagItems.length === 0) {
          appendSection(sectionSource);
          return;
        }

        const title = sectionSource.querySelector<HTMLElement>(".resume-section-title");
        const createTagTarget = (content: HTMLElement) => {
          const paragraph = tagSource.cloneNode(false) as HTMLElement;
          paragraph.textContent = "";
          content.appendChild(paragraph);
          return paragraph;
        };

        if (hasCurrentPageContent()) {
          const minimumSection = sectionSource.cloneNode(false) as HTMLElement;
          const content = contentSource.cloneNode(false) as HTMLElement;

          if (title) {
            minimumSection.appendChild(title.cloneNode(true));
          }

          const probeParagraph = tagSource.cloneNode(false) as HTMLElement;
          probeParagraph.textContent = tagItems[0];
          content.appendChild(probeParagraph);
          minimumSection.appendChild(content);
          appendToCurrent(minimumSection);

          const fits = currentPage.scrollHeight <= pageHeightPx + 2;
          logTemplate1Pagination("tag-heading-first-item-probe", sectionSource, {
            fits,
            probeHeight: currentPage.scrollHeight,
            firstItem: tagItems[0],
          });
          currentPageBody.removeChild(minimumSection);

          if (!fits) {
            logTemplate1Pagination("tag-move-to-new-page", sectionSource, {
              firstItem: tagItems[0],
            });
            moveToNewPage();
          }
        }

        let { content } = createStructuredSection(sectionSource);
        let paragraphTarget = createTagTarget(content);
        let appendedCount = 0;

        for (const item of tagItems) {
          const itemNode = document.createTextNode(appendedCount > 0 ? `, ${item}` : item);
          paragraphTarget.appendChild(itemNode);

          if (currentPage.scrollHeight <= pageHeightPx + 2) {
            logTemplate1Pagination("tag-item-fit", sectionSource, {
              item,
              appendedCount: appendedCount + 1,
            });
            appendedCount += 1;
            continue;
          }

          paragraphTarget.removeChild(itemNode);
          logTemplate1Pagination("tag-item-overflow", sectionSource, {
            item,
            appendedCount,
          });

          if (appendedCount === 0) {
            content.parentElement?.remove();
            logTemplate1Pagination("tag-fallback-append-section", sectionSource, {
              item,
            });
            appendSection(sectionSource);
            return;
          }

          moveToNewPage();
          ({ content } = createStructuredSection(sectionSource));
          paragraphTarget = createTagTarget(content);
          paragraphTarget.appendChild(document.createTextNode(item));
          logTemplate1Pagination("tag-item-new-page", sectionSource, {
            item,
          });

          if (currentPage.scrollHeight > pageHeightPx + 2) {
            paragraphTarget.remove();
            content.parentElement?.remove();
            logTemplate1Pagination("tag-item-still-overflow-after-new-page", sectionSource, {
              item,
            });
            appendSection(sectionSource);
            return;
          }

          appendedCount = 1;
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

        if (contentSource?.querySelector(".resume-skills")) {
          appendStructuredTagSection(sectionSource);
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
        const sectionSelector =
          safeTemplateId === 9 ? ".resume-main-section, .resume-section" : ".resume-section";
        const sections = Array.from(page.querySelectorAll<HTMLElement>(sectionSelector));
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
