import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { pathToFileURL } from 'url';

const workspaceRoot = process.cwd().replace(/\\backend$/, '');
const outDir = path.join(process.cwd(), 'artifacts', 'release-readiness');
fs.mkdirSync(outDir, { recursive: true });

const singleFixture = JSON.parse(fs.readFileSync(path.join(workspaceRoot, 'backend', 'scripts', 'fixtures', 'resume101.json'), 'utf8'));
const stressFixture = JSON.parse(fs.readFileSync(path.join(workspaceRoot, 'backend', 'fixtures', 'stress-test-resume.json'), 'utf8'));
const minimalFixture = {
  fullName: 'Minimal Resume',
  role: 'Entry-Level Candidate',
  email: 'minimal@example.com',
  phone: '+1 000 000 0000',
  address: 'Nowhere, Earth',
  summary: '',
  careerObjective: '',
  candidateType: 'experienced',
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certifications: [],
  languages: [],
  strengths: [],
  hobbies: [],
  achievements: [],
  references: [],
  customSections: [],
  socialLinks: [],
  theme: {},
};

const templates = Array.from({ length: 11 }, (_, i) => i + 1);
const fixtures = [
  { name: 'single', description: 'Normal resume fixture', data: singleFixture },
  { name: 'stress', description: 'Long-content stress fixture', data: stressFixture },
  { name: 'minimal', description: 'Empty/minimal resume fixture', data: minimalFixture },
];

const renderBase = process.env.PDF_RENDER_URL || 'http://127.0.0.1:8082';
const printPreviewUrl = (mode) => `${renderBase}/print/resume?mode=${mode}`;

const collectPageMetrics = async (page) => {
  return page.evaluate(() => {
    const pages = Array.from(document.querySelectorAll('.resume-page'));
    const headers = Array.from(document.querySelectorAll('header'));
    const sections = Array.from(document.querySelectorAll('.resume-section'));
    const pageRects = pages.map((page) => {
      const rect = page.getBoundingClientRect();
      return {
        top: rect.top,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
        scrollHeight: page.scrollHeight,
        clientHeight: page.clientHeight,
      };
    });
    const pageOverlap = pageRects.some((rect, index) => {
      if (index === 0) return false;
      const prev = pageRects[index - 1];
      return rect.top < prev.bottom - 1;
    });
    const pageOverflow = pageRects.some((rect) => rect.scrollHeight > rect.clientHeight + 1);
    return {
      resumePageCount: pages.length,
      headerCount: headers.length,
      sectionCount: sections.length,
      firstPageHeaderExists: pages.length > 0 ? Boolean(pages[0].querySelector('header')) : false,
      pageOverlap,
      pageOverflow,
      firstHeaderText: headers[0]?.textContent?.trim().slice(0, 140) || null,
      headerPaths: headers.map((header) => {
        const parts = [];
        let current = header;
        while (current && current.nodeType === Node.ELEMENT_NODE) {
          const selector = current.tagName.toLowerCase() + (current.id ? `#${current.id}` : '') + (current.className ? `.${Array.from(current.classList).join('.')}` : '');
          parts.unshift(selector);
          current = current.parentElement;
        }
        return parts.join(' > ');
      }),
      sectionTitles: sections.map((section) => section.querySelector('h2')?.textContent?.trim() || null),
    };
  });
};

const run = async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });

  const report = { summary: [], consoleLogs: [], preview: [], pdfRoute: [], exportedPDF: [] };

  page.on('console', (msg) => {
    report.consoleLogs.push({ type: msg.type(), text: msg.text(), location: msg.location() });
  });
  page.on('pageerror', (error) => {
    report.consoleLogs.push({ type: 'pageerror', text: error.message, stack: error.stack });
  });

  for (const fixture of fixtures) {
    for (const mode of ['preview', 'pdf']) {
      for (const templateId of templates) {
        const url = printPreviewUrl(mode);
        const tag = `${fixture.name}-${mode}-template-${templateId}`;
        const screenshotPath = path.join(outDir, `${tag}-screenshot.png`);
        console.log(`Auditing ${fixture.name} ${mode} template ${templateId}...`);
        await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle0'], timeout: 45000 });
        await page.evaluate(({ templateId, data }) => {
          window.__RESUME_PRINT_READY__ = false;
          document.documentElement.classList.remove('resume-print-ready');
          window.__RESUME_PRINT_PAYLOAD__ = { templateId, resumeData: data };
          window.dispatchEvent(new Event('resume-print-payload'));
        }, { templateId, data: fixture.data });

        await page.waitForFunction('window.__RESUME_PRINT_READY__ === true', { timeout: 45000 });
        await page.waitForSelector('.resume-page', { timeout: 45000 });
        await new Promise((resolve) => setTimeout(resolve, 500));

        const metrics = await collectPageMetrics(page);
        const firstPage = await page.$('.resume-page');
        if (firstPage) {
          await firstPage.screenshot({ path: screenshotPath });
        } else {
          await page.screenshot({ path: screenshotPath, fullPage: true });
        }
        report[mode === 'pdf' ? 'pdfRoute' : 'preview'].push({ fixture: fixture.name, templateId, description: fixture.description, mode, url, screenshot: screenshotPath, ...metrics });
      }
    }
  }

  const pdfService = await import(pathToFileURL(path.join(process.cwd(), 'src', 'services', 'pdfService.js')).href);
  for (const fixture of fixtures) {
    for (const templateId of templates) {
      const tag = `${fixture.name}-export-template-${templateId}`;
      const pdfPath = path.join(outDir, `${tag}.pdf`);
      console.log(`Exporting PDF ${fixture.name} template ${templateId}...`);
      const buffer = await pdfService.generateResumePDF(fixture.data, templateId, { debugMode: false });
      fs.writeFileSync(pdfPath, buffer);
      const pages = (buffer.toString('binary').match(/\/Type\s*\/Page[^s]/g) || []).length || 1;
      report.exportedPDF.push({ fixture: fixture.name, templateId, description: fixture.description, pdfPath, pages, fileSizeKB: (buffer.length / 1024).toFixed(1) });
    }
  }

  const pdfViewerPage = await browser.newPage();
  for (const entry of report.exportedPDF) {
    const viewerPath = path.join(outDir, `${path.basename(entry.pdfPath, '.pdf')}-viewer.png`);
    const pdfUrl = pathToFileURL(entry.pdfPath).href;
    console.log(`Capturing viewer screenshot for ${entry.pdfPath}...`);
    try {
      await pdfViewerPage.goto(pdfUrl, { waitUntil: ['load', 'networkidle0'], timeout: 30000 });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await pdfViewerPage.screenshot({ path: viewerPath, fullPage: true });
      entry.viewerScreenshot = viewerPath;
    } catch (error) {
      entry.viewerScreenshot = null;
      entry.viewerCaptureError = error.message;
    }
  }

  const reportPath = path.join(outDir, 'release-readiness-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`Release readiness report saved: ${reportPath}`);

  await browser.close();
};

run().catch((error) => {
  console.error('Release readiness audit failed:', error);
  process.exit(1);
});
