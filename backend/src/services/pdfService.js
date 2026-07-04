import puppeteer from "puppeteer";

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;
const FRONTEND_RENDER_URL =
  process.env.PDF_RENDER_URL ||
  process.env.FRONTEND_URL ||
  "http://127.0.0.1:8080";

const TEMPLATE_NAMES = {
  1: "Clean Single Column",
  2: "Corporate Sidebar Blue",
  3: "Colored Heading Corporate",
  4: "Left Accent Teal",
  5: "Premium Gray Sidebar",
  6: "Professional Sidebar Teal",
  7: "Muted Coral Corporate",
  8: "Compact ATS Single",
  9: "Premium Charcoal Sidebar",
  10: "Blue Heading Corporate",
  11: "Classic Two Column",
  12: "Soft Green Corporate",
  13: "Rose Sidebar Corporate",
  14: "Minimal Left Accent",
  15: "Corporate Clean",
};

const TEMPLATE_WITH_CUSTOM_PDF_MARGIN = new Set([2]);

const normalizeResumeData = (resumeData = {}) => ({
  ...resumeData,
  fullName: resumeData.fullName || "",
  role: resumeData.role || "",
  email: resumeData.email || "",
  phone: resumeData.phone || "",
  address: resumeData.address || "",
  summary: resumeData.summary || "",
  careerObjective: resumeData.careerObjective || "",
  candidateType:
    resumeData.candidateType ||
    ((resumeData.experience || []).length === 0 ? "fresher" : "experienced"),
  education: Array.isArray(resumeData.education) ? resumeData.education : [],
  experience: Array.isArray(resumeData.experience) ? resumeData.experience : [],
  projects: Array.isArray(resumeData.projects) ? resumeData.projects : [],
  skills: Array.isArray(resumeData.skills) ? resumeData.skills : [],
  certifications: Array.isArray(resumeData.certifications) ? resumeData.certifications : [],
  languages: Array.isArray(resumeData.languages) ? resumeData.languages : [],
  strengths: Array.isArray(resumeData.strengths) ? resumeData.strengths : [],
  hobbies: Array.isArray(resumeData.hobbies) ? resumeData.hobbies : [],
  achievements: Array.isArray(resumeData.achievements) ? resumeData.achievements : [],
  references: Array.isArray(resumeData.references) ? resumeData.references : [],
  customSections: Array.isArray(resumeData.customSections) ? resumeData.customSections : [],
  socialLinks: Array.isArray(resumeData.socialLinks) ? resumeData.socialLinks : [],
  theme: resumeData.theme || undefined,
});

const getSafeTemplateId = (templateId) => {
  const id = Number.parseInt(templateId, 10);
  return Number.isInteger(id) && TEMPLATE_NAMES[id] ? id : 1;
};

const getPrintRenderUrl = (debugMode = false) =>
  `${FRONTEND_RENDER_URL.replace(/\/$/, "")}/print/resume?mode=pdf${debugMode ? "&debug=1" : ""}`;

