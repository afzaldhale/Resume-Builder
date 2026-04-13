// template11.js
export function template11HTML(data) {
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
    background: #e5e7eb;
  }

  .wrapper {
    display: flex;
    min-height: 1123px;
  }

  .sidebar {
    width: 35%;
    background: #1e293b;
    color: #ffffff;
    padding: 32px;
  }

  .content {
    width: 65%;
    background: #ffffff;
    padding: 40px;
    color: #111827;
  }

  h1 {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: 0.05em;
  }

  .role {
    font-size: 14px;
    color: #cbd5f5;
    margin-top: 4px;
  }

  .contact {
    margin-top: 20px;
    font-size: 13px;
  }

  .contact p {
    margin-bottom: 6px;
  }

  .sidebar-title {
    margin-top: 30px;
    font-size: 13px;
    font-weight: 700;
    border-bottom: 1px solid #64748b;
    padding-bottom: 4px;
    margin-bottom: 10px;
  }

  .section {
    margin-bottom: 28px;
  }

  .section-title {
    font-size: 14px;
    font-weight: 700;
    border-bottom: 2px solid #c7d2fe;
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
  <div class="wrapper">

    <div class="sidebar">
      <h1>${safe.fullName || "Your Name"}</h1>
      ${safe.role ? `<div class="role">${safe.role}</div>` : ""}

      <div class="contact">
        ${safe.email ? `<p>✉ ${safe.email}</p>` : ""}
        ${safe.phone ? `<p>📞 ${safe.phone}</p>` : ""}
        ${safe.address ? `<p>📍 ${safe.address}</p>` : ""}
      </div>

      ${safe.skills.length > 0 ? `
      <div>
        <div class="sidebar-title">SKILLS</div>
        <ul>
          ${safe.skills.map(s => `<li>${s}</li>`).join("")}
        </ul>
      </div>` : ""}
    </div>

    <div class="content">

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
          <div style="margin-bottom:12px">
            <strong>${exp.role} — ${exp.company}</strong><br/>
            <span style="font-size:12px;color:#4b5563">${exp.startDate} - ${exp.endDate}</span>
            <p>${exp.description}</p>
          </div>
        `).join("")}
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
  </div>
</body>
</html>
`;
}
