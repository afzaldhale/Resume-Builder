import puppeteer from "puppeteer";
import { template1HTML } from "../templates/template1.js";
import { template2HTML } from "../templates/template2.js";
import { template3HTML } from "../templates/template3.js";
import { template4HTML } from "../templates/template4.js";
import { template5HTML } from "../templates/template5.js";
import { template6HTML } from "../templates/template6.js";
import { template7HTML } from "../templates/template7.js";
import { template8HTML } from "../templates/template8.js";
import { template9HTML } from "../templates/template9.js";
import { template10HTML } from "../templates/template10.js";
import { template11HTML } from "../templates/template11.js";
import { template12HTML } from "../templates/template12.js";
import { template13HTML } from "../templates/template13.js";
import { template14HTML } from "../templates/template14.js";
import { template15HTML } from "../templates/template15.js";
import { fitResumeData } from "../utils/fitResumeData.js";

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

const injectOnePageFit = (html) => {
  const fitStyles = `
    <style>
      :root {
        --resume-font-scale: 1;
        --resume-line-height: 1.45;
        --resume-space-scale: 1;
      }

      body {
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
      }

      .page {
        width: ${A4_WIDTH_PX}px !important;
        height: ${A4_HEIGHT_PX}px !important;
        max-height: ${A4_HEIGHT_PX}px !important;
        overflow: hidden !important;
      }

      h1, h2, h3, p, li, span, div {
        line-height: var(--resume-line-height) !important;
      }

      h1 { letter-spacing: -0.02em; }
      h2, h3 { margin-top: calc(14px * var(--resume-space-scale)) !important; }
      p, li { margin-bottom: calc(4px * var(--resume-space-scale)) !important; }
      ul { margin-top: calc(4px * var(--resume-space-scale)) !important; }
      .section, .box, .job, .skill { margin-bottom: calc(10px * var(--resume-space-scale)) !important; }
    </style>
  `;

  const fitScript = `
    <script>
      window.__fitResume = () => {
        const page = document.querySelector('.page');
        if (!page) return false;

        const maxHeight = ${A4_HEIGHT_PX};
        const minFontScale = 0.82;
        const minLineHeight = 1.2;
        const minSpaceScale = 0.72;
        let fontScale = 1;
        let lineHeight = 1.45;
        let spaceScale = 1;

        const apply = () => {
          document.documentElement.style.setProperty('--resume-font-scale', String(fontScale));
          document.documentElement.style.setProperty('--resume-line-height', String(lineHeight));
          document.documentElement.style.setProperty('--resume-space-scale', String(spaceScale));
          page.style.zoom = "1";
        };

        const measure = () => Math.max(page.scrollHeight, page.offsetHeight);

        apply();

        for (let index = 0; index < 12; index += 1) {
          if (measure() <= maxHeight) {
            return true;
          }

          if (spaceScale > minSpaceScale) {
            spaceScale = Math.max(minSpaceScale, +(spaceScale - 0.05).toFixed(2));
          } else if (lineHeight > minLineHeight) {
            lineHeight = Math.max(minLineHeight, +(lineHeight - 0.05).toFixed(2));
          } else if (fontScale > minFontScale) {
            fontScale = Math.max(minFontScale, +(fontScale - 0.04).toFixed(2));
          }

          apply();
        }

        const finalHeight = measure();

        if (finalHeight > maxHeight) {
          const zoom = Math.max(0.78, Math.min(1, maxHeight / finalHeight));
          page.style.zoom = String(zoom);
        }

        return true;
      };

      window.addEventListener('load', () => window.__fitResume());
    </script>
  `;

  return html
    .replace("</head>", `${fitStyles}</head>`)
    .replace("</body>", `${fitScript}</body>`);
};

/**
 * =====================================
 * GENERATE RESUME PDF
 * =====================================
 */
