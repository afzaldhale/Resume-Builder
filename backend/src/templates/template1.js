// === HELPER FUNCTIONS (template-local) ===
const asArray = (value) => (Array.isArray(value) ? value : []);
const hasText = (value) => Boolean(value && String(value).trim());
const TEMPLATE1_BULLET = "\u2022";
const TEMPLATE1_MONTH_INDEX = {
  jan: "01",
  january: "01",
  feb: "02",
  february: "02",
  mar: "03",
  march: "03",
  apr: "04",
  april: "04",
  may: "05",
  jun: "06",
  june: "06",
  jul: "07",
  july: "07",
  aug: "08",
  august: "08",
  sep: "09",
  sept: "09",
  september: "09",
  oct: "10",
  october: "10",
  nov: "11",
  november: "11",
  dec: "12",
  december: "12",
};

const joinParts = (parts, separator = " | ") => parts.filter(Boolean).join(separator);

const formatTemplate1MonthYear = (value) => {
  const rawValue = String(value || "").trim();
  if (!rawValue) return "";

  if (/^(present|current|now)$/i.test(rawValue)) {
    return "Present";
  }

  const mmYyyyMatch = rawValue.match(/^(\d{1,2})[-/](\d{4})$/);
  if (mmYyyyMatch) {
    return `${mmYyyyMatch[1].padStart(2, "0")}-${mmYyyyMatch[2]}`;
  }

  const yyyyMmMatch = rawValue.match(/^(\d{4})[-/](\d{1,2})(?:[-/]\d{1,2})?$/);
  if (yyyyMmMatch) {
    return `${yyyyMmMatch[2].padStart(2, "0")}-${yyyyMmMatch[1]}`;
  }

  const monthNameMatch = rawValue.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (monthNameMatch) {
    const month = TEMPLATE1_MONTH_INDEX[monthNameMatch[1].toLowerCase()];
    if (month) {
      return `${month}-${monthNameMatch[2]}`;
    }
  }

  const parsed = new Date(rawValue);
  if (!Number.isNaN(parsed.getTime())) {
    return `${`${parsed.getMonth() + 1}`.padStart(2, "0")}-${parsed.getFullYear()}`;
  }

  return rawValue;
};

const formatTemplate1Range = (start, end) =>
  [formatTemplate1MonthYear(start), formatTemplate1MonthYear(end)]
    .filter(Boolean)
    .join(" \u2013 ");

const toTemplate1BulletItems = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }

  if (!hasText(value)) return [];

  return String(value)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
};

const renderTemplate1BulletLine = (text, contentClass = "resume-template1-body") => `
  <div class="resume-template1-bullet-line">
    <span class="resume-template1-bullet" aria-hidden="true">${TEMPLATE1_BULLET}</span>
    <div class="${contentClass}">${text}</div>
  </div>
`;

const renderTemplate1BulletList = (items) => {
  const bulletItems = toTemplate1BulletItems(items);
  if (!bulletItems.length) return "";

  return `
    <div class="resume-template1-bullet-list">
      ${bulletItems.map((item) => renderTemplate1BulletLine(item)).join("")}
    </div>
  `;
};

const renderTemplate1StructuredEntry = ({ title, subtitle, meta, bullets }) => `
  <div class="resume-template1-entry">
    ${renderTemplate1BulletLine(title, "resume-template1-title")}
    <div class="resume-template1-entry-content">
      ${hasText(subtitle) ? `<p class="resume-template1-subtitle">${subtitle}</p>` : ""}
      ${hasText(meta) ? `<p class="resume-template1-meta">${meta}</p>` : ""}
    </div>
    ${renderTemplate1BulletList(bullets)}
  </div>
`;

const renderTemplate1HeaderContacts = (data) => {
  const items = [
    hasText(data.phone) ? { label: "Mobile", value: data.phone } : null,
    hasText(data.email) ? { label: "Email ID", value: data.email } : null,
    hasText(data.address) ? { label: "Address", value: data.address } : null,
    ...asArray(data.socialLinks)
      .filter((link) => hasText(link?.url))
      .map((link) => ({
        label: hasText(link.platform) ? link.platform : "Link",
        value: link.url,
      })),
  ].filter(Boolean);

  if (!items.length) return "";

  return `
    <div class="template1-header-contact">
      ${items
        .map(
          (item) => `
            <div class="template1-contact-row">
              <span class="template1-contact-label">${item.label}</span>
              <span class="template1-contact-value">: ${item.value}</span>
            </div>
          `
        )
        .join("")}
    </div>
  `;
};

