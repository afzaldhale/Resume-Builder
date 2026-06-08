const fs = require('fs');
const p = 'D:/VtechOffical/Resume_builder/backend/artifacts/resume-template-1.pdf';
if (!fs.existsSync(p)) { console.error('MISSING'); process.exit(2); }
const s = fs.statSync(p);
console.log('name: resume-template-1.pdf');
console.log('sizeKB:', Math.round(s.size/1024*100)/100);
console.log('mtime:', s.mtime.toISOString());
