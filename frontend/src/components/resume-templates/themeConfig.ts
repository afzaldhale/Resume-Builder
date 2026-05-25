import type { ResumeData } from "./types";
import type { ResumeTemplateTheme } from "./shared";
import { templateThemes } from "./templateThemes";

export type TemplateColorKey =
  | "headingBar"
  | "headingText"
  | "nameText"
  | "titleText"
  | "bodyText"
  | "accent"
  | "sidebarBackground"
  | "sidebarText"
  | "accentBorder"
  | "dividerColor";

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
  { label: "Emerald", value: "#047857" },
  { label: "Slate", value: "#334155" },
  { label: "Sky Blue", value: "#38BDF8" },
  { label: "Maroon", value: "#7F1D1D" },
  { label: "Purple", value: "#6D28D9" },
] as const;

const createSingleBarConfig = (templateId: number, accentOverride?: string): TemplateThemeConfig => ({
  templateId,
  defaultColors: {
    headingBar: accentOverride || templateThemes[templateId].palette.accent,
    headingText: templateThemes[templateId].palette.accentText,
    nameText: templateThemes[templateId].palette.text,
    bodyText: templateThemes[templateId].palette.text,
    accent: accentOverride || templateThemes[templateId].palette.accent,
  },
  editableColors: [
    { key: "headingBar", label: "Heading Bar Color" },
    { key: "headingText", label: "Heading Text Color" },
    { key: "nameText", label: "Name Color" },
    { key: "bodyText", label: "Body Text Color" },
    { key: "accent", label: "Accent Color" },
  ],
});

const createSidebarConfig = (templateId: number): TemplateThemeConfig => ({
  templateId,
  defaultColors: {
    sidebarBackground: templateThemes[templateId].palette.sidebarBg,
    sidebarText: templateThemes[templateId].palette.sidebarText,
    headingBar: templateThemes[templateId].palette.accent,
    headingText: templateThemes[templateId].palette.accentText,
    nameText: templateThemes[templateId].palette.nameText || templateThemes[templateId].palette.text,
    titleText: templateThemes[templateId].palette.titleText || templateThemes[templateId].palette.mutedText,
  },
  editableColors: [
    { key: "sidebarBackground", label: "Sidebar Background" },
    { key: "sidebarText", label: "Sidebar Text Color" },
    { key: "headingBar", label: "Heading Bar Color" },
    { key: "headingText", label: "Heading Text Color" },
    { key: "nameText", label: "Name Color" },
    { key: "titleText", label: "Role / Title Color" },
  ],
});

const createMinimalConfig = (templateId: number): TemplateThemeConfig => ({
  templateId,
  defaultColors: {
    headingText: templateThemes[templateId].palette.text,
    accentBorder: templateThemes[templateId].palette.accent,
    nameText: templateThemes[templateId].palette.text,
    bodyText: templateThemes[templateId].palette.text,
  },
  editableColors: [
    { key: "headingText", label: "Heading Color" },
    { key: "accentBorder", label: "Accent Border Color" },
    { key: "nameText", label: "Name Color" },
    { key: "bodyText", label: "Body Text Color" },
  ],
});

export const templateThemeConfigs: Record<number, TemplateThemeConfig> = {
  1: createMinimalConfig(1),
  2: createSidebarConfig(2),
  3: createSingleBarConfig(3, "#38BDF8"),
  4: createMinimalConfig(4),
  5: createSidebarConfig(5),
  6: {
    templateId: 6,
    defaultColors: {
      sidebarBackground: templateThemes[6].palette.sidebarBg,
      sidebarText: templateThemes[6].palette.sidebarText,
      nameText: templateThemes[6].palette.nameText || templateThemes[6].palette.text,
      titleText: templateThemes[6].palette.titleText || templateThemes[6].palette.mutedText,
      bodyText: templateThemes[6].palette.text,
      dividerColor: templateThemes[6].palette.divider,
    },
    editableColors: [
      { key: "sidebarBackground", label: "Sidebar Background" },
      { key: "sidebarText", label: "Sidebar Text" },
      { key: "nameText", label: "Name Color" },
      { key: "titleText", label: "Role / Title Color" },
      { key: "bodyText", label: "Body Text Color" },
      { key: "dividerColor", label: "Divider Color" },
    ],
  },
  7: createSingleBarConfig(7),
  8: createMinimalConfig(8),
  9: createSidebarConfig(9),
  10: createSingleBarConfig(10),
  11: createSidebarConfig(11),
  12: createSingleBarConfig(12),
  13: createSidebarConfig(13),
  14: createMinimalConfig(14),
  15: createSidebarConfig(15),
};

export const getTemplateThemeConfig = (templateId: number) =>
  templateThemeConfigs[templateId] || templateThemeConfigs[1];

export const getDefaultThemeColors = (templateId: number) =>
  getTemplateThemeConfig(templateId).defaultColors;

const normalizeHex = (value: string) => {
  const normalized = value.trim();
  return /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(normalized) ? normalized.toUpperCase() : null;
};

export const sanitizeThemeColors = (
  templateId: number,
  colors?: Record<string, string>
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
      accent: mergedColors.accent || mergedColors.headingBar || mergedColors.accentBorder || baseTheme.palette.accent,
      accentText: mergedColors.headingText || baseTheme.palette.accentText,
      text: mergedColors.bodyText || baseTheme.palette.text,
      mutedText: baseTheme.palette.mutedText,
      sidebarBg: mergedColors.sidebarBackground || baseTheme.palette.sidebarBg,
      sidebarText: mergedColors.sidebarText || baseTheme.palette.sidebarText,
      sidebarMutedText: mergedColors.sidebarText || baseTheme.palette.sidebarMutedText,
      sidebarAccentSoft: mergedColors.accent || mergedColors.headingBar || baseTheme.palette.sidebarAccentSoft,
      nameText: mergedColors.nameText || baseTheme.palette.nameText || baseTheme.palette.text,
      titleText: mergedColors.titleText || baseTheme.palette.titleText || baseTheme.palette.mutedText,
      divider: mergedColors.dividerColor || baseTheme.palette.divider,
      headingText:
        mergedColors.headingText ||
        mergedColors.bodyText ||
        baseTheme.palette.headingText ||
        baseTheme.palette.text,
      accentBorder: mergedColors.accentBorder || baseTheme.palette.accentBorder || baseTheme.palette.accent,
    },
  };
};

const hexToRgb = (value: string) => {
  const normalized = value.replace("#", "");
  const safe = normalized.length === 3
    ? normalized.split("").map((char) => `${char}${char}`).join("")
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
  const checks = [
    [merged.bodyText || "#1F2937", "#FFFFFF"],
    [merged.nameText || merged.bodyText || "#1F2937", "#FFFFFF"],
  ];

  if (merged.headingBar && merged.headingText) {
    checks.push([merged.headingText, merged.headingBar]);
  }

  if (merged.sidebarBackground && merged.sidebarText) {
    checks.push([merged.sidebarText, merged.sidebarBackground]);
  }

  return checks.some(([foreground, background]) => getContrastRatio(foreground, background) < 4.2);
};
