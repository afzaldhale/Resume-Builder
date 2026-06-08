import fs from "fs";
import puppeteer from "puppeteer";

const FRONTEND_URL = process.env.PDF_RENDER_URL || "http://127.0.0.1:8082";
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

    const result = await page.evaluate(() => {
      const page = Array.from(document.querySelectorAll('.resume-page'))[1];
      if (!page) return null;
      const sections = Array.from(page.querySelectorAll('.resume-section'));
      return sections.map((section,index) => ({
        index: index+1,
        title: section.querySelector('.resume-section-title')?.textContent?.trim() || 'unnamed',
        className: section.className,
        scrollHeight: section.scrollHeight,
        childCount: section.children.length,
        outerHTMLPreview: section.outerHTML.slice(0, 400),
      }));
    });
    fs.writeFileSync('backend/artifacts/debug-page2-section-details.json', JSON.stringify(result, null, 2));
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await browser.close();
  }
}
run().catch(err => {
  console.error(err);
  process.exit(1);
});