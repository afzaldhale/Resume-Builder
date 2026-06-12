import type { ReactNode } from "react";
import type { ResumeTemplateTheme } from "@/components/resume-templates/templateThemeTypes";
import { ResumeTypography } from "@/constants/resumeDesignSystem";

export type ResumeSectionHeadingVariant =
  | "full-width-bar"
  | "label-bar"
  | "underline"
  | "plain";

const resolveHeadingVariant = (
  theme: ResumeTemplateTheme
): ResumeSectionHeadingVariant => {
  if (theme.headingVariant) {
    return theme.headingVariant;
  }

  if (theme.headingStyle === "bar") {
    return "full-width-bar";
  }

  if (theme.headingStyle === "underline") {
    return "underline";
  }

  if (theme.headingStyle === "accent") {
    return "label-bar";
  }

  return "plain";
};

const getHeadingStyle = (
  theme: ResumeTemplateTheme,
  sidebar: boolean,
  variant: ResumeSectionHeadingVariant
) => {
  const accentColor = theme.palette.accent || theme.palette.headingText || theme.palette.text;
  const headingColor = theme.palette.headingText || (sidebar ? theme.palette.sidebarText : theme.palette.text);

  // compute horizontal page padding (default 48px) from theme.pagePadding if available
  let horizontalPadding = 48;
  try {
    if (theme.pagePadding && typeof theme.pagePadding === "string") {
      const parts = theme.pagePadding.trim().split(/\s+/);
      if (parts.length === 2) horizontalPadding = parseInt(parts[1]) || horizontalPadding;
      else if (parts.length === 4) horizontalPadding = parseInt(parts[1]) || parseInt(parts[3]) || horizontalPadding;
    }
  } catch {
    // ignore
  }

  const fullWidthStyles =
    variant === "full-width-bar"
      ? theme.headingInset
        ? {
            width: "100%",
            marginLeft: "0px",
            boxSizing: "border-box" as const,
          }
        : {
            width: `calc(100% + ${horizontalPadding * 2}px)`,
            marginLeft: `-${horizontalPadding}px`,
            boxSizing: "border-box" as const,
          }
      : {};

  return {
    color: headingColor,
    background: variant === "full-width-bar" ? accentColor : undefined,
    borderColor:
      variant === "underline"
        ? sidebar
          ? theme.palette.sidebarBorder || theme.palette.border
          : theme.palette.border
        : accentColor,
    borderLeft: variant === "label-bar" ? `4px solid ${accentColor}` : undefined,
    padding:
      variant === "full-width-bar"
        ? "10px 12px"
        : variant === "label-bar"
        ? "0px 0px 0px 10px"
        : "0px",
    marginBottom: "6px",
    fontSize: "var(--resume-heading-size)",
    fontWeight: 700,
    letterSpacing: "1px",
    textTransform: "uppercase" as const,
    lineHeight: ResumeTypography.lineHeight,
    ...fullWidthStyles,
  };
};

interface ResumeSectionProps {
  title: string;
  theme: ResumeTemplateTheme;
  sidebar?: boolean;
  compactMode?: boolean;
  summaryTitle?: string;
  children: ReactNode;
}

export const ResumeSection = ({
  title,
  theme,
  sidebar = false,
  compactMode = false,
  summaryTitle,
  children,
}: ResumeSectionProps) => {
  if (!children) return null;

  // mark compactMode param as intentionally unused to satisfy lint
  void compactMode;

  const variant = resolveHeadingVariant(theme);
  const headingStyles = getHeadingStyle(theme, sidebar, variant);

  return (
    <section className="resume-section break-inside-avoid space-y-2" style={{ color: sidebar ? theme.palette.sidebarText || theme.palette.text : theme.palette.text }}>
      <h2
        className={`resume-section-title resume-section-title-${variant}`}
        style={headingStyles}
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
};
