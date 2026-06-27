import React, { type CSSProperties, type ReactNode } from "react";
import { getCompactMode, getDensityMode, getSummaryConfig } from "./templatePolicy";
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
import type { ResumeData } from "./types";
import { ResumeSection } from "@/components/resume/ResumeSection";
import { ResumeTypography } from "@/constants/resumeDesignSystem";
import { templateThemes } from "./templateThemes";

type HeadingStyle = "bar" | "underline" | "accent";
type HeaderLayout = "stacked" | "split";
type SidebarTone = "dark" | "light";
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
  headerLayout: HeaderLayout;
  headingStyle: HeadingStyle;
  fontFamily?: string;
  palette: Palette;
  sidebarWidth?: string;
  sidebarTone?: SidebarTone;
  sidebarSections?: SectionKey[];
  mainSections?: SectionKey[];
  sectionSpacing?: number;
  pagePadding?: string;
  contentPadding?: string;
  sidebarPadding?: string;
  mainPadding?: string;
  layoutType?: "single-column" | "sidebar";
  headingVariant?: "full-width-bar" | "label-bar" | "underline" | "plain";
  headingInset?: boolean;
  typographyScale?: number;
  spacingScale?: number;
  headerDivider?: boolean;
  headerBand?: boolean;
  topAccentBar?: boolean;
  leftAccentLine?: boolean;
  summaryInHeader?: boolean;
  summaryStyle?: "boxed" | "plain";
  sidebarMode?: "profile" | "contact-only";
  sidebarHeading?: string;
  fresherMainSections?: SectionKey[];
  showHeaderContact?: boolean;
}

interface ContactItem {
  label: string;
  value: string;
}

