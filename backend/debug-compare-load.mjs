import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage'] });
const page = await browser.newPage();
page.on('requestfailed', req => console.log('REQUESTFAILED', req.url(), req.failure().errorText));
page.on('requestfinished', async req => {
  const res = req.response();
  if (res && res.status() >= 400) console.log('BAD STATUS', req.url(), res.status());
});
page.on('console', msg => console.log('PAGELOG', msg.text()));
page.on('pageerror', err => console.log('PAGEERROR', err.message));
try {
  const response = await page.goto('http://127.0.0.1:8080/compare-modern-parity.html', { waitUntil: ['load', 'networkidle0'], timeout: 60000 });
  console.log('GOTO', response?.status());
  await page.waitForTimeout(2000);
} catch (e) {
  console.error('ERROR', e);
}
await browser.close();
