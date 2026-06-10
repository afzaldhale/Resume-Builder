/**
 * Migration stabilization scaffold.
 *
 * This module will become the template metadata and family mapping registry.
 */

export const TEMPLATE_IDS = Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

export type TemplateFamily =
  | "ModernLayout"
  | "SidebarLayout"
  | "MinimalLayout"
  | "ExecutiveLayout"
  | "ProfessionalLayout";

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
