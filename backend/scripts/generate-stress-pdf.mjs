import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateResumePDF } from '../src/services/pdfService.js';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURE = path.resolve(__dirname, '../fixtures/stress-test-resume.json');
const OUTDIR = path.resolve(__dirname, '../artifacts');
const OUTFILE = path.join(OUTDIR, 'stress_test_resume.pdf');

(async () => {
  try {
    if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, { recursive: true });
    const raw = fs.readFileSync(FIXTURE, 'utf8');
    const data = JSON.parse(raw);
    console.log('Generating PDF for stress dataset...');
    const pdfBuffer = await generateResumePDF(data, 1, { debugMode: false });
    fs.writeFileSync(OUTFILE, pdfBuffer);
    console.log(`Wrote ${OUTFILE} (${pdfBuffer.length} bytes).`);

    // Also perform a DOM-based page count by loading the print route and asking the renderer
    try {
      const FRONTEND_RENDER_URL = process.env.PDF_RENDER_URL || process.env.FRONTEND_URL || 'http://127.0.0.1:8080';
      const renderUrl = `${FRONTEND_RENDER_URL.replace(/\/$/, '')}/print/resume?mode=pdf`;
      const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
      const page = await browser.newPage();
      await page.setViewport({ width: 794, height: 1123 * 10, deviceScaleFactor: 1 });
      await page.goto(renderUrl, { waitUntil: ['domcontentloaded', 'networkidle0'], timeout: 30000 });

      await page.evaluate(({ nextTemplateId, nextResumeData }) => {
        window.__RESUME_PRINT_READY__ = false;
        window.__RESUME_PRINT_PAYLOAD__ = { templateId: nextTemplateId, resumeData: nextResumeData };
        window.dispatchEvent(new Event('resume-print-payload'));
      }, { nextTemplateId: 1, nextResumeData: data });

      await page.waitForFunction(() => window.__RESUME_PRINT_READY__ === true, { timeout: 30000 });

      const domInfo = await page.evaluate(() => {
        const root = document.querySelector('.resume-theme-root');
        const pages = root ? Array.from(root.querySelectorAll('.page')).length : 0;
        const shell = document.querySelector('.resume-document-shell');
        return {
          pages,
          initialScrollHeight: shell?.dataset.initialScrollHeight || null,
          finalScrollHeight: shell?.dataset.finalScrollHeight || null,
          initialOverflow: shell?.dataset.initialOverflow || null,
          finalOverflow: shell?.dataset.finalOverflow || null,
          compactLevel: shell?.dataset.compactLevel || null,
        };
      });

      console.log(`Renderer DOM reports pages: ${domInfo.pages}`);
      console.log('Renderer measurements:', domInfo);
      await browser.close();
    } catch (e) {
      console.warn('Could not compute DOM page count:', e.message || e);
    }
    process.exit(0);
  } catch (e) {
    console.error('Error generating stress PDF:', e);
    process.exit(2);
  }
})();
