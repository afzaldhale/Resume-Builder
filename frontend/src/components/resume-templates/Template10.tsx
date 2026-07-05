import React, { type CSSProperties, type ReactNode } from "react";
import { getCompactMode, getDensityMode, getSummaryConfig } from "./templatePolicy";
import {
  formatMonthYear,
  sortCertificationsReverseChronological,
  sortEducationReverseChronological,
  sortExperienceReverseChronological,
  type ResumeSectionKey,
} from "./resumeSections";
import type { ResumeData } from "./types";
import { ResumeTypography } from "@/constants/resumeDesignSystem";
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

interface Template10Props {
  data: ResumeData;
}

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
      line-height: 1.2;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .resume-body-copy {
      font-size: var(--resume-body-size);
      line-height: 1.34;
    }

    .resume-item-title {
      font-size: var(--resume-item-title-size);
      line-height: 1.35;
      font-weight: 700;
    }

    .resume-item-subtitle {
      font-size: var(--resume-item-subtitle-size);
      line-height: 1.32;
      color: var(--resume-page-text);
    }

    .resume-item-meta {
      font-size: var(--resume-item-meta-size);
      line-height: 1.3;
      color: var(--resume-muted-text);
    }

    .resume-section-title {
      display: block;
      font-size: var(--resume-heading-size);
      line-height: 1.2;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin: 0 0 0.35em;
    }

    .resume-bullet-list {
      margin: 0;
      padding-left: var(--resume-list-indent, 18px);
      font-size: var(--resume-list-size);
      line-height: 1.34;
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
      margin-top: 8px;
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

    .template10-document {
      display: flex;
      flex-direction: column;
      height: 100%;
      gap: 24px;
    }

    .template10-header {
      text-align: center;
      padding-bottom: 14px;
      border-bottom: 1px solid rgba(15, 23, 42, 0.12);
    }

    .template10-columns {
      display: flex;
      align-items: flex-start;
      gap: 28px;
      flex: 1 1 auto;
      min-height: 0;
    }

    .template10-sidebar {
      width: 31%;
      flex: 0 0 31%;
      min-width: 0;
    }

    .template10-main {
      width: 69%;
      flex: 1 1 auto;
      min-width: 0;
    }

    .template10-section + .template10-section {
      margin-top: 18px;
    }

    .template10-list {
      margin: 0;
      padding-left: 18px;
      list-style: disc;
    }

    .template10-list li + li {
      margin-top: 6px;
    }

    .template10-entry + .template10-entry {
      margin-top: 12px;
    }
  `}</style>
);

const Template10Section = ({
  title,
  theme,
  children,
}: {
  title: string;
  theme: ResumeTemplateTheme;
  children: ReactNode;
}) => (
  <section className="template10-section break-inside-avoid">
    <h3
      style={{
        fontSize: "var(--resume-heading-size)",
        fontWeight: 700,
        lineHeight: 1.25,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: theme.palette.text,
        margin: "0 0 8px",
      }}
    >
      {title}
    </h3>
    <div
      style={{
        height: "1px",
        background: theme.palette.border,
        opacity: 0.3,
        marginBottom: "10px",
      }}
    />
    <div>{children}</div>
  </section>
);

const template10Render = (data: ResumeData, theme: ResumeTemplateTheme) => {
  const compactMode = getCompactMode(data);
  const densityMode = getDensityMode(data);
  const compactLevel = data.compactLevel || 0;
  const densityFactor =
    densityMode === "comfortable" ? 1 : densityMode === "compact" ? 0.88 : 0.82;
  const baseSpacingFactor = compactMode ? 0.92 : 1;
  const compactSpacingFactor = compactLevel === 1 ? 0.9 : compactLevel >= 2 ? 0.8 : 1;

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
    padding: scalePxString(
      clampPadding(theme.pagePadding || "40px 36px"),
      densityFactor * baseSpacingFactor * compactSpacingFactor
    ),
  };

  const summaryText = getSummaryConfig(data).summaryText;
  const experience = sortExperienceReverseChronological(data.experience || []);
  const education = sortEducationReverseChronological(data.education || []);
  const certifications = sortCertificationsReverseChronological(data.certifications || []);
  const contactItems = getContactItems(data);
  const skills = (data.skills || []).filter(Boolean);
  const languages = (data.languages || []).filter((item) => hasText(item.language));
  const strengths = (data.strengths || []).filter(Boolean);
  const projects = data.projects || [];
  const customSections = (data.customSections || []).filter(
    (section) => hasText(section.title) || hasText(section.description) || (section.items || []).length > 0
  );

  const typScale = theme.typographyScale || 1;
  const nameSize = ResumeTypography.name * typScale;
  const roleSize = ResumeTypography.role * typScale;
  const headingSize = ResumeTypography.heading * typScale;
  const bodySize = ResumeTypography.body * typScale;
  const smallSize = ResumeTypography.small * typScale;
  const lineHeight = ResumeTypography.lineHeight || 1.5;

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
          "--resume-heading-size": `${Math.round(headingSize * 100) / 100}px`,
          "--resume-body-size": `${Math.round(bodySize * 100) / 100}px`,
          "--resume-item-title-size": `${Math.round(roleSize * 100) / 100}px`,
          "--resume-item-subtitle-size": `${Math.round(bodySize * 100) / 100}px`,
          "--resume-item-meta-size": `${Math.round(smallSize * 100) / 100}px`,
          "--resume-list-size": `${Math.round(bodySize * 100) / 100}px`,
          "--resume-name-size": `${Math.round(nameSize * 100) / 100}px`,
          "--resume-role-size": `${Math.round(roleSize * 100) / 100}px`,
          "--resume-line-height": `${lineHeight}`,
          "--resume-summary-box-padding": "10px 0",
          "--resume-list-indent": "16px",
          "--resume-contact-separator-gap": "8px",
          "--resume-section-vertical-gap": "8px",
          "--resume-font-family": theme.fontFamily || "Inter, Arial, Helvetica, sans-serif",
        } as CSSProperties),
      }}
      data-density-mode={densityMode}
    >
      <ResumePageStyles />

      <div className="template10-document">
        <header className="template10-header">
          <h1
            style={{
              fontSize: "var(--resume-name-size)",
              lineHeight: 1.15,
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              margin: 0,
              color: theme.palette.nameText || theme.palette.text,
            }}
          >
            {data.fullName}
          </h1>
          {hasText(data.role) ? (
            <p
              style={{
                fontSize: "var(--resume-role-size)",
                lineHeight: 1.35,
                margin: "6px 0 0",
                color: theme.palette.titleText || theme.palette.mutedText,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              {data.role}
            </p>
          ) : null}
        </header>

        <div className="template10-columns">
          <aside className="template10-sidebar">
            {contactItems.length > 0 ? (
              <Template10Section title="Contact" theme={theme}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {contactItems.map((item, index) => (
                    <div key={`${item.label}-${item.value}-${index}`} style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "var(--resume-item-meta-size)",
                          lineHeight: 1.3,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: theme.palette.mutedText,
                        }}
                      >
                        {item.label}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "var(--resume-body-size)",
                          lineHeight: 1.45,
                          color: theme.palette.text,
                          wordBreak: "break-word",
                        }}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </Template10Section>
            ) : null}

            {skills.length > 0 ? (
              <Template10Section title="Skills" theme={theme}>
                <ul className="template10-list">
                  {skills.map((skill, index) => (
                    <li key={`${skill}-${index}`} style={{ fontSize: "var(--resume-body-size)", lineHeight: 1.45 }}>
                      {skill}
                    </li>
                  ))}
                </ul>
              </Template10Section>
            ) : null}

            {languages.length > 0 ? (
              <Template10Section title="Languages" theme={theme}>
                <ul className="template10-list">
                  {languages.map((item, index) => (
                    <li key={`${item.language}-${index}`} style={{ fontSize: "var(--resume-body-size)", lineHeight: 1.45 }}>
                      {hasText(item.level) ? `${item.language} (${item.level})` : item.language}
                    </li>
                  ))}
                </ul>
              </Template10Section>
            ) : null}

            {strengths.length > 0 ? (
              <Template10Section title="Strengths" theme={theme}>
                <ul className="template10-list">
                  {strengths.map((value, index) => (
                    <li key={`${value}-${index}`} style={{ fontSize: "var(--resume-body-size)", lineHeight: 1.45 }}>
                      {value}
                    </li>
                  ))}
                </ul>
              </Template10Section>
            ) : null}

            {customSections.length > 0 ? (
              <Template10Section title="Additional Information" theme={theme}>
                <div>
                  {customSections.map((section, index) => (
                    <div key={`${section.title}-${index}`} className="template10-entry">
                      {hasText(section.title) ? (
                        <p style={{ margin: 0, fontSize: "var(--resume-body-size)", fontWeight: 700, lineHeight: 1.4 }}>
                          {section.title}
                        </p>
                      ) : null}
                      {hasText(section.description) ? (
                        <p style={{ margin: "3px 0 0", fontSize: "var(--resume-body-size)", lineHeight: 1.4 }}>
                          {section.description}
                        </p>
                      ) : null}
                      {(section.items || []).length > 0 ? (
                        <ul className="template10-list" style={{ marginTop: "4px" }}>
                          {(section.items || []).map((item, itemIndex) => (
                            <li key={`${item}-${itemIndex}`} style={{ fontSize: "var(--resume-body-size)", lineHeight: 1.4 }}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ))}
                </div>
              </Template10Section>
            ) : null}
          </aside>

          <main className="template10-main">
            {hasText(summaryText) ? (
              <Template10Section title="Career Objective" theme={theme}>
                <p style={{ margin: 0, fontSize: "var(--resume-body-size)", lineHeight: 1.55 }}>
                  {summaryText}
                </p>
              </Template10Section>
            ) : null}

            {education.length > 0 ? (
              <Template10Section title="Education" theme={theme}>
                <ul className="template10-list">
                  {education.map((item, index) => (
                    <li key={`${item.school}-${item.degree}-${index}`} className="template10-entry">
                      <p style={{ margin: 0, fontSize: "var(--resume-body-size)", fontWeight: 700, lineHeight: 1.4 }}>
                        {item.degree}
                      </p>
                      <p style={{ margin: "3px 0 0", fontSize: "var(--resume-body-size)", lineHeight: 1.4 }}>
                        {item.school}
                      </p>
                      <p style={{ margin: "3px 0 0", fontSize: "var(--resume-item-meta-size)", lineHeight: 1.4, color: theme.palette.mutedText }}>
                        {formatRange(item.startYear, item.endYear)}
                      </p>
                      {hasText(item.gpa) ? (
                        <p style={{ margin: "3px 0 0", fontSize: "var(--resume-item-meta-size)", lineHeight: 1.4, color: theme.palette.mutedText }}>
                          GPA: {item.gpa}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </Template10Section>
            ) : null}

            {experience.length > 0 ? (
              <Template10Section title="Work Experience" theme={theme}>
                <ul className="template10-list">
                  {experience.map((item, index) => (
                    <li key={`${item.company}-${item.role}-${index}`} className="template10-entry">
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "baseline" }}>
                        <p style={{ margin: 0, fontSize: "var(--resume-body-size)", fontWeight: 700, lineHeight: 1.4 }}>
                          {item.role} at {item.company}
                        </p>
                        <p style={{ margin: 0, fontSize: "var(--resume-item-meta-size)", lineHeight: 1.4, color: theme.palette.mutedText }}>
                          {formatRange(item.startDate, item.endDate)}
                        </p>
                      </div>
                      {hasText(item.description) ? (
                        <p style={{ margin: "5px 0 0", fontSize: "var(--resume-body-size)", lineHeight: 1.5 }}>
                          {item.description}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </Template10Section>
            ) : null}

            {projects.length > 0 ? (
              <Template10Section title="Projects" theme={theme}>
                <ul className="template10-list">
                  {projects.map((project, index) => (
                    <li key={`${project.name}-${index}`} className="template10-entry">
                      <p style={{ margin: 0, fontSize: "var(--resume-body-size)", fontWeight: 700, lineHeight: 1.4 }}>
                        {project.name}
                      </p>
                      {hasText(project.description) ? (
                        <p style={{ margin: "5px 0 0", fontSize: "var(--resume-body-size)", lineHeight: 1.5 }}>
                          {project.description}
                        </p>
                      ) : null}
                      {project.technologies.length > 0 ? (
                        <p style={{ margin: "5px 0 0", fontSize: "var(--resume-item-meta-size)", lineHeight: 1.4, color: theme.palette.mutedText }}>
                          Technologies: {uniqueItems(project.technologies).join(", ")}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </Template10Section>
            ) : null}

            {certifications.length > 0 ? (
              <Template10Section title="Certifications" theme={theme}>
                <ul className="template10-list">
                  {certifications.map((item, index) => (
                    <li key={`${item.name}-${item.issuer}-${index}`} style={{ fontSize: "var(--resume-body-size)", lineHeight: 1.45 }}>
                      {item.name}, {item.issuer}, {formatMonthYear(item.year)}
                    </li>
                  ))}
                </ul>
              </Template10Section>
            ) : null}
          </main>
        </div>
      </div>
    </ResumePage>
  );
};

const Template10: React.FC<Template10Props> = ({ data }) =>
  template10Render(data, resolveTemplateTheme(10, data));

export default Template10;
