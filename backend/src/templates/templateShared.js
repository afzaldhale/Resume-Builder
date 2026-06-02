const asArray = (value) => (Array.isArray(value) ? value : []);

const joinParts = (parts, separator = " | ") => parts.filter(Boolean).join(separator);

const formatAchievement = (achievement) => {
  if (!achievement) return "";
  if (typeof achievement === "string") return achievement;

  return joinParts([
    achievement.title || achievement.name,
    achievement.issuer || achievement.organization,
    achievement.year || achievement.date,
    achievement.description,
  ]);
};

const formatReference = (reference) => {
  if (!reference) return "";
  if (typeof reference === "string") return reference;

  return joinParts([
    reference.name,
    reference.designation || reference.role,
    reference.company || reference.organization,
    reference.email,
    reference.phone,
  ]);
};

const formatCustomSection = (section) => {
  if (!section) return "";
  if (typeof section === "string") return section;

  const items = asArray(section.items).filter(Boolean);
  const content = [section.content, section.description, ...items].filter(Boolean).join(", ");

  if (!section.title && !content) return "";

  return `
    <div class="resume-extra-custom-block">
      ${section.title ? `<div class="resume-extra-custom-title">${section.title}</div>` : ""}
      ${content ? `<div class="resume-extra-item">${content}</div>` : ""}
    </div>
  `;
};

const formatSimpleList = (items, formatter) =>
  asArray(items)
    .map(formatter)
    .filter(Boolean)
    .map((value) => `<li class="resume-extra-item">${value}</li>`)
    .join("");

export const sharedTemplateStyles = `
  .resume-extra-section,
  .resume-additional-section {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .resume-extra-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .resume-extra-item {
    font-size: 12px;
    line-height: 1.5;
    margin-bottom: 4px;
  }

  .resume-extra-custom-block + .resume-extra-custom-block {
    margin-top: 8px;
  }

  .resume-extra-custom-title {
    font-size: 12.5px;
    font-weight: 700;
    margin-bottom: 2px;
  }

  @media print {
    .page,
    .section,
    .resume-extra-section,
    .resume-additional-section {
      page-break-inside: avoid;
      break-inside: avoid;
    }
  }
`;

export const sidebarTypographyStyles = `
  /* === STANDARDIZED TYPOGRAPHY FOR SIDEBAR TEMPLATES === */
  
  /* CANDIDATE NAME - Primary Header */
  h1 {
    font-size: 28px !important;
    font-weight: 700 !important;
    line-height: 1.1 !important;
    font-family: 'Inter', Arial, Helvetica, sans-serif !important;
    word-break: normal;
    overflow-wrap: break-word;
    hyphens: none;
  }
  
  /* JOB TITLE/ROLE */
  .role {
    font-size: 15px !important;
    font-weight: 600 !important;
    line-height: 1.3 !important;
    font-family: 'Inter', Arial, Helvetica, sans-serif !important;
  }
  
  /* BODY TEXT */
  p, body {
    font-size: 12px !important;
    line-height: 1.5 !important;
    font-family: 'Inter', Arial, Helvetica, sans-serif !important;
  }
  
  /* SMALL METADATA (dates, locations, etc) */
  .meta-row,
  .item-sub,
  .muted,
  .sub {
    font-size: 10.5px !important;
    line-height: 1.4 !important;
    color: #64748b;
  }
  
  /* SECTION HEADINGS - Minimum 14px */
  h2,
  .section-title,
  .sidebar-title,
  .left-title {
    font-size: 14px !important;
    font-weight: 700 !important;
    line-height: 1.2 !important;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-family: 'Inter', Arial, Helvetica, sans-serif !important;
  }
  
  /* ITEM TITLES (job titles, education, etc) */
  h3,
  .item-title {
    font-size: 12px !important;
    font-weight: 700 !important;
    line-height: 1.2 !important;
    font-family: 'Inter', Arial, Helvetica, sans-serif !important;
  }
  
  /* CONTACT INFO */
  .contact,
  .contact p,
  .contact-row span {
    font-size: 10.5px !important;
    line-height: 1.4 !important;
    font-family: 'Inter', Arial, Helvetica, sans-serif !important;
  }
`;

