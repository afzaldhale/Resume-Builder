// template12.js
export function template12HTML(data) {
  const safe = {
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
    candidateType: data.candidateType || "experienced"
  };

  const isFresher = data.candidateType === "fresher" || safe.experience.length === 0;

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>${safe.fullName || "Resume"}</title>

<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    width: 794px;
    min-height: 1123px;
    margin: 0 auto;
    font-family: Arial, Helvetica, sans-serif;
    background: #f1f5f9;
    color: #111827;
  }

  .header {
    background: #0f766e;
    color: #ffffff;
    padding: 32px 40px;
  }

  h1 {
    font-size: 28px;
    font-weight: 700;
  }

  .role {
    font-size: 16px;
    color: #ccfbf1;
    margin-top: 4px;
  }

  .contact {
    margin-top: 16px;
    font-size: 13px;
  }

  .contact span {
    margin-right: 18px;
  }

  .content {
    padding: 40px;
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 32px;
  }

  .section {
    margin-bottom: 28px;
  }

  .section-title {
    font-size: 14px;
    font-weight: 700;
    border-bottom: 2px solid #5eead4;
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
    font-size: 13px;
  }

  li {
    margin-bottom: 4px;
  }

</style>
</head>

<body>

  <div class="header">
    <h1>${safe.fullName || "Your Name"}</h1>
    ${safe.role ? `<div class="role">${safe.role}</div>` : ""}
    <div class="contact">
      ${safe.email ? `<span>✉ ${safe.email}</span>` : ""}
      ${safe.phone ? `<span>📞 ${safe.phone}</span>` : ""}
      ${safe.address ? `<span>📍 ${safe.address}</span>` : ""}
    </div>
  </div>

  <div class="content">

    <!-- LEFT -->
    <div>

      ${safe.skills.length > 0 ? `
      <div class="section">
        <div class="section-title">SKILLS</div>
        <ul>
          ${safe.skills.map(s => `<li>${s}</li>`).join("")}
        </ul>
      </div>` : ""}

      ${safe.education.length > 0 ? `
      <div class="section">
        <div class="section-title">EDUCATION</div>
        ${safe.education.map(e => `
          <p><strong>${e.degree}</strong><br/>
          <span style="font-size:12px;color:#4b5563">${e.school} | ${e.startYear} - ${e.endYear}</span></p>
        `).join("")}
      </div>` : ""}

    </div>

    <!-- RIGHT -->
    <div>

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
        ${safe.experience.map(exp => `
          <p><strong>${exp.role} — ${exp.company}</strong><br/>
          <span style="font-size:12px;color:#4b5563">${exp.startDate} - ${exp.endDate}</span></p>
          <p>${exp.description}</p>
        `).join("")}
      </div>` : ""}

      ${safe.projects.length > 0 ? `
      <div class="section">
        <div class="section-title">PROJECTS</div>
        ${safe.projects.map(p => `
          <p><strong>${p.name}</strong></p>
          <p>${p.description}</p>
        `).join("")}
      </div>` : ""}

    </div>
  </div>

</body>
</html>
`;
}
