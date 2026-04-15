// template14.js
export function template14HTML(data) {
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
    languages: Array.isArray(data.languages) ? data.languages : [],
    hobbies: Array.isArray(data.hobbies) ? data.hobbies : [],
    certifications: Array.isArray(data.certifications) ? data.certifications : [],
    socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
    strengths: Array.isArray(data.strengths) ? data.strengths : [],
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
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    width: 794px;
    min-height: 1123px;
    margin: 0 auto;
    background: #f3f4f6;
    font-family: Arial, Helvetica, sans-serif;
    color: #111827;
  }

  .page {
    background: #ffffff;
    margin: 24px;
    padding: 40px;
  }

  h1 {
    font-size: 28px;
    font-weight: 700;
  }

  .role {
    font-size: 16px;
    color: #0f766e;
    margin-top: 4px;
  }

  .contact {
    margin-top: 16px;
    font-size: 13px;
    color: #374151;
  }

  .contact span {
    margin-right: 18px;
  }

  .timeline {
    margin-top: 40px;
    padding-left: 30px;
    border-left: 2px solid #0f766e;
  }

  .section {
    position: relative;
    margin-bottom: 32px;
  }

  .dot {
    position: absolute;
    left: -38px;
    top: 4px;
    width: 12px;
    height: 12px;
    background: #0f766e;
    border-radius: 50%;
  }

  .section-title {
    font-size: 14px;
    font-weight: 700;
    border-bottom: 2px solid #0f766e;
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
  }

  li {
    font-size: 13px;
    margin-bottom: 4px;
  }

  .item-sub {
    font-size: 12px;
    color: #6b7280;
  }
</style>
</head>

<body>
  <div class="page">

    <!-- HEADER -->
    <h1>${safe.fullName || "Your Name"}</h1>
    ${safe.role ? `<div class="role">${safe.role}</div>` : ""}

    <div class="contact">
      ${safe.email ? `<span>✉ ${safe.email}</span>` : ""}
      ${safe.phone ? `<span>📞 ${safe.phone}</span>` : ""}
      ${safe.address ? `<span>📍 ${safe.address}</span>` : ""}
      ${safe.socialLinks.length > 0 ? safe.socialLinks.map(link => `<span>🔗 ${link.platform}: ${link.url}</span>`).join("") : ""}
    </div>

    <!-- TIMELINE -->
    <div class="timeline">

      ${(safe.summary || safe.careerObjective) ? `
      <div class="section">
        <div class="dot"></div>
        <div class="section-title">
          ${isFresher ? "CAREER OBJECTIVE" : "PROFESSIONAL SUMMARY"}
        </div>
        <p>
          ${isFresher
            ? (safe.careerObjective || safe.summary)
            : (safe.summary || safe.careerObjective)}
        </p>
      </div>` : ""}

      ${safe.skills.length > 0 ? `
      <div class="section">
        <div class="dot"></div>
        <div class="section-title">SKILLS</div>
        <ul>
          ${safe.skills.map(s => `<li>${s}</li>`).join("")}
        </ul>
      </div>` : ""}

      ${safe.experience.length > 0 ? `
      <div class="section">
        <div class="dot"></div>
        <div class="section-title">WORK EXPERIENCE</div>
        ${safe.experience.map(exp => `
          <p><strong>${exp.role} — ${exp.company}</strong></p>
          <div class="item-sub">${exp.startDate} - ${exp.endDate}</div>
          <p>${exp.description}</p>
        `).join("")}
      </div>` : ""}

      ${safe.education.length > 0 ? `
      <div class="section">
        <div class="dot"></div>
        <div class="section-title">EDUCATION</div>
        ${safe.education.map(edu => `
          <p><strong>${edu.degree}</strong></p>
          <div class="item-sub">${edu.school} | ${edu.startYear} - ${edu.endYear}</div>
        `).join("")}
      </div>` : ""}

      ${safe.certifications.length > 0 ? `
      <div class="section">
        <div class="dot"></div>
        <div class="section-title">CERTIFICATIONS</div>
        ${safe.certifications.map(c => `
          <p><strong>${c.name}</strong></p>
          <div class="item-sub">${c.issuer} | ${c.date}</div>
        `).join("")}
      </div>` : ""}

      ${safe.projects.length > 0 ? `
      <div class="section">
        <div class="dot"></div>
        <div class="section-title">PROJECTS</div>
        ${safe.projects.map(p => `
          <p><strong>${p.name}</strong></p>
          <p>${p.description}</p>
        `).join("")}
      </div>` : ""}

      ${safe.languages.length > 0 ? `
      <div class="section">
        <div class="dot"></div>
        <div class="section-title">LANGUAGES</div>
        <ul>
          ${safe.languages.map(lang => `<li>${lang.language} (${lang.level})</li>`).join("")}
        </ul>
      </div>` : ""}

      ${safe.strengths.length > 0 ? `
      <div class="section">
        <div class="dot"></div>
        <div class="section-title">STRENGTHS</div>
        <ul>
          ${safe.strengths.map(strength => `<li>${strength}</li>`).join("")}
        </ul>
      </div>` : ""}

      ${safe.hobbies.length > 0 ? `
      <div class="section">
        <div class="dot"></div>
        <div class="section-title">HOBBIES</div>
        <p>${safe.hobbies.join(", ")}</p>
      </div>` : ""}

    </div>
  </div>
</body>
</html>
`;
}
