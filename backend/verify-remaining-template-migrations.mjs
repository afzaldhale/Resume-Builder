import fs from "fs/promises";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import puppeteer from "puppeteer";
import { template1HTML } from "./src/templates/template1.js";
import { template2HTML } from "./src/templates/template2.js";
import { template3HTML } from "./src/templates/template3.js";
import { template4HTML } from "./src/templates/template4.js";
import { template5HTML } from "./src/templates/template5.js";
import { template6HTML } from "./src/templates/template6.js";
import { template7HTML } from "./src/templates/template7.js";
import { template8HTML } from "./src/templates/template8.js";
import { template9HTML } from "./src/templates/template9.js";
import { template10HTML } from "./src/templates/template10.js";
import { template11HTML } from "./src/templates/template11.js";
import { template12HTML } from "./src/templates/template12.js";
import { template13HTML } from "./src/templates/template13.js";
import { template14HTML } from "./src/templates/template14.js";
import { template15HTML } from "./src/templates/template15.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const artifactsDir = path.join(__dirname, "artifacts", "shared-elimination");

const templateMap = {
  1: template1HTML,
  2: template2HTML,
  3: template3HTML,
  4: template4HTML,
  5: template5HTML,
  6: template6HTML,
  7: template7HTML,
  8: template8HTML,
  9: template9HTML,
  10: template10HTML,
  11: template11HTML,
  12: template12HTML,
  13: template13HTML,
  14: template14HTML,
  15: template15HTML,
};

