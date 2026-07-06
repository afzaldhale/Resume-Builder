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
import { getStandardResumeTypographyVars } from "@/constants/resumeDesignSystem";
import { resolveTemplateTheme } from "./themeConfig";

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

interface Template13Props {
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
const DEFAULT_FRESHER_MAIN: SectionKey[] = ["summary", "skills", "experience", "education", "certifications"];

const hasText = (value?: string | null) => Boolean(value && value.trim());

const toBulletItems = (value?: string | null) =>
  (value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const toLineItems = (value?: string[] | string | null) => {
  if (Array.isArray(value)) {
    return value.map((item) => item?.trim()).filter(Boolean) as string[];
  }

  return toBulletItems(value);
};

const uniqueItems = (items: string[]) => [...new Set(items.filter(Boolean))];

const TEMPLATE13_PAGE_PADDING = "36px 48px";
const TEMPLATE13_SIDEBAR_WIDTH = "30%";
const TEMPLATE13_COLUMN_GAP = "28px";
const TEMPLATE13_BULLET = "\u2022";

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
  void compactMode;

  if (items.length === 0) return null;

  return (
    <section className="break-inside-avoid">
      <h2
        className="resume-heading"
        style={{
          color: theme.palette.sidebarText || theme.palette.text,
          marginBottom: "8px",
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
                  fontSize: "var(--resume-item-meta-size)",
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
                  fontSize: "var(--resume-body-size)",
                  lineHeight: "var(--resume-line-height)",
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
        <div style={{ display: "grid", rowGap: "18px" }}>
          {experience.map((item, index) => {
            const title = [item.role, item.company].filter(hasText).join(" at ");

            return (
              <Template13ExperienceEntry
                key={`${item.company}-${item.role}-${index}`}
                title={title}
                dates={formatRange(item.startDate, item.endDate)}
                descriptions={toLineItems(item.description as string | string[] | null | undefined)}
              />
            );
          })}
        </div>
      ) : null,
    education:
      education.length > 0 ? (
        <div style={{ display: "grid", rowGap: "18px" }}>
          {education.map((item, index) => (
            <Template13EducationEntry
              key={`${item.school}-${item.degree}-${index}`}
              degree={item.degree}
              school={item.school}
              dates={formatRange(item.startYear, item.endYear)}
              gpa={item.gpa}
            />
          ))}
        </div>
      ) : null,
    projects:
      data.projects.length > 0 ? (
        <div style={{ display: "grid", rowGap: "18px" }}>
          {data.projects.map((project, index) => (
            <Template13ProjectEntry
              key={`${project.name}-${index}`}
              title={project.name}
              description={project.description}
              technologies={project.technologies}
            />
          ))}
        </div>
      ) : null,
    certifications:
      certifications.length > 0 ? (
        <Template13CompactStack
          items={certifications.map((item) => ({
            primary: item.name,
            secondary: [item.issuer, formatMonthYear(item.year)].filter(hasText).join(" | "),
          }))}
          emphasizeFirst
        />
      ) : null,
    achievements:
      (data.achievements || []).length > 0 ? <ResumeBulletList items={data.achievements || []} /> : null,
    languages:
      data.languages.length > 0 ? (
        <p className="resume-body-copy resume-skills">
          {data.languages
            .map((item) => (hasText(item.level) ? `${item.language} (${item.level})` : item.language))
            .join(", ")}
        </p>
      ) : null,
    strengths: (data.strengths || []).length > 0 ? <ResumeTagList items={data.strengths || []} /> : null,
    hobbies: (data.hobbies || []).length > 0 ? <ResumeTagList items={data.hobbies || []} /> : null,
    references:
      (data.references || []).length > 0 ? <ResumeBulletList items={data.references || []} /> : null,
    custom:
      (data.customSections || []).length > 0 ? (
        <div style={{ display: "grid", rowGap: "18px" }}>
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
      border: `1px solid ${theme.palette.border}`,
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
      line-height: var(--resume-line-height);
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .resume-body-copy {
      font-size: var(--resume-body-size);
      line-height: var(--resume-line-height);
    }

    .resume-item-title {
      font-size: var(--resume-item-title-size);
      line-height: var(--resume-line-height);
      font-weight: 700;
    }

    .resume-item-subtitle {
      font-size: var(--resume-item-subtitle-size);
      line-height: var(--resume-line-height);
      color: var(--resume-page-text);
    }

    .resume-item-meta {
      font-size: var(--resume-item-meta-size);
      line-height: var(--resume-line-height);
      color: var(--resume-muted-text);
    }

    .resume-section-title {
      display: block;
      font-size: var(--resume-heading-size);
      line-height: var(--resume-line-height);
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin: 0 0 0.35em;
    }

    .resume-bullet-list {
      margin: 0;
      padding-left: var(--resume-list-indent, 18px);
      font-size: var(--resume-list-size);
      line-height: var(--resume-line-height);
    }

    .resume-bullet-list li + li {
      margin-top: 2px;
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

    .resume-meta-block + .resume-meta-block {
      margin-top: 14px;
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
  color,
  densityMode = "comfortable",
}: {
  items: ContactItem[];
  color: string;
  densityMode?: "comfortable" | "compact" | "ultra-compact";
}) => {
  const gapX = densityMode === "ultra-compact" ? 8 : densityMode === "compact" ? 10 : 12;
  const gapY = densityMode === "ultra-compact" ? 6 : densityMode === "compact" ? 8 : 10;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: `${gapY}px ${gapX}px`,
        width: "100%",
        margin: "0 auto",
      }}
    >
      {items.map((item, index) => (
        <React.Fragment key={`${item.label}-${item.value}-${index}`}>
          <div
            style={{
              color,
              fontSize: "var(--resume-item-meta-size)",
              lineHeight: "var(--resume-line-height)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "baseline",
              justifyContent: "center",
              gap: "4px",
              minWidth: 0,
              maxWidth: "100%",
            }}
          >
            <span
              style={{
                fontWeight: 600,
                letterSpacing: "0.02em",
                whiteSpace: "nowrap",
              }}
            >
              {item.label}:
            </span>
            <span
              style={{
                minWidth: 0,
                overflowWrap: "anywhere",
                wordBreak: "break-word",
              }}
            >
              {item.value}
            </span>
          </div>
          {index < items.length - 1 ? (
            <span
              aria-hidden="true"
              style={{
                color,
                fontSize: "var(--resume-item-meta-size)",
                lineHeight: "var(--resume-line-height)",
              }}
            >
              |
            </span>
          ) : null}
        </React.Fragment>
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
  void compactMode;

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
        paddingBottom: theme.headerDivider ? "20px" : "0",
      }}
    >
      <div
        style={{
          display: "grid",
          rowGap: "14px",
          width: "78%",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h1
            style={{
              margin: 0,
              fontSize: titleSize,
              lineHeight: "var(--resume-line-height)",
              color: theme.palette.nameText || theme.palette.text,
              fontWeight: 800,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textAlign: "center",
            }}
          >
            {data.fullName}
          </h1>
          {hasText(data.role) ? (
            <p
              style={{
                margin: "10px 0 0",
                fontSize: roleSize,
                lineHeight: "var(--resume-line-height)",
                color: theme.palette.titleText || theme.palette.mutedText,
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              {data.role}
            </p>
          ) : null}
        </div>

        {theme.showHeaderContact !== false && contactItems.length > 0 ? (
          <ResumeContactRow
            items={contactItems}
            color={theme.palette.mutedText}
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
    style={{
      background: theme.palette.sidebarBg || theme.palette.accentSoft,
      color: theme.palette.sidebarText || theme.palette.text,
      padding: scalePxString(theme.sidebarPadding || "30px 24px", compactMode ? 0.92 : 1),
      minHeight: "100%",
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

  if (filteredItems.length <= 1 && hasText(fallbackText)) {
    return <p className={`resume-body-copy ${className}`.trim()}>{fallbackText}</p>;
  }

  return (
    <ul className={`resume-bullet-list ${className}`.trim()}>
      {filteredItems.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
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

const Template13Section = ({
  title,
  theme,
  sidebar = false,
  summaryTitle,
  children,
}: {
  title: string;
  theme: ResumeTemplateTheme;
  sidebar?: boolean;
  summaryTitle?: string;
  children: ReactNode;
}) => (
  <section
    className="resume-section break-inside-avoid"
    style={{
      color: sidebar ? theme.palette.sidebarText || theme.palette.text : theme.palette.text,
      rowGap: sidebar ? "10px" : "12px",
    }}
  >
    <h2
      className="resume-section-title"
      style={{
        margin: 0,
        width: "100%",
        padding: sidebar ? "8px 10px" : "8px 12px",
        background: theme.palette.accent,
        color: theme.palette.headingText || theme.palette.accentText,
        fontSize: "var(--resume-heading-size)",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        lineHeight: "var(--resume-line-height)",
      }}
    >
      {title}
    </h2>
    <div
      className={`resume-section-content ${
        theme.summaryStyle === "plain" && title === summaryTitle ? "resume-section-summary-plain" : ""
      }`.trim()}
    >
      {children}
    </div>
  </section>
);

const Template13BulletTitle = ({ text }: { text: string }) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: "6px",
    }}
  >
    <span
      aria-hidden="true"
      style={{
        fontSize: "var(--resume-list-size)",
        lineHeight: "var(--resume-line-height)",
        flexShrink: 0,
      }}
    >
      {TEMPLATE13_BULLET}
    </span>
    <div
      className="resume-item-title"
      style={{
        flex: 1,
        minWidth: 0,
        color: "inherit",
      }}
    >
      {text}
    </div>
  </div>
);

const Template13ExperienceEntry = ({
  title,
  dates,
  descriptions,
}: {
  title: string;
  dates?: string;
  descriptions: string[];
}) => (
  <div className="resume-meta-block break-inside-avoid">
    <Template13BulletTitle text={[title, dates].filter(Boolean).join(" — ")} />
    {descriptions.length > 0 ? (
      <div style={{ marginLeft: "18px", marginTop: "6px", display: "grid", rowGap: "4px" }}>
        {descriptions.map((description, index) => (
          <p key={`${description}-${index}`} className="resume-body-copy" style={{ margin: 0 }}>
            {description}
          </p>
        ))}
      </div>
    ) : null}
  </div>
);

const Template13EducationEntry = ({
  degree,
  school,
  dates,
  gpa,
}: {
  degree: string;
  school?: string;
  dates?: string;
  gpa?: string;
}) => (
  <div className="resume-meta-block break-inside-avoid">
    <Template13BulletTitle text={degree} />
    <div style={{ marginLeft: "18px", marginTop: "6px", display: "grid", rowGap: "2px" }}>
      {hasText(school) ? <p className="resume-body-copy" style={{ margin: 0 }}>{school}</p> : null}
      {hasText(dates) ? <p className="resume-item-meta" style={{ margin: 0 }}>{dates}</p> : null}
      {hasText(gpa) ? <p className="resume-body-copy" style={{ margin: 0 }}>GPA: {gpa}</p> : null}
    </div>
  </div>
);

const Template13ProjectEntry = ({
  title,
  description,
  technologies,
}: {
  title: string;
  description?: string;
  technologies: string[];
}) => (
  <div className="resume-meta-block break-inside-avoid">
    <Template13BulletTitle text={title} />
    <div style={{ marginLeft: "18px", marginTop: "6px", display: "grid", rowGap: "4px" }}>
      {hasText(description) ? <p className="resume-body-copy" style={{ margin: 0 }}>{description}</p> : null}
      {technologies.length > 0 ? (
        <p className="resume-item-meta" style={{ margin: 0 }}>
          Technologies: {uniqueItems(technologies).join(", ")}
        </p>
      ) : null}
    </div>
  </div>
);

const Template13CompactStack = ({
  items,
  emphasizeFirst = false,
}: {
  items: Array<{ primary: string; secondary?: string }>;
  emphasizeFirst?: boolean;
}) => (
  <div style={{ display: "grid", rowGap: "10px" }}>
    {items.map((item, index) => (
      <div key={`${item.primary}-${item.secondary || ""}-${index}`} className="break-inside-avoid">
        <p
          className={emphasizeFirst ? "resume-body-copy" : "resume-item-meta"}
          style={{
            margin: 0,
            fontWeight: emphasizeFirst ? 600 : 500,
            color: "inherit",
          }}
        >
          {item.primary}
        </p>
        {hasText(item.secondary) ? (
          <p className="resume-item-meta" style={{ margin: "2px 0 0" }}>
            {item.secondary}
          </p>
        ) : null}
      </div>
    ))}
  </div>
);

const renderSections = ({
  keys,
  sections,
  summaryTitle,
  theme,
  sidebar = false,
}: {
  keys: SectionKey[];
  sections: Record<SectionKey, ReactNode>;
  summaryTitle: string;
  theme: ResumeTemplateTheme;
  sidebar?: boolean;
}) =>
  keys.map((key) => {
    const content = sections[key];
    if (!content) return null;

    return (
      <Template13Section
        key={`${sidebar ? "sidebar" : "main"}-${key}`}
        title={getSectionLabel(key, summaryTitle)}
        theme={theme}
        sidebar={sidebar}
        summaryTitle={summaryTitle}
      >
        {content}
      </Template13Section>
    );
  });

const template13Render = (data: ResumeData, theme: ResumeTemplateTheme) => {
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

  const pagePadding = scalePxString(
    TEMPLATE13_PAGE_PADDING,
    densityFactor * baseSpacingFactor * compactSpacingFactor
  );

  const pageStyle: CSSProperties = {
    padding: theme.layout === "single" ? pagePadding : "0",
  };

  const mainStyle: CSSProperties = {
    padding: scalePxString(
      clampPadding(theme.mainPadding || theme.contentPadding || "0px"),
      densityFactor * baseSpacingFactor * compactSpacingFactor
    ),
  };

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
          ...getStandardResumeTypographyVars(),
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
            })}
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: pagePadding,
            height: "100%",
          }}
        >
          <div
            className="resume-two-column-layout"
            style={{
              display: "grid",
              gridTemplateColumns: `minmax(0, ${TEMPLATE13_SIDEBAR_WIDTH}) minmax(0, 1fr)`,
              columnGap: TEMPLATE13_COLUMN_GAP,
              alignItems: "stretch",
              minHeight: "100%",
            }}
          >
            <main
              className="resume-main"
              style={{ minWidth: 0, gridColumn: "1 / -1" }}
            >
              {theme.summaryInHeader ? null : (
                <ResumeHeader
                  data={data}
                  theme={theme}
                  compactMode={compactMode}
                  densityMode={densityMode}
                />
              )}
            </main>

            <div className="resume-sidebar">
              <ResumeSidebar
                theme={{
                  ...theme,
                  sidebarPadding: theme.sidebarPadding || "30px 24px 28px 24px",
                }}
                compactMode={compactMode}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: `${sectionGap}px` }}>
                  {theme.sidebarMode === "contact-only" ? (
                    <ResumeSidebarContactCard data={data} theme={theme} compactMode={compactMode} />
                  ) : (
                    renderSections({
                      keys: fresherResume ? fresherSidebarKeys : experiencedSidebarKeys,
                      sections,
                      summaryTitle,
                      theme,
                      sidebar: true,
                    })
                  )}
                </div>
              </ResumeSidebar>
            </div>
            <main className="resume-main" style={{ minWidth: 0 }}>
              <div style={mainStyle}>
                <div style={{ display: "flex", flexDirection: "column", gap: `${sectionGap}px` }}>
                  {renderSections({
                    keys: fresherResume ? fresherMainKeys : experiencedMainKeys,
                    sections,
                    summaryTitle,
                    theme,
                  })}
                </div>
              </div>
            </main>
          </div>
        </div>
      )}
    </ResumePage>
  );
};

const Template13: React.FC<Template13Props> = ({ data }) =>
  template13Render(data, resolveTemplateTheme(13, data));

export default Template13;
