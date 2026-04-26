import type { CSSProperties, ReactNode } from "react";
import type { ResumeData, ExperienceItem, ProjectItem, CustomSectionItem } from "./types";

type Density = "comfortable" | "balanced" | "compact";
type LayoutVariant =
  | "executive"
  | "swiss"
  | "sidebar-left"
  | "gradient-tech"
  | "serif"
  | "classic"
  | "startup"
  | "luxury-dark"
  | "analyst"
  | "designer"
  | "timeline"
  | "glass"
  | "international"
  | "futuristic"
  | "leadership";
type HeaderVariant =
  | "stacked"
  | "centered"
  | "split"
  | "band"
  | "card"
  | "banner"
  | "minimal";
type SectionVariant = "line" | "filled" | "boxed" | "pill";
type TagVariant = "solid" | "outline" | "soft" | "dark";

export interface ThemeTokens {
  id: number;
  name: string;
  layout: LayoutVariant;
  headerVariant: HeaderVariant;
  sectionVariant: SectionVariant;
  tagVariant: TagVariant;
  pageClassName: string;
  bodyClassName: string;
  mainClassName: string;
  sidebarClassName?: string;
  accentClassName: string;
  mutedClassName: string;
  dividerClassName: string;
  headerBadgeClassName: string;
  sectionTitleClassName: string;
  sectionLineClassName: string;
  tagClassName: string;
  timelineDotClassName: string;
  sidebarTitle?: string;
  summaryTitle?: string;
  sidebarOrder?: Array<"contact" | "skills" | "languages" | "certifications" | "strengths" | "references" | "social" | "hobbies">;
  mainOrder?: Array<"summary" | "experience" | "projects" | "education" | "custom">;
}

