import fs from 'fs';
import path from 'path';

/**
 * ⚠️ DEPRECATED: This is a legacy development utility
 * 
 * The backend template system is deprecated. PDF generation now uses:
 * - Frontend: React ResumeDocument component
 * - Route: /print/resume (puppeteer-based PDF capture)
 * 
 * This file is kept for reference/debugging only and should not be used in production.
 */

import { template3HTML } from './src/templates_legacy/template3.js';

const sampleData = {
  fullName: 'Jane Doe',
  role: 'Frontend Developer',
  email: 'jane.doe@example.com',
  phone: '+1 555 123 4567',
  address: 'San Francisco, CA',
  socialLinks: [{ platform: 'LinkedIn', url: 'linkedin.com/in/janedoe' }],
  skills: ['React', 'TypeScript', 'CSS', 'Node.js'],
  education: [
    { degree: 'BSc Computer Science', school: 'State University', startYear: '2014', endYear: '2018', gpa: '3.7' }
  ],
  experience: [
    { role: 'Frontend Developer', company: 'Acme Inc', startDate: '2019', endDate: '2023', description: 'Built user interfaces.\nLed accessibility improvements.' }
  ],
  projects: [ { name: 'Resume Builder', description: 'A resume builder app', technologies: ['React','Node'] } ],
  certifications: [ { name: 'AWS Certified', issuer: 'Amazon', year: '2022' } ],
  languages: [ { language: 'English', level: 'Native' }, { language: 'Spanish', level: 'Intermediate' } ],
  hobbies: ['Photography', 'Cycling'],
  strengths: ['Problem solving', 'Teamwork'],
  achievements: [],
  references: [],
  customSections: []
};

const html = template3HTML(sampleData);
const outPath = path.resolve('preview_template3.html');
fs.writeFileSync(outPath, html, 'utf8');
console.log('Wrote', outPath);
