import React, { type CSSProperties, type ReactNode } from "react";
import { ResumeSection } from "@/components/resume/ResumeSection";
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
import ResumeHeader, { ResumeContactRow } from "@/components/resume-shared/ResumeHeader";
import type { ResumeTemplateTheme } from "./templateThemeTypes";
import { template1Theme } from "./templateThemes";
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
import { ResumeTypography } from "@/constants/resumeDesignSystem";

type SectionKey = Exclude<ResumeSectionKey, "header">;

interface Template1Props {
  data: ResumeData;
}

// === Helper Functions (Template1-specific) ===

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

const getContactItems = (data: ResumeData): { label: string; value: string }[] => {
  const items: { label: string; value: string }[] = [];

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
          color={
            theme.palette.sidebarMutedText ||
            theme.palette.sidebarText ||
            theme.palette.mutedText
          }
          compactMode={compactMode}
          densityMode={densityMode}
        />
      ) : null}
    </div>
  );

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
          <ResumeHeader
            data={data}
            theme={theme}
            compactMode={compactMode}
          />
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
                  <ResumeSidebarContactCard
                    data={data}
                    theme={theme}
                    compactMode={compactMode}
                  />
                ) : (
                  <>
                    {sidebarIntro}
                    {renderSections({
                      keys: fresherResume
                        ? fresherSidebarKeys
                        : experiencedSidebarKeys,
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
              <div
                className="flex flex-col"
                style={{ gap: `${sectionGap}px` }}
              >
                {theme.summaryInHeader ? null : (
                  <ResumeHeader
                    data={data}
                    theme={theme}
                    compactMode={compactMode}
                    densityMode={densityMode}
                  />
                )}
                {renderSections({
                  keys: fresherResume
                    ? fresherMainKeys
                    : experiencedMainKeys,
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

const Template1: React.FC<Template1Props> = ({ data }) => template1Render(data, template1Theme);

export default Template1;
