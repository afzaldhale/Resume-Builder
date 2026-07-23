/**
 * Migration stabilization scaffold.
 *
 * This module will become the template metadata and family mapping registry.
 */

export const TEMPLATE_IDS = Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

export type TemplateDisplayVariant = "single" | "sidebar-dark" | "bar-top" | "left-accent" | "sidebar-light" | "single-compact";

export interface TemplateMetadata {
  id: number;
  code: string;
  name: string;
  subtitle: string;
  preview: TemplateDisplayVariant;
  color: string;
}

export const TEMPLATE_METADATA: readonly TemplateMetadata[] = Object.freeze([
  {
    id: 1,
    code: "T01",
    name: "Recruiter Choice",
    subtitle: "Single Column • ATS Friendly",
    preview: "single",
    color: "bg-blue-700",
  },
  {
    id: 2,
    code: "T02",
    name: "Premium Executive",
    subtitle: "Left Accent • ATS Friendly",
    preview: "sidebar-dark",
    color: "bg-blue-700",
  },
  {
    id: 3,
    code: "T03",
    name: "Prime Executive",
    subtitle: "Single Column • ATS Friendly",
    preview: "bar-top",
    color: "bg-blue-500",
  },
  {
    id: 4,
    code: "T04",
    name: "Elite Executive",
    subtitle: "Two Column • ATS Friendly",
    preview: "left-accent",
    color: "bg-teal-700",
  },
  {
    id: 5,
    code: "T05",
    name: "Executive Signature",
    subtitle: "Two Column • ATS Friendly",
    preview: "sidebar-light",
    color: "bg-slate-500",
  },
  {
    id: 6,
    code: "T06",
    name: "Executive Edge",
    subtitle: "Two Column • ATS Friendly",
    preview: "sidebar-dark",
    color: "bg-teal-700",
  },
  {
    id: 7,
    code: "T07",
    name: "Classic Executive",
    subtitle: "Single Column • ATS Friendly",
    preview: "bar-top",
    color: "bg-rose-500",
  },
  {
    id: 8,
    code: "T08",
    name: "Corporate Standard",
    subtitle: "Single Column • ATS Friendly",
    preview: "single-compact",
    color: "bg-slate-700",
  },
  {
    id: 9,
    code: "T09",
    name: "Career Pro",
    subtitle: "Two Column • ATS Friendly",
    preview: "sidebar-dark",
    color: "bg-slate-700",
  },
  {
    id: 10,
    code: "T10",
    name: "Classic Professional",
    subtitle: "Two Column • ATS Friendly",
    preview: "bar-top",
    color: "bg-blue-700",
  },
  {
    id: 11,
    code: "T11",
    name: "Corporate Professional",
    subtitle: "Single Column • ATS Friendly",
    preview: "sidebar-light",
    color: "bg-stone-600",
  },
  {
    id: 12,
    code: "T12",
    name: "Modern Professional",
    subtitle: "Single Column • ATS Friendly",
    preview: "single",
    color: "bg-emerald-700",
  },
  {
    id: 13,
    code: "T13",
    name: "Career Essential",
    subtitle: "Single Column • ATS Friendly",
    preview: "sidebar-light",
    color: "bg-rose-500",
  },
  {
    id: 14,
    code: "T14",
    name: "Career Prime",
    subtitle: "Two Column • ATS Friendly",
    preview: "left-accent",
    color: "bg-amber-600",
  },
  {
    id: 15,
    code: "T15",
    name: "Executive Prestige",
    subtitle: "Two Column • ATS Friendly",
    preview: "sidebar-light",
    color: "bg-slate-700",
  },
]);

export type TemplateFamily =
  | "ModernLayout"
  | "SidebarLayout"
  | "MinimalLayout"
  | "ExecutiveLayout"
  | "ProfessionalLayout";

export const getTemplateMetadataById = (templateId: number): TemplateMetadata =>
  TEMPLATE_METADATA.find((template) => template.id === templateId) ?? TEMPLATE_METADATA[0];

export const isValidTemplateId = (templateId: number): boolean =>
  Number.isInteger(templateId) && TEMPLATE_IDS.includes(templateId);

export const getSafeTemplateId = (templateId: number): number =>
  isValidTemplateId(templateId) ? templateId : 1;

export const getTemplateFamily = (templateId: number): TemplateFamily => {
  switch (templateId) {
    case 1:
    case 3:
    case 7:
    case 10:
    case 12:
      return "ModernLayout";
    case 2:
    case 5:
    case 9:
    case 11:
    case 13:
    case 15:
      return "SidebarLayout";
    case 4:
    case 14:
      return "MinimalLayout";
    case 8:
      return "ExecutiveLayout";
    case 6:
      return "ProfessionalLayout";
    default:
      return "ModernLayout";
  }
};
