// template5.js
export function template5HTML(data) {
  // Helper function to get timeline color
  const getTimelineColor = (section) => {
    const colors = {
      summary: "#3b82f6", // blue-500
      experience: "#10b981", // green-500
      education: "#8b5cf6", // purple-500
      skills: "#f59e0b", // amber-500
      projects: "#ef4444", // red-500
      certifications: "#14b8a6", // teal-500
      languages: "#6366f1", // indigo-500
      social: "#ec4899" // pink-500
    };
    return colors[section] || "#3b82f6";
  };

  const isFresher = data.candidateType === "fresher";
  const summaryText = isFresher
    ? data.careerObjective || data.summary
    : data.summary || data.careerObjective;
  const summaryTitle = isFresher ? "Career Objective" : "Professional Summary";

  // Helper function to get background color
  const getBackgroundColor = (section) => {
    const colors = {
      summary: "#dbeafe", // blue-50
      experience: "#d1fae5", // green-50
      education: "#f3e8ff", // purple-50
      skills: "#fef3c7", // amber-50
      projects: "#fee2e2", // red-50
      certifications: "#ccfbf1", // teal-50
      languages: "#e0e7ff", // indigo-50
      social: "#fce7f3" // pink-50
    };
    return colors[section] || "#dbeafe";
  };

  // Helper function to get border color
  const getBorderColor = (section) => {
    const colors = {
      summary: "#bfdbfe", // blue-100
      experience: "#a7f3d0", // green-100
      education: "#e9d5ff", // purple-100
      skills: "#fde68a", // amber-100
      projects: "#fecaca", // red-100
      certifications: "#99f6e4", // teal-100
      languages: "#c7d2fe", // indigo-100
      social: "#fbcfe8" // pink-100
    };
    return colors[section] || "#bfdbfe";
  };

  // Helper function to get text color
  const getTextColor = (section) => {
    const colors = {
      summary: "#1e40af", // blue-800
      experience: "#065f46", // green-800
      education: "#5b21b6", // purple-800
      skills: "#92400e", // amber-800
      projects: "#991b1b", // red-800
      certifications: "#0f766e", // teal-800
      languages: "#3730a3", // indigo-800
      social: "#9d174d" // pink-800
    };
    return colors[section] || "#1e40af";
  };

  // Helper function to get section icon
  const getSectionIcon = (section) => {
    const icons = {
      summary: "💼",
      experience: "📅",
      education: "🎓",
      skills: "⭐",
      projects: "🚀",
      certifications: "🏆",
      languages: "🗣️",
      social: "🔗"
    };
    return icons[section] || "📌";
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
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #ffffff;
    color: #111827;
    line-height: 1.5;
  }

  .page {
    width: 794px;
    height: 1123px;
    margin: auto;
    padding: 48px 36px 36px 48px;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
  }

  /* Left Blue Border */
  .blue-border {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 8px;
    background: linear-gradient(to bottom, #3b82f6, #60a5fa);
  }

  /* Header */
  h1 {
    font-size: 36px;
    font-weight: 800;
    color: #111827;
    margin: 0 0 8px 0;
  }

  .role {
    font-size: 20px;
    font-weight: 500;
    color: #4b5563;
    margin-bottom: 24px;
  }

  /* Contact Info */
  .contact-info {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    margin-bottom: 32px;
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #4b5563;
  }

  /* Timeline Container */
  .timeline-container {
    position: relative;
    padding-left: 40px;
  }

  /* Timeline Section */
  .timeline-section {
    position: relative;
    margin-bottom: 40px;
  }

  /* Timeline Dot */
  .timeline-dot {
    position: absolute;
    left: -36px;
    top: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 14px;
    z-index: 2;
  }

  /* Timeline Line */
  .timeline-line {
    position: absolute;
    left: -20px;
    top: 32px;
    bottom: -40px;
    width: 2px;
    background: linear-gradient(to bottom, #d1d5db, transparent);
  }

  /* Section Title */
  .section-title {
    font-size: 20px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 16px 0;
  }

  /* Content Box */
  .content-box {
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 16px;
    border-width: 1px;
  }

  /* Experience Item */
  .experience-item {
    margin-bottom: 24px;
  }

  .experience-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }

  .job-title {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
  }

  .company-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #6b7280;
    margin: 4px 0 8px;
  }

  .date-badge {
    font-size: 12px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 20px;
    color: white;
    background: #3b82f6;
  }

  /* Education Card */
  .education-card {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .gpa-badge {
    font-size: 12px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 6px;
    color: white;
    background: #8b5cf6;
  }

  /* Skills */
  .skills-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .skill-tag {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    color: #92400e;
    background: #fef3c7;
    border: 1px solid #fde68a;
  }

  /* Projects */
  .project-card {
    margin-bottom: 16px;
  }

  .project-title {
    font-size: 15px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 4px;
  }

  .tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
  }

  .tech-tag {
    font-size: 12px;
    padding: 4px 10px;
    border-radius: 16px;
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
  }

  /* Certifications */
  .certification-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  /* Languages */
  .language-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
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
    border-radius: 3px;
  }

  /* Social Links */
  .social-links {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
  }

  .social-link {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    text-decoration: none;
    color: #374151;
    font-size: 13px;
    background: white;
  }

  /* Footer */
  .footer {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #e5e7eb;
    text-align: center;
    font-size: 12px;
    color: #6b7280;
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

  .pl-4 {
    padding-left: 16px;
  }
</style>
</head>
<body>
<div class="page">
  <!-- Left Blue Border -->
  <div class="blue-border"></div>

  <!-- Header -->
  <div class="mb-8">
    <h1>${data.fullName || "Your Name"}</h1>
    ${data.role ? `<div class="role">${data.role}</div>` : ""}
    
    <div class="contact-info">
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

  <!-- Timeline Sections -->
  <div class="timeline-container">
    <!-- Professional Summary -->
    ${summaryText ? `
    <div class="timeline-section">
      <div class="timeline-dot" style="background: ${getTimelineColor('summary')};">
        ${getSectionIcon('summary')}
      </div>
      <div class="timeline-line"></div>
      
      <h2 class="section-title">${summaryTitle}</h2>
      <div class="content-box" style="background: ${getBackgroundColor('summary')}; border-color: ${getBorderColor('summary')};">
        <p class="text-sm">${summaryText}</p>
    ` : ""}

    <!-- Work Experience -->
    ${data.experience.length > 0 ? `
    <div class="timeline-section">
      <div class="timeline-dot" style="background: ${getTimelineColor('experience')};">
        ${getSectionIcon('experience')}
      </div>
      <div class="timeline-line"></div>
      
      <h2 class="section-title">WORK EXPERIENCE</h2>
      <div class="content-box" style="background: ${getBackgroundColor('experience')}; border-color: ${getBorderColor('experience')};">
        ${data.experience.map(exp => `
          <div class="experience-item">
            <div class="experience-header">
              <div class="job-title">${exp.role}</div>
              <div class="date-badge">${exp.startDate || ""}${exp.endDate ? ` - ${exp.endDate}` : ""}</div>
            </div>
            <div class="company-info">
              <span class="font-semibold">${exp.company || ""}</span>
              <span style="color: #d1d5db">•</span>
              <span>Full-time</span>
            </div>
            <p class="text-sm pl-4" style="border-left: 2px solid #d1d5db; padding-left: 12px;">
              ${exp.description || ""}
            </p>
          </div>
        `).join("")}
      </div>
    </div>
    ` : ""}

    <!-- Education -->
    ${data.education.length > 0 ? `
    <div class="timeline-section">
      <div class="timeline-dot" style="background: ${getTimelineColor('education')};">
        ${getSectionIcon('education')}
      </div>
      <div class="timeline-line"></div>
      
      <h2 class="section-title">EDUCATION</h2>
      <div class="content-box" style="background: ${getBackgroundColor('education')}; border-color: ${getBorderColor('education')};">
        ${data.education.map(edu => `
          <div class="education-card">
            <div>
              <div class="font-semibold">${edu.degree}</div>
              <div class="text-sm" style="color: #6b7280;">${edu.school}</div>
              <div class="text-xs" style="color: #9ca3af; margin-top: 4px;">
                ${edu.startYear || ""}${edu.endYear ? ` - ${edu.endYear}` : ""}
              </div>
            </div>
            ${edu.gpa ? `<div class="gpa-badge">GPA: ${edu.gpa}</div>` : ""}
          </div>
        `).join("")}
      </div>
    </div>
    ` : ""}

    <!-- Skills -->
    ${data.skills.length > 0 ? `
    <div class="timeline-section">
      <div class="timeline-dot" style="background: ${getTimelineColor('skills')};">
        ${getSectionIcon('skills')}
      </div>
      <div class="timeline-line"></div>
      
      <h2 class="section-title">SKILLS</h2>
      <div class="content-box" style="background: ${getBackgroundColor('skills')}; border-color: ${getBorderColor('skills')};">
        <div class="skills-container">
          ${data.skills.map(skill => `
            <div class="skill-tag">${skill}</div>
          `).join("")}
        </div>
      </div>
    </div>
    ` : ""}

    <!-- Projects -->
    ${data.projects.length > 0 ? `
    <div class="timeline-section">
      <div class="timeline-dot" style="background: ${getTimelineColor('projects')};">
        ${getSectionIcon('projects')}
      </div>
      <div class="timeline-line"></div>
      
      <h2 class="section-title">PROJECTS & ACHIEVEMENTS</h2>
      <div class="content-box" style="background: ${getBackgroundColor('projects')}; border-color: ${getBorderColor('projects')};">
        ${data.projects.map(project => `
          <div class="project-card">
            <div class="project-title">${project.name}</div>
            <p class="text-sm">${project.description || ""}</p>
            ${project.technologies.length > 0 ? `
              <div class="tech-tags">
                ${project.technologies.map(tech => `
                  <div class="tech-tag">${tech}</div>
                `).join("")}
              </div>
            ` : ""}
          </div>
        `).join("")}
      </div>
    </div>
    ` : ""}

    <!-- Certifications & Languages Grid -->
    <div style="display: flex; gap: 24px; margin-bottom: 40px;">
      <!-- Certifications -->
      ${data.certifications && data.certifications.length > 0 ? `
      <div style="flex: 1;">
        <div class="timeline-section">
          <div class="timeline-dot" style="background: ${getTimelineColor('certifications')};">
            ${getSectionIcon('certifications')}
          </div>
          <div class="timeline-line"></div>
          
          <h2 class="section-title">CERTIFICATIONS</h2>
          <div class="content-box" style="background: ${getBackgroundColor('certifications')}; border-color: ${getBorderColor('certifications')};">
            ${data.certifications.map(cert => `
              <div class="certification-card">
                <div class="font-semibold" style="font-size: 13px;">${cert.name}</div>
                ${cert.year ? `<div class="text-xs" style="color: #6b7280;">${cert.year}</div>` : ""}
              </div>
              ${cert.issuer ? `<div class="text-xs" style="color: #4b5563;">${cert.issuer}</div>` : ""}
            `).join("")}
          </div>
        </div>
      </div>
      ` : ""}

      <!-- Languages -->
      ${data.languages && data.languages.length > 0 ? `
      <div style="flex: 1;">
        <div class="timeline-section">
          <div class="timeline-dot" style="background: ${getTimelineColor('languages')};">
            ${getSectionIcon('languages')}
          </div>
          <div class="timeline-line"></div>
          
          <h2 class="section-title">LANGUAGES</h2>
          <div class="content-box" style="background: ${getBackgroundColor('languages')}; border-color: ${getBorderColor('languages')};">
            ${data.languages.map(lang => {
              const levelColor = lang.level === "Native" ? "#6366f1" :
                                lang.level === "Fluent" ? "#4f46e5" :
                                lang.level === "Intermediate" ? "#8b5cf6" : "#a78bfa";
              
              const levelWidth = lang.level === "Native" ? "100%" :
                                lang.level === "Fluent" ? "90%" :
                                lang.level === "Intermediate" ? "70%" : "40%";
              
              return `
                <div class="language-item">
                  <div class="font-semibold" style="font-size: 13px;">${lang.language}</div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: ${levelWidth}; background: ${levelColor};"></div>
                    </div>
                    <div class="text-xs" style="color: #6b7280;">${lang.level}</div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      </div>
      ` : ""}
    </div>

    <!-- Social Links -->
    ${data.socialLinks && data.socialLinks.length > 0 ? `
    <div class="timeline-section">
      <div class="timeline-dot" style="background: ${getTimelineColor('social')};">
        ${getSectionIcon('social')}
      </div>
      
      <h2 class="section-title">CONNECT</h2>
      <div class="content-box" style="background: ${getBackgroundColor('social')}; border-color: ${getBorderColor('social')};">
        <div class="social-links">
          ${data.socialLinks.map(link => `
            <a href="${link.url}" class="social-link" target="_blank">
              <span>${link.platform}</span>
              <span style="font-size: 10px;">↗</span>
            </a>
          `).join("")}
        </div>
      </div>
    </div>
    ` : ""}
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-content">
      <span>Timeline Template • Professional Design</span>
      <span style="color: #d1d5db">•</span>
      <span>All Rights Reserved</span>
      <span style="color: #d1d5db">•</span>
      <span>${new Date().getFullYear()}</span>
    </div>
  </div>
</div>
</body>
</html>
`;
}