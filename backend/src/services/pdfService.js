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

/**
 * =====================================================
 * ENHANCED A4 PAGE FIT WITH SCALING WRAPPER
 * Handles BOTH overflow (shrinking) and underflow (expansion)
 * =====================================================
 */
const injectA4FitWithScaling = (html, debugMode = false) => {
  const fitStyles = `
    <style>
      /* Page-level A4 enforcement */
      html, body {
        margin: 0;
        padding: 0;
        width: ${A4_WIDTH_PX}px;
        height: ${A4_HEIGHT_PX}px;
        overflow: hidden;
        background: #ffffff;
      }

      /* Scaling wrapper - transforms from top-left without offset */
      #scale-wrapper {
        width: 100%;
        transform-origin: top left;
        will-change: transform;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
      }

      /* Page container - enforce exact A4 dimensions */
      .page {
        width: ${A4_WIDTH_PX}px !important;
        height: ${A4_HEIGHT_PX}px !important;
        max-height: ${A4_HEIGHT_PX}px !important;
        overflow: hidden !important;
        box-sizing: border-box;
      }

      /* Prevent unwanted margins/padding that steal vertical space */
      * {
        box-sizing: border-box;
      }

      body * {
        margin-collapse: collapse;
      }

      @page {
        size: A4;
        margin: 0;
      }

      /* CSS print media */
      @media print {
        html, body, .page {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        }
      }
    </style>
  `;

  const fitScript = `
    <script>
      window.__resumeFitConfig = {
        A4_HEIGHT: ${A4_HEIGHT_PX},
        A4_WIDTH: ${A4_WIDTH_PX},
        DEBUG: ${debugMode},
        MAX_SCALE: 1.15,        // Max scale up (prevent extreme expansion)
        MIN_SCALE: 0.75,        // Min scale down (prevent extreme shrinking)
        MIN_FONT_SCALE: 0.82,
        MIN_LINE_HEIGHT: 1.2,
        MIN_SPACE_SCALE: 0.72
      };

      window.__fitResume = async function() {
        const cfg = window.__resumeFitConfig;
        const page = document.querySelector('.page');
        
        if (!page) {
          console.warn('❌ .page element not found');
          return false;
        }

        try {
          // Wait for fonts to load
          if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
          }

          // Wait for images
          const images = document.querySelectorAll('img');
          const imagePromises = Array.from(images).map(img => {
            return new Promise(resolve => {
              if (img.complete) {
                resolve();
              } else {
                img.onload = img.onerror = resolve;
              }
            });
          });
          await Promise.all(imagePromises);

          // Small delay for final layout calculations
          await new Promise(resolve => setTimeout(resolve, 100));

          // Measure actual content height
          const contentHeight = Math.max(
            page.scrollHeight,
            page.offsetHeight,
            page.getBoundingClientRect().height
          );

          if (cfg.DEBUG) {
            console.log('📏 Content Analysis:');
            console.log('   Content Height:', contentHeight);
            console.log('   A4 Height:', cfg.A4_HEIGHT);
            console.log('   Ratio:', (contentHeight / cfg.A4_HEIGHT).toFixed(3));
          }

          // Get or create scale wrapper
          let wrapper = document.getElementById('scale-wrapper');
          if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.id = 'scale-wrapper';
            const body = document.body;
            while (body.firstChild) {
              wrapper.appendChild(body.firstChild);
            }
            body.appendChild(wrapper);
          }

          // Calculate scale factor
          let scale = 1;
          
          if (contentHeight > cfg.A4_HEIGHT) {
            // OVERFLOW: Shrink content
            scale = Math.max(cfg.MIN_SCALE, cfg.A4_HEIGHT / contentHeight);
            if (cfg.DEBUG) console.log('📉 Shrinking to fit:', scale.toFixed(3));
          } else if (contentHeight < cfg.A4_HEIGHT) {
            // UNDERFLOW: Expand slightly to fill page (but cap it)
            const expansionRatio = cfg.A4_HEIGHT / contentHeight;
            scale = Math.min(cfg.MAX_SCALE, expansionRatio);
            if (cfg.DEBUG) console.log('📈 Expanding to fill:', scale.toFixed(3));
          }

          // Apply transform
          wrapper.style.transform = 'scale(' + scale.toFixed(4) + ')';
          
          if (cfg.DEBUG) {
            console.log('✅ Final scale applied:', scale.toFixed(4));
          }

          return true;
        } catch (error) {
          console.error('❌ Fit Resume Error:', error);
          return false;
        }
      };

      // Execute on load
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.__fitResume());
      } else {
        window.__fitResume();
      }

      // Also execute on image load completion
      window.addEventListener('load', () => window.__fitResume());
    </script>
  `;

  return html
    .replace("</head>", `${fitStyles}</head>`)
    .replace("</body>", `${fitScript}</body>`);
};

/**
 * =====================================
 * GENERATE RESUME PDF (ENHANCED)
 * =====================================
 */
export const generateResumePDF = async (resumeData, templateId, options = {}) => {
  let browser;
  const { debugMode = false } = options;

  try {
    console.log(`\n🚀 PDF Generation Started`);
    console.log(`   Template ID: ${templateId}`);
    console.log(`   Debug Mode: ${debugMode}`);

    if (templateId === undefined || templateId === null) {
      console.warn(`⚠️  Template ID is undefined/null, using Template 1`);
      templateId = 1;
    }

    const templateNumber = parseInt(templateId, 10);

    if (isNaN(templateNumber)) {
      throw new Error(`Invalid template ID: ${templateId}`);
    }

    // Launch browser with optimized settings
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-software-rasterizer",
        // Font rendering optimizations
        "--font-render-hinting=medium",
        // Memory and performance
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

    // Set viewport to A4 dimensions
    await page.setViewport({
      width: A4_WIDTH_PX,
      height: A4_HEIGHT_PX,
      deviceScaleFactor: 1,
    });

    // Emulate high-quality screen
    await page.emulateMediaType("screen");
    await page.evaluateHandle("document.fonts.ready");

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

    console.log(`   Template Name: ${template.name}`);

    // Fit resume data and inject A4-optimized styles
    const fittedData = fitResumeData(resumeData);
    const html = injectA4FitWithScaling(template.func(fittedData), debugMode);

    console.log(`   Setting page content...`);

    // Set page content with proper wait conditions
    await page.setContent(html, {
      waitUntil: ["domcontentloaded", "networkidle0"],
      timeout: 30000,
    });

    console.log(`   Waiting for network idle...`);
    await page.waitForNetworkIdle({ timeout: 5000 }).catch(() => {
      console.warn(`⚠️  Network idle timeout (continuing anyway)`);
    });

    console.log(`   Executing fit-to-page logic...`);

    // Execute scaling logic
    const fitResult = await page.evaluate(() => {
      return new Promise((resolve) => {
        if (window.__fitResume) {
          Promise.resolve(window.__fitResume()).then(resolve);
        } else {
          resolve(false);
        }
      });
    });

    if (debugMode) {
      console.log(`   Fit result: ${fitResult}`);
    }

    // Small delay for final rendering
    await page.evaluate(() => {
      return new Promise(resolve => setTimeout(resolve, 200));
    });

    console.log(`   Generating PDF (A4, no margins)...`);

    // Generate PDF with strict A4 settings
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

    console.log(`✅ PDF generated successfully (${pdfBuffer.length} bytes)\n`);

    return pdfBuffer;
  } catch (error) {
    console.error(`\n❌ PDF Generation Error:`, error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
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
