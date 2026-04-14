// template7.js
export function template7HTML(data) {
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
    strengths: Array.isArray(data.strengths) ? data.strengths : []
  };

  // Check if this is a creative/designer profile
  const isCreative = safeData.skills.some(skill => 
    skill.toLowerCase().includes('design') || 
    skill.toLowerCase().includes('figma') || 
    skill.toLowerCase().includes('ui') || 
    skill.toLowerCase().includes('ux') ||
    skill.toLowerCase().includes('photo') ||
    skill.toLowerCase().includes('video')
  );

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Resume - ${safeData.fullName || "Creative Portfolio"}</title>
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
    color: #1f2937;
    background: linear-gradient(135deg, #f9fafb 0%, #ffffff 50%, #fce7f3 100%);
    min-height: 1123px;
    width: 794px;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
  }

  /* Creative Background Pattern */
  .creative-bg {
    position: absolute;
    inset: 0;
    opacity: 0.05;
    pointer-events: none;
  }

  .bg-top-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, #ec4899 0%, #3b82f6 100%);
  }

  .bg-circle-1 {
    position: absolute;
    top: 80px;
    right: 40px;
    width: 160px;
    height: 160px;
    border: 2px solid #f472b6;
    border-radius: 50%;
  }

  .bg-square-1 {
    position: absolute;
    bottom: 160px;
    left: 40px;
    width: 128px;
    height: 128px;
    border: 2px solid #93c5fd;
    transform: rotate(45deg);
    border-radius: 8px;
  }

  .bg-square-2 {
    position: absolute;
    top: 33%;
    left: 25%;
    width: 96px;
    height: 96px;
    border: 2px solid #c4b5fd;
    transform: rotate(12deg);
    border-radius: 8px;
  }

  /* Main Container */
  .resume-container {
    position: relative;
    z-index: 10;
    padding: 32px 40px;
    min-height: 1123px;
  }

  /* Header */
  .header {
    margin-bottom: 40px;
  }

  .header-main {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 32px;
  }

  .name-section {
    flex: 1;
  }

  .name-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .creative-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
  }

  .name-title h1 {
    font-size: 28px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 4px;
  }

  .name-title .role {
    font-size: 18px;
    font-weight: 500;
    color: #4b5563;
  }

  /* Creative Tagline */
  .creative-tagline {
    margin-top: 16px;
    margin-left: 60px;
  }

  .tagline-text {
    font-size: 14px;
    font-style: italic;
    color: #6b7280;
    border-left: 2px solid #ec4899;
    padding-left: 12px;
  }

  /* Contact Info */
  .contact-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    min-width: 180px;
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 14px;
    color: #374151;
  }

  .contact-item:last-child {
    margin-bottom: 0;
  }

  .contact-icon {
    width: 14px;
    height: 14px;
  }

  .icon-pink {
    color: #ec4899;
  }

  .icon-blue {
    color: #3b82f6;
  }

  .icon-purple {
    color: #8b5cf6;
  }

  /* Creative Divider */
  .creative-divider {
    display: flex;
    align-items: center;
    margin: 32px 0;
  }

  .divider-line {
    flex: 1;
    height: 1px;
  }

  .divider-dots {
    display: flex;
    gap: 4px;
    margin: 0 16px;
  }

  .divider-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .dot-pink {
    background: #ec4899;
  }

  .dot-purple {
    background: #8b5cf6;
  }

  .dot-blue {
    background: #3b82f6;
  }

  /* Main Grid Layout */
  .main-grid {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 32px;
  }

  /* Left Column */
  .left-column {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  /* Right Column */
  .right-column {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  /* Section Headers */
  .section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }

  .section-line {
    width: 32px;
    height: 2px;
    border-radius: 1px;
  }

  .section-title {
    font-size: 16px;
    font-weight: 700;
    color: #111827;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .section-icon {
    width: 18px;
    height: 18px;
  }

  /* Creative Skills */
  .skill-item {
    margin-bottom: 16px;
  }

  .skill-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }

  .skill-name {
    font-size: 14px;
    font-weight: 500;
    color: #111827;
  }

  .skill-stars {
    display: flex;
    gap: 2px;
  }

  .star-filled {
    color: #f59e0b;
    font-size: 10px;
  }

  .star-empty {
    color: #d1d5db;
    font-size: 10px;
  }

  .skill-bar-container {
    width: 100%;
    height: 6px;
    background: #e5e7eb;
    border-radius: 3px;
    overflow: hidden;
  }

  .skill-bar {
    height: 100%;
    background: linear-gradient(90deg, #ec4899 0%, #8b5cf6 100%);
    border-radius: 3px;
    transition: width 0.5s ease;
  }

  /* Tools & Technologies */
  .tools-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .tool-tag {
    padding: 6px 12px;
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    border: 1px solid #bfdbfe;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    color: #1e40af;
  }

  /* Languages */
  .language-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .language-name {
    font-size: 14px;
    font-weight: 500;
    color: #111827;
  }

  .language-level-container {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .language-bar {
    width: 64px;
    height: 6px;
    background: #e5e7eb;
    border-radius: 3px;
    overflow: hidden;
  }

  .level-progress {
    height: 100%;
    border-radius: 3px;
  }

  .level-native {
    background: #10b981;
  }

  .level-fluent {
    background: #059669;
  }

  .level-intermediate {
    background: #d97706;
  }

  .level-basic {
    background: #ea580c;
  }

  .level-label {
    font-size: 12px;
    color: #6b7280;
    min-width: 60px;
    text-align: right;
  }

  /* Experience Timeline */
  .experience-timeline {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .timeline-item {
    position: relative;
    padding-left: 32px;
  }

  .timeline-dot {
    position: absolute;
    left: 0;
    top: 8px;
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .inner-dot {
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 50%;
  }

  .experience-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 20px;
    transition: box-shadow 0.2s ease;
  }

  .experience-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .exp-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .exp-title {
    font-size: 18px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 4px;
  }

  .exp-company {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #6b7280;
  }

  .exp-badge {
    font-size: 12px;
    font-weight: 600;
    padding: 4px 12px;
    background: #ede9fe;
    color: #5b21b6;
    border-radius: 12px;
  }

  .exp-description {
    border-left: 2px solid #ddd6fe;
    padding-left: 16px;
    font-size: 14px;
    color: #374151;
    line-height: 1.6;
  }

  /* Projects Grid */
  .projects-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .project-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 16px;
    transition: all 0.3s ease;
  }

  .project-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  .project-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .project-name {
    font-size: 16px;
    font-weight: 700;
    color: #111827;
  }

  .project-number {
    font-size: 12px;
    font-weight: 600;
    padding: 4px 8px;
    background: #fef3c7;
    color: #92400e;
    border-radius: 6px;
  }

  .project-description {
    font-size: 13px;
    color: #4b5563;
    margin-bottom: 16px;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .tech-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .tech-tag {
    font-size: 11px;
    font-weight: 500;
    padding: 4px 8px;
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    color: #92400e;
    border: 1px solid #fcd34d;
    border-radius: 12px;
  }

  .more-tag {
    font-size: 11px;
    color: #6b7280;
    padding: 4px 8px;
  }

  /* Education & Certifications Grid */
  .edu-cert-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  /* Education Section */
  .education-card {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    border: 1px solid #bfdbfe;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
  }

  .edu-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }

  .edu-title {
    font-size: 14px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 4px;
  }

  .edu-school {
    font-size: 13px;
    color: #4b5563;
  }

  .gpa-badge {
    font-size: 12px;
    font-weight: 600;
    padding: 4px 8px;
    background: #bfdbfe;
    color: #1e40af;
    border-radius: 4px;
  }

  .edu-date {
    font-size: 12px;
    color: #6b7280;
  }

  /* Certifications Section */
  .cert-card {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    border: 1px solid #bbf7d0;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 12px;
  }

  .cert-name {
    font-size: 14px;
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
    font-size: 12px;
    color: #4b5563;
  }

  .cert-year {
    font-size: 12px;
    color: #6b7280;
  }

  /* Footer */
  .footer {
    margin-top: 48px;
    padding-top: 32px;
    border-top: 1px solid #d1d5db;
  }

  .footer-content {
    text-align: center;
  }

  .footer-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    margin-bottom: 12px;
  }

  .footer-text {
    font-size: 14px;
    font-weight: 500;
    color: #4b5563;
  }

  .footer-dots {
    display: flex;
    gap: 4px;
  }

  .footer-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .footer-note {
    font-size: 12px;
    color: #6b7280;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .sparkle {
    color: #f59e0b;
    font-size: 10px;
  }

  /* Utility Classes */
  .mb-1 {
    margin-bottom: 4px;
  }

  .mb-2 {
    margin-bottom: 8px;
  }

  .mb-3 {
    margin-bottom: 12px;
  }

  .mb-4 {
    margin-bottom: 16px;
  }

  .space-y-3 > * + * {
    margin-top: 12px;
  }

  .space-y-4 > * + * {
    margin-top: 16px;
  }

  .space-y-6 > * + * {
    margin-top: 24px;
  }

  /* Print Styles */
  @media print {
    body {
      background: white;
    }
    
    .creative-bg {
      display: none;
    }
    
    .experience-card,
    .project-card,
    .contact-card {
      box-shadow: none;
      border: 1px solid #d1d5db;
    }
    
    .project-card:hover {
      transform: none;
      box-shadow: none;
    }
  }
</style>
</head>
<body>
  <!-- Creative Background -->
  <div class="creative-bg">
    <div class="bg-top-line"></div>
    <div class="bg-circle-1"></div>
    <div class="bg-square-1"></div>
    <div class="bg-square-2"></div>
  </div>

  <!-- Main Content -->
  <div class="resume-container">
    <!-- Header -->
    <header class="header">
      <div class="header-main">
        <div class="name-section">
          <div class="name-row">
            <div class="creative-icon">✎</div>
            <div class="name-title">
              <h1>${safeData.fullName || "Your Name"}</h1>
              ${safeData.role ? `<div class="role">${safeData.role}</div>` : ""}
            </div>
          </div>
          
          ${safeData.summary ? `
          <div class="creative-tagline">
            <div class="tagline-text">
              "${safeData.summary.substring(0, 120)}${safeData.summary.length > 120 ? '...' : ''}"
            </div>
          </div>
          ` : ""}
        </div>
        
        <!-- Contact Info -->
        <div class="contact-card">
          ${safeData.email ? `
          <div class="contact-item">
            <div class="contact-icon icon-pink">✉️</div>
            <span>${safeData.email}</span>
          </div>
          ` : ""}
          
          ${safeData.phone ? `
          <div class="contact-item">
            <div class="contact-icon icon-blue">📱</div>
            <span>${safeData.phone}</span>
          </div>
          ` : ""}
          
          ${safeData.address ? `
          <div class="contact-item">
            <div class="contact-icon icon-purple">📍</div>
            <span>${safeData.address}</span>
          </div>
          ` : ""}
        </div>
      </div>
      
      <!-- Creative Divider -->
      <div class="creative-divider">
        <div class="divider-line" style="background: linear-gradient(90deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%);"></div>
        <div class="divider-dots">
          <div class="divider-dot dot-pink"></div>
          <div class="divider-dot dot-purple"></div>
          <div class="divider-dot dot-blue"></div>
        </div>
        <div class="divider-line" style="background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);"></div>
      </div>
    </header>

    <!-- Main Content Grid -->
    <div class="main-grid">
      <!-- Left Column -->
      <div class="left-column">
        <!-- Creative Skills -->
        ${safeData.skills.length > 0 ? `
        <section>
          <div class="section-header">
            <div class="section-line" style="background: #ec4899;"></div>
            <h2 class="section-title">
              <span class="section-icon">✨</span>
              CREATIVE SKILLS
            </h2>
          </div>
          
          <div class="space-y-4">
            ${safeData.skills.map((skill, index) => {
              const skillLevel = Math.min(95, 70 + (index * 8));
              return `
              <div class="skill-item">
                <div class="skill-header">
                  <span class="skill-name">${skill}</span>
                  <div class="skill-stars">
                    <span class="star-filled">★</span>
                    <span class="star-filled">★</span>
                    <span class="star-filled">★</span>
                    <span class="star-filled">★</span>
                    <span class="star-empty">★</span>
                  </div>
                </div>
                <div class="skill-bar-container">
                  <div class="skill-bar" style="width: ${skillLevel}%;"></div>
                </div>
              </div>
              `;
            }).join("")}
          </div>
        </section>
        ` : ""}

        <!-- Tools & Technologies -->
        ${safeData.projects.length > 0 ? `
        <section>
          <div class="section-header">
            <div class="section-line" style="background: #3b82f6;"></div>
            <h2 class="section-title">
              <span class="section-icon">💻</span>
              TOOLS & TECH
            </h2>
          </div>
          
          <div class="tools-grid">
            ${(() => {
              const allTech = new Set();
              safeData.projects.forEach(project => {
                if (Array.isArray(project.technologies)) {
                  project.technologies.forEach(tech => allTech.add(tech));
                }
              });
              return Array.from(allTech).slice(0, 10).map(tech => 
                `<div class="tool-tag">${tech}</div>`
              ).join("");
            })()}
          </div>
        </section>
        ` : ""}

        <!-- Languages -->
        ${safeData.languages.length > 0 ? `
        <section>
          <div class="section-header">
            <div class="section-line" style="background: #10b981;"></div>
            <h2 class="section-title">
              <span class="section-icon">🌐</span>
              LANGUAGES
            </h2>
          </div>
          
          <div class="space-y-3">
            ${safeData.languages.map(lang => {
              let levelClass = "level-basic";
              let width = "40%";
              let levelText = lang.level;
              
              if (lang.level === "Native") {
                levelClass = "level-native";
                width = "100%";
              } else if (lang.level === "Fluent") {
                levelClass = "level-fluent";
                width = "90%";
              } else if (lang.level === "Intermediate") {
                levelClass = "level-intermediate";
                width = "70%";
              }
              
              return `
              <div class="language-item">
                <span class="language-name">${lang.language}</span>
                <div class="language-level-container">
                  <div class="language-bar">
                    <div class="level-progress ${levelClass}" style="width: ${width};"></div>
                  </div>
                  <span class="level-label">${levelText}</span>
                </div>
              </div>
              `;
            }).join("")}
          </div>
        </section>
        ` : ""}
      </div>

      <!-- Right Column -->
      <div class="right-column">
        <!-- Experience -->
        ${safeData.experience.length > 0 ? `
        <section>
          <div class="section-header">
            <div class="section-line" style="background: #8b5cf6;"></div>
            <h2 class="section-title">
              <span class="section-icon">💼</span>
              PROFESSIONAL EXPERIENCE
            </h2>
          </div>
          
          <div class="experience-timeline">
            ${safeData.experience.map((exp, index) => `
            <div class="timeline-item">
              <div class="timeline-dot">
                <div class="inner-dot"></div>
              </div>
              <div class="experience-card">
                <div class="exp-header">
                  <div>
                    <h3 class="exp-title">${exp.role || ""}</h3>
                    <div class="exp-company">
                      <span>${exp.company || ""}</span>
                      <span style="color: #d1d5db">•</span>
                      <span>${exp.startDate || ""} - ${exp.endDate || "Present"}</span>
                    </div>
                  </div>
                  <div class="exp-badge">Full-time</div>
                </div>
                <p class="exp-description">${exp.description || ""}</p>
              </div>
            </div>
            `).join("")}
          </div>
        </section>
        ` : ""}

        <!-- Projects -->
        ${safeData.projects.length > 0 ? `
        <section>
          <div class="section-header">
            <div class="section-line" style="background: #f59e0b;"></div>
            <h2 class="section-title">
              <span class="section-icon">🎯</span>
              FEATURED PROJECTS
            </h2>
          </div>
          
          <div class="projects-grid">
            ${safeData.projects.map((project, index) => `
            <div class="project-card">
              <div class="project-header">
                <h3 class="project-name">${project.name}</h3>
                <div class="project-number">Project #${index + 1}</div>
              </div>
              <p class="project-description">${project.description || ""}</p>
              ${project.technologies && project.technologies.length > 0 ? `
              <div class="tech-tags">
                ${project.technologies.slice(0, 3).map(tech => 
                  `<span class="tech-tag">${tech}</span>`
                ).join("")}
                ${project.technologies.length > 3 ? 
                  `<span class="more-tag">+${project.technologies.length - 3} more</span>` : ""
                }
              </div>
              ` : ""}
            </div>
            `).join("")}
          </div>
        </section>
        ` : ""}

        <!-- Education & Certifications Grid -->
        <div class="edu-cert-grid">
          <!-- Education -->
          ${safeData.education.length > 0 ? `
          <section>
            <div class="section-header">
              <div class="section-line" style="background: #3b82f6;"></div>
              <h2 class="section-title">
                <span class="section-icon">🎓</span>
                EDUCATION
              </h2>
            </div>
            
            <div class="space-y-3">
              ${safeData.education.map(edu => `
              <div class="education-card">
                <div class="edu-header">
                  <div>
                    <h3 class="edu-title">${edu.degree}</h3>
                    <p class="edu-school">${edu.school}</p>
                  </div>
                  ${edu.gpa ? `<div class="gpa-badge">GPA: ${edu.gpa}</div>` : ""}
                </div>
                <div class="edu-date">${edu.startYear || ""} - ${edu.endYear || "Present"}</div>
              </div>
              `).join("")}
            </div>
          </section>
          ` : ""}

          <!-- Certifications -->
          ${safeData.certifications.length > 0 ? `
          <section>
            <div class="section-header">
              <div class="section-line" style="background: #10b981;"></div>
              <h2 class="section-title">
                <span class="section-icon">🏆</span>
                CERTIFICATIONS
              </h2>
            </div>
            
            <div class="space-y-3">
              ${safeData.certifications.map(cert => `
              <div class="cert-card">
                <div class="cert-name">${cert.name}</div>
                <div class="cert-details">
                  <span class="cert-issuer">${cert.issuer || ""}</span>
                  <span class="cert-year">${cert.year || ""}</span>
                </div>
              </div>
              `).join("")}
            </div>
          </section>
          ` : ""}

          <!-- Strengths -->
          ${safeData.strengths.length > 0 ? `
          <section>
            <div class="section-header">
              <div class="section-line" style="background: #f59e0b;"></div>
              <h2 class="section-title">
                <span class="section-icon">💪</span>
                STRENGTHS
              </h2>
            </div>
            
            <ul class="strengths-list">
              ${safeData.strengths.map(strength => `
                <li class="strength-item">
                  <span class="strength-bullet">•</span>
                  <span class="strength-text">${strength}</span>
                </li>
              `).join("")}
            </ul>
          </section>
          ` : ""}

          <!-- Hobbies -->
          ${safeData.hobbies.length > 0 ? `
          <section>
            <div class="section-header">
              <div class="section-line" style="background: #ec4899;"></div>
              <h2 class="section-title">
                <span class="section-icon">🎨</span>
                HOBBIES
              </h2>
            </div>
            
            <div class="hobbies-content">
              ${safeData.hobbies.join(", ")}
            </div>
          </section>
          ` : ""}
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-row">
          <span class="footer-text">Creative Portfolio Template</span>
          <div class="footer-dots">
            <div class="footer-dot dot-pink"></div>
            <div class="footer-dot dot-purple"></div>
            <div class="footer-dot dot-blue"></div>
          </div>
          <span class="footer-text">Designed for Creatives</span>
        </div>
        <div class="footer-note">
          <span class="sparkle">✨</span>
          Showcasing creativity with professional integrity
          <span class="sparkle">✨</span>
        </div>
      </div>
    </footer>
  </div>
</body>
</html>
`;
}