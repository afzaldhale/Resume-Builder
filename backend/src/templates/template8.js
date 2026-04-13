// template8.js - ONE PAGE VERSION (STRICT A4)
export function template8HTML(data) {
  const safeData = {
    fullName: data.fullName || "",
    role: data.role || "",
    email: data.email || "",
    phone: data.phone || "",
    address: data.address || "",
    summary: data.summary || "",
    careerObjective: data.careerObjective || "",
    skills: Array.isArray(data.skills) ? data.skills.slice(0, 8) : [],
    experience: Array.isArray(data.experience) ? data.experience.slice(0, 2) : [],
    education: Array.isArray(data.education) ? data.education.slice(0, 2) : [],
    projects: Array.isArray(data.projects) ? data.projects.slice(0, 2) : [],
    certifications: Array.isArray(data.certifications) ? data.certifications.slice(0, 3) : [],
    strengths: Array.isArray(data.strengths) ? data.strengths.slice(0, 4) : [],
    hobbies: Array.isArray(data.hobbies) ? data.hobbies.slice(0, 3) : [],
    socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks.slice(0, 2) : [],
    candidateType: data.candidateType || "experienced"
  };

  const isFresher = data.candidateType === "fresher" || safeData.experience.length === 0;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Resume - ${safeData.fullName || "Professional Resume"}</title>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* ===== A4 PAGE LOCK ===== */
  body {
    width: 794px;
    height: 1123px;
    margin: 0 auto;
    background: #ffffff;
    color: #111827;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    overflow: hidden;
  }

  .container {
    height: 1123px;
    padding: 36px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  /* ===== HEADER ===== */
  .header {
    text-align: center;
  }

  .name {
    font-size: 30px;
    font-weight: 700;
    margin-bottom: 2px;
  }

  .role {
    font-size: 17px;
    color: #4b5563;
    margin-bottom: 10px;
  }

  .contact-info {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 14px;
    font-size: 13px;
    color: #374151;
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .social-links {
    display: flex;
    justify-content: center;
    gap: 14px;
    margin-top: 6px;
  }

  .social-link {
    font-size: 12px;
    color: #2563eb;
    text-decoration: underline;
  }

  /* ===== SECTIONS ===== */
  .section {
    page-break-inside: avoid;
  }

  .section-title {
    font-size: 13px;
    font-weight: 700;
    border-bottom: 2px solid #cbd5f5;
    padding-bottom: 3px;
    margin-bottom: 6px;
    letter-spacing: 0.4px;
  }

  .content-text {
    font-size: 12px;
    line-height: 1.45;
  }

  /* ===== SKILLS ===== */
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 3px 20px;
  }

  .skill-item {
    font-size: 12px;
  }

  /* ===== LISTS ===== */
  .list-container {
    list-style-position: inside;
  }

  .list-item {
    font-size: 12px;
    margin-bottom: 2px;
  }

  /* ===== ITEMS ===== */
  .item-container {
    margin-bottom: 8px;
  }

  .item-header {
    display: flex;
    justify-content: space-between;
  }

  .item-title {
    font-size: 13px;
    font-weight: 600;
  }

  .item-subtitle {
    font-size: 12px;
    color: #6b7280;
  }

  .item-date {
    font-size: 11px;
    color: #9ca3af;
    white-space: nowrap;
  }

  .item-description {
    font-size: 12px;
    line-height: 1.4;
    margin-top: 3px;
  }

  /* ===== PROJECTS ===== */
  .project-item {
    margin-bottom: 8px;
  }

  .project-name {
    font-size: 13px;
    font-weight: 600;
  }

  .project-description {
    font-size: 12px;
  }

  .project-tech {
    font-size: 11px;
    font-style: italic;
    color: #6b7280;
  }

  /* ===== FOOTER ===== */
  .footer {
    margin-top: auto;
    padding-top: 10px;
    border-top: 1px solid #e5e7eb;
    text-align: center;
    font-size: 11px;
    color: #6b7280;
  }

  @media print {
    body {
      margin: 0;
    }
  }
</style>
</head>

<body>
<div class="container">

<header class="header">
  <h1 class="name">${safeData.fullName || "Your Name"}</h1>
  ${safeData.role ? `<div class="role">${safeData.role}</div>` : ""}

  <div class="contact-info">
    ${safeData.email ? `<div class="contact-item">✉️ ${safeData.email}</div>` : ""}
    ${safeData.phone ? `<div class="contact-item">📞 ${safeData.phone}</div>` : ""}
    ${safeData.address ? `<div class="contact-item">📍 ${safeData.address}</div>` : ""}
  </div>

  ${safeData.socialLinks.length ? `
  <div class="social-links">
    ${safeData.socialLinks.map(l => `
      <a class="social-link" href="${l.url.startsWith('http') ? l.url : `https://${l.url}`}" target="_blank">
        ${l.platform}
      </a>
    `).join("")}
  </div>` : ""}
</header>

${(safeData.summary || safeData.careerObjective) ? `
<section class="section">
  <h2 class="section-title">${isFresher ? "CAREER OBJECTIVE" : "PROFESSIONAL SUMMARY"}</h2>
  <p class="content-text">
    ${isFresher ? (safeData.careerObjective || safeData.summary) : (safeData.summary || safeData.careerObjective)}
  </p>
</section>` : ""}

${safeData.skills.length ? `
<section class="section">
  <h2 class="section-title">SKILLS</h2>
  <div class="skills-grid">
    ${safeData.skills.map(s => `<div class="skill-item">• ${s}</div>`).join("")}
  </div>
</section>` : ""}

${safeData.education.length ? `
<section class="section">
  <h2 class="section-title">EDUCATION</h2>
  ${safeData.education.map(e => `
    <div class="item-container">
      <div class="item-header">
        <div class="item-title">${e.degree}</div>
        <div class="item-date">${e.startYear} - ${e.endYear}</div>
      </div>
      <div class="item-subtitle">${e.school}</div>
    </div>`).join("")}
</section>` : ""}

${safeData.experience.length ? `
<section class="section">
  <h2 class="section-title">WORK EXPERIENCE</h2>
  ${safeData.experience.map(e => `
    <div class="item-container">
      <div class="item-header">
        <div class="item-title">${e.role} — ${e.company}</div>
        <div class="item-date">${e.startDate} - ${e.endDate}</div>
      </div>
      <div class="item-description">${e.description}</div>
    </div>`).join("")}
</section>` : ""}

${safeData.projects.length ? `
<section class="section">
  <h2 class="section-title">PROJECTS</h2>
  ${safeData.projects.map(p => `
    <div class="project-item">
      <div class="project-name">${p.name}</div>
      <div class="project-description">${p.description}</div>
      ${p.technologies?.length ? `<div class="project-tech">Tech: ${p.technologies.slice(0,3).join(", ")}</div>` : ""}
    </div>`).join("")}
</section>` : ""}

<footer class="footer">
  ${safeData.fullName || "Your Name"} • Resume
</footer>

</div>
</body>
</html>
`;
}
