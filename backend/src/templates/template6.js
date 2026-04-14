// template6.js
export function template6HTML(data) {
  // Safe data handling
  const safeData = {
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
    certifications: Array.isArray(data.certifications) ? data.certifications : [],
    languages: Array.isArray(data.languages) ? data.languages : [],
    socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
    hobbies: Array.isArray(data.hobbies) ? data.hobbies : [],
    strengths: Array.isArray(data.strengths) ? data.strengths : [],
    candidateType: data.candidateType || "experienced"
  };

  // Check if fresher
  const isFresher = data.candidateType === "fresher" || safeData.experience.length === 0;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Resume - ${safeData.fullName || "Professional Resume"}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.5;
    color: #111827;
    background: linear-gradient(135deg, #eff6ff 0%, #f9fafb 100%);
    min-height: 1123px;
    width: 794px;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
  }

  /* Background Pattern */
  .background-pattern {
    position: absolute;
    inset: 0;
    opacity: 0.05;
    pointer-events: none;
  }

  .bg-circle-1 {
    position: absolute;
    top: 40px;
    right: 40px;
    width: 200px;
    height: 200px;
    background: #3b82f6;
    border-radius: 50%;
    filter: blur(40px);
    mix-blend-mode: multiply;
  }

  .bg-circle-2 {
    position: absolute;
    bottom: 40px;
    left: 40px;
    width: 200px;
    height: 200px;
    background: #9ca3af;
    border-radius: 50%;
    filter: blur(40px);
    mix-blend-mode: multiply;
  }

  /* Main Container */
  .resume-container {
    position: relative;
    z-index: 10;
    padding: 40px 48px;
    min-height: 1123px;
  }

  /* Header */
  .header {
    text-align: center;
    margin-bottom: 32px;
  }

  .name {
    font-size: 28px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 8px;
    letter-spacing: -0.5px;
  }

  .role {
    font-size: 18px;
    font-weight: 500;
    color: #4b5563;
    margin-bottom: 24px;
  }

  /* Contact Info */
  .contact-info {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 24px;
    margin-bottom: 24px;
    font-size: 14px;
    color: #6b7280;
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .contact-icon {
    width: 16px;
    height: 16px;
    color: #3b82f6;
  }

  /* Divider */
  .divider {
    height: 1px;
    background: #e5e7eb;
    margin: 24px 0;
  }

  /* Sections */
  .section {
    margin-bottom: 32px;
  }

  .section-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }

  .section-bar {
    width: 40px;
    height: 4px;
    border-radius: 2px;
    margin-right: 12px;
  }

  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Content Cards */
  .content-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .content-card:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }

  /* Summary/Objective */
  .summary-content {
    border-left: 3px solid #3b82f6;
    padding-left: 16px;
    font-size: 14px;
    color: #374151;
    line-height: 1.6;
  }

  /* Skills */
  .skills-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .skill-tag {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    border: 1px solid #bbf7d0;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    color: #065f46;
  }

  .skill-icon {
    width: 12px;
    height: 12px;
    color: #10b981;
  }

  /* Experience */
  .experience-item {
    margin-bottom: 24px;
  }

  .job-title {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 4px;
  }

  .company-info {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    color: #6b7280;
    margin-bottom: 12px;
  }

  .experience-description {
    border-left: 2px solid #d1d5db;
    padding-left: 16px;
    font-size: 13px;
    color: #374151;
    line-height: 1.6;
  }

  /* Education */
  .education-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }

  .education-content h3 {
    font-size: 15px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 4px;
  }

  .education-content p {
    font-size: 13px;
    color: #6b7280;
  }

  .gpa-badge {
    font-size: 12px;
    font-weight: 600;
    padding: 4px 8px;
    background: #ede9fe;
    color: #5b21b6;
    border-radius: 4px;
  }

  /* Projects */
  .project-title {
    font-size: 15px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 8px;
  }

  .project-description {
    font-size: 13px;
    color: #374151;
    margin-bottom: 12px;
    line-height: 1.5;
  }

  .tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .tech-tag {
    font-size: 11px;
    padding: 4px 8px;
    background: #fef3c7;
    color: #92400e;
    border: 1px solid #fde68a;
    border-radius: 12px;
  }

  /* Certifications & Languages Grid */
  .two-column-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  .sub-section {
    margin-bottom: 0;
  }

  .sub-section-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }

  .sub-section-bar {
    width: 24px;
    height: 3px;
    border-radius: 1.5px;
    margin-right: 8px;
  }

  .sub-section-title {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
  }

  .cert-item {
    margin-bottom: 12px;
  }

  .cert-name {
    font-size: 13px;
    font-weight: 500;
    color: #111827;
    margin-bottom: 2px;
  }

  .cert-details {
    font-size: 12px;
    color: #6b7280;
  }

  .language-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .language-name {
    font-size: 13px;
    font-weight: 500;
    color: #111827;
  }

  .language-level {
    font-size: 11px;
    padding: 3px 8px;
    background: #e0e7ff;
    color: #3730a3;
    border-radius: 12px;
  }

  /* Footer */
  .footer {
    margin-top: 40px;
    padding-top: 24px;
    border-top: 1px solid #e5e7eb;
    text-align: center;
    font-size: 11px;
    color: #9ca3af;
  }

  .footer-content {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
  }

  /* Utility Classes */
  .text-sm {
    font-size: 13px;
  }

  .text-xs {
    font-size: 12px;
  }

  .font-medium {
    font-weight: 500;
  }

  .font-semibold {
    font-weight: 600;
  }

  .mb-2 {
    margin-bottom: 8px;
  }

  .mb-4 {
    margin-bottom: 16px;
  }

  .mt-2 {
    margin-top: 8px;
  }

  .mt-4 {
    margin-top: 16px;
  }

  .space-y-3 > * + * {
    margin-top: 12px;
  }

  .space-y-4 > * + * {
    margin-top: 16px;
  }

  /* Print Styles */
  @media print {
    body {
      background: white;
    }
    
    .background-pattern {
      display: none;
    }
    
    .content-card {
      box-shadow: none;
      border: 1px solid #d1d5db;
    }
  }
