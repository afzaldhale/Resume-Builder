import React, { type CSSProperties, type ReactNode } from "react";
import {
  ResumePage,
  ResumePageStyles,
  ResumeSidebar,
  ResumeTwoColumnLayout,
  ResumeAccentStrip,
  ResumeBulletList,
  ResumeTagList,
  ResumeMetaBlock,
  ResumeSidebarContactCard,
} from "./templatePrimitives";
import type { ResumeTemplateTheme } from "./templateThemeTypes";
import { getCompactMode, getDensityMode, getSummaryConfig } from "./templatePolicy";
import { resolveTemplateTheme } from "./themeConfig";
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
import { ResumeTypography } from "@/constants/resumeDesignSystem";

type SectionKey = Exclude<ResumeSectionKey, "header">;

interface Template1Props {
  data: ResumeData;
}

// === Helper Functions (Template1-specific) ===

const TEMPLATE1_BULLET = "\u2022";
const TEMPLATE1_BULLET_INDENT = 12;

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
  return parts.join(" \u2013 ");
};

const toTemplate1BulletItems = (value?: string[] | string | null) => {
  if (Array.isArray(value)) {
    return value.map((item) => item?.trim()).filter(Boolean) as string[];
  }

  return toBulletItems(value);
};

const Template1BulletLine = ({
  text,
  title = false,
}: {
  text: string;
  title?: boolean;
}) => (
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
        lineHeight: "1.34",
        color: "var(--resume-page-text)",
        flexShrink: 0,
      }}
    >
      {TEMPLATE1_BULLET}
    </span>
    <div
      className={title ? "resume-item-title" : "resume-body-copy"}
      style={
        title
          ? {
              flex: 1,
              minWidth: 0,
              fontWeight: 700,
              color: "var(--resume-page-text)",
            }
          : {
              flex: 1,
              minWidth: 0,
            }
      }
    >
      {text}
    </div>
  </div>
);

const Template1BulletList = ({
  items,
  className = "",
}: {
  items: string[];
  className?: string;
}) => {
  const filteredItems = items.filter(Boolean);
  if (filteredItems.length === 0) return null;

  return (
    <div
      className={className}
      style={{
        marginLeft: `${TEMPLATE1_BULLET_INDENT}px`,
        paddingLeft: 0,
        display: "grid",
        rowGap: "2px",
      }}
    >
      {filteredItems.map((item, index) => (
        <Template1BulletLine key={`${item}-${index}`} text={item} />
      ))}
    </div>
  );
};

const Template1TagList = ({
  items,
}: {
  items: string[];
}) => {
  const filteredItems = uniqueItems(items.filter(Boolean));
  if (filteredItems.length === 0) return null;

  return (
    <p className="resume-body-copy resume-skills" style={{ margin: 0 }}>
      {filteredItems.join(", ")}
    </p>
  );
};

const Template1StructuredEntry = ({
  title,
  subtitle,
  meta,
  bullets,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  bullets?: string[];
}) => (
  <div className="resume-meta-block break-inside-avoid">
    <Template1BulletLine text={title} title />
    <div style={{ marginLeft: `${TEMPLATE1_BULLET_INDENT}px` }}>
      {hasText(subtitle) ? <p className="resume-item-subtitle mt-1">{subtitle}</p> : null}
      {hasText(meta) ? <p className="resume-item-meta mt-1.5">{meta}</p> : null}
    </div>
    {bullets && bullets.length > 0 ? (
      <div className="mt-2.5">
        <Template1BulletList items={bullets} />
      </div>
    ) : null}
  </div>
);