const TEMPLATES: Record<number, ThemeTokens> = {
  1: {
    id: 1,
    name: "Executive Corporate",
    layout: "executive",
    headerVariant: "split",
    sectionVariant: "line",
    tagVariant: "soft",
    pageClassName: "bg-white text-slate-900",
    bodyClassName: "bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_18%,#ffffff_100%)]",
    mainClassName: "",
    accentClassName: "text-slate-900",
    mutedClassName: "text-slate-600",
    dividerClassName: "bg-slate-200",
    headerBadgeClassName: "bg-amber-100 text-amber-900 border border-amber-200",
    sectionTitleClassName: "text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-800",
    sectionLineClassName: "bg-amber-300/70",
    tagClassName: "bg-slate-100 text-slate-700 border border-slate-200",
    timelineDotClassName: "bg-amber-500",
    sidebarTitle: "Executive Profile",
  },
  2: {
    id: 2,
    name: "Minimal Swiss Style",
    layout: "swiss",
    headerVariant: "minimal",
    sectionVariant: "line",
    tagVariant: "outline",
    pageClassName: "bg-white text-neutral-950",
    bodyClassName: "bg-white",
    mainClassName: "",
    accentClassName: "text-neutral-950",
    mutedClassName: "text-neutral-600",
    dividerClassName: "bg-neutral-200",
    headerBadgeClassName: "bg-white text-neutral-700 border border-neutral-300",
    sectionTitleClassName: "text-[10px] font-semibold uppercase tracking-[0.35em] text-neutral-900",
    sectionLineClassName: "bg-neutral-900",
    tagClassName: "bg-white text-neutral-700 border border-neutral-300",
    timelineDotClassName: "bg-neutral-900",
  },
  3: {
    id: 3,
    name: "Modern Sidebar Layout",
    layout: "sidebar-left",
    headerVariant: "stacked",
    sectionVariant: "filled",
    tagVariant: "solid",
    pageClassName: "bg-white text-slate-900",
    bodyClassName: "bg-slate-50",
    mainClassName: "",
    sidebarClassName: "bg-slate-900 text-white",
    accentClassName: "text-teal-600",
    mutedClassName: "text-slate-600",
    dividerClassName: "bg-slate-200",
    headerBadgeClassName: "bg-teal-500/15 text-teal-700 border border-teal-200",
    sectionTitleClassName: "text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-900",
    sectionLineClassName: "bg-teal-500",
    tagClassName: "bg-teal-500 text-white border border-teal-500",
    timelineDotClassName: "bg-teal-500",
    sidebarTitle: "Core Capabilities",
  },
  4: {
    id: 4,
    name: "Bold Tech Gradient",
    layout: "gradient-tech",
    headerVariant: "band",
    sectionVariant: "filled",
    tagVariant: "solid",
    pageClassName: "bg-slate-950 text-white",
    bodyClassName: "bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.32),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.28),_transparent_30%),linear-gradient(180deg,#020617,#0f172a)]",
    mainClassName: "",
    accentClassName: "text-cyan-300",
    mutedClassName: "text-slate-300",
    dividerClassName: "bg-white/10",
    headerBadgeClassName: "bg-white/10 text-cyan-200 border border-cyan-400/30",
    sectionTitleClassName: "text-[10px] font-semibold uppercase tracking-[0.32em] text-cyan-200",
    sectionLineClassName: "bg-gradient-to-r from-cyan-400 to-indigo-400",
    tagClassName: "bg-white/10 text-cyan-100 border border-white/10",
    timelineDotClassName: "bg-cyan-400",
  },
  5: {
    id: 5,
    name: "Elegant Serif Professional",
    layout: "serif",
    headerVariant: "centered",
    sectionVariant: "pill",
    tagVariant: "soft",
    pageClassName: "bg-[#fffdfa] text-stone-900",
    bodyClassName: "bg-[linear-gradient(180deg,#fffdfa_0%,#fff8ef_100%)]",
    mainClassName: "font-serif",
    accentClassName: "text-rose-900",
    mutedClassName: "text-stone-600",
    dividerClassName: "bg-stone-200",
    headerBadgeClassName: "bg-rose-100 text-rose-900 border border-rose-200",
    sectionTitleClassName: "text-[10px] font-semibold uppercase tracking-[0.28em] text-rose-900",
    sectionLineClassName: "bg-rose-300",
    tagClassName: "bg-rose-50 text-rose-900 border border-rose-200",
    timelineDotClassName: "bg-rose-700",
  },
  6: {
    id: 6,
    name: "ATS Classic",
    layout: "classic",
    headerVariant: "stacked",
    sectionVariant: "line",
    tagVariant: "outline",
    pageClassName: "bg-white text-black",
    bodyClassName: "bg-white",
    mainClassName: "",
    accentClassName: "text-black",
    mutedClassName: "text-neutral-700",
    dividerClassName: "bg-neutral-300",
    headerBadgeClassName: "bg-neutral-100 text-neutral-700 border border-neutral-300",
    sectionTitleClassName: "text-[10px] font-bold uppercase tracking-[0.24em] text-black",
    sectionLineClassName: "bg-black",
    tagClassName: "bg-white text-black border border-neutral-400",
    timelineDotClassName: "bg-black",
  },
  7: {
    id: 7,
    name: "Startup Creative",
    layout: "startup",
    headerVariant: "card",
    sectionVariant: "boxed",
    tagVariant: "solid",
    pageClassName: "bg-[#fcfcfd] text-slate-900",
    bodyClassName: "bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.22),_transparent_28%),linear-gradient(180deg,#f8fafc,#ffffff)]",
    mainClassName: "",
    accentClassName: "text-emerald-700",
    mutedClassName: "text-slate-600",
    dividerClassName: "bg-slate-200",
    headerBadgeClassName: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    sectionTitleClassName: "text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-900",
    sectionLineClassName: "bg-emerald-500",
    tagClassName: "bg-emerald-500 text-white border border-emerald-500",
    timelineDotClassName: "bg-emerald-500",
  },
  8: {
    id: 8,
    name: "Luxury Dark Theme",
    layout: "luxury-dark",
    headerVariant: "banner",
    sectionVariant: "pill",
    tagVariant: "dark",
    pageClassName: "bg-[#101113] text-stone-100",
    bodyClassName: "bg-[linear-gradient(180deg,#111315,#18181b)]",
    mainClassName: "",
    accentClassName: "text-amber-300",
    mutedClassName: "text-stone-300",
    dividerClassName: "bg-white/10",
    headerBadgeClassName: "bg-amber-300/15 text-amber-200 border border-amber-300/20",
    sectionTitleClassName: "text-[10px] font-semibold uppercase tracking-[0.32em] text-amber-200",
    sectionLineClassName: "bg-amber-300/80",
    tagClassName: "bg-white/5 text-stone-100 border border-white/10",
    timelineDotClassName: "bg-amber-300",
  },
  9: {
    id: 9,
    name: "Clean Two Column Analyst",
    layout: "analyst",
    headerVariant: "split",
    sectionVariant: "line",
    tagVariant: "soft",
    pageClassName: "bg-white text-slate-900",
    bodyClassName: "bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_20%)]",
    mainClassName: "",
    accentClassName: "text-emerald-700",
    mutedClassName: "text-slate-600",
    dividerClassName: "bg-slate-200",
    headerBadgeClassName: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    sectionTitleClassName: "text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-900",
    sectionLineClassName: "bg-emerald-500",
    tagClassName: "bg-emerald-50 text-emerald-800 border border-emerald-100",
    timelineDotClassName: "bg-emerald-500",
  },
  10: {
    id: 10,
    name: "Product Designer Style",
    layout: "designer",
    headerVariant: "card",
    sectionVariant: "filled",
    tagVariant: "soft",
    pageClassName: "bg-white text-slate-900",
    bodyClassName: "bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.15),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.14),_transparent_32%),#ffffff]",
    mainClassName: "",
    accentClassName: "text-violet-700",
    mutedClassName: "text-slate-600",
    dividerClassName: "bg-slate-200",
    headerBadgeClassName: "bg-violet-100 text-violet-800 border border-violet-200",
    sectionTitleClassName: "text-[10px] font-semibold uppercase tracking-[0.26em] text-violet-900",
    sectionLineClassName: "bg-gradient-to-r from-rose-400 via-violet-400 to-blue-400",
    tagClassName: "bg-violet-50 text-violet-800 border border-violet-100",
    timelineDotClassName: "bg-violet-500",
  },
  11: {
    id: 11,
    name: "Timeline Experience Layout",
    layout: "timeline",
    headerVariant: "split",
    sectionVariant: "line",
    tagVariant: "outline",
    pageClassName: "bg-white text-slate-900",
    bodyClassName: "bg-[linear-gradient(180deg,#eef2ff,#ffffff_16%)]",
    mainClassName: "",
    accentClassName: "text-indigo-700",
    mutedClassName: "text-slate-600",
    dividerClassName: "bg-slate-200",
    headerBadgeClassName: "bg-indigo-100 text-indigo-800 border border-indigo-200",
    sectionTitleClassName: "text-[10px] font-semibold uppercase tracking-[0.3em] text-indigo-900",
    sectionLineClassName: "bg-indigo-500",
    tagClassName: "bg-white text-indigo-800 border border-indigo-200",
    timelineDotClassName: "bg-indigo-500",
  },
  12: {
    id: 12,
    name: "Premium Glassmorphism",
    layout: "glass",
    headerVariant: "band",
    sectionVariant: "boxed",
    tagVariant: "soft",
    pageClassName: "bg-[#f4f8ff] text-slate-900",
    bodyClassName: "bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(129,140,248,0.18),_transparent_32%),#eff6ff]",
    mainClassName: "",
    accentClassName: "text-sky-800",
    mutedClassName: "text-slate-600",
    dividerClassName: "bg-white/60",
    headerBadgeClassName: "bg-white/70 text-sky-900 border border-white/60 backdrop-blur-sm",
    sectionTitleClassName: "text-[10px] font-semibold uppercase tracking-[0.28em] text-sky-900",
    sectionLineClassName: "bg-sky-400/70",
    tagClassName: "bg-white/80 text-sky-900 border border-white/70 backdrop-blur-sm",
    timelineDotClassName: "bg-sky-500",
  },
  13: {
    id: 13,
    name: "International CV Style",
    layout: "international",
    headerVariant: "centered",
    sectionVariant: "line",
    tagVariant: "outline",
    pageClassName: "bg-white text-slate-900",
    bodyClassName: "bg-white",
    mainClassName: "",
    accentClassName: "text-slate-900",
    mutedClassName: "text-slate-600",
    dividerClassName: "bg-slate-200",
    headerBadgeClassName: "bg-slate-100 text-slate-700 border border-slate-200",
    sectionTitleClassName: "text-[10px] font-semibold uppercase tracking-[0.36em] text-slate-900",
    sectionLineClassName: "bg-slate-400",
    tagClassName: "bg-white text-slate-700 border border-slate-300",
    timelineDotClassName: "bg-slate-800",
  },
  14: {
    id: 14,
    name: "Futuristic Professional",
    layout: "futuristic",
    headerVariant: "banner",
    sectionVariant: "filled",
    tagVariant: "solid",
    pageClassName: "bg-[#0b1120] text-slate-100",
    bodyClassName: "bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.20),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.16),_transparent_30%),linear-gradient(180deg,#020617,#111827)]",
    mainClassName: "",
    accentClassName: "text-cyan-300",
    mutedClassName: "text-slate-300",
    dividerClassName: "bg-white/10",
    headerBadgeClassName: "bg-cyan-400/12 text-cyan-200 border border-cyan-300/25",
    sectionTitleClassName: "text-[10px] font-semibold uppercase tracking-[0.34em] text-cyan-200",
    sectionLineClassName: "bg-gradient-to-r from-cyan-400 to-fuchsia-400",
    tagClassName: "bg-white/10 text-cyan-100 border border-white/10",
    timelineDotClassName: "bg-cyan-400",
  },
  15: {
    id: 15,
    name: "CEO Leadership Theme",
    layout: "leadership",
    headerVariant: "card",
    sectionVariant: "pill",
    tagVariant: "soft",
    pageClassName: "bg-[#fdfcf8] text-stone-900",
    bodyClassName: "bg-[linear-gradient(180deg,#fffdf7,#f8f5ef)]",
    mainClassName: "",
    accentClassName: "text-stone-900",
    mutedClassName: "text-stone-600",
    dividerClassName: "bg-stone-200",
    headerBadgeClassName: "bg-amber-100 text-amber-900 border border-amber-200",
    sectionTitleClassName: "text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-900",
    sectionLineClassName: "bg-amber-400",
    tagClassName: "bg-amber-50 text-amber-900 border border-amber-200",
    timelineDotClassName: "bg-amber-600",
  },
};

