import type { CSSProperties, ReactNode } from "react";
import { getCompactMode, getSummaryConfig } from "./templatePolicy";
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
  sidebarBg?: string;
  sidebarText?: string;
  sidebarMutedText?: string;
  sidebarBorder?: string;
  sidebarAccentSoft?: string;
  headerBg?: string;
}

export interface ResumeTemplateTheme {
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
  headerDivider?: boolean;
  headerBand?: boolean;
  topAccentBar?: boolean;
  leftAccentLine?: boolean;
  summaryInHeader?: boolean;
}

interface ContactItem {
  label: string;
  value: string;
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

  if (hasText(data.email)) items.push({ label: "Email", value: data.email });
  if (hasText(data.phone)) items.push({ label: "Phone", value: data.phone });
  if (hasText(data.address)) items.push({ label: "Location", value: data.address });

  (data.socialLinks || []).forEach((link) => {
    if (hasText(link.url)) {
      items.push({ label: link.platform || "Link", value: link.url });
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

const buildSectionMap = (data: ResumeData) => {
  const { summaryText, summaryTitle } = getSummaryConfig(data);
  const fresherResume = isFresherResume(data);
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
      ) : fresherResume ? (
        <p className="resume-body-copy">Fresher</p>
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

export const ResumePage = ({
  children,
  theme,
  style,
}: {
  children: ReactNode;
  theme: ResumeTemplateTheme;
  style?: CSSProperties;
}) => (
  <div
    className="resume-theme-root"
    style={{
      width: "794px",
      minHeight: "1123px",
      background: theme.palette.page,
      color: theme.palette.text,
      position: "relative",
      overflow: "hidden",
      border: `1px solid ${theme.palette.border}`,
      fontFamily: theme.fontFamily || "Inter, 'Open Sans', sans-serif",
      ...style,
    }}
  >
    {children}
  </div>
);

export const ResumeContactRow = ({
  items,
  align = "left",
  color,
  compactMode = false,
}: {
  items: ContactItem[];
  align?: "left" | "right";
  color: string;
  compactMode?: boolean;
}) => (
  <div
    className="flex flex-wrap gap-x-3 gap-y-1.5"
    style={{
      justifyContent: align === "right" ? "flex-end" : "flex-start",
      maxWidth: align === "right" ? "390px" : "100%",
    }}
  >
    {items.map((item, index) => (
      <span
        key={`${item.label}-${item.value}-${index}`}
        className="resume-contact-item"
        style={{ color, fontSize: compactMode ? "9.6px" : "10.4px" }}
      >
        {item.value}
      </span>
    ))}
  </div>
);

export const ResumeHeader = ({
  data,
  theme,
  compactMode = false,
}: {
  data: ResumeData;
  theme: ResumeTemplateTheme;
  compactMode?: boolean;
}) => {
  const { summaryText } = getSummaryConfig(data);
  const contactItems = getContactItems(data);

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
              fontSize: compactMode ? "28px" : "32px",
              lineHeight: 1.05,
              color: theme.palette.text,
            }}
          >
            {data.fullName}
          </h1>
          {hasText(data.role) ? (
            <p
              className="mt-2 font-medium uppercase"
              style={{
                fontSize: compactMode ? "12px" : "14px",
                lineHeight: 1.35,
                color: theme.palette.mutedText,
                letterSpacing: "0.08em",
              }}
            >
              {data.role}
            </p>
          ) : null}
        </div>

        {contactItems.length > 0 ? (
          <ResumeContactRow
            items={contactItems}
            align={theme.headerLayout === "split" ? "right" : "left"}
            color={theme.palette.mutedText}
            compactMode={compactMode}
          />
        ) : null}
      </div>

      {theme.summaryInHeader && hasText(summaryText) ? (
        <div className="mt-4">
          <div className="resume-summary-box">
            <p className="resume-body-copy">{summaryText}</p>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export const ResumeHeadingBar = ({
  title,
  theme,
  sidebar = false,
}: {
  title: string;
  theme: ResumeTemplateTheme;
  sidebar?: boolean;
}) => {
  const paletteText = sidebar ? theme.palette.sidebarText || theme.palette.text : theme.palette.text;
  const paletteMuted = sidebar ? theme.palette.sidebarBorder || theme.palette.border : theme.palette.border;

  if (theme.headingStyle === "bar") {
    return (
      <div
        className="inline-block px-3 py-1.5"
        style={{
          background: sidebar ? theme.palette.sidebarAccentSoft || theme.palette.accent : theme.palette.accent,
          color: "#ffffff",
        }}
      >
        <h2 className="resume-heading">{title}</h2>
      </div>
    );
  }

  if (theme.headingStyle === "accent") {
    return (
      <div className="border-l-[4px] pl-3" style={{ borderColor: theme.palette.accent }}>
        <h2 className="resume-heading" style={{ color: paletteText }}>
          {title}
        </h2>
      </div>
    );
  }

  return (
    <div className="pb-1.5" style={{ borderBottom: `1px solid ${paletteMuted}` }}>
      <h2 className="resume-heading" style={{ color: paletteText }}>
        {title}
      </h2>
    </div>
  );
};

export const ResumeSection = ({
  title,
  theme,
  sidebar = false,
  children,
}: {
  title: string;
  theme: ResumeTemplateTheme;
  sidebar?: boolean;
  children: ReactNode;
}) => {
  if (!children) return null;

  return (
    <section
      className="break-inside-avoid space-y-3"
      style={{ color: sidebar ? theme.palette.sidebarText || theme.palette.text : theme.palette.text }}
    >
      <ResumeHeadingBar title={title} theme={theme} sidebar={sidebar} />
      <div>{children}</div>
    </section>
  );
};

export const ResumeSidebar = ({
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
      padding: scalePxString(theme.sidebarPadding || "28px 22px", compactMode ? 0.82 : 1),
    }}
  >
    {children}
  </aside>
);

export const ResumeAccentStrip = ({
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

export const ResumeBulletList = ({
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

export const ResumeTagList = ({
  items,
}: {
  items: string[];
}) => {
  const filteredItems = uniqueItems(items.filter(Boolean));
  if (filteredItems.length === 0) return null;

  return <p className="resume-body-copy">{filteredItems.join(", ")}</p>;
};

export const ResumeMetaBlock = ({
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

export const ResumeTwoColumnLayout = ({
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
    <div className="flex min-h-0 flex-1">
      <div style={{ width: sidebarWidth }}>{sidebar}</div>
      <main style={{ width: mainWidth }}>{main}</main>
    </div>
  );
};

const ResumePageStyles = () => (
  <style>{`
    .resume-theme-root {
      background: var(--resume-page-bg);
      color: var(--resume-page-text);
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
      line-height: 1.55;
    }

    .resume-item-title {
      font-size: var(--resume-item-title-size);
      line-height: 1.35;
      font-weight: 700;
    }

    .resume-item-subtitle {
      font-size: var(--resume-item-subtitle-size);
      line-height: 1.45;
      color: var(--resume-page-text);
    }

    .resume-item-meta {
      font-size: var(--resume-item-meta-size);
      line-height: 1.45;
      color: var(--resume-muted-text);
    }

    .resume-bullet-list {
      margin: 0;
      padding-left: 18px;
      font-size: var(--resume-list-size);
      line-height: 1.55;
    }

    .resume-bullet-list li + li {
      margin-top: 4px;
    }

    .resume-summary-box {
      border-left: 4px solid var(--resume-accent);
      background: var(--resume-accent-soft);
      padding: 12px 14px;
    }

    .resume-contact-item {
      display: inline-flex;
      align-items: center;
      line-height: 1.35;
      white-space: nowrap;
    }

    .resume-contact-item:not(:last-child)::after {
      content: "|";
      margin-left: 10px;
      color: var(--resume-muted-text);
    }

    .resume-meta-block + .resume-meta-block {
      margin-top: 12px;
    }

    .break-inside-avoid {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  `}</style>
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
      <ResumeSection
        key={`${sidebar ? "sidebar" : "main"}-${key}`}
        title={getSectionLabel(key, summaryTitle)}
        theme={theme}
        sidebar={sidebar}
      >
        {content}
      </ResumeSection>
    );
  });

export const renderTemplate = (data: ResumeData, theme: ResumeTemplateTheme) => {
  const { sections, summaryTitle } = buildSectionMap(data);
  const fresherResume = isFresherResume(data);
  const compactMode = getCompactMode(data);
  const spacingFactor = compactMode ? 0.82 : 1;
  const sectionGap = Math.max(16, Math.round((theme.sectionSpacing || 22) * spacingFactor));

  const pageStyle: CSSProperties = {
    padding:
      theme.layout === "single"
        ? scalePxString(theme.pagePadding || "28px 34px", spacingFactor)
        : "0",
  };

  const mainStyle: CSSProperties = {
    padding: scalePxString(theme.mainPadding || theme.contentPadding || "28px 30px", spacingFactor),
  };

  const sidebarIntro = (
    <div className="break-inside-avoid space-y-2.5">
      <h1
        className="font-bold tracking-[0.02em] uppercase"
        style={{
          fontSize: compactMode ? "24px" : "30px",
          lineHeight: 1.06,
          color: theme.palette.sidebarText || theme.palette.text,
        }}
      >
        {data.fullName}
      </h1>
      {hasText(data.role) ? (
        <p
          style={{
            fontSize: compactMode ? "11.5px" : "13px",
            lineHeight: 1.4,
            color: theme.palette.sidebarMutedText || theme.palette.sidebarText || theme.palette.mutedText,
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
        />
      ) : null}
    </div>
  );

  const fresherSectionKeys = [
    ...getResumeSectionOrder("fresher").filter((key): key is SectionKey => key !== "header"),
    "projects",
    "achievements",
    "references",
    "custom",
  ].filter((key, index, items) => items.indexOf(key) === index && hasSectionData(key, data));

  const fresherSidebarKeys = (theme.sidebarSections || DEFAULT_FRESHER_SIDEBAR).filter((key) =>
    fresherSectionKeys.includes(key)
  );
  const fresherMainKeys = DEFAULT_FRESHER_MAIN.filter((key) => hasSectionData(key, data));

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
          "--resume-heading-size": compactMode ? "11px" : "12px",
          "--resume-body-size": compactMode ? "9.7px" : "10.4px",
          "--resume-item-title-size": compactMode ? "10.6px" : "11.2px",
          "--resume-item-subtitle-size": compactMode ? "9.8px" : "10.3px",
          "--resume-item-meta-size": compactMode ? "9.1px" : "9.7px",
          "--resume-list-size": compactMode ? "9.5px" : "10.2px",
        } as CSSProperties),
      }}
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
        <ResumeTwoColumnLayout
          theme={theme}
          sidebar={
            <ResumeSidebar theme={theme} compactMode={compactMode}>
              <div className="flex flex-col" style={{ gap: `${sectionGap}px` }}>
                {sidebarIntro}
                {renderSections({
                  keys: fresherResume ? fresherSidebarKeys : experiencedSidebarKeys,
                  sections,
                  summaryTitle,
                  theme,
                  sidebar: true,
                })}
              </div>
            </ResumeSidebar>
          }
          main={
            <div style={mainStyle}>
              <div className="flex flex-col" style={{ gap: `${sectionGap}px` }}>
                {theme.summaryInHeader ? null : (
                  <ResumeHeader data={data} theme={theme} compactMode={compactMode} />
                )}
                {renderSections({
                  keys: fresherResume ? fresherMainKeys : experiencedMainKeys,
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
