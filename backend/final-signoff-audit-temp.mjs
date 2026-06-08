import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { pathToFileURL } from 'url';

const workspaceRoot = process.cwd().replace(/\\backend$/, '');
const outDir = path.join(process.cwd(), 'artifacts', 'final-signoff');
fs.mkdirSync(outDir, { recursive: true });
const fixturePath = path.join(workspaceRoot, 'backend', 'scripts', 'fixtures', 'resume101.json');
const fixtureData = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
const templates = Array.from({ length: 15 }, (_, i) => i + 1);
const renderBase = process.env.PDF_RENDER_URL || 'http://127.0.0.1:8082';
const printUrl = (mode) => `${renderBase}/print/resume?mode=${mode}`;
const report = { summary: [], preview: [], pdfRoute: [], export: [], consoleLogs: [], errors: [] };

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] });
const page = await browser.newPage();
await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });
page.on('console', (msg) => report.consoleLogs.push({ type: msg.type(), text: msg.text(), location: msg.location() }));
page.on('pageerror', (err) => report.consoleLogs.push({ type: 'pageerror', text: err.message, stack: err.stack }));

const collectPageMetrics = async () => {
  return page.evaluate(() => {
    const pages = Array.from(document.querySelectorAll('.resume-page'));
    const headers = Array.from(document.querySelectorAll('header'));
    const sections = Array.from(document.querySelectorAll('.resume-section'));
    const firstPage = pages[0] || null;
    const firstPageHeader = firstPage ? firstPage.querySelector('header') : null;
    const firstPageText = firstPage ? firstPage.textContent?.trim() || '' : '';
    const firstPageTextLength = firstPageText.length;
    const firstPageHasHeader = Boolean(firstPageHeader);
    const firstPageTextWithoutHeader = firstPage && firstPageHeader ? firstPage.textContent?.replace(firstPageHeader.textContent || '', '').trim() : firstPageText;
    const firstPageNonHeaderTextLength = firstPageTextWithoutHeader ? firstPageTextWithoutHeader.trim().length : firstPageTextLength;
    const firstPageHeaderVisible = !!(firstPageHeader && firstPageHeader.getBoundingClientRect().height > 2 && firstPageHeader.getBoundingClientRect().width > 2);
    const firstPageBounding = firstPage ? firstPage.getBoundingClientRect() : null;
    const headerBBox = firstPageHeader ? firstPageHeader.getBoundingClientRect() : null;
    const headerInsidePage = firstPageBounding && headerBBox ? headerBBox.top >= firstPageBounding.top - 1 && headerBBox.bottom <= firstPageBounding.bottom + 1 : false;
    return {
      resumePageCount: pages.length,
      headerCount: headers.length,
      sectionCount: sections.length,
      firstPageHeaderExists: firstPageHasHeader,
      firstPageNonHeaderTextLength,
      firstPageTextLength,
      firstPageHeaderVisible,
      headerInsidePage,
      firstPageHeaderText: firstPageHeader?.textContent?.trim().slice(0, 200) || null,
    };
  });
};

for (const mode of ['preview', 'pdf']) {
  for (const templateId of templates) {
    const url = printUrl(mode);
    const tag = `${mode}-template-${templateId}`;
    const screenshotPath = path.join(outDir, `${tag}.png`);
    try {
      console.log(`Validating ${mode.toUpperCase()} route for template ${templateId}...`);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'], timeout: 45000 });
      await page.evaluate(({ templateId, data }) => {
        window.__RESUME_PRINT_READY__ = false;
        document.documentElement.classList.remove('resume-print-ready');
        document.documentElement.removeAttribute('data-resume-print-ready');
        window.__RESUME_PRINT_PAYLOAD__ = { templateId, resumeData: data };
        window.dispatchEvent(new Event('resume-print-payload'));
      }, { templateId, data: fixtureData });
      await page.waitForFunction('window.__RESUME_PRINT_READY__ === true', { timeout: 45000 });
      await page.waitForSelector('.resume-page', { timeout: 45000 });
      await new Promise((resolve) => setTimeout(resolve, 500));
      const m = await collectPageMetrics();
      const firstPage = await page.$('.resume-page');
      if (firstPage) {
        await firstPage.screenshot({ path: screenshotPath });
      } else {
        await page.screenshot({ path: screenshotPath, fullPage: true });
      }
      const pass = m.headerCount > 0 && m.sectionCount > 0 && m.firstPageHeaderExists && m.firstPageNonHeaderTextLength > 10;
      report[mode === 'preview' ? 'preview' : 'pdfRoute'].push({ templateId, mode, url, screenshot: screenshotPath, metrics: m, pass });
      report.summary.push({ templateId, mode, pass, details: m });
    } catch (error) {
      report[mode === 'preview' ? 'preview' : 'pdfRoute'].push({ templateId, mode, url, screenshot: screenshotPath, error: error.message });
      report.summary.push({ templateId, mode, pass: false, error: error.message });
      report.errors.push({ templateId, mode, error: error.message });
    }
  }
}

const pdfService = await import(pathToFileURL(path.join(process.cwd(), 'src', 'services', 'pdfService.js')).href);
for (const templateId of templates) {
  const tag = `export-template-${templateId}`;
  const pdfPath = path.join(outDir, `${tag}.pdf`);
  const viewerScreenshotPath = path.join(outDir, `${tag}-viewer.png`);
  try {
    console.log(`Generating PDF for template ${templateId}...`);
    const buffer = await pdfService.generateResumePDF(fixtureData, templateId, { debugMode: false });
    fs.writeFileSync(pdfPath, buffer);
    const pageCount = (buffer.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length || 1;
    const fileSizeKB = (buffer.length / 1024).toFixed(1);
    let viewerCaptureError = null;
    try {
      const viewerPage = await browser.newPage();
      await viewerPage.setViewport({ width: 900, height: 1200, deviceScaleFactor: 1 });
      const url = pathToFileURL(pdfPath).href;
      await viewerPage.goto(url, { waitUntil: ['load', 'networkidle0'], timeout: 45000 });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await viewerPage.screenshot({ path: viewerScreenshotPath, fullPage: true });
      await viewerPage.close();
    } catch (err) {
      viewerCaptureError = err.message;
    }
    report.export.push({ templateId, pdfPath, pageCount, fileSizeKB, viewerScreenshot: viewerScreenshotPath, viewerCaptureError, success: true });
  } catch (error) {
    report.export.push({ templateId, pdfPath, success: false, error: error.message });
    report.errors.push({ templateId, mode: 'export', error: error.message });
  }
}

const reportPath = path.join(outDir, 'final-signoff-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log('Audit complete. Report written to', reportPath);
await browser.close();