const sanitizeUrl = (url: string) => {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

const splitParagraphs = (value?: string) =>
  (value || "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

const splitListLines = (value?: string) =>
  (value || "")
    .split("\n")
    .map((line) => line.replace(/^[\s]*[•*-]\s*/, "").trim())
    .filter(Boolean);

const contentScore = (data: ResumeData) => {
  const scalar = (value?: string) => Math.ceil((value || "").length / 80);
  return (
    data.education.length * 2 +
    data.experience.length * 3 +
    data.projects.length * 2 +
    data.skills.length +
    data.languages.length +
    data.certifications.length +
    data.socialLinks.length +
    data.customSections?.length || 0 +
    scalar(data.summary) +
    scalar(data.careerObjective) +
    data.experience.reduce((sum, item) => sum + scalar(item.description), 0) +
    data.projects.reduce((sum, item) => sum + scalar(item.description), 0)
  );
};

export const DynamicFontScale = (data: ResumeData): CSSProperties => {
  const score = contentScore(data);
  const density: Density =
    score > 40 ? "compact" : score > 28 ? "balanced" : "comfortable";

  if (density === "compact") {
    return {
      ["--name-size" as string]: "28px",
      ["--role-size" as string]: "12px",
      ["--body-size" as string]: "9px",
      ["--meta-size" as string]: "8px",
      ["--section-size" as string]: "10px",
      ["--leading-copy" as string]: "1.42",
    };
  }

  if (density === "balanced") {
    return {
      ["--name-size" as string]: "31px",
      ["--role-size" as string]: "13px",
      ["--body-size" as string]: "9.5px",
      ["--meta-size" as string]: "8.2px",
      ["--section-size" as string]: "10.5px",
      ["--leading-copy" as string]: "1.5",
    };
  }

  return {
    ["--name-size" as string]: "34px",
    ["--role-size" as string]: "14px",
    ["--body-size" as string]: "10.2px",
    ["--meta-size" as string]: "8.6px",
    ["--section-size" as string]: "11px",
    ["--leading-copy" as string]: "1.56",
  };
};

export const SmartSpacing = (data: ResumeData): CSSProperties => {
  const score = contentScore(data);

  if (score > 40) {
    return {
      ["--page-padding-x" as string]: "28px",
      ["--page-padding-y" as string]: "24px",
      ["--section-gap" as string]: "12px",
      ["--section-inner-gap" as string]: "8px",
      ["--block-gap" as string]: "10px",
      ["--tag-gap" as string]: "5px",
    };
  }

  if (score > 28) {
    return {
      ["--page-padding-x" as string]: "30px",
      ["--page-padding-y" as string]: "26px",
      ["--section-gap" as string]: "14px",
      ["--section-inner-gap" as string]: "10px",
      ["--block-gap" as string]: "12px",
      ["--tag-gap" as string]: "6px",
    };
  }

  return {
    ["--page-padding-x" as string]: "34px",
    ["--page-padding-y" as string]: "30px",
    ["--section-gap" as string]: "16px",
    ["--section-inner-gap" as string]: "11px",
    ["--block-gap" as string]: "14px",
    ["--tag-gap" as string]: "7px",
  };
};

export const AutoFitText = ({
  text,
  className = "",
  maxLines,
}: {
  text?: string;
  className?: string;
  maxLines?: number;
}) => {
  if (!text) return null;

  const style = maxLines
    ? ({
        display: "-webkit-box",
        WebkitLineClamp: maxLines,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      } as CSSProperties)
    : undefined;

  return (
    <div
      className={`${className} whitespace-pre-line`}
      style={style}
    >
      {splitParagraphs(text).join("\n\n")}
    </div>
  );
};

export const ResumeSection = ({
  theme,
  title,
  children,
}: {
  theme: ThemeTokens;
  title: string;
  children: ReactNode;
}) => {
  const sectionBodyClassName =
    theme.sectionVariant === "boxed"
      ? "rounded-2xl border border-black/5 bg-white/35 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur-sm"
      : theme.sectionVariant === "filled"
      ? "rounded-2xl bg-black/[0.025] p-4"
      : "";

  return (
    <section className="space-y-[var(--section-inner-gap)] break-inside-avoid page-safe">
      <div className="flex items-center gap-3">
        <h2 className={theme.sectionTitleClassName}>{title}</h2>
        <div className={`h-px flex-1 ${theme.sectionLineClassName}`} />
      </div>
      <div className={sectionBodyClassName}>{children}</div>
    </section>
  );
};

export const TagList = ({
  items,
  theme,
}: {
  items: string[];
  theme: ThemeTokens;
}) => {
  if (!items.length) return null;

  return (
    <div className="flex flex-wrap gap-[var(--tag-gap)]">
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className={`rounded-full px-2.5 py-1 text-[var(--meta-size)] font-medium ${theme.tagClassName}`}
        >
          {item}
        </span>
      ))}
    </div>
  );
};