const getTemplate1Subtitle = (data) => {
  const normalizedRole = String(data?.role || "").trim().toLowerCase();
  return data?.candidateType === "fresher" && !normalizedRole.includes("fresher")
    ? "(FRESHER)"
    : "";
};

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

// === TEMPLATE STYLES ===
const sharedTemplateStyles = `
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

// === UTILITY FUNCTIONS ===
const getSummaryConfig = (data) => {
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

const renderSupplementarySections = (
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

export function template1HTML(data) {
  const { summaryText, summaryTitle } = getSummaryConfig(data);
  const supplementarySections = renderSupplementarySections(data, {
    include: ["strengths", "achievements", "references", "customSections"],
  });
  const headerSubtitle = getTemplate1Subtitle(data);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Resume</title>

<style>
  body {
    margin: 0;
    padding: 0;
    font-family: Arial, Helvetica, sans-serif;
    background: #ffffff;
    color: #111827;
    line-height: 1.4;
  }

  .page {
    width: 794px;
    height: 1123px;
    margin: auto;
    padding: 36px;
    box-sizing: border-box;
    border: none;
  }

  h1 {
    font-size: 26px;
    margin: 0 0 6px 0;
  }

  h2 {
    font-size: 11pt;
    margin: 12px 0 8px 0;
    text-transform: uppercase;
    font-weight: bold;
    background: #F58200;
    color: #000000;
    padding: 6px 10px;
    line-height: 1.2;
    letter-spacing: 0.75pt;
  }

  h3 {
    font-size: 13px;
    margin: 0;
    font-weight: bold;
  }

  p {
    font-size: 12.5px;
    margin: 3px 0;
  }

  .header-divider {
    border-bottom: 1px solid #e5e7eb;
    margin: 0 0 12px 0;
  }

  .section {
    margin-bottom: 12px;
  }

  ul {
    margin: 4px 0 0 18px;
    padding: 0;
  }

  li {
    font-size: 12.5px;
    margin-bottom: 3px;
  }

  .muted {
    font-size: 12px;
    color: #374151;
  }

  .resume-template1-entry + .resume-template1-entry {
    margin-top: 12px;
  }

  .resume-template1-bullet-line {
    display: flex;
    align-items: flex-start;
    gap: 6px;
  }

  .resume-template1-bullet {
    font-size: 12.5px;
    line-height: 1.4;
    color: #111827;
    flex-shrink: 0;
  }

  .resume-template1-title {
    display: block;
    font-size: 13px;
    line-height: 1.35;
    font-weight: 700;
    color: #000000;
    flex: 1;
    min-width: 0;
  }

  .resume-template1-body {
    display: block;
    font-size: 12.5px;
    line-height: 1.4;
    color: #111827;
    flex: 1;
    min-width: 0;
  }

  .resume-template1-entry-content,
  .resume-template1-bullet-list {
    margin-left: 12px;
    padding-left: 0;
  }

  .resume-template1-subtitle {
    font-size: 12.5px;
    line-height: 1.4;
    color: #111827;
    margin: 3px 0 0 0;
  }

  .resume-template1-meta {
    font-size: 12px;
    line-height: 1.3;
    color: #374151;
    margin: 3px 0 0 0;
  }

  .resume-template1-bullet-list {
    display: grid;
    row-gap: 2px;
    margin-top: 8px;
  }

  .template1-header {
    margin: -12px -20px 0;
    padding: 24px 28px 16px;
  }

  .template1-header-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(220px, 320px);
    column-gap: 20px;
    align-items: flex-start;
  }

  .template1-header-identity {
    display: grid;
    row-gap: 4px;
    align-content: start;
  }

  .template1-header-name {
    margin: 0 0 2px 0;
    font-size: 28px;
    font-weight: 800;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: #000000;
    line-height: 1.1;
  }

  .template1-header-role {
    margin: 0;
    font-size: 22px;
    font-weight: 300;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: #111111;
    line-height: 1.15;
  }

  .template1-header-subtitle {
    margin: 0;
    font-size: 22px;
    font-weight: 300;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: #111111;
    line-height: 1.15;
  }

  .template1-header-contact {
    display: grid;
    row-gap: 4px;
    align-content: start;
    min-width: 0;
    align-self: start;
  }

  .template1-contact-row {
    display: grid;
    grid-template-columns: 95px 1fr;
    align-items: start;
    column-gap: 6px;
    max-width: 100%;
  }

  .template1-contact-label,
  .template1-contact-value {
    font-size: 13px;
    line-height: 1.35;
    color: #666666;
  }

  .template1-contact-label {
    font-weight: 700;
    text-align: right;
    white-space: nowrap;
  }

  .template1-contact-value {
    font-weight: 500;
    overflow-wrap: anywhere;
    word-break: break-word;
    min-width: 0;
  }

  ${sharedTemplateStyles}
</style>
</head>

<body>
<div class="page">

  <!-- HEADER -->
  <header class="template1-header">
    <div class="template1-header-grid">
      <div class="template1-header-identity">
        <h1 class="template1-header-name">${data.fullName || ""}</h1>
        ${data.role ? `<p class="template1-header-role">${data.role}</p>` : ""}
        ${headerSubtitle ? `<p class="template1-header-subtitle">${headerSubtitle}</p>` : ""}
      </div>
      ${renderTemplate1HeaderContacts(data)}
    </div>
  </header>

  <div class="header-divider"></div>

  <!-- SUMMARY -->
  ${summaryText ? `
  <section class="section">
    <h2>${summaryTitle}</h2>
    <p>${summaryText}</p>
  </section>
  ` : ""}

  <!-- SKILLS -->
  ${data.skills?.length ? `
  <section class="section">
    <h2>Skills</h2>
    <p>${[...new Set(data.skills)].join(", ")}</p>
  </section>
  ` : ""}

  <!-- EXPERIENCE -->
  ${data.experience?.length ? `
  <section class="section">
    <h2>Work Experience</h2>
    ${data.experience
      .map((exp) =>
        renderTemplate1StructuredEntry({
          title: [exp.role, exp.company].filter(Boolean).join(" at "),
          meta: formatTemplate1Range(exp.startDate, exp.endDate),
          bullets: exp.description,
        })
      )
      .join("")}
  </section>
  ` : ""}

  <!-- PROJECTS -->
  ${data.projects?.length ? `
  <section class="section">
    <h2>Projects</h2>
    ${data.projects.map((project) => `
      <div>
        <h3>${project.name}</h3>
        <p>${project.description}</p>
        ${project.impact ? `<p class="muted">Impact: ${project.impact}</p>` : ""}
        ${project.technologies?.length ? `<p class="muted">Technologies: ${project.technologies.join(", ")}</p>` : ""}
      </div>
    `).join("")}
  </section>
  ` : ""}

  <!-- EDUCATION -->
  ${data.education?.length ? `
  <section class="section">
    <h2>Education</h2>
    ${data.education
      .map((edu) =>
        renderTemplate1StructuredEntry({
          title: edu.degree,
          subtitle: edu.school,
          meta: formatTemplate1Range(edu.startYear, edu.endYear),
          bullets: hasText(edu.gpa) ? [`GPA: ${edu.gpa}`] : [],
        })
      )
      .join("")}
  </section>
  ` : ""}

  <!-- CERTIFICATIONS -->
  ${data.certifications?.length ? `
  <section class="section">
    <h2>Certifications</h2>
    ${data.certifications
      .map((cert) =>
        renderTemplate1StructuredEntry({
          title: cert.name,
          subtitle: cert.issuer,
          meta: formatTemplate1MonthYear(cert.year),
          bullets: [],
        })
      )
      .join("")}
  </section>
  ` : ""}

  <!-- LANGUAGES -->
  ${data.languages?.length ? `
  <section class="section">
    <h2>Languages</h2>
    <p>${data.languages.map((l) => `${l.language} (${l.level})`).join(", ")}</p>
  </section>
  ` : ""}

  ${data.hobbies?.length ? `
  <section class="section">
    <h2>Hobbies</h2>
    <p>${data.hobbies.join(", ")}</p>
  </section>
  ` : ""}

  ${supplementarySections}

</div>
</body>
</html>
`;
}
