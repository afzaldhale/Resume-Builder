#!/usr/bin/env node

/**
 * PDF Header Loss Investigation - Test Runner
 * 
 * Usage:
 *   node run-pdf-header-audit.js [templateId] [resumeDataFile]
 * 
 * Examples:
 *   node run-pdf-header-audit.js 1
 *   node run-pdf-header-audit.js 3 ./test-resume.json
 */

import debugPDFHeaderLoss from "./debug-pdf-header-loss.js";
import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
const templateId = Number.parseInt(args[0] || "1", 10);
const resumeDataFile = args[1];

// Sample resume data for testing
const sampleResumeData = {
  fullName: "John Doe",
  role: "Senior Software Engineer",
  email: "john@example.com",
  phone: "+1-555-123-4567",
  address: "San Francisco, CA",
  summary: "Experienced software engineer with 10+ years in full-stack development",
  careerObjective: "To leverage my technical expertise in building scalable applications and leading high-performing development teams",
  candidateType: "experienced",
  education: [
    {
      id: "edu-1",
      school: "Stanford University",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startYear: "2012",
      endYear: "2016",
      currentlyStudying: false,
      gpa: "",
      description: "",
    },
  ],
  experience: [
    {
      id: "exp-1",
      company: "Tech Corp",
      role: "Senior Developer",
      location: "San Francisco, CA",
      startDate: "2020-01",
      endDate: "Present",
      currentlyWorkingHere: true,
      description: "Lead development of microservices architecture",
    },
    {
      id: "exp-2",
      company: "StartUp Inc",
      role: "Full Stack Developer",
      location: "Palo Alto, CA",
      startDate: "2018-01",
      endDate: "2020-12",
      currentlyWorkingHere: false,
      description: "Built and maintained production web applications",
    },
  ],
  skills: [
    { id: "skill-1", skill: "JavaScript", proficiency: "Expert", endorse: 0 },
    { id: "skill-2", skill: "React", proficiency: "Expert", endorse: 0 },
    { id: "skill-3", skill: "Node.js", proficiency: "Advanced", endorse: 0 },
    { id: "skill-4", skill: "Python", proficiency: "Intermediate", endorse: 0 },
  ],
  projects: [
    {
      id: "proj-1",
      name: "E-Commerce Platform",
      description: "Built full-stack e-commerce platform using React and Node.js",
      link: "https://example.com",
      technologies: ["React", "Node.js", "PostgreSQL"],
      startDate: "2021-01",
      endDate: "2022-12",
    },
  ],
  languages: [],
  certifications: [],
  achievements: [],
  references: [],
  customSections: [],
  socialLinks: [],
};

async function main() {
  console.log("\n╔════════════════════════════════════════════╗");
  console.log("║   PDF Header Loss Investigation - Auditor  ║");
  console.log("╚════════════════════════════════════════════╝\n");

  let resumeData = sampleResumeData;

  // Load resume data from file if provided
  if (resumeDataFile) {
    try {
      const content = fs.readFileSync(resumeDataFile, "utf-8");
      resumeData = JSON.parse(content);
      console.log(`✓ Loaded resume data from: ${resumeDataFile}\n`);
    } catch (error) {
      console.error(`✗ Failed to load resume data: ${error.message}`);
      process.exit(1);
    }
  } else {
    console.log("ℹ  Using sample resume data\n");
  }

  if (!Number.isInteger(templateId) || templateId < 1 || templateId > 15) {
    console.error(`✗ Invalid template ID: ${templateId}`);
    console.error("   Valid range: 1-15");
    process.exit(1);
  }

  console.log(`Configuration:`);
  console.log(`  Template ID: ${templateId}`);
  console.log(`  Name: ${resumeData.fullName}`);
  console.log(`  Role: ${resumeData.role}\n`);

  try {
    const result = await debugPDFHeaderLoss(resumeData, templateId);
    
    console.log("\n╔════════════════════════════════════════════╗");
    if (result.issue === "NONE") {
      console.log("║           ✅ AUDIT PASSED                  ║");
    } else {
      console.log("║           ❌ AUDIT FAILED                  ║");
      console.log(`║  Issue: ${result.issue.padEnd(37)}║`);
      console.log(`║  Severity: ${result.severity.padEnd(35)}║`);
    }
    console.log("╚════════════════════════════════════════════╝\n");

    if (result.issue !== "NONE") {
      process.exit(1);
    }
  } catch (error) {
    console.error("\n✗ Audit failed with error:", error.message);
    process.exit(1);
  }
}

main();
