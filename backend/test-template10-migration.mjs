import { template10HTML } from "./src/templates/template10.js";

// Sample resume data for testing
const testData = {
  fullName: "John Developer",
  role: "Full Stack Engineer",
  email: "john@example.com",
  phone: "+1-555-123-4567",
  address: "New York, NY",
  summary: "10+ years building scalable web applications with modern tech stack.",
  experience: [
    {
      role: "Lead Engineer",
      company: "TechCorp",
      startDate: "2020-01",
      endDate: "2024-01",
      description: "Architected microservices platform\nLead team of 8 engineers\nImplemented CI/CD pipeline",
    },
  ],
  education: [
    {
      degree: "B.S. Computer Science",
      school: "Tech University",
      startYear: "2010",
      endYear: "2014",
      gpa: "3.9",
    },
  ],
  skills: ["React", "Node.js", "TypeScript", "AWS", "Docker", "PostgreSQL"],
  certifications: [
    { name: "AWS Solutions Architect", issuer: "Amazon", year: "2023" },
  ],
  projects: [
    {
      name: "Resume Builder Platform",
      description: "Full-stack resume application used by 50K+ users",
      technologies: ["React", "Node.js", "PostgreSQL"],
      link: "github.com/user/resume-builder",
    },
  ],
  languages: [
    { language: "English", level: "Native" },
    { language: "Spanish", level: "Intermediate" },
  ],
  achievements: [
    "Reduced API latency by 60%",
    "Implemented automated testing framework",
  ],
  references: [
    {
      name: "Jane Supervisor",
      role: "CTO",
      company: "TechCorp",
      email: "jane@techcorp.com",
    },
  ],
  customSections: [
    {
      title: "Publications",
      description: "Technical blog with 100+ articles on web development",
    },
  ],
  socialLinks: [
    { platform: "LinkedIn", url: "linkedin.com/in/john" },
    { platform: "GitHub", url: "github.com/john" },
  ],
};

console.log("Testing Template10 Backend Migration...\n");

try {
  const html = template10HTML(testData);

  // Verify HTML structure
  const checks = {
    "HTML Document": html.includes("<!DOCTYPE html>"),
    "Name in output": html.includes("John Developer"),
    "Job title": html.includes("Full Stack Engineer"),
    "Experience section": html.includes("Lead Engineer") && html.includes("TechCorp"),
    "Skills rendered": html.includes("React") && html.includes("Node.js"),
    "Contact info": html.includes("john@example.com"),
    "Education section": html.includes("Computer Science"),
    "Languages section": html.includes("English"),
    "Achievements rendered": html.includes("Reduced API latency"),
    "References rendered": html.includes("Jane Supervisor"),
    "Custom sections rendered": html.includes("Publications"),
  };

  let passCount = 0;
  for (const [check, result] of Object.entries(checks)) {
    const status = result ? "✓ PASS" : "✗ FAIL";
    console.log(`${status}: ${check}`);
    if (result) passCount++;
  }

  console.log(`\nResults: ${passCount}/${Object.keys(checks).length} checks passed`);
  console.log(`\nHTML Output Size: ${(html.length / 1024).toFixed(2)} KB`);

  // Save output for manual inspection
  const fs = await import("fs");
  fs.writeFileSync("./test-template10-output.html", html);
  console.log("Output saved to: test-template10-output.html");

  // Check for any missing templateShared.js dependencies
  if (html.includes("renderSupplementarySections") || html.includes("sharedTemplate")) {
    console.warn("\n⚠ WARNING: Still has templateShared.js references!");
  } else {
    console.log("\n✓ No templateShared.js dependencies detected!");
  }

  console.log("\n✓ Template10 Backend Migration Test Complete!");
} catch (error) {
  console.error("✗ Test failed with error:");
  console.error(error.message);
  console.error(error.stack);
  process.exit(1);
}
