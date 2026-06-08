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

const getPrintRenderUrl = () => `${FRONTEND_RENDER_URL.replace(/\/$/, "")}/print/resume?mode=pdf`;

export const generateResumePDF = async (resumeData, templateId, options = {}) => {
  let browser;
  const { debugMode = false } = options;
  const safeTemplateId = getSafeTemplateId(templateId);
  const normalizedResumeData = normalizeResumeData(resumeData);
  const renderUrl = getPrintRenderUrl();

  try {
    console.log("\nPDF Generation Started");
    console.log(`   Template ID requested: ${templateId}`);
    console.log(`   Template ID rendered: ${safeTemplateId}`);
    console.log(`   Template Name: ${TEMPLATE_NAMES[safeTemplateId]}`);
    console.log(`   Frontend print route: ${renderUrl}`);
    console.log(`   Debug Mode: ${debugMode}`);

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
      page.on("console", (msg) => {
        try {
          console.log("[puppeteer]", msg.type(), msg.text());
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

    console.log("   Generating PDF...");
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "0px",
        bottom: "0px",
        left: "0px",
        right: "0px",
      },
      scale: 1,
    });

    console.log(`PDF generated successfully (${pdfBuffer.length} bytes)\n`);
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
