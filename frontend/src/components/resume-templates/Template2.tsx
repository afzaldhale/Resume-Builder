import React, { type CSSProperties, type ReactNode } from "react";
import {
  ResumeTypography,
  getStandardResumeTypographyVars,
} from "@/constants/resumeDesignSystem";
import {
  formatMonthYear,
  getResumeSectionOrder,
  hasSectionData,
  isFresherResume,
  sortCertificationsReverseChronological,
  sortEducationReverseChronological,
  sortExperienceReverseChronological,
  type ResumeSectionKey,
} from "./resumeSections";
import { getCompactMode, getDensityMode, getSummaryConfig } from "./templatePolicy";
import { resolveTemplateTheme } from "./themeConfig";
import type { ResumeData } from "./types";

type SectionKey = Exclude<ResumeSectionKey, "header">;

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
}

interface ResumeTemplateTheme {
  fontFamily?: string;
  palette: Palette;
  mainSections?: SectionKey[];
  sectionSpacing?: number;
  typographyScale?: number;
  spacingScale?: number;
  showHeaderContact?: boolean;
}

interface ContactItem {
  label: string;
  value: string;
}

interface Template2Props {
  data: ResumeData;
}

const DEFAULT_SINGLE_ORDER: SectionKey[] = [
  "summary",
  "experience",
  "education",
  "projects",
  "skills",
  "certifications",
  "achievements",
  "languages",
  "strengths",
  "hobbies",
  "references",
  "custom",
];

const hasText = (value?: string | null) => Boolean(value && value.trim());

