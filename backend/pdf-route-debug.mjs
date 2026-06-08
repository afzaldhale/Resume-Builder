import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  page.on('console', (msg) => console.log('BROWSER:', msg.type(), msg.text()));
  page.on('pageerror', (err) => console.log('PAGEERROR:', err.message));
  await page.goto('http://127.0.0.1:8082/print/resume?mode=pdf', { waitUntil: ['domcontentloaded', 'networkidle0'], timeout: 45000 });
  console.log('loaded');
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await page.evaluate(() => {
    window.__RESUME_PRINT_READY__ = false;
    document.documentElement.classList.remove('resume-print-ready');
    window.__RESUME_PRINT_PAYLOAD__ = {
      templateId: 4,
      resumeData: {
        fullName: 'Test',
        role: 'Role',
        email: 'a@b.com',
        phone: '123',
        address: 'Anywhere',
        summary: 'Test',
        careerObjective: 'Obj',
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
      },
    };
    window.dispatchEvent(new Event('resume-print-payload'));
  });
  console.log('payload sent');
  try {
    await page.waitForFunction('window.__RESUME_PRINT_READY__ === true', { timeout: 45000 });
    console.log('ready true');
    const count = await page.evaluate(() => document.querySelectorAll('.resume-page').length);
    console.log('page count', count);
  } catch (err) {
    console.error('ready timeout', err.message);
    const html = await page.content();
    console.log('html snippet', html.slice(0, 2000));
  }
  await browser.close();
})();
