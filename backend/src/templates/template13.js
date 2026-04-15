// template13.js
export function template13HTML(data) {
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
    font-family: Arial, Helvetica, sans-serif;
    background: #f5f3ff;
    color: #111827;
  }

  .wrapper {
    display: flex;
    min-height: 1123px;
  }

  .accent {
    width: 24px;
    background: #6d28d9;
  }

  .content {
    flex: 1;
    background: #ffffff;
    padding: 40px;
  }

  h1 {
    font-size: 28px;
    font-weight: 700;
  }

  .role {
    font-size: 16px;
    color: #6d28d9;
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

  .section {
    margin-top: 28px;
  }

  .section-title {
    font-size: 14px;
    font-weight: 700;
    border-bottom: 2px solid #a78bfa;
    padding-bottom: 4px;
    margin-bottom: 10px;
    letter-spacing: 0.05em;
  }

  p {
    font-size: 13px;
    line-height: 1.6;
  }

  .skills span {
    display: inline-block;
    background: #ede9fe;
    color: #5b21b6;
    font-size: 13px;
    padding: 4px 10px;
    border-radius: 999px;
    margin: 4px 6px 0 0;
  }

  .item-sub {
    font-size: 12px;
    color: #6b7280;
  }
</style>
</head>

<body>
  <div class="wrapper">
    <div class="accent"></div>

    <div class="content">

      <!-- HEADER -->
      <h1>${safe.fullName || "Your Name"}</h1>
      ${safe.role ? `<div class="role">${safe.role}</div>` : ""}

      <div class="contact">
        ${safe.email ? `<span>✉ ${safe.email}</span>` : ""}
        ${safe.phone ? `<span>📞 ${safe.phone}</span>` : ""}
        ${safe.address ? `<span>📍 ${safe.address}</span>` : ""}
        ${safe.socialLinks.length > 0 ? safe.socialLinks.map(link => `<span>🔗 ${link.platform}: ${link.url}</span>`).join("") : ""}
      </div>

      <!-- SUMMARY -->
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

      <!-- SKILLS -->
      ${safe.skills.length > 0 ? `
      <div class="section skills">
        <div class="section-title">SKILLS</div>
        ${safe.skills.map(s => `<span>${s}</span>`).join("")}
      </div>` : ""}

      <!-- EXPERIENCE -->
      ${safe.experience.length > 0 ? `
      <div class="section">
        <div class="section-title">WORK EXPERIENCE</div>
        ${safe.experience.map(exp => `
          <p><strong>${exp.role} — ${exp.company}</strong></p>
          <div class="item-sub">${exp.startDate} - ${exp.endDate}</div>
          <p>${exp.description}</p>
        `).join("")}
      </div>` : ""}

      <!-- EDUCATION -->
      ${safe.education.length > 0 ? `
      <div class="section">
        <div class="section-title">EDUCATION</div>
        ${safe.education.map(edu => `
          <p><strong>${edu.degree}</strong></p>
          <div class="item-sub">${edu.school} | ${edu.startYear} - ${edu.endYear}</div>
        `).join("")}
      </div>` : ""}

      <!-- CERTIFICATIONS -->
      ${safe.certifications.length > 0 ? `
      <div class="section">
        <div class="section-title">CERTIFICATIONS</div>
        ${safe.certifications.map(c => `
          <p><strong>${c.name}</strong></p>
          <div class="item-sub">${c.issuer} | ${c.date}</div>
        `).join("")}
      </div>` : ""}

      <!-- PROJECTS -->
      ${safe.projects.length > 0 ? `
      <div class="section">
        <div class="section-title">PROJECTS</div>
        ${safe.projects.map(p => `
          <p><strong>${p.name}</strong></p>
          <p>${p.description}</p>
        `).join("")}
      </div>` : ""}

      <!-- LANGUAGES -->
      ${safe.languages.length > 0 ? `
      <div class="section">
        <div class="section-title">LANGUAGES</div>
        <ul style="list-style: none; padding: 0;">
          ${safe.languages.map(lang => `
            <li style="margin-bottom: 4px;">• ${lang.language} (${lang.level})</li>
          `).join("")}
        </ul>
      </div>` : ""}

      <!-- STRENGTHS -->
      ${safe.strengths.length > 0 ? `
      <div class="section">
        <div class="section-title">STRENGTHS</div>
        <ul style="list-style: none; padding: 0;">
          ${safe.strengths.map(strength => `
            <li style="margin-bottom: 4px;">• ${strength}</li>
          `).join("")}
        </ul>
      </div>` : ""}

      <!-- HOBBIES -->
      ${safe.hobbies.length > 0 ? `
      <div class="section">
        <div class="section-title">HOBBIES</div>
        <p>${safe.hobbies.join(", ")}</p>
      </div>` : ""}

    </div>
  </div>
</body>
</html>
`;
}
