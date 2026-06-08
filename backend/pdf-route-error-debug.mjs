import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:8082/print/resume?mode=pdf', { waitUntil: ['domcontentloaded','networkidle0'], timeout: 45000 });
  await page.evaluate(() => {
    window.__ERRORS__ = [];
    window.onerror = function (message, source, lineno, colno, error) {
      window.__ERRORS__.push({ type: 'error', message: message?.toString(), source, lineno, colno, error: error?.message });
    };
    window.onunhandledrejection = function (event) {
      window.__ERRORS__.push({ type: 'unhandledrejection', reason: event.reason?.toString?.() || event.reason });
    };
  });
  await page.evaluate(() => {
    window.__RESUME_PRINT_READY__ = false;
    document.documentElement.classList.remove('resume-print-ready');
    window.__RESUME_PRINT_PAYLOAD__ = {
      templateId: 4,
      resumeData: {
        fullName: 'Test Name',
        role: 'Tester',
        email: 'test@example.com',
        phone: '555-1234',
        address: '123 Test St',
        summary: 'A summary.',
        careerObjective: 'Objective',
        candidateType: 'experienced',
        education: [{ school: 'Test University', degree: 'B.S.', startYear: '2020', endYear: '2024' }],
        experience: [{ company: 'TestCo', role: 'Engineer', startDate: '2021', endDate: 'Present', description: 'Work description.' }],
        projects: [{ name: 'Project', description: 'Desc', technologies: ['React'] }],
        skills: ['React'],
        certifications: [{ name: 'Cert', issuer: 'Issuer', year: '2024' }],
        languages: [{ language: 'English', level: 'Fluent' }],
        strengths: ['Detail oriented'],
        hobbies: ['Reading'],
        achievements: ['Achievement'],
        references: [{ name: 'Ref', relationship: 'Manager', contact: 'ref@test.com' }],
        customSections: [{ title: 'Custom', description: 'Custom text', items: [] }],
        socialLinks: [{ platform: 'LinkedIn', url: 'https://linkedin.com' }],
        theme: {},
      },
    };
    window.dispatchEvent(new Event('resume-print-payload'));
  });
  await page.waitForFunction('window.__RESUME_PRINT_READY__ === true', { timeout: 45000 });
  const info = await page.evaluate(() => ({
    bodyClasses: document.body.className,
    htmlClasses: document.documentElement.className,
    scaleChildCount: document.querySelector('.resume-document-scale')?.children.length,
    childTags: Array.from(document.querySelector('.resume-document-scale')?.children || []).map(c => c.tagName),
    errors: window.__ERRORS__,
    reactRootHTML: document.querySelector('.resume-document-scale')?.outerHTML,
    pageCount: document.querySelectorAll('.resume-page').length,
  }));
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
