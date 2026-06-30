import React from "react";
import type { ResumeData } from "./types";
import { resolveTemplateTheme } from "./themeConfig";
import type { ResumeTemplateTheme } from "./templateThemeTypes";

interface Template15Props {
  data: ResumeData;
}

const safeString = (value?: string | null) => (value || "").trim();
const safeArray = <T,>(value?: T[] | null) => (Array.isArray(value) ? value.filter(Boolean) : []);

const formatContactLine = (label: string, value?: string) =>
  value ? `${label} ${value}` : "";

const renderListItems = (items: string[]) =>
  items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>);

const renderSocialLinks = (links: Array<{ platform?: string; url?: string }>) =>
  safeArray(links).map((link, index) => {
    const label = link.platform?.trim() || "Website";
    return (
      <div key={`${label}-${index}`}>
        {`🔗 ${label}: ${link.url || ""}`}
      </div>
    );
  });

const template15Styles = (theme: ResumeTemplateTheme) => `
  .template15-page {
    width: 794px;
    min-height: 1123px;
    margin: 0 auto;
    font-family: ${theme.fontFamily || "Georgia, 'Times New Roman', serif"};
    color: ${theme.palette.text};
    background: ${theme.palette.page};
    border: 1px solid ${theme.palette.border};
  }

  .template15-layout {
    display: grid;
    grid-template-columns: 30% 70%;
    min-height: 1123px;
  }

  .template15-left {
    background: ${theme.palette.sidebarBg || theme.palette.accentSoft};
    padding: 32px;
    color: ${theme.palette.sidebarText || theme.palette.text};
  }

  .template15-right {
    padding: 40px;
  }

  .template15-name {
    font-size: 24px;
    font-weight: 700;
    word-break: normal;
    overflow-wrap: break-word;
  }

  .template15-role {
    font-size: 13px;
    color: ${theme.palette.mutedText};
    margin-top: 6px;
  }

  .template15-contact {
    margin-top: 20px;
    font-size: 13px;
    color: ${theme.palette.text};
  }

  .template15-contact div {
    margin-bottom: 8px;
  }

  .template15-left-title {
    font-size: 13px;
    font-weight: 700;
    border-bottom: 1px solid ${theme.palette.sidebarBorder || theme.palette.border};
    padding-bottom: 4px;
    margin-top: 24px;
  }

  .template15-section {
    margin-bottom: 28px;
  }

  .template15-section-title {
    font-size: 14px;
    font-weight: 700;
    border-bottom: 2px solid ${theme.palette.text};
    padding-bottom: 4px;
    margin-bottom: 10px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .template15-body {
    font-size: 13px;
    line-height: 1.6;
  }

  .template15-list {
    padding-left: 16px;
    margin-top: 6px;
  }

  .template15-list li {
    font-size: 13px;
    margin-bottom: 4px;
  }

  .template15-sub {
    font-size: 12px;
    color: ${theme.palette.mutedText};
  }

  .template15-extra-section,
  .template15-additional-section {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .template15-extra-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .template15-extra-item {
    font-size: 12px;
    line-height: 1.5;
    margin-bottom: 4px;
  }

  .template15-custom-block + .template15-custom-block {
    margin-top: 8px;
  }

  .template15-custom-title {
    font-size: 12.5px;
    font-weight: 700;
    margin-bottom: 2px;
  }

  @media print {
    .template15-page,
    .template15-section,
    .template15-extra-section,
    .template15-additional-section {
      page-break-inside: avoid;
      break-inside: avoid;
    }
  }
`;

const formatSummary = (data: ResumeData) => {
  const isFresher = data.candidateType === "fresher" || safeArray(data.experience).length === 0;
  const summaryText = isFresher ? safeString(data.careerObjective || data.summary) : safeString(data.summary || data.careerObjective);
  const summaryTitle = isFresher ? "CAREER OBJECTIVE" : "PROFESSIONAL SUMMARY";
  return { summaryText, summaryTitle };
};

