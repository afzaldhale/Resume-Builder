import { template15HTML } from "./src/templates/template15.js";

const testData = {
  fullName: "Ashley Candidate",
  role: "Product Designer",
  email: "ashley@example.com",
  phone: "+1-555-987-6543",
  address: "San Francisco, CA",
  summary: "Creative product designer with 8 years delivering customer-centric experiences.",
  careerObjective: "Looking to join a collaborative design team focused on digital innovation.",
  skills: ["Figma", "Sketch", "User Research", "Prototyping"],
  strengths: ["Empathy", "Attention to Detail", "Cross-functional Collaboration"],
  hobbies: ["Photography", "Travel", "Cooking"],
  experience: [
    {
      role: "Senior Product Designer",
      company: "Creative Labs",
      startDate: "2021-05",
      endDate: "2024-04",
      description: "Led design for a mobile product experience used by millions. Collaborated with engineering and research teams to improve conversion by 22%.",
    },
  ],
  education: [
    {
      degree: "B.Des. Interaction Design",
      school: "Design Institute",
      startYear: "2012",
      endYear: "2016",
    },
  ],
  projects: [
    {
      name: "Mobile App Redesign",
      description: "Designed a new onboarding flow that increased activation by 17%.",
    },
  ],
  certifications: [
    { name: "Certified UX Professional", issuer: "Design Org", date: "2022" },
  ],
  languages: [
    { language: "English", level: "Native" },
    { language: "French", level: "Conversational" },
  ],
  achievements: [
    "Awarded Design Excellence for creating customer-first prototypes",
    "Hosted 12 UX workshops across product teams",
  ],
  references: [
    {
      name: "Sam Manager",
      role: "Director of Product",
      company: "Creative Labs",
      email: "sam@example.com",
    },
  ],
  customSections: [
    {
      title: "Volunteer Work",
      description: "Mentored design students in portfolio reviews and usability testing.",
    },
  ],
  socialLinks: [
    { platform: "LinkedIn", url: "linkedin.com/in/ashley" },
    { platform: "Portfolio", url: "ashley.design" },
  ],
};

console.log("Testing Template15 Backend Migration...\n");

try {
  const html = template15HTML(testData);

  const checks = {
    "HTML Document": html.includes("<!DOCTYPE html>"),
    "Name in output": html.includes("Ashley Candidate"),
    "Role in output": html.includes("Product Designer"),
    "Experience section": html.includes("Senior Product Designer") && html.includes("Creative Labs"),
    "Skills rendered": html.includes("Figma") && html.includes("Sketch"),
    "Strengths rendered": html.includes("Empathy") && html.includes("Attention to Detail"),
    "Hobbies rendered": html.includes("Photography") && html.includes("Travel"),
    "Contact info": html.includes("ashley@example.com"),
    "Education section": html.includes("Interaction Design"),
    "Languages section": html.includes("English"),
    "Achievements rendered": html.includes("Awarded Design Excellence"),
    "References rendered": html.includes("Sam Manager"),
    "Custom sections rendered": html.includes("Volunteer Work"),
  };

  let passCount = 0;
  for (const [check, result] of Object.entries(checks)) {
    const status = result ? "✓ PASS" : "✗ FAIL";
    console.log(`${status}: ${check}`);
    if (result) passCount++;
  }

  console.log(`\nResults: ${passCount}/${Object.keys(checks).length} checks passed`);
  console.log(`\nHTML Output Size: ${(html.length / 1024).toFixed(2)} KB`);

  const fs = await import("fs");
  fs.writeFileSync("./test-template15-output.html", html);
  console.log("Output saved to: test-template15-output.html");

  if (html.includes("renderSupplementarySections") || html.includes("sharedTemplate")) {
    console.warn("\n⚠ WARNING: Still has templateShared.js references!");
  } else {
    console.log("\n✓ No templateShared.js dependencies detected!");
  }

  console.log("\n✓ Template15 Backend Migration Test Complete!");
} catch (error) {
  console.error("✗ Test failed with error:");
  console.error(error.message);
  console.error(error.stack);
  process.exit(1);
}
