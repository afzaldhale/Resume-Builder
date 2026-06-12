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

export function template2HTML(data) {
  const skillPercent = (i) => Math.min(95, 65 + i * 10);
  const { summaryText, isFresher } = getSummaryConfig(data);
  const summaryTitle = isFresher ? "Career Objective" : "Profile Summary";
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
  body {
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    background: #ffffff;
  }

  .page {
    width: 794px;
    height: 1123px;
    display: flex;
  }

  /* LEFT SIDEBAR */
  .sidebar {
    width: 40%;
    background: linear-gradient(to bottom, #111827, #1f2937);
    color: #fff;
    padding: 32px;
    box-sizing: border-box;
  }

  .sidebar h1 {
    font-size: 28px;
    margin-bottom: 4px;
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
  }

  .section-title {
    font-size: 16px;
    margin: 28px 0 12px;
    font-weight: bold;
    border-bottom: 1px solid #374151;
    padding-bottom: 4px;
  }

  .skill {
    margin-bottom: 10px;
  }

  .skill-name {
    font-size: 13px;
    display: flex;
    justify-content: space-between;
  }

  .bar {
    height: 6px;
    background: #374151;
    border-radius: 4px;
    overflow: hidden;
  }

  .bar-fill {
    height: 6px;
    background: linear-gradient(to right, #3b82f6, #22d3ee);
  }

  /* RIGHT CONTENT */
  .content {
    width: 60%;
    padding: 32px;
    box-sizing: border-box;
    color: #111827;
  }

  .content h2 {
    font-size: 20px;
    margin-bottom: 10px;
    border-left: 4px solid #2563eb;
    padding-left: 10px;
  }

  .box {
    background: #f8fafc;
    padding: 14px;
    border-radius: 8px;
    margin-bottom: 18px;
    font-size: 13px;
    line-height: 1.6;
  }

  .job {
    margin-bottom: 20px;
  }

  .job h3 {
    font-size: 16px;
    margin: 0;
  }

  .muted {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 6px;
  }

  .pill {
    display: inline-block;
    background: #e0f2fe;
    color: #0369a1;
    font-size: 11px;
    padding: 4px 8px;
    border-radius: 12px;
    margin-right: 6px;
  }

  ${sharedTemplateStyles}
</style>
</head>

<body>
<div class="page">

  <!-- LEFT -->
  <div class="sidebar">
    <h1>${data.fullName || ""}</h1>
    ${data.role ? `<div class="role">${data.role}</div>` : ""}

    <div class="contact">
      ${data.email ? `<p>Email: ${data.email}</p>` : ""}
      ${data.phone ? `<p>Phone: ${data.phone}</p>` : ""}
      ${data.address ? `<p>Location: ${data.address}</p>` : ""}
      ${data.socialLinks?.length ? `<p>${data.socialLinks.map(link => `${link.platform}: ${link.url}`).join(' | ')}</p>` : ""}
    </div>

    ${data.skills?.length ? `
    <div class="section-title">SKILLS</div>
    ${data.skills.map((s, i) => `
      <div class="skill">
        <div class="skill-name">
          <span>${s}</span>
          <span>${skillPercent(i)}%</span>
        </div>
        <div class="bar">
          <div class="bar-fill" style="width:${skillPercent(i)}%"></div>
        </div>
      </div>
    `).join("")}
    ` : ""}
  </div>

  <!-- RIGHT -->
  <div class="content">

    ${summaryText ? `
    <h2>${summaryTitle}</h2>
    <div class="box">${summaryText}</div>
    ` : ""}

    ${data.experience?.length ? `
    <h2>WORK EXPERIENCE</h2>
    ${data.experience.map(exp => `
      <div class="job">
        <h3>${exp.role} – ${exp.company}</h3>
        <div class="muted">${exp.startDate} – ${exp.endDate}</div>
        <div class="box">${exp.description}</div>
      </div>
    `).join("")}
    ` : ""}

    ${data.projects?.length ? `
    <h2>PROJECTS</h2>
    ${data.projects.map(p => `
      <div class="box">
        <strong>${p.name}</strong>
        <p>${p.description}</p>
        ${p.technologies?.map(t => `<span class="pill">${t}</span>`).join("")}
      </div>
    `).join("")}
    ` : ""}

    ${data.education?.length ? `
    <h2>EDUCATION</h2>
    ${data.education.map(edu => `
      <div class="box">
        <strong>${edu.degree || edu.school || ""}</strong>
        <div class="muted">${edu.school || ""}${edu.startDate || edu.endDate ? ` • ${edu.startDate || ""}${edu.startDate && edu.endDate ? " – " : ""}${edu.endDate || ""}` : ""}</div>
      </div>
    `).join("")}
    ` : ""}

    ${data.certifications?.length ? `
    <h2>CERTIFICATIONS</h2>
    ${data.certifications.map(cert => `
      <div class="box">
        <strong>${typeof cert === "string" ? cert : cert.name || ""}</strong>
        ${typeof cert === "object" && cert.issuer ? `<div class="muted">${cert.issuer}</div>` : ""}
      </div>
    `).join("")}
    ` : ""}

    ${data.languages?.length ? `
    <h2>LANGUAGES</h2>
    <div class="box">
      ${data.languages.map(lang => {
        const value = typeof lang === "string" ? lang : `${lang.language || ""}${lang.level ? ` (${lang.level})` : ""}`;
        return `<span class="pill">${value}</span>`;
      }).join("")}
    </div>
    ` : ""}

    ${data.hobbies?.length ? `
    <h2>HOBBIES</h2>
    <div class="box">${data.hobbies.join(", ")}</div>
    ` : ""}

    ${supplementarySections}

  </div>

</div>
</body>
</html>
`;
}
