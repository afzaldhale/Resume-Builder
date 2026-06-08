import fs from "fs";
import puppeteer from "puppeteer";

const FRONTEND_URL = process.env.PDF_RENDER_URL || "http://127.0.0.1:8081";
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;
const stressTestData = JSON.parse(fs.readFileSync("backend/fixtures/stress-test-resume.json", "utf-8"));

async function runDebug() {
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

    const data = await page.evaluate(() => {
      const pageEls = Array.from(document.querySelectorAll('.resume-page'));
      const sections = Array.from(document.querySelectorAll('.resume-section'));
      const pages = pageEls.map((page, pageIndex) => {
        const sectionElements = Array.from(page.querySelectorAll('.resume-section'));
        return {
          pageIndex: pageIndex + 1,
          className: page.className,
          scrollHeight: page.scrollHeight,
          clientHeight: page.clientHeight,
          childCount: page.children.length,
          innerHTMLLength: page.innerHTML.length,
          sectionCount: sectionElements.length,
          sectionTitles: sectionElements.map((section) => {
            const titleEl = section.querySelector('.resume-section-title');
            return titleEl ? titleEl.textContent?.trim() : null;
          }).filter(Boolean),
          sectionHeights: sectionElements.map((section) => ({
            title: section.querySelector('.resume-section-title')?.textContent?.trim() || 'unnamed',
            height: section.scrollHeight,
            innerHTMLLength: section.innerHTML.length,
          })),
        };
      });

      const sectionDetails = sections.map((section) => {
        const page = section.closest('.resume-page');
        return {
          title: section.querySelector('.resume-section-title')?.textContent?.trim() || 'unnamed',
          height: section.scrollHeight,
          page: page ? Array.from(page.parentElement?.children ?? []).indexOf(page) + 1 : null,
          outerHTMLLength: section.outerHTML.length,
          domPath: section.tagName,
          className: section.className,
        };
      });

      const root = document.querySelector('.resume-document-shell');
      const pageRoot = document.querySelector('.resume-theme-root');
      const sourceWrapper = pageRoot && pageRoot.children.length === 1 && pageRoot.children[0].children.length > 0 ? pageRoot.children[0] : null;
      const sourceChildren = sourceWrapper ? Array.from(sourceWrapper.children) : pageRoot ? Array.from(pageRoot.children) : [];
      const sourceChildrenSummary = sourceChildren.map((child) => ({
        tag: child.tagName,
        className: child.className,
        childCount: child.children.length,
        scrollHeight: child.scrollHeight,
        innerHTMLLength: child.innerHTML.length,
      }));

      return {
        pages,
        totalResumeSections: sections.length,
        sectionDetails,
        sourceChildCount: sourceChildren.length,
        sourceChildrenSummary,
        pageRootClassName: pageRoot?.className,
        pageRootChildrenCount: pageRoot?.children.length,
      };
    });

    const outputPath = 'backend/artifacts/debug-page-structure.json';
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    const screenshotPath = 'backend/artifacts/debug-page-structure.png';
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(JSON.stringify({ outputPath, screenshotPath, pages: data.pages }, null, 2));
  } finally {
    await browser.close();
  }
}

runDebug().catch((err) => {
  console.error(err);
  process.exit(1);
});