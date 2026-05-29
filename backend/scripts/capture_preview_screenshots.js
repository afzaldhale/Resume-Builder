import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import fixture from './fixtures/resume101.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.join(__dirname, '..', 'artifacts');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const templates = [1,3,6];
const renderUrl = (process.env.PDF_RENDER_URL || process.env.FRONTEND_URL || 'http://localhost:8081').replace(/\/$/, '') + '/print/resume?mode=pdf';

const run = async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123 });
    for (const id of templates) {
      console.log(`Capturing template ${id} preview...`);
      await page.goto(renderUrl, { waitUntil: ['domcontentloaded', 'networkidle0'] });
      await page.evaluate(({ t, data }) => {
        window.__RESUME_PRINT_READY__ = false;
        document.documentElement.classList.remove('resume-print-ready');
        window.__RESUME_PRINT_PAYLOAD__ = { templateId: t, resumeData: data };
        window.dispatchEvent(new Event('resume-print-payload'));
      }, { t: id, data: fixture });

      await page.waitForFunction(() => window.__RESUME_PRINT_READY__ === true, { timeout: 30000 });
      await page.waitForSelector('.resume-page', { timeout: 30000 });

      const handle = await page.$('.resume-page');
      const outPath = path.join(outDir, `resume-template-${id}-preview.png`);
      if (handle) {
        await handle.screenshot({ path: outPath, omitBackground: false });
        console.log(`Saved preview screenshot ${outPath}`);
      } else {
        // fallback full page
        const outPathFull = path.join(outDir, `resume-template-${id}-preview-full.png`);
        await page.screenshot({ path: outPathFull, fullPage: true });
        console.log(`Saved full page preview ${outPathFull}`);
      }
    }
  } finally {
    await browser.close();
  }
};

run().catch(err => { console.error(err); process.exit(1); });