const payload = {
  fullName: "Isabella Thompson",
  role: "Lead Product Design Manager",
  email: "isabella.thompson@example.com",
  phone: "+44 20 7946 0958",
  address: "London, United Kingdom",
  summary:
    "Design leader with 12+ years of experience delivering digital products across fintech, healthcare, and enterprise SaaS. Expert at scaling design systems, collaborating with cross-functional teams, and turning product strategy into data-driven customer experiences.",
  careerObjective:
    "Create accessible, well-structured, and measurable product experiences while mentoring design teams and improving delivery quality across the organization.",
  education: [
    {
      degree: "M.Sc. Human-Computer Interaction",
      school: "University College London",
      startYear: "2013",
      endYear: "2014",
      gpa: "Distinction",
    },
    {
      degree: "B.A. Graphic Design",
      school: "Goldsmiths, University of London",
      startYear: "2009",
      endYear: "2012",
      gpa: "First Class Honours",
    },
    {
      degree: "Executive Certificate in Product Strategy",
      school: "London Business School",
      startYear: "2020",
      endYear: "2020",
      gpa: "",
    },
  ],
  experience: [
    {
      role: "Lead Product Design Manager",
      company: "FinTech Edge",
      startDate: "2021-01",
      endDate: "Present",
      description:
        "Oversee a team of 14 designers and researchers, delivering omnichannel product experiences for retail banking and wealth management.\nIntroduced a modular design system, improved iteration speed by 45%, and aligned product roadmaps across 5 business units.\nLed stakeholder workshops, coached senior designers, and defined UX metrics used across the organisation.",
    },
    {
      role: "Senior UX Designer",
      company: "Healthwave Labs",
      startDate: "2018-02",
      endDate: "2021-01",
      description:
        "Designed patient-facing mobile and web applications for chronic care management.\nPartnered with product, engineering, and clinical teams to deliver compliant interfaces that increased active user retention by 28%.\nCreated research plans, personas, and accessibility guidelines for inclusive care journeys.",
    },
    {
      role: "UX Designer",
      company: "Studio Interactive",
      startDate: "2014-06",
      endDate: "2018-01",
      description:
        "Delivered digital product experiences for high-growth startups and global brands.\nOwned information architecture, interaction design, prototyping, usability testing, and design system governance.\nCollaborated with clients to translate business goals into clear product concepts and visual strategy.",
    },
    {
      role: "Product Design Consultant",
      company: "Independent",
      startDate: "2012-08",
      endDate: "2014-05",
      description:
        "Supported early-stage companies with product discovery, brand systems, and interface audits.\nHelped launch MVPs, define product direction, and establish usable component patterns for internal teams.",
    },
  ],
  skills: [
    "Design Systems",
    "Product Strategy",
    "UX Research",
    "Accessibility",
    "Figma",
    "Prototyping",
    "Stakeholder Alignment",
    "Agile Collaboration",
    "Service Design",
    "Design Operations",
    "Mentoring",
    "Cross-functional Leadership",
  ],
  projects: [
    {
      name: "Global Launch Experience",
      description:
        "Led the end-to-end design work for a global product launch, coordinating multi-market localization, legal reviews, and cross-team validation. Resulted in a 24% increase in conversion for international users.",
      technologies: ["Figma", "Miro", "UserTesting"],
      link: "https://example.com/global-launch",
    },
    {
      name: "Design System Transformation",
      description:
        "Developed a scalable component library and design tokens system used by product, engineering, and marketing teams. Reduced duplicate work and design inconsistencies across seven products.",
      technologies: ["Storybook", "CSS", "React"],
      link: "",
    },
    {
      name: "Clinical Care Journey Redesign",
      description:
        "Redesigned core onboarding and care-plan workflows for a healthcare product used by patients, caregivers, and clinical teams across multiple regions.",
      technologies: ["Figma", "FigJam", "Maze"],
      link: "https://example.com/care-journey",
    },
  ],
  languages: [
    { language: "English", level: "Native" },
    { language: "French", level: "Fluent" },
    { language: "German", level: "Intermediate" },
    { language: "Spanish", level: "Conversational" },
  ],
  certifications: [
    { name: "Certified Scrum Product Owner", issuer: "Scrum Alliance", year: "2022" },
    { name: "Nielsen Norman Group UX Certification", issuer: "NNG", year: "2020" },
    { name: "Accessibility Professional Certificate", issuer: "Deque", year: "2021" },
    { name: "Design Leadership Masterclass", issuer: "IDEO U", year: "2023" },
  ],
  socialLinks: [
    { platform: "LinkedIn", url: "linkedin.com/in/isabella-thompson" },
    { platform: "Portfolio", url: "isabellathompson.design" },
    { platform: "Dribbble", url: "dribbble.com/isabella-thompson" },
  ],
  strengths: [
    "Empathy-driven design",
    "Cross-functional leadership",
    "Data-informed decision making",
    "Design mentorship",
    "Systems thinking",
  ],
  hobbies: ["Landscape photography", "Cycling", "Creative writing", "Travel sketching"],
  achievements: [
    "Delivered 3 major product launches within 18 months.",
    "Reduced design debt by 30% through component reuse.",
    "Built a design leadership guild spanning 5 product areas.",
  ],
  references: ["Available on request", "Senior leaders and stakeholders available upon request"],
  customSections: [
    {
      title: "Selected Thought Leadership",
      description:
        "Published articles on design systems, product culture, and accessibility in leading industry publications. Regular speaker at UX conferences and internal design summits.",
      date: "2024",
      items: [
        "Designing for scale in regulated industries",
        "Building design operations for faster delivery",
      ],
    },
    {
      title: "Community",
      description:
        "Volunteer mentor for early-career designers and host of a monthly peer critique circle focused on portfolio storytelling.",
      date: "Ongoing",
      items: ["ADPList mentor", "Portfolio workshop facilitator"],
    },
  ],
  candidateType: "experienced",
  compactLevel: 0,
};

const renderArtifacts = async () => {
  await fs.mkdir(artifactsDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const summary = [];

  try {
    for (const [templateId, render] of Object.entries(templateMap)) {
      const html = render(payload);
      const baseName = `template${templateId}-verification`;
      const htmlPath = path.join(artifactsDir, `${baseName}.html`);
      const pngPath = path.join(artifactsDir, `${baseName}.png`);
      const pdfPath = path.join(artifactsDir, `${baseName}.pdf`);

      await fs.writeFile(htmlPath, html, "utf8");

      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 1800, deviceScaleFactor: 1.5 });
      await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle0" });
      await page.screenshot({ path: pngPath, fullPage: true });
      await page.pdf({
        path: pdfPath,
        format: "A4",
        printBackground: true,
        margin: { top: "0", right: "0", bottom: "0", left: "0" },
      });
      await page.close();

      summary.push({
        templateId: Number(templateId),
        htmlPath,
        pngPath,
        pdfPath,
      });
    }
  } finally {
    await browser.close();
  }

  const reportPath = path.join(artifactsDir, "verification-summary.json");
  await fs.writeFile(reportPath, JSON.stringify(summary, null, 2), "utf8");
  console.log(`Generated artifacts for ${summary.length} templates at ${artifactsDir}`);
};

renderArtifacts().catch((error) => {
  console.error(error);
  process.exit(1);
});
