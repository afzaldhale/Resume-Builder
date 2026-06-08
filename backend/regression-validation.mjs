import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import puppeteer from 'puppeteer';
import { generateResumePDF } from './src/services/pdfService.js';
import singleFixture from './scripts/fixtures/resume101.json' assert { type: 'json' };
import stressFixture from './fixtures/stress-test-resume.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.join(__dirname, 'artifacts', 'regression-validation');
fs.mkdirSync(outDir, { recursive: true });
const renderBase = process.env.PDF_RENDER_URL || 'http://127.0.0.1:8081';
const templates = [1, 2, 5, 8, 11];
const fixtures = [
  { name: 'single', data: singleFixture, description: 'single-page resume' },
  { name: 'stress', data: stressFixture, description: 'multi-page resume' },
];

const countPDFPages = (buffer) => {
  const text = buffer.toString('binary');
  const matches = text.match(/\/Type\s*\/Page[^s]/g);
  return matches ? matches.length : 1;
};

const run = async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });

  const summary = { preview: [], pdfRoute: [], exportedPDF: [] };

  for (const fixture of fixtures) {
    for (const mode of ['preview', 'pdf']) {
      for (const templateId of templates) {
        const url = `${renderBase}/print/resume?mode=${mode}`;
        const tag = `${fixture.name}-${mode}-template-${templateId}`;
        const screenshotPath = path.join(outDir, `${tag}-screenshot.png`);
        const summaryKey = mode === 'pdf' ? 'pdfRoute' : 'preview';
        console.log(`Validating ${fixture.name} ${mode} template ${templateId}...`);
        await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'], timeout: 30000 });
        await page.evaluate(({ templateId, data }) => {
          window.__RESUME_PRINT_READY__ = false;
          document.documentElement.classList.remove('resume-print-ready');
          window.__RESUME_PRINT_PAYLOAD__ = { templateId, resumeData: data };
          window.dispatchEvent(new Event('resume-print-payload'));
        }, { templateId, data: fixture.data });

        await page.waitForFunction('window.__RESUME_PRINT_READY__ === true', { timeout: 30000 });
        await page.waitForSelector('.resume-page', { timeout: 30000 });
        await new Promise((resolve) => setTimeout(resolve, 500));

        const info = await page.evaluate(() => {
          const headerEls = Array.from(document.querySelectorAll('header'));
          const pageEls = Array.from(document.querySelectorAll('.resume-page'));
          const firstPage = pageEls[0] || null;
          const firstPageHeader = firstPage ? firstPage.querySelector('header') : null;
          return {
            mode: document.location.search.includes('mode=pdf') ? 'pdf' : 'preview',
            url: document.location.href,
            resumePageCount: pageEls.length,
            headerCount: headerEls.length,
            sectionCount: document.querySelectorAll('.resume-section').length,
            firstPageHeaderExists: Boolean(firstPageHeader),
            firstHeaderText: headerEls[0]?.textContent?.trim().slice(0, 120) || null,
            headerElementPath: headerEls[0] ? (() => {
              const parts = [];
              let current = headerEls[0];
              while (current && current.nodeType === Node.ELEMENT_NODE) {
                const selector = current.tagName.toLowerCase() + (current.id ? `#${current.id}` : '') + (current.className ? `.${Array.from(current.classList).join('.')}` : '');
                parts.unshift(selector);
                current = current.parentElement;
              }
              return parts.join(' > ');
            })() : null,
          };
        });

        const firstPageHandle = await page.$('.resume-page');
        if (firstPageHandle) {
          await firstPageHandle.screenshot({ path: screenshotPath, omitBackground: false });
        } else {
          await page.screenshot({ path: screenshotPath, fullPage: true, omitBackground: false });
        }

        summary[summaryKey].push({
          fixture: fixture.name,
          templateId,
          description: fixture.description,
          url,
          screenshot: screenshotPath,
          ...info,
        });
      }
    }

    for (const templateId of templates) {
      const tag = `${fixture.name}-export-template-${templateId}`;
      const pdfPath = path.join(outDir, `${tag}.pdf`);
      console.log(`Generating exported PDF ${fixture.name} template ${templateId}...`);
      const pdfBuffer = await generateResumePDF(fixture.data, templateId, { debugMode: false });
      fs.writeFileSync(pdfPath, pdfBuffer);
      const pages = countPDFPages(pdfBuffer);
      const fileSizeKB = (pdfBuffer.length / 1024).toFixed(1);
      summary.exportedPDF.push({
        fixture: fixture.name,
        templateId,
        description: fixture.description,
        pdfPath,
        fileSizeKB,
        estimatedPageCount: pages,
      });
    }
  }

  const pdfPage = await browser.newPage();
  for (const pdfResult of summary.exportedPDF) {
    const pdfUrl = pathToFileURL(pdfResult.pdfPath).href;
    const pngPath = path.join(outDir, `${path.basename(pdfResult.pdfPath, '.pdf')}-viewer.png`);
    console.log(`Capturing PDF viewer screenshot for ${pdfResult.pdfPath}...`);
    try {
      await pdfPage.goto(pdfUrl, { waitUntil: ['load', 'networkidle0'], timeout: 30000 });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await pdfPage.screenshot({ path: pngPath, fullPage: true });
      pdfResult.viewerScreenshot = pngPath;
    } catch (error) {
      pdfResult.viewerScreenshot = null;
      pdfResult.viewerCaptureError = error.message;
    }
  }

  const reportPath = path.join(outDir, 'regression-validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));
  console.log(`Regression validation report saved: ${reportPath}`);

  await browser.close();
};

run().catch((error) => {
  console.error('Regression validation failed:', error);
  process.exit(1);
});
