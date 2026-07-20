import React from "react";
import { ResumeTypography } from "@/constants/resumeDesignSystem";
import type { ResumeTemplateTheme } from "./templateThemeTypes";
import { resolveTemplateTheme } from "./themeConfig";
import type { ResumeData } from "./types";

interface Template15Props {
  data: ResumeData;
}

const safeString = (value?: string | null) => (value || "").trim();
const safeArray = <T,>(value?: T[] | null) => (Array.isArray(value) ? value.filter(Boolean) : []);
const joinItems = (items: string[]) => items.filter(Boolean).join(", ");

const renderSocialLinks = (links: Array<{ platform?: string; url?: string }>) =>
  safeArray(links).map((link, index) => {
    const label = link.platform?.trim() || "Website";
    const value = safeString(link.url);

    if (!value) {
      return null;
    }

    return <div key={`${label}-${index}`}>{`${label}: ${value}`}</div>;
  });

const renderTextLines = (value?: string) =>
  safeString(value)
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

const template15Styles = (theme: ResumeTemplateTheme) => `
  .template15-page {
    width: 794px;
    min-height: 1123px;
    margin: 0 auto;
    font-family: ${ResumeTypography.fontFamily};
    color: ${theme.palette.text};
    background: ${theme.palette.page};
    border: 1px solid ${theme.palette.border};
  }

  .template15-layout {
    display: grid;
    grid-template-columns: 30% 70%;
    min-height: 1123px;
    align-content: start;
    background: linear-gradient(
      to right,
      ${theme.palette.sidebarBg || theme.palette.accentSoft} 0,
      ${theme.palette.sidebarBg || theme.palette.accentSoft} 30%,
      ${theme.palette.page} 30%,
      ${theme.palette.page} 100%
    );
  }

  .template15-left {
    background: ${theme.palette.sidebarBg || theme.palette.accentSoft};
    padding: 32px;
    color: ${theme.palette.sidebarText || theme.palette.text};
  }

  .template15-right {
    padding: 40px;
  }

  .template15-layout > .resume-section {
    grid-column: 2;
    padding: 0 40px;
  }

  .template15-layout > .template15-sidebar-section {
    grid-column: 1;
    padding: 0 24px 0 32px;
  }

  .template15-name {
    font-size: ${ResumeTypography.name}px;
    font-weight: 700;
    line-height: ${ResumeTypography.lineHeight};
    word-break: normal;
    overflow-wrap: break-word;
    color: ${theme.palette.sidebarText || theme.palette.text};
  }

  .template15-role {
    margin-top: 6px;
    font-size: ${ResumeTypography.role}px;
    font-weight: 600;
    line-height: ${ResumeTypography.lineHeight};
    color: ${theme.palette.sidebarMutedText || theme.palette.sidebarText || theme.palette.mutedText};
  }

  .template15-contact {
    margin-top: 20px;
    font-size: ${ResumeTypography.contact}px;
    line-height: ${ResumeTypography.lineHeight};
    color: ${theme.palette.sidebarText || theme.palette.text};
  }

  .template15-contact div {
    margin-bottom: 8px;
  }

  .template15-left-title {
    margin-top: 24px;
    padding-bottom: 4px;
    font-size: ${ResumeTypography.heading}px;
    font-weight: 700;
    line-height: ${ResumeTypography.lineHeight};
    color: ${theme.palette.headingText || theme.palette.sidebarText || theme.palette.text};
    letter-spacing: 0.04em;
    border-bottom: 1px solid ${theme.palette.sidebarBorder || theme.palette.border};
  }

  .template15-sidebar-copy {
    margin-top: 6px;
    font-size: ${ResumeTypography.body}px;
    line-height: ${ResumeTypography.lineHeight};
    color: ${theme.palette.sidebarText || theme.palette.text};
    overflow-wrap: anywhere;
  }

  .template15-section {
    margin-bottom: 28px;
  }

  .template15-section-title {
    margin-bottom: 10px;
    padding-bottom: 4px;
    font-size: ${ResumeTypography.heading}px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: ${theme.palette.headingText || theme.palette.text};
    border-bottom: 2px solid ${theme.palette.text};
  }

  .template15-body {
    font-size: ${ResumeTypography.body}px;
    line-height: ${ResumeTypography.lineHeight};
  }

  .template15-sub {
    font-size: ${ResumeTypography.subtitle}px;
    line-height: ${ResumeTypography.lineHeight};
    color: ${theme.palette.mutedText};
  }

  .template15-entry {
    margin-bottom: 16px;
  }

  .template15-entry-heading {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  .template15-entry-bullet {
    flex: 0 0 auto;
    font-size: ${ResumeTypography.body}px;
    line-height: ${ResumeTypography.lineHeight};
    color: ${theme.palette.text};
  }

  .template15-entry-title {
    font-size: ${ResumeTypography.title}px;
    line-height: ${ResumeTypography.lineHeight};
    font-weight: 700;
    color: ${theme.palette.text};
  }

  .template15-entry-lines {
    margin-top: 4px;
    margin-left: 18px;
  }

  .template15-entry-lines .template15-body + .template15-body,
  .template15-entry-lines .template15-sub + .template15-sub,
  .template15-entry-lines .template15-sub + .template15-body,
  .template15-entry-lines .template15-body + .template15-sub {
    margin-top: 2px;
  }

  .template15-list {
    margin-top: 6px;
    padding-left: 16px;
  }

  .template15-list li {
    font-size: ${ResumeTypography.list}px;
    line-height: ${ResumeTypography.lineHeight};
    margin-bottom: 4px;
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
    font-size: ${ResumeTypography.small}px;
    line-height: ${ResumeTypography.lineHeight};
    margin-bottom: 4px;
  }

  .resume-section-content {
    padding-left: var(--resume-section-content-indent, 16px);
  }

  .template15-custom-block + .template15-custom-block {
    margin-top: 8px;
  }

  .template15-custom-title {
    margin-bottom: 2px;
    font-size: ${ResumeTypography.subtitle}px;
    font-weight: 700;
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
  const summaryText = isFresher
    ? safeString(data.careerObjective || data.summary)
    : safeString(data.summary || data.careerObjective);
  const summaryTitle = isFresher ? "CAREER OBJECTIVE" : "PROFESSIONAL SUMMARY";
  return { summaryText, summaryTitle };
};

const renderSupplementarySections = (data: ResumeData) => {
  const sections: React.ReactNode[] = [];

  if (safeArray(data.achievements).length > 0) {
    sections.push(
      <section key="achievements" className="template15-extra-section template15-section resume-section">
        <div className="template15-section-title resume-section-title">Achievements</div>
        <ul className="template15-extra-list resume-section-content">
          {safeArray(data.achievements).map((achievement, index) => (
            <li key={`achievement-${index}`} className="template15-extra-item">
              {achievement}
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (safeArray(data.references).length > 0) {
    sections.push(
      <section key="references" className="template15-extra-section template15-section resume-section">
        <div className="template15-section-title resume-section-title">References</div>
        <ul className="template15-extra-list resume-section-content">
          {safeArray(data.references).map((reference, index) => (
            <li key={`reference-${index}`} className="template15-extra-item">
              {reference}
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (safeArray(data.customSections).length > 0) {
    sections.push(
      <section key="custom" className="template15-additional-section template15-section resume-section">
        <div className="template15-section-title resume-section-title">Additional Information</div>
        <div className="resume-section-content">
          {safeArray(data.customSections).map((section, index) => {
            const title = section.title || "";
            const content = section.description || "";

            return (
              <div key={`custom-${index}`} className="template15-custom-block">
                {title ? <div className="template15-custom-title">{title}</div> : null}
                {content ? <div className="template15-extra-item">{content}</div> : null}
              </div>
            );
          })}
        </div>
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

  return (
    <div className="resume-theme-root resume-page sidebar-layout template15-page">
      <style>{template15Styles(theme)}</style>
      <div className="template15-layout">
        <div className="template15-left">
          <div className="template15-name">{safe.fullName}</div>
          {safe.role ? <div className="template15-role">{safe.role}</div> : null}
          <div className="template15-contact">
            {safe.email ? <div>{safe.email}</div> : null}
            {safe.phone ? <div>{safe.phone}</div> : null}
            {safe.address ? <div>{safe.address}</div> : null}
            {renderSocialLinks(data.socialLinks)}
          </div>

          {safe.skills.length > 0 ? (
            <section className="resume-section template15-sidebar-section">
              <div className="template15-left-title resume-section-title">SKILLS</div>
              <div className="template15-sidebar-copy resume-section-content">{joinItems(safe.skills)}</div>
            </section>
          ) : null}

          {safe.strengths.length > 0 ? (
            <section className="resume-section template15-sidebar-section">
              <div className="template15-left-title resume-section-title">STRENGTHS</div>
              <div className="template15-sidebar-copy resume-section-content">{joinItems(safe.strengths)}</div>
            </section>
          ) : null}

          {safe.hobbies.length > 0 ? (
            <section className="resume-section template15-sidebar-section">
              <div className="template15-left-title resume-section-title">HOBBIES</div>
              <div className="template15-sidebar-copy resume-section-content">{safe.hobbies.join(", ")}</div>
            </section>
          ) : null}
        </div>

        <div className="template15-right">
          {(summaryText || safe.careerObjective) && (
            <section className="template15-section resume-section">
              <div className="template15-section-title resume-section-title">{summaryTitle}</div>
              <div className="resume-section-content">
                <p className="template15-body">{summaryText || safe.careerObjective}</p>
              </div>
            </section>
          )}

          {safe.experience.length > 0 && (
            <section className="template15-section resume-section">
              <div className="template15-section-title resume-section-title">WORK EXPERIENCE</div>
              <div className="resume-section-content">
                {safe.experience.map((experience, index) => (
                  <div key={`experience-${index}`} className="template15-entry">
                    <div className="template15-entry-title">
                      {`${experience.role || ""}${experience.role && experience.company ? " at " : ""}${experience.company || ""}`}
                    </div>
                    {experience.startDate || experience.endDate ? (
                      <div className="template15-sub" style={{ marginTop: 2 }}>
                        {`${experience.startDate || ""}${experience.startDate && experience.endDate ? " - " : ""}${experience.endDate || ""}`}
                      </div>
                    ) : null}
                    {renderTextLines(experience.description).length > 0 ? (
                      <ul className="template15-list">
                        {renderTextLines(experience.description).map((line, lineIndex) => (
                          <li key={`experience-${index}-line-${lineIndex}`} className="template15-body">
                            {line}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          )}

          {safe.education.length > 0 && (
            <section className="template15-section resume-section">
              <div className="template15-section-title resume-section-title">EDUCATION</div>
              <div className="resume-section-content">
                {safe.education.map((education, index) => (
                  <div key={`education-${index}`} className="template15-entry">
                    <div className="template15-entry-heading">
                      <span className="template15-entry-bullet">•</span>
                      <div className="template15-entry-title">{education.degree || ""}</div>
                    </div>
                    <div className="template15-entry-lines">
                      {education.school ? <div className="template15-body">{education.school}</div> : null}
                      {education.startYear || education.endYear ? (
                        <div className="template15-sub">
                          {`${education.startYear || ""}${education.startYear && education.endYear ? " - " : ""}${education.endYear || ""}`}
                        </div>
                      ) : null}
                      {education.gpa ? <div className="template15-sub">{`GPA: ${education.gpa}`}</div> : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {safe.certifications.length > 0 && (
            <section className="template15-section resume-section">
              <div className="template15-section-title resume-section-title">CERTIFICATIONS</div>
              <div className="resume-section-content">
                {safe.certifications.map((certification, index) => (
                  <div key={`certification-${index}`} className="template15-entry">
                    <div className="template15-entry-heading">
                      <span className="template15-entry-bullet">•</span>
                      <div className="template15-entry-title">{certification.name || ""}</div>
                    </div>
                    <div className="template15-entry-lines">
                      <div className="template15-sub">
                        {`${certification.issuer || ""}${certification.issuer && certification.year ? " | " : ""}${certification.year || ""}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {safe.projects.length > 0 && (
            <section className="template15-section resume-section">
              <div className="template15-section-title resume-section-title">PROJECTS</div>
              <div className="resume-section-content">
                {safe.projects.map((project, index) => (
                  <div key={`project-${index}`} className="template15-entry">
                    <div className="template15-entry-title">{project.name || ""}</div>
                    <ul className="template15-list">
                      {project.description ? <li className="template15-body">{project.description}</li> : null}
                      {project.technologies.length > 0 ? (
                        <li className="template15-body">{`Technologies: ${joinItems(project.technologies)}`}</li>
                      ) : null}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {safe.languages.length > 0 && (
            <section className="template15-section resume-section">
              <div className="template15-section-title resume-section-title">LANGUAGES</div>
              <ul className="template15-list resume-section-content" style={{ listStyle: "none" }}>
                {safe.languages.map((language, index) => (
                  <li key={`language-${index}`} style={{ marginBottom: 4 }}>
                    • {language.language || ""}
                    {language.level ? ` (${language.level})` : ""}
                  </li>
                ))}
              </ul>
            </section>
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

