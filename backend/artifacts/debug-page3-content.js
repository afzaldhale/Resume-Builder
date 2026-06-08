import fs from "fs";
import puppeteer from "puppeteer";

const FRONTEND_URL = process.env.PDF_RENDER_URL || "http://127.0.0.1:8081";
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;
const stressTestData = JSON.parse(fs.readFileSync("backend/fixtures/stress-test-resume.json", "utf-8"));

async function run() {
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: A4_WIDTH_PX, height: A4_HEIGHT_PX, deviceScaleFactor: 1 });
    await page.emulateMediaType("screen");
    const printUrl = `${FRONTEND_URL}/print/resume?mode=pdf`;
    await page.goto(printUrl, { waitUntil: ["domcontentloaded", "networkidle0"], timeout: 30000 });

    await page.evaluate(({ templateId, resumeData }) => {
      window.__RESUME_PRINT_READY__ = false;
      window.__RESUME_PRINT_PAYLOAD__ = { templateId, resumeData };
      window.dispatchEvent(new Event("resume-print-payload"));
    }, { templateId: 1, resumeData: stressTestData });

    await page.waitForFunction(() => window.__RESUME_PRINT_READY__ === true, { timeout: 30000 });
    await page.waitForSelector(".resume-page", { timeout: 30000 });
    await page.evaluateHandle("document.fonts.ready");

    const page3 = await page.evaluate(() => {
      const page = Array.from(document.querySelectorAll('.resume-page'))[2];
      if (!page) return null;
      const descendants = Array.from(page.querySelectorAll('*')).slice(0, 40).map((el) => ({
        tag: el.tagName,
        className: el.className,
        text: el.textContent?.trim().slice(0, 60) || '',
        scrollHeight: el.scrollHeight,
      }));
      return {
        scrollHeight: page.scrollHeight,
        clientHeight: page.clientHeight,
        descendantCount: descendants.length,
        descendants,
        sectionElements: Array.from(page.querySelectorAll('.resume-section')).map((section) => ({
          tag: section.tagName,
          className: section.className,
          text: section.textContent?.trim().slice(0, 60) || '',
        })),
      };
    });

    const outputPath = 'backend/artifacts/debug-page3-content.json';
    fs.writeFileSync(outputPath, JSON.stringify(page3, null, 2));
    console.log(JSON.stringify({ outputPath, page3 }, null, 2));
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});