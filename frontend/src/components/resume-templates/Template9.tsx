import React, { type CSSProperties, type ReactNode } from "react";
import {
  ResumeTypography,
  getStandardResumeTypographyVars,
} from "@/constants/resumeDesignSystem";
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
import { resolveTemplateTheme } from "./themeConfig";
import {
  ResumeStructuredExperienceBlock,
  ResumeStructuredProjectBlock,
} from "./templatePrimitives";

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

interface Template9Props {
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

const uniqueItems = (items: string[]) => [...new Set(items.filter(Boolean))];

const scalePxString = (value: string, factor: number) =>
  value.replace(/(\d+(?:\.\d+)?)px/g, (_, amount: string) => {
    const scaled = Math.max(8, Number.parseFloat(amount) * factor);
    return `${Math.round(scaled * 100) / 100}px`;
  });

const formatRange = (start?: string, end?: string) => {
  const parts = [formatMonthYear(start), formatMonthYear(end)].filter(Boolean);
  return parts.join(" - ");
};

const resolveSidebarWidth = (value?: string) => {
  if (typeof value !== "string") {
    return "24%";
  }

  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) {
    return "24%";
  }

  return `${Math.max(23, Math.min(25, parsed))}%`;
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

  if (hasText(data.phone)) items.push({ label: "Phone", value: data.phone });
  if (hasText(data.email)) items.push({ label: "Email", value: data.email });
  if (hasText(data.address)) items.push({ label: "Location", value: data.address });

  (data.socialLinks || []).forEach((link) => {
    if (hasText(link.url)) {
      const label = getSocialLabel(link.platform, link.url);
      items.push({ label, value: link.url });
    }
  });

  return items;
};

const ResumeSidebarSection = ({
  title,
  children,
  theme,
}: {
  title: string;
  children: ReactNode;
  theme: ResumeTemplateTheme;
  }) => (
    <section className="break-inside-avoid" style={{ display: "grid", rowGap: "14px" }}>
    <div
      style={{
        width: "100%",
        height: "1px",
        background: theme.palette.sidebarBorder || "rgba(255,255,255,0.24)",
      }}
    />
    <div style={{ display: "grid", rowGap: "12px" }}>
      <h2
        className="resume-heading"
        style={{
          margin: 0,
          color: theme.palette.accent,
          fontSize: `${ResumeTypography.heading}px`,
          letterSpacing: "0.16em",
        }}
      >
        {title}
      </h2>
      <div className="resume-section-content" style={{ paddingLeft: "var(--resume-section-content-indent, 16px)" }}>
        {children}
      </div>
    </div>
  </section>
);

const ResumeMainSection = ({
  title,
  children,
  theme,
}: {
  title: string;
  children: ReactNode;
  theme: ResumeTemplateTheme;
}) => (
  <section
    className="resume-main-section break-inside-avoid"
    style={{ display: "grid", rowGap: "16px", color: theme.palette.text }}
  >
    <div
      className="resume-main-section-header"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: "4px",
          minWidth: "4px",
          alignSelf: "stretch",
          borderRadius: "999px",
          background: theme.palette.accent,
        }}
      />
      <h2
        className="resume-section-title"
        style={{
          margin: 0,
          color: theme.palette.text,
          lineHeight: "1.18",
        }}
      >
        {title}
      </h2>
    </div>
    <div className="resume-section-content" style={{ paddingLeft: "var(--resume-section-content-indent, 16px)" }}>
      {children}
    </div>
  </section>
);

