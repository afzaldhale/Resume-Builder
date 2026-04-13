// template10.js - ONE PAGE MODERN GRADIENT VERSION
export function template10HTML(data) {
  // Safe data handling with limits for one page
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
    socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks.slice(0, 2) : [],
    references: Array.isArray(data.references) ? data.references.slice(0, 2) : [],
    customSections: Array.isArray(data.customSections) ? data.customSections.slice(0, 1) : [],
    candidateType: data.candidateType || "experienced"
  };

  // Check if fresher
  const isFresher = data.candidateType === "fresher" || safeData.experience.length === 0;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Resume - ${safeData.fullName || "Modern Resume"}</title>
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    width: 794px;
    min-height: 1123px;
    margin: 0 auto;
    background: linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #d1fae5 100%);
    color: #111827;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    border: 1px solid #e5e7eb;
    position: relative;
    overflow: hidden;
  }

  /* Background Pattern */
  .background-pattern {
    position: absolute;
    inset: 0;
    opacity: 0.1;
  }

  .top-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #3b82f6 0%, #10b981 100%);
  }

  .blur-circle-1 {
    position: absolute;
    top: 25%;
    right: 40px;
    width: 160px;
    height: 160px;
    background: #bfdbfe;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.2;
  }

  .blur-circle-2 {
    position: absolute;
    bottom: 33%;
    left: 40px;
    width: 192px;
    height: 192px;
    background: #a7f3d0;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.2;
  }

  .blur-circle-3 {
    position: absolute;
    top: 50%;
    left: 33%;
    width: 128px;
    height: 128px;
    background: #c7d2fe;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.1;
  }

  /* Main Container */
  .container {
    position: relative;
    z-index: 10;
    padding: 30px 35px;
    min-height: 1123px;
  }

  /* Header */
  .header {
    text-align: center;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .name {
    font-size: 28px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 8px;
  }

  .role {
    font-size: 16px;
    font-weight: 500;
    color: #4b5563;
    margin-bottom: 20px;
  }

  /* Contact Info */
  .contact-info {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 16px;
  }

  .contact-item {
    text-align: center;
  }

  .contact-label {
    font-size: 10px;
    color: #6b7280;
    margin-bottom: 2px;
  }

  .contact-value {
    font-size: 11px;
    color: #374151;
  }

  /* Social Links */
  .social-links {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 8px;
  }

  .social-link {
    font-size: 10px;
    color: #2563eb;
    text-decoration: none;
  }

  .social-link:hover {
    text-decoration: underline;
  }

  /* Divider */
  .divider {
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, #d1d5db 50%, transparent 100%);
    margin: 20px 0;
  }

  /* Main Grid */
  .main-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }

  /* Sections */
  .section {
    margin-bottom: 16px;
  }

  .section-title {
    font-size: 14px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 10px;
    padding-bottom: 6px;
    border-bottom: 2px solid #e5e7eb;
  }

  /* Summary/Objective */
  .summary-card {
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
  }

  .summary-content {
    font-size: 11px;
    color: #374151;
    line-height: 1.5;
    text-align: center;
  }

  /* Skills */
  .skills-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .skill-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    color: #374151;
  }

  .skill-bullet {
    width: 8px;
    height: 8px;
    background: #3b82f6;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* Education */
  .education-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 10px;
  }

  .edu-degree {
    font-size: 12px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 4px;
  }

  .edu-school {
    font-size: 11px;
    color: #4b5563;
    margin-bottom: 8px;
  }

  .edu-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .edu-date {
    font-size: 10px;
    color: #6b7280;
  }

  .gpa {
    font-size: 11px;
    font-weight: 600;
    color: #2563eb;
  }

  /* Languages */
  .language-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-size: 11px;
  }

  .language-name {
    color: #374151;
  }

  .language-level {
    color: #6b7280;
  }

  /* Certifications */
  .cert-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 10px;
    margin-bottom: 8px;
  }

  .cert-name {
    font-size: 11px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 4px;
  }

  .cert-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .cert-issuer {
    font-size: 10px;
    color: #4b5563;
  }

  .cert-year {
    font-size: 10px;
    color: #6b7280;
  }

  /* Experience */
  .experience-item {
    position: relative;
    padding-left: 20px;
    margin-bottom: 16px;
  }

  .exp-bullet {
    position: absolute;
    left: 0;
    top: 6px;
    width: 10px;
    height: 10px;
    background: #10b981;
    border-radius: 50%;
  }

  .exp-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 14px;
  }

  .exp-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }

  .exp-title {
    font-size: 13px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 4px;
  }

  .exp-company {
    font-size: 11px;
    color: #4b5563;
  }

  .exp-date {
    font-size: 11px;
    color: #6b7280;
    white-space: nowrap;
  }

  .exp-description {
    font-size: 11px;
    color: #374151;
    line-height: 1.5;
  }

  /* Projects */
  .project-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 14px;
    margin-bottom: 12px;
  }

  .project-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }

  .project-name {
    font-size: 13px;
    font-weight: 700;
    color: #111827;
  }

  .project-link {
    font-size: 10px;
    color: #2563eb;
    text-decoration: none;
  }

  .project-link:hover {
    text-decoration: underline;
  }

  .project-description {
    font-size: 11px;
    color: #374151;
    margin-bottom: 8px;
    line-height: 1.5;
  }

  .tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .tech-tag {
    font-size: 9px;
    padding: 3px 8px;
    background: #dbeafe;
    color: #1e40af;
    border: 1px solid #bfdbfe;
    border-radius: 12px;
  }

  /* Strengths */
  .strengths-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .strength-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 10px;
    text-align: center;
    font-size: 11px;
    color: #374151;
  }

  /* Hobbies */
  .hobbies-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .hobby-tag {
    padding: 6px 10px;
    background: #d1fae5;
    color: #065f46;
    border: 1px solid #a7f3d0;
    border-radius: 6px;
    font-size: 11px;
  }

  /* References */
  .reference-item {
    font-size: 11px;
    color: #374151;
    font-style: italic;
    margin-bottom: 8px;
    padding-left: 12px;
    border-left: 2px solid #d1d5db;
  }

  /* Footer */
  .footer {
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
    text-align: center;
  }

  .footer-name {
    font-size: 11px;
    color: #6b7280;
    margin-bottom: 4px;
  }

  .footer-template {
    font-size: 10px;
    color: #9ca3af;
  }

  /* Utility Classes */
  .mb-1 { margin-bottom: 4px; }
  .mb-2 { margin-bottom: 8px; }
  .mt-1 { margin-top: 4px; }
  .mt-2 { margin-top: 8px; }
  .text-center { text-align: center; }

  /* Print Styles */
  @media print {
    body {
      background: white;
    }
    
    .background-pattern {
      display: none;
    }
    
    .summary-card,
    .education-card,
    .exp-card,
    .project-card,
    .strength-card {
      border: 1px solid #e5e7eb;
    }
    
    .social-link,
    .project-link {
      color: #2563eb !important;
      text-decoration: none !important;
    }
  }
