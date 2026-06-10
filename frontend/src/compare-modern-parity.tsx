import React from "react";
import { createRoot } from "react-dom/client";
import { renderTemplate } from "@/components/resume-templates/shared";
import ModernLayout from "@/components/resume-layouts/ModernLayout";
import { templateThemes } from "@/components/resume-templates/templateThemes";

const payload = {
  fullName: "Isabella Thompson",
  role: "Lead Product Design Manager",
  email: "isabella.thompson@example.com",
  phone: "+44 20 7946 0958",
  address: "London, United Kingdom",
  summary:
    "Design leader with 12+ years of experience delivering digital products across fintech, healthcare, and enterprise SaaS. Expert at scaling design systems, collaborating with cross-functional teams, and turning product strategy into data-driven customer experiences.",
  careerObjective: "",
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
  ],
  experience: [
    {
      role: "Lead Product Design Manager",
      company: "FinTech Edge",
      startDate: "2021",
      endDate: "Present",
      description:
        "Oversee a team of 14 designers and researchers, delivering omnichannel product experiences for retail banking and wealth management. Introduced a modular design system, improved iteration speed by 45%, and aligned product roadmaps across 5 business units.\n\nLed stakeholder workshops, coached senior designers, and defined UX metrics used across the organisation.",
    },
    {
      role: "Senior UX Designer",
      company: "Healthwave Labs",
      startDate: "2018",
      endDate: "2021",
      description:
        "Designed patient-facing mobile and web applications for chronic care management. Partnered with product, engineering, and clinical teams to deliver HIPAA-compliant interfaces that increased active user retention by 28%.\n\nCreated design research plans, personas, and accessibility guidelines for inclusive care journeys.",
    },
    {
      role: "UX Designer",
      company: "Studio Interactive",
      startDate: "2014",
      endDate: "2018",
      description:
        "Delivered digital product experiences for high-growth startups and global brands. Responsibilities included information architecture, interaction design, prototyping, usability testing, and design system governance.\n\nCollaborated with clients to translate business goals into clear product concepts and visual strategy.",
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
  ],
  languages: [
    { language: "English", level: "Native" },
    { language: "French", level: "Fluent" },
    { language: "German", level: "Intermediate" },
  ],
  certifications: [
    { name: "Certified Scrum Product Owner", issuer: "Scrum Alliance", year: "2022" },
    { name: "Nielsen Norman Group UX Certification", issuer: "NNG", year: "2020" },
    { name: "Accessibility Professional Certificate", issuer: "Deque", year: "2021" },
  ],
  socialLinks: [
    { platform: "LinkedIn", url: "linkedin.com/in/isabella-thompson" },
    { platform: "Portfolio", url: "isabellathompson.design" },
  ],
  strengths: [
    "Empathy-driven design",
    "Cross-functional leadership",
    "Data-informed decision making",
    "Design mentorship",
  ],
  hobbies: ["Landscape photography", "Cycling", "Creative writing"],
  achievements: [
    "Delivered 3 major product launches within 18 months.",
    "Reduced design debt by 30% through component reuse.",
  ],
  references: ["Available on request"],
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
  ],
  candidateType: "experienced",
  compactLevel: 0,
};

const templateIds = [1, 3, 7, 10, 12];

const getTextContent = (el: Element | null) => (el?.textContent || "").trim();

const getMetrics = (container: HTMLElement) => {
  const root = container.querySelector(".resume-theme-root");
  const nameHeading = root?.querySelector("header h1");
  const roleParagraph = root?.querySelector("header p");
  const firstSectionTitle = root?.querySelector(".resume-section-title");
  const firstBodyCopy = root?.querySelector(".resume-body-copy");
  const summaryBox = root?.querySelector(".resume-summary-box");
  const pages = Array.from(root?.querySelectorAll(".resume-page") || []);
  const sectionTitles = Array.from(root?.querySelectorAll(".resume-section-title") || []).map(getTextContent);
  const contactItems = Array.from(root?.querySelectorAll(".resume-contact-item") || []).map(getTextContent);
  const containerGap = getComputedStyle(container).gap;
  const pagePadding = root ? getComputedStyle(root).padding : "";
  const sectionGap = root ? getComputedStyle(root.querySelector(".flex.h-full.flex-col") || root).gap : "";

  const computed = (el: Element | null, prop: string) => el ? getComputedStyle(el).getPropertyValue(prop) : "";

  return {
    pageCount: pages.length,
    sectionTitles,
    contactItems,
    headerText: getTextContent(root?.querySelector("header")),
    nameFontSize: computed(nameHeading, "font-size"),
    nameLineHeight: computed(nameHeading, "line-height"),
    roleFontSize: computed(roleParagraph, "font-size"),
    roleLineHeight: computed(roleParagraph, "line-height"),
    sectionHeadingFontSize: computed(firstSectionTitle, "font-size"),
    bodyFontSize: computed(firstBodyCopy, "font-size"),
    summaryPadding: computed(summaryBox, "padding"),
    containerGap,
    pagePadding,
    sectionGap,
  };
};

const makeDiffs = (shared: Record<string, any>, modern: Record<string, any>) => {
  const diffs: Record<string, { shared: any; modern: any }> = {};
  for (const key of Object.keys(shared)) {
    if (JSON.stringify(shared[key]) !== JSON.stringify(modern[key])) {
      diffs[key] = { shared: shared[key], modern: modern[key] };
    }
  }
  return diffs;
};

const renderAndCompare = async () => {
  const app = document.getElementById("app");
  if (!app) return;

  const results: Array<{ templateId: number; themeName: string; sharedMetrics: any; modernMetrics: any; diffs: any }> = [];

  for (const templateId of templateIds) {
    const theme = templateThemes[templateId];
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "64px";
    wrapper.innerHTML = `<h1 style='font-family:system-ui; margin-bottom:16px'>Template ${templateId} — ${theme.name}</h1>`;

    const sharedContainer = document.createElement("div");
    sharedContainer.id = `shared-${templateId}`;
    sharedContainer.style.marginBottom = "32px";
    sharedContainer.style.border = "1px solid #D5D4D4";
    sharedContainer.style.padding = "16px";
    sharedContainer.innerHTML = `<h2 style='margin:0 0 12px 0;font-family:system-ui;font-size:16px'>Shared Renderer</h2>`;
    wrapper.appendChild(sharedContainer);

    const modernContainer = document.createElement("div");
    modernContainer.id = `modern-${templateId}`;
    modernContainer.style.marginBottom = "32px";
    modernContainer.style.border = "1px solid #D5D4D4";
    modernContainer.style.padding = "16px";
    modernContainer.innerHTML = `<h2 style='margin:0 0 12px 0;font-family:system-ui;font-size:16px'>ModernLayout</h2>`;
    wrapper.appendChild(modernContainer);

    app.appendChild(wrapper);

    createRoot(sharedContainer).render(renderTemplate(payload, theme));
    createRoot(modernContainer).render(<ModernLayout data={payload} theme={theme} />);
    await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));

    const sharedMetrics = getMetrics(sharedContainer);
    const modernMetrics = getMetrics(modernContainer);
    const diffs = makeDiffs(sharedMetrics, modernMetrics);

    results.push({ templateId, themeName: theme.name, sharedMetrics, modernMetrics, diffs });
  }

  (window as any).__comparisonReport__ = results;
  console.log("COMPARISON_READY", JSON.stringify(results, null, 2));
};

renderAndCompare();
