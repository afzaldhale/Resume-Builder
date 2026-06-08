import puppeteer from 'puppeteer';
const url = 'http://127.0.0.1:8080/print/resume?mode=preview';
const payload = { templateId: 1, resumeData: { fullName:'John Doe', role:'Engineer', email:'john@example.com', phone:'1234', address:'Remote', summary:'Summary', education:[{id:'edu-1', school:'X', degree:'Y', field:'CS', startYear:'2018', endYear:'2022', currentlyStudying:false, gpa:'', description:''}], experience:[{id:'exp-1', company:'C', role:'R', location:'L', startDate:'2020-01', endDate:'Present', currentlyWorkingHere:true, description:'Desc'}], skills:['React'], projects:[], languages:[{language:'English', level:'Native'}], certifications:[], achievements:[], references:[], customSections:[], socialLinks:[]}};
const browser = await puppeteer.launch({ headless: 'new', args:['--no-sandbox','--disable-setuid-sandbox']});
const page = await browser.newPage();
await page.setViewport({width: 1200, height: 2000});
await page.goto(url,{waitUntil:['domcontentloaded','networkidle0'], timeout:30000});
await page.evaluate(({payload})=>{window.__RESUME_PRINT_PAYLOAD__ = payload; window.dispatchEvent(new Event('resume-print-payload'));}, {payload});
await page.waitForFunction('window.__RESUME_PRINT_READY__ === true',{timeout:15000});
await page.waitForTimeout(2000);
const info = await page.evaluate(() => {
  const root = document.querySelector('.resume-document-shell');
  const themeRoot = document.querySelector('.resume-theme-root');
  const headers = Array.from(document.querySelectorAll('header')).map(h => ({outer: h.outerHTML.slice(0,500), parent: h.parentElement?.outerHTML?.slice(0,200)}));
  return {
    totalHeaders: headers.length,
    rootOuter: root?.outerHTML.slice(0,500) || null,
    themeRootOuter: themeRoot?.outerHTML.slice(0,500) || null,
    headerHTMLs: headers,
    sectionCount: document.querySelectorAll('.resume-section').length,
    headerInThemeRoot: themeRoot ? themeRoot.querySelectorAll('header').length : null,
    headerInRoot: root ? root.querySelectorAll('header').length : null,
    themeRootText: themeRoot?.textContent?.slice(0,400) || null,
  };
});
console.log(JSON.stringify(info,null,2));
await browser.close();
