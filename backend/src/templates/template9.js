// template9.js - ONE PAGE DARK THEME (STRICT A4)
export function template9HTML(data) {
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
    languages: Array.isArray(data.languages) ? data.languages.slice(0, 3) : [],
    strengths: Array.isArray(data.strengths) ? data.strengths.slice(0, 4) : [],
    hobbies: Array.isArray(data.hobbies) ? data.hobbies.slice(0, 3) : [],
    socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks.slice(0, 2) : []
  };

  const isFresher = safeData.experience.length === 0;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Resume - ${safeData.fullName || "Dark Resume"}</title>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* ===== A4 LOCK ===== */
  body {
    width: 794px;
    height: 1123px;
    margin: 0 auto;
    background: linear-gradient(135deg, #111827, #1f2937, #111827);
    color: #ffffff;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    overflow: hidden;
    position: relative;
  }

  .background-pattern {
    position: absolute;
    inset: 0;
    opacity: 0.05;
  }

  .dot-pattern {
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(circle at 25px 25px, rgba(255,255,255,0.2) 2%, transparent 0%);
    background-size: 100px 100px;
  }

  .top-line, .bottom-line {
    position: absolute;
    width: 100%;
    height: 1px;
  }

  .top-line {
    top: 0;
    background: linear-gradient(90deg, #3b82f6, #10b981);
  }

  .bottom-line {
    bottom: 0;
    background: linear-gradient(90deg, #10b981, #3b82f6);
  }

  .container {
    position: relative;
    z-index: 10;
    height: 1123px;
    padding: 28px 32px;
    display: flex;
    flex-direction: column;
  }

  /* ===== HEADER ===== */
  .header {
    text-align: center;
    padding-bottom: 14px;
    margin-bottom: 14px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .name {
    font-size: 26px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .role {
    font-size: 15px;
    color: #d1d5db;
    margin-bottom: 12px;
    letter-spacing: 0.8px;
  }

  .contact-info {
    display: flex;
    justify-content: center;
    gap: 18px;
    flex-wrap: wrap;
  }

  .contact-label {
    font-size: 9px;
    color: #9ca3af;
    letter-spacing: 1px;
  }

  .contact-value {
    font-size: 11px;
    color: #e5e7eb;
  }

  .social-links {
    display: flex;
    justify-content: center;
    gap: 14px;
    margin-top: 6px;
  }

  .social-link {
    font-size: 10px;
    color: #93c5fd;
    text-decoration: none;
  }

  /* ===== SUMMARY ===== */
  .summary-card {
    background: rgba(31,41,55,0.5);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 6px;
    padding: 12px;
    margin-bottom: 12px;
  }

  .summary-content {
    font-size: 11px;
    line-height: 1.45;
    text-align: center;
    color: #d1d5db;
  }

  /* ===== GRID ===== */
  .main-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
    flex: 1;
  }

  .section {
    margin-bottom: 12px;
    page-break-inside: avoid;
  }

  .section-title {
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 8px;
    border-bottom: 1px solid rgba(59,130,246,0.5);
    padding-bottom: 3px;
  }

  /* ===== SKILLS ===== */
  .skill-item {
    font-size: 11px;
    padding-left: 12px;
    position: relative;
    margin-bottom: 4px;
  }

  .skill-bullet {
    width: 6px;
    height: 6px;
    background: #3b82f6;
    border-radius: 50%;
    position: absolute;
    left: 0;
    top: 4px;
  }

  /* ===== CARDS ===== */
  .education-card,
  .exp-card,
  .project-card,
  .cert-card,
  .strength-card {
    background: rgba(31,41,55,0.5);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 6px;
    padding: 12px;
  }

  .edu-degree,
  .exp-title,
  .project-name {
    font-size: 12px;
    font-weight: 600;
  }

  .edu-school,
  .exp-company {
    font-size: 11px;
    color: #d1d5db;
  }

  .exp-description,
  .project-description {
    font-size: 11px;
    line-height: 1.45;
  }

  .tech-tag {
    font-size: 9px;
    padding: 3px 8px;
    background: rgba(255,255,255,0.1);
    border-radius: 12px;
  }

  .strengths-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }

  .hobby-tag {
    font-size: 11px;
    padding: 6px 10px;
    background: rgba(31,41,55,0.5);
    border-radius: 6px;
  }

  /* ===== FOOTER ===== */
  .footer {
    padding-top: 10px;
    border-top: 1px solid rgba(255,255,255,0.1);
    text-align: center;
    font-size: 10px;
    color: #9ca3af;
  }

  @media print {
    body { background: #111827; }
    .background-pattern { display: none; }
  }
</style>
</head>

<body>
<div class="background-pattern">
  <div class="dot-pattern"></div>
  <div class="top-line"></div>
  <div class="bottom-line"></div>
</div>

<div class="container">

<header class="header">
  <h1 class="name">${safeData.fullName || "Your Name"}</h1>
  ${safeData.role ? `<div class="role">${safeData.role}</div>` : ""}

  <div class="contact-info">
    ${safeData.email ? `<div><div class="contact-label">EMAIL</div><div class="contact-value">${safeData.email}</div></div>` : ""}
    ${safeData.phone ? `<div><div class="contact-label">PHONE</div><div class="contact-value">${safeData.phone}</div></div>` : ""}
    ${safeData.address ? `<div><div class="contact-label">LOCATION</div><div class="contact-value">${safeData.address}</div></div>` : ""}
  </div>

  ${safeData.socialLinks.length ? `
  <div class="social-links">
    ${safeData.socialLinks.map(l => `<a class="social-link" href="${l.url.startsWith("http") ? l.url : `https://${l.url}`}">${l.platform}</a>`).join("")}
  </div>` : ""}
</header>

${(safeData.summary || safeData.careerObjective) ? `
<section class="section">
  <h2 class="section-title text-center">${isFresher ? "CAREER OBJECTIVE" : "PROFESSIONAL SUMMARY"}</h2>
  <div class="summary-card">
    <div class="summary-content">${isFresher ? safeData.careerObjective : safeData.summary}</div>
  </div>
</section>` : ""}

<div class="main-grid">

<div>
  ${safeData.skills.length ? `<section class="section"><h2 class="section-title">SKILLS</h2>${safeData.skills.map(s => `<div class="skill-item"><span class="skill-bullet"></span>${s}</div>`).join("")}</section>` : ""}
  ${safeData.education.length ? `<section class="section"><h2 class="section-title">EDUCATION</h2>${safeData.education.map(e => `<div class="education-card"><div class="edu-degree">${e.degree}</div><div class="edu-school">${e.school}</div></div>`).join("")}</section>` : ""}
</div>

<div>
  ${safeData.experience.length ? `<section class="section"><h2 class="section-title">EXPERIENCE</h2>${safeData.experience.map(e => `<div class="exp-card"><div class="exp-title">${e.role}</div><div class="exp-company">${e.company}</div><div class="exp-description">${e.description}</div></div>`).join("")}</section>` : ""}
  ${safeData.projects.length ? `<section class="section"><h2 class="section-title">PROJECTS</h2>${safeData.projects.map(p => `<div class="project-card"><div class="project-name">${p.name}</div><div class="project-description">${p.description}</div></div>`).join("")}</section>` : ""}
</div>

</div>

<footer class="footer">
  ${safeData.fullName || "Your Name"} • Dark Resume • ${new Date().getFullYear()}
</footer>

</div>
</body>
</html>
`;
}