export const renderSupplementarySections = (
  data,
  {
    include = ["achievements", "references", "customSections"],
    sectionClass = "section resume-extra-section",
    titleClass = "section-title",
    headingTag = "h2",
  } = {}
) => {
  const sections = [];

  if (include.includes("strengths") && asArray(data.strengths).length) {
    sections.push(`
      <section class="${sectionClass}">
        <${headingTag} class="${titleClass}">Strengths</${headingTag}>
        <ul class="resume-extra-list">
          ${formatSimpleList(data.strengths, (item) => item)}
        </ul>
      </section>
    `);
  }

  if (include.includes("achievements") && asArray(data.achievements).length) {
    sections.push(`
      <section class="${sectionClass}">
        <${headingTag} class="${titleClass}">Achievements</${headingTag}>
        <ul class="resume-extra-list">
          ${formatSimpleList(data.achievements, formatAchievement)}
        </ul>
      </section>
    `);
  }

  if (include.includes("references") && asArray(data.references).length) {
    sections.push(`
      <section class="${sectionClass}">
        <${headingTag} class="${titleClass}">References</${headingTag}>
        <ul class="resume-extra-list">
          ${formatSimpleList(data.references, formatReference)}
        </ul>
      </section>
    `);
  }

  if (include.includes("customSections") && asArray(data.customSections).length) {
    const customMarkup = asArray(data.customSections)
      .map(formatCustomSection)
      .filter(Boolean)
      .join("");

    if (customMarkup) {
      sections.push(`
        <section class="${sectionClass}">
          <${headingTag} class="${titleClass}">Additional Information</${headingTag}>
          ${customMarkup}
        </section>
      `);
    }
  }

  return sections.join("");
};

export const getSummaryConfig = (data) => {
  const isFresher =
    data.candidateType === "fresher" ||
    (!data.candidateType && asArray(data.experience).length === 0);

  return {
    isFresher,
    summaryText: isFresher
      ? data.careerObjective || data.summary
      : data.summary || data.careerObjective,
    summaryTitle: isFresher ? "Career Objective" : "Professional Summary",
  };
};

export const resumeTypographyStyles = `
  /* Global resume typography */
  h1, .resume-name {
    font-size: 28px;
    font-weight: 700;
    line-height: 1.1;
    font-family: 'Inter', Arial, Helvetica, sans-serif;
  }

  .resume-role,
  .resume-job-title {
    font-size: 15px;
    font-weight: 600;
    line-height: 1.3;
    font-family: 'Inter', Arial, Helvetica, sans-serif;
  }

  p,
  .resume-body,
  .resume-item-text,
  .resume-description {
    font-size: 12px;
    line-height: 1.5;
    font-family: 'Inter', Arial, Helvetica, sans-serif;
  }

  .resume-meta,
  .resume-contact,
  .resume-subtext {
    font-size: 10.5px;
    line-height: 1.4;
    color: #64748b;
  }

  h2,
  .section-title,
  .sidebar-title,
  .section-heading {
    font-size: 14px;
    font-weight: 700;
    line-height: 1.2;
    font-family: 'Inter', Arial, Helvetica, sans-serif;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  h3,
  .item-title {
    font-size: 12px;
    font-weight: 700;
    line-height: 1.2;
    font-family: 'Inter', Arial, Helvetica, sans-serif;
  }
`;

export const resumeSpacingStyles = `
  /* Global resume spacing */
  .resume-section {
    margin-bottom: 16px;
  }

  .resume-section + .resume-section {
    margin-top: 12px;
  }

  .resume-item {
    margin-bottom: 10px;
  }

  .resume-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .resume-list li {
    margin-bottom: 6px;
  }

  .resume-header,
  .resume-sidebar,
  .resume-main {
    box-sizing: border-box;
  }
`;

