import React from "react";
import type { CSSProperties } from "react";
import { getSummaryConfig } from "./templatePolicy";
import {
  formatMonthYear,
  sortCertificationsReverseChronological,
  sortEducationReverseChronological,
  sortExperienceReverseChronological,
} from "./resumeSections";
import type { ResumeTemplateTheme } from "./templateThemeTypes";
import type { ResumeData } from "./types";
import { resolveTemplateTheme } from "./themeConfig";

interface Template3Props {
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
  return parts.join(" - ");
};

const getContactItems = (data: ResumeData) => {
  const items: { label: string; value: string; isLink?: boolean }[] = [];

  if (hasText(data.phone)) items.push({ label: "Mobile", value: data.phone });
  if (hasText(data.email)) items.push({ label: "Email ID", value: data.email, isLink: true });
  if (hasText(data.address)) items.push({ label: "Address", value: data.address });

  return items;
};

const Template3Styles = ({
  theme,
}: {
  theme: ResumeTemplateTheme;
}) => (
  <style>{`
    .template3-page,
    .template3-page * {
      box-sizing: border-box;
    }

    .template3-page {
      width: var(--resume-page-width, 794px);
      height: var(--resume-page-height, 1123px);
      min-height: var(--resume-page-height, 1123px);
      background: ${theme.palette.page};
      color: ${theme.palette.text};
      position: relative;
      overflow: visible;
      page-break-after: always;
      break-after: page;
      font-family: "Century Gothic", sans-serif;
    }

    .template3-sidebar-fill {
      position: absolute;
      left: 36px;
      top: 36px;
      bottom: 36px;
      width: 80px;
      min-height: calc(var(--resume-page-height, 1123px) - 72px);
      background: ${theme.palette.accent};
      z-index: 1;
      pointer-events: none;
    }

    .template3-shell {
      position: relative;
      z-index: 2;
      height: 100%;
      min-height: var(--resume-page-height, 1123px);
      padding: 36px 40px 36px 156px;
      background: transparent;
    }

    .resume-document-shell[data-render-mode="pdf"] .template3-page {
      height: var(--resume-page-height, 1123px) !important;
      min-height: var(--resume-page-height, 1123px) !important;
      position: relative !important;
    }

    .resume-document-shell[data-render-mode="pdf"] .template3-shell {
      height: var(--resume-page-height, 1123px) !important;
      min-height: var(--resume-page-height, 1123px) !important;
    }

    .resume-document-shell[data-render-mode="pdf"] .template3-sidebar-fill {
      top: 36px !important;
      bottom: 36px !important;
      height: auto !important;
      min-height: 0 !important;
    }

    .template3-header {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 320px;
      gap: 28px;
      align-items: start;
      padding: 6px 0 8px;
    }

    .template3-name {
      margin: 0;
      font-family: Arial, sans-serif;
      font-size: 24px;
      line-height: 1.02;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: ${theme.palette.nameText || theme.palette.text};
    }

    .template3-role {
      margin: 4px 0 0;
      font-family: Arial, sans-serif;
      font-size: 12pt;
      line-height: 1.1;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: ${theme.palette.titleText || theme.palette.mutedText};
    }

    .template3-contact {
      display: grid;
      gap: 2px;
      padding-top: 2px;
      font-family: Arial, sans-serif;
    }

    .template3-contact-row {
      display: grid;
      grid-template-columns: max-content minmax(0, 1fr);
      column-gap: 6px;
      align-items: start;
      font-size: 11pt;
      line-height: 1.35;
      color: ${theme.palette.mutedText};
    }

    .template3-contact-label {
      font-weight: 600;
      text-align: left;
      white-space: nowrap;
      word-break: normal;
      overflow-wrap: normal;
      flex-shrink: 0;
    }

    .template3-contact-value {
      font-weight: 400;
      min-width: 0;
      overflow-wrap: anywhere;
    }

    .template3-contact-link {
      text-decoration: underline;
    }

    .template3-body {
      display: grid;
      gap: 20px;
      margin-top: 10px;
    }

    .template3-section {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .template3-section-title {
      margin: 0 0 12px;
      font-family: Arial, sans-serif;
      font-size: 14pt;
      line-height: 1.2;
      font-weight: 700;
      text-transform: uppercase;
      color: ${theme.palette.headingText || theme.palette.text};
      letter-spacing: 0;
    }

    .template3-copy,
    .template3-meta,
    .template3-list {
      font-family: "Century Gothic", sans-serif;
      font-size: 11pt;
      line-height: 1.4;
      font-weight: 400;
      color: ${theme.palette.text};
    }

    .template3-copy {
      margin: 0;
    }

    .template3-meta-block + .template3-meta-block {
      margin-top: 14px;
    }

    .template3-item-title {
      margin: 0;
      font-family: Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.2;
      font-weight: 700;
      color: ${theme.palette.headingText || theme.palette.text};
    }

    .template3-item-subtitle,
    .template3-item-date {
      margin: 2px 0 0;
      font-family: "Century Gothic", sans-serif;
      font-size: 10.5pt;
      line-height: 1.4;
      font-weight: 400;
      color: ${theme.palette.mutedText};
    }

    .template3-item-body {
      margin-top: 5px;
    }

    .template3-list {
      list-style: disc outside !important;
      padding-left: 20px;
      margin-top: 6px;
      margin-bottom: 4px;
    }

    .template3-list li {
      display: list-item !important;
      margin-bottom: 2px;
      line-height: 1.4;
    }

    .template3-list-tight li {
      margin-bottom: 1px;
    }

    .template3-certification-item {
      color: ${theme.palette.text};
    }

    .template3-certification-title {
      font-family: Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.2;
      font-weight: 700;
      color: ${theme.palette.headingText || theme.palette.text};
    }

    .template3-certification-detail {
      font-family: "Century Gothic", sans-serif;
      font-size: 11pt;
      line-height: 1.4;
      font-weight: 400;
      color: ${theme.palette.text};
    }

    .template3-group-title {
      margin: 0 0 4px;
      font-family: Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.2;
      font-weight: 700;
      color: ${theme.palette.headingText || theme.palette.text};
    }

    .template3-divider {
      height: 1px;
      background: ${theme.palette.border};
      margin: 8px 0 0;
    }
  `}</style>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  if (!children) return null;

  return (
    <section className="resume-section template3-section break-inside-avoid">
      <h2 className="resume-section-title template3-section-title">{title}</h2>
      <div className="resume-section-content">{children}</div>
    </section>
  );
};

