/**
 * Migration stabilization scaffold.
 *
 * This module is intentionally a migration placeholder.
 * It will be developed into the runtime layout selection engine in later phases.
 */

export type LayoutFamily =
  | "ModernLayout"
  | "SidebarLayout"
  | "MinimalLayout"
  | "ExecutiveLayout"
  | "ProfessionalLayout";

export interface LayoutEngineOptions {
  templateId: number;
}

export const selectLayoutFamily = (_options: LayoutEngineOptions): LayoutFamily =>
  "ModernLayout";
