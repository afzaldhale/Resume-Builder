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
// Template11 uses inline structure; shared `ResumeSection` and `ResumeTypography` are not required here.
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

interface Template11Props {
  data: ResumeData;
}

// Template11: local ordering and defaults are handled by shared helpers when needed.

const hasText = (value?: string | null) => Boolean(value && value.trim());

const toBulletItems = (value?: string | null) =>
  (value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

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

// Section labels implemented inline in Template11 where needed.

// Sidebar contact card is replaced by template-local markup below.

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
        <div className="space-y-3.5">
          {education.map((item, index) => (
            <ResumeMetaBlock
              key={`${item.school}-${item.degree}-${index}`}
              title={item.degree}
              subtitle={item.school}
              meta={formatRange(item.startYear, item.endYear)}
            >
              {hasText(item.gpa) ? <p className="resume-item-meta">GPA: {item.gpa}</p> : null}
            </ResumeMetaBlock>
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
              {hasText(project.description) ? <p className="resume-body-copy">{project.description}</p> : null}
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
              subtitle={item.issuer}
              meta={formatMonthYear(item.year)}
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
  `}</style>
);

// A lightweight contact row helper is not required for Template11.

// Header is implemented inline for Template11 below.

// Sidebar element is rendered directly in the template.

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

const Template11Section = ({
  title,
  theme,
  children,
}: {
  title: string;
  theme: ResumeTemplateTheme;
  children: ReactNode;
}) => (
  <section className="break-inside-avoid template11-section">
    <h3
      style={{
        fontSize: "var(--resume-heading-size)",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        margin: "0 0 8px",
        color: theme.palette.text,
      }}
    >
      {title}
    </h3>
    <div>{children}</div>
  </section>
);

// Two-column layout helper is not used by Template11 (custom markup below).

// Section rendering uses template-local components, not the shared renderer.

const template11Render = (data: ResumeData, theme: ResumeTemplateTheme) => {
  const { sections, summaryTitle } = buildSectionMap(data);
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

  // Keep layout spacing and padding calculations; rest is implemented inline below.

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
          /* Enforce Template 1 typography scale exactly */
          "--resume-name-size": "32px",
          "--resume-role-size": "13px",
          "--resume-heading-size": "16px",
          "--resume-body-size": "11px",
          "--resume-item-meta-size": "10px",
          "--resume-list-size": "11px",
          "--resume-line-height": "1.5",
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

      {/* Two-column Word-style layout for Template 11 */}
      <div
        className="template11-document"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: `${sectionGap}px`,
          maxWidth: "720px",
          margin: "0 auto",
          padding: "28px 48px 0",
        }}
      >
        <header style={{ textAlign: "center", paddingBottom: "8px" }}>
          <h1 style={{ margin: 0, fontSize: "var(--resume-name-size)", lineHeight: "1.05", fontWeight: 700, textTransform: "uppercase", color: theme.palette.nameText || theme.palette.text }}>
            {data.fullName}
          </h1>
          {hasText(data.role) ? (
            <p style={{ margin: "6px 0 0", fontSize: "var(--resume-role-size)", color: theme.palette.titleText || theme.palette.mutedText, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {data.role}
            </p>
          ) : null}
        </header>

        <div style={{ display: "flex", gap: "28px", alignItems: "flex-start" }}>
          <aside style={{ width: "31%", flex: `0 0 31%`, minWidth: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: `${sectionGap}px` }}>
              {/* Contact */}
              {getContactItems(data).length > 0 ? (
                <Template11Section title="Contact" theme={theme}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {getContactItems(data).map((c, i) => (
                      <div key={`${c.label}-${i}`}> 
                        <p style={{ margin: 0, fontSize: "var(--resume-item-meta-size)", color: theme.palette.mutedText, textTransform: "uppercase", letterSpacing: "0.06em" }}>{c.label}</p>
                        <p style={{ margin: "3px 0 0", fontSize: "var(--resume-body-size)", color: theme.palette.text }}>{c.value}</p>
                      </div>
                    ))}
                  </div>
                </Template11Section>
              ) : null}

              {/* Skills */}
              {sections.skills ? (
                <Template11Section title="Skills" theme={theme}>
                  <ul style={{ margin: 0, paddingLeft: "18px", listStyle: "disc", listStylePosition: "outside" }}>
                    {(data.skills || []).filter(Boolean).map((s, i) => (
                      <li key={`${s}-${i}`} style={{ marginBottom: 6, fontSize: "var(--resume-body-size)" }}>{s}</li>
                    ))}
                  </ul>
                </Template11Section>
              ) : null}

              {/* Interests (hobbies) */}
              {sections.hobbies ? (
                <Template11Section title="Interests" theme={theme}>
                  <ul style={{ margin: 0, paddingLeft: "18px", listStyle: "disc", listStylePosition: "outside" }}>
                    {(data.hobbies || []).filter(Boolean).map((h, i) => (
                      <li key={`${h}-${i}`} style={{ marginBottom: 6, fontSize: "var(--resume-body-size)" }}>{h}</li>
                    ))}
                  </ul>
                </Template11Section>
              ) : null}

              {/* Languages */}
              {sections.languages ? (
                <Template11Section title="Languages" theme={theme}>
                  <ul style={{ margin: 0, paddingLeft: "18px", listStyle: "disc", listStylePosition: "outside" }}>
                    {(data.languages || []).filter(Boolean).map((l, i) => (
                      <li key={`${l.language}-${i}`} style={{ marginBottom: 6, fontSize: "var(--resume-body-size)" }}>{hasText(l.level) ? `${l.language} (${l.level})` : l.language}</li>
                    ))}
                  </ul>
                </Template11Section>
              ) : null}

              {/* Additional Info */}
              {sections.custom ? (
                <Template11Section title="Additional Information" theme={theme}>
                  <div>
                    {(data.customSections || []).map((section, idx) => (
                      <div key={`${section.title}-${idx}`} style={{ marginBottom: 8 }}>
                        {hasText(section.title) ? <p style={{ margin: 0, fontWeight: 700 }}>{section.title}</p> : null}
                        {hasText(section.description) ? <p style={{ margin: "4px 0 0", fontSize: "var(--resume-body-size)" }}>{section.description}</p> : null}
                      </div>
                    ))}
                  </div>
                </Template11Section>
              ) : null}
            </div>
          </aside>

          <div aria-hidden style={{ width: 1, background: theme.palette.divider || theme.palette.border, alignSelf: "stretch", margin: "0 12px" }} />

          <main style={{ width: "69%", flex: "1 1 auto", minWidth: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: `${sectionGap}px` }}>
              {/* Summary */}
              {sections.summary ? (
                <Template11Section title={summaryTitle || "Summary"} theme={theme}>
                  <p style={{ margin: 0, fontSize: "var(--resume-body-size)", lineHeight: parseFloat(String("1.5")) }}>{getSummaryConfig(data).summaryText}</p>
                </Template11Section>
              ) : null}

              {/* Education moved to main per user request */}
              {sections.education ? (
                <Template11Section title="Education" theme={theme}>
                  <div>
                    {sortEducationReverseChronological(data.education || []).map((edu, i) => (
                      <div key={`${edu.school}-${i}`} style={{ marginBottom: 10 }}>
                        <p style={{ margin: 0, fontSize: "var(--resume-body-size)", fontWeight: 700 }}>{edu.degree}</p>
                        <p style={{ margin: "3px 0 0", fontSize: "var(--resume-body-size)" }}>{edu.school}</p>
                        <p style={{ margin: "3px 0 0", fontSize: "var(--resume-item-meta-size)", color: theme.palette.mutedText }}>{formatRange(edu.startYear, edu.endYear)}</p>
                        {hasText(edu.gpa) ? <p style={{ margin: "4px 0 0", fontSize: "var(--resume-item-meta-size)", color: theme.palette.mutedText }}>GPA: {edu.gpa}</p> : null}
                      </div>
                    ))}
                  </div>
                </Template11Section>
              ) : null}

              {/* Work Experience */}
              {sections.experience ? (
                <Template11Section title="Work Experience" theme={theme}>
                  <div>
                    {sortExperienceReverseChronological(data.experience || []).map((item, idx) => (
                      <div key={`${item.company}-${idx}`} style={{ marginBottom: 12 }}>
                        <p style={{ margin: 0, fontSize: "var(--resume-body-size)", fontWeight: 700 }}>{item.role} — {item.company}</p>
                        <p style={{ margin: "4px 0 0", fontSize: "var(--resume-item-meta-size)", color: theme.palette.mutedText }}>{formatRange(item.startDate, item.endDate)}</p>
                        {hasText(item.description) ? (
                          <div style={{ marginTop: 6 }}>
                            {toBulletItems(item.description).length > 1 ? (
                              <ul style={{ margin: 0, paddingLeft: 18, listStyle: "disc", listStylePosition: "outside" }}>
                                {toBulletItems(item.description).map((b, bi) => (
                                  <li key={`${bi}`} style={{ marginBottom: 6, fontSize: "var(--resume-body-size)" }}>{b}</li>
                                ))}
                              </ul>
                            ) : (
                              <p style={{ margin: 0, fontSize: "var(--resume-body-size)", lineHeight: 1.5 }}>{item.description}</p>
                            )}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </Template11Section>
              ) : null}

              {/* Projects */}
              {sections.projects ? (
                <Template11Section title="Projects" theme={theme}>
                  <div>
                    {(data.projects || []).map((project, i) => (
                      <div key={`${project.name}-${i}`} style={{ marginBottom: 10 }}>
                        <p style={{ margin: 0, fontSize: "var(--resume-body-size)", fontWeight: 700 }}>{project.name}</p>
                        {hasText(project.description) ? <p style={{ margin: "4px 0 0", fontSize: "var(--resume-body-size)" }}>{project.description}</p> : null}
                        {project.technologies && project.technologies.length > 0 ? (
                          <p style={{ margin: "4px 0 0", fontSize: "var(--resume-item-meta-size)", color: theme.palette.mutedText }}>Technologies: {uniqueItems(project.technologies).join(", ")}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </Template11Section>
              ) : null}

              {/* Certifications */}
              {sections.certifications ? (
                <Template11Section title="Certifications" theme={theme}>
                  <ul style={{ margin: 0, paddingLeft: 18, listStyle: "disc", listStylePosition: "outside" }}>
                    {sortCertificationsReverseChronological(data.certifications || []).map((c, i) => (
                      <li key={`${c.name}-${i}`} style={{ marginBottom: 6, fontSize: "var(--resume-body-size)" }}>{c.name}{c.issuer ? ` — ${c.issuer}` : ""}{c.year ? `, ${formatMonthYear(c.year)}` : ""}</li>
                    ))}
                  </ul>
                </Template11Section>
              ) : null}
            </div>
          </main>
        </div>
      </div>
    </ResumePage>
  );
};

const Template11: React.FC<Template11Props> = ({ data }) =>
  template11Render(data, resolveTemplateTheme(11, data));

export default Template11;
