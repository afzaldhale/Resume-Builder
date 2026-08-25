import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TEMPLATE_METADATA,
  getTemplateMetadataById,
} from "@/components/resume-shared/TemplateMetadata";
import TemplateThumbnail from "./TemplateThumbnail";

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
                  <TemplateThumbnail templateId={template.id} compact={compact} />
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
