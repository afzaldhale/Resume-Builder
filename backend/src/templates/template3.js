// template3.js
export function template3HTML(data) {
  const isFresher = data.candidateType === "fresher";
  const summaryText = isFresher
    ? data.careerObjective || data.summary
    : data.summary || data.careerObjective;
  const summaryTitle = isFresher ? "Career Objective" : "Professional Summary";

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

  <!-- Two Column Layout for Template 3 -->
  <div class="two-column">
    <!-- Left Column -->
    <div>
      <!-- SUMMARY -->
      ${summaryText ? `
      <section class="section">
        <h2>${summaryTitle}</h2>
        <p>${summaryText}</p>
      </section>
      ` : ""}

      <!-- SKILLS - Display as badges -->
      ${data.skills?.length ? `
      <section class="section">
        <h2>Skills</h2>
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
        <h2>Education</h2>
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
        <h2>Professional Experience</h2>
        ${data.experience.map(exp => `
          <div class="project-card">
            <h3>${exp.role}${exp.company ? ` – ${exp.company}` : ""}</h3>
            <p class="muted">${exp.startDate || ""}${exp.endDate ? ` – ${exp.endDate}` : ""}</p>

            ${exp.description ? `
            <ul>
              ${exp.description
                .split("\\n")
                .filter(Boolean)
                .slice(0, 3)
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
        <h2>Projects</h2>
        ${data.projects.slice(0, 2).map(project => `
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
      <h2>Certifications</h2>
      <ul>
        ${data.certifications.slice(0, 3).map(cert => `
          <li>${cert.name}${cert.issuer ? ` – ${cert.issuer}` : ""}${cert.year ? ` (${cert.year})` : ""}</li>
        `).join("")}
      </ul>
    </div>
    ` : ""}

    <!-- LANGUAGES -->
    ${data.languages?.length ? `
    <div style="flex: 1;">
      <h2>Languages</h2>
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
    <h2>Hobbies & Interests</h2>
    <p>${data.hobbies.join(", ")}</p>
  </section>
  ` : ""}

  <!-- FOOTER -->
  <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #d1d5db; font-size: 11px; color: #6b7280;">
    <div style="display: flex; justify-content: space-between;">
      <span>Template 3 - Modern Layout</span>
      <span>Generated on ${new Date().toLocaleDateString()}</span>
    </div>
  </div>

</div>
</body>
</html>
`;
}