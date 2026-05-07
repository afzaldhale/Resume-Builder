import type { ComponentType } from "react";
import Template1 from "./Template1";
import Template2 from "./Template2";
import Template3 from "./Template3";
import Template4 from "./Template4";
import Template5 from "./Template5";
import Template6 from "./Template6";
import Template7 from "./Template7";
import Template8 from "./Template8";
import Template9 from "./Template9";
import Template10 from "./Template10";
import Template11 from "./Template11";
import Template12 from "./Template12";
import Template13 from "./Template13";
import Template14 from "./Template14";
import Template15 from "./Template15";
import type { ResumeData } from "./types";
import EmptyTemplate from "./EmptyTemplate";

export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1123;

export type ResumeTemplateComponent = ComponentType<{ data: ResumeData }>;

// Single source of truth for both live preview and PDF rendering.
export const TEMPLATE_COMPONENTS: Record<number, ResumeTemplateComponent> = {
  1: Template1,
  2: Template2,
  3: Template3,
  4: Template4,
  5: Template5,
  6: Template6,
  7: Template7,
  8: Template8,
  9: Template9,
  10: Template10,
  11: Template11,
  12: Template12,
  13: Template13,
  14: Template14,
  15: Template15,
};

export const TEMPLATE_IDS = Object.freeze(
  Object.keys(TEMPLATE_COMPONENTS)
    .map(Number)
    .sort((a, b) => a - b)
);

export const isValidTemplateId = (templateId: number) =>
  Number.isInteger(templateId) && templateId in TEMPLATE_COMPONENTS;

export const getSafeTemplateId = (templateId: number) =>
  isValidTemplateId(templateId) ? templateId : 1;

export const getTemplateComponent = (templateId: number) =>
  TEMPLATE_COMPONENTS[getSafeTemplateId(templateId)] || EmptyTemplate;

