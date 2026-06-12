import { template5HTML } from "./src/templates/template5.js";

// Sample resume data for testing
const testData = {
  fullName: "Jane Smith",
  role: "Senior Software Engineer",
  email: "jane@example.com",
  phone: "+1-234-567-8900",
  address: "San Francisco, CA",
  summary: "Experienced engineer with 8+ years building scalable applications.",
  experience: [
    {
      role: "Senior Engineer",
      company: "TechCorp",
      startDate: "2020-01",
      endDate: "2024-01",
      description: "Led team\nArchitected systems\nMentored junior developers",
    },
  ],
  education: [
    {
      degree: "B.S. Computer Science",
      school: "State University",
      startYear: "2012",
      endYear: "2016",
      gpa: "3.8",
    },
  ],
  skills: ["JavaScript", "React", "Node.js", "TypeScript", "AWS"],
  certifications: [
    { name: "AWS Solutions Architect", issuer: "Amazon", year: "2023" },
  ],
  projects: [
    {
      name: "Resume Builder",
      description: "Full-stack resume application",
      technologies: ["React", "Node.js"],
      link: "github.com/user/resume-builder",
    },
  ],
  languages: [
    { language: "English", level: "Native" },
    { language: "Spanish", level: "Fluent" },
  ],
  achievements: [
    "Led migration to microservices architecture",
    "Reduced API response time by 40%",
  ],
  references: [
    {
      name: "John Doe",
      role: "CTO",
      company: "TechCorp",
      email: "john@techcorp.com",
    },
  ],
  customSections: [
    {
      title: "Publications",
      description: "Technical blog with 50+ articles",
    },
  ],
  socialLinks: [
    { platform: "LinkedIn", url: "linkedin.com/in/jane" },
    { platform: "GitHub", url: "github.com/jane" },
  ],
};

console.log("Testing Template5 Backend Migration...\n");

try {
  const html = template5HTML(testData);

  // Verify HTML structure
  const checks = {
    "HTML Document": html.includes("<!DOCTYPE html>"),
    "Name in title": html.includes("Jane Smith"),
    "Page structure": html.includes('<div class="page">'),
    "Header section": html.includes("<header"),
    "Main grid layout": html.includes("main-grid"),
    "Experience section": html.includes("Senior Engineer"),
    "Skills section": html.includes("JavaScript"),
    "Contact info": html.includes("jane@example.com"),
    "All sections included": html.includes("Achievements") && html.includes("References") && html.includes("Publications"),
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
  fs.writeFileSync("./test-template5-output.html", html);
  console.log("Output saved to: test-template5-output.html");

  // Check for any missing Shared.tsx dependencies
  if (html.includes("renderTemplate") || html.includes("sharedTemplate")) {
    console.warn("\n⚠ WARNING: Still has Shared.tsx references!");
  } else {
    console.log("\n✓ No Shared.tsx dependencies detected!");
  }

  console.log("\n✓ Template5 Backend Migration Test Complete!");
} catch (error) {
  console.error("✗ Test failed with error:");
  console.error(error.message);
  process.exit(1);
}