export const generateResumePDF = async (resumeData, templateId, options = {}) => {
  let browser;
  const { debugMode = false } = options;
  const safeTemplateId = getSafeTemplateId(templateId);
  const normalizedResumeData = normalizeResumeData(resumeData);
  const renderUrl = getPrintRenderUrl(debugMode);

  try {
    // Reduced logging for production: only log errors and essential warnings.
    if (debugMode) {
      console.log(
        "[pdf-debug][stage-1][payload]",
        JSON.stringify({
          templateId: safeTemplateId,
          educationLength: normalizedResumeData.education.length,
          certificationsLength: normalizedResumeData.certifications.length,
          projectsLength: normalizedResumeData.projects.length,
          skillsLength: normalizedResumeData.skills.length,
          experienceLength: normalizedResumeData.experience.length,
          education: normalizedResumeData.education,
          certifications: normalizedResumeData.certifications,
          resumeData: normalizedResumeData,
        })
      );
    }

    if (safeTemplateId !== Number.parseInt(templateId, 10)) {
      console.warn(
        `   Invalid or missing template ID "${templateId}" received. Falling back to template ${safeTemplateId}.`
      );
    }

    browser = await puppeteer.launch({
      headless: debugMode ? false : "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-software-rasterizer",
        "--force-color-profile=srgb",
        "--font-render-hinting=medium",
        "--disable-background-networking",
        "--disable-breakpad",
        "--disable-client-side-phishing-detection",
        "--disable-component-extensions-with-background-pages",
        "--disable-default-apps",
        "--disable-extensions",
      ],
      defaultViewport: null,
    });

    const page = await browser.newPage();

    if (debugMode) {
      // In debug mode, surface browser console messages to server logs for investigation
      page.on("console", (msg) => {
        try {
          console.debug("[puppeteer]", msg.type(), msg.text());
        } catch (e) {}
      });
      page.on("pageerror", (err) => console.error("[puppeteer pageerror]", err.message));
    }

    await page.setViewport({
      width: A4_WIDTH_PX,
      height: A4_HEIGHT_PX * 10, // Set tall enough to capture multi-page content
      deviceScaleFactor: 1,
    });

    await page.emulateMediaType("screen");
    await page.goto(renderUrl, {
      waitUntil: ["domcontentloaded", "networkidle0"],
      timeout: 30000,
    });

    await page.evaluate(
      ({ nextTemplateId, nextResumeData }) => {
        window.__RESUME_PRINT_READY__ = false;
        document.documentElement.classList.remove("resume-print-ready");
        document.documentElement.removeAttribute("data-resume-print-ready");
        window.__RESUME_PRINT_PAYLOAD__ = {
          templateId: nextTemplateId,
          resumeData: nextResumeData,
        };
        window.dispatchEvent(new Event("resume-print-payload"));
      },
      {
        nextTemplateId: safeTemplateId,
        nextResumeData: normalizedResumeData,
      }
    );

    await page.waitForFunction(() => window.__RESUME_PRINT_READY__ === true, {
      timeout: 30000,
    });

    await page.waitForSelector(".resume-page", {
      timeout: 30000,
    });

    const fontsReadyHandle = await page.evaluateHandle("document.fonts.ready");
    await fontsReadyHandle.jsonValue();

    if (debugMode) {
      const finalDomSnapshot = await page.evaluate(() => {
        const sectionSelector = ".resume-main-section, .resume-section";
        const pages = Array.from(document.querySelectorAll<HTMLElement>(".resume-page")).map(
          (page, index) => ({
            page: index + 1,
            sections: Array.from(page.querySelectorAll<HTMLElement>(sectionSelector)).map((section) => ({
              title:
                section.querySelector<HTMLElement>(".resume-section-title")?.textContent?.trim() ||
                "(untitled)",
              height: section.offsetHeight,
              top: section.offsetTop,
              display: getComputedStyle(section).display,
              visibility: getComputedStyle(section).visibility,
            })),
          })
        );

        return {
          pageCount: pages.length,
          pages,
          educationExists: pages.some((page) =>
            page.sections.some((section) => section.title.toLowerCase() === "education")
          ),
        };
      });

      console.log("[pdf-debug][stage-8][final-dom-before-pdf]", JSON.stringify(finalDomSnapshot));
    }

    // Generating PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin:
        TEMPLATE_WITH_CUSTOM_PDF_MARGIN.has(safeTemplateId)
          ? {
              top: "12mm",
              bottom: "12mm",
              left: "12mm",
              right: "12mm",
            }
          : {
              top: "0px",
              bottom: "0px",
              left: "0px",
              right: "0px",
            },
      scale: 1,
    });

    // PDF generated successfully
    return pdfBuffer;
  } catch (error) {
    console.error("\nPDF Generation Error:", error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

export const getAvailableTemplates = () =>
  Object.entries(TEMPLATE_NAMES).map(([id, name]) => ({
    id: Number(id),
    name,
    status: "available",
  }));

export const isValidTemplateId = (templateId) => {
  const id = Number.parseInt(templateId, 10);
  return Number.isInteger(id) && Boolean(TEMPLATE_NAMES[id]);
};

export const getTemplateInfo = (templateId) => {
  const id = getSafeTemplateId(templateId);
  if (!isValidTemplateId(id)) return null;

  return {
    id,
    name: TEMPLATE_NAMES[id],
    available: true,
  };
};

export const getTemplatePreview = (templateId) => {
  const id = getSafeTemplateId(templateId);
  return `<div>Preview is rendered by the frontend print route using template ${id}: ${TEMPLATE_NAMES[id]}</div>`;
};

export const getTemplateStatus = (templateId) => {
  return isValidTemplateId(templateId) ? "available" : "invalid";
};
