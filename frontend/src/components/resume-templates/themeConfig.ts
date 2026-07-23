import type { ResumeData } from "./types";
import type { ResumeTemplateTheme } from "./templateThemeTypes";
import { templateThemes } from "./templateThemes";

export type TemplateColorKey = "headingBar" | "headingText" | "sidebarBackground";

export interface EditableColorField {
  key: TemplateColorKey;
  label: string;
}

export interface TemplateThemeConfig {
  templateId: number;
  editableColors: EditableColorField[];
  defaultColors: Partial<Record<TemplateColorKey, string>>;
}

export const PROFESSIONAL_COLOR_PRESETS = [
  { label: "Corporate Blue", value: "#2563EB" },
  { label: "Teal", value: "#0F766E" },
  { label: "Dark Navy", value: "#0F172A" },
  { label: "White", value: "#FFFFFF" },
  { label: "Emerald", value: "#047857" },
  { label: "Slate", value: "#334155" },
  { label: "Sky Blue", value: "#38BDF8" },
  { label: "Maroon", value: "#7F1D1D" },
  { label: "Purple", value: "#6D28D9" },
] as const;

const HEADING_COLOR_FIELDS: EditableColorField[] = [
  { key: "headingBar", label: "Heading Background Color" },
  { key: "headingText", label: "Heading Text Color" },
];

const SIDEBAR_COLOR_FIELD: EditableColorField = {
  key: "sidebarBackground",
  label: "Sidebar Color",
};

const createHeadingOnlyConfig = (
  templateId: number,
  headingBar?: string,
  headingText?: string
): TemplateThemeConfig => ({
  templateId,
  defaultColors: {
    headingBar:
      headingBar ||
      templateThemes[templateId].palette.accentBorder ||
      templateThemes[templateId].palette.accent,
    headingText:
      headingText ||
      templateThemes[templateId].palette.headingText ||
      templateThemes[templateId].palette.accentText ||
      templateThemes[templateId].palette.text,
  },
  editableColors: HEADING_COLOR_FIELDS,
});

const createSidebarConfig = (
  templateId: number,
  headingBar?: string,
  headingText?: string,
  sidebarBackground?: string
): TemplateThemeConfig => ({
  templateId,
  defaultColors: {
    headingBar:
      headingBar ||
      templateThemes[templateId].palette.accentBorder ||
      templateThemes[templateId].palette.accent,
    headingText:
      headingText ||
      templateThemes[templateId].palette.headingText ||
      templateThemes[templateId].palette.accentText ||
      templateThemes[templateId].palette.text,
    sidebarBackground:
      sidebarBackground ||
      templateThemes[templateId].palette.sidebarBg ||
      templateThemes[templateId].palette.accentSoft ||
      templateThemes[templateId].palette.accent,
  },
  editableColors: [...HEADING_COLOR_FIELDS, SIDEBAR_COLOR_FIELD],
});

export const templateThemeConfigs: Record<number, TemplateThemeConfig> = {
  1: createHeadingOnlyConfig(
    1,
    templateThemes[1].palette.accent,
    templateThemes[1].palette.headingText ||
      templateThemes[1].palette.accentText ||
      templateThemes[1].palette.text
  ),
  2: createHeadingOnlyConfig(2),
  3: createSidebarConfig(
    3,
    templateThemes[3].palette.accent,
    templateThemes[3].palette.headingText || templateThemes[3].palette.text,
    templateThemes[3].palette.accent
  ),
  4: createHeadingOnlyConfig(4),
  5: createSidebarConfig(5, "#1E293B", "#0F172A"),
  6: createSidebarConfig(
    6,
    templateThemes[6].palette.accentBorder || templateThemes[6].palette.accent,
    templateThemes[6].palette.headingText ||
      templateThemes[6].palette.accentText ||
      templateThemes[6].palette.text
  ),
  7: createHeadingOnlyConfig(7, templateThemes[7].palette.accent, templateThemes[7].palette.accentText),
  8: createHeadingOnlyConfig(8),
  9: createSidebarConfig(9, templateThemes[9].palette.accent, templateThemes[9].palette.accentText),
  10: createSidebarConfig(10, templateThemes[10].palette.accent, templateThemes[10].palette.accentText),
  11: createSidebarConfig(11, templateThemes[11].palette.accent, templateThemes[11].palette.accentText),
  12: createHeadingOnlyConfig(12, templateThemes[12].palette.accent, templateThemes[12].palette.accentText),
  13: createSidebarConfig(13, templateThemes[13].palette.accent, templateThemes[13].palette.accentText),
  14: createHeadingOnlyConfig(14, templateThemes[14].palette.accent, "#111827"),
  15: createSidebarConfig(15, templateThemes[15].palette.accent, "#111827"),
};