</style>
</head>
<body>
  <!-- Background Pattern -->
  <div class="background-pattern">
    <div class="bg-circle-1"></div>
    <div class="bg-circle-2"></div>
  </div>

  <!-- Main Content -->
  <div class="resume-container">
    <!-- Header -->
    <header class="header">
      <h1 class="name">${safeData.fullName || "Your Name"}</h1>
      ${safeData.role ? `<div class="role">${safeData.role}</div>` : ""}
      
      <div class="contact-info">
        ${safeData.email ? `
          <div class="contact-item">
            <span class="contact-icon">✉️</span>
            <span>${safeData.email}</span>
          </div>
        ` : ""}
        
        ${safeData.phone ? `
          <div class="contact-item">
            <span class="contact-icon">📱</span>
            <span>${safeData.phone}</span>
          </div>
        ` : ""}
        
        ${safeData.address ? `
          <div class="contact-item">
            <span class="contact-icon">📍</span>
            <span>${safeData.address}</span>
          </div>
        ` : ""}
      </div>
      
      <div class="divider"></div>
    </header>

    <!-- Main Content -->
    <main>
      <!-- Career Objective (for freshers) -->
      ${isFresher && safeData.careerObjective ? `
      <section class="section">
        <div class="section-header">
          <div class="section-bar" style="background: #3b82f6;"></div>
          <h2 class="section-title">Career Objective</h2>
        </div>
        <div class="content-card">
          <div class="summary-content">${safeData.careerObjective}</div>
        </div>
      </section>
      ` : ""}

      <!-- Professional Summary (for experienced) -->
      ${!isFresher && safeData.summary ? `
      <section class="section">
        <div class="section-header">
          <div class="section-bar" style="background: #3b82f6;"></div>
          <h2 class="section-title">Professional Summary</h2>
        </div>
        <div class="content-card">
          <div class="summary-content">${safeData.summary}</div>
        </div>
      </section>
      ` : ""}

      <!-- Skills -->
      ${safeData.skills.length > 0 ? `
      <section class="section">
        <div class="section-header">
          <div class="section-bar" style="background: #10b981;"></div>
          <h2 class="section-title">Skills</h2>
        </div>
        <div class="content-card">
          <div class="skills-container">
            ${safeData.skills.map(skill => `
              <div class="skill-tag">
                <span class="skill-icon">→</span>
                <span>${skill}</span>
              </div>
            `).join("")}
          </div>
        </div>
      </section>
      ` : ""}

      <!-- Work Experience -->
      ${safeData.experience.length > 0 ? `
      <section class="section">
        <div class="section-header">
          <div class="section-bar" style="background: #3b82f6;"></div>
          <h2 class="section-title">Work Experience</h2>
        </div>
        <div class="space-y-4">
          ${safeData.experience.map(exp => `
            <div class="content-card">
              <div class="experience-item">
                <div class="job-title">${exp.role}</div>
                <div class="company-info">
                  <span class="font-semibold">${exp.company || ""}</span>
                  <span style="color: #d1d5db">|</span>
                  <span>${exp.startDate || ""}${exp.endDate ? ` - ${exp.endDate}` : ""}</span>
                </div>
                <div class="experience-description">${exp.description || ""}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </section>
      ` : ""}

      <!-- Education -->
      ${safeData.education.length > 0 ? `
      <section class="section">
        <div class="section-header">
          <div class="section-bar" style="background: #8b5cf6;"></div>
          <h2 class="section-title">Education</h2>
        </div>
        <div class="content-card">
          <div class="space-y-3">
            ${safeData.education.map(edu => `
              <div class="education-item">
                <div class="education-content">
                  <h3>${edu.degree}</h3>
                  <p>${edu.school}</p>
                  <div class="text-xs" style="color: #9ca3af; margin-top: 4px;">
                    ${edu.startYear || ""}${edu.endYear ? ` - ${edu.endYear}` : ""}
                  </div>
                </div>
                ${edu.gpa ? `<div class="gpa-badge">GPA: ${edu.gpa}</div>` : ""}
              </div>
            `).join("")}
          </div>
        </div>
      </section>
      ` : ""}

      <!-- Projects -->
      ${safeData.projects.length > 0 ? `
      <section class="section">
        <div class="section-header">
          <div class="section-bar" style="background: #f59e0b;"></div>
          <h2 class="section-title">Projects</h2>
        </div>
        <div class="content-card">
          <div class="space-y-4">
            ${safeData.projects.map(project => `
              <div>
                <div class="project-title">${project.name}</div>
                <div class="project-description">${project.description || ""}</div>
                ${project.technologies && project.technologies.length > 0 ? `
                  <div class="tech-tags">
                    ${project.technologies.map(tech => `
                      <span class="tech-tag">${tech}</span>
                    `).join("")}
                  </div>
                ` : ""}
              </div>
            `).join("")}
          </div>
        </div>
      </section>
      ` : ""}

      <!-- Certifications & Languages Grid -->
      ${(safeData.certifications.length > 0 || safeData.languages.length > 0) ? `
      <div class="two-column-grid">
        <!-- Certifications -->
        ${safeData.certifications.length > 0 ? `
        <section class="section sub-section">
          <div class="sub-section-header">
            <div class="sub-section-bar" style="background: #14b8a6;"></div>
            <h2 class="sub-section-title">Certifications</h2>
          </div>
          <div class="content-card">
            <div class="space-y-3">
              ${safeData.certifications.map(cert => `
                <div class="cert-item">
                  <div class="cert-name">${cert.name}</div>
                  <div class="cert-details">${cert.issuer || ""}${cert.year ? ` • ${cert.year}` : ""}</div>
                </div>
              `).join("")}
            </div>
          </div>
        </section>
        ` : ""}

        <!-- Languages -->
        ${safeData.languages.length > 0 ? `
        <section class="section sub-section">
          <div class="sub-section-header">
            <div class="sub-section-bar" style="background: #6366f1;"></div>
            <h2 class="sub-section-title">Languages</h2>
          </div>
          <div class="content-card">
            <div class="space-y-3">
              ${safeData.languages.map(lang => `
                <div class="language-item">
                  <div class="language-name">${lang.language}</div>
                  <div class="language-level">${lang.level}</div>
                </div>
              `).join("")}
            </div>
          </div>
        </section>
        ` : ""}
      </div>
      ` : ""}

      <!-- Strengths -->
      ${safeData.strengths.length > 0 ? `
      <section class="section">
        <div class="section-header">
          <div class="section-bar" style="background: #f59e0b;"></div>
          <h2 class="section-title">Strengths</h2>
        </div>
        <div class="content-card">
          <ul style="list-style: none; padding: 0;">
            ${safeData.strengths.map(strength => `
              <li style="margin-bottom: 8px; display: flex; align-items: flex-start;">
                <span style="color: #f59e0b; margin-right: 8px; font-weight: bold;">•</span>
                <span style="font-size: 14px; color: #374151;">${strength}</span>
              </li>
            `).join("")}
          </ul>
        </div>
      </section>
      ` : ""}

      <!-- Hobbies -->
      ${safeData.hobbies.length > 0 ? `
      <section class="section">
        <div class="section-header">
          <div class="section-bar" style="background: #ec4899;"></div>
          <h2 class="section-title">Hobbies</h2>
        </div>
        <div class="content-card">
          <div style="font-size: 14px; color: #374151;">
            ${safeData.hobbies.join(", ")}
          </div>
        </div>
      </section>
      ` : ""}
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <span>Template 6 • ATS Optimized</span>
        <span style="color: #d1d5db">•</span>
        <span>Professional Format</span>
        <span style="color: #d1d5db">•</span>
        <span>${new Date().getFullYear()}</span>
      </div>
    </footer>
  </div>
</body>
</html>
`;
}