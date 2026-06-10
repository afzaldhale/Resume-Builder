// === HELPER FUNCTIONS (previously from templateShared.js) ===
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
  }

  h1 {
    font-size: 26px;
    margin: 0 0 6px 0;
  }

  h2 {
    font-size: 15px;
    margin: 20px 0 6px 0;
    text-transform: uppercase;
    font-weight: bold;
    border-bottom: 1px solid #d1d5db;
    padding-bottom: 4px;
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

  .contact p {
    margin: 2px 0;
  }

  .header-divider {
    border-bottom: 1px solid #d1d5db;
    margin: 12px 0 16px 0;
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

  ${sharedTemplateStyles}
</style>
</head>

<body>
<div class="page">

  <!-- HEADER -->
  <header>
    <h1>${data.fullName || ""}</h1>
    ${data.role ? `<p><strong>${data.role}</strong></p>` : ""}

    <div class="contact">
      ${data.email ? `<p>Email: ${data.email}</p>` : ""}
      ${data.phone ? `<p>Phone: ${data.phone}</p>` : ""}
      ${data.address ? `<p>Location: ${data.address}</p>` : ""}
      ${data.socialLinks?.length ? `<p>${data.socialLinks.map(l => `${l.platform}: ${l.url}`).join(" | ")}</p>` : ""}
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
    <h2>Professional Experience</h2>
    ${data.experience.map(exp => `
      <div>
        <h3>${exp.role}${exp.company ? ` – ${exp.company}` : ""}</h3>
        <p class="muted">${exp.startDate || ""}${exp.endDate ? ` – ${exp.endDate}` : ""}</p>

        ${exp.description ? `
        <ul>
          ${exp.description
            .split("\\n")
            .filter(Boolean)
            .map(line => `<li>${line}</li>`)
            .join("")}
        </ul>` : ""}

        ${exp.impact ? `<p class="muted">Impact: ${exp.impact}</p>` : ""}
      </div>
    `).join("")}
  </section>
  ` : ""}

  <!-- PROJECTS -->
  ${data.projects?.length ? `
  <section class="section">
    <h2>Projects</h2>
    ${data.projects.map(project => `
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
    ${data.education.map(edu => `
      <div>
        <h3>${edu.degree} – ${edu.school}</h3>
        <p class="muted">${edu.startYear || ""}${edu.endYear ? ` – ${edu.endYear}` : ""}</p>
      </div>
    `).join("")}
  </section>
  ` : ""}

  <!-- CERTIFICATIONS -->
  ${data.certifications?.length ? `
  <section class="section">
    <h2>Certifications</h2>
    <ul>
      ${data.certifications.map(cert => `
        <li>${cert.name}${cert.issuer ? ` – ${cert.issuer}` : ""}${cert.year ? ` (${cert.year})` : ""}</li>
      `).join("")}
    </ul>
  </section>
  ` : ""}

  <!-- LANGUAGES -->
  ${data.languages?.length ? `
  <section class="section">
    <h2>Languages</h2>
    <p>${data.languages.map(l => `${l.language} (${l.level})`).join(", ")}</p>
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
