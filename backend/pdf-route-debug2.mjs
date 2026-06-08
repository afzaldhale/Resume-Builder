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
        education: [{ school: 'School', degree: 'Degree', startYear: '2020', endYear: '2024' }],
        experience: [{ company: 'Company', role: 'Developer', startDate: 'Jan 2020', endDate: 'Present', description: 'Did stuff.' }],
        projects: [{ name: 'Proj', description: 'Desc', technologies: ['React'] }],
        skills: ['React'],
        certifications: [{ name: 'Cert', issuer: 'Issuer', year: '2024' }],
        languages: [{ language: 'English', level: 'Fluent' }],
        strengths: ['Teamwork'],
        hobbies: ['Reading'],
        achievements: ['Award'],
        references: [{ name: 'Ref', relationship: 'Manager', contact: 'ref@example.com' }],
        customSections: [{ title: 'Custom', description: 'Custom text', items: [] }],
        socialLinks: [{ platform: 'LinkedIn', url: 'https://linkedin.com' }],
        theme: {},
      },
    };
    window.dispatchEvent(new Event('resume-print-payload'));
  });
  console.log('payload sent');
  await page.waitForFunction('window.__RESUME_PRINT_READY__ === true', { timeout: 45000 });
  console.log('ready true');
  const info = await page.evaluate(() => {
    const resumePages = Array.from(document.querySelectorAll('.resume-page'));
    const themeRoots = Array.from(document.querySelectorAll('.resume-theme-root'));
    const pageEls = resumePages.map((el) => ({ classes: el.className, outerHTML: el.outerHTML.slice(0, 800) }));
    return {
      resumePageCount: resumePages.length,
      themeRootCount: themeRoots.length,
      mainExists: Boolean(document.querySelector('main.resume-print-root')),
      printRootHTML: document.querySelector('main.resume-print-root')?.outerHTML.slice(0, 500),
      shellExists: Boolean(document.querySelector('.resume-document-shell')),
      shellHTML: document.querySelector('.resume-document-shell')?.outerHTML.slice(0, 800),
      bodyLength: document.body.innerHTML.length,
      bodySnippet: document.body.innerHTML.slice(0, 1000),
      resumePageInfo: pageEls,
      headers: Array.from(document.querySelectorAll('header')).map((h) => ({ text: h.textContent?.trim().slice(0, 120), className: h.className }))
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
