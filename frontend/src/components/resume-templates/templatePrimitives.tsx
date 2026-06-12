import type { CSSProperties, ReactNode } from "react";
import type { ResumeData } from "./types";
import type { ResumeTemplateTheme } from "./templateThemeTypes";

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

export const ResumePageStyles = () => (
  <style>{`
    .resume-theme-root {
      background: var(--resume-page-bg);
      color: var(--resume-page-text);
      height: 1123px;
    }

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

    .resume-item-title {
      font-size: var(--resume-item-title-size);
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

const hasText = (value?: string | null) => Boolean(value && value.trim());

const uniqueItems = (items: string[]) => [...new Set(items.filter(Boolean))];

const scalePxString = (value: string, factor: number) =>
  value.replace(/(\d+(?:\.\d+)?)px/g, (_, amount: string) => {
    const scaled = Math.max(8, Number.parseFloat(amount) * factor);
    return `${Math.round(scaled * 100) / 100}px`;
  });

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
    className="self-stretch"
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

  return <p className="resume-body-copy resume-skills">{filteredItems.join(", ")}</p>;
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
    <div className="resume-two-column-layout flex h-full items-stretch">
      <div className="resume-sidebar" style={{ width: sidebarWidth, flex: `0 0 ${sidebarWidth}` }}>
        {sidebar}
      </div>
      <main className="resume-main" style={{ width: mainWidth }}>
        {main}
      </main>
    </div>
  );
};

export const ResumeSidebarContactCard = ({
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
              {item.label === "Phone" ? "â˜Ž" : item.label === "Email" ? "âœ‰" : item.label === "Location" ? "ðŸ“" : "ðŸ”—"}
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
