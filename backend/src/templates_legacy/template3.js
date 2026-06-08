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

// template3.js
export function template3HTML(data) {
  const { summaryText, summaryTitle } = getSummaryConfig(data);
  const supplementarySections = renderSupplementarySections(data, {
    include: ["strengths", "achievements", "references", "customSections"],
  });

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
    color: #111827;
  }

  .page {
    width: 794px;
    min-height: 1123px;
    margin: auto;
    box-sizing: border-box;
    background: #ffffff;
  }

  .template-3-page {
    padding: 52px 48px 42px 48px;
    overflow: hidden;
  }

  .template-3-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
  }

  .left-header {
    flex: 1;
    min-width: 0;
  }

  .right-header {
    width: 260px;
    flex-shrink: 0;
  }

  .template-3-content {
    width: 100%;
    max-width: 100%;
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
    /* replaced underline with full-width colored bar via .section-heading-row/.section-heading-bar */
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

  /* Full-width section heading bar */
  .section-heading-row {
    width: 100%;
    display: block;
    margin-top: 18px;
    margin-bottom: 10px;
  }

  .section-heading-bar {
    background: var(--headingBarColor, #3b82f6); /* default, can be overridden per section */
    color: var(--headingTextColor, #ffffff);
    height: 34px;
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 100%;
    padding-left: 12px;
    padding-right: 12px;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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

  /* Template 3 specific styles */
  .two-column {
    display: flex;
    gap: 30px;
    margin: 20px 0;
  }

  .two-column > div {
    flex: 1;
  }

  .skill-badge {
    display: inline-block;
    background: #f3f4f6;
    padding: 4px 10px;
    border-radius: 12px;
    margin: 3px;
    font-size: 12px;
  }

  .project-card {
    border-left: 3px solid #3b82f6;
    padding-left: 10px;
    margin: 10px 0;
  }

  .cert-badge {
    display: inline-block;
    background: #dbeafe;
    color: #1e40af;
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 11px;
    margin-right: 5px;
    margin-bottom: 5px;
  }

  .language-progress {
    display: flex;
    align-items: center;
    margin: 5px 0;
  }

  .progress-bar {
    width: 100px;
    height: 6px;
    background: #e5e7eb;
    border-radius: 3px;
    margin: 0 10px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: #10b981;
  }

  ${sharedTemplateStyles}
</style>
</head>

<body>
<div class="page template-3-page">

  <!-- HEADER -->
  <header>
    <div class="template-3-header">
      <div class="left-header">
        <h1>${data.fullName || ""}</h1>
        ${data.role ? `<p><strong>${data.role}</strong></p>` : ""}
      </div>
      <div class="right-header">
        <div class="contact">
          ${data.email ? `<p>Email: ${data.email}</p>` : ""}
          ${data.phone ? `<p>Phone: ${data.phone}</p>` : ""}
          ${data.address ? `<p>Location: ${data.address}</p>` : ""}
          ${data.socialLinks?.length ? `<p>${data.socialLinks.map(l => `${l.platform}: ${l.url}`).join(" | ")}</p>` : ""}
        </div>
      </div>
    </div>
  </header>

  <div class="header-divider"></div>

  <div class="template-3-content">
    <!-- Two Column Layout for Template 3 -->
    <div class="two-column">
    <!-- Left Column -->
    <div>
      <!-- SUMMARY -->
      ${summaryText ? `
      <section class="section">
        <div class="section-heading-row">
          <div class="section-heading-bar">${summaryTitle}</div>
        </div>
        <p>${summaryText}</p>
      </section>
      ` : ""}

      <!-- SKILLS - Display as badges -->
      ${data.skills?.length ? `
      <section class="section">
        <div class="section-heading-row">
          <div class="section-heading-bar" style="background:#8b5cf6">Skills</div>
        </div>
        <div>
          ${[...new Set(data.skills)].map(skill => `
            <span class="skill-badge">${skill}</span>
          `).join("")}
        </div>
      </section>
      ` : ""}

      <!-- EDUCATION -->
      ${data.education?.length ? `
      <section class="section">
        <div class="section-heading-row">
          <div class="section-heading-bar" style="background:#10b981">Education</div>
        </div>
        ${data.education.map(edu => `
          <div>
            <h3>${edu.degree} – ${edu.school}</h3>
            <p class="muted">${edu.startYear || ""}${edu.endYear ? ` – ${edu.endYear}` : ""}</p>
            ${edu.gpa ? `<p class="muted">GPA: ${edu.gpa}</p>` : ""}
          </div>
        `).join("")}
      </section>
      ` : ""}
    </div>

    <!-- Right Column -->
    <div>
      <!-- EXPERIENCE -->
      ${data.experience?.length ? `
      <section class="section">
        <div class="section-heading-row">
          <div class="section-heading-bar" style="background:#2563eb">Professional Experience</div>
        </div>
        ${data.experience.map(exp => `
          <div class="project-card">
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
          </div>
        `).join("")}
      </section>
      ` : ""}

      <!-- PROJECTS -->
      ${data.projects?.length ? `
      <section class="section">
        <div class="section-heading-row">
          <div class="section-heading-bar" style="background:#f59e0b">Projects</div>
        </div>
        ${data.projects.map(project => `
          <div class="project-card">
            <h3>${project.name}</h3>
            <p>${project.description}</p>
            ${project.technologies?.length ? `
              <div style="margin-top: 5px;">
                ${project.technologies.map(tech => `
                  <span class="cert-badge">${tech}</span>
                `).join("")}
              </div>
            ` : ""}
          </div>
        `).join("")}
      </section>
      ` : ""}
    </div>
  </div>

  <!-- Bottom Sections -->
  <div style="display: flex; gap: 30px; margin-top: 20px;">
    <!-- CERTIFICATIONS -->
    ${data.certifications?.length ? `
    <div style="flex: 1;">
      <div class="section-heading-row">
        <div class="section-heading-bar" style="background:#ef4444">Certifications</div>
      </div>
      <ul>
        ${data.certifications.map(cert => `
          <li>${cert.name}${cert.issuer ? ` – ${cert.issuer}` : ""}${cert.year ? ` (${cert.year})` : ""}</li>
        `).join("")}
      </ul>
    </div>
    ` : ""}

    <!-- LANGUAGES -->
    ${data.languages?.length ? `
    <div style="flex: 1;">
      <div class="section-heading-row">
        <div class="section-heading-bar" style="background:#14b8a6">Languages</div>
      </div>
      ${data.languages.map(lang => `
        <div class="language-progress">
          <span style="min-width: 80px;">${lang.language}</span>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${
              lang.level === "Native" ? "100" :
              lang.level === "Fluent" ? "90" :
              lang.level === "Intermediate" ? "70" : "40"
            }%"></div>
          </div>
          <span style="font-size: 11px; color: #6b7280;">${lang.level}</span>
        </div>
      `).join("")}
    </div>
    ` : ""}
  </div>

  <!-- HOBBIES -->
  ${data.hobbies?.length ? `
  <section class="section" style="margin-top: 20px;">
    <div class="section-heading-row">
      <div class="section-heading-bar" style="background:#f97316; color:#ffffff;">
        Hobbies & Interests
      </div>
    </div>
    <p>${data.hobbies.join(", ")}</p>
  </section>
  ` : ""}

  ${supplementarySections}

  </div>
</div>
</body>
</html>
`;
}
