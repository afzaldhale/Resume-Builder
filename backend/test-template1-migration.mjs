import fs from 'fs';
import path from 'path';
import { template1HTML } from './src/templates/template1.js';

const sampleData = {
  fullName: 'John Smith',
  role: 'Senior Software Engineer',
  email: 'john.smith@example.com',
  phone: '+1 555 987 6543',
  address: 'San Francisco, CA 94105',
  socialLinks: [{ platform: 'LinkedIn', url: 'linkedin.com/in/johnsmith' }],
  candidateType: 'experienced',
  summary: 'Experienced software engineer with 8+ years of experience building scalable web applications.',
  skills: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'AWS', 'Docker'],
  experience: [
    {
      role: 'Senior Software Engineer',
      company: 'Tech Corp',
      startDate: 'Jan 2021',
      endDate: 'Present',
      description: 'Led development of microservices architecture\nManaged team of 5 engineers\nImproved system performance by 40%',
      impact: 'Reduced deployment time from 2 hours to 15 minutes'
    },
    {
      role: 'Software Engineer',
      company: 'StartUp Inc',
      startDate: 'Jun 2019',
      endDate: 'Dec 2020',
      description: 'Built REST APIs\nImplemented CI/CD pipeline',
      impact: 'Achieved 99.9% uptime'
    }
  ],
  education: [
    {
      degree: 'BS Computer Science',
      school: 'State University',
      startYear: '2014',
      endYear: '2018',
      gpa: '3.8'
    }
  ],
  projects: [
    {
      name: 'Resume Builder',
      description: 'A full-stack resume builder application',
      impact: 'Completed in 2 weeks with 5000+ downloads',
      technologies: ['React', 'Node.js', 'PostgreSQL']
    }
  ],
  certifications: [
    { name: 'AWS Certified Solutions Architect', issuer: 'Amazon', year: '2022' },
    { name: 'Kubernetes Administrator', issuer: 'CNCF', year: '2021' }
  ],
  languages: [
    { language: 'English', level: 'Native' },
    { language: 'Spanish', level: 'Intermediate' }
  ],
  hobbies: ['Rock Climbing', 'Photography'],
  strengths: ['Problem Solving', 'Team Leadership', 'System Design'],
  achievements: [
    { title: 'Performance Optimization Award', issuer: 'Tech Corp', year: '2023' }
  ],
  references: [
    { name: 'Jane Doe', designation: 'CTO', company: 'Tech Corp', email: 'jane@techcorp.com', phone: '+1 555 123 4567' }
  ],
  customSections: [
    { title: 'Publications', items: ['Paper on Microservices Architecture - 2023'] }
  ]
};

try {
  console.log('🔄 Rendering Template1 with sample data...');
  const html = template1HTML(sampleData);
  
  if (!html || html.length === 0) {
    throw new Error('Template generated empty HTML');
  }
  
  const outPath = path.resolve('test-template1-output.html');
  fs.writeFileSync(outPath, html, 'utf8');
  
  console.log('✅ SUCCESS: Template1 rendered successfully');
  console.log(`📄 Output: ${outPath}`);
  console.log(`📊 HTML size: ${(html.length / 1024).toFixed(2)} KB`);
  
  // Verify key sections exist
  const checks = {
    'Has DOCTYPE': html.includes('<!DOCTYPE'),
    'Has full name': html.includes('John Smith'),
    'Has role': html.includes('Senior Software Engineer'),
    'Has experience section': html.includes('Professional Experience'),
    'Has education section': html.includes('Education'),
    'Has skills section': html.includes('Skills'),
    'Has certifications section': html.includes('Certifications'),
    'Has languages section': html.includes('Languages'),
    'Has projects section': html.includes('Projects'),
    'Has achievements section': html.includes('Achievements'),
    'Has references section': html.includes('References'),
    'Has custom sections': html.includes('Additional Information'),
    'Has page dimensions': html.includes('794px') && html.includes('1123px'),
    'No Shared.js dependency': !html.includes('renderTemplate')
  };
  
  console.log('\n✔️ Content Validation:');
  let allPass = true;
  Object.entries(checks).forEach(([check, passed]) => {
    const icon = passed ? '✅' : '❌';
    console.log(`  ${icon} ${check}`);
    if (!passed) allPass = false;
  });
  
  if (!allPass) {
    process.exit(1);
  }
  
  console.log('\n✨ Template1 migration VERIFIED - all checks passed!');
  
} catch (error) {
  console.error('❌ ERROR:', error.message);
  process.exit(1);
}
