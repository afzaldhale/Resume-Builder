// template4.js
export function template4HTML(data) {
  // Helper function to get skill color based on index
  const getSkillColor = (index) => {
    const colors = [
      "bg-blue-400", "bg-emerald-400", "bg-amber-400", 
      "bg-rose-400", "bg-purple-400", "bg-cyan-400"
    ];
    return colors[index % colors.length];
  };

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
    line-height: 1.4;
  }

  .page {
    width: 794px;
    height: 1123px;
    margin: auto;
    padding: 36px;
    box-sizing: border-box;
    border: 2px solid #111827;
  }

  /* Header Styles */
  .dark-header {
    background: linear-gradient(to right, #111827, #1f2937);
    color: white;
    padding: 48px 36px 36px;
    margin: -36px -36px 30px;
    border-bottom: 2px solid #111827;
  }

  h1 {
    font-size: 32px;
    margin: 0 0 12px 0;
    font-weight: 800;
    text-align: center;
    letter-spacing: -0.5px;
  }

  .role {
    font-size: 18px;
    color: #d1d5db;
    text-align: center;
    margin-bottom: 24px;
    font-weight: 500;
  }

  .contact-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    max-width: 600px;
    margin: 0 auto;
  }

  .contact-item {
    background: rgba(255,255,255,0.1);
    border-radius: 8px;
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 13px;
  }

  /* Content Styles */
  .content {
    padding: 0 10px;
  }

  h2 {
    font-size: 18px;
    margin: 24px 0 12px;
    font-weight: bold;
    color: #111827;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  h3 {
    font-size: 14px;
    font-weight: bold;
    margin: 0 0 4px;
    color: #111827;
  }

  p {
    font-size: 12.5px;
    margin: 4px 0;
    color: #374151;
    line-height: 1.5;
  }

  .section-divider {
    width: 40px;
    height: 2px;
    background: #111827;
    border-radius: 1px;
  }

  /* Summary Section */
  .summary-box {
    background: #f9fafb;
    border-left: 4px solid #111827;
    padding: 16px;
    margin: 12px 0 24px;
    border-radius: 0 8px 8px 0;
  }

  /* Two Column Layout */
  .two-column {
    display: flex;
    gap: 40px;
    margin: 24px 0;
  }

  .two-column > div {
    flex: 1;
  }

  /* Experience Timeline */
  .experience-item {
    position: relative;
    padding-left: 20px;
    margin-bottom: 24px;
  }

  .timeline-dot {
    position: absolute;
    left: 0;
    top: 5px;
    width: 10px;
    height: 10px;
    background: #111827;
    border-radius: 50%;
  }

  .company-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #6b7280;
    margin: 6px 0 8px;
  }

  /* Education Cards */
  .education-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
  }

  .education-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 6px;
  }

  .gpa-badge {
    background: #111827;
    color: white;
    font-size: 11px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 4px;
  }

  /* Skills */
  .skills-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
  }

  .skill-tag {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    color: white;
  }

  /* Projects */
  .project-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
  }

  .tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
  }

  .tech-tag {
    background: #f3f4f6;
    color: #374151;
    font-size: 11px;
    padding: 4px 8px;
    border-radius: 12px;
    border: 1px solid #d1d5db;
  }

  /* Certifications */
  .cert-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 8px;
  }

  .cert-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }

  /* Languages */
  .language-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .progress-bar {
    width: 80px;
    height: 6px;
    background: #e5e7eb;
    border-radius: 3px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
  }

  /* Social Links */
  .social-links {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 16px 0;
  }

  .social-link {
    background: #111827;
    color: white;
    padding: 8px 16px;
    border-radius: 8px;
    text-decoration: none;
    font-size: 12px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  /* Footer */
  .footer {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
    text-align: center;
    font-size: 11px;
    color: #6b7280;
  }

  .footer-content {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 24px;
  }

  .verified {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin-top: 4px;
    color: #9ca3af;
  }
</style>
</head>

<body>
<div class="page">

  <!-- Dark Header -->
  <div class="dark-header">
    <h1>${data.fullName || "Your Name"}</h1>
    ${data.role ? `<div class="role">${data.role}</div>` : ""}
    
    <div class="contact-grid">
      ${data.email ? `
        <div class="contact-item">
          <span>📧</span>
          <span>${data.email}</span>
        </div>
      ` : ""}
      
      ${data.phone ? `
        <div class="contact-item">
          <span>📱</span>
          <span>${data.phone}</span>
        </div>
      ` : ""}
      
      ${data.address ? `
        <div class="contact-item">
          <span>📍</span>
          <span>${data.address}</span>
        </div>
      ` : ""}
    </div>
  </div>

  <div class="content">
    <!-- Professional Summary -->
    ${data.summary ? `
    <section>
      <div style="display: flex; align-items: center; margin-bottom: 8px;">
        <div class="section-divider"></div>
        <h2>PROFILE SUMMARY</h2>
      </div>
      <div class="summary-box">
        <p>${data.summary}</p>
      </div>
    </section>
    ` : ""}

    <!-- Two Column Layout -->
    <div class="two-column">
      <!-- Left Column: Experience -->
      <div>
        ${data.experience.length > 0 ? `
        <section>
          <h2>💼 WORK EXPERIENCE</h2>
          ${data.experience.map(exp => `
            <div class="experience-item">
              <div class="timeline-dot"></div>
              <h3>${exp.role}</h3>
              <div class="company-info">
                <span>${exp.company || ""}</span>
                <span style="color: #9ca3af">•</span>
                <span>📅 ${exp.startDate || ""}${exp.endDate ? ` - ${exp.endDate}` : ""}</span>
              </div>
              <p>${exp.description || ""}</p>
            </div>
          `).join("")}
        </section>
        ` : ""}
      </div>

      <!-- Right Column: Education & Skills -->
      <div>
        <!-- Education -->
        ${data.education.length > 0 ? `
        <section style="margin-bottom: 24px;">
          <h2>🎓 EDUCATION</h2>
          ${data.education.map(edu => `
            <div class="education-card">
              <div class="education-header">
                <div>
                  <h3>${edu.degree}</h3>
                  <p style="font-size: 12px; color: #6b7280; margin: 2px 0;">${edu.school}</p>
                </div>
                ${edu.gpa ? `<span class="gpa-badge">${edu.gpa}</span>` : ""}
              </div>
              <p style="font-size: 11px; color: #9ca3af;">${edu.startYear || ""}${edu.endYear ? ` - ${edu.endYear}` : ""}</p>
            </div>
          `).join("")}
        </section>
        ` : ""}

        <!-- Skills -->
        ${data.skills.length > 0 ? `
        <section>
          <h2>⭐ SKILLS</h2>
          <div class="skills-container">
            ${data.skills.map((skill, index) => {
              const colorClass = getSkillColor(index);
              return `
                <span class="skill-tag" style="background: ${colorClass.includes('blue') ? '#60a5fa' : 
                                                 colorClass.includes('emerald') ? '#34d399' :
                                                 colorClass.includes('amber') ? '#fbbf24' :
                                                 colorClass.includes('rose') ? '#fb7185' :
                                                 colorClass.includes('purple') ? '#a78bfa' : '#22d3ee'};">
                  ${skill}
                </span>
              `;
            }).join("")}
          </div>
        </section>
        ` : ""}
      </div>
    </div>

    <!-- Projects & Certifications/Languages -->
    <div class="two-column" style="margin-top: 30px;">
      <!-- Projects -->
      <div>
        ${data.projects.length > 0 ? `
        <section>
          <h2>🚀 PROJECTS</h2>
          ${data.projects.map(project => `
            <div class="project-card">
              <h3>${project.name}</h3>
              <p>${project.description || ""}</p>
              ${project.technologies.length > 0 ? `
                <div class="tech-tags">
                  ${project.technologies.map(tech => `
                    <span class="tech-tag">${tech}</span>
                  `).join("")}
                </div>
              ` : ""}
            </div>
          `).join("")}
        </section>
        ` : ""}
      </div>

      <!-- Certifications & Languages -->
      <div>
        <!-- Certifications -->
        ${data.certifications && data.certifications.length > 0 ? `
        <section style="margin-bottom: 24px;">
          <h2>🏆 CERTIFICATIONS</h2>
          ${data.certifications.map(cert => `
            <div class="cert-card">
              <div class="cert-header">
                <span style="font-weight: 600; font-size: 13px;">${cert.name}</span>
                ${cert.year ? `<span style="font-size: 11px; color: #6b7280;">${cert.year}</span>` : ""}
              </div>
              ${cert.issuer ? `<p style="font-size: 11px; color: #4b5563;">${cert.issuer}</p>` : ""}
            </div>
          `).join("")}
        </section>
        ` : ""}

        <!-- Languages -->
        ${data.languages && data.languages.length > 0 ? `
        <section>
          <h2>🗣️ LANGUAGES</h2>
          ${data.languages.map(lang => {
            const levelColor = lang.level === "Native" ? "#111827" :
                              lang.level === "Fluent" ? "#374151" :
                              lang.level === "Intermediate" ? "#6b7280" : "#9ca3af";
            
            const levelWidth = lang.level === "Native" ? "100%" :
                              lang.level === "Fluent" ? "90%" :
                              lang.level === "Intermediate" ? "70%" : "40%";
            
            return `
              <div class="language-item">
                <span style="font-size: 13px; font-weight: 500;">${lang.language}</span>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: ${levelWidth}; background: ${levelColor};"></div>
                  </div>
                  <span style="font-size: 11px; color: #6b7280;">${lang.level}</span>
                </div>
              </div>
            `;
          }).join("")}
        </section>
        ` : ""}
      </div>
    </div>

    <!-- Social Links -->
    ${data.socialLinks && data.socialLinks.length > 0 ? `
    <section style="margin-top: 30px;">
      <h2>👤 CONNECT WITH ME</h2>
      <div class="social-links">
        ${data.socialLinks.map(link => `
          <a href="${link.url}" class="social-link" target="_blank">
            <span>${link.platform}</span>
            <span style="font-size: 10px;">↗</span>
          </a>
        `).join("")}
      </div>
    </section>
    ` : ""}

    <!-- Footer -->
    <div class="footer">
      <div class="footer-content">
        <span>Template 4 • Modern Professional</span>
        <span style="color: #d1d5db">|</span>
        <span>Designed for Impact</span>
        <span style="color: #d1d5db">|</span>
        <span>${new Date().getFullYear()}</span>
      </div>
      <div class="verified">
        <span>✓</span>
        <span>All information verified and accurate</span>
      </div>
    </div>
  </div>
</div>
</body>
</html>
`;
}