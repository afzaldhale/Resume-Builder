import { Suspense, lazy, type ComponentType, type ReactNode } from "react";
import type { ResumeData } from "./types";
import EmptyTemplate from "./EmptyTemplate";

type TemplateModule = { default: ComponentType<{ data: ResumeData }> };

const templateImports: Record<number, () => Promise<TemplateModule>> = {
  1: () => import("./Template1"),
  2: () => import("./Template2"),
  3: () => import("./Template3"),
  4: () => import("./Template4"),
  5: () => import("./Template5"),
  6: () => import("./Template6"),
  7: () => import("./Template7"),
  8: () => import("./Template8"),
  9: () => import("./Template9"),
  10: () => import("./Template10"),
  11: () => import("./Template11"),
  12: () => import("./Template12"),
  13: () => import("./Template13"),
  14: () => import("./Template14"),
  15: () => import("./Template15"),
};

const templateCache = new Map<number, ComponentType<{ data: ResumeData }>>();

export const loadTemplateComponent = (templateId: number) => {
  if (!templateCache.has(templateId) && templateImports[templateId]) {
    templateCache.set(templateId, lazy(templateImports[templateId]));
  }

  return templateCache.get(templateId) || EmptyTemplate;
};

export const LazyTemplateRenderer = ({
  templateId,
  data,
  fallback,
}: {
  templateId: number;
  data: ResumeData;
  fallback?: ReactNode;
}) => {
  const TemplateComponent = loadTemplateComponent(templateId);

  return (
    <Suspense fallback={fallback || <div className="p-6 text-sm text-muted-foreground">Loading template...</div>}>
      <TemplateComponent data={data} />
    </Suspense>
  );
};