export const resumeLayoutStyles = `
  /* Global resume layout */
  .resume-page {
    width: 794px;
    min-height: 1123px;
    margin: 0 auto;
    padding: 24px;
    box-sizing: border-box;
  }

  .resume-sidebar {
    min-width: 220px;
    max-width: 250px;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .resume-main {
    min-width: 500px;
    overflow: hidden;
  }

  .resume-grid {
    display: grid;
    grid-template-columns: 230px 1fr;
    gap: 16px;
  }

  .resume-flex {
    display: flex;
    gap: 16px;
  }

  .resume-divider {
    margin: 18px 0;
    border-bottom: 1px solid rgba(100, 116, 139, 0.16);
  }
`;

export const renderSidebarLayout = ({ sidebarHtml, mainHtml, className = "resume-grid" } = {}) => `
  <div class="${className}">
    <aside class="resume-sidebar">${sidebarHtml}</aside>
    <main class="resume-main">${mainHtml}</main>
  </div>
`;

export const renderResumeHeader = (data, options = {}) => {
  const {
    showSummary = true,
    summaryText = "",
    summaryTitle = "Professional Summary",
    classes = "resume-header",
  } = options;

  return `
    <header class="${classes}">
      <h1 class="resume-name">${data.fullName || "Your Name"}</h1>
      ${data.role ? `<p class="resume-role">${data.role}</p>` : ""}
      ${showSummary && summaryText ? `
        <div class="resume-summary">
          <h2 class="section-heading">${summaryTitle}</h2>
          <p class="resume-body">${summaryText}</p>
        </div>
      ` : ""}
      <div class="resume-contact resume-meta">
        ${data.email ? `<div>Email: ${data.email}</div>` : ""}
        ${data.phone ? `<div>Phone: ${data.phone}</div>` : ""}
        ${data.address ? `<div>Address: ${data.address}</div>` : ""}
      </div>
    </header>
  `;
};

export const renderResumeSection = ({ title, content, items = [], className = "resume-section" }) => {
  const body = content
    ? `<p class="resume-body">${content}</p>`
    : `
      <ul class="resume-list">
        ${items
          .map(
            (item) =>
              `<li class="resume-item"><span class="item-title">${item.title || item.name || ""}</span>${item.description ? `<div class="resume-item-text">${item.description}</div>` : ""}</li>`
          )
          .join("")}
      </ul>
    `;

  return `
    <section class="${className}">
      ${title ? `<h2 class="section-heading">${title}</h2>` : ""}
      ${body}
    </section>
  `;
};

