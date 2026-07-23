import React, { type CSSProperties, type ReactNode } from "react";
import { getCompactMode, getDensityMode, getSummaryConfig } from "./templatePolicy";
import {
  formatMonthYear,
  sortCertificationsReverseChronological,
  sortEducationReverseChronological,
  sortExperienceReverseChronological,
} from "./resumeSections";
import type { ResumeData } from "./types";
import { getStandardResumeTypographyVars } from "@/constants/resumeDesignSystem";
import { resolveTemplateTheme } from "./themeConfig";

interface Palette {
  page: string;
  text: string;
  mutedText: string;
  accent: string;
  accentSoft: string;
  accentText: string;
  border: string;
  nameText?: string;
  titleText?: string;
  headingText?: string;
  accentBorder?: string;
  divider?: string;
  sidebarBg?: string;
  sidebarText?: string;
  sidebarMutedText?: string;
  sidebarBorder?: string;
  sidebarAccentSoft?: string;
  headerBg?: string;
}

interface ResumeTemplateTheme {
  name: string;
  layout: "single" | "two-column";
  headerLayout: "stacked" | "split";
  headingStyle: "bar" | "underline" | "accent";
  fontFamily?: string;
  palette: Palette;
  sectionSpacing?: number;
  pagePadding?: string;
  contentPadding?: string;
  mainPadding?: string;
  typographyScale?: number;
  spacingScale?: number;
}

interface ContactItem {
  label: string;
  value: string;
}

interface Template10Props {
  data: ResumeData;
}

const hasText = (value?: string | null) => Boolean(value && value.trim());

const toDisplayText = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (!value || typeof value !== "object") return "";

  const candidate = value as Record<string, unknown>;
  const joined = [
    candidate.name,
    candidate.degree,
    candidate.school,
    candidate.institution,
    candidate.issuer,
    candidate.company,
    candidate.role,
    candidate.email,
    candidate.phone,
    candidate.url,
    candidate.link,
    candidate.language,
    candidate.level,
    candidate.year,
    candidate.credentialId,
    candidate.description,
    candidate.value,
    candidate.label,
  ]
    .map((item) => (typeof item === "string" || typeof item === "number" ? String(item).trim() : ""))
    .filter(Boolean)
    .join(", ");

  return joined;
};

const toStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => toDisplayText(item)).filter(Boolean);
  }

  const singleValue = toDisplayText(value);
  return singleValue ? [singleValue] : [];
};

const uniqueItems = (items: unknown) => [...new Set(toStringArray(items))];

const toBulletItems = (value?: string[] | string | null) => {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => `${item ?? ""}`.split(/\r?\n/))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return (value || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const toLanguageItems = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      if (!item || typeof item !== "object") {
        return "";
      }

      const languageItem = item as Record<string, unknown>;
      const language = toDisplayText(languageItem.language);
      const level = toDisplayText(languageItem.level);

      if (!language) return "";
      return level ? `${language} (${level})` : language;
    })
    .filter(Boolean);
};

const toCertificationText = (item: unknown): string => {
  if (typeof item === "string") return item.trim();
  if (!item || typeof item !== "object") return "";

  const record = item as Record<string, unknown>;
  return [record.name, record.issuer, hasText(toDisplayText(record.year)) ? formatMonthYear(toDisplayText(record.year)) : ""]
    .map((part) => toDisplayText(part))
    .filter(Boolean)
    .join(", ");
};

const scalePxString = (value: string, factor: number) =>
  value.replace(/(\d+(?:\.\d+)?)px/g, (_, amount: string) => {
    const scaled = Math.max(8, Number.parseFloat(amount) * factor);
    return `${Math.round(scaled * 100) / 100}px`;
  });

const formatRange = (start?: string, end?: string) => {
  const parts = [formatMonthYear(start), formatMonthYear(end)].filter(Boolean);
  return parts.join(" - ");
};