const Template1Header = ({
  data,
  theme,
}: {
  data: ResumeData;
  theme: ResumeTemplateTheme;
}) => {
  const normalizedRole = (data.role || "").trim().toLowerCase();
  const subtitle =
    data.candidateType === "fresher" && !normalizedRole.includes("fresher")
      ? "(FRESHER)"
      : "";
  const headerContacts = [
    hasText(data.phone) ? { label: "Mobile", value: data.phone } : null,
    hasText(data.email) ? { label: "Email ID", value: data.email } : null,
    hasText(data.address) ? { label: "Address", value: data.address } : null,
    ...(data.socialLinks || [])
      .filter((link) => hasText(link.url))
      .map((link) => ({
        label: hasText(link.platform) ? link.platform : "Link",
        value: link.url,
      })),
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <header
      className="break-inside-avoid"
      style={{
        margin: "-12px -20px 0",
        padding: "24px 28px 16px",
        borderBottom: `1px solid ${theme.palette.border}`,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(220px, 320px)",
          columnGap: "20px",
          alignItems: "flex-start",
        }}
      >
        <div
          className="min-w-0"
          style={{
            display: "grid",
            rowGap: "4px",
            alignContent: "start",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 800,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              color: theme.palette.nameText || theme.palette.text,
              lineHeight: 1.1,
            }}
          >
            {data.fullName}
          </h1>
          {hasText(data.role) ? (
            <p
              style={{
                margin: "2px 0 0",
                fontSize: "22px",
                fontWeight: 300,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                color: theme.palette.titleText || theme.palette.mutedText,
                lineHeight: 1.15,
              }}
            >
              {data.role}
            </p>
          ) : null}
          {hasText(subtitle) ? (
            <p
              style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: 300,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                color: theme.palette.titleText || theme.palette.mutedText,
                lineHeight: 1.15,
              }}
            >
              {subtitle}
            </p>
          ) : null}
        </div>

        {headerContacts.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "max-content auto minmax(0, 1fr)",
              columnGap: "4px",
              rowGap: "4px",
              alignContent: "start",
              minWidth: 0,
              alignSelf: "start",
            }}
          >
            {headerContacts.map((item, index) => (
              <div
                key={`${item.label}-${item.value}-${index}`}
                style={{
                  display: "contents",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: theme.palette.mutedText,
                    textAlign: "left",
                    lineHeight: 1.35,
                    whiteSpace: "nowrap",
                    margin: 0,
                    padding: 0,
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: theme.palette.mutedText,
                    lineHeight: 1.35,
                  }}
                >
                  :
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: theme.palette.mutedText,
                    lineHeight: 1.35,
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                    minWidth: 0,
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </header>
  );
};

const Template1Section = ({
  title,
  summaryTitle,
  theme,
  children,
  avoidBreakInside = true,
}: {
  title: string;
  summaryTitle: string;
  theme: ResumeTemplateTheme;
  children: ReactNode;
  avoidBreakInside?: boolean;
}) => (
  <section
    className={`resume-section${avoidBreakInside ? " break-inside-avoid" : ""}`}
    style={{ color: theme.palette.text }}
  >
    <h2
      className="resume-section-title"
      style={{
        margin: "12px 0 8px",
        padding: "6px 10px",
        background: theme.palette.accent,
        color: theme.palette.headingText || theme.palette.accentText,
        fontSize: "11pt",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.75pt",
        lineHeight: 1.2,
      }}
    >
      {title}
    </h2>
    <div
      className={`resume-section-content ${
        title === summaryTitle ? "resume-section-summary-plain" : ""
      }`.trim()}
    >
      {children}
    </div>
  </section>
);

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

// === Template1-specific defaults ===

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
];

