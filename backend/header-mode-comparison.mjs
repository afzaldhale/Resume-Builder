import puppeteer from 'puppeteer';
const url = 'http://127.0.0.1:8080/print/resume';
const templateIds = [1,2,5,8,11];
const payloadData = {
  fullName: 'John Doe',
  role: 'Software Engineer',
  email: 'john@example.com',
  phone: '+1-555-000-0000',
  address: 'San Francisco, CA',
  summary: 'Experienced developer.',
  education: [{ id: 'edu-1', school: 'Stanford', degree: 'BS CS', field: 'CS', startYear: '2015', endYear: '2019', currentlyStudying: false, gpa: '', description: '' }],
  experience: [{ id: 'exp-1', company: 'Acme', role: 'Developer', location: 'CA', startDate: '2020-01', endDate: 'Present', currentlyWorkingHere: true, description: 'Built apps.' }],
  skills: ['React', 'TypeScript'],
  projects: [{ id: 'proj-1', name: 'Project X', description: 'A project', link: 'http://example.com', technologies: ['React'], startDate: '2021-01', endDate: '2022-01' }],
  languages: [{ language: 'English', level: 'Native' }],
  certifications: [{ id: 'cert-1', name: 'Cert', issuer: 'Issuer', year: '2021' }],
  achievements: ['Achievement'],
  references: [],
  customSections: [],
  socialLinks: [{ platform: 'LinkedIn', url: 'https://linkedin.com/in/johndoe' }],
};
const browser = await puppeteer.launch({ headless: 'new', args:['--no-sandbox','--disable-setuid-sandbox']});
const page = await browser.newPage();
await page.setViewport({width: 1200, height: 1800});
const results = [];
for (const mode of ['preview','pdf']) {
  for (const templateId of templateIds) {
    const fullUrl = `${url}?mode=${mode}`;
    await page.goto(fullUrl,{waitUntil:['domcontentloaded','networkidle0'],timeout:30000});
    await page.evaluate(({templateId, payloadData}) => {
      window.__RESUME_PRINT_PAYLOAD__ = { templateId, resumeData: payloadData };
      window.dispatchEvent(new Event('resume-print-payload'));
    }, {templateId, payloadData});
    await page.waitForFunction('window.__RESUME_PRINT_READY__ === true', {timeout:15000});
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const snapshot = await page.evaluate(() => {
      const headers = Array.from(document.querySelectorAll('header')).map((h) => ({outerHTML: h.outerHTML.slice(0, 400), parentClasses: h.parentElement?.className || null}));
      const sectionCount = document.querySelectorAll('.resume-section').length;
      const resumePage = document.querySelector('.resume-theme-root');
      const firstChild = resumePage?.firstElementChild ? { tag: resumePage.firstElementChild.tagName.toLowerCase(), classes: resumePage.firstElementChild.className || null } : null;
      const resumeRootText = resumePage?.textContent?.slice(0,200) || null;
      return { headers, sectionCount, firstChild, resumeRootText };
    });
    results.push({ mode, templateId, ...snapshot, headerCount: snapshot.headers.length });
    console.log(`mode=${mode} template=${templateId} headers=${snapshot.headers.length} sections=${snapshot.sectionCount} firstChild=${JSON.stringify(snapshot.firstChild)}`);
  }
}
await browser.close();
fs.writeFileSync('header-mode-comparison.json', JSON.stringify(results, null, 2));
