import React, { type CSSProperties } from "react";
import type { ResumeData } from "./types";
import { getCompactMode, getDensityMode, getSummaryConfig } from "./templatePolicy";
import {
  formatMonthYear,
  isFresherResume,
  sortCertificationsReverseChronological,
  sortEducationReverseChronological,
  sortExperienceReverseChronological,
} from "./resumeSections";
import { ResumeTypography } from "@/constants/resumeDesignSystem";
import type { ResumeTemplateTheme } from "./templateThemeTypes";
import { resolveTemplateTheme } from "./themeConfig";

interface Template5Props {
  data: ResumeData;
}

const hasText = (value?: string | null) => Boolean(value && value.trim());

const toBulletItems = (value?: string | null) =>
  (value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const uniqueItems = (items: string[]) => [...new Set(items.filter(Boolean))];

const formatRange = (start?: string, end?: string) => {
  const parts = [formatMonthYear(start), formatMonthYear(end)].filter(Boolean);
  return parts.join(" \u2013 ");
};

const getContactItems = (data: ResumeData) => {
  const items: { label: string; value: string }[] = [];

  if (hasText(data.email)) items.push({ label: "Email", value: data.email });
  if (hasText(data.phone)) items.push({ label: "Phone", value: data.phone });
  if (hasText(data.address)) items.push({ label: "Location", value: data.address });

  (data.socialLinks || []).forEach((link) => {
    if (hasText(link.url)) {
      items.push({
        label: link.platform?.toLowerCase().includes("linkedin")
          ? "LinkedIn"
          : link.platform || "Link",
        value: link.url,
      });
    }
  });

  return items;
};

const Template5Styles = ({
  theme,
}: {
  theme: ResumeTemplateTheme;
}) => (
  <style>{`
    .template5-page,
    .template5-page * {
      box-sizing: border-box;
    }

    .template5-page {
      width: var(--resume-page-width, 794px);
      height: var(--resume-page-height, 1123px);
      min-height: var(--resume-page-height, 1123px);
      background: ${theme.palette.page};
      color: ${theme.palette.text};
      position: relative;
      overflow: visible;
      page-break-after: always;
      break-after: page;
    }

    .template5-shell {
      position: relative;
      height: 100%;
      min-height: 1123px;
      padding: 28px 28px 24px 34px;
      background: ${theme.palette.page};
    }

    .template5-shell::before {
      content: "";
      position: absolute;
      left: 18px;
      top: 28px;
      bottom: 24px;
      width: 6px;
      background: ${theme.palette.accent};
      border-radius: 999px;
    }

    .template5-grid {
      display: grid;
      grid-template-columns: 228px minmax(0, 1fr);
      gap: 18px;
      margin-left: 10px;
      min-height: 100%;
      align-items: stretch;
    }

    .template5-sidebar {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
      min-height: 100%;
      height: 100%;
      padding-right: 4px;
    }

    .template5-contact-card {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      min-height: 0;
    }

    .template5-main {
      display: grid;
      align-content: start;
      gap: 12px;
      min-width: 0;
    }

    .template5-name {
      margin: 0;
      font-size: 27px;
      line-height: 1.08;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: ${theme.palette.nameText || theme.palette.text};
      text-transform: uppercase;
      overflow-wrap: break-word;
    }

    .template5-role {
      margin: 4px 0 0;
      font-size: 14px;
      line-height: 1.45;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: ${theme.palette.titleText || theme.palette.mutedText};
      text-transform: uppercase;
    }

    .template5-sidebar-card,
    .template5-main-card,
    .template5-summary-card {
      border-radius: 12px;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .template5-sidebar-card {
      background: ${theme.palette.sidebarBg || theme.palette.accentSoft};
      border: 1px solid ${theme.palette.sidebarBorder || theme.palette.border};
      padding: 10px 11px;
    }

    .template5-main-card {
      background: ${theme.palette.page};
      border: 1px solid ${theme.palette.border};
      padding: 12px 13px;
    }

    .template5-summary-card {
      background: ${theme.palette.accentSoft};
      border: 1px solid ${theme.palette.accentBorder || theme.palette.accent};
      padding: 14px 15px;
    }

    .template5-section-title {
      margin: 0 0 7px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      line-height: 1.2;
      color: ${theme.palette.headingText || theme.palette.text};
    }

    .template5-contact-list,
    .template5-link-list,
    .template5-mini-list,
    .template5-stack {
      display: grid;
      gap: 7px;
      min-width: 0;
    }

    .template5-contact-row {
      display: grid;
      gap: 2px;
      min-width: 0;
    }

    .template5-contact-label {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: ${theme.palette.sidebarMutedText || theme.palette.mutedText};
    }

    .template5-contact-value,
    .template5-body,
    .template5-item-text {
      font-size: 10.9px;
      line-height: 1.45;
      color: ${theme.palette.text};
      overflow-wrap: anywhere;
    }

    .template5-chip-list {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }

    .template5-chip {
      display: inline-flex;
      align-items: center;
      padding: 4px 8px;
      border-radius: 999px;
      font-size: 10.1px;
      font-weight: 700;
      line-height: 1.15;
    }

    .template5-chip-skill {
      background: ${theme.palette.accentSoft};
      color: ${theme.palette.accent};
    }

    .template5-chip-strength {
      background: ${theme.palette.accentSoft};
      color: ${theme.palette.accent};
    }

    .template5-chip-interest {
      background: ${theme.palette.accentSoft};
      color: ${theme.palette.accent};
    }

    .template5-item-title {
      margin: 0;
      font-size: 12px;
      line-height: 1.35;
      font-weight: 700;
      color: ${theme.palette.headingText || theme.palette.text};
    }

    .template5-item-sub {
      margin: 2px 0 0;
      font-size: 10.7px;
      line-height: 1.35;
      font-weight: 600;
      color: ${theme.palette.mutedText};
    }

    .template5-meta-row {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 10px;
      margin-top: 4px;
      font-size: 10.4px;
      line-height: 1.35;
      color: ${theme.palette.mutedText};
    }

    .template5-meta-row span:not(:last-child)::after {
      content: "•";
      margin-left: 10px;
      color: ${theme.palette.mutedText};
    }

    .template5-timeline {
      position: relative;
      padding-left: 14px;
    }

    .template5-timeline::before {
      content: "";
      position: absolute;
      left: 0;
      top: 2px;
      bottom: 2px;
      width: 2px;
      background: ${theme.palette.accent};
      border-radius: 999px;
    }

    .template5-date {
      float: right;
      margin-left: 10px;
      font-size: 10px;
      font-weight: 700;
      line-height: 1.35;
      color: ${theme.palette.mutedText};
    }

    .template5-project-tech {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 5px;
    }

    .template5-project-tech span {
      font-size: 9.6px;
      font-weight: 700;
      line-height: 1.15;
      color: ${theme.palette.accent};
      background: ${theme.palette.accentSoft};
      padding: 3px 6px;
      border-radius: 999px;
    }

    .template5-split-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 12px;
      align-items: start;
      min-width: 0;
    }

    .template5-section-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      align-items: stretch;
      min-width: 0;
      width: 100%;
    }

    .template5-section-grid-item {
      display: grid;
      align-content: start;
      min-width: 0;
      height: 100%;
    }

    .template5-section-grid-item .resume-section-content {
      display: grid;
      height: 100%;
    }

    .template5-section-grid-item .template5-sidebar-card {
      height: 100%;
    }

    .template5-section-grid-item-full {
      grid-column: 1 / -1;
    }

    @media (max-width: 900px) {
      .template5-section-grid {
        grid-template-columns: minmax(0, 1fr);
      }

      .template5-section-grid-item-full {
        grid-column: auto;
      }
    }
  `}</style>
);

const Template5Section = ({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) => {
  if (!children) return null;

  return (
    <section className={`resume-section break-inside-avoid${className ? ` ${className}` : ""}`}>
      <h2 className="template5-section-title resume-section-title">{title}</h2>
      <div className="resume-section-content">{children}</div>
    </section>
  );
};

const template5Render = (data: ResumeData) => {
  const theme = resolveTemplateTheme(5, data);
  const { summaryText, summaryTitle } = getSummaryConfig(data);
  const compactMode = getCompactMode(data);
  const densityMode = getDensityMode(data);
  const _fresherResume = isFresherResume(data);
  void _fresherResume;

  const experience = sortExperienceReverseChronological(data.experience || []);
  const education = sortEducationReverseChronological(data.education || []);
  const certifications = sortCertificationsReverseChronological(data.certifications || []);
  const contacts = getContactItems(data);

  const densityScale =
    densityMode === "comfortable" ? 1 : densityMode === "compact" ? 0.95 : 0.92;
  const typScale = theme.typographyScale || 1;
  const bodySize = Math.max(10.2, ResumeTypography.body * typScale * densityScale);
  const hasSectionGridContent =
    data.skills.length > 0 ||
    certifications.length > 0 ||
    data.languages.length > 0 ||
    (data.strengths || []).length > 0 ||
    (data.hobbies || []).length > 0;
  const pageStyle: CSSProperties = {
    fontFamily: theme.fontFamily || "Inter, Arial, Helvetica, sans-serif",
    ["--template5-body-size" as string]: `${bodySize.toFixed(2)}px`,
  };

  return (
    <div
      className="resume-theme-root resume-page sidebar-layout template5-page"
      style={pageStyle}
      data-density-mode={densityMode}
      data-compact-mode={compactMode ? "true" : "false"}
    >
      <Template5Styles theme={theme} />

      <div className="template5-shell" data-resume-content="true">
        <header style={{ display: "none" }} aria-hidden="true">
          {data.fullName}
        </header>
        <div className="template5-grid">
          <aside className="template5-sidebar">
            <section className="break-inside-avoid">
              <h1 className="template5-name">{data.fullName || "Your Name"}</h1>
              {hasText(data.role) ? <p className="template5-role">{data.role}</p> : null}
            </section>

            {contacts.length > 0 ? (
              <div className="template5-sidebar-card template5-contact-card break-inside-avoid">
                <div className="template5-contact-list">
                  {contacts.map((item, index) => (
                    <div key={`${item.label}-${item.value}-${index}`} className="template5-contact-row">
                      <span className="template5-contact-label">{item.label}</span>
                      <span className="template5-contact-value">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>

          <main className="template5-main">
            {hasText(summaryText) ? (
              <Template5Section title={summaryTitle}>
                <div className="template5-summary-card">
                  <p className="template5-body" style={{ margin: 0 }}>
                    {summaryText}
                  </p>
                </div>
              </Template5Section>
            ) : null}

            {experience.length > 0 ? (
              <Template5Section title="Professional Experience">
                <div className="template5-main-card template5-stack">
                  {experience.map((item, index) => (
                    <div key={`${item.company}-${item.role}-${index}`} className="template5-timeline">
                      <div className="template5-date">{formatRange(item.startDate, item.endDate)}</div>
                      <p className="template5-item-title">{item.role}</p>
                      {hasText(item.company) ? (
                        <p className="template5-item-sub">{item.company}</p>
                      ) : null}
                      {(toBulletItems(item.description) || []).length > 0 ? (
                        <ul
                          style={{
                            margin: "6px 0 0",
                            paddingLeft: "16px",
                            fontSize: "10.9px",
                            lineHeight: 1.45,
                            color: theme.palette.text,
                          }}
                        >
                          {toBulletItems(item.description).map((bullet, bulletIndex) => (
                            <li key={`${bullet}-${bulletIndex}`}>{bullet}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ))}
                </div>
              </Template5Section>
            ) : null}

            <div className="template5-split-grid">
              <div className="template5-main">
                {data.projects.length > 0 ? (
                  <Template5Section title="Projects">
                    <div className="template5-main-card template5-stack">
                      {data.projects.map((project, index) => (
                        <div key={`${project.name}-${index}`}>
                          <p className="template5-item-title">{project.name}</p>
                          {hasText(project.description) ? (
                            <p className="template5-item-text">{project.description}</p>
                          ) : null}
                          {project.technologies.length > 0 ? (
                            <div className="template5-project-tech">
                              {uniqueItems(project.technologies).map((tech, techIndex) => (
                                <span key={`${tech}-${techIndex}`}>{tech}</span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </Template5Section>
                ) : null}

                {(data.achievements || []).length > 0 ? (
                  <Template5Section title="Achievements">
                    <div className="template5-main-card">
                      <ul
                        style={{
                          margin: 0,
                          paddingLeft: "16px",
                          fontSize: "10.9px",
                          lineHeight: 1.45,
                          color: theme.palette.text,
                        }}
                      >
                        {(data.achievements || []).map((item, index) => (
                          <li key={`${item}-${index}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </Template5Section>
                ) : null}
              </div>

              <div className="template5-main">
                {education.length > 0 ? (
                  <Template5Section title="Education">
                    <div className="template5-main-card template5-stack">
                      {education.map((item, index) => (
                        <div key={`${item.school}-${item.degree}-${index}`}>
                          <p className="template5-item-title">{item.degree}</p>
                          {hasText(item.school) ? (
                            <p className="template5-item-sub">{item.school}</p>
                          ) : null}
                          {hasText(item.startYear) || hasText(item.endYear) || hasText(item.gpa) ? (
                            <div className="template5-meta-row">
                              {hasText(item.startYear) || hasText(item.endYear) ? (
                                <span>{formatRange(item.startYear, item.endYear)}</span>
                              ) : null}
                              {hasText(item.gpa) ? <span>GPA: {item.gpa}</span> : null}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </Template5Section>
                ) : null}

                {(data.references || []).length > 0 ? (
                  <Template5Section title="References">
                    <div className="template5-main-card template5-link-list">
                      {(data.references || []).map((item, index) => (
                        <div key={`${item}-${index}`} className="template5-body">
                          {item}
                        </div>
                      ))}
                    </div>
                  </Template5Section>
                ) : null}

                {(data.customSections || []).length > 0 ? (
                  <Template5Section title="Additional Information">
                    <div className="template5-main-card template5-stack">
                      {(data.customSections || []).map((section, index) => {
                        const validItems = (section.items || []).filter(Boolean);
                        if (!hasText(section.title) && !hasText(section.description) && validItems.length === 0) {
                          return null;
                        }

                        return (
                          <div key={`${section.title}-${index}`}>
                            {hasText(section.title) ? (
                              <p className="template5-item-title">{section.title}</p>
                            ) : null}
                            {hasText(section.description) ? (
                              <p className="template5-item-text">{section.description}</p>
                            ) : null}
                            {validItems.length > 0 ? (
                              <ul
                                style={{
                                  margin: "6px 0 0",
                                  paddingLeft: "16px",
                                  fontSize: "10.9px",
                                  lineHeight: 1.45,
                                  color: theme.palette.text,
                                }}
                              >
                                {validItems.map((item, itemIndex) => (
                                  <li key={`${item}-${itemIndex}`}>{item}</li>
                                ))}
                              </ul>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </Template5Section>
                ) : null}
              </div>
            </div>

            {hasSectionGridContent ? (
              <div className="template5-section-grid">
                {data.skills.length > 0 ? (
                  <Template5Section title="Skills" className="template5-section-grid-item">
                    <div className="template5-sidebar-card">
                      <div className="template5-chip-list">
                        {data.skills.map((skill, index) => (
                          <span key={`${skill}-${index}`} className="template5-chip template5-chip-skill">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Template5Section>
                ) : null}

                {certifications.length > 0 ? (
                  <Template5Section title="Certifications" className="template5-section-grid-item">
                    <div className="template5-sidebar-card template5-stack">
                      {certifications.map((cert, index) => (
                        <div key={`${cert.name}-${cert.issuer}-${index}`}>
                          <p className="template5-item-title">{cert.name}</p>
                          {hasText(cert.issuer) || hasText(cert.year) ? (
                            <p className="template5-item-sub">
                              {[cert.issuer, formatMonthYear(cert.year)].filter(Boolean).join(" • ")}
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </Template5Section>
                ) : null}

                {data.languages.length > 0 ? (
                  <Template5Section title="Languages" className="template5-section-grid-item">
                    <div className="template5-sidebar-card template5-mini-list">
                      {data.languages.map((lang, index) => (
                        <div key={`${lang.language}-${index}`} className="template5-body">
                          <strong>{lang.language}</strong>
                          {hasText(lang.level) ? (
                            <span style={{ color: theme.palette.mutedText }}> ({lang.level})</span>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </Template5Section>
                ) : null}

                {(data.strengths || []).length > 0 ? (
                  <Template5Section title="Strengths" className="template5-section-grid-item">
                    <div className="template5-sidebar-card">
                      <div className="template5-chip-list">
                        {(data.strengths || []).map((item, index) => (
                          <span key={`${item}-${index}`} className="template5-chip template5-chip-strength">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Template5Section>
                ) : null}

                {(data.hobbies || []).length > 0 ? (
                  <Template5Section
                    title="Interests"
                    className="template5-section-grid-item template5-section-grid-item-full"
                  >
                    <div className="template5-sidebar-card">
                      <div className="template5-chip-list">
                        {(data.hobbies || []).map((item, index) => (
                          <span key={`${item}-${index}`} className="template5-chip template5-chip-interest">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Template5Section>
                ) : null}
              </div>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
};

const Template5: React.FC<Template5Props> = ({ data }) => template5Render(data);

export default Template5;
