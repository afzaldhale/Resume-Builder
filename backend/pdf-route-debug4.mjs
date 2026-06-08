import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGEERROR:', err.message));
  await page.goto('http://127.0.0.1:8082/print/resume?mode=pdf', { waitUntil: ['domcontentloaded', 'networkidle0'], timeout: 45000 });
  await new Promise(res => setTimeout(res, 1000));
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
  const info = await page.evaluate(() => {
    const scale = document.querySelector('.resume-document-scale');
    return {
      scaleChildCount: scale?.children.length,
      scaleHTML: scale?.innerHTML.slice(0, 1200),
      scaleTextLength: scale?.textContent?.length,
      pageClassNames: Array.from(document.querySelectorAll('.resume-document-scale *')).slice(0, 20).map(el => el.tagName + (el.className ? '.' + el.className : '')),
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