const renderSupplementarySections = (data: ResumeData) => {
  const sections: React.ReactNode[] = [];

  if (safeArray(data.achievements).length > 0) {
    sections.push(
      <section key="achievements" className="template15-extra-section template15-section">
        <div className="template15-section-title">Achievements</div>
        <ul className="template15-extra-list">
          {safeArray(data.achievements).map((achievement, index) => (
            <li key={`achievement-${index}`} className="template15-extra-item">
              {typeof achievement === "string" ? achievement : achievement.title || achievement.name || ""}
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (safeArray(data.references).length > 0) {
    sections.push(
      <section key="references" className="template15-extra-section template15-section">
        <div className="template15-section-title">References</div>
        <ul className="template15-extra-list">
          {safeArray(data.references).map((reference, index) => {
            const title = typeof reference === "string" ? reference : `${reference.name || ""}${reference.role ? `, ${reference.role}` : ""}`;
            return (
              <li key={`reference-${index}`} className="template15-extra-item">
                {title}
              </li>
            );
          })}
        </ul>
      </section>
    );
  }

  if (safeArray(data.customSections).length > 0) {
    sections.push(
      <section key="custom" className="template15-additional-section template15-section">
        <div className="template15-section-title">Additional Information</div>
        {safeArray(data.customSections).map((section, index) => {
          const title = typeof section === "string" ? "" : section.title || "";
          const content = typeof section === "string" ? section : section.description || section.content || "";
          return (
            <div key={`custom-${index}`} className="template15-custom-block">
              {title ? <div className="template15-custom-title">{title}</div> : null}
              {content ? <div className="template15-extra-item">{content}</div> : null}
            </div>
          );
        })}
      </section>
    );
  }

  return sections;
};

const template15Render = (data: ResumeData, theme: ResumeTemplateTheme) => {
  const safe = {
    fullName: safeString(data.fullName) || "Your Name",
    role: safeString(data.role),
    email: safeString(data.email),
    phone: safeString(data.phone),
    address: safeString(data.address),
    summary: safeString(data.summary),
    careerObjective: safeString(data.careerObjective),
    skills: safeArray(data.skills) as string[],
    strengths: safeArray(data.strengths) as string[],
    hobbies: safeArray(data.hobbies) as string[],
    experience: safeArray(data.experience),
    education: safeArray(data.education),
    projects: safeArray(data.projects),
    languages: safeArray(data.languages),
    certifications: safeArray(data.certifications),
    socialLinks: safeArray(data.socialLinks),
  };

  const { summaryText, summaryTitle } = formatSummary(data);
  const isFresher = data.candidateType === "fresher" || safe.experience.length === 0;

  return (
    <div className="template15-page">
      <style>{template15Styles(theme)}</style>
      <div className="template15-layout">
        <div className="template15-left">
          <div className="template15-name">{safe.fullName}</div>
          {safe.role ? <div className="template15-role">{safe.role}</div> : null}
          <div className="template15-contact">
            {formatContactLine("✉", safe.email) ? <div>{formatContactLine("✉", safe.email)}</div> : null}
            {formatContactLine("📞", safe.phone) ? <div>{formatContactLine("📞", safe.phone)}</div> : null}
            {formatContactLine("📍", safe.address) ? <div>{formatContactLine("📍", safe.address)}</div> : null}
            {renderSocialLinks(data.socialLinks)}
          </div>

          {safe.skills.length > 0 ? (
            <div>
              <div className="template15-left-title">SKILLS</div>
              <ul className="template15-list">{renderListItems(safe.skills)}</ul>
            </div>
          ) : null}

          {safe.strengths.length > 0 ? (
            <div>
              <div className="template15-left-title">STRENGTHS</div>
              <ul className="template15-list">{renderListItems(safe.strengths)}</ul>
            </div>
          ) : null}

          {safe.hobbies.length > 0 ? (
            <div>
              <div className="template15-left-title">HOBBIES</div>
              <div>{safe.hobbies.join(", ")}</div>
            </div>
          ) : null}
        </div>

        <div className="template15-right">
          {(summaryText || safe.careerObjective) && (
            <div className="template15-section">
              <div className="template15-section-title">{summaryTitle}</div>
              <p className="template15-body">{summaryText || safe.careerObjective}</p>
            </div>
          )}

          {safe.experience.length > 0 && (
            <div className="template15-section">
              <div className="template15-section-title">WORK EXPERIENCE</div>
              {safe.experience.map((experience, index) => (
                <div key={`experience-${index}`} style={{ marginBottom: 16 }}>
                  <p className="template15-body" style={{ fontWeight: 700 }}>
                    {`${experience.role || ""}${experience.role && experience.company ? " — " : ""}${experience.company || ""}`}
                  </p>
                  <div className="template15-sub">{`${experience.startDate || ""}${experience.startDate && experience.endDate ? " - " : ""}${experience.endDate || ""}`}</div>
                  {experience.description ? <p className="template15-body" style={{ marginTop: 6 }}>{experience.description}</p> : null}
                </div>
              ))}
            </div>
          )}

          {safe.education.length > 0 && (
            <div className="template15-section">
              <div className="template15-section-title">EDUCATION</div>
              {safe.education.map((education, index) => (
                <div key={`education-${index}`} style={{ marginBottom: 16 }}>
                  <p className="template15-body" style={{ fontWeight: 700 }}>
                    {education.degree || ""}
                  </p>
                  <div className="template15-sub">{`${education.school || ""}${education.school && (education.startYear || education.endYear) ? " | " : ""}${education.startYear || ""}${education.startYear && education.endYear ? " - " : ""}${education.endYear || ""}`}</div>
                </div>
              ))}
            </div>
          )}

          {safe.certifications.length > 0 && (
            <div className="template15-section">
              <div className="template15-section-title">CERTIFICATIONS</div>
              {safe.certifications.map((certification, index) => (
                <div key={`certification-${index}`} style={{ marginBottom: 16 }}>
                  <p className="template15-body" style={{ fontWeight: 700 }}>
                    {certification.name || ""}
                  </p>
                  <div className="template15-sub">{`${certification.issuer || ""}${certification.issuer && certification.date ? " | " : ""}${certification.date || ""}`}</div>
                </div>
              ))}
            </div>
          )}

          {safe.projects.length > 0 && (
            <div className="template15-section">
              <div className="template15-section-title">PROJECTS</div>
              {safe.projects.map((project, index) => (
                <div key={`project-${index}`} style={{ marginBottom: 16 }}>
                  <p className="template15-body" style={{ fontWeight: 700 }}>
                    {project.name || ""}
                  </p>
                  <p className="template15-body">{project.description || ""}</p>
                </div>
              ))}
            </div>
          )}

          {safe.languages.length > 0 && (
            <div className="template15-section">
              <div className="template15-section-title">LANGUAGES</div>
              <ul className="template15-list" style={{ listStyle: "none", padding: 0 }}>
                {safe.languages.map((language, index) => (
                  <li key={`language-${index}`} style={{ marginBottom: 4 }}>
                    • {language.language || ""}{language.level ? ` (${language.level})` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {renderSupplementarySections(data)}
        </div>
      </div>
    </div>
  );
};

const Template15: React.FC<Template15Props> = ({ data }) =>
  template15Render(data, resolveTemplateTheme(15, data));

export default Template15;
