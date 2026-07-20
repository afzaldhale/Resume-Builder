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
  headingText?: string;
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

interface Template4Props {
  data: ResumeData;
}

const DEFAULT_SINGLE_ORDER: SectionKey[] = [
  "summary",
  "skills",
  "experience",
  "education",
  "certifications",
  "projects",
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
      return "Work Experience";
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
      return "Hobbies / Interests";
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
    className="resume-theme-root resume-page single-column template4-root"
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
    .template4-root,
    .template4-root * {
      box-sizing: border-box;
    }

    .template4-root {
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

    .template4-root p,
    .template4-root div,
    .template4-root span,
    .template4-root li {
      min-width: 0;
      max-width: 100%;
      white-space: normal;
      overflow-wrap: break-word;
      word-break: normal;
    }

    .template4-root a,
    .template4-long-text {
      color: inherit;
      overflow-wrap: anywhere;
      word-break: break-word;
      text-decoration: none;
    }

    .template4-page {
      display: flex;
      flex-direction: column;
      gap: var(--template4-section-gap, 22px);
      height: 100%;
      padding: var(--template4-page-padding, 42px 48px) !important;
    }

    .template4-header {
      display: grid;
      row-gap: 12px;
      padding-bottom: 18px;
      border-bottom: 1px solid var(--resume-border-strong);
    }

    .template4-name {
      margin: 0;
      font-size: var(--resume-name-size);
      line-height: ${ResumeTypography.lineHeight};
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--resume-name-color);
    }

    .template4-role {
      margin: 6px 0 0;
      font-size: var(--resume-role-size);
      line-height: ${ResumeTypography.lineHeight};
      font-weight: 600;
      color: var(--resume-role-color);
    }

    .template4-contact-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 16px;
    }

    .template4-contact-item {
      display: inline-flex;
      align-items: baseline;
      min-width: 0;
      color: var(--resume-muted-text);
      font-size: var(--resume-contact-size);
      line-height: ${ResumeTypography.lineHeight};
    }

    .template4-contact-label {
      font-weight: 700;
      color: var(--resume-page-text);
      margin-right: 5px;
    }

    .template4-main-flow {
      display: flex;
      flex-direction: column;
      gap: var(--template4-section-gap, 22px);
      min-width: 0;
    }

    .resume-section {
      display: grid;
      row-gap: 12px;
      min-width: 0;
      max-width: 100%;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .resume-section-title,
    .template4-section-title {
      display: block;
      margin: 0;
      padding-bottom: 6px;
      font-size: var(--resume-heading-size);
      line-height: ${ResumeTypography.lineHeight};
      font-weight: 700;
      letter-spacing: 0;
      color: var(--resume-page-text);
      border-bottom: 1px solid var(--resume-border);
    }

    .resume-section-content {
      min-width: 0;
      max-width: 100%;
      padding-left: var(--resume-section-content-indent, 16px);
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
      color: var(--resume-page-text);
    }

    .resume-item-meta {
      margin: 0;
      font-size: var(--resume-item-meta-size);
      line-height: ${ResumeTypography.lineHeight};
      color: var(--resume-muted-text);
    }

    .resume-summary-box {
      padding: 0;
      border: none;
      background: transparent;
    }

    .template4-summary-copy {
      font-size: 11px;
    }

    .template4-entry-list {
      display: grid;
      row-gap: 14px;
    }

    .template4-entry {
      display: grid;
      row-gap: 4px;
      break-inside: avoid;
      page-break-inside: avoid;
      min-width: 0;
    }

    .template4-bullet-heading {
      display: grid;
      grid-template-columns: 16px minmax(0, 1fr);
      align-items: start;
      column-gap: 8px;
    }

    .template4-bullet-marker {
      font-size: 14px;
      line-height: ${ResumeTypography.lineHeight};
      color: var(--resume-page-text);
      text-align: center;
      padding-top: 1px;
    }

    .template4-bullet-title {
      margin: 0;
      font-size: var(--resume-item-title-size);
      line-height: ${ResumeTypography.lineHeight};
      font-weight: 700;
      color: var(--resume-page-text);
    }

    .template4-detail-lines {
      display: grid;
      row-gap: 5px;
      padding-left: 24px;
      margin-top: 2px;
    }

    .template4-inline-meta {
      color: var(--resume-muted-text);
      font-size: var(--resume-item-meta-size);
      line-height: ${ResumeTypography.lineHeight};
    }

    .template4-skills,
    .template4-certification-line {
      color: var(--resume-page-text);
    }

    .template4-custom-copy {
      color: var(--resume-page-text);
    }

    @media (max-width: 680px) {
      .template4-contact-row {
        gap: 8px 12px;
      }
    }
  `}</style>
);

const Template4ContactRow = ({
  items,
}: {
  items: ContactItem[];
}) => {
  if (items.length === 0) return null;

  return (
    <div className="template4-contact-row">
      {items.map((item, index) => (
        <span key={`${item.label}-${item.value}-${index}`} className="template4-contact-item">
          <span className="template4-contact-label">{`${item.label}:`}</span>
          <span>{item.value}</span>
        </span>
      ))}
    </div>
  );
};

const Template4Section = ({
  title,
  children,
  forcePageBreakBefore = false,
}: {
  title: string;
  children: ReactNode;
  forcePageBreakBefore?: boolean;
}) => {
  if (!children) return null;

  return (
    <section
      className="resume-section"
      data-force-page-break-before={forcePageBreakBefore ? "true" : undefined}
    >
      <h2 className="resume-section-title template4-section-title">{title}</h2>
      <div className="resume-section-content">{children}</div>
    </section>
  );
};

const Template4BulletHeading = ({
  title,
}: {
  title: string;
}) => (
  <div className="template4-bullet-heading">
    <span aria-hidden="true" className="template4-bullet-marker">
      •
    </span>
    <p className="template4-bullet-title">{title}</p>
  </div>
);

const ResumeBulletList = ({
  items,
}: {
  items: string[];
}) => {
  const filteredItems = items.filter(Boolean);
  if (filteredItems.length === 0) return null;

  return (
    <div className="template4-detail-lines">
      {filteredItems.map((item, index) => (
        <p key={`${item}-${index}`} className="resume-body-copy">
          {item}
        </p>
      ))}
    </div>
  );
};

const SkillsBlock = ({
  items,
}: {
  items: string[];
}) => {
  const filteredItems = uniqueItems(items.filter(Boolean));
  if (filteredItems.length === 0) return null;

  return <p className="resume-body-copy template4-skills">{filteredItems.join(", ")}</p>;
};

const ResumeHeader = ({
  data,
  theme,
}: {
  data: ResumeData;
  theme: ResumeTemplateTheme;
}) => {
  const contactItems = getContactItems(data);

  return (
    <header className="template4-header">
      <div>
        <h1 className="template4-name">{data.fullName}</h1>
        {hasText(data.role) ? <p className="template4-role">{data.role}</p> : null}
      </div>
      {theme.showHeaderContact !== false && contactItems.length > 0 ? (
        <Template4ContactRow items={contactItems} />
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
        <p className="resume-body-copy template4-summary-copy">{summaryText}</p>
      </div>
    ) : null,
    skills: data.skills.length > 0 ? <SkillsBlock items={data.skills} /> : null,
    experience:
      experience.length > 0 ? (
        <div className="template4-entry-list">
          {experience.map((item, index) => (
            <article key={`${item.company}-${item.role}-${index}`} className="template4-entry">
              <p className="template4-bullet-title">
                {[item.role, item.company].filter(hasText).join(" at ") || "Experience"}
              </p>
              {hasText(formatRange(item.startDate, item.endDate)) ? (
                <p className="resume-item-meta">{formatRange(item.startDate, item.endDate)}</p>
              ) : null}
              {toBulletItems(item.description).length > 0 ? (
                <ul className="resume-bullet-list" style={{ margin: "6px 0 0", paddingLeft: "18px" }}>
                  {toBulletItems(item.description).map((detail, detailIndex) => (
                    <li key={`${detail}-${detailIndex}`} className="resume-body-copy">
                      {detail}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      ) : null,
    education:
      education.length > 0 ? (
        <div className="template4-entry-list">
          {education.map((item, index) => (
            <article key={`${item.school}-${item.degree}-${index}`} className="template4-entry">
              <Template4BulletHeading title={item.degree || item.school || "Education"} />
              <div className="template4-detail-lines">
                {hasText(item.school) ? <p className="resume-item-subtitle">{item.school}</p> : null}
                {hasText(formatRange(item.startYear, item.endYear)) ? (
                  <p className="resume-item-meta">{formatRange(item.startYear, item.endYear)}</p>
                ) : null}
                {hasText(item.gpa) ? <p className="resume-body-copy">{`GPA: ${item.gpa}`}</p> : null}
              </div>
            </article>
          ))}
        </div>
      ) : null,
    projects:
      data.projects.length > 0 ? (
        <div className="template4-entry-list">
          {data.projects.map((project, index) => (
            <article key={`${project.name}-${index}`} className="template4-entry">
              <p className="template4-bullet-title">{project.name}</p>
              <ul className="resume-bullet-list" style={{ margin: "6px 0 0", paddingLeft: "18px" }}>
                {hasText(project.description) ? (
                  <li className="resume-body-copy">{project.description}</li>
                ) : null}
                {project.technologies.length > 0 ? (
                  <li className="resume-body-copy">{`Technologies: ${uniqueItems(project.technologies).join(", ")}`}</li>
                ) : null}
              </ul>
              {hasText(project.link) ? <p className="resume-item-meta template4-long-text">{project.link}</p> : null}
            </article>
          ))}
        </div>
      ) : null,
    certifications:
      certifications.length > 0 ? (
        <div className="template4-entry-list">
          {certifications.map((item, index) => (
            <div key={`${item.name}-${item.issuer}-${index}`} className="template4-bullet-heading">
              <span aria-hidden="true" className="template4-bullet-marker">
                •
              </span>
              <p className="resume-body-copy template4-certification-line">
                {joinNonEmpty([item.name, item.issuer, formatMonthYear(item.year)], ", ")}
              </p>
            </div>
          ))}
        </div>
      ) : null,
    achievements:
      (data.achievements || []).length > 0 ? <ResumeBulletList items={data.achievements || []} /> : null,
    languages:
      data.languages.length > 0 ? (
        <SkillsBlock
          items={data.languages.map((item) =>
            hasText(item.level) ? `${item.language} (${item.level})` : item.language
          )}
        />
      ) : null,
    strengths: (data.strengths || []).length > 0 ? <SkillsBlock items={data.strengths || []} /> : null,
    hobbies: (data.hobbies || []).length > 0 ? <SkillsBlock items={data.hobbies || []} /> : null,
    references:
      (data.references || []).length > 0 ? <ResumeBulletList items={data.references || []} /> : null,
    custom:
      (data.customSections || []).length > 0 ? (
        <div className="template4-entry-list">
          {data.customSections.map((section, index) => {
            const hasItems = (section.items || []).length > 0;
            const hasDescription = hasText(section.description);

            if (!hasText(section.title) || (!hasDescription && !hasItems && !hasText(section.date))) {
              return null;
            }

            return (
              <article key={`${section.title}-${index}`} className="template4-entry">
                <Template4BulletHeading
                  title={joinNonEmpty([section.title, section.date], " - ") || section.title}
                />
                <div className="template4-detail-lines">
                  {hasDescription ? <p className="resume-body-copy template4-custom-copy">{section.description}</p> : null}
                  {hasItems
                    ? (section.items || []).map((item, itemIndex) => (
                        <p key={`${item}-${itemIndex}`} className="resume-body-copy">
                          {item}
                        </p>
                      ))
                    : null}
                </div>
              </article>
            );
          })}
        </div>
      ) : null,
  };

  return { sections, summaryTitle };
};

const template4Render = (data: ResumeData, theme: ResumeTemplateTheme) => {
  const { sections, summaryTitle } = buildSectionMap(data);
  const fresherResume = isFresherResume(data);
  const compactMode = getCompactMode(data);
  const densityMode = getDensityMode(data);
  const compactLevel = data.compactLevel || 0;
  const densityFactor =
    densityMode === "comfortable" ? 1 : densityMode === "compact" ? 0.92 : 0.86;
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
        ...({
          ["--resume-page-bg" as string]: theme.palette.page,
          ["--resume-page-text" as string]: theme.palette.text,
          ["--resume-muted-text" as string]: theme.palette.mutedText,
          ["--resume-border" as string]: theme.palette.border,
          ["--resume-border-strong" as string]: theme.palette.accent,
          ["--resume-name-color" as string]: theme.palette.nameText || theme.palette.text,
          ["--resume-role-color" as string]: theme.palette.titleText || theme.palette.mutedText,
          ...getStandardResumeTypographyVars(),
          ["--resume-font-family" as string]: theme.fontFamily || "Inter, Arial, Helvetica, sans-serif",
          ["--template4-page-padding" as string]: scalePxString(
            "42px 48px",
            densityFactor * baseSpacingFactor * compactSpacingFactor
          ),
          ["--template4-section-gap" as string]: `${sectionGap}px`,
        } as CSSProperties),
      }}
      data-density-mode={densityMode}
    >
      <ResumePageStyles />

      <div className="template4-page">
        <ResumeHeader data={data} theme={theme} />
        <div className="template4-main-flow">
          {sectionKeys.map((key) => {
            const content = sections[key];
            if (!content) return null;

            return (
              <Template4Section
                key={`template4-${key}`}
                title={getSectionLabel(key, summaryTitle)}
                forcePageBreakBefore={key === "hobbies"}
              >
                {content}
              </Template4Section>
            );
          })}
        </div>
      </div>
    </ResumePage>
  );
};

const Template4: React.FC<Template4Props> = ({ data }) =>
  template4Render(data, resolveTemplateTheme(4, data) as ResumeTemplateTheme);

export default Template4;