</style>
</head>
<body>
  <!-- Background Pattern -->
  <div class="background-pattern">
    <div class="top-line"></div>
    <div class="blur-circle-1"></div>
    <div class="blur-circle-2"></div>
    <div class="blur-circle-3"></div>
  </div>

  <!-- Main Content -->
  <div class="container">
    <!-- Header -->
    <header class="header">
      <h1 class="name">${safeData.fullName || "Your Name"}</h1>
      ${safeData.role ? `<div class="role">${safeData.role}</div>` : ""}
      
      <!-- Contact Info -->
      <div class="contact-info">
        ${safeData.email ? `
          <div class="contact-item">
            <div class="contact-label">Email</div>
            <div class="contact-value">${safeData.email}</div>
          </div>
        ` : ""}
        
        ${safeData.phone ? `
          <div class="contact-item">
            <div class="contact-label">Phone</div>
            <div class="contact-value">${safeData.phone}</div>
          </div>
        ` : ""}
        
        ${safeData.address ? `
          <div class="contact-item">
            <div class="contact-label">Address</div>
            <div class="contact-value">${safeData.address}</div>
          </div>
        ` : ""}
      </div>

      <!-- Social Links -->
      ${safeData.socialLinks.length > 0 ? `
      <div class="social-links">
        ${safeData.socialLinks.map(link => `
          <a href="${link.url.startsWith('http') ? link.url : `https://${link.url}`}" 
             target="_blank" 
             class="social-link">
            ${link.platform}
          </a>
        `).join("")}
      </div>
      ` : ""}
    </header>

    <!-- Summary/Objective -->
    ${(safeData.summary || safeData.careerObjective) ? `
    <section class="section">
      <h2 class="section-title text-center">
        ${isFresher ? "Career Objective" : "Professional Summary"}
      </h2>
      <div class="summary-card">
        <div class="summary-content">
          ${isFresher ? (safeData.careerObjective || safeData.summary) : (safeData.summary || safeData.careerObjective)}
        </div>
      </div>
    </section>
    ` : ""}

    <!-- Main Content Grid -->
    <div class="main-grid">
      <!-- Left Column -->
      <div class="left-column">
        <!-- Skills -->
        ${safeData.skills.length > 0 ? `
        <section class="section">
          <h2 class="section-title">Skills</h2>
          <div class="skills-list">
            ${safeData.skills.map(skill => `
              <div class="skill-item">
                <div class="skill-bullet"></div>
                <div>${skill}</div>
              </div>
            `).join("")}
          </div>
        </section>
        ` : ""}

        <!-- Education -->
        ${safeData.education.length > 0 ? `
        <section class="section">
          <h2 class="section-title">Education</h2>
          <div class="space-y-2">
            ${safeData.education.map(edu => `
              <div class="education-card">
                <div class="edu-degree">${edu.degree}</div>
                <div class="edu-school">${edu.school}</div>
                <div class="edu-footer">
                  <div class="edu-date">${edu.startYear} - ${edu.endYear}</div>
                  ${edu.gpa ? `<div class="gpa">GPA: ${edu.gpa}</div>` : ""}
                </div>
              </div>
            `).join("")}
          </div>
        </section>
        ` : ""}

        <!-- Languages -->
        ${safeData.languages.length > 0 ? `
        <section class="section">
          <h2 class="section-title">Languages</h2>
          <div class="space-y-2">
            ${safeData.languages.map(lang => `
              <div class="language-item">
                <div class="language-name">${lang.language}</div>
                <div class="language-level">${lang.level}</div>
              </div>
            `).join("")}
          </div>
        </section>
        ` : ""}

        <!-- Certifications -->
        ${safeData.certifications.length > 0 ? `
        <section class="section">
          <h2 class="section-title">Certifications</h2>
          <div class="space-y-2">
            ${safeData.certifications.map(cert => `
              <div class="cert-card">
                <div class="cert-name">${cert.name}</div>
                <div class="cert-details">
                  <div class="cert-issuer">${cert.issuer}</div>
                  ${cert.year ? `<div class="cert-year">${cert.year}</div>` : ""}
                </div>
              </div>
            `).join("")}
          </div>
        </section>
        ` : ""}
      </div>

      <!-- Right Column -->
      <div class="right-column">
        <!-- Experience -->
        ${safeData.experience.length > 0 ? `
        <section class="section">
          <h2 class="section-title">Experience</h2>
          <div class="space-y-3">
            ${safeData.experience.map(exp => `
              <div class="experience-item">
                <div class="exp-bullet"></div>
                <div class="exp-card">
                  <div class="exp-header">
                    <div>
                      <div class="exp-title">${exp.role}</div>
                      <div class="exp-company">${exp.company}</div>
                    </div>
                    <div class="exp-date">${exp.startDate} - ${exp.endDate}</div>
                  </div>
                  <div class="exp-description">${exp.description}</div>
                </div>
              </div>
            `).join("")}
          </div>
        </section>
        ` : ""}

        <!-- Projects -->
        ${safeData.projects.length > 0 ? `
        <section class="section">
          <h2 class="section-title">Projects</h2>
          <div class="space-y-3">
            ${safeData.projects.map(project => `
              <div class="project-card">
                <div class="project-header">
                  <div class="project-name">${project.name}</div>
                  ${project.link ? `
                    <a href="${project.link}" target="_blank" class="project-link">
                      View
                    </a>
                  ` : ""}
                </div>
                <div class="project-description">${project.description}</div>
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
        </section>
        ` : ""}

        <!-- Additional Sections -->
        <div class="space-y-8">
          <!-- Strengths -->
          ${safeData.strengths.length > 0 ? `
          <section class="section">
            <h2 class="section-title">Strengths</h2>
            <div class="strengths-grid">
              ${safeData.strengths.map(strength => `
                <div class="strength-card">${strength}</div>
              `).join("")}
            </div>
          </section>
          ` : ""}

          <!-- Hobbies -->
          ${safeData.hobbies.length > 0 ? `
          <section class="section">
            <h2 class="section-title">Hobbies</h2>
            <div class="hobbies-container">
              ${safeData.hobbies.map(hobby => `
                <div class="hobby-tag">${hobby}</div>
              `).join("")}
            </div>
          </section>
          ` : ""}
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-name">
        ${safeData.fullName || "Your Name"} • Professional Resume
      </div>
      <div class="footer-template">
        Template 10 • Modern Gradient • ${new Date().getFullYear()}
      </div>
    </footer>
  </div>
</body>
</html>
`;
}