import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TemplateSelectorProps {
  selectedTemplate: number;
  onSelectTemplate: (templateId: number) => void;
  onUseTemplate?: (templateId: number) => void;
  actionLabel?: string;
  compact?: boolean;
}

export const templates = [
  { id: 1, name: "Clean Single Column", category: "Single Column", color: "bg-blue-700", preview: "single" },
  { id: 2, name: "Corporate Sidebar Blue", category: "Sidebar", color: "bg-blue-700", preview: "sidebar-dark" },
  { id: 3, name: "Colored Heading Corporate", category: "Corporate", color: "bg-blue-500", preview: "bar-top" },
  { id: 4, name: "Left Accent Teal", category: "Accent", color: "bg-teal-700", preview: "left-accent" },
  { id: 5, name: "Premium Gray Sidebar", category: "Sidebar", color: "bg-slate-500", preview: "sidebar-light" },
  { id: 6, name: "Professional Sidebar Teal", category: "Sidebar", color: "bg-teal-700", preview: "sidebar-dark" },
  { id: 7, name: "Muted Coral Corporate", category: "Corporate", color: "bg-rose-500", preview: "bar-top" },
  { id: 8, name: "Compact ATS Single", category: "ATS", color: "bg-slate-700", preview: "single-compact" },
  { id: 9, name: "Premium Charcoal Sidebar", category: "Premium", color: "bg-slate-700", preview: "sidebar-dark" },
  { id: 10, name: "Blue Heading Corporate", category: "Corporate", color: "bg-blue-700", preview: "bar-top" },
  { id: 11, name: "Classic Two Column", category: "Classic", color: "bg-stone-600", preview: "sidebar-light" },
  { id: 12, name: "Soft Green Corporate", category: "Corporate", color: "bg-emerald-700", preview: "single" },
  { id: 13, name: "Rose Sidebar Corporate", category: "Sidebar", color: "bg-rose-500", preview: "sidebar-light" },
  { id: 14, name: "Minimal Left Accent", category: "Minimal", color: "bg-amber-600", preview: "left-accent" },
  { id: 15, name: "Corporate Clean", category: "Clean", color: "bg-slate-700", preview: "sidebar-light" },
] as const;

export const getTemplateById = (templateId: number) =>
  templates.find((template) => template.id === templateId) ?? templates[0];

const MiniPreview = ({ preview, color }: { preview: string; color: string }) => {
  if (preview === "sidebar-dark") {
    return (
      <div className="flex w-full h-full bg-white">
        <div className={`w-8 ${color}`} />
        <div className="flex-1 p-1.5">
          <div className="h-1.5 w-10 bg-gray-400 rounded mb-1" />
          <div className={`h-2 w-14 ${color} mb-2`} />
          <div className="h-1 w-full bg-gray-200 rounded mb-1" />
          <div className="h-1 w-5/6 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (preview === "sidebar-light") {
    return (
      <div className="flex w-full h-full bg-white">
        <div className="w-8 bg-gray-100 border-r" />
        <div className="flex-1 p-1.5">
          <div className="h-1.5 w-10 bg-gray-400 rounded mb-1" />
          <div className="h-0.5 w-full bg-gray-300 mb-2" />
          <div className="h-1 w-full bg-gray-200 rounded mb-1" />
          <div className="h-1 w-4/5 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (preview === "left-accent") {
    return (
      <div className="flex w-full h-full bg-white">
        <div className={`w-1.5 ${color}`} />
        <div className="flex-1 p-1.5">
          <div className="h-1.5 w-10 bg-gray-400 rounded mb-1" />
          <div className="pl-2 border-l-2 border-gray-300 mb-2">
            <div className="h-1 w-8 bg-gray-300 rounded" />
          </div>
          <div className="h-1 w-full bg-gray-200 rounded mb-1" />
          <div className="h-1 w-5/6 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (preview === "bar-top") {
    return (
      <div className="flex flex-col w-full h-full bg-white">
        <div className={`h-2 ${color}`} />
        <div className="p-1.5">
          <div className="h-1.5 w-10 bg-gray-400 rounded mb-1" />
          <div className={`h-2 w-14 ${color} mb-2`} />
          <div className="h-1 w-full bg-gray-200 rounded mb-1" />
          <div className="h-1 w-4/5 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (preview === "single-compact") {
    return (
      <div className="w-full h-full bg-white p-1.5">
        <div className="flex items-center justify-between mb-1.5">
          <div className="h-1.5 w-10 bg-gray-400 rounded" />
          <div className="h-1 w-8 bg-gray-200 rounded" />
        </div>
        <div className="h-0.5 w-full bg-gray-300 mb-2" />
        <div className="h-1 w-full bg-gray-200 rounded mb-1" />
        <div className="h-1 w-5/6 bg-gray-100 rounded" />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white p-1.5">
      <div className="h-1.5 w-10 bg-gray-400 rounded mb-1" />
      <div className="h-0.5 w-full bg-gray-300 mb-2" />
      <div className="h-1 w-full bg-gray-200 rounded mb-1" />
      <div className="h-1 w-5/6 bg-gray-100 rounded mb-1" />
      <div className="h-1 w-2/3 bg-gray-100 rounded" />
    </div>
  );
};

export const TemplateSelector = memo(({
  selectedTemplate,
  onSelectTemplate,
  onUseTemplate,
  actionLabel = "Use Template",
  compact = false,
}: TemplateSelectorProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {templates.map((template) => {
        const isSelected = selectedTemplate === template.id;

        return (
          <Card
            key={template.id}
            className={`group relative overflow-hidden border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
              isSelected ? "ring-2 ring-primary shadow-lg" : ""
            }`}
          >
            <button
              type="button"
              className="w-full p-0 text-left"
              onClick={() => onSelectTemplate(template.id)}
            >
              <div className={`border-b bg-slate-100/70 p-4 ${compact ? "h-36" : "h-44"}`}>
                <div className="h-full overflow-hidden rounded-xl border bg-white shadow-sm">
                  <MiniPreview preview={template.preview} color={template.color} />
                </div>
              </div>
            </button>

            <div className="space-y-4 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <p className="text-base font-semibold text-foreground">{template.name}</p>
                  <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {template.category}
                  </span>
                </div>

                {isSelected ? (
                  <div className="rounded-full bg-primary p-1.5 text-primary-foreground">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                ) : null}
              </div>

              <Button
                type="button"
                className="w-full"
                variant={isSelected ? "default" : "outline"}
                onClick={() => {
                  onSelectTemplate(template.id);
                  onUseTemplate?.(template.id);
                }}
              >
                {actionLabel}
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
});
