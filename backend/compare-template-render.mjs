import puppeteer from 'puppeteer';
const payload = {
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
};
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage'] });
const page = await browser.newPage();
page.on('console', msg => console.log('BROWSER:', msg.type(), msg.text()));
page.on('pageerror', err => console.log('PAGEERROR:', err.message));
for (const templateId of [1, 4]) {
  console.log('--- template', templateId, '---');
  await page.goto('http://127.0.0.1:8082/print/resume?mode=pdf', { waitUntil: ['domcontentloaded', 'networkidle0'], timeout: 45000 });
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await page.evaluate((templateId, payload) => {
    window.__RESUME_PRINT_READY__ = false;
    document.documentElement.classList.remove('resume-print-ready');
    window.__RESUME_PRINT_PAYLOAD__ = { templateId, resumeData: payload };
    window.dispatchEvent(new Event('resume-print-payload'));
  }, templateId, payload);
  await page.waitForFunction('window.__RESUME_PRINT_READY__ === true', { timeout: 45000 });
  const info = await page.evaluate(() => {
    const shell = document.querySelector('.resume-document-shell');
    const scale = document.querySelector('.resume-document-scale');
    const children = scale ? Array.from(scale.children).map((c) => ({ tag: c.tagName, className: c.className })) : [];
    return {
      bodyClasses: document.body.className,
      htmlClasses: document.documentElement.className,
      shellChildCount: shell?.children.length,
      scaleChildCount: scale?.children.length,
      scaleChildren: children,
      pageCount: document.querySelectorAll('.resume-page').length,
      themeName: shell?.dataset.resumeMode,
      templateId: shell?.dataset.templateId,
      appHTML: shell?.outerHTML.slice(0, 1200),
    };
  });
  console.log(JSON.stringify(info, null, 2));
}
await browser.close();