export const generateResumePDF = async (resumeData, templateId) => {
  let browser;

  try {
    console.log(`📤 PDF Service Called:`);
    console.log(`   Template ID received: ${templateId}`);
    console.log(`   Template ID type: ${typeof templateId}`);

    if (templateId === undefined || templateId === null) {
      console.warn(`⚠️ Template ID is undefined/null, using Template 1`);
      templateId = 1;
    }

    const templateNumber = parseInt(templateId, 10);

    if (isNaN(templateNumber)) {
      throw new Error(`Invalid template ID: ${templateId}`);
    }

    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--font-render-hinting=medium",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-software-rasterizer",
      ],
      defaultViewport: null,
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 1,
    });

    const templates = {
      1: { name: "Simple Classic", func: template1HTML },
      2: { name: "Professional Sidebar", func: template2HTML },
      3: { name: "Modern Two-Column", func: template3HTML },
      4: { name: "Modern Professional", func: template4HTML },
      5: { name: "Timeline Professional", func: template5HTML },
      6: { name: "ATS Optimized", func: template6HTML },
      7: { name: "Creative Portfolio", func: template7HTML },
      8: { name: "Clean Minimalist", func: template8HTML },
      9: { name: "Dark Theme", func: template9HTML },
      10: { name: "Modern Gradient", func: template10HTML },
      11: { name: "Soft Indigo", func: template11HTML },
      12: { name: "Fresh Emerald", func: template12HTML },
      13: { name: "Modern Fuchsia", func: template13HTML },
      14: { name: "Minimal White", func: template14HTML },
      15: { name: "Clean Professional", func: template15HTML },
    };

    const template = templates[templateNumber];

    if (!template || !template.func) {
      throw new Error(`Template ${templateNumber} not available`);
    }

    const fittedData = fitResumeData(resumeData);
    const html = injectOnePageFit(template.func(fittedData));

    await page.setContent(html, {
      waitUntil: ["domcontentloaded", "networkidle0"],
      timeout: 30000,
    });

    await page.emulateMediaType("screen");
    await page.evaluate(() => window.__fitResume && window.__fitResume());

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "10mm",
        bottom: "10mm",
        left: "10mm",
        right: "10mm",
      },
    });

    return pdfBuffer;
  } finally {
    if (browser) await browser.close();
  }
};

/**
 * =====================================
 * GET AVAILABLE TEMPLATES
 * =====================================
 */
export const getAvailableTemplates = () => [
  { id: 1, name: "Simple Classic", status: "available" },
  { id: 2, name: "Professional Sidebar", status: "available" },
  { id: 3, name: "Modern Two-Column", status: "available" },
  { id: 4, name: "Modern Professional", status: "available" },
  { id: 5, name: "Timeline Professional", status: "available" },
  { id: 6, name: "ATS Optimized", status: "available" },
  { id: 7, name: "Creative Portfolio", status: "available" },
  { id: 8, name: "Clean Minimalist", status: "available" },
  { id: 9, name: "Dark Theme", status: "available" },
  { id: 10, name: "Modern Gradient", status: "available" },
  { id: 11, name: "Soft Indigo", status: "available" },
  { id: 12, name: "Fresh Emerald", status: "available" },
  { id: 13, name: "Modern Fuchsia", status: "available" },
  { id: 14, name: "Minimal White", status: "available" },
  { id: 15, name: "Clean Professional", status: "available" },
];

/**
 * =====================================
 * VALIDATE TEMPLATE ID
 * =====================================
 */
export const isValidTemplateId = (templateId) => {
  const id = parseInt(templateId, 10);
  return !isNaN(id) && id >= 1 && id <= 15;
};

/**
 * =====================================
 * GET TEMPLATE INFO
 * =====================================
 */
export const getTemplateInfo = (templateId) => {
  const id = parseInt(templateId, 10);
  if (!isValidTemplateId(id)) return null;

  return {
    id,
    available: true,
  };
};

/**
 * =====================================
 * GET TEMPLATE PREVIEW
 * =====================================
 */
export const getTemplatePreview = (templateId) => {
  const id = parseInt(templateId, 10);

  const templates = {
    1: template1HTML,
    2: template2HTML,
    3: template3HTML,
    4: template4HTML,
    5: template5HTML,
    6: template6HTML,
    7: template7HTML,
    8: template8HTML,
    9: template9HTML,
    10: template10HTML,
    11: template11HTML,
    12: template12HTML,
    13: template13HTML,
    14: template14HTML,
    15: template15HTML,
  };

  return templates[id]
    ? templates[id]({
        fullName: "John Doe",
        role: "Software Engineer",
        skills: ["React", "Node.js"],
        experience: [],
      })
    : "<div>Template not available</div>";
};

/**
 * =====================================
 * GET TEMPLATE STATUS
 * =====================================
 */
export const getTemplateStatus = (templateId) => {
  return isValidTemplateId(templateId) ? "available" : "invalid";
};