interface Template6Props {
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

const DEFAULT_EXPERIENCED_SIDEBAR: SectionKey[] = [
  "skills",
  "certifications",
  "languages",
  "strengths",
  "hobbies",
];

const DEFAULT_EXPERIENCED_MAIN: SectionKey[] = [
  "summary",
  "experience",
  "education",
  "projects",
  "achievements",
  "references",
  "custom",
];

const DEFAULT_FRESHER_SIDEBAR: SectionKey[] = ["languages", "strengths", "hobbies"];
const DEFAULT_FRESHER_MAIN: SectionKey[] = [
  "summary",
  "skills",
  "experience",
  "education",
  "certifications",
  "strengths",
  "hobbies",
];

const hasText = (value?: string | null) => Boolean(value && value.trim());

const toBulletItems = (value?: string | null) =>
  (value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const buildCertificationBullets = ({
  issuer,
  year,
  credentialId,
}: {
  issuer?: string | null;
  year?: string | null;
  credentialId?: string | null;
}) => {
  const items: string[] = [];
  if (hasText(issuer)) items.push(`Issued by: ${issuer}`);
  if (hasText(year)) items.push(`Completed: ${formatMonthYear(year)}`);
  if (hasText(credentialId)) items.push(`Credential ID: ${credentialId}`);
  return items;
};

const uniqueItems = (items: string[]) => [...new Set(items.filter(Boolean))];

const normalizeListEntries = (value?: string[] | string | null) => {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => `${item ?? ""}`.split(/\r?\n|,/))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
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

const getContactItems = (data: ResumeData): ContactItem[] => {
  const items: ContactItem[] = [];

  if (hasText(data.phone)) items.push({ label: "Phone", value: data.phone });
  if (hasText(data.email)) items.push({ label: "Email", value: data.email });
  if (hasText(data.address)) items.push({ label: "Location", value: data.address });

  (data.socialLinks || []).forEach((link) => {
    if (hasText(link.url)) {
      const label = link.platform?.toLowerCase().includes("linkedin") ? "LinkedIn" : link.platform || "Website";
      items.push({ label, value: link.url });
    }
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

const ResumeSidebarContactCard = ({
  data,
  theme,
  compactMode = false,
}: {
  data: ResumeData;
  theme: ResumeTemplateTheme;
  compactMode?: boolean;
}) => {
  const items = getContactItems(data);

  if (items.length === 0) return null;

  return (
    <section
      className="break-inside-avoid"
      style={{
        marginTop: "0",
      }}
    >
      <h2
        className="resume-heading"
        style={{
          color: theme.palette.sidebarText || theme.palette.text,
          marginBottom: "8px",
          fontSize: compactMode ? "17px" : "19px",
          letterSpacing: "0.14em",
        }}
      >
        {theme.sidebarHeading || "Contact"}
      </h2>
      <div
        style={{
          width: "100%",
          height: "1px",
          background: theme.palette.divider || theme.palette.sidebarBorder || "rgba(255,255,255,0.28)",
          marginBottom: "8px",
        }}
      />
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={`${item.label}-${item.value}-${index}`} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              style={{
                color: theme.palette.sidebarMutedText || theme.palette.sidebarText || theme.palette.mutedText,
                fontSize: "1rem",
                lineHeight: "1.2",
                minWidth: "20px",
              }}
            >
              {item.label === "Phone" ? "☎" : item.label === "Email" ? "✉" : item.label === "Location" ? "📍" : "🔗"}
            </span>
            <div className="space-y-0">
              <p
                style={{
                  fontSize: compactMode ? "12px" : "13px",
                  lineHeight: "var(--resume-line-height)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: theme.palette.sidebarMutedText || theme.palette.sidebarText || theme.palette.mutedText,
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  fontSize: compactMode ? "13px" : "14.5px",
                  lineHeight: "1.45",
                  color: theme.palette.sidebarText || theme.palette.text,
                  wordBreak: "break-word",
                }}
              >
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
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
    skills: data.skills.length > 0 ? <ResumeTagList items={data.skills} /> : null,
    experience:
      experience.length > 0 ? (
        <div className="space-y-3.5">
          {experience.map((item, index) => (
            <ResumeMetaBlock
              key={`${item.company}-${item.role}-${index}`}
              title={item.role}
              subtitle={item.company}
              meta={formatRange(item.startDate, item.endDate)}
            >
              <ResumeBulletList items={toBulletItems(item.description)} fallbackText={item.description} />
            </ResumeMetaBlock>
          ))}
        </div>
      ) : null,
    education:
      education.length > 0 ? (
        <div className="space-y-2.5">
          {education.map((item, index) => (
            <ResumeEducationBlock
              key={`${item.school}-${item.degree}-${index}`}
              title={item.degree}
              school={item.school}
              date={formatRange(item.startYear, item.endYear)}
              gpa={item.gpa}
            />
          ))}
        </div>
      ) : null,
    projects:
      data.projects.length > 0 ? (
        <div className="space-y-3.5">
          {data.projects.map((project, index) => (
            <ResumeMetaBlock
              key={`${project.name}-${index}`}
              title={project.name}
              meta={hasText(project.link) ? project.link : undefined}
            >
              <ResumeBulletList
                items={toBulletItems(project.description)}
                fallbackText={project.description}
              />
              {project.technologies.length > 0 ? (
                <p className="resume-item-meta mt-2">{uniqueItems(project.technologies).join(", ")}</p>
              ) : null}
            </ResumeMetaBlock>
          ))}
        </div>
      ) : null,
    certifications:
      certifications.length > 0 ? (
        <div className="space-y-3">
          {certifications.map((item, index) => (
            <ResumeMetaBlock
              key={`${item.name}-${item.issuer}-${index}`}
              title={item.name}
            >
              <ResumeBulletList
                items={buildCertificationBullets({
                  issuer: item.issuer,
                  year: item.year,
                  credentialId: item.credentialId,
                })}
              />
            </ResumeMetaBlock>
          ))}
        </div>
      ) : null,
    achievements:
      (data.achievements || []).length > 0 ? <ResumeBulletList items={data.achievements || []} /> : null,
    languages:
      data.languages.length > 0 ? (
        <ResumeTagList
          items={data.languages.map((item) =>
            hasText(item.level) ? `${item.language} (${item.level})` : item.language
          )}
        />
      ) : null,
    strengths:
      normalizeListEntries(data.strengths).length > 0 ? (
        <ResumeParagraphList items={normalizeListEntries(data.strengths)} />
      ) : null,
    hobbies:
      normalizeListEntries(data.hobbies).length > 0 ? (
        <ResumeParagraphList items={normalizeListEntries(data.hobbies)} />
      ) : null,
    references:
      (data.references || []).length > 0 ? <ResumeBulletList items={data.references || []} /> : null,
    custom:
      (data.customSections || []).length > 0 ? (
        <div className="space-y-3.5">
          {data.customSections.map((section, index) => {
            const hasItems = (section.items || []).length > 0;
            const hasDescription = hasText(section.description);

            if (!hasText(section.title) || (!hasDescription && !hasItems && !hasText(section.date))) {
              return null;
            }

            return (
              <ResumeMetaBlock key={`${section.title}-${index}`} title={section.title} meta={section.date}>
                {hasDescription ? <p className="resume-body-copy">{section.description}</p> : null}
                {hasItems ? <ResumeBulletList items={section.items || []} className="mt-2" /> : null}
              </ResumeMetaBlock>
            );
          })}
        </div>
      ) : null,
  };

  return { sections, summaryTitle };
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
    className={`resume-theme-root resume-page ${theme.layout === "single" ? "single-column" : "sidebar-layout"}`}
    style={{
      width: "794px",
      height: "1123px",
      background: theme.palette.page,
      color: theme.palette.text,
      position: "relative",
      overflow: "visible",
      border: theme.sidebarMode === "contact-only" ? "none" : `1px solid ${theme.palette.border}`,
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
    .resume-theme-root {
      background: var(--resume-page-bg);
      color: var(--resume-page-text);
      height: 1123px;
    }

    .resume-page,
    .resume-page,
    .resume-page * {
      box-sizing: border-box;
    }

    .resume-page {
      width: var(--resume-page-width);
      height: var(--resume-page-height);
      overflow: visible;
      page-break-after: always;
      break-after: page;
      font-family: var(--resume-font-family, Inter, Arial, Helvetica, sans-serif);
    }
    .resume-page.single-column {
      padding: var(--resume-page-padding-y) var(--resume-page-padding-x);
    }
    .resume-page.sidebar-layout {
      padding: 0;
    }

    .resume-page p,
    .resume-page div,
    .resume-page span,
    .resume-page li {
      white-space: normal;
      overflow-wrap: break-word;
      word-break: normal;
      min-width: 0;
      max-width: 100%;
    }

    .resume-page a,
    .resume-contact-item,
    .resume-long-text {
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .resume-heading {
      font-size: var(--resume-heading-size);
      line-height: 1.2;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .resume-body-copy {
      font-size: var(--resume-body-size);
      line-height: 1.42;
    }

    .resume-item-title {
      font-size: var(--resume-item-title-size);
      line-height: 1.3;
      font-weight: 600;
      letter-spacing: 0.01em;
      color: var(--resume-page-text);
      margin: 0;
    }

    .resume-item-subtitle {
      font-size: var(--resume-item-subtitle-size);
      line-height: 1.34;
      color: var(--resume-page-text);
      font-weight: 400;
      margin: 0;
    }

    .resume-item-meta {
      font-size: var(--resume-item-meta-size);
      line-height: 1.34;
      color: var(--resume-muted-text);
      font-weight: 400;
      margin: 0;
    }

    .resume-section-title {
      display: block;
      font-size: var(--resume-heading-size);
      line-height: 1.2;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      margin: 0 0 0.5em;
    }

    .resume-bullet-list {
      margin: 4px 0 0;
      padding-left: 0;
      font-size: var(--resume-list-size);
      line-height: 1.42;
      list-style: none;
      overflow: visible;
    }

    .resume-bullet-list li {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      margin-bottom: 3px;
      overflow: visible;
    }

    .resume-bullet-list li::before {
      content: "•";
      position: absolute;
      left: 0;
      top: 0;
      color: currentColor;
      font-size: 1em;
      line-height: 1.42;
    }

    .resume-bullet-list li + li {
      margin-top: 4px;
    }

    .resume-bullet-list li::before {
      content: none;
    }

    .resume-bullet-glyph {
      color: currentColor;
      font-size: 1em;
      line-height: 1.42;
      flex: 0 0 8px;
      display: inline-block;
      text-align: left;
    }

    .resume-bullet-text {
      flex: 1;
      min-width: 0;
    }

    .resume-summary-box {
      border-left: 4px solid var(--resume-accent);
      background: var(--resume-accent-soft);
      padding: var(--resume-summary-box-padding, 10px 12px);
    }

    .resume-section-summary-plain .resume-summary-box {
      border-left: none;
      background: transparent;
      padding: 0;
    }

    .resume-contact-item {
      display: inline-flex;
      align-items: center;
      line-height: 1.35;
      min-width: 0;
    }

    .resume-contact-item:not(:last-child)::after {
      content: "|";
      margin-left: var(--resume-contact-separator-gap, 8px);
      color: var(--resume-muted-text);
    }

    .resume-meta-block + .resume-meta-block {
      margin-top: 10px;
    }

    .resume-meta-block {
      display: grid;
      row-gap: 4px;
    }

    .break-inside-avoid {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .resume-two-column-layout {
      width: 100%;
      min-width: 0;
    }

    .resume-sidebar {
      min-width: 0;
      align-self: stretch;
    }

    .resume-main,
    .resume-section,
    .resume-section-content,
    .resume-summary-box,
    .resume-skills,
    .resume-meta-block {
      min-width: 0;
      max-width: 100%;
    }

    .resume-section {
      display: grid;
      row-gap: var(--resume-section-vertical-gap, 8px);
    }
  `}</style>
);

const ResumeContactRow = ({
  items,
  align = "left",
  color,
  compactMode = false,
  densityMode = "comfortable",
}: {
  items: ContactItem[];
  align?: "left" | "right";
  color: string;
  compactMode?: boolean;
  densityMode?: "comfortable" | "compact" | "ultra-compact";
}) => {
  void compactMode;

  const gapX = densityMode === "ultra-compact" ? 10 : densityMode === "compact" ? 12 : 14;
  const gapY = densityMode === "ultra-compact" ? 4 : densityMode === "compact" ? 6 : 8;

  return (
    <div
      className="flex flex-wrap"
      style={{
        justifyContent: align === "right" ? "flex-end" : "flex-start",
        maxWidth: align === "right" ? "390px" : "100%",
        gap: `${gapY}px ${gapX}px`,
      }}
    >
      {items.map((item, index) => (
        <span
          key={`${item.label}-${item.value}-${index}`}
          className="resume-contact-item"
          style={{
            color,
            fontSize: "var(--resume-item-meta-size)",
            lineHeight: "var(--resume-line-height)",
          }}
        >
          {item.value}
        </span>
      ))}
    </div>
  );
};

const ResumeHeader = ({
  data,
  theme,
  compactMode = false,
  densityMode = "comfortable",
}: {
  data: ResumeData;
  theme: ResumeTemplateTheme;
  compactMode?: boolean;
  densityMode?: "comfortable" | "compact" | "ultra-compact";
}) => {
  const { summaryText } = getSummaryConfig(data);
  const contactItems = getContactItems(data);

  const titleSize = "var(--resume-name-size)";
  const roleSize = "var(--resume-role-size)";

  return (
    <header
      className="break-inside-avoid"
      style={{
        background: theme.headerBand ? theme.palette.headerBg || theme.palette.page : "transparent",
        borderBottom: theme.headerDivider ? `1px solid ${theme.palette.border}` : "none",
        paddingBottom: theme.headerDivider ? "16px" : "0",
      }}
    >
      <div
        className={theme.headerLayout === "split" ? "flex items-end justify-between gap-8" : "space-y-2.5"}
      >
        <div className="min-w-0">
          <h1
            className="font-bold tracking-[0.02em] uppercase"
            style={{
              fontSize: titleSize,
              lineHeight: "var(--resume-line-height)",
              color: theme.palette.nameText || theme.palette.text,
            }}
          >
            {data.fullName}
          </h1>
          {hasText(data.role) ? (
            <p
              className="mt-2 font-medium uppercase"
              style={{
                fontSize: roleSize,
                lineHeight: "var(--resume-line-height)",
                color: theme.palette.titleText || theme.palette.mutedText,
                letterSpacing: "0.08em",
              }}
            >
              {data.role}
            </p>
          ) : null}
        </div>

        {theme.showHeaderContact !== false && contactItems.length > 0 ? (
          <ResumeContactRow
            items={contactItems}
            align={theme.headerLayout === "split" ? "right" : "left"}
            color={theme.palette.mutedText}
            compactMode={compactMode}
            densityMode={densityMode}
          />
        ) : null}
      </div>

      {theme.summaryInHeader && hasText(summaryText) ? (
        <div className="mt-4">
          {theme.summaryStyle === "plain" ? (
            <p className="resume-body-copy">{summaryText}</p>
          ) : (
            <div className="resume-summary-box">
              <p className="resume-body-copy">{summaryText}</p>
            </div>
          )}
        </div>
      ) : null}
    </header>
  );
};

const ResumeSidebar = ({
  children,
  theme,
  compactMode = false,
}: {
  children: ReactNode;
  theme: ResumeTemplateTheme;
  compactMode?: boolean;
}) => (
  <aside
    className="self-stretch"
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      flex: 1,
      background: theme.palette.sidebarBg || theme.palette.accentSoft,
      color: theme.palette.sidebarText || theme.palette.text,
      minHeight: "100%",
      height: "100%",
      alignSelf: "stretch",
      padding:
        theme.sidebarMode === "contact-only"
          ? scalePxString(compactMode ? "150px 18px 24px" : "190px 18px 24px", 1)
          : scalePxString(theme.sidebarPadding || "28px 22px", compactMode ? 0.82 : 1),
    }}
  >
    {children}
  </aside>
);

const ResumeAccentStrip = ({
  theme,
}: {
  theme: ResumeTemplateTheme;
}) => (
  <div
    aria-hidden="true"
    style={{
      position: "absolute",
      left: "0",
      top: "0",
      width: "6px",
      height: "100%",
      background: theme.palette.accent,
    }}
  />
);

const ResumeBulletList = ({
  items,
  fallbackText,
  className = "",
}: {
  items: string[];
  fallbackText?: string;
  className?: string;
}) => {
  const filteredItems = items.filter(Boolean);
  if (filteredItems.length === 0 && !hasText(fallbackText)) return null;
  const resolvedItems = filteredItems.length > 0 ? filteredItems : hasText(fallbackText) ? [fallbackText!.trim()] : [];
  if (resolvedItems.length === 0) return null;

  return (
    <ul className={`resume-bullet-list ${className}`.trim()}>
      {resolvedItems.map((item, index) => (
        <li key={`${item}-${index}`}>
          <span className="resume-bullet-glyph" aria-hidden="true">
            {"\u2022"}
          </span>
          <span className="resume-bullet-text">{item}</span>
        </li>
      ))}
    </ul>
  );
};

const ResumeTagList = ({
  items,
}: {
  items: string[];
}) => {
  const filteredItems = uniqueItems(items.filter(Boolean));
  if (filteredItems.length === 0) return null;

  return <p className="resume-body-copy resume-skills">{filteredItems.join(", ")}</p>;
};

const ResumeParagraphList = ({
  items,
}: {
  items: string[];
}) => {
  const filteredItems = uniqueItems(items.filter(Boolean));
  if (filteredItems.length === 0) return null;

  return <p className="resume-body-copy">{filteredItems.join(", ")}</p>;
};

const ResumeMetaBlock = ({
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
  <div className="resume-meta-block break-inside-avoid">
    <h3 className="resume-item-title">{title}</h3>
    {hasText(subtitle) ? <p className="resume-item-subtitle mt-1">{subtitle}</p> : null}
    {hasText(meta) ? <p className="resume-item-meta mt-1.5">{meta}</p> : null}
    {children ? <div className="mt-2.5">{children}</div> : null}
  </div>
);

const ResumeEducationBlock = ({
  title,
  school,
  date,
  gpa,
}: {
  title: string;
  school?: string;
  date?: string;
  gpa?: string;
}) => (
  <div
    className="resume-meta-block break-inside-avoid"
    style={{
      rowGap: "2px",
    }}
  >
    <h3 className="resume-item-title">{title}</h3>
    {hasText(school) || hasText(date) ? (
      <p
        style={{
          margin: 0,
          lineHeight: 1.34,
        }}
      >
        {hasText(school) ? <span className="resume-item-subtitle">{school}</span> : null}
        {hasText(school) && hasText(date) ? <span className="resume-item-meta"> | </span> : null}
        {hasText(date) ? <span className="resume-item-meta">{date}</span> : null}
      </p>
    ) : null}
    {hasText(gpa) ? (
      <p
        className="resume-body-copy"
        style={{
          margin: "2px 0 0",
        }}
      >
        GPA: {gpa}
      </p>
    ) : null}
  </div>
);

const ResumeTwoColumnLayout = ({
  sidebar,
  main,
  theme,
}: {
  sidebar: ReactNode;
  main: ReactNode;
  theme: ResumeTemplateTheme;
}) => {
  const sidebarWidth = theme.sidebarWidth || "30%";
  const mainWidth = `calc(100% - ${sidebarWidth})`;

  return (
    <div
      className="resume-two-column-layout flex h-full items-stretch"
      style={{
        minHeight: "var(--resume-page-height)",
        height: "100%",
        background: `linear-gradient(to right, ${theme.palette.sidebarBg || theme.palette.accentSoft} 0, ${theme.palette.sidebarBg || theme.palette.accentSoft} ${sidebarWidth}, ${theme.palette.page} ${sidebarWidth}, ${theme.palette.page} 100%)`,
      }}
    >
      <div
        className="resume-sidebar"
        style={{
          width: sidebarWidth,
          flex: `0 0 ${sidebarWidth}`,
          minHeight: "var(--resume-page-height)",
          height: "100%",
          display: "flex",
        }}
      >
        {sidebar}
      </div>
      <main className="resume-main" style={{ width: mainWidth, background: theme.palette.page }}>
        {main}
      </main>
    </div>
  );
};

const renderSections = ({
  keys,
  sections,
  summaryTitle,
  theme,
  compactMode = false,
  sidebar = false,
}: {
  keys: SectionKey[];
  sections: Record<SectionKey, ReactNode>;
  summaryTitle: string;
  theme: ResumeTemplateTheme;
  compactMode?: boolean;
  sidebar?: boolean;
}) =>
  keys.map((key) => {
    const content = sections[key];
    if (!content) return null;

    return (
      <ResumeSection
        key={`${sidebar ? "sidebar" : "main"}-${key}`}
        title={getSectionLabel(key, summaryTitle)}
        theme={theme}
        sidebar={sidebar}
        compactMode={compactMode}
        summaryTitle={summaryTitle}
      >
        {content}
      </ResumeSection>
    );
  });

const template6Render = (data: ResumeData, theme: ResumeTemplateTheme) => {
  const { sections, summaryTitle } = buildSectionMap(data);
  const fresherResume = isFresherResume(data);
  const compactMode = getCompactMode(data);
  const densityMode = getDensityMode(data);
  const compactLevel = data.compactLevel || 0;
  const densityFactor =
    densityMode === "comfortable"
      ? 1
      : densityMode === "compact"
      ? 0.88
      : 0.82;
  const baseSpacingFactor = compactMode ? 0.92 : 1;
  const compactSpacingFactor = compactLevel === 1 ? 0.9 : compactLevel >= 2 ? 0.8 : 1;
  const rawGap = Math.round((theme.sectionSpacing || 22) * densityFactor * baseSpacingFactor * compactSpacingFactor * (theme.spacingScale || 1));
  const minSectionGap = densityMode === "comfortable" && compactLevel === 0 ? 12 : 10;
  const sectionGap = Math.max(minSectionGap, Math.min(16, rawGap));

  const clampPadding = (padding: string) => {
    try {
      const parts = padding.trim().split(/\s+/).map((p) => parseInt(p, 10) || 0);
      let vert = parts.length === 4 ? parts[0] + parts[2] : parts[0] || 36;
      let horiz = parts.length === 4 ? parts[1] + parts[3] : parts[1] || parts[0] || 32;
      vert = Math.round(vert / (parts.length === 4 ? 2 : 1));
      horiz = Math.round(horiz / (parts.length === 4 ? 2 : 1));
      const minPadding = densityMode === "comfortable" && compactLevel === 0 ? 32 : densityMode === "compact" || compactLevel >= 1 ? 28 : 24;
      vert = Math.max(minPadding, Math.min(40, vert));
      horiz = Math.max(minPadding, Math.min(40, horiz));
      return `${vert}px ${horiz}px`;
    } catch {
      return "36px 32px";
    }
  };

  const pageStyle: CSSProperties = {
    padding:
      theme.layout === "single"
        ? scalePxString(clampPadding(theme.pagePadding || "36px 32px"), densityFactor * baseSpacingFactor * compactSpacingFactor)
        : "0",
  };

  const mainStyle: CSSProperties = {
    padding: scalePxString(
      clampPadding(theme.mainPadding || theme.contentPadding || "36px 32px"),
      densityFactor * baseSpacingFactor * compactSpacingFactor
    ),
  };

  const sidebarIntro = (
    <div className="break-inside-avoid space-y-2.5">
      <h1
        className="font-bold tracking-[0.02em] uppercase"
        style={{
          fontSize: "var(--resume-name-size)",
          lineHeight: "var(--resume-line-height)",
          color: theme.palette.sidebarText || theme.palette.text,
        }}
      >
        {data.fullName}
      </h1>
      {hasText(data.role) ? (
        <p
          style={{
            fontSize: "var(--resume-role-size)",
            lineHeight: "var(--resume-line-height)",
            color:
              theme.palette.titleText ||
              theme.palette.sidebarMutedText ||
              theme.palette.sidebarText ||
              theme.palette.mutedText,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
          }}
        >
          {data.role}
        </p>
      ) : null}
      {getContactItems(data).length > 0 ? (
        <ResumeContactRow
          items={getContactItems(data)}
          color={theme.palette.sidebarMutedText || theme.palette.sidebarText || theme.palette.mutedText}
          compactMode={compactMode}
          densityMode={densityMode}
        />
      ) : null}
    </div>
  );

  const fresherSectionKeys = [
    ...getResumeSectionOrder("fresher").filter((key): key is SectionKey => key !== "header"),
    "projects" as SectionKey,
    "achievements" as SectionKey,
    "references" as SectionKey,
    "custom" as SectionKey,
  ].filter((key, index, items) => items.indexOf(key) === index && hasSectionData(key as ResumeSectionKey, data));

  const fresherSidebarKeys = (theme.sidebarSections || DEFAULT_FRESHER_SIDEBAR).filter((key: SectionKey) =>
    fresherSectionKeys.includes(key)
  );
  const fresherMainKeys = (theme.fresherMainSections || DEFAULT_FRESHER_MAIN).filter((key) =>
    hasSectionData(key, data)
  );

  const experiencedSidebarKeys = theme.sidebarSections || DEFAULT_EXPERIENCED_SIDEBAR;
  const experiencedMainKeys = theme.mainSections || DEFAULT_EXPERIENCED_MAIN;

  const densityScale =
    densityMode === "comfortable" ? 1 : densityMode === "compact" ? 0.95 : 0.92;

  const typScale = theme.typographyScale || 1;

  const nameBase = ResumeTypography.name * typScale;
  const roleBase = ResumeTypography.role * typScale;
  const headingBase = ResumeTypography.heading * typScale;
  const bodyBase = ResumeTypography.body * typScale;
  const smallBase = ResumeTypography.small * typScale;
  const lineHeight = ResumeTypography.lineHeight || 1.4;

  const nameSize = nameBase * densityScale;
  const roleSize = roleBase * densityScale;
  const headingSize = Math.max(16, Math.min(18, headingBase * densityScale + 1.5));
  const bodySize = Math.max(10.8, Math.min(12.2, bodyBase * densityScale));
  const titleSize = Math.max(13, Math.min(14, bodyBase * densityScale + 2));
  const subtitleSize = Math.max(11, Math.min(12, bodyBase * densityScale));
  const metaSize = Math.max(11, Math.min(12, smallBase * densityScale * 1.08));
  const listSize = Math.max(11, Math.min(12.2, bodyBase * densityScale));

  return (
    <ResumePage
      theme={theme}
      style={{
        ...pageStyle,
        ...({
          "--resume-page-bg": theme.palette.page,
          "--resume-page-text": theme.palette.text,
          "--resume-muted-text": theme.palette.mutedText,
          "--resume-border": theme.palette.border,
          "--resume-accent": theme.palette.accent,
          "--resume-accent-soft": theme.palette.accentSoft,
          "--resume-accent-text": theme.palette.accentText,
          "--resume-heading-size": `${headingSize.toFixed(2)}px`,
          "--resume-body-size": `${bodySize.toFixed(2)}px`,
          "--resume-item-title-size": `${titleSize.toFixed(2)}px`,
          "--resume-item-subtitle-size": `${subtitleSize.toFixed(2)}px`,
          "--resume-item-meta-size": `${metaSize.toFixed(2)}px`,
          "--resume-list-size": `${listSize.toFixed(2)}px`,
          "--resume-name-size": `${Math.round(nameSize * 100) / 100}px`,
          "--resume-role-size": `${Math.round(roleSize * 100) / 100}px`,
          "--resume-line-height": `${lineHeight}`,
          "--resume-summary-box-padding": compactMode || densityMode !== "comfortable" ? "8px 10px" : "10px 12px",
          "--resume-list-indent": densityMode === "comfortable" ? "18px" : "16px",
          "--resume-contact-separator-gap": densityMode === "comfortable" ? "8px" : "6px",
          "--resume-section-vertical-gap": densityMode === "comfortable" && compactLevel === 0 ? "8px" : densityMode === "compact" ? "7px" : "6px",
          "--resume-font-family": theme.fontFamily || "Inter, Arial, Helvetica, sans-serif",
        } as CSSProperties),
      }}
      data-density-mode={densityMode}
    >
      <ResumePageStyles />

      {theme.topAccentBar ? (
        <div
          aria-hidden="true"
          style={{ position: "absolute", inset: "0 0 auto 0", height: "8px", background: theme.palette.accent }}
        />
      ) : null}

      {theme.leftAccentLine && theme.layout === "single" ? <ResumeAccentStrip theme={theme} /> : null}

      {theme.layout === "single" ? (
        <div className="flex h-full flex-col" style={{ gap: `${sectionGap}px` }}>
          <ResumeHeader data={data} theme={theme} compactMode={compactMode} />
          <div className="flex flex-col" style={{ gap: `${sectionGap}px` }}>
            {renderSections({
              keys: fresherResume ? fresherSectionKeys : theme.mainSections || DEFAULT_SINGLE_ORDER,
              sections,
              summaryTitle,
              theme,
              compactMode,
            })}
          </div>
        </div>
      ) : (
        <ResumeTwoColumnLayout
          theme={theme}
          sidebar={
            <ResumeSidebar theme={theme} compactMode={compactMode}>
              <div className="flex flex-col" style={{ gap: `${sectionGap}px` }}>
                {theme.sidebarMode === "contact-only" ? (
                  <ResumeSidebarContactCard data={data} theme={theme} compactMode={compactMode} />
                ) : (
                  <>
                    {sidebarIntro}
                    {renderSections({
                      keys: fresherResume ? fresherSidebarKeys : experiencedSidebarKeys,
                      sections,
                      summaryTitle,
                      theme,
                      compactMode,
                      sidebar: true,
                    })}
                  </>
                )}
              </div>
            </ResumeSidebar>
          }
          main={
            <div style={mainStyle}>
              <div className="flex flex-col" style={{ gap: `${sectionGap}px` }}>
                {theme.summaryInHeader ? null : (
                  <ResumeHeader data={data} theme={theme} compactMode={compactMode} densityMode={densityMode} />
                )}
                {renderSections({
                  keys: fresherResume ? fresherMainKeys : experiencedMainKeys,
                  sections,
                  summaryTitle,
                  theme,
                  compactMode,
                })}
              </div>
            </div>
          }
        />
      )}
    </ResumePage>
  );
};

const Template6: React.FC<Template6Props> = ({ data }) =>
  template6Render(data, templateThemes[6]);

export default Template6;


