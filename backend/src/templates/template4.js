// Helper functions copied into this template for self-contained rendering
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

export function template4HTML(data) {
  const { summaryText, summaryTitle } = getSummaryConfig(data);
  const supplementarySections = renderSupplementarySections(data, {
    include: ["achievements", "references", "customSections"],
  });

  const socialLinks = Array.isArray(data.socialLinks) ? data.socialLinks : [];

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Resume - ${data.fullName || "Professional Resume"}</title>
<style>
  body {
    margin: 0;
    padding: 0;
    font-family: Arial, Helvetica, sans-serif;
    background: #ffffff;
    color: #0f172a;
  }

  .page {
    width: 794px;
    min-height: 1123px;
    padding: 24px 28px 22px;
    box-sizing: border-box;
    background: #ffffff;
  }

  .shell {
    min-height: 100%;
    border: 1px solid #0f172a;
  }

  .header {
    background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
    color: #ffffff;
    padding: 18px 24px 14px;
  }

  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 16px;
  }

  .identity h1 {
    font-size: 26px;
    line-height: 1.1;
    margin: 0 0 4px;
    font-weight: 800;
    letter-spacing: -0.4px;
    word-break: normal;
    overflow-wrap: break-word;
    hyphens: none;
    word-spacing: normal;
  }

  .role {
    font-size: 14px;
    color: #dbe4f0;
    margin: 0;
    font-weight: 600;
  }

  .summary-strip {
    max-width: 360px;
    font-size: 11.5px;
    line-height: 1.45;
    color: #d1d5db;
    text-align: right;
  }

  .contact-row {
    margin-top: 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px 14px;
    font-size: 11.5px;
    color: #e5e7eb;
  }

  .contact-row span {
    white-space: nowrap;
  }

  .body-grid {
    display: grid;
    grid-template-columns: 230px 1fr;
    gap: 18px;
    padding: 18px 20px 16px;
  }

  .sidebar,
  .main {
    min-width: 0;
  }

  .section {
    margin-bottom: 14px;
  }

  .sidebar .section {
    margin-bottom: 12px;
  }

  .section-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin: 0 0 7px;
    color: #0f172a;
    padding-bottom: 4px;
    border-bottom: 1px solid #cbd5e1;
  }

  .summary-box {
    background: #f8fafc;
    border-left: 3px solid #1f2937;
    padding: 10px 12px;
    font-size: 11.5px;
    line-height: 1.5;
    color: #334155;
  }

  .chip-list {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: 999px;
    background: #e2e8f0;
    color: #1e293b;
    font-size: 10.5px;
    font-weight: 600;
    line-height: 1.2;
  }

  .item-card {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 10px 11px;
    background: #ffffff;
  }

  .stack > .item-card + .item-card,
  .stack > .timeline-item + .timeline-item {
    margin-top: 8px;
  }

  .timeline-item {
    border-left: 2px solid #1f2937;
    padding-left: 10px;
  }

  .item-head {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: baseline;
  }

  .item-title {
    font-size: 12.5px;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
  }

  .item-date {
    font-size: 10.5px;
    color: #64748b;
    white-space: nowrap;
  }

  .item-sub {
    margin-top: 2px;
    font-size: 10.8px;
    color: #475569;
    font-weight: 600;
  }

  .item-text,
  .item-text p {
    margin: 4px 0 0;
    font-size: 11px;
    line-height: 1.45;
    color: #334155;
  }

  .inline-list {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 10px;
    font-size: 11px;
    color: #334155;
  }

  .inline-list span {
    position: relative;
  }

  .inline-list span:not(:last-child)::after {
    content: "•";
    margin-left: 10px;
    color: #94a3b8;
  }

  .project-tech {
    margin-top: 6px;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .project-tech span {
    font-size: 9.8px;
    padding: 3px 7px;
    border-radius: 999px;
    background: #f1f5f9;
    color: #334155;
  }

  .link-list {
    display: grid;
    gap: 5px;
    font-size: 10.8px;
    color: #334155;
  }

  .small-list {
    display: grid;
    gap: 6px;
  }

  .small-list-item {
    font-size: 11px;
    color: #334155;
    line-height: 1.35;
  }

  ${sharedTemplateStyles}
</style>
</head>
<body>
<div class="page">
  <div class="shell">
    <header class="header">
      <div class="header-top">
        <div class="identity">
          <h1>${data.fullName || "Your Name"}</h1>
          ${data.role ? `<p class="role">${data.role}</p>` : ""}
        </div>
        ${summaryText ? `<div class="summary-strip">${summaryText}</div>` : ""}
      </div>

      <div class="contact-row">
        ${data.email ? `<span>Email: ${data.email}</span>` : ""}
        ${data.phone ? `<span>Phone: ${data.phone}</span>` : ""}
        ${data.address ? `<span>Location: ${data.address}</span>` : ""}
        ${socialLinks.map((link) => `<span>${link.platform}: ${link.url}</span>`).join("")}
      </div>
    </header>

    <div class="body-grid">
      <aside class="sidebar">
        ${data.skills?.length ? `
        <section class="section">
          <h2 class="section-title">Core Skills</h2>
          <div class="chip-list">
            ${data.skills.map((skill, index) => {
              const palette = ["#dbeafe", "#dcfce7", "#fef3c7", "#fce7f3", "#e0e7ff"];
              const text = ["#1d4ed8", "#166534", "#92400e", "#9d174d", "#4338ca"];
              return `<span class="chip" style="background:${palette[index % palette.length]}; color:${text[index % text.length]};">${skill}</span>`;
            }).join("")}
          </div>
        </section>` : ""}

        ${data.languages?.length ? `
        <section class="section">
          <h2 class="section-title">Languages</h2>
          <div class="small-list">
            ${data.languages.map((lang) => `
              <div class="small-list-item"><strong>${lang.language}</strong>${lang.level ? ` <span style="color:#64748b;">(${lang.level})</span>` : ""}</div>
            `).join("")}
          </div>
        </section>` : ""}

        ${data.certifications?.length ? `
        <section class="section">
          <h2 class="section-title">Certifications</h2>
          <div class="stack">
            ${data.certifications.map((cert) => `
              <div class="item-card">
                <div class="item-title">${cert.name}</div>
                ${(cert.issuer || cert.year) ? `<div class="item-sub">${[cert.issuer, cert.year].filter(Boolean).join(" • ")}</div>` : ""}
              </div>
            `).join("")}
          </div>
        </section>` : ""}

        ${data.strengths?.length ? `
        <section class="section">
          <h2 class="section-title">Strengths</h2>
          <div class="chip-list">
            ${data.strengths.map((item) => `<span class="chip">${item}</span>`).join("")}
          </div>
        </section>` : ""}

        ${data.hobbies?.length ? `
        <section class="section">
          <h2 class="section-title">Interests</h2>
          <div class="small-list">
            ${data.hobbies.map((item) => `<div class="small-list-item">${item}</div>`).join("")}
          </div>
        </section>` : ""}
      </aside>

      <main class="main">
        ${summaryText ? `
        <section class="section">
          <h2 class="section-title">${summaryTitle}</h2>
          <div class="summary-box">${summaryText}</div>
        </section>` : ""}

        ${data.experience?.length ? `
        <section class="section">
          <h2 class="section-title">Professional Experience</h2>
          <div class="stack">
            ${data.experience.map((exp) => `
              <div class="timeline-item">
                <div class="item-head">
                  <div class="item-title">${exp.role}</div>
                  <div class="item-date">${[exp.startDate, exp.endDate].filter(Boolean).join(" - ")}</div>
                </div>
                ${exp.company ? `<div class="item-sub">${exp.company}</div>` : ""}
                ${exp.description ? `<div class="item-text">${exp.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        </section>` : ""}

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 14px; align-items:start;">
          ${data.projects?.length ? `
          <section class="section" style="margin-bottom:0;">
            <h2 class="section-title">Projects</h2>
            <div class="stack">
              ${data.projects.map((project) => `
                <div class="item-card">
                  <div class="item-title">${project.name}</div>
                  ${project.description ? `<div class="item-text">${project.description}</div>` : ""}
                  ${project.technologies?.length ? `<div class="project-tech">${project.technologies.map((tech) => `<span>${tech}</span>`).join("")}</div>` : ""}
                </div>
              `).join("")}
            </div>
          </section>` : `<div></div>`}

          <section class="section" style="margin-bottom:0;">
            ${data.education?.length ? `
            <div style="margin-bottom:12px;">
              <h2 class="section-title">Education</h2>
              <div class="stack">
                ${data.education.map((edu) => `
                  <div class="item-card">
                    <div class="item-title">${edu.degree}</div>
                    ${edu.school ? `<div class="item-sub">${edu.school}</div>` : ""}
                    ${(edu.startYear || edu.endYear || edu.gpa) ? `
                      <div class="inline-list" style="margin-top:4px;">
                        ${edu.startYear || edu.endYear ? `<span>${[edu.startYear, edu.endYear].filter(Boolean).join(" - ")}</span>` : ""}
                        ${edu.gpa ? `<span>GPA: ${edu.gpa}</span>` : ""}
                      </div>` : ""}
                  </div>
                `).join("")}
              </div>
            </div>` : ""}

            ${supplementarySections}
          </section>
        </div>
      </main>
    </div>
  </div>
</div>
</body>
</html>
`;
}
