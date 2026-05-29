import puppeteer from 'puppeteer';
import path from 'path';

(async () => {
  const browser = await puppeteer.launch({args: ['--no-sandbox','--disable-setuid-sandbox']});
  const page = await browser.newPage();
  const file = path.resolve('preview_template3.html');
  await page.goto(`file://${file}`, { waitUntil: 'networkidle0' });
  await page.pdf({ path: 'preview_template3.pdf', format: 'A4', printBackground: true });
  console.log('Wrote preview_template3.pdf');
  await browser.close();
})();
