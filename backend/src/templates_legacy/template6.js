/**
 * ⚠️ DEPRECATED: Backend templates are no longer used for PDF generation
 * 
 * This file is kept for legacy/reference purposes only.
 * React ResumeDocument (frontend) is the single source of truth for all template rendering.
 * 
 * PDF generation now routes through: frontend /print/resume endpoint → puppeteer capture
 * 
 * This file will be removed in a future cleanup commit.
 * Do not import or use in new code.
 */

import { renderSupplementarySections, sharedTemplateStyles } from "./templateShared.js";

export function template6HTML(data) {
  const safeData = {
    fullName: data.fullName || "",
    role: data.role || "",
    email: data.email || "",
    phone: data.phone || "",
    address: data.address || "",
    summary: data.summary || "",
    careerObjective: data.careerObjective || "",
    skills: Array.isArray(data.skills) ? data.skills : [],
    experience: Array.isArray(data.experience) ? data.experience : [],
    education: Array.isArray(data.education) ? data.education : [],
    projects: Array.isArray(data.projects) ? data.projects : [],
    certifications: Array.isArray(data.certifications) ? data.certifications : [],
    languages: Array.isArray(data.languages) ? data.languages : [],
    socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
    hobbies: Array.isArray(data.hobbies) ? data.hobbies : [],
    strengths: Array.isArray(data.strengths) ? data.strengths : [],
    achievements: Array.isArray(data.achievements) ? data.achievements : [],
    references: Array.isArray(data.references) ? data.references : [],
    customSections: Array.isArray(data.customSections) ? data.customSections : [],
    candidateType: data.candidateType || "experienced",
  };

  const supplementarySections = renderSupplementarySections(safeData);
  const isFresher =
    data.candidateType === "fresher" ||
    (!data.candidateType && safeData.experience.length === 0);
  const summaryText = isFresher
    ? safeData.careerObjective || safeData.summary
    : safeData.summary || safeData.careerObjective;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Resume - ${safeData.fullName || "Professional Resume"}</title>
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
    padding: 22px 24px 18px;
    box-sizing: border-box;
    background: linear-gradient(180deg, #f8fbff 0%, #ffffff 18%);
  }

  .frame {
    min-height: 100%;
    border: 1px solid #d7e3ef;
    border-radius: 12px;
    overflow: hidden;
  }

  .header {
    padding: 18px 22px 14px;
    background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
    border-bottom: 1px solid #d7e3ef;
  }

  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
  }

  h1 {
    margin: 0;
    font-size: 26px;
    line-height: 1.08;
    font-weight: 800;
    letter-spacing: -0.4px;
  }

  .role {
    margin-top: 4px;
    font-size: 14px;
    color: #475569;
    font-weight: 600;
  }

  .header-summary {
    max-width: 350px;
    font-size: 11.2px;
    line-height: 1.45;
    color: #475569;
    text-align: right;
  }

  .contact-row {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px 12px;
    font-size: 10.8px;
    color: #475569;
  }

  .contact-row span:not(:last-child)::after {
    content: "•";
    margin-left: 12px;
    color: #94a3b8;
  }

  .layout {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 16px;
    padding: 16px 18px 16px 18px;
  }

  .section {
    margin-bottom: 12px;
  }

  .section-title {
    margin: 0 0 6px;
    font-size: 10.8px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: #0f172a;
  }

  .side-card,
  .main-card {
    border: 1px solid #dbe4ee;
    border-radius: 10px;
    padding: 9px 10px;
    background: #ffffff;
  }

  .side-card {
    background: #fbfdff;
  }

  .summary-card {
    background: #eff6ff;
    border-color: #bfdbfe;
  }

  .chip-list {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .chip {
    padding: 4px 7px;
    border-radius: 999px;
    font-size: 10.2px;
    font-weight: 600;
    line-height: 1.15;
  }

  .chip-skill { background: #dcfce7; color: #166534; }
  .chip-strength { background: #fef3c7; color: #92400e; }
  .chip-hobby { background: #fce7f3; color: #9d174d; }

  .stack > * + * {
    margin-top: 7px;
  }

  .item-title {
    font-size: 12px;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
  }

  .item-sub {
    margin-top: 2px;
    font-size: 10.5px;
    color: #64748b;
    font-weight: 600;
  }

  .item-text {
    margin-top: 5px;
    font-size: 10.9px;
    line-height: 1.42;
    color: #334155;
  }

  .meta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 10px;
    margin-top: 4px;
    font-size: 10.3px;
    color: #64748b;
  }

  .meta-row span:not(:last-child)::after {
    content: "•";
    margin-left: 10px;
    color: #94a3b8;
  }

  .experience-block {
    border-left: 2px solid #2563eb;
    padding-left: 10px;
  }

  .project-tech {
    margin-top: 5px;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .project-tech span {
    font-size: 9.5px;
    padding: 3px 6px;
    border-radius: 999px;
    background: #fef3c7;
    color: #92400e;
  }

  .dual-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .mini-list {
    display: grid;
    gap: 6px;
    font-size: 10.8px;
    color: #334155;
  }

  .mini-list strong {
    color: #0f172a;
  }

  .link-list {
    display: grid;
    gap: 5px;
    font-size: 10.5px;
    color: #334155;
  }

  ${sharedTemplateStyles}
</style>
</head>
<body>
<div class="page">
  <div class="frame">
    <header class="header">
      <div class="header-top">
        <div>
          <h1>${safeData.fullName || "Your Name"}</h1>
          ${safeData.role ? `<div class="role">${safeData.role}</div>` : ""}
        </div>
        ${summaryText ? `<div class="header-summary">${summaryText}</div>` : ""}
      </div>

      <div class="contact-row">
        ${safeData.email ? `<span>Email: ${safeData.email}</span>` : ""}
        ${safeData.phone ? `<span>Phone: ${safeData.phone}</span>` : ""}
        ${safeData.address ? `<span>Location: ${safeData.address}</span>` : ""}
        ${safeData.socialLinks.map((link) => `<span>${link.platform}: ${link.url}</span>`).join("")}
      </div>
    </header>

    <div class="layout">
      <aside>
        ${summaryText ? `
        <section class="section">
          <h2 class="section-title">${isFresher ? "Career Objective" : "Professional Summary"}</h2>
          <div class="side-card summary-card" style="font-size:10.9px; line-height:1.45; color:#334155;">
            ${summaryText}
          </div>
        </section>` : ""}

        ${safeData.skills.length ? `
        <section class="section">
          <h2 class="section-title">Skills</h2>
          <div class="side-card">
            <div class="chip-list">
              ${safeData.skills.map((skill) => `<span class="chip chip-skill">${skill}</span>`).join("")}
            </div>
          </div>
        </section>` : ""}

        ${safeData.languages.length ? `
        <section class="section">
          <h2 class="section-title">Languages</h2>
          <div class="side-card mini-list">
            ${safeData.languages.map((lang) => `<div><strong>${lang.language}</strong>${lang.level ? ` <span style="color:#64748b;">(${lang.level})</span>` : ""}</div>`).join("")}
          </div>
        </section>` : ""}

        ${safeData.certifications.length ? `
        <section class="section">
          <h2 class="section-title">Certifications</h2>
          <div class="side-card stack">
            ${safeData.certifications.map((cert) => `
              <div>
                <div class="item-title" style="font-size:11px;">${cert.name}</div>
                ${(cert.issuer || cert.year) ? `<div class="item-sub">${[cert.issuer, cert.year].filter(Boolean).join(" • ")}</div>` : ""}
              </div>
            `).join("")}
          </div>
        </section>` : ""}

        ${safeData.strengths.length ? `
        <section class="section">
          <h2 class="section-title">Strengths</h2>
          <div class="side-card">
            <div class="chip-list">
              ${safeData.strengths.map((strength) => `<span class="chip chip-strength">${strength}</span>`).join("")}
            </div>
          </div>
        </section>` : ""}

        ${safeData.hobbies.length ? `
        <section class="section">
          <h2 class="section-title">Interests</h2>
          <div class="side-card">
            <div class="chip-list">
              ${safeData.hobbies.map((hobby) => `<span class="chip chip-hobby">${hobby}</span>`).join("")}
            </div>
          </div>
        </section>` : ""}
      </aside>

      <main>
        ${safeData.experience.length ? `
        <section class="section">
          <h2 class="section-title">Work Experience</h2>
          <div class="main-card stack">
            ${safeData.experience.map((exp) => `
              <div class="experience-block">
                <div class="item-title">${exp.role}</div>
                ${(exp.company || exp.startDate || exp.endDate) ? `
                <div class="meta-row">
                  ${exp.company ? `<span>${exp.company}</span>` : ""}
                  ${exp.startDate || exp.endDate ? `<span>${[exp.startDate, exp.endDate].filter(Boolean).join(" - ")}</span>` : ""}
                </div>` : ""}
                ${exp.description ? `<div class="item-text">${exp.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        </section>` : ""}

        <div class="dual-grid">
          ${safeData.projects.length ? `
          <section class="section" style="margin-bottom:0;">
            <h2 class="section-title">Projects</h2>
            <div class="main-card stack">
              ${safeData.projects.map((project) => `
                <div>
                  <div class="item-title">${project.name}</div>
                  ${project.description ? `<div class="item-text">${project.description}</div>` : ""}
                  ${project.technologies?.length ? `<div class="project-tech">${project.technologies.map((tech) => `<span>${tech}</span>`).join("")}</div>` : ""}
                </div>
              `).join("")}
            </div>
          </section>` : `<div></div>`}

          <section class="section" style="margin-bottom:0;">
            ${safeData.education.length ? `
            <div style="margin-bottom:10px;">
              <h2 class="section-title">Education</h2>
              <div class="main-card stack">
                ${safeData.education.map((edu) => `
                  <div>
                    <div class="item-title">${edu.degree}</div>
                    ${edu.school ? `<div class="item-sub">${edu.school}</div>` : ""}
                    ${(edu.startYear || edu.endYear || edu.gpa) ? `
                    <div class="meta-row">
                      ${edu.startYear || edu.endYear ? `<span>${[edu.startYear, edu.endYear].filter(Boolean).join(" - ")}</span>` : ""}
                      ${edu.gpa ? `<span>GPA: ${edu.gpa}</span>` : ""}
                    </div>` : ""}
                  </div>
                `).join("")}
              </div>
            </div>` : ""}

            ${safeData.socialLinks.length ? `
            <div style="margin-bottom:10px;">
              <h2 class="section-title">Links</h2>
              <div class="main-card link-list">
                ${safeData.socialLinks.map((link) => `<div>${link.platform}: ${link.url}</div>`).join("")}
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