const getSocialLabel = (platform?: string | null, url?: string | null) => {
  const normalizedPlatform = (platform || "").trim().toLowerCase();
  const normalizedUrl = (url || "").trim().toLowerCase();

  if (normalizedPlatform.includes("linkedin") || normalizedUrl.includes("linkedin.com")) {
    return "LinkedIn";
  }

  if (normalizedPlatform.includes("github") || normalizedUrl.includes("github.com")) {
    return "GitHub";
  }

  if (
    normalizedPlatform.includes("portfolio") ||
    normalizedPlatform.includes("website") ||
    normalizedPlatform.includes("personal") ||
    normalizedUrl.includes("portfolio")
  ) {
    return "Portfolio";
  }

  return platform || "Website";
};

const getContactItems = (data: ResumeData): ContactItem[] => {
  const items: ContactItem[] = [];

  if (hasText(data.address)) items.push({ label: "Location", value: data.address });
  if (hasText(data.email)) items.push({ label: "Email", value: data.email });
  if (hasText(data.phone)) items.push({ label: "Phone", value: data.phone });

  (data.socialLinks || []).forEach((link) => {
    if (hasText(link.url)) {
      items.push({ label: getSocialLabel(link.platform, link.url), value: link.url });
    }
  });

  return items;
};

const ResumePage = ({
  children,
  theme,
  style,
}: {
  children: ReactNode;
  theme: ResumeTemplateTheme;
  style?: CSSProperties;
}) => (
  <div
    className="resume-theme-root resume-page template10-root"
    style={{
      width: "794px",
      height: "1123px",
      background: theme.palette.page,
      color: theme.palette.text,
      position: "relative",
      overflow: "visible",
      border: `1px solid ${theme.palette.border}`,
      fontFamily: theme.fontFamily || "Georgia, 'Times New Roman', serif",
      margin: "0 auto",
      ...style,
    }}
  >
    {children}
  </div>
);

