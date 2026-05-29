import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import fixture from './fixtures/resume101.json' assert { type: 'json' };

const templates = [1,3,6];
const renderUrlBase = (process.env.PDF_RENDER_URL || process.env.FRONTEND_URL || 'http://localhost:8081').replace(/\/$/, '') + '/print/resume?mode=pdf';

const queries = {
  name: ['.resume-header h1, .resume-sidebar h1, .font-bold'],
  role: ['.resume-header p, .resume-sidebar p, .mt-2'],
  heading: ['.section-heading-bar, .resume-section-title, .resume-heading, .resume-section-title-full-width-bar'],
  body: ['.resume-body-copy, .resume-summary-box p, .resume-skills, .resume-item-meta, .resume-item-subtitle'],
  list: ['.resume-bullet-list li, .resume-bullet-list'],
  contact: ['.resume-contact-item, .resume-sidebar .resume-contact-item'],
  meta: ['.resume-item-meta, .resume-item-subtitle'],
};

const run = async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123 });

    for (const id of templates) {
      console.log(`\nChecking template ${id}...`);
      await page.goto(renderUrlBase, { waitUntil: ['domcontentloaded', 'networkidle0'] });

      await page.evaluate(({ t, data }) => {
        window.__RESUME_PRINT_READY__ = false;
        document.documentElement.classList.remove('resume-print-ready');
        window.__RESUME_PRINT_PAYLOAD__ = { templateId: t, resumeData: data };
        window.dispatchEvent(new Event('resume-print-payload'));
      }, { t: id, data: fixture });

      await page.waitForFunction(() => window.__RESUME_PRINT_READY__ === true, { timeout: 30000 });
      await page.waitForSelector('.resume-page', { timeout: 30000 });

      const results = await page.evaluate((queries) => {
        const pickFirst = (selectors) => {
          for (const s of selectors) {
            const el = document.querySelector(s);
            if (el) return window.getComputedStyle(el).fontSize;
          }
          return null;
        };
        const out = {};
        for (const key of Object.keys(queries)) {
          out[key] = pickFirst(queries[key]);
        }
        // also read heading bar width for template 3
        const headingBar = document.querySelector('.template-3-page .section-heading-bar') || document.querySelector('.section-heading-bar, .resume-section-title-full-width-bar, .resume-section-title, .resume-heading');
        if (headingBar) {
          const rect = headingBar.getBoundingClientRect();
          const cs = window.getComputedStyle(headingBar);
          out.headingBar = {
            width: rect.width,
            height: rect.height,
            marginLeft: cs.marginLeft,
            marginRight: cs.marginRight,
            paddingLeft: cs.paddingLeft,
            paddingRight: cs.paddingRight,
            left: cs.left,
            right: cs.right,
            position: cs.position,
            boxSizing: cs.boxSizing,
            scrollWidth: headingBar.scrollWidth,            className: headingBar.className,
            inlineStyle: headingBar.getAttribute('style') || null,          };
        } else {
          out.headingBar = null;
        }
        // compute page and content width
        const pageEl = document.querySelector('.resume-page');
        if (pageEl) {
          const rect = pageEl.getBoundingClientRect();
          out.page = { width: rect.width, height: rect.height };
          // find main content container
          const contentEl = pageEl.querySelector('.resume-main') || pageEl.querySelector('.resume-two-column-layout') || pageEl;
          if (contentEl) {
            const crect = contentEl.getBoundingClientRect();
            out.content = { width: crect.width, height: crect.height };
          }
        }
        return out;
      }, queries);

      console.log('Computed font sizes:', results);

      // Simple checks
      const checks = [];
      const parsePx = (v) => (v ? parseFloat(v.replace('px','')) : null);
      const bodySize = parsePx(results.body) || 0;
      if (bodySize < 10.5) checks.push(`Body too small: ${bodySize}px`);

      // heading bar width check for template 3 (compare against content width if available)
      if (id === 3 && results.headingBar) {
        const contentWidth = results.content?.width || results.page?.width || 794;
        const hbWidth = results.headingBar.width;
        if (hbWidth < contentWidth - 8) checks.push(`Heading bar not full width: ${Math.round(hbWidth)} < ${Math.round(contentWidth)}`);
      }

      if (checks.length === 0) console.log('Checks passed for template', id);
      else console.log('Checks failed for template', id, checks);
    }
  } finally {
    await browser.close();
  }
};

run().catch(err => { console.error(err); process.exit(1); });
