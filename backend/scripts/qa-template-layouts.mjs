import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, "../..");
const outputDir = path.join(workspaceRoot, "artifacts", "template-qa");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://127.0.0.1:4173";
const PRINT_URL = `${FRONTEND_URL.replace(/\/$/, "")}/print/resume`;
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

const longResumeData = {
  fullName: "Alex Morgan Patel",
  email: "alex.patel@example.com",
  phone: "+1 415 555 0199",
  role: "Senior Frontend Engineer",
  address: "San Francisco, California",
  summary:
    "Senior frontend engineer with 8+ years of experience building high-performance web applications, leading UI architecture, improving design systems, and partnering with cross-functional teams to deliver accessible, scalable, and measurable user experiences across enterprise and consumer platforms.",
  education: [
    {
      degree: "B.Tech in Computer Science and Engineering",
      school: "National Institute of Technology",
      startYear: "2012",
      endYear: "2016",
      gpa: "8.7/10",
    },
    {
      degree: "Advanced Certification in Human Computer Interaction",
      school: "Stanford Center for Professional Development",
      startYear: "2018",
      endYear: "2019",
      gpa: "",
    },
    {
      degree: "Certificate in Product Analytics and Experimentation",
      school: "Reforge",
      startYear: "2021",
      endYear: "2021",
      gpa: "",
    },
  ],
  experience: [
    {
      role: "Senior Frontend Engineer",
      company: "Northstar Cloud Systems",
      startDate: "2022",
      endDate: "Present",
      description:
        "Led the migration of a large legacy dashboard to a modern React and TypeScript stack.\nBuilt reusable layout and data visualization primitives used across six product surfaces.\nReduced time-to-interaction by 38% through bundle optimization, progressive rendering, and render-path cleanup.\nPartnered with design and product to improve onboarding flows and raise conversion by 14%.",
    },
    {
      role: "Frontend Engineer",
      company: "PixelForge Labs",
      startDate: "2019",
      endDate: "2022",
      description:
        "Developed enterprise-grade admin interfaces with strong accessibility and internationalization support.\nCreated shared component APIs adopted by multiple teams, reducing duplicate UI work and maintenance overhead.\nWorked closely with backend teams on API contracts, error handling, and analytics instrumentation.",
    },
    {
      role: "UI Developer",
      company: "BlueRiver Digital",
      startDate: "2016",
      endDate: "2019",
      description:
        "Built responsive marketing and account management interfaces for SaaS clients.\nImproved visual consistency by introducing a token-driven design system foundation.\nDelivered performant landing pages and internal tools with strong browser support and clean semantic markup.",
    },
    {
      role: "Freelance Web Developer",
      company: "Independent",
      startDate: "2014",
      endDate: "2016",
      description:
        "Designed and shipped websites and lightweight web apps for small businesses and startups.\nManaged client communication, requirements gathering, implementation, testing, and deployment.",
    },
  ],
  skills: [
    "React",
    "TypeScript",
    "JavaScript",
    "Next.js",
    "Vite",
    "Accessibility",
    "Design Systems",
    "Performance Optimization",
    "HTML5",
    "CSS3",
    "Tailwind CSS",
    "Node.js",
    "REST APIs",
    "GraphQL",
  ],
  projects: [
    {
      name: "Unified Analytics Workspace",
      description:
        "Architected a multi-tenant analytics workspace with flexible reporting, saved views, and collaborative filters for customer success and operations teams.",
      technologies: ["React", "TypeScript", "Recharts", "TanStack Query", "Node.js"],
      link: "https://portfolio.example.com/analytics-workspace",
    },
    {
      name: "Design System Platform",
      description:
        "Created a documentation and component delivery platform that standardized UI implementation across web properties and improved release confidence.",
      technologies: ["Storybook", "TypeScript", "Design Tokens", "Vite"],
      link: "https://portfolio.example.com/design-system",
    },
    {
      name: "Experimentation Dashboard",
      description:
        "Built an experimentation dashboard for PMs and analysts to track A/B test exposure, performance, and rollout health with clear decision support.",
      technologies: ["React", "Charting", "Analytics", "SQL"],
      link: "https://portfolio.example.com/experiments",
    },
  ],
  languages: [
    { language: "English", level: "Native" },
    { language: "Hindi", level: "Fluent" },
    { language: "French", level: "Intermediate" },
    { language: "German", level: "Beginner" },
  ],
  certifications: [
    { name: "Professional Scrum Master I", issuer: "Scrum.org", year: "2023" },
    { name: "Advanced React Patterns", issuer: "Epic React", year: "2022" },
    { name: "Google UX Design Certificate", issuer: "Google", year: "2021" },
  ],
  socialLinks: [
    { platform: "LinkedIn", url: "linkedin.com/in/alexmorganpatel" },
    { platform: "GitHub", url: "github.com/alexmorganpatel" },
    { platform: "Portfolio", url: "alexmorganpatel.dev" },
  ],
  strengths: [
    "Systems thinking",
    "Clear communication",
    "Mentorship",
    "Cross-functional collaboration",
    "Ownership mindset",
    "Product intuition",
  ],
  hobbies: ["Reading", "Running", "Photography", "Travel", "Sketching"],
  achievements: [
    "Speaker at internal frontend guild on rendering performance and design system adoption.",
    "Received quarterly excellence award for delivering a mission-critical analytics release.",
    "Mentored junior engineers who later became feature owners across two product teams.",
    "Improved Lighthouse performance score from 61 to 92 on a customer-facing experience.",
  ],
  references: [
    "Available upon request",
    "Additional professional references can be shared for shortlisted opportunities",
  ],
  customSections: [
    {
      title: "Community",
      description:
        "Volunteer mentor for early-career developers through local community programs and portfolio review sessions.",
      date: "2019 - Present",
      items: [
        "Monthly frontend office hours",
        "Resume and portfolio review sessions",
        "Interview preparation support",
      ],
    },
    {
      title: "Workshops",
      description:
        "Designed and delivered internal workshops on accessibility, component architecture, and frontend performance fundamentals.",
      date: "2021 - Present",
      items: [
        "Accessibility audits",
        "Performance profiling",
        "Scalable component APIs",
      ],
    },
  ],
  candidateType: "experienced",
};