const BulletList = ({
  items,
  fallbackText,
  tight = false,
}: {
  items: string[];
  fallbackText?: string;
  tight?: boolean;
}) => {
  const filteredItems = items.filter(Boolean);

  if (filteredItems.length === 0) {
    return hasText(fallbackText) ? <p className="template3-copy">{fallbackText}</p> : null;
  }

  return (
    <ul className={`template3-list ${tight ? "template3-list-tight" : ""}`.trim()}>
      {filteredItems.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  );
};

const MetaBlock = ({
  title,
  subtitle,
  date,
  children,
}: {
  title: string;
  subtitle?: string;
  date?: string;
  children?: React.ReactNode;
}) => (
  <div className="template3-meta-block break-inside-avoid">
    <p className="template3-item-title">{title}</p>
    {hasText(subtitle) ? <p className="template3-item-subtitle">{subtitle}</p> : null}
    {hasText(date) ? <p className="template3-item-date">{date}</p> : null}
    {children ? <div className="template3-item-body">{children}</div> : null}
  </div>
);

const CertificationList = ({
  items,
}: {
  items: ResumeData["certifications"];
}) => (
  <ul className="template3-list template3-list-tight">
    {items.map((item, index) => {
      const detailParts = [item.issuer, formatMonthYear(item.year)]
        .filter(hasText)
        .join(", ");
      const credentialDetail = hasText(item.credentialId)
        ? `, ${item.credentialId}`
        : "";

      return (
        <li
          key={`${item.name}-${item.issuer}-${index}`}
          className="template3-certification-item"
        >
          <span className="template3-certification-title">{item.name}</span>
          {(detailParts || credentialDetail) ? (
            <span className="template3-certification-detail">
              {detailParts ? `, ${detailParts}` : ""}
              {credentialDetail}
            </span>
          ) : null}
        </li>
      );
    })}
  </ul>
);

const Template3: React.FC<Template3Props> = ({ data }) => {
  const theme = resolveTemplateTheme(3, data);
  const { summaryText, summaryTitle } = getSummaryConfig(data);
  const education = sortEducationReverseChronological(data.education || []);
  const experience = sortExperienceReverseChronological(data.experience || []);
  const certifications = sortCertificationsReverseChronological(data.certifications || []);
  const contacts = getContactItems(data);
  const skillsText = uniqueItems((data.skills || []).filter(Boolean)).join(", ");

  const pageStyle: CSSProperties = {
    ["--resume-page-width" as string]: "794px",
    ["--resume-page-height" as string]: "1123px",
  };

  return (
    <div className="resume-theme-root resume-page template3-page" style={pageStyle}>
      <Template3Styles theme={theme} />
      <div className="template3-sidebar-fill" aria-hidden="true" />

      <div className="template3-shell" data-resume-content="true">
        <header className="template3-header break-inside-avoid">
          <div>
            <h1 className="template3-name">{data.fullName || "Your Name"}</h1>
            {hasText(data.role) ? <p className="template3-role">{data.role}</p> : null}
          </div>

          {contacts.length > 0 ? (
            <div className="template3-contact">
              {contacts.map((item, index) => (
                <div key={`${item.label}-${item.value}-${index}`} className="template3-contact-row">
                  <span className="template3-contact-label">{item.label}:</span>
                  <span
                    className={`template3-contact-value ${item.isLink ? "template3-contact-link" : ""}`.trim()}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </header>

        <div className="template3-divider" />

        <div className="template3-body">
          {hasText(summaryText) ? (
            <Section title={summaryTitle}>
              <p className="template3-copy">{summaryText}</p>
            </Section>
          ) : null}

          {hasText(skillsText) ? (
            <Section title="Skills">
              <p className="template3-copy">{skillsText}</p>
            </Section>
          ) : null}

          {experience.length > 0 ? (
            <Section title="Work Experience">
              <div>
                {experience.map((item, index) => (
                  <MetaBlock
                    key={`${item.company}-${item.role}-${index}`}
                    title={item.role}
                    subtitle={item.company}
                    date={formatRange(item.startDate, item.endDate)}
                  >
                    <BulletList items={toBulletItems(item.description)} fallbackText={item.description} />
                  </MetaBlock>
                ))}
              </div>
            </Section>
          ) : null}

          {education.length > 0 ? (
            <Section title="Education">
              <div>
                {education.map((item, index) => (
                  <MetaBlock
                    key={`${item.school}-${item.degree}-${index}`}
                    title={item.degree}
                    subtitle={item.school}
                    date={formatRange(item.startYear, item.endYear)}
                  >
                    {hasText(item.gpa) ? <p className="template3-copy">GPA: {item.gpa}</p> : null}
                  </MetaBlock>
                ))}
              </div>
            </Section>
          ) : null}

          {(data.achievements || []).length > 0 ? (
            <Section title="Achievements">
              <BulletList items={data.achievements || []} />
            </Section>
          ) : null}

          {data.projects.length > 0 ? (
            <Section title="Projects">
              <div>
                {data.projects.map((project, index) => (
                  <MetaBlock
                    key={`${project.name}-${index}`}
                    title={project.name}
                    date={hasText(project.link) ? project.link : undefined}
                  >
                    {hasText(project.description) ? <p className="template3-copy">{project.description}</p> : null}
                    {project.technologies.length > 0 ? (
                      <p className="template3-copy">
                        <strong>Technologies:</strong> {uniqueItems(project.technologies).join(", ")}
                      </p>
                    ) : null}
                  </MetaBlock>
                ))}
              </div>
            </Section>
          ) : null}

          {certifications.length > 0 ? (
            <Section title="Certifications">
              <CertificationList items={certifications} />
            </Section>
          ) : null}

          {data.languages.length > 0 ? (
            <Section title="Languages">
              <BulletList
                items={data.languages.map((item) =>
                  hasText(item.level) ? `${item.language} (${item.level})` : item.language
                )}
                tight
              />
            </Section>
          ) : null}

          {(data.strengths || []).length > 0 ? (
            <Section title="Strengths">
              <p className="template3-copy">{uniqueItems(data.strengths || []).join(", ")}</p>
            </Section>
          ) : null}

          {(data.hobbies || []).length > 0 ? (
            <Section title="Hobbies & Interests">
              <p className="template3-copy">{uniqueItems(data.hobbies || []).join(", ")}</p>
            </Section>
          ) : null}

          {(data.references || []).length > 0 ? (
            <Section title="References">
              <BulletList items={data.references || []} tight />
            </Section>
          ) : null}

          {(data.customSections || []).length > 0 ? (
            <Section title="Additional Information">
              <div>
                {data.customSections.map((section, index) => {
                  const items = (section.items || []).filter(Boolean);
                  if (!hasText(section.title) && !hasText(section.description) && items.length === 0) {
                    return null;
                  }

                  return (
                    <div key={`${section.title}-${index}`} className="template3-meta-block break-inside-avoid">
                      {hasText(section.title) ? (
                        <p className="template3-group-title">{section.title}</p>
                      ) : null}
                      {hasText(section.description) ? (
                        <p className="template3-copy">{section.description}</p>
                      ) : null}
                      {items.length > 0 ? <BulletList items={items} tight /> : null}
                    </div>
                  );
                })}
              </div>
            </Section>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Template3;
