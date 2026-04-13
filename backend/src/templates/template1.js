export function template1HTML(data) {
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
  ${data.summary ? `
  <section class="section">
    <h2>Professional Summary</h2>
    <p>${data.summary}</p>
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
            .slice(0, 3)
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
    ${data.projects.slice(0, 2).map(project => `
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
      ${data.certifications.slice(0, 3).map(cert => `
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

</div>
</body>
</html>
`;
}