const toBulletItems = (value?: string[] | string | null) => {
  if (Array.isArray(value)) {
    return value.map((item) => item?.trim()).filter(Boolean) as string[];
  }

  return (value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
};

const uniqueItems = (items: string[]) => [...new Set(items.filter(Boolean))];

const joinNonEmpty = (parts: Array<string | null | undefined>, separator = " | ") =>
  parts.filter(hasText).join(separator);

const scalePxString = (value: string, factor: number) =>
  value.replace(/(\d+(?:\.\d+)?)px/g, (_, amount: string) => {
    const scaled = Math.max(8, Number.parseFloat(amount) * factor);
    return `${Math.round(scaled * 100) / 100}px`;
  });

const formatRange = (start?: string, end?: string) => {
  const parts = [formatMonthYear(start), formatMonthYear(end)].filter(Boolean);
  return parts.join(" - ");
};

const getContactItems = (data: ResumeData): ContactItem[] => {
  const items: ContactItem[] = [];

  if (hasText(data.phone)) items.push({ label: "Phone", value: data.phone });
  if (hasText(data.email)) items.push({ label: "Email", value: data.email });
  if (hasText(data.address)) items.push({ label: "Address", value: data.address });

  (data.socialLinks || []).forEach((link) => {
    if (!hasText(link.url)) return;
    items.push({
      label: hasText(link.platform) ? link.platform!.trim() : "Portfolio",
      value: link.url,
    });
  });

  return items;
};

const getSectionLabel = (key: SectionKey, summaryTitle: string) => {
  switch (key) {
    case "summary":
      return summaryTitle;
    case "skills":
      return "Skills";
    case "experience":
      return "Experience";
    case "education":
      return "Education";
    case "projects":
      return "Projects";
    case "certifications":
      return "Certifications";
    case "achievements":
      return "Achievements";
    case "languages":
      return "Languages";
    case "strengths":
      return "Strengths";
    case "hobbies":
      return "Interests";
    case "references":
      return "References";
    case "custom":
      return "Additional Information";
    default:
      return "";
  }
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
    className="resume-theme-root resume-page single-column template2-root"
    style={{
      width: "794px",
      height: "1123px",
      background: theme.palette.page,
      color: theme.palette.text,
      position: "relative",
      overflow: "visible",
      border: "none",
      boxShadow: "none",
      fontFamily: theme.fontFamily || "var(--resume-font-family, Inter, Arial, Helvetica, sans-serif)",
      margin: "0 auto",
      ...style,
    }}
  >
    {children}
  </div>
);

const ResumePageStyles = () => (
  <style>{`
    .template2-root,
    .template2-root * {
      box-sizing: border-box;
    }

    .template2-root {
      width: var(--resume-page-width);
      height: var(--resume-page-height);
      overflow: visible;
      page-break-after: always;
      break-after: page;
      background: var(--resume-page-bg);
      color: var(--resume-page-text);
      font-family: var(--resume-font-family, Inter, Arial, Helvetica, sans-serif);
      line-height: var(--resume-line-height, 1.5);
    }

    .template2-root p,
    .template2-root div,
    .template2-root span,
    .template2-root li {
      min-width: 0;
      max-width: 100%;
      white-space: normal;
      overflow-wrap: break-word;
      word-break: normal;
    }

    .template2-root a {
      color: inherit;
      text-decoration: none;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .template2-page {
      display: flex;
      flex-direction: column;
      gap: var(--template2-section-gap, 22px);
      height: 100%;
      padding: var(--template2-page-padding, 40px 44px) !important;
    }

    .template2-header {
      display: grid;
      row-gap: 14px;
      padding: 0 0 20px;
      border-bottom: 1px solid var(--resume-border-strong);
    }

    .template2-name-block {
      display: grid;
      row-gap: 6px;
    }

    .template2-header-name {
      margin: 0;
      font-size: var(--resume-name-size);
      line-height: ${ResumeTypography.lineHeight};
      font-weight: 800;
      letter-spacing: -0.03em;
      color: var(--resume-name-color);
    }

    .template2-header-role {
      margin: 0;
      font-size: var(--resume-role-size);
      line-height: ${ResumeTypography.lineHeight};
      font-weight: 600;
      color: var(--resume-role-color);
    }

    .template2-contact-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .template2-contact-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
      padding: 6px 10px;
      border: 1px solid var(--resume-chip-border);
      border-radius: 999px;
      background: var(--resume-chip-bg);
      color: var(--resume-chip-text);
    }

    .template2-contact-label {
      font-size: var(--resume-contact-size);
      line-height: ${ResumeTypography.lineHeight};
      font-weight: 700;
      color: var(--resume-page-text);
    }

    .template2-contact-value {
      font-size: var(--resume-contact-size);
      line-height: ${ResumeTypography.lineHeight};
      color: var(--resume-muted-text);
    }

    .template2-main-flow {
      display: flex;
      flex-direction: column;
      gap: var(--template2-section-gap, 22px);
      min-width: 0;
    }

    .resume-section {
      display: grid;
      row-gap: 12px;
      min-width: 0;
      max-width: 100%;
    }

    .resume-section-title,
    .template2-section-title {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      font-size: var(--resume-heading-size);
      line-height: ${ResumeTypography.lineHeight};
      font-weight: 700;
      letter-spacing: 0;
      color: var(--resume-page-text);
    }

    .resume-section-title::after,
    .template2-section-title::after {
      content: "";
      flex: 1 1 auto;
      height: 1px;
      background: var(--resume-border);
    }

    .resume-section-content {
      min-width: 0;
      max-width: 100%;
    }

    .resume-body-copy {
      margin: 0;
      font-size: var(--resume-body-size);
      line-height: var(--resume-line-height, 1.5);
      color: var(--resume-page-text);
    }

    .resume-item-title {
      margin: 0;
      font-size: var(--resume-item-title-size);
      line-height: ${ResumeTypography.lineHeight};
      font-weight: 700;
      color: var(--resume-page-text);
    }

    .resume-item-subtitle {
      margin: 0;
      font-size: var(--resume-item-subtitle-size);
      line-height: ${ResumeTypography.lineHeight};
      font-weight: 600;
      color: var(--resume-muted-text);
    }

    .resume-item-meta {
      margin: 0;
      font-size: var(--resume-item-meta-size);
      line-height: ${ResumeTypography.lineHeight};
      color: var(--resume-muted-text);
    }

    .resume-summary-box {
      padding: 16px 18px;
      border: 1px solid var(--resume-border);
      border-radius: 18px;
      background: var(--resume-summary-bg);
    }

    .template2-entry-list {
      display: grid;
      row-gap: 16px;
    }

    .template2-entry,
    .resume-meta-block {
      display: grid;
      row-gap: 8px;
      padding: 14px 16px;
      border: 1px solid var(--resume-border);
      border-radius: 18px;
      background: var(--resume-card-bg);
      break-inside: avoid;
      page-break-inside: avoid;
      min-width: 0;
    }

    .template2-entry-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }

    .template2-entry-title-block {
      min-width: 0;
      display: grid;
      row-gap: 4px;
    }

    .template2-entry-meta {
      flex: 0 0 auto;
      white-space: nowrap;
      text-align: right;
      padding-top: 2px;
    }

    .resume-bullet-list {
      margin: 0;
      padding-left: 18px;
      font-size: var(--resume-list-size);
      line-height: var(--resume-line-height, 1.5);
      color: var(--resume-page-text);
    }

    .resume-bullet-list li + li {
      margin-top: 5px;
    }

    .template2-inline-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .template2-tag {
      display: inline-flex;
      align-items: center;
      padding: 5px 10px;
      border-radius: 999px;
      border: 1px solid var(--resume-chip-border);
      background: var(--resume-chip-bg);
      font-size: var(--resume-body-size);
      line-height: ${ResumeTypography.lineHeight};
      color: var(--resume-chip-text);
    }

    .template2-tech {
      margin: 0;
      font-size: var(--resume-item-meta-size);
      line-height: ${ResumeTypography.lineHeight};
      color: var(--resume-muted-text);
    }

    .template2-certification-line {
      margin: 0;
      font-size: var(--resume-body-size);
      line-height: var(--resume-line-height, 1.5);
      color: var(--resume-page-text);
    }

    @media (max-width: 680px) {
      .template2-entry-header {
        flex-direction: column;
        gap: 6px;
      }

      .template2-entry-meta {
        white-space: normal;
        text-align: left;
      }
    }
  `}</style>
);

const Template2TagList = ({
  items,
}: {
  items: string[];
}) => {
  const filteredItems = uniqueItems(items.filter(Boolean));
  if (filteredItems.length === 0) return null;

  return (
    <div className="template2-inline-list">
      {filteredItems.map((item, index) => (
        <span key={`${item}-${index}`} className="template2-tag">
          {item}
        </span>
      ))}
    </div>
  );
};

const ResumeBulletList = ({
  items,
}: {
  items: string[];
}) => {
  const filteredItems = items.filter(Boolean);
  if (filteredItems.length === 0) return null;

  return (
    <ul className="resume-bullet-list">
      {filteredItems.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  );
};

const Template2ContactList = ({
  items,
}: {
  items: ContactItem[];
}) => {
  if (items.length === 0) return null;

  return (
    <div className="template2-contact-list">
      {items.map((item, index) => (
        <div key={`${item.label}-${item.value}-${index}`} className="template2-contact-pill">
          <span className="template2-contact-label">{item.label}</span>
          <span className="template2-contact-value">{item.value}</span>
        </div>
      ))}
    </div>
  );
};

const Template2Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  if (!children) return null;

  return (
    <section className="resume-section break-inside-avoid">
      <h2 className="resume-section-title template2-section-title">{title}</h2>
      <div className="resume-section-content">{children}</div>
    </section>
  );
};

const Template2Entry = ({
  title,
  subtitle,
  meta,
  children,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  children?: ReactNode;
}) => (
  <article className="resume-meta-block template2-entry">
    <div className="template2-entry-header">
      <div className="template2-entry-title-block">
        <h3 className="resume-item-title">{title}</h3>
        {subtitle ? <p className="resume-item-subtitle">{subtitle}</p> : null}
      </div>
      {meta ? <p className="resume-item-meta template2-entry-meta">{meta}</p> : null}
    </div>
    {children}
  </article>
);

const ResumeHeader = ({
  data,
  theme,
}: {
  data: ResumeData;
  theme: ResumeTemplateTheme;
}) => {
  const contactItems = getContactItems(data);

  return (
    <header className="template2-header break-inside-avoid">
      <div className="template2-name-block">
        <h1 className="template2-header-name">{data.fullName}</h1>
        {hasText(data.role) ? <p className="template2-header-role">{data.role}</p> : null}
      </div>
      {theme.showHeaderContact !== false && contactItems.length > 0 ? (
        <Template2ContactList items={contactItems} />
      ) : null}
    </header>
  );
};

const buildSectionMap = (data: ResumeData) => {
  const { summaryText, summaryTitle } = getSummaryConfig(data);
  const experience = sortExperienceReverseChronological(data.experience || []);
  const education = sortEducationReverseChronological(data.education || []);
  const certifications = sortCertificationsReverseChronological(data.certifications || []);

  const sections: Record<SectionKey, ReactNode> = {
    summary: hasText(summaryText) ? (
      <div className="resume-summary-box">
        <p className="resume-body-copy">{summaryText}</p>
      </div>
    ) : null,
    skills: data.skills.length > 0 ? <Template2TagList items={data.skills} /> : null,
    experience:
      experience.length > 0 ? (
        <div className="template2-entry-list">
          {experience.map((item, index) => (
            <Template2Entry
              key={`${item.company}-${item.role}-${index}`}
              title={item.role || item.company || "Experience"}
              subtitle={item.company || undefined}
              meta={formatRange(item.startDate, item.endDate)}
            >
              <ResumeBulletList items={toBulletItems(item.description as string | string[] | null | undefined)} />
            </Template2Entry>
          ))}
        </div>
      ) : null,
    education:
      education.length > 0 ? (
        <div className="template2-entry-list">
          {education.map((item, index) => (
            <Template2Entry
              key={`${item.school}-${item.degree}-${index}`}
              title={item.degree || item.school || "Education"}
              subtitle={item.school || undefined}
              meta={formatRange(item.startYear, item.endYear)}
            >
              {hasText(item.gpa) ? <p className="resume-body-copy">{`GPA: ${item.gpa}`}</p> : null}
            </Template2Entry>
          ))}
        </div>
      ) : null,
    projects:
      data.projects.length > 0 ? (
        <div className="template2-entry-list">
          {data.projects.map((project, index) => (
            <Template2Entry key={`${project.name}-${index}`} title={project.name}>
              {toBulletItems(project.description).length > 0 ? (
                <ResumeBulletList items={toBulletItems(project.description)} />
              ) : null}
              {(project.technologies || []).length > 0 ? (
                <p className="template2-tech">{`Technologies: ${uniqueItems(project.technologies || []).join(", ")}`}</p>
              ) : null}
            </Template2Entry>
          ))}
        </div>
      ) : null,
    certifications:
      certifications.length > 0 ? (
        <div className="template2-entry-list">
          {certifications.map((item, index) => (
            <article key={`${item.name}-${item.issuer}-${index}`} className="resume-meta-block template2-entry">
              <p className="template2-certification-line">
                {joinNonEmpty([item.name, item.issuer, formatMonthYear(item.year)], ", ")}
              </p>
            </article>
          ))}
        </div>
      ) : null,
    achievements:
      (data.achievements || []).length > 0 ? <ResumeBulletList items={data.achievements || []} /> : null,
    languages:
      data.languages.length > 0 ? (
        <Template2TagList
          items={data.languages.map((item) =>
            hasText(item.level) ? `${item.language} • ${item.level}` : item.language
          )}
        />
      ) : null,
    strengths:
      (data.strengths || []).length > 0 ? <Template2TagList items={data.strengths || []} /> : null,
    hobbies:
      (data.hobbies || []).length > 0 ? <Template2TagList items={data.hobbies || []} /> : null,
    references:
      (data.references || []).length > 0 ? <ResumeBulletList items={data.references || []} /> : null,
    custom:
      (data.customSections || []).length > 0 ? (
        <div className="template2-entry-list">
          {data.customSections.map((section, index) => {
            const hasItems = (section.items || []).length > 0;
            const hasDescription = hasText(section.description);

            if (!hasText(section.title) || (!hasDescription && !hasItems && !hasText(section.date))) {
              return null;
            }

            return (
              <Template2Entry key={`${section.title}-${index}`} title={section.title} meta={section.date}>
                {hasDescription ? <p className="resume-body-copy">{section.description}</p> : null}
                {hasItems ? <ResumeBulletList items={section.items || []} /> : null}
              </Template2Entry>
            );
          })}
        </div>
      ) : null,
  };

  return { sections, summaryTitle };
};

const template2Render = (data: ResumeData, theme: ResumeTemplateTheme) => {
  const { sections, summaryTitle } = buildSectionMap(data);
  const fresherResume = isFresherResume(data);
  const compactMode = getCompactMode(data);
  const densityMode = getDensityMode(data);
  const compactLevel = data.compactLevel || 0;
  const densityFactor =
    densityMode === "comfortable" ? 1 : densityMode === "compact" ? 0.94 : 0.88;
  const baseSpacingFactor = compactMode ? 0.95 : 1;
  const compactSpacingFactor = compactLevel === 1 ? 0.92 : compactLevel >= 2 ? 0.84 : 1;
  const rawGap = Math.round(
    (theme.sectionSpacing || 20) *
      densityFactor *
      baseSpacingFactor *
      compactSpacingFactor *
      (theme.spacingScale || 1)
  );
  const sectionGap = Math.max(18, Math.min(24, rawGap));

  const fresherSectionKeys = [
    ...getResumeSectionOrder("fresher").filter((key): key is SectionKey => key !== "header"),
    "projects" as SectionKey,
    "achievements" as SectionKey,
    "references" as SectionKey,
    "custom" as SectionKey,
  ].filter((key, index, items) => items.indexOf(key) === index && hasSectionData(key as ResumeSectionKey, data));

  const sectionKeys = fresherResume
    ? fresherSectionKeys
    : (theme.mainSections || DEFAULT_SINGLE_ORDER).filter((key) => hasSectionData(key, data));

  return (
    <ResumePage
      theme={theme}
      style={{
        ["--resume-page-bg" as string]: theme.palette.page,
        ["--resume-page-text" as string]: theme.palette.text,
        ["--resume-muted-text" as string]: theme.palette.mutedText,
        ["--resume-border" as string]: theme.palette.border,
        ["--resume-border-strong" as string]: theme.palette.accent,
        ["--resume-name-color" as string]: theme.palette.nameText || theme.palette.text,
        ["--resume-role-color" as string]: theme.palette.titleText || theme.palette.mutedText,
        ["--resume-summary-bg" as string]: theme.palette.accentSoft || "rgba(0,0,0,0.03)",
        ["--resume-card-bg" as string]: theme.palette.page,
        ["--resume-chip-bg" as string]: theme.palette.accentSoft || "rgba(0,0,0,0.03)",
        ["--resume-chip-border" as string]: theme.palette.border,
        ["--resume-chip-text" as string]: theme.palette.text,
        ...getStandardResumeTypographyVars(),
        ["--resume-font-family" as string]: theme.fontFamily || "Inter, Arial, Helvetica, sans-serif",
        ["--template2-page-padding" as string]: scalePxString(
          "40px 44px",
          densityFactor * baseSpacingFactor * compactSpacingFactor
        ),
        ["--template2-section-gap" as string]: `${sectionGap}px`,
      }}
      data-density-mode={densityMode}
    >
      <ResumePageStyles />

      <div className="template2-page">
        <ResumeHeader data={data} theme={theme} />
        <div className="template2-main-flow">
          {sectionKeys.map((key) => {
            const content = sections[key];
            if (!content) return null;

            return (
              <Template2Section key={`template2-${key}`} title={getSectionLabel(key, summaryTitle)}>
                {content}
              </Template2Section>
            );
          })}
        </div>
      </div>
    </ResumePage>
  );
};

const Template2: React.FC<Template2Props> = ({ data }) =>
  template2Render(data, resolveTemplateTheme(2, data) as ResumeTemplateTheme);

export default Template2;