export const getTemplateThemeConfig = (templateId: number) =>
  templateThemeConfigs[templateId] || templateThemeConfigs[1];

export const getDefaultThemeColors = (templateId: number) =>
  getTemplateThemeConfig(templateId).defaultColors;

const normalizeHex = (value?: string | null) => {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(normalized) ? normalized.toUpperCase() : null;
};

export const sanitizeThemeColors = (
  templateId: number,
  colors?: Record<string, unknown>
): Partial<Record<TemplateColorKey, string>> => {
  const config = getTemplateThemeConfig(templateId);
  const allowedKeys = new Set(config.editableColors.map((item) => item.key));

  return Object.entries(colors || {}).reduce<Partial<Record<TemplateColorKey, string>>>(
    (accumulator, [key, value]) => {
      if (!allowedKeys.has(key as TemplateColorKey)) {
        return accumulator;
      }

      const normalized = normalizeHex(value);
      if (normalized) {
        accumulator[key as TemplateColorKey] = normalized;
      }

      return accumulator;
    },
    {}
  );
};

export const mergeThemeColors = (
  templateId: number,
  colors?: Record<string, string>
): Partial<Record<TemplateColorKey, string>> => ({
  ...getDefaultThemeColors(templateId),
  ...sanitizeThemeColors(templateId, colors),
});

export const resolveTemplateTheme = (
  templateId: number,
  resumeData: ResumeData
): ResumeTemplateTheme => {
  const baseTheme = templateThemes[templateId] || templateThemes[1];
  const mergedColors = mergeThemeColors(templateId, resumeData.theme?.colors);

  return {
    ...baseTheme,
    palette: {
      ...baseTheme.palette,
      accent: mergedColors.headingBar || baseTheme.palette.accent,
      accentText: baseTheme.palette.accentText,
      text: baseTheme.palette.text,
      mutedText: baseTheme.palette.mutedText,
      sidebarBg: mergedColors.sidebarBackground || baseTheme.palette.sidebarBg,
      sidebarText: baseTheme.palette.sidebarText,
      sidebarMutedText: baseTheme.palette.sidebarMutedText,
      sidebarAccentSoft: baseTheme.palette.sidebarAccentSoft,
      nameText: baseTheme.palette.nameText || baseTheme.palette.text,
      titleText: baseTheme.palette.titleText || baseTheme.palette.mutedText,
      divider: baseTheme.palette.divider,
      headingText:
        mergedColors.headingText ||
        baseTheme.palette.headingText ||
        baseTheme.palette.accentText ||
        baseTheme.palette.text,
      accentBorder: mergedColors.headingBar || baseTheme.palette.accentBorder || baseTheme.palette.accent,
    },
  };
};

const hexToRgb = (value: string) => {
  const normalized = value.replace("#", "");
  const safe =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;

  const numericValue = Number.parseInt(safe, 16);
  return {
    r: (numericValue >> 16) & 255,
    g: (numericValue >> 8) & 255,
    b: numericValue & 255,
  };
};

const toLuminance = ({ r, g, b }: ReturnType<typeof hexToRgb>) => {
  const transform = (channel: number) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * transform(r) + 0.7152 * transform(g) + 0.0722 * transform(b);
};

const getContrastRatio = (foreground: string, background: string) => {
  const foregroundLum = toLuminance(hexToRgb(foreground));
  const backgroundLum = toLuminance(hexToRgb(background));
  const lighter = Math.max(foregroundLum, backgroundLum);
  const darker = Math.min(foregroundLum, backgroundLum);

  return (lighter + 0.05) / (darker + 0.05);
};

export const hasThemeContrastWarning = (
  templateId: number,
  colors?: Record<string, string>
) => {
  const merged = mergeThemeColors(templateId, colors);

  if (merged.headingBar && merged.headingText) {
    return getContrastRatio(merged.headingText, merged.headingBar) < 4.2;
  }

  return false;
};
