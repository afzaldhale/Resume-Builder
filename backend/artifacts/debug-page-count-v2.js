import fs from "fs";
import puppeteer from "puppeteer";

const FRONTEND_URL = process.env.PDF_RENDER_URL || "http://127.0.0.1:8081";
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

async function runDebug() {
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"] });
  try {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      window.__RESUME_PRINT_READY__ = false;
      window.__RESUME_PRINT_PAYLOAD__ = {
        templateId: 1,
        resumeData: {
          name: "Debug Resume",
          summary: "Debugging multi-page rendering",
          skills: [{ name: "JavaScript" }],
          experience: [{ company: "Test", title: "Engineer", description: "Debugging." }],
          education: [{ school: "Test U", degree: "BSc" }],
          projects: [{ name: "Debug Project", description: "Verify pagination." }],
          certifications: [{ name: "Debug Cert" }],
        },
      };
    });

    const printUrl = `${FRONTEND_URL}/print/resume?mode=pdf`;
    await page.setViewport({ width: A4_WIDTH_PX, height: A4_HEIGHT_PX, deviceScaleFactor: 1 });
    await page.emulateMediaType("screen");
    await page.goto(printUrl, { waitUntil: ["domcontentloaded", "networkidle0"], timeout: 30000 });

    await page.evaluate(() => {
      window.dispatchEvent(new Event("resume-print-payload"));
    });

    await page.waitForFunction(() => window.__RESUME_PRINT_READY__ === true, { timeout: 45000 });
    await page.waitForSelector(".resume-page", { timeout: 30000 });
    await page.evaluateHandle("document.fonts.ready");

    const metrics = await page.evaluate(() => {
      const pageElements = Array.from(document.querySelectorAll('.resume-page, .page'));
      const themeRoots = Array.from(document.querySelectorAll('.resume-theme-root'));
      const jsonPages = pageElements.map((el, idx) => ({
        index: idx + 1,
        className: el.className,
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
        childCount: el.children.length,
        outerHTML: el.outerHTML.slice(0, 200),
      }));
      return {
        pageCount: pageElements.length,
        pageClassCount: pageElements.filter(el => el.classList.contains('page')).length,
        resumePageClassCount: pageElements.filter(el => el.classList.contains('resume-page')).length,
        themeRootCount: themeRoots.length,
        pages: jsonPages,
        shellHeight: document.body.clientHeight,
        shellOverflow: getComputedStyle(document.body).overflow,
      };
    });

    const screenshotPath = "backend/artifacts/debug-preview-template-1-v2.png";
    await page.screenshot({ path: screenshotPath, fullPage: true });
    fs.writeFileSync("backend/artifacts/debug-page-count-v2.json", JSON.stringify(metrics, null, 2));
    console.log(JSON.stringify({ metrics, screenshotPath }, null, 2));
  } finally {
    await browser.close();
  }
}

runDebug().catch(err => {
  console.error(err);
  process.exit(1);
});