// === Section rendering for Template1 ===

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
          {experience.map((item, index) => {
            const title = [item.role, item.company].filter(hasText).join(" at ");
            const responsibilities = toTemplate1BulletItems(
              item.description as string | string[] | null | undefined
            );

            return (
              <Template1StructuredEntry
                key={`${item.company}-${item.role}-${index}`}
                title={title}
                meta={formatRange(item.startDate, item.endDate)}
                bullets={responsibilities}
              />
            );
          })}
        </div>
      ) : null,
    education:
      education.length > 0 ? (
        <div className="space-y-3.5">
          {education.map((item, index) => (
            <Template1StructuredEntry
              key={`${item.school}-${item.degree}-${index}`}
              title={item.degree}
              subtitle={item.school}
              meta={formatRange(item.startYear, item.endYear)}
              bullets={hasText(item.gpa) ? [`GPA: ${item.gpa}`] : undefined}
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
            <Template1StructuredEntry
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
        <Template1BulletList
          items={data.languages.map((item) =>
            hasText(item.level) ? `${item.language} (${item.level})` : item.language
          )}
        />
      ) : null,
    strengths:
      (data.strengths || []).length > 0 ? (
        <Template1TagList items={data.strengths || []} />
      ) : null,
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

const renderSections = ({
  keys,
  sections,
  summaryTitle,
  theme,
}: {
  keys: SectionKey[];
  sections: Record<SectionKey, ReactNode>;
  summaryTitle: string;
  theme: ResumeTemplateTheme;
}) =>
  keys.map((key) => {
    const content = sections[key];
    if (!content) return null;

    return (
      <Template1Section
        key={`main-${key}`}
        title={getSectionLabel(key, summaryTitle)}
        summaryTitle={summaryTitle}
        theme={theme}
        avoidBreakInside={key !== "languages" && key !== "strengths"}
      >
        {content}
      </Template1Section>
    );
  });

// === Template1 Main Renderer ===

const template1Render = (data: ResumeData, theme: ResumeTemplateTheme) => {
  const { sections, summaryTitle } = buildSectionMap(data);
  const fresherResume = isFresherResume(data);
  const compactMode = getCompactMode(data);
  const densityMode = getDensityMode(data);
  const compactLevel = data.compactLevel || 0;
  const densityFactor =
    densityMode === "comfortable" ? 1 : densityMode === "compact" ? 0.88 : 0.82;
  const baseSpacingFactor = compactMode ? 0.92 : 1;
  const compactSpacingFactor =
    compactLevel === 1 ? 0.9 : compactLevel >= 2 ? 0.8 : 1;
  const rawGap = Math.round(
    (theme.sectionSpacing || 22) *
      densityFactor *
      baseSpacingFactor *
      compactSpacingFactor *
      (theme.spacingScale || 1)
  );
  const minSectionGap =
    densityMode === "comfortable" && compactLevel === 0 ? 12 : 10;
  const sectionGap = Math.max(minSectionGap, Math.min(16, rawGap));

  const clampPadding = (padding: string) => {
    try {
      const parts = padding
        .trim()
        .split(/\s+/)
        .map((p) => parseInt(p, 10) || 0);
      let vert = parts.length === 4 ? parts[0] + parts[2] : parts[0] || 36;
      let horiz = parts.length === 4 ? parts[1] + parts[3] : parts[1] || parts[0] || 32;
      vert = Math.round(vert / (parts.length === 4 ? 2 : 1));
      horiz = Math.round(horiz / (parts.length === 4 ? 2 : 1));
      const minPadding =
        densityMode === "comfortable" && compactLevel === 0
          ? 32
          : densityMode === "compact" || compactLevel >= 1
          ? 28
          : 24;
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
        ? scalePxString(
            clampPadding(theme.pagePadding || "36px 32px"),
            densityFactor * baseSpacingFactor * compactSpacingFactor
          )
        : "0",
  };

  const mainStyle: CSSProperties = {
    padding: scalePxString(
      clampPadding(theme.mainPadding || theme.contentPadding || "36px 32px"),
      densityFactor * baseSpacingFactor * compactSpacingFactor
    ),
  };

  const fresherSectionKeys = [
    ...getResumeSectionOrder("fresher").filter(
      (key): key is SectionKey => key !== "header"
    ),
    "projects" as SectionKey,
    "achievements" as SectionKey,
    "references" as SectionKey,
    "custom" as SectionKey,
  ].filter(
    (key, index, items) =>
      items.indexOf(key) === index && hasSectionData(key as ResumeSectionKey, data)
  );

  const fresherSidebarKeys = (theme.sidebarSections || DEFAULT_FRESHER_SIDEBAR).filter(
    (key: SectionKey) => fresherSectionKeys.includes(key)
  );
  const fresherMainKeys = (theme.fresherMainSections || DEFAULT_FRESHER_MAIN).filter(
    (key) => hasSectionData(key, data)
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
  const headingSize = headingBase * densityScale;
  const bodySize = Math.max(10.5, bodyBase * densityScale);
  const titleSize = Math.max(11, (ResumeTypography.role || 15) * typScale * densityScale);
  const subtitleSize = Math.max(
    10.2,
    (ResumeTypography.body || 12) * typScale * densityScale
  );
  const metaSize = Math.max(10.5, smallBase * densityScale);
  const listSize = Math.max(10, (ResumeTypography.body || 12) * typScale * densityScale);

  return (
    <ResumePage
      theme={theme}
      style={{
        ...pageStyle,
        border: "none",
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
          "--resume-summary-box-padding":
            compactMode || densityMode !== "comfortable" ? "8px 10px" : "10px 12px",
          "--resume-list-indent":
            densityMode === "comfortable" ? "18px" : "16px",
          "--resume-contact-separator-gap":
            densityMode === "comfortable" ? "8px" : "6px",
          "--resume-section-vertical-gap":
            densityMode === "comfortable" && compactLevel === 0
              ? "8px"
              : densityMode === "compact"
              ? "7px"
              : "6px",
          "--resume-font-family":
            theme.fontFamily ||
            "Inter, Arial, Helvetica, sans-serif",
        } as CSSProperties),
      }}
      data-density-mode={densityMode}
    >
      <ResumePageStyles />

      {theme.topAccentBar ? (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "0 0 auto 0",
            height: "8px",
            background: theme.palette.accent,
          }}
        />
      ) : null}

      {theme.leftAccentLine && theme.layout === "single" ? (
        <ResumeAccentStrip theme={theme} />
      ) : null}

      {theme.layout === "single" ? (
        <div className="flex h-full flex-col" style={{ gap: `${sectionGap}px` }}>
          <Template1Header data={data} theme={theme} />
          <div
            className="flex flex-col"
            style={{ gap: `${sectionGap}px` }}
          >
            {renderSections({
              keys: fresherResume
                ? fresherSectionKeys
                : theme.mainSections || DEFAULT_SINGLE_ORDER,
              sections,
              summaryTitle,
              theme,
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
                  <ResumeSidebarContactCard
                    data={data}
                    theme={theme}
                    compactMode={compactMode}
                  />
                ) : (
                  <>
                    {renderSections({
                      keys: fresherResume
                        ? fresherSidebarKeys
                        : experiencedSidebarKeys,
                      sections,
                      summaryTitle,
                      theme,
                    })}
                  </>
                )}
              </div>
            </ResumeSidebar>
          }
          main={
            <div style={mainStyle}>
              <div
                className="flex flex-col"
                style={{ gap: `${sectionGap}px` }}
              >
                {theme.summaryInHeader ? null : <Template1Header data={data} theme={theme} />}
                {renderSections({
                  keys: fresherResume
                    ? fresherMainKeys
                    : experiencedMainKeys,
                  sections,
                  summaryTitle,
                  theme,
                })}
              </div>
            </div>
          }
        />
      )}
    </ResumePage>
  );
};

const Template1: React.FC<Template1Props> = ({ data }) =>
  template1Render(data, resolveTemplateTheme(1, data));

export default Template1;