const ensureDir = (dir) => {
  fs.mkdirSync(dir, { recursive: true });
};

const run = async () => {
  ensureDir(outputDir);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--force-color-profile=srgb"],
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: A4_WIDTH,
    height: A4_HEIGHT,
    deviceScaleFactor: 1,
  });

  const results = [];

  for (let templateId = 1; templateId <= 15; templateId += 1) {
    await page.goto(PRINT_URL, {
      waitUntil: ["domcontentloaded", "networkidle0"],
      timeout: 30000,
    });

    await page.evaluate(
      ({ nextTemplateId, nextResumeData }) => {
        window.__RESUME_PRINT_READY__ = false;
        document.documentElement.classList.remove("resume-print-ready");
        document.documentElement.removeAttribute("data-resume-print-ready");
        window.__RESUME_PRINT_PAYLOAD__ = {
          templateId: nextTemplateId,
          resumeData: nextResumeData,
        };
        window.dispatchEvent(new Event("resume-print-payload"));
      },
      {
        nextTemplateId: templateId,
        nextResumeData: longResumeData,
      }
    );

    await page.waitForFunction(() => window.__RESUME_PRINT_READY__ === true, {
      timeout: 30000,
    });

    await page.evaluate(() => document.fonts?.ready ?? Promise.resolve());

    const metrics = await page.evaluate(() => {
      const shell = document.querySelector(".resume-document-shell");
      const scaled = document.querySelector(".resume-document-scale");
      const fitScale = shell?.getAttribute("data-fit-scale") || "1";
      const compactMode = shell?.getAttribute("data-compact-mode") || "false";
      const resumeMode = shell?.getAttribute("data-resume-mode") || "unknown";
      const shellHeight = shell?.getBoundingClientRect().height || 0;
      const contentHeight = scaled?.scrollHeight || 0;
      const bodyHeight = document.body.scrollHeight || 0;

      return {
        fitScale: Number(fitScale),
        compactMode,
        resumeMode,
        shellHeight,
        contentHeight,
        bodyHeight,
        overflowRisk: contentHeight > 1123,
      };
    });

    const screenshotPath = path.join(outputDir, `template-${templateId}.png`);
    await page.screenshot({
      path: screenshotPath,
      clip: {
        x: 0,
        y: 0,
        width: A4_WIDTH,
        height: A4_HEIGHT,
      },
    });

    results.push({
      templateId,
      screenshot: screenshotPath,
      ...metrics,
    });
  }

  const reportPath = path.join(outputDir, "report.json");
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

  await page.close();
  await browser.close();

  console.log(`QA report written to ${reportPath}`);
  console.table(
    results.map((item) => ({
      templateId: item.templateId,
      fitScale: item.fitScale,
      compactMode: item.compactMode,
      overflowRisk: item.overflowRisk,
      contentHeight: item.contentHeight,
    }))
  );
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