const ResumeSidebarIdentity = ({
  data,
  theme,
}: {
  data: ResumeData;
  theme: ResumeTemplateTheme;
}) => {
  const contactItems = getContactItems(data);

  return (
    <section className="break-inside-avoid" style={{ display: "grid", rowGap: "20px" }}>
      <div style={{ display: "grid", rowGap: "8px" }}>
        <h1
          style={{
            margin: 0,
            color: theme.palette.sidebarText || theme.palette.text,
            fontSize: `${ResumeTypography.name}px`,
            lineHeight: "1.04",
            fontWeight: 800,
            letterSpacing: "0.03em",
            textTransform: "uppercase",
          }}
        >
          {data.fullName}
        </h1>
        {hasText(data.role) ? (
          <p
            style={{
              margin: 0,
              color: theme.palette.sidebarMutedText || theme.palette.sidebarText || theme.palette.mutedText,
              fontSize: `${ResumeTypography.role}px`,
              lineHeight: "1.45",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {data.role}
          </p>
        ) : null}
      </div>

      {contactItems.length > 0 ? (
        <ResumeSidebarSection title="Contact" theme={theme}>
          <div style={{ display: "grid", rowGap: "12px" }}>
            {contactItems.map((item, index) => (
              <div key={`${item.label}-${item.value}-${index}`} style={{ display: "grid", rowGap: "4px" }}>
                <p
                  style={{
                    margin: 0,
                    color: theme.palette.accent,
                    fontSize: `${ResumeTypography.meta}px`,
                    lineHeight: "1.3",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  {item.label}
                </p>
                <p
                  className="resume-long-text"
                  style={{
                    margin: 0,
                    color: theme.palette.sidebarText || theme.palette.text,
                    fontSize: `${ResumeTypography.contact}px`,
                    lineHeight: "1.55",
                  }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </ResumeSidebarSection>
      ) : null}
    </section>
  );
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
  void compactMode;
  const items = getContactItems(data);

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

void ResumeSidebarContactCard;

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
        <div className="grid" style={{ rowGap: "24px" }}>
          {experience.map((item, index) => (
            <ResumeStructuredExperienceBlock
              key={`${item.company}-${item.role}-${index}`}
              title={[item.role, item.company].filter(Boolean).join(" at ")}
              meta={formatRange(item.startDate, item.endDate)}
              description={item.description}
            />
          ))}
        </div>
      ) : null,
    education:
      education.length > 0 ? (
        <div className="grid" style={{ rowGap: "20px" }}>
          {education.map((item, index) => (
            <ResumeDetailBulletGroup
              key={`${item.school}-${item.degree}-${index}`}
              items={[
                { content: item.degree, className: "resume-item-title" },
                { content: item.school, className: "resume-item-subtitle" },
                { content: formatRange(item.startYear, item.endYear), className: "resume-item-meta" },
                ...(hasText(item.gpa) ? [{ content: `GPA: ${item.gpa}`, className: "resume-item-meta" }] : []),
              ]}
            />
          ))}
        </div>
      ) : null,
    projects:
      data.projects.length > 0 ? (
        <div className="grid" style={{ rowGap: "22px" }}>
          {data.projects.map((project, index) => (
            <ResumeStructuredProjectBlock
              key={`${project.name}-${index}`}
              title={project.name}
              meta={hasText(project.link) ? project.link : undefined}
              description={project.description}
              technologies={project.technologies}
            />
          ))}
        </div>
      ) : null,
    certifications:
      certifications.length > 0 ? (
        <div className="grid" style={{ rowGap: "20px" }}>
          {certifications.map((item, index) => (
            <ResumeMetaBlock
              key={`${item.name}-${item.issuer}-${index}`}
              title={`\u2022 ${[item.name, item.issuer, hasText(item.year) ? formatMonthYear(item.year) : ""]
                .filter(hasText)
                .join(", ")}`}
            />
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
    strengths: (data.strengths || []).length > 0 ? <ResumeTagList items={data.strengths || []} /> : null,
    hobbies: (data.hobbies || []).length > 0 ? <ResumeTagList items={data.hobbies || []} /> : null,
    references:
      (data.references || []).length > 0 ? <ResumeBulletList items={data.references || []} /> : null,
    custom:
      (data.customSections || []).length > 0 ? (
        <div className="grid" style={{ rowGap: "22px" }}>
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

const isPdfDebugEnabled = () => {
  if (typeof window === "undefined") return false;
  return Boolean((window as Window & { __RESUME_PRINT_DEBUG__?: boolean }).__RESUME_PRINT_DEBUG__);
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
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin: 0;
      break-after: avoid-page;
      page-break-after: avoid;
    }

    .resume-bullet-list {
      margin: 0;
      padding-left: var(--resume-list-indent, 18px);
      font-size: var(--resume-list-size);
      line-height: var(--resume-line-height);
    }

    .resume-bullet-list li + li {
      margin-top: 6px;
    }

    .resume-detail-bullet-group {
      margin: 0;
      padding-left: var(--resume-list-indent, 18px);
      display: grid;
      row-gap: 4px;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .resume-detail-bullet-group li::marker {
      font-size: 0.8em;
    }

    .resume-detail-bullet-line {
      display: block;
    }

    .resume-summary-box {
      border-left: 4px solid var(--resume-accent);
      background: var(--resume-accent-soft);
      padding: var(--resume-summary-box-padding, 14px 16px);
    }

    .resume-section-summary-plain .resume-summary-box {
      border-left: none;
      background: transparent;
      padding: 0;
    }

    .resume-contact-item {
      display: inline-flex;
      align-items: center;
      line-height: var(--resume-line-height);
      min-width: 0;
    }

    .resume-contact-item:not(:last-child)::after {
      content: "|";
      margin-left: var(--resume-contact-separator-gap, 8px);
      color: var(--resume-muted-text);
    }

    .resume-meta-block + .resume-meta-block {
      margin-top: 0;
    }

    .break-inside-avoid {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .resume-two-column-layout {
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 100%;
      min-width: 0;
    }

    .resume-sidebar {
      position: relative;
      z-index: 1;
      min-width: 0;
      align-self: stretch;
    }

    .resume-sidebar-fill {
      position: absolute;
      inset: 0 auto 0 0;
      width: var(--resume-sidebar-width, 24%);
      background: var(--resume-sidebar-bg);
      border-right: 1px solid var(--resume-sidebar-border);
      z-index: 0;
      pointer-events: none;
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
      row-gap: var(--resume-section-heading-gap, 14px);
    }

    .resume-section-content {
      min-width: 0;
    }

    .resume-main-section + .resume-main-section {
      margin-top: 0;
    }

    .resume-skills-grid,
    .resume-two-column-list {
      min-width: 0;
      max-width: 100%;
    }

    .resume-skills-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 6px 32px;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .resume-skills-grid li {
      position: relative;
      padding-left: 16px;
      font-size: 13.5px;
      font-weight: 500;
      line-height: var(--resume-line-height);
      color: #333333;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .resume-skills-grid li::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0.8em;
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background: var(--resume-accent);
      transform: translateY(-50%);
    }

    @media (max-width: 720px) {
      .resume-skills-grid {
        grid-template-columns: minmax(0, 1fr);
      }
    }

    .resume-two-column-list {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px 18px;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .resume-two-column-list li {
      position: relative;
      padding-left: 16px;
      font-size: var(--resume-list-size);
      line-height: var(--resume-line-height);
    }

    .resume-two-column-list li::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0.62em;
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background: var(--resume-accent);
      transform: translateY(-50%);
    }

    .resume-page p,
    .resume-page li {
      orphans: 2;
      widows: 2;
    }

    .resume-meta-block,
    .resume-summary-box,
    .resume-bullet-list li,
    .resume-section-content {
      break-inside: avoid;
      page-break-inside: avoid;
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

  const gapX = densityMode === "ultra-compact" ? 12 : densityMode === "compact" ? 14 : 16;
  const gapY = densityMode === "ultra-compact" ? 8 : densityMode === "compact" ? 10 : 12;

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
            fontSize: "var(--resume-contact-size)",
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
  void compactMode;

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
        className={theme.headerLayout === "split" ? "flex items-end justify-between gap-8" : ""}
        style={
          theme.headerLayout === "split"
            ? undefined
            : {
                display: "grid",
                rowGap: densityMode === "comfortable" ? "18px" : "14px",
              }
        }
      >
        <div className="min-w-0">
          <h1
            className="font-bold tracking-[0.02em] uppercase"
            style={{
              fontSize: titleSize,
              lineHeight: "1.08",
              color: theme.palette.nameText || theme.palette.text,
              margin: 0,
              whiteSpace: "normal",
              overflowWrap: "normal",
              wordBreak: "normal",
              hyphens: "manual",
            }}
          >
            {data.fullName}
          </h1>
          {hasText(data.role) ? (
            <p
              className="mt-2 font-medium uppercase"
              style={{
                fontSize: roleSize,
                lineHeight: "1.35",
                color: theme.palette.titleText || theme.palette.mutedText,
                letterSpacing: "0.08em",
                margin: "12px 0 0",
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
        <div className="mt-5">
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

void ResumeHeader;

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
      background: "transparent",
      color: theme.palette.sidebarText || theme.palette.text,
      minHeight: "100%",
      padding: scalePxString(theme.sidebarPadding || "44px 24px 44px 26px", compactMode ? 0.94 : 1),
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

const ResumeDetailBulletGroup = ({
  items,
}: {
  items: Array<{ content?: string; className?: string }>;
}) => {
  const filteredItems = items.filter((item) => hasText(item.content));
  if (filteredItems.length === 0) return null;

  return (
    <ul className="resume-detail-bullet-group break-inside-avoid">
      {filteredItems.map((item, index) => (
        <li key={`${item.content}-${index}`}>
          <span className={`resume-detail-bullet-line ${item.className || "resume-body-copy"}`.trim()}>
            {item.content}
          </span>
        </li>
      ))}
    </ul>
  );
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
  <div className="resume-meta-block break-inside-avoid" style={{ display: "grid", rowGap: "6px" }}>
    <h3 className="resume-item-title">{title}</h3>
    {hasText(subtitle) ? <p className="resume-item-subtitle">{subtitle}</p> : null}
    {hasText(meta) ? <p className="resume-item-meta">{meta}</p> : null}
    {children ? <div style={{ marginTop: "10px" }}>{children}</div> : null}
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
  const sidebarWidth = resolveSidebarWidth(theme.sidebarWidth);
  const mainWidth = `calc(100% - ${sidebarWidth})`;

  return (
    <div
      className="resume-two-column-layout h-full items-stretch"
      style={{
        display: "grid",
        gridTemplateColumns: `minmax(0, ${sidebarWidth}) minmax(0, ${mainWidth})`,
      }}
    >
      <div className="resume-sidebar-fill" aria-hidden="true" />
      <div
        className="resume-sidebar"
        style={{
          width: "100%",
          minWidth: 0,
          maxWidth: "none",
        }}
      >
        {sidebar}
      </div>
      <main
        className="resume-main"
        style={{
          width: "100%",
          minWidth: 0,
          maxWidth: "none",
        }}
      >
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
}) => {
  void compactMode;

  return (
  keys.map((key) => {
    const content = sections[key];
    if (!content) return null;

    const title = getSectionLabel(key, summaryTitle);

    if (sidebar) {
      return (
        <ResumeSidebarSection key={`sidebar-${key}`} title={title} theme={theme}>
          <div style={{ color: theme.palette.sidebarText || theme.palette.text }}>{content}</div>
        </ResumeSidebarSection>
      );
    }

    return (
      <ResumeMainSection key={`main-${key}`} title={title} theme={theme}>
        {content}
      </ResumeMainSection>
    );
  })
  );
};

const template9Render = (data: ResumeData, theme: ResumeTemplateTheme) => {
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
  const rawGap = Math.round(26 * densityFactor * baseSpacingFactor * compactSpacingFactor);
  const minSectionGap =
    densityMode === "comfortable" && compactLevel === 0 ? 24 : densityMode === "compact" ? 20 : 18;
  const sectionGap = Math.max(minSectionGap, Math.min(28, rawGap));

  const clampPadding = (padding: string) => {
    try {
      const parts = padding.trim().split(/\s+/).map((p) => parseInt(p, 10) || 0);
      let vert = parts.length === 4 ? parts[0] + parts[2] : parts[0] || 38;
      let horiz = parts.length === 4 ? parts[1] + parts[3] : parts[1] || parts[0] || 40;
      vert = Math.round(vert / (parts.length === 4 ? 2 : 1));
      horiz = Math.round(horiz / (parts.length === 4 ? 2 : 1));
      const minVerticalPadding =
        densityMode === "comfortable" && compactLevel === 0 ? 42 : densityMode === "compact" || compactLevel >= 1 ? 34 : 32;
      const minHorizontalPadding =
        densityMode === "comfortable" && compactLevel === 0 ? 44 : densityMode === "compact" || compactLevel >= 1 ? 36 : 34;
      vert = Math.max(minVerticalPadding, Math.min(48, vert));
      horiz = Math.max(minHorizontalPadding, Math.min(46, horiz));
      return `${vert}px ${horiz}px`;
    } catch {
      return "42px 44px";
    }
  };

  const pageStyle: CSSProperties = {
    padding:
      theme.layout === "single"
        ? scalePxString(
            clampPadding(theme.pagePadding || "42px 44px"),
            densityFactor * baseSpacingFactor * compactSpacingFactor
          )
        : "0",
  };

  const mainStyle: CSSProperties = {
    padding: scalePxString(
      clampPadding(theme.mainPadding || theme.contentPadding || "42px 44px"),
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

  const templateSidebarKeys: SectionKey[] = ["languages"];
  const templateMainKeys: SectionKey[] = [
    "summary",
    "skills",
    "experience",
    "projects",
    "education",
    "certifications",
    "strengths",
    "achievements",
    "hobbies",
    "references",
    "custom",
  ];

  const fresherSidebarKeys = templateSidebarKeys.filter((key) => fresherSectionKeys.includes(key));
  const fresherMainKeys = templateMainKeys.filter((key) => hasSectionData(key, data));

  const experiencedSidebarKeys = templateSidebarKeys.filter((key) => hasSectionData(key, data));
  const experiencedMainKeys = templateMainKeys.filter((key) => hasSectionData(key, data));

  if (isPdfDebugEnabled()) {
    const activeMainKeys = (fresherResume ? fresherMainKeys : experiencedMainKeys).filter(
      (key) => Boolean(sections[key])
    );
    const activeSidebarKeys = (fresherResume ? fresherSidebarKeys : experiencedSidebarKeys).filter(
      (key) => Boolean(sections[key])
    );

    console.log(
      "[pdf-debug][stage-2b][template9-sections]",
      JSON.stringify({
        summaryTitle,
        activeMainSections: activeMainKeys.map((key) => getSectionLabel(key, summaryTitle)),
        activeSidebarSections: activeSidebarKeys.map((key) => getSectionLabel(key, summaryTitle)),
        educationLength: data.education?.length ?? 0,
        certificationsLength: data.certifications?.length ?? 0,
        projectsLength: data.projects?.length ?? 0,
        skillsLength: data.skills?.length ?? 0,
      })
    );
  }

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
          "--resume-sidebar-bg": theme.palette.sidebarBg || theme.palette.accentSoft,
          "--resume-sidebar-border": theme.palette.sidebarBorder || theme.palette.border,
          "--resume-sidebar-width": resolveSidebarWidth(theme.sidebarWidth),
          ...getStandardResumeTypographyVars(),
          "--resume-summary-box-padding": compactMode || densityMode !== "comfortable" ? "12px 14px" : "14px 16px",
          "--resume-list-indent": densityMode === "comfortable" ? "20px" : "18px",
          "--resume-contact-separator-gap": densityMode === "comfortable" ? "10px" : "8px",
          "--resume-section-heading-gap":
            densityMode === "comfortable" && compactLevel === 0 ? "14px" : densityMode === "compact" ? "12px" : "10px",
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
              <div className="flex flex-col" style={{ gap: "22px" }}>
                <ResumeSidebarIdentity data={data} theme={theme} />
                {renderSections({
                  keys: fresherResume ? fresherSidebarKeys : experiencedSidebarKeys,
                  sections,
                  summaryTitle,
                  theme,
                  compactMode,
                  sidebar: true,
                })}
              </div>
            </ResumeSidebar>
          }
          main={
            <div style={mainStyle}>
              <div className="resume-main-content flex flex-col" style={{ gap: `${sectionGap}px` }}>
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

const Template9: React.FC<Template9Props> = ({ data }) =>
  template9Render(data, resolveTemplateTheme(9, data));

export default Template9;
