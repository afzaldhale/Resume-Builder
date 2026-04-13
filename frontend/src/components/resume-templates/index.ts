import React from "react";

import Template1 from "./Template1";
import Template2 from "./Template2";
import Template3 from "./Template3";
import Template4 from "./Template4";
import Template5 from "./Template5";
import Template6 from "./Template6";
import Template7 from "./Template7";
import EmptyTemplate from "./EmptyTemplate";

import { ResumeData } from "./types";

/**
 * Resume category
 */
export type ResumeType = "FRESHER" | "EXPERIENCED";

/**
 * Template metadata interface
 * Strictly typed – no `any`
 */
export interface TemplateMeta {
  id: string;
  name: string;
  component: React.ComponentType<{ data: ResumeData }>;
  supportedFor: ResumeType[];
}

/**
 * Central template registry
 * Single source of truth
 */
export const TEMPLATE_REGISTRY: TemplateMeta[] = [
  {
    id: "template1",
    name: "Clean Fresher",
    component: Template1,
    supportedFor: ["FRESHER"],
  },
  {
    id: "template2",
    name: "Student Modern",
    component: Template2,
    supportedFor: ["FRESHER"],
  },
  {
    id: "template3",
    name: "Professional Blue",
    component: Template3,
    supportedFor: ["EXPERIENCED"],
  },
  {
    id: "template4",
    name: "Corporate Classic",
    component: Template4,
    supportedFor: ["EXPERIENCED"],
  },
  {
    id: "template5",
    name: "Minimal Pro",
    component: Template5,
    supportedFor: ["EXPERIENCED"],
  },
  {
    id: "template6",
    name: "Hybrid",
    component: Template6,
    supportedFor: ["FRESHER", "EXPERIENCED"],
  },
  {
    id: "template7",
    name: "Creative",
    component: Template7,
    supportedFor: ["EXPERIENCED"],
  },
];

/**
 * Fallback template
 */
export { EmptyTemplate };

/**
 * Re-export resume data types
 */
export * from "./types";
