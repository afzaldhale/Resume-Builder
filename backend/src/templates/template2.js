// Helper functions copied into this template for self-contained rendering
const asArray = (value) => (Array.isArray(value) ? value : []);
const hasText = (value) => Boolean(value && String(value).trim());
const TEMPLATE2_BULLET = "\u2022";
const TEMPLATE2_MONTH_INDEX = {
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

const formatTemplate2MonthYear = (value) => {
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
    const month = TEMPLATE2_MONTH_INDEX[monthNameMatch[1].toLowerCase()];
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

const formatTemplate2Range = (start, end) =>
  [formatTemplate2MonthYear(start), formatTemplate2MonthYear(end)]
    .filter(Boolean)
    .join(" \u2013 ");

const toTemplate2BulletItems = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }

  if (!hasText(value)) return [];

  return String(value)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
};

const renderTemplate2BulletList = (items, className = "template2-bullet-list") => {
  const bulletItems = toTemplate2BulletItems(items);
  if (!bulletItems.length) return "";

  return `
    <ul class="${className}">
      ${bulletItems.map((item) => `<li><span class="template2-bullet-marker">${TEMPLATE2_BULLET}</span><span>${item}</span></li>`).join("")}
    </ul>
  `;
};

const renderTemplate2StructuredEntry = ({ title, subtitle, meta, bullets }) => `
  <div class="template2-entry">
    <h3>${title}</h3>
    ${hasText(subtitle) ? `<div class="muted template2-subtitle">${subtitle}</div>` : ""}
    ${hasText(meta) ? `<div class="muted">${meta}</div>` : ""}
    ${renderTemplate2BulletList(bullets)}
  </div>
`;

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