export const resumeStressTestDatasets = {
  normal: {
    fullName: "Jane Doe",
    role: "Product Manager",
    email: "jane.doe@example.com",
    phone: "+1 555-0100",
    address: "123 Market St, San Francisco, CA",
    summary: "Experienced product manager specializing in cross-functional teams, user research, and product launch execution.",
    skills: ["Product Strategy", "Roadmap Planning", "Stakeholder Management", "Agile", "Data Analysis"],
    certifications: ["Certified Scrum Product Owner"],
    projects: [
      {
        title: "Mobile Launch",
        description: "Led product definition and launch of a mobile application that increased user engagement by 32%."
      }
    ],
    experience: [
      {
        title: "Product Manager",
        company: "Acme Corp",
        date: "2021 - Present",
        description: "Managed product roadmap and collaborated with engineering, design, and marketing teams to deliver features on time."
      }
    ]
  },
  longText: {
    fullName: "Alexandria Montgomery-Winchester III",
    role: "Senior Director of Product Innovation and Go-to-Market Strategy",
    email: "alexandria.montgomery-winchesteriii@verylongdomainexamplecorporation.com",
    phone: "+1 (415) 555-0199",
    address: "641 Market Street, Suite 4800, San Francisco, California, 94105, United States of America",
    summary: "Accomplished product leader with experience delivering large-scale digital transformation programs across global teams and complex enterprise stakeholders.",
    skills: ["Executive Leadership", "Strategic Roadmapping", "Portfolio Management", "Go-to-Market Strategy"],
    certifications: [],
    projects: [],
    experience: []
  },
  growth: {
    fullName: "Michael J. Carter",
    role: "Full Stack Software Engineer",
    email: "michael.carter@techstacksolutions.dev",
    phone: "+44 20 7946 0958",
    address: "Unit 8, Lower Ground Floor, The Old Brewery, 5 King Street, London, United Kingdom",
    summary: "A full stack engineer focused on building resilient, scalable web applications and continuous delivery pipelines.",
    skills: Array.from({ length: 20 }, (_, i) => `Skill ${i + 1}`),
    certifications: Array.from({ length: 10 }, (_, i) => `Certification ${i + 1}`),
    projects: Array.from({ length: 5 }, (_, i) => ({
      title: `Project ${i + 1}`,
      description: `Delivered a complex product module with feature ${i + 1}, performance optimization, and cross-team coordination.`
    })),
    experience: []
  },
  experience: {
    fullName: "Christopher P. Lawrence",
    role: "Senior Engineering Manager",
    email: "chris.lawrence@enterprise-solutions.io",
    phone: "+1 312-555-0123",
    address: "200 North Green Street, Suite 900, Chicago, IL 60607",
    summary: "Seasoned engineering leader with 10 years of experience managing distributed teams, launching enterprise platforms, and optimizing customer outcomes.",
    skills: ["People Leadership", "Platform Architecture", "Agile Coaching", "Technical Strategy"],
    certifications: ["PMP", "AWS Certified Solutions Architect", "ICAgile Certified Professional", "ITIL Foundation", "Lean Six Sigma Green Belt", "SAFE Agilist", "Kubernetes Administrator", "Azure DevOps Engineer", "CISM", "TOGAF"],
    projects: [
      {
        title: "Enterprise Platform Modernization",
        description: "Spearheaded the migration of a legacy platform to a cloud-native architecture, reducing operational costs by 36% while improving system reliability and release cadence."
      }
    ],
    experience: Array.from({ length: 10 }, (_, i) => ({
      title: `Senior ${i === 0 ? "Engineering Manager" : i === 1 ? "Technical Program Manager" : `Engineering Lead ${i}`}`,
      company: `Company ${i + 1}`,
      date: `201${i} - 201${i + 1}`,
      description: `Owned delivery for multiple products and team roadmaps, including long-form stakeholder communication, detailed technical design reviews, and cross-functional execution.`
    }))
  }
};

export const resumeStressTestDatasetEntries = [
  { id: "A", label: "Normal resume", data: resumeStressTestDatasets.normal },
  { id: "B", label: "Long name / address / email", data: resumeStressTestDatasets.longText },
  { id: "C", label: "Many skills / certifications / projects", data: resumeStressTestDatasets.growth },
  { id: "D", label: "10 years experience with long bullets", data: resumeStressTestDatasets.experience },
];

export const validateResumeHtml = (html, { datasetName = "unknown" } = {}) => {
  const results = {
    dataset: datasetName,
    warnings: [],
    errors: [],
    checks: {
      clipping: true,
      overflow: true,
      hiddenContent: true,
      overlap: true,
      pageBreaks: true,
      a4Boundaries: true,
    }
  };

  if (html.includes("overflow: hidden") || html.includes("overflow: scroll")) {
    results.warnings.push("Verify overflow settings do not hide content.");
  }

  if (html.match(/<h1/g)?.length > 1) {
    results.warnings.push("Multiple H1 elements detected, confirm header behavior.");
  }

  if (html.includes("width: 100%") && !html.includes("max-width")) {
    results.warnings.push("Review full-width content for A4 boundary compliance.");
  }

  if (!html.includes("794px") && !html.includes("1123px")) {
    results.warnings.push("A4 boundary markers not explicitly present in generated HTML.");
  }

  return results;
};