const ResumePageStyles = () => (
  <style>{`
    .template10-root,
    .template10-root * {
      box-sizing: border-box;
    }

    .template10-root {
      width: var(--resume-page-width);
      height: var(--resume-page-height);
      overflow: visible;
      page-break-after: always;
      break-after: page;
      background: var(--resume-page-bg);
      color: var(--resume-page-text);
      font-family: var(--resume-font-family, Georgia, 'Times New Roman', serif);
    }

    .template10-root p,
    .template10-root div,
    .template10-root span,
    .template10-root li {
      min-width: 0;
      max-width: 100%;
      white-space: normal;
      overflow-wrap: break-word;
      word-break: normal;
    }

    .template10-root a,
    .template10-long-text {
      color: inherit;
      text-decoration: none;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .template10-page {
      display: flex;
      flex-direction: column;
      height: 100%;
      gap: var(--template10-page-gap, 16px);
      padding: var(--template10-page-padding, 40px 36px);
    }

    .template10-header {
      display: grid;
      row-gap: 8px;
      text-align: center;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(15, 23, 42, 0.12);
    }

    .template10-name {
      margin: 0;
      font-size: var(--resume-name-size);
      line-height: 1.06;
      font-weight: 700;
      letter-spacing: 0;
      color: var(--resume-name-color);
      font-family: Georgia, "Times New Roman", serif;
    }

    .template10-role {
      margin: 0;
      font-size: var(--resume-role-size);
      line-height: 1.25;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--resume-role-color);
    }

    .template10-contact-line {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 4px 10px;
      margin: 0;
      color: var(--resume-muted-text);
      font-size: var(--resume-contact-size);
      line-height: 1.35;
    }

    .template10-contact-item {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .template10-contact-item:not(:last-child)::after {
      content: "|";
      color: var(--resume-muted-text);
    }

    .template10-body {
      display: flex;
      flex-direction: column;
      gap: var(--template10-section-gap, 14px);
      min-width: 0;
    }

    .template10-section {
      display: grid;
      row-gap: 6px;
      min-width: 0;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .template10-section-title {
      margin: 0;
      padding-bottom: 4px;
      font-size: var(--resume-heading-size);
      line-height: 1.2;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--resume-heading-color);
      border-bottom: 2px solid rgba(17, 24, 39, 0.72);
    }

    .template10-section-content {
      min-width: 0;
    }

    .template10-summary {
      margin: 0;
      font-size: var(--resume-body-size);
      line-height: 1.42;
      color: var(--resume-page-text);
    }

    .template10-entry-list {
      display: grid;
      row-gap: 14px;
    }

    .template10-entry {
      display: grid;
      row-gap: 3px;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .template10-entry-header {
      display: grid;
      grid-template-columns: minmax(0, 1fr) max-content;
      gap: 8px 16px;
      align-items: baseline;
    }

    .template10-entry-title {
      margin: 0;
      font-size: var(--resume-item-title-size);
      line-height: 1.3;
      font-weight: 700;
      color: var(--resume-page-text);
    }

    .template10-entry-subtitle {
      margin: 0;
      font-size: var(--resume-item-subtitle-size);
      line-height: 1.35;
      font-weight: 600;
      color: var(--resume-page-text);
    }

    .template10-entry-meta {
      margin: 0;
      font-size: var(--resume-item-meta-size);
      line-height: 1.35;
      color: var(--resume-muted-text);
      text-align: right;
      white-space: nowrap;
    }

    .template10-entry-copy {
      margin: 0;
      font-size: var(--resume-body-size);
      line-height: 1.42;
      color: var(--resume-page-text);
    }

    .template10-bullet-list {
      margin: 2px 0 0;
      padding-left: 18px;
      list-style-type: disc;
      list-style-position: outside;
    }

    .template10-bullet-list li + li {
      margin-top: 4px;
    }

    .template10-bullet-list li {
      font-size: var(--resume-body-size);
      line-height: 1.42;
      color: var(--resume-page-text);
    }

    .template10-inline-text {
      margin: 0;
      font-size: var(--resume-body-size);
      line-height: 1.42;
      color: var(--resume-page-text);
    }

    .template10-education-list {
      display: grid;
      row-gap: 12px;
    }

    .template10-custom-list {
      display: grid;
      row-gap: 12px;
    }
  `}</style>
);

const Template10Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  if (!children) return null;

  return (
    <section className="template10-section">
      <h2 className="template10-section-title">{title}</h2>
      <div className="template10-section-content">{children}</div>
    </section>
  );
};

const InlineValue = ({
  items,
}: {
  items: string[];
}) => {
  const filteredItems = uniqueItems(items.map((item) => item.trim()).filter(Boolean));
  if (filteredItems.length === 0) return null;

  return <p className="template10-inline-text">{filteredItems.join(", ")}</p>;
};

