import type { CSSProperties, ReactNode } from "react";
import { getCompactMode, getDensityMode, getSummaryConfig } from "@/components/resume-templates/templatePolicy";
import {
  formatMonthYear,
  getResumeSectionOrder,
  hasSectionData,
  isFresherResume,
  sortCertificationsReverseChronological,
  sortEducationReverseChronological,
  sortExperienceReverseChronological,
  type ResumeSectionKey,
} from "@/components/resume-templates/resumeSections";
import type { ResumeData } from "@/components/resume-templates/types";
import type { ResumeTemplateTheme } from "@/components/resume-templates/shared";
import { ResumePage, ResumePageStyles } from "@/components/resume-templates/shared";
import { ResumeSection } from "@/components/resume/ResumeSection";
import ResumeHeader from "@/components/resume-shared/ResumeHeader";
import { ResumeTypography } from "@/components/resume-shared/ResumeTypography";

type SectionKey = Exclude<ResumeSectionKey, "header">;

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

const toBulletItems = (value?: string | null) =>
  (value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const uniqueItems = (items: string[]) => [...new Set(items.filter(Boolean))];

const formatRange = (start?: string, end?: string) => {
  const parts = [formatMonthYear(start), formatMonthYear(end)].filter(Boolean);
  return parts.join(" - ");
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
    skills: data.skills.length > 0 ? <p className="resume-body-copy resume-skills">{uniqueItems(data.skills).join(", ")}</p> : null,
    experience:
      experience.length > 0 ? (
        <div className="space-y-3.5">
          {experience.map((item, index) => (
            <div key={`${item.company}-${item.role}-${index}`} className="resume-meta-block break-inside-avoid">
              <h3 className="resume-item-title">{item.role}</h3>
              {item.company ? <p className="resume-item-subtitle mt-1">{item.company}</p> : null}
              {formatRange(item.startDate, item.endDate) ? (
                <p className="resume-item-meta mt-1.5">{formatRange(item.startDate, item.endDate)}</p>
              ) : null}
              <div className="mt-2.5">
                {(item.description || "").trim().split("\n").filter(Boolean).length > 0 ? (
                  <ul className="resume-bullet-list">
                    {toBulletItems(item.description).map((bullet, bulletIndex) => (
                      <li key={`${bullet}-${bulletIndex}`}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : null,
    education:
      education.length > 0 ? (
        <div className="space-y-3.5">
          {education.map((item, index) => (
            <div key={`${item.school}-${item.degree}-${index}`} className="resume-meta-block break-inside-avoid">
              <h3 className="resume-item-title">{item.degree}</h3>
              {item.school ? <p className="resume-item-subtitle mt-1">{item.school}</p> : null}
              {formatRange(item.startYear, item.endYear) ? (
                <p className="resume-item-meta mt-1.5">{formatRange(item.startYear, item.endYear)}</p>
              ) : null}
              {item.gpa ? <p className="resume-item-meta">GPA: {item.gpa}</p> : null}
            </div>
          ))}
        </div>
      ) : null,
    projects:
      data.projects.length > 0 ? (
        <div className="space-y-3.5">
          {data.projects.map((project, index) => (
            <div key={`${project.name}-${index}`} className="resume-meta-block break-inside-avoid">
              <h3 className="resume-item-title">{project.name}</h3>
              {project.link ? <p className="resume-item-meta mt-1.5">{project.link}</p> : null}
              <div className="mt-2.5">
                {project.description ? <p className="resume-body-copy">{project.description}</p> : null}
                {project.technologies.length > 0 ? (
                  <p className="resume-item-meta mt-2">{uniqueItems(project.technologies).join(", ")}</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : null,
    certifications:
      certifications.length > 0 ? (
        <div className="space-y-3">
          {certifications.map((item, index) => (
            <div key={`${item.name}-${item.issuer}-${index}`} className="resume-meta-block break-inside-avoid">
              <h3 className="resume-item-title">{item.name}</h3>
              {item.issuer ? <p className="resume-item-subtitle mt-1">{item.issuer}</p> : null}
              {item.year ? <p className="resume-item-meta mt-1.5">{formatMonthYear(item.year)}</p> : null}
            </div>
          ))}
        </div>
      ) : null,
    achievements:
      data.achievements.length > 0 ? (
        <ul className="resume-bullet-list">
          {uniqueItems(data.achievements).map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      ) : null,
    languages:
      data.languages.length > 0 ? (
        <p className="resume-body-copy resume-skills">
          {data.languages.map((item) =>
            hasText(item.level) ? `${item.language} (${item.level})` : item.language
          ).join(", ")}
        </p>
      ) : null,
    strengths:
      data.strengths.length > 0 ? (
        <p className="resume-body-copy resume-skills">{uniqueItems(data.strengths).join(", ")}</p>
      ) : null,
    hobbies:
      data.hobbies.length > 0 ? (
        <p className="resume-body-copy resume-skills">{uniqueItems(data.hobbies).join(", ")}</p>
      ) : null,
    references:
      data.references.length > 0 ? (
        <ul className="resume-bullet-list">
          {data.references.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      ) : null,
    custom:
      data.customSections.length > 0 ? (
        <div className="space-y-3.5">
          {data.customSections.map((section, index) => {
            const hasItems = (section.items || []).length > 0;
            const hasDescription = hasText(section.description);

            if (!hasText(section.title) || (!hasDescription && !hasItems && !hasText(section.date))) {
              return null;
            }

            return (
              <div key={`${section.title}-${index}`} className="resume-meta-block break-inside-avoid">
                <h3 className="resume-item-title">{section.title}</h3>
                {hasText(section.date) ? <p className="resume-item-meta mt-1.5">{section.date}</p> : null}
                <div className="mt-2.5">
                  {hasDescription ? <p className="resume-body-copy">{section.description}</p> : null}
                  {hasItems ? (
                    <ul className="resume-bullet-list mt-2">
                      {section.items?.map((item, itemIndex) => (
                        <li key={`${item}-${itemIndex}`}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
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
}: {
  keys: SectionKey[];
  sections: Record<SectionKey, ReactNode>;
  summaryTitle: string;
  theme: ResumeTemplateTheme;
  compactMode?: boolean;
}) =>
  keys.map((key) => {
    const content = sections[key];
    if (!content) return null;

    return (
      <ResumeSection
        key={`main-${key}`}
        title={getSectionLabel(key, summaryTitle)}
        theme={theme}
        compactMode={compactMode}
        summaryTitle={summaryTitle}
      >
        {content}
      </ResumeSection>
    );
  });

const ModernLayout = ({
  data,
  theme,
}: {
  data: ResumeData;
  theme: ResumeTemplateTheme;
}) => {
  const { sections, summaryTitle } = buildSectionMap(data);
  const fresherResume = isFresherResume(data);
  const compactMode = getCompactMode(data);
  const densityMode = getDensityMode(data);
  const compactLevel = data.compactLevel || 0;

  const densityScale = densityMode === "comfortable" ? 1 : densityMode === "compact" ? 0.95 : 0.92;
  const typScale = theme.typographyScale || 1;
  const nameBase = (ResumeTypography.name || 32) * typScale;
  const roleBase = (ResumeTypography.role || 15) * typScale;
  const headingBase = (ResumeTypography.heading || 14) * typScale;
  const bodyBase = (ResumeTypography.body || 12) * typScale;
  const smallBase = 10.5 * typScale;

  const nameSize = Math.round(nameBase * densityScale * 100) / 100;
  const roleSize = Math.round(roleBase * densityScale * 100) / 100;
  const headingSize = Math.round(headingBase * densityScale * 100) / 100;
  const bodySize = Math.round(Math.max(10.5, bodyBase * densityScale) * 100) / 100;
  const titleSize = Math.round(Math.max(11, roleBase * densityScale) * 100) / 100;
  const subtitleSize = Math.round(Math.max(10.2, bodyBase * densityScale) * 100) / 100;
  const metaSize = Math.round(Math.max(10.5, smallBase * densityScale) * 100) / 100;
  const listSize = Math.round(Math.max(10, bodyBase * densityScale) * 100) / 100;

  const densityFactor = densityMode === "comfortable" ? 1 : densityMode === "compact" ? 0.88 : 0.82;
  const baseSpacingFactor = compactMode ? 0.92 : 1;
  const compactSpacingFactor = compactLevel === 1 ? 0.9 : compactLevel >= 2 ? 0.8 : 1;
  const rawGap = Math.round(
    (theme.sectionSpacing || 22) * densityFactor * baseSpacingFactor * compactSpacingFactor * (theme.spacingScale || 1)
  );
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

  const scalePxString = (value: string, factor: number) =>
    value.replace(/(\d+(?:\.\d+)?)px/g, (_, amount: string) => {
      const scaled = Math.max(8, Number.parseFloat(amount) * factor);
      return `${Math.round(scaled * 100) / 100}px`;
    });

  const pageStyle: CSSProperties = {
    padding:
      theme.layout === "single"
        ? scalePxString(clampPadding(theme.pagePadding || "36px 32px"), densityFactor * baseSpacingFactor * compactSpacingFactor)
        : "0",
  };

  const mainStyle: CSSProperties = {
    padding: scalePxString(clampPadding(theme.mainPadding || theme.contentPadding || "36px 32px"), densityFactor * baseSpacingFactor * compactSpacingFactor),
  };

  return (
    <ResumePage
      theme={theme}
      style={{
        ...pageStyle,
        ...{
          "--resume-page-bg": theme.palette.page,
          "--resume-page-text": theme.palette.text,
          "--resume-muted-text": theme.palette.mutedText,
          "--resume-border": theme.palette.border,
          "--resume-accent": theme.palette.accent,
          "--resume-accent-soft": theme.palette.accentSoft,
          "--resume-accent-text": theme.palette.accentText,
          "--resume-heading-size": `${headingSize}px`,
          "--resume-body-size": `${bodySize}px`,
          "--resume-item-title-size": `${titleSize}px`,
          "--resume-item-subtitle-size": `${subtitleSize}px`,
          "--resume-item-meta-size": `${metaSize}px`,
          "--resume-list-size": `${listSize}px`,
          "--resume-name-size": `${nameSize}px`,
          "--resume-role-size": `${roleSize}px`,
          "--resume-line-height": `${ResumeTypography.lineHeight || 1.4}`,
          "--resume-summary-box-padding": compactMode || densityMode !== "comfortable" ? "8px 10px" : "10px 12px",
          "--resume-list-indent": densityMode === "comfortable" ? "18px" : "16px",
          "--resume-contact-separator-gap": densityMode === "comfortable" ? "8px" : "6px",
          "--resume-section-vertical-gap": densityMode === "comfortable" && compactLevel === 0 ? "8px" : densityMode === "compact" ? "7px" : "6px",
          "--resume-font-family": theme.fontFamily || "Inter, Arial, Helvetica, sans-serif",
        } as CSSProperties,
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

      {theme.leftAccentLine && theme.layout === "single" ? (
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
      ) : null}

      <div className="flex h-full flex-col" style={{ gap: `${sectionGap}px` }}>
        <ResumeHeader data={data} theme={theme} compactMode={compactMode} />
        <div className="flex flex-col" style={{ gap: `${sectionGap}px` }}>
          {renderSections({
            keys: fresherResume
              ? [
                  ...getResumeSectionOrder("fresher").filter((key): key is SectionKey => key !== "header"),
                  "projects",
                  "achievements",
                  "references",
                  "custom",
                ].filter((key, index, items) => items.indexOf(key) === index && hasSectionData(key, data))
              : theme.mainSections || DEFAULT_SINGLE_ORDER,
            sections,
            summaryTitle,
            theme,
            compactMode,
          })}
        </div>
      </div>
    </ResumePage>
  );
};

export default ModernLayout;
