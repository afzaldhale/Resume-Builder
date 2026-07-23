import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TEMPLATE_METADATA,
  getTemplateMetadataById,
  type TemplateDisplayVariant,
} from "@/components/resume-shared/TemplateMetadata";

interface TemplateSelectorProps {
  selectedTemplate: number;
  onSelectTemplate: (templateId: number) => void;
  onUseTemplate?: (templateId: number) => void;
  actionLabel?: string;
  compact?: boolean;
}

export const templates = TEMPLATE_METADATA;

export const getTemplateById = (templateId: number) =>
  getTemplateMetadataById(templateId);

const MiniPreview = ({ preview, color }: { preview: TemplateDisplayVariant; color: string }) => {
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
                  <p className="text-sm text-slate-500">{template.subtitle}</p>
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