const BulletList = ({
  items,
}: {
  items: string[];
}) => {
  const filteredItems = items.map((item) => item.trim()).filter(Boolean);
  if (filteredItems.length === 0) return null;

  return (
    <ul className="template10-bullet-list">
      {filteredItems.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  );
};

const template10Render = (data: ResumeData, theme: ResumeTemplateTheme) => {
  const compactMode = getCompactMode(data);
  const densityMode = getDensityMode(data);
  const compactLevel = data.compactLevel || 0;
  const densityFactor = densityMode === "comfortable" ? 1 : densityMode === "compact" ? 0.9 : 0.84;
  const baseSpacingFactor = compactMode ? 0.94 : 1;
  const compactSpacingFactor = compactLevel === 1 ? 0.92 : compactLevel >= 2 ? 0.84 : 1;

  const clampPadding = (padding: string) => {
    try {
      const parts = padding.trim().split(/\s+/).map((part) => parseInt(part, 10) || 0);
      let vertical = parts.length === 4 ? parts[0] + parts[2] : parts[0] || 40;
      let horizontal = parts.length === 4 ? parts[1] + parts[3] : parts[1] || parts[0] || 36;
      vertical = Math.round(vertical / (parts.length === 4 ? 2 : 1));
      horizontal = Math.round(horizontal / (parts.length === 4 ? 2 : 1));
      vertical = Math.max(28, Math.min(42, vertical));
      horizontal = Math.max(28, Math.min(42, horizontal));
      return `${vertical}px ${horizontal}px`;
    } catch {
      return "40px 36px";
    }
  };

  const summaryText = getSummaryConfig(data).summaryText;
  const experience = sortExperienceReverseChronological(data.experience || []);
  const education = sortEducationReverseChronological(data.education || []);
  const certifications = sortCertificationsReverseChronological(data.certifications || []);
  const contactItems = getContactItems(data);
  const skills = uniqueItems(data.skills);
  const languages = toLanguageItems(data.languages);
  const strengths = uniqueItems(data.strengths);
  const hobbies = uniqueItems(data.hobbies);
  const achievements = uniqueItems(data.achievements);
  const references = uniqueItems(data.references);
  const projects = Array.isArray(data.projects) ? data.projects : [];
  const customSections = (data.customSections || []).filter(
    (section) =>
      hasText(section.title) ||
      hasText(section.description) ||
      hasText(section.date) ||
      (section.items || []).some((item) => hasText(item))
  );

  const sectionGap = Math.max(
    12,
    Math.min(
      16,
      Math.round((theme.sectionSpacing || 16) * densityFactor * baseSpacingFactor * compactSpacingFactor)
    )
  );

  const pagePadding = scalePxString(
    clampPadding(theme.pagePadding || theme.mainPadding || theme.contentPadding || "40px 36px"),
    densityFactor * baseSpacingFactor * compactSpacingFactor
  );

  return (
    <ResumePage
      theme={theme}
      style={{
        ...({
          "--resume-page-bg": "#FFFFFF",
          "--resume-page-text": "#2F3A4A",
          "--resume-muted-text": "#5E6A77",
          "--resume-border": "#D9DEE5",
          "--resume-heading-color": "#111827",
          "--resume-name-color": "#334155",
          "--resume-role-color": "#6B7280",
          "--template10-page-padding": pagePadding,
          "--template10-page-gap": `${sectionGap}px`,
          "--template10-section-gap": `${sectionGap}px`,
          ...getStandardResumeTypographyVars(),
          "--resume-font-family": "Georgia, 'Times New Roman', serif",
        } as CSSProperties),
      }}
    >
      <ResumePageStyles />

      <div className="template10-page">
        <header className="template10-header">
          <h1 className="template10-name">{data.fullName}</h1>
          {hasText(data.role) ? <p className="template10-role">{data.role}</p> : null}
          {contactItems.length > 0 ? (
            <div className="template10-contact-line">
              {contactItems.map((item, index) => (
                <span key={`${item.label}-${item.value}-${index}`} className="template10-contact-item">
                  <span className="template10-long-text">{item.value}</span>
                </span>
              ))}
            </div>
          ) : null}
        </header>

        <main className="template10-body">
          {hasText(summaryText) ? (
            <Template10Section title="Professional Summary">
              <p className="template10-summary">{summaryText}</p>
            </Template10Section>
          ) : null}

          {experience.length > 0 ? (
            <Template10Section title="Professional Experience">
              <div className="template10-entry-list">
                {experience.map((item, index) => (
                  <article key={`${item.company}-${item.role}-${index}`} className="template10-entry">
                    <div className="template10-entry-header">
                      <div>
                        <p className="template10-entry-title">{item.role || "Experience"}</p>
                        {hasText(item.company) ? (
                          <p className="template10-entry-subtitle">{item.company}</p>
                        ) : null}
                      </div>
                      {hasText(formatRange(item.startDate, item.endDate)) ? (
                        <p className="template10-entry-meta">{formatRange(item.startDate, item.endDate)}</p>
                      ) : null}
                    </div>
                    <BulletList items={toBulletItems(item.description)} />
                  </article>
                ))}
              </div>
            </Template10Section>
          ) : null}

          {projects.length > 0 ? (
            <Template10Section title="Projects">
              <div className="template10-entry-list">
                {projects.map((project, index) => (
                  <article key={`${project.name}-${index}`} className="template10-entry">
                    <p className="template10-entry-title">{project.name}</p>
                    {hasText(project.link) ? (
                      <p className="template10-entry-meta" style={{ textAlign: "left", whiteSpace: "normal" }}>
                        {project.link}
                      </p>
                    ) : null}
                    <BulletList
                      items={[
                        ...toBulletItems(project.description),
                        ...(uniqueItems((project as { technologies?: unknown }).technologies).length > 0
                          ? [`Technologies: ${uniqueItems((project as { technologies?: unknown }).technologies).join(", ")}`]
                          : []),
                      ]}
                    />
                  </article>
                ))}
              </div>
            </Template10Section>
          ) : null}

          {education.length > 0 ? (
            <Template10Section title="Education">
              <div className="template10-education-list">
                {education.map((item, index) => (
                  <article key={`${item.school}-${item.degree}-${index}`} className="template10-entry">
                    <div className="template10-entry-header">
                      <div>
                        <p className="template10-entry-title">{item.degree}</p>
                        {hasText(item.school) ? (
                          <p className="template10-entry-subtitle" style={{ fontWeight: 400 }}>
                            {item.school}
                          </p>
                        ) : null}
                      </div>
                      {hasText(formatRange(item.startYear, item.endYear)) ? (
                        <p className="template10-entry-meta">{formatRange(item.startYear, item.endYear)}</p>
                      ) : null}
                    </div>
                    {hasText(item.gpa) ? <p className="template10-entry-copy">GPA: {item.gpa}</p> : null}
                  </article>
                ))}
              </div>
            </Template10Section>
          ) : null}

          {certifications.length > 0 ? (
            <Template10Section title="Certifications">
              <BulletList items={certifications.map((item) => toCertificationText(item)).filter(Boolean)} />
            </Template10Section>
          ) : null}

          {skills.length > 0 ? (
            <Template10Section title="Skills">
              <InlineValue items={skills} />
            </Template10Section>
          ) : null}

          {languages.length > 0 ? (
            <Template10Section title="Languages">
              <InlineValue items={languages} />
            </Template10Section>
          ) : null}

          {strengths.length > 0 ? (
            <Template10Section title="Strengths">
              <BulletList items={strengths} />
            </Template10Section>
          ) : null}

          {hobbies.length > 0 ? (
            <Template10Section title="Hobbies">
              <BulletList items={hobbies} />
            </Template10Section>
          ) : null}

          {achievements.length > 0 ? (
            <Template10Section title="Achievements">
              <BulletList items={achievements} />
            </Template10Section>
          ) : null}

          {references.length > 0 ? (
            <Template10Section title="References">
              <BulletList items={references} />
            </Template10Section>
          ) : null}

          {customSections.length > 0 ? (
            <Template10Section title="Additional Information">
              <div className="template10-custom-list">
                {customSections.map((section, index) => (
                  <article key={`${section.title}-${index}`} className="template10-entry">
                    {hasText(section.title) ? (
                      <div className="template10-entry-header">
                        <p className="template10-entry-title">{section.title}</p>
                        {hasText(section.date) ? <p className="template10-entry-meta">{section.date}</p> : null}
                      </div>
                    ) : null}
                    {hasText(section.description) ? (
                      <p className="template10-entry-copy">{section.description}</p>
                    ) : null}
                    {(section.items || []).some((item) => hasText(item)) ? (
                      <BulletList items={(section.items || []).filter((item) => hasText(item)) as string[]} />
                    ) : null}
                  </article>
                ))}
              </div>
            </Template10Section>
          ) : null}
        </main>
      </div>
    </ResumePage>
  );
};

const Template10: React.FC<Template10Props> = ({ data }) =>
  template10Render(data, resolveTemplateTheme(10, data) as ResumeTemplateTheme);

export default Template10;
