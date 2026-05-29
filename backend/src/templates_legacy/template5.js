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

import { getSummaryConfig, renderSupplementarySections, sharedTemplateStyles } from "./templateShared.js";

export function template5HTML(data) {
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
    padding: 24px 26px 20px 34px;
    box-sizing: border-box;
    position: relative;
    background: #ffffff;
  }

  .page::before {
    content: "";
    position: absolute;
    left: 18px;
    top: 24px;
    bottom: 20px;
    width: 5px;
    background: linear-gradient(180deg, #2563eb 0%, #0ea5e9 100%);
    border-radius: 999px;
  }

  .header {
    margin-left: 8px;
    padding-bottom: 12px;
    border-bottom: 1px solid #dbe4ee;
  }

  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
  }

  h1 {
    margin: 0;
    font-size: 27px;
    line-height: 1.08;
    font-weight: 800;
    letter-spacing: -0.5px;
  }

  .role {
    margin-top: 4px;
    font-size: 14px;
    color: #475569;
    font-weight: 600;
  }

  .header-summary {
    max-width: 345px;
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

  .main-grid {
    display: grid;
    grid-template-columns: 214px 1fr;
    gap: 16px;
    margin-top: 14px;
    margin-left: 8px;
  }

  .section {
    margin-bottom: 12px;
  }

  .section-title {
    margin: 0 0 6px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: #0f172a;
  }

  .rail-card {
    background: #f8fafc;
    border: 1px solid #dbe4ee;
    border-radius: 10px;
    padding: 9px 10px;
  }

  .main-card {
    border: 1px solid #dbe4ee;
    border-radius: 10px;
    padding: 10px 11px;
    background: #ffffff;
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
    color: #1e293b;
  }

  .chip-skill { background: #fef3c7; color: #92400e; }
  .chip-strength { background: #e0f2fe; color: #0369a1; }
  .chip-interest { background: #fce7f3; color: #9d174d; }

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
    font-size: 10.6px;
    color: #64748b;
    font-weight: 600;
  }

  .item-text {
    margin-top: 5px;
    font-size: 10.9px;
    line-height: 1.42;
    color: #334155;
  }

  .timeline-block {
    position: relative;
    padding-left: 14px;
  }

  .timeline-block::before {
    content: "";
    position: absolute;
    left: 0;
    top: 2px;
    bottom: 2px;
    width: 2px;
    background: linear-gradient(180deg, #2563eb 0%, #10b981 100%);
    border-radius: 999px;
  }

  .timeline-date {
    float: right;
    margin-left: 10px;
    font-size: 10px;
    color: #475569;
    font-weight: 700;
  }

  .meta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 10px;
    margin-top: 4px;
    font-size: 10.4px;
    color: #64748b;
  }

  .meta-row span:not(:last-child)::after {
    content: "•";
    margin-left: 10px;
    color: #94a3b8;
  }

  .project-tech {
    margin-top: 5px;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .project-tech span {
    font-size: 9.6px;
    padding: 3px 6px;
    border-radius: 999px;
    background: #fee2e2;
    color: #991b1b;
  }

  .split-grid {
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
    font-size: 10.6px;
    color: #334155;
  }

  ${sharedTemplateStyles}
</style>
</head>
<body>
<div class="page">
  <header class="header">
    <div class="header-row">
      <div>
        <h1>${data.fullName || "Your Name"}</h1>
        ${data.role ? `<div class="role">${data.role}</div>` : ""}
      </div>
      ${summaryText ? `<div class="header-summary">${summaryText}</div>` : ""}
    </div>

    <div class="contact-row">
      ${data.email ? `<span>Email: ${data.email}</span>` : ""}
      ${data.phone ? `<span>Phone: ${data.phone}</span>` : ""}
      ${data.address ? `<span>Location: ${data.address}</span>` : ""}
      ${socialLinks.map((link) => `<span>${link.platform}: ${link.url}</span>`).join("")}
    </div>
  </header>

  <div class="main-grid">
    <aside>
      ${summaryText ? `
      <section class="section">
        <h2 class="section-title">${summaryTitle}</h2>
        <div class="rail-card summary-card" style="font-size:10.9px; line-height:1.45; color:#334155;">
          ${summaryText}
        </div>
      </section>` : ""}

      ${data.skills?.length ? `
      <section class="section">
        <h2 class="section-title">Skills</h2>
        <div class="rail-card">
          <div class="chip-list">
            ${data.skills.map((skill) => `<span class="chip chip-skill">${skill}</span>`).join("")}
          </div>
        </div>
      </section>` : ""}

      ${data.certifications?.length ? `
      <section class="section">
        <h2 class="section-title">Certifications</h2>
        <div class="rail-card stack">
          ${data.certifications.map((cert) => `
            <div>
              <div class="item-title" style="font-size:11px;">${cert.name}</div>
              ${(cert.issuer || cert.year) ? `<div class="item-sub">${[cert.issuer, cert.year].filter(Boolean).join(" • ")}</div>` : ""}
            </div>
          `).join("")}
        </div>
      </section>` : ""}

      ${data.languages?.length ? `
      <section class="section">
        <h2 class="section-title">Languages</h2>
        <div class="rail-card mini-list">
          ${data.languages.map((lang) => `<div><strong>${lang.language}</strong>${lang.level ? ` <span style="color:#64748b;">(${lang.level})</span>` : ""}</div>`).join("")}
        </div>
      </section>` : ""}

      ${data.strengths?.length ? `
      <section class="section">
        <h2 class="section-title">Strengths</h2>
        <div class="rail-card">
          <div class="chip-list">
            ${data.strengths.map((item) => `<span class="chip chip-strength">${item}</span>`).join("")}
          </div>
        </div>
      </section>` : ""}

      ${data.hobbies?.length ? `
      <section class="section">
        <h2 class="section-title">Interests</h2>
        <div class="rail-card">
          <div class="chip-list">
            ${data.hobbies.map((item) => `<span class="chip chip-interest">${item}</span>`).join("")}
          </div>
        </div>
      </section>` : ""}
    </aside>

    <main>
      ${data.experience?.length ? `
      <section class="section">
        <h2 class="section-title">Professional Experience</h2>
        <div class="main-card stack">
          ${data.experience.map((exp) => `
            <div class="timeline-block">
              <div class="timeline-date">${[exp.startDate, exp.endDate].filter(Boolean).join(" - ")}</div>
              <div class="item-title">${exp.role}</div>
              ${exp.company ? `<div class="item-sub">${exp.company}</div>` : ""}
              ${exp.description ? `<div class="item-text">${exp.description}</div>` : ""}
            </div>
          `).join("")}
        </div>
      </section>` : ""}

      <div class="split-grid">
        ${data.projects?.length ? `
        <section class="section" style="margin-bottom:0;">
          <h2 class="section-title">Projects</h2>
          <div class="main-card stack">
            ${data.projects.map((project) => `
              <div>
                <div class="item-title">${project.name}</div>
                ${project.description ? `<div class="item-text">${project.description}</div>` : ""}
                ${project.technologies?.length ? `<div class="project-tech">${project.technologies.map((tech) => `<span>${tech}</span>`).join("")}</div>` : ""}
              </div>
            `).join("")}
          </div>
        </section>` : `<div></div>`}

        <section class="section" style="margin-bottom:0;">
          ${data.education?.length ? `
          <div style="margin-bottom:10px;">
            <h2 class="section-title">Education</h2>
            <div class="main-card stack">
              ${data.education.map((edu) => `
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

          ${socialLinks.length ? `
          <div style="margin-bottom:10px;">
            <h2 class="section-title">Links</h2>
            <div class="main-card link-list">
              ${socialLinks.map((link) => `<div>${link.platform}: ${link.url}</div>`).join("")}
            </div>
          </div>` : ""}

          ${supplementarySections}
        </section>
      </div>
    </main>
  </div>
</div>
</body>
</html>
`;
}