export const TimelineBlock = ({
  item,
  theme,
}: {
  item: ExperienceItem;
  theme: ThemeTokens;
}) => {
  const bullets = splitListLines(item.description);
  const hasBullets = bullets.length > 1 || /^[\s]*[•*-]/.test(item.description || "");

  return (
    <div className="relative pl-4">
      <div className={`absolute left-0 top-1.5 h-2 w-2 rounded-full ${theme.timelineDotClassName}`} />
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-[calc(var(--body-size)+1.1px)] font-semibold leading-tight">
              {item.role}
            </h3>
            {item.company ? (
              <p className={`text-[var(--meta-size)] uppercase tracking-[0.18em] ${theme.mutedClassName}`}>
                {item.company}
              </p>
            ) : null}
          </div>
          <span className={`shrink-0 text-[var(--meta-size)] ${theme.mutedClassName}`}>
            {[item.startDate, item.endDate].filter(Boolean).join(" - ")}
          </span>
        </div>
        {hasBullets ? (
          <ul className={`space-y-1 text-[var(--body-size)] leading-[var(--leading-copy)] ${theme.mutedClassName}`}>
            {bullets.slice(0, 4).map((bullet, index) => (
              <li key={index} className="flex gap-2">
                <span className={theme.accentClassName}>•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        ) : (
          <AutoFitText
            text={item.description}
            maxLines={4}
            className={`text-[var(--body-size)] leading-[var(--leading-copy)] ${theme.mutedClassName}`}
          />
        )}
      </div>
    </div>
  );
};

export const HeaderVariants = ({
  data,
  theme,
}: {
  data: ResumeData;
  theme: ThemeTokens;
}) => {
  const contacts = [data.email, data.phone, data.address].filter(Boolean);
  const social = data.socialLinks.slice(0, 3);

  const headerBody =
    theme.headerVariant === "centered" ? (
      <div className="text-center">
        <HeaderIdentity data={data} theme={theme} centered />
        <ContactCluster contacts={contacts} social={social} theme={theme} centered />
      </div>
    ) : theme.headerVariant === "split" ? (
      <div className="flex items-start justify-between gap-5">
        <HeaderIdentity data={data} theme={theme} />
        <ContactCluster contacts={contacts} social={social} theme={theme} alignRight />
      </div>
    ) : theme.headerVariant === "band" ? (
      <div className="rounded-[28px] border border-white/10 bg-white/6 px-5 py-4 backdrop-blur-sm">
        <div className="flex items-start justify-between gap-5">
          <HeaderIdentity data={data} theme={theme} />
          <ContactCluster contacts={contacts} social={social} theme={theme} alignRight />
        </div>
      </div>
    ) : theme.headerVariant === "card" ? (
      <div className="rounded-[28px] border border-black/5 bg-white/75 px-5 py-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
        <div className="flex items-start justify-between gap-5">
          <HeaderIdentity data={data} theme={theme} />
          <ContactCluster contacts={contacts} social={social} theme={theme} alignRight compact />
        </div>
      </div>
    ) : theme.headerVariant === "banner" ? (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <span className={`rounded-full px-3 py-1 text-[var(--meta-size)] font-semibold uppercase tracking-[0.26em] ${theme.headerBadgeClassName}`}>
            Premium Resume
          </span>
          <ContactCluster contacts={contacts} social={social} theme={theme} alignRight compact />
        </div>
        <HeaderIdentity data={data} theme={theme} />
      </div>
    ) : (
      <div className="space-y-3">
        <HeaderIdentity data={data} theme={theme} />
        <ContactCluster contacts={contacts} social={social} theme={theme} />
      </div>
    );

  return (
    <header className={`space-y-4 pb-4 ${theme.layout === "luxury-dark" || theme.layout === "futuristic" ? "border-b border-white/10" : "border-b border-black/8"}`}>
      {headerBody}
    </header>
  );
};

const HeaderIdentity = ({
  data,
  theme,
  centered = false,
}: {
  data: ResumeData;
  theme: ThemeTokens;
  centered?: boolean;
}) => (
  <div className={centered ? "space-y-2" : "space-y-2.5"}>
    <h1
      className={`${theme.accentClassName} break-words font-semibold tracking-[-0.04em]`}
      style={{ fontSize: "var(--name-size)", lineHeight: 1.02 }}
    >
      {data.fullName || "Your Name"}
    </h1>
    {data.role ? (
      <p
        className={`${theme.mutedClassName} uppercase tracking-[0.28em]`}
        style={{ fontSize: "var(--role-size)", lineHeight: 1.3 }}
      >
        {data.role}
      </p>
    ) : null}
  </div>
);

const ContactCluster = ({
  contacts,
  social,
  theme,
  centered = false,
  alignRight = false,
  compact = false,
}: {
  contacts: string[];
  social: ResumeData["socialLinks"];
  theme: ThemeTokens;
  centered?: boolean;
  alignRight?: boolean;
  compact?: boolean;
}) => (
  <div
    className={[
      "space-y-2",
      centered ? "items-center justify-center" : "",
      alignRight ? "text-right" : "",
    ].join(" ")}
  >
    {contacts.length ? (
      <div
        className={`flex flex-wrap gap-x-3 gap-y-1 ${centered ? "justify-center" : alignRight ? "justify-end" : ""} ${theme.mutedClassName}`}
        style={{ fontSize: "var(--meta-size)" }}
      >
        {contacts.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    ) : null}
    {social.length ? (
      <div
        className={`flex flex-wrap gap-x-3 gap-y-1 ${centered ? "justify-center" : alignRight ? "justify-end" : ""}`}
        style={{ fontSize: compact ? "var(--meta-size)" : "calc(var(--meta-size) + 0.2px)" }}
      >
        {social.map((item, index) => (
          <a
            key={`${item.platform}-${index}`}
            href={sanitizeUrl(item.url)}
            className={`${theme.accentClassName} underline-offset-2 hover:underline`}
          >
            {item.platform}
          </a>
        ))}
      </div>
    ) : null}
  </div>
);

export const SidebarLayout = ({
  sidebar,
  main,
  theme,
  reverse = false,
}: {
  sidebar: ReactNode;
  main: ReactNode;
  theme: ThemeTokens;
  reverse?: boolean;
}) => (
  <div className={`grid h-full gap-5 ${reverse ? "grid-cols-[1.55fr_0.95fr]" : "grid-cols-[0.95fr_1.55fr]"}`}>
    {reverse ? (
      <>
        <div className="space-y-[var(--section-gap)]">{main}</div>
        <aside className={`space-y-[var(--section-gap)] rounded-[26px] px-4 py-5 ${theme.sidebarClassName || "bg-slate-50"}`}>
          {sidebar}
        </aside>
      </>
    ) : (
      <>
        <aside className={`space-y-[var(--section-gap)] rounded-[26px] px-4 py-5 ${theme.sidebarClassName || "bg-slate-50"}`}>
          {sidebar}
        </aside>
        <div className="space-y-[var(--section-gap)]">{main}</div>
      </>
    )}
  </div>
);

const SummarySection = ({ data, theme }: { data: ResumeData; theme: ThemeTokens }) => {
  const isFresher = data.candidateType === "fresher";
  const summaryText = isFresher ? data.careerObjective || data.summary : data.summary || data.careerObjective;
  const title = theme.summaryTitle || (isFresher ? "Career Objective" : "Professional Summary");

  if (!summaryText) return null;

  return (
    <ResumeSection title={title} theme={theme}>
      <div className="min-h-[5.8em]">
        <AutoFitText
          text={summaryText}
          maxLines={theme.layout === "classic" ? 5 : 6}
          className={`text-[var(--body-size)] leading-[var(--leading-copy)] ${theme.mutedClassName}`}
        />
      </div>
    </ResumeSection>
  );
};

const ExperienceSection = ({ data, theme }: { data: ResumeData; theme: ThemeTokens }) => {
  if (!data.experience.length) return null;

  return (
    <ResumeSection
      title={data.candidateType === "fresher" && theme.layout !== "timeline" ? "Internships & Experience" : "Professional Experience"}
      theme={theme}
    >
      <div className="space-y-[var(--block-gap)]">
        {data.experience.map((item, index) => (
          <TimelineBlock key={`${item.role}-${index}`} item={item} theme={theme} />
        ))}
      </div>
    </ResumeSection>
  );
};

const ProjectSection = ({ data, theme }: { data: ResumeData; theme: ThemeTokens }) => {
  if (!data.projects.length) return null;

  return (
    <ResumeSection title="Selected Projects" theme={theme}>
      <div className="space-y-[var(--block-gap)]">
        {data.projects.map((project, index) => (
          <ProjectBlock key={`${project.name}-${index}`} project={project} theme={theme} />
        ))}
      </div>
    </ResumeSection>
  );
};

const ProjectBlock = ({ project, theme }: { project: ProjectItem; theme: ThemeTokens }) => {
  const bullets = splitListLines(project.description);
  const hasBullets = bullets.length > 1 || /^[\s]*[•*-]/.test(project.description || "");

  return (
    <div className="space-y-1.5">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-[calc(var(--body-size)+1.1px)] font-semibold leading-tight">
          {project.name}
        </h3>
        {project.link ? (
          <a
            href={sanitizeUrl(project.link)}
            className={`shrink-0 text-[var(--meta-size)] ${theme.accentClassName} hover:underline`}
          >
            View
          </a>
        ) : null}
      </div>
      {hasBullets ? (
        <ul className={`space-y-1 text-[var(--body-size)] leading-[var(--leading-copy)] ${theme.mutedClassName}`}>
          {bullets.slice(0, 3).map((bullet, index) => (
            <li key={index} className="flex gap-2">
              <span className={theme.accentClassName}>•</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : (
        <AutoFitText
          text={project.description}
          maxLines={3}
          className={`text-[var(--body-size)] leading-[var(--leading-copy)] ${theme.mutedClassName}`}
        />
      )}
      <TagList items={project.technologies.slice(0, 5)} theme={theme} />
    </div>
  );
};

const EducationSection = ({ data, theme }: { data: ResumeData; theme: ThemeTokens }) => {
  if (!data.education.length) return null;

  return (
    <ResumeSection title="Education" theme={theme}>
      <div className="space-y-[var(--block-gap)]">
        {data.education.map((item, index) => (
          <div key={`${item.degree}-${index}`} className="space-y-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[calc(var(--body-size)+1.1px)] font-semibold">
                  {item.degree}
                </h3>
                <p className={`text-[var(--body-size)] ${theme.mutedClassName}`}>{item.school}</p>
              </div>
              <span className={`text-[var(--meta-size)] ${theme.mutedClassName}`}>
                {[item.startYear, item.endYear].filter(Boolean).join(" - ")}
              </span>
            </div>
            {item.gpa ? (
              <p className={`text-[var(--meta-size)] ${theme.mutedClassName}`}>GPA: {item.gpa}</p>
            ) : null}
          </div>
        ))}
      </div>
    </ResumeSection>
  );
};

const CustomSection = ({
  section,
  theme,
}: {
  section: CustomSectionItem;
  theme: ThemeTokens;
}) => (
  <ResumeSection title={section.title} theme={theme}>
    {section.description ? (
      <AutoFitText
        text={section.description}
        maxLines={4}
        className={`text-[var(--body-size)] leading-[var(--leading-copy)] ${theme.mutedClassName}`}
      />
    ) : null}
    {section.items?.length ? (
      <ul className={`mt-2 space-y-1 text-[var(--body-size)] leading-[var(--leading-copy)] ${theme.mutedClassName}`}>
        {section.items.slice(0, 4).map((item, index) => (
          <li key={index} className="flex gap-2">
            <span className={theme.accentClassName}>•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ) : null}
    {section.date ? <p className={`mt-1 text-[var(--meta-size)] ${theme.mutedClassName}`}>{section.date}</p> : null}
  </ResumeSection>
);

const SidebarSection = ({
  title,
  children,
  theme,
}: {
  title: string;
  children: ReactNode;
  theme: ThemeTokens;
}) => (
  <div className="space-y-2.5">
    <div className="space-y-2">
      <h3 className={theme.sectionTitleClassName}>{title}</h3>
      <div className={`h-px w-full ${theme.sectionLineClassName}`} />
    </div>
    {children}
  </div>
);

const renderSidebarBlock = (block: NonNullable<ThemeTokens["sidebarOrder"]>[number], data: ResumeData, theme: ThemeTokens) => {
  switch (block) {
    case "contact":
      return (
        <SidebarSection key={block} title="Contact" theme={theme}>
          <div className={`space-y-1.5 text-[var(--body-size)] ${theme.mutedClassName}`}>
            {[data.email, data.phone, data.address].filter(Boolean).map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </SidebarSection>
      );
    case "skills":
      return data.skills.length ? (
        <SidebarSection key={block} title="Skills" theme={theme}>
          <TagList items={data.skills} theme={theme} />
        </SidebarSection>
      ) : null;
    case "languages":
      return data.languages.length ? (
        <SidebarSection key={block} title="Languages" theme={theme}>
          <div className={`space-y-1.5 text-[var(--body-size)] ${theme.mutedClassName}`}>
            {data.languages.map((item, index) => (
              <p key={`${item.language}-${index}`}>
                {item.language} <span className="opacity-75">({item.level})</span>
              </p>
            ))}
          </div>
        </SidebarSection>
      ) : null;
    case "certifications":
      return data.certifications.length ? (
        <SidebarSection key={block} title="Certifications" theme={theme}>
          <div className={`space-y-2 text-[var(--body-size)] ${theme.mutedClassName}`}>
            {data.certifications.map((item, index) => (
              <div key={`${item.name}-${index}`}>
                <p className="font-medium">{item.name}</p>
                <p className="text-[var(--meta-size)] opacity-80">
                  {[item.issuer, item.year].filter(Boolean).join(" • ")}
                </p>
              </div>
            ))}
          </div>
        </SidebarSection>
      ) : null;
    case "strengths":
      return data.strengths?.length ? (
        <SidebarSection key={block} title="Strengths" theme={theme}>
          <ul className={`space-y-1.5 text-[var(--body-size)] ${theme.mutedClassName}`}>
            {data.strengths.slice(0, 5).map((item, index) => (
              <li key={`${item}-${index}`} className="flex gap-2">
                <span className={theme.accentClassName}>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </SidebarSection>
      ) : null;
    case "references":
      return data.references?.length ? (
        <SidebarSection key={block} title="Reference Notes" theme={theme}>
          <div className={`space-y-1.5 text-[var(--body-size)] ${theme.mutedClassName}`}>
            {data.references.slice(0, 4).map((item, index) => (
              <p key={`${item}-${index}`}>{item}</p>
            ))}
          </div>
        </SidebarSection>
      ) : null;
    case "social":
      return data.socialLinks.length ? (
        <SidebarSection key={block} title="Links" theme={theme}>
          <div className={`space-y-1.5 text-[var(--body-size)] ${theme.mutedClassName}`}>
            {data.socialLinks.map((item, index) => (
              <a
                key={`${item.platform}-${index}`}
                href={sanitizeUrl(item.url)}
                className={`block ${theme.accentClassName} hover:underline`}
              >
                {item.platform}
              </a>
            ))}
          </div>
        </SidebarSection>
      ) : null;
    case "hobbies":
      return data.hobbies?.length ? (
        <SidebarSection key={block} title="Achievements & Interests" theme={theme}>
          <div className={`space-y-1.5 text-[var(--body-size)] ${theme.mutedClassName}`}>
            {data.hobbies.slice(0, 5).map((item, index) => (
              <p key={`${item}-${index}`}>{item}</p>
            ))}
          </div>
        </SidebarSection>
      ) : null;
    default:
      return null;
  }
};

const renderMainBlock = (block: NonNullable<ThemeTokens["mainOrder"]>[number], data: ResumeData, theme: ThemeTokens) => {
  switch (block) {
    case "summary":
      return <SummarySection key={block} data={data} theme={theme} />;
    case "experience":
      return <ExperienceSection key={block} data={data} theme={theme} />;
    case "projects":
      return <ProjectSection key={block} data={data} theme={theme} />;
    case "education":
      return <EducationSection key={block} data={data} theme={theme} />;
    case "custom":
      return data.customSections?.length
        ? data.customSections.map((section, index) => (
            <CustomSection key={`${section.title}-${index}`} section={section} theme={theme} />
          ))
        : null;
    default:
      return null;
  }
};

const defaultMainOrder: ThemeTokens["mainOrder"] = ["summary", "experience", "projects", "education", "custom"];
const defaultSidebarOrder: ThemeTokens["sidebarOrder"] = ["skills", "languages", "certifications", "strengths", "references", "social", "hobbies"];

export const getPremiumTheme = (templateId: number) => TEMPLATES[templateId] || TEMPLATES[1];
export const premiumTemplateOptions = Object.values(TEMPLATES).map(({ id, name }) => ({ id, name }));

export const PremiumResumeTemplate = ({
  data,
  templateId,
}: {
  data: ResumeData;
  templateId: number;
}) => {
  const theme = getPremiumTheme(templateId);
  const style = {
    ...DynamicFontScale(data),
    ...SmartSpacing(data),
  } as CSSProperties;

  const mainBlocks = (theme.mainOrder || defaultMainOrder).map((block) => renderMainBlock(block, data, theme));
  const sidebarBlocks = (theme.sidebarOrder || defaultSidebarOrder).map((block) => renderSidebarBlock(block, data, theme));

  const mainColumn = <div className="space-y-[var(--section-gap)]">{mainBlocks}</div>;
  const sidebarColumn = (
    <div className="space-y-[var(--section-gap)]">
      {theme.sidebarTitle ? (
        <div className="pb-2">
          <p className={`text-[var(--meta-size)] uppercase tracking-[0.32em] ${theme.mutedClassName}`}>{theme.sidebarTitle}</p>
        </div>
      ) : null}
      {sidebarBlocks}
    </div>
  );

  const body =
    theme.layout === "sidebar-left" ? (
      <SidebarLayout theme={theme} sidebar={sidebarColumn} main={mainColumn} />
    ) : theme.layout === "analyst" ? (
      <SidebarLayout theme={theme} sidebar={sidebarColumn} main={mainColumn} reverse />
    ) : theme.layout === "timeline" ? (
      <div className="grid grid-cols-[1.6fr_0.9fr] gap-6">
        <div className="space-y-[var(--section-gap)]">{mainBlocks}</div>
        <div className="space-y-[var(--section-gap)]">{sidebarBlocks}</div>
      </div>
    ) : theme.layout === "classic" ? (
      <div className="space-y-[var(--section-gap)]">
        {mainBlocks}
        <div className="grid grid-cols-3 gap-4">{sidebarBlocks}</div>
      </div>
    ) : theme.layout === "executive" || theme.layout === "serif" || theme.layout === "leadership" ? (
      <div className="grid grid-cols-[1.45fr_0.95fr] gap-6">
        <div className="space-y-[var(--section-gap)]">{mainBlocks}</div>
        <div className="space-y-[var(--section-gap)]">{sidebarBlocks}</div>
      </div>
    ) : theme.layout === "designer" || theme.layout === "startup" || theme.layout === "glass" ? (
      <div className="grid grid-cols-[1.2fr_1fr] gap-5">
        <div className="space-y-[var(--section-gap)]">{mainBlocks}</div>
        <div className="space-y-[var(--section-gap)]">{sidebarBlocks}</div>
      </div>
    ) : (
      <div className="space-y-[var(--section-gap)]">
        {mainBlocks}
        <div className="grid grid-cols-2 gap-5">{sidebarBlocks}</div>
      </div>
    );

  return (
    <div
      className={`mx-auto h-[1123px] w-[794px] overflow-hidden ${theme.pageClassName}`}
      style={style}
    >
      <div
        className={`h-full w-full px-[var(--page-padding-x)] py-[var(--page-padding-y)] ${theme.bodyClassName} ${theme.mainClassName}`}
      >
        <div className="flex h-full flex-col gap-5">
          <HeaderVariants data={data} theme={theme} />
          <main className="min-h-0 flex-1 overflow-hidden">{body}</main>
        </div>
      </div>
    </div>
  );
};
