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

// template15.js
export function template15HTML(data) {
  const safe = {
    fullName: data.fullName || "",
    role: data.role || "",
    email: data.email || "",
    phone: data.phone || "",
    address: data.address || "",
    summary: data.summary || "",
    careerObjective: data.careerObjective || "",
    skills: Array.isArray(data.skills) ? data.skills : [],
    strengths: Array.isArray(data.strengths) ? data.strengths : [],
    hobbies: Array.isArray(data.hobbies) ? data.hobbies : [],
    experience: Array.isArray(data.experience) ? data.experience : [],
    education: Array.isArray(data.education) ? data.education : [],
    projects: Array.isArray(data.projects) ? data.projects : [],
    languages: Array.isArray(data.languages) ? data.languages : [],
    certifications: Array.isArray(data.certifications) ? data.certifications : [],
    socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
    achievements: Array.isArray(data.achievements) ? data.achievements : [],
    references: Array.isArray(data.references) ? data.references : [],
    customSections: Array.isArray(data.customSections) ? data.customSections : [],
    candidateType: data.candidateType || "experienced",
  };

  const supplementarySections = renderSupplementarySections(safe);
  const isFresher = data.candidateType === "fresher" || safe.experience.length === 0;

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>${safe.fullName || "Resume"}</title>

<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    width: 794px;
    min-height: 1123px;
    margin: 0 auto;
    font-family: Arial, Helvetica, sans-serif;
    color: #0f172a;
    background: #ffffff;
    border: 1px solid #d1d5db;
  }

  .layout {
    display: grid;
    grid-template-columns: 30% 70%;
    min-height: 1123px;
  }

  .left {
    background: #f1f5f9;
    padding: 32px;
  }

  .right {
    padding: 40px;
  }

  h1 {
    font-size: 24px;
    font-weight: 700;
    word-break: normal;
    overflow-wrap: break-word;
    hyphens: none;
    word-spacing: normal;
  }

  .role {
    font-size: 13px;
    color: #475569;
    margin-top: 6px;
  }

  .contact {
    margin-top: 20px;
    font-size: 13px;
    color: #334155;
  }

  .contact div {
    margin-bottom: 8px;
  }

  .left-title {
    font-size: 13px;
    font-weight: 700;
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 4px;
    margin-top: 24px;
  }

  .section {
    margin-bottom: 28px;
  }

  .section-title {
    font-size: 14px;
    font-weight: 700;
    border-bottom: 2px solid #334155;
    padding-bottom: 4px;
    margin-bottom: 10px;
    letter-spacing: 0.05em;
  }

  p {
    font-size: 13px;
    line-height: 1.6;
  }

  ul {
    padding-left: 16px;
    margin-top: 6px;
  }

  li {
    font-size: 13px;
    margin-bottom: 4px;
  }

  .sub {
    font-size: 12px;
    color: #64748b;
  }

  ${sharedTemplateStyles}
</style>
</head>

<body>
  <div class="page">
  <div class="layout">

    <!-- LEFT -->
    <div class="left">
      <h1>${safe.fullName || "Your Name"}</h1>
      ${safe.role ? `<div class="role">${safe.role}</div>` : ""}

      <div class="contact">
        ${safe.email ? `<div>✉ ${safe.email}</div>` : ""}
        ${safe.phone ? `<div>📞 ${safe.phone}</div>` : ""}
        ${safe.address ? `<div>📍 ${safe.address}</div>` : ""}
        ${safe.socialLinks.length > 0 ? safe.socialLinks.map((link) => `<div>🔗 ${link.platform}: ${link.url}</div>`).join("") : ""}
      </div>

      ${safe.skills.length > 0 ? `
        <div class="left-title">SKILLS</div>
        <ul>${safe.skills.map((s) => `<li>${s}</li>`).join("")}</ul>
      ` : ""}

      ${safe.strengths.length > 0 ? `
        <div class="left-title">STRENGTHS</div>
        <ul>${safe.strengths.map((s) => `<li>${s}</li>`).join("")}</ul>
      ` : ""}

      ${safe.hobbies.length > 0 ? `
        <div class="left-title">HOBBIES</div>
        <div>${safe.hobbies.join(", ")}</div>
      ` : ""}
    </div>

    <!-- RIGHT -->
    <div class="right">

      ${(safe.summary || safe.careerObjective) ? `
      <div class="section">
        <div class="section-title">
          ${isFresher ? "CAREER OBJECTIVE" : "PROFESSIONAL SUMMARY"}
        </div>
        <p>
          ${isFresher
            ? (safe.careerObjective || safe.summary)
            : (safe.summary || safe.careerObjective)}
        </p>
      </div>` : ""}

      ${safe.experience.length > 0 ? `
      <div class="section">
        <div class="section-title">WORK EXPERIENCE</div>
        ${safe.experience.map((e) => `
          <p><strong>${e.role} — ${e.company}</strong></p>
          <div class="sub">${e.startDate} - ${e.endDate}</div>
          <p>${e.description}</p>
        `).join("")}
      </div>` : ""}

      ${safe.education.length > 0 ? `
      <div class="section">
        <div class="section-title">EDUCATION</div>
        ${safe.education.map((ed) => `
          <p><strong>${ed.degree}</strong></p>
          <div class="sub">${ed.school} | ${ed.startYear} - ${ed.endYear}</div>
        `).join("")}
      </div>` : ""}

      ${safe.certifications.length > 0 ? `
      <div class="section">
        <div class="section-title">CERTIFICATIONS</div>
        ${safe.certifications.map((c) => `
          <p><strong>${c.name}</strong></p>
          <div class="sub">${c.issuer} | ${c.date}</div>
        `).join("")}
      </div>` : ""}

      ${safe.projects.length > 0 ? `
      <div class="section">
        <div class="section-title">PROJECTS</div>
        ${safe.projects.map((p) => `
          <p><strong>${p.name}</strong></p>
          <p>${p.description}</p>
        `).join("")}
      </div>` : ""}

      ${safe.languages.length > 0 ? `
      <div class="section">
        <div class="section-title">LANGUAGES</div>
        <ul style="list-style: none; padding: 0;">
          ${safe.languages.map((lang) => `
            <li style="margin-bottom: 4px;">• ${lang.language}${lang.level ? ` (${lang.level})` : ""}</li>
          `).join("")}
        </ul>
      </div>` : ""}

      ${supplementarySections}
    </div>

  </div>
  </div>
</body>
</html>
`;
}
