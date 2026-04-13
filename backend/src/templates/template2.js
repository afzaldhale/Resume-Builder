export function template2HTML(data) {
  const skillPercent = (i) => Math.min(95, 65 + i * 10);
  const isFresher = data.candidateType === "fresher";
  const summaryText = isFresher
    ? data.careerObjective || data.summary
    : data.summary || data.careerObjective;
  const summaryTitle = isFresher ? "Career Objective" : "Profile Summary";

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Resume</title>

<style>
  body {
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    background: #ffffff;
  }

  .page {
    width: 794px;
    height: 1123px;
    display: flex;
  }

  /* LEFT SIDEBAR */
  .sidebar {
    width: 40%;
    background: linear-gradient(to bottom, #111827, #1f2937);
    color: #fff;
    padding: 32px;
    box-sizing: border-box;
  }

  .sidebar h1 {
    font-size: 28px;
    margin-bottom: 4px;
  }

  .role {
    font-size: 18px;
    color: #d1d5db;
    margin-bottom: 24px;
  }

  .contact p {
    font-size: 13px;
    margin: 6px 0;
    color: #e5e7eb;
  }

  .section-title {
    font-size: 16px;
    margin: 28px 0 12px;
    font-weight: bold;
    border-bottom: 1px solid #374151;
    padding-bottom: 4px;
  }

  .skill {
    margin-bottom: 10px;
  }

  .skill-name {
    font-size: 13px;
    display: flex;
    justify-content: space-between;
  }

  .bar {
    height: 6px;
    background: #374151;
    border-radius: 4px;
    overflow: hidden;
  }

  .bar-fill {
    height: 6px;
    background: linear-gradient(to right, #3b82f6, #22d3ee);
  }

  /* RIGHT CONTENT */
  .content {
    width: 60%;
    padding: 32px;
    box-sizing: border-box;
    color: #111827;
  }

  .content h2 {
    font-size: 20px;
    margin-bottom: 10px;
    border-left: 4px solid #2563eb;
    padding-left: 10px;
  }

  .box {
    background: #f8fafc;
    padding: 14px;
    border-radius: 8px;
    margin-bottom: 18px;
    font-size: 13px;
    line-height: 1.6;
  }

  .job {
    margin-bottom: 20px;
  }

  .job h3 {
    font-size: 16px;
    margin: 0;
  }

  .muted {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 6px;
  }

  .pill {
    display: inline-block;
    background: #e0f2fe;
    color: #0369a1;
    font-size: 11px;
    padding: 4px 8px;
    border-radius: 12px;
    margin-right: 6px;
  }

  footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    background: #111827;
    color: #e5e7eb;
    font-size: 11px;
    padding: 8px 16px;
    display: flex;
    justify-content: space-between;
  }
</style>
</head>

<body>
<div class="page">

  <!-- LEFT -->
  <div class="sidebar">
    <h1>${data.fullName || ""}</h1>
    ${data.role ? `<div class="role">${data.role}</div>` : ""}

    <div class="contact">
      ${data.email ? `<p>Email: ${data.email}</p>` : ""}
      ${data.phone ? `<p>Phone: ${data.phone}</p>` : ""}
      ${data.address ? `<p>Location: ${data.address}</p>` : ""}
    </div>

    ${data.skills?.length ? `
    <div class="section-title">SKILLS</div>
    ${data.skills.map((s, i) => `
      <div class="skill">
        <div class="skill-name">
          <span>${s}</span>
          <span>${skillPercent(i)}%</span>
        </div>
        <div class="bar">
          <div class="bar-fill" style="width:${skillPercent(i)}%"></div>
        </div>
      </div>
    `).join("")}
    ` : ""}
  </div>

  <!-- RIGHT -->
  <div class="content">

    ${summaryText ? `
    <h2>${summaryTitle}</h2>
    <div class="box">${summaryText}</div>
    ` : ""}

    ${data.experience?.length ? `
    <h2>WORK EXPERIENCE</h2>
    ${data.experience.map(exp => `
      <div class="job">
        <h3>${exp.role} – ${exp.company}</h3>
        <div class="muted">${exp.startDate} – ${exp.endDate}</div>
        <div class="box">${exp.description}</div>
      </div>
    `).join("")}
    ` : ""}

    ${data.projects?.length ? `
    <h2>PROJECTS</h2>
    ${data.projects.map(p => `
      <div class="box">
        <strong>${p.name}</strong>
        <p>${p.description}</p>
        ${p.technologies?.map(t => `<span class="pill">${t}</span>`).join("")}
      </div>
    `).join("")}
    ` : ""}

  </div>

  <footer>
    <span>Resume Template 2</span>
    <span>${new Date().getFullYear()}</span>
  </footer>

</div>
</body>
</html>
`;
}