const getSummaryConfig = (data) => {
  const isFresher =
    data.candidateType === "fresher" ||
    (!data.candidateType && asArray(data.experience).length === 0);

  return {
    isFresher,
    summaryText: isFresher
      ? data.careerObjective || data.summary
      : data.summary || data.careerObjective,
    summaryTitle: isFresher ? "Career Objective" : "Profile Summary",
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
        <${headingTag} class="${titleClass}">STRENGTHS</${headingTag}>
        ${renderTemplate2BulletList(data.strengths, "template2-support-list")}
      </section>
    `);
  }

  if (include.includes("achievements") && asArray(data.achievements).length) {
    sections.push(`
      <section class="${sectionClass}">
        <${headingTag} class="${titleClass}">ACHIEVEMENTS</${headingTag}>
        ${renderTemplate2BulletList(asArray(data.achievements).map(formatAchievement), "template2-support-list")}
      </section>
    `);
  }

  if (include.includes("references") && asArray(data.references).length) {
    sections.push(`
      <section class="${sectionClass}">
        <${headingTag} class="${titleClass}">REFERENCES</${headingTag}>
        ${renderTemplate2BulletList(asArray(data.references).map(formatReference), "template2-support-list")}
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
          <${headingTag} class="${titleClass}">ADDITIONAL INFORMATION</${headingTag}>
          ${customMarkup}
        </section>
      `);
    }
  }

  return sections.join("");
};

const sharedTemplateStyles = `
  .resume-extra-section,
  .resume-additional-section {
    page-break-inside: auto;
    break-inside: auto;
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
      page-break-inside: auto;
      break-inside: auto;
    }
  }
`;

export function template2HTML(data) {
  const { summaryText, summaryTitle } = getSummaryConfig(data);
  const supplementarySections = renderSupplementarySections(data, {
    include: ["strengths", "achievements", "references", "customSections"],
  });

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Resume</title>

<style>
  @page {
    size: A4;
    margin: 12mm;
  }

  body {
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    background: #ffffff;
  }

  .page {
    width: 794px;
    min-height: 1123px;
    display: flex;
    border: none;
    box-shadow: none;
  }

  .sidebar {
    width: 40%;
    background: linear-gradient(to bottom, #111827, #1f2937);
    color: #fff;
    padding: 32px;
    box-sizing: border-box;
  }

  .sidebar h1 {
    font-size: 28px;
    margin: 0 0 4px 0;
    word-break: normal;
    overflow-wrap: break-word;
    hyphens: none;
    word-spacing: normal;
  }

  .role {
    font-size: 18px;
    color: #d1d5db;
    margin-bottom: 24px;
  }

  .contact p {
    font-size: 13px;
    margin: 6px 0;
    color: #e5e7eb;
    line-height: 1.45;
    overflow-wrap: anywhere;
  }

  .section-title {
    font-size: 16px;
    margin: 24px 0 10px;
    font-weight: bold;
    border-bottom: 1px solid #374151;
    padding-bottom: 4px;
  }

  .content {
    width: 60%;
    padding: 32px;
    box-sizing: border-box;
    color: #111827;
  }

  .content h2 {
    font-size: 20px;
    margin: 0 0 10px;
    border-left: 4px solid #2563eb;
    padding-left: 10px;
    break-after: avoid;
    page-break-after: avoid;
  }

  .box {
    background: #f8fafc;
    padding: 14px;
    border-radius: 8px;
    margin-bottom: 18px;
    font-size: 13px;
    line-height: 1.55;
  }

  .template2-entry {
    margin-bottom: 18px;
    break-inside: auto;
    page-break-inside: auto;
  }

  .template2-entry h3 {
    font-size: 16px;
    margin: 0;
    font-weight: 700;
    break-after: avoid;
    page-break-after: avoid;
  }

  .muted {
    font-size: 12px;
    color: #6b7280;
    margin-top: 4px;
  }

  .template2-subtitle {
    margin-bottom: 0;
  }

  .template2-bullet-list,
  .template2-support-list {
    margin: 8px 0 0 0;
    padding-left: 0;
    font-size: 13px;
    line-height: 1.55;
    list-style: none;
  }

  .template2-bullet-list li,
  .template2-support-list li {
    display: flex;
    align-items: flex-start;
    gap: 6px;
  }

  .template2-bullet-list li + li,
  .template2-support-list li + li {
    margin-top: 4px;
  }

  .template2-bullet-marker {
    flex: 0 0 auto;
    line-height: 1.55;
  }

  ${sharedTemplateStyles}
</style>
</head>

<body>
<div class="page">

  <div class="sidebar">
    <h1>${data.fullName || ""}</h1>
    ${data.role ? `<div class="role">${data.role}</div>` : ""}

    <div class="contact">
      ${data.email ? `<p>Email: ${data.email}</p>` : ""}
      ${data.phone ? `<p>Phone: ${data.phone}</p>` : ""}
      ${data.address ? `<p>Location: ${data.address}</p>` : ""}
      ${data.socialLinks?.length ? `<p>${data.socialLinks.map((link) => `${link.platform}: ${link.url}`).join(" | ")}</p>` : ""}
    </div>

    ${data.skills?.length ? `
    <div class="section-title">SKILLS</div>
    ${renderTemplate2BulletList(data.skills, "template2-support-list")}
    ` : ""}
  </div>

  <div class="content">

    ${summaryText ? `
    <h2>${summaryTitle}</h2>
    <div class="box">${summaryText}</div>
    ` : ""}

    ${data.experience?.length ? `
    <h2>WORK EXPERIENCE</h2>
    ${data.experience.map((exp) =>
      renderTemplate2StructuredEntry({
        title: [exp.role, exp.company].filter(Boolean).join(" at "),
        meta: formatTemplate2Range(exp.startDate, exp.endDate),
        bullets: exp.description,
      })
    ).join("")}
    ` : ""}

    ${data.projects?.length ? `
    <h2>PROJECTS</h2>
    ${data.projects.map((project) =>
      renderTemplate2StructuredEntry({
        title: project.name,
        bullets: [
          ...toTemplate2BulletItems(project.description),
          ...(asArray(project.technologies).length
            ? [`Technologies: ${asArray(project.technologies).filter(Boolean).join(", ")}.`]
            : []),
        ],
      })
    ).join("")}
    ` : ""}

    ${data.education?.length ? `
    <h2>EDUCATION</h2>
    ${data.education.map((edu) =>
      renderTemplate2StructuredEntry({
        title: edu.degree || edu.school || "",
        subtitle: edu.school || "",
        meta: formatTemplate2Range(edu.startYear || edu.startDate, edu.endYear || edu.endDate),
        bullets: [
          ...(hasText(edu.gpa) ? [`GPA: ${edu.gpa}`] : []),
          ...(hasText(edu.minor) ? [`Minor: ${edu.minor}`] : []),
        ],
      })
    ).join("")}
    ` : ""}

    ${data.certifications?.length ? `
    <h2>CERTIFICATIONS</h2>
    ${data.certifications.map((cert) =>
      typeof cert === "string"
        ? renderTemplate2StructuredEntry({
            title: cert,
            bullets: [],
          })
        : renderTemplate2StructuredEntry({
            title: cert.name || "",
            bullets: [
              ...(hasText(cert.issuer) ? [`Issued by: ${cert.issuer}`] : []),
              ...(hasText(cert.year) ? [`Date: ${formatTemplate2MonthYear(cert.year)}`] : []),
            ],
          })
    ).join("")}
    ` : ""}

    ${data.languages?.length ? `
    <h2>LANGUAGES</h2>
    ${renderTemplate2BulletList(
      data.languages.map((lang) =>
        typeof lang === "string" ? lang : `${lang.language || ""}${lang.level ? ` (${lang.level})` : ""}`
      )
    )}
    ` : ""}

    ${data.hobbies?.length ? `
    <h2>HOBBIES / INTERESTS</h2>
    ${renderTemplate2BulletList(data.hobbies)}
    ` : ""}

    ${supplementarySections}

  </div>

</div>
</body>
</html>
`;
}
