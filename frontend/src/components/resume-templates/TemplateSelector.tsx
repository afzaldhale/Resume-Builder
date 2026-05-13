import { memo } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check } from "lucide-react";

interface TemplateSelectorProps {
  selectedTemplate: number;
  onSelectTemplate: (templateId: number) => void;
}

const templates = [
  { id: 1, name: "Clean Single Column", color: "bg-blue-700", preview: "single" },
  { id: 2, name: "Corporate Sidebar Blue", color: "bg-blue-700", preview: "sidebar-dark" },
  { id: 3, name: "Colored Heading Corporate", color: "bg-blue-500", preview: "bar-top" },
  { id: 4, name: "Left Accent Teal", color: "bg-teal-700", preview: "left-accent" },
  { id: 5, name: "Premium Gray Sidebar", color: "bg-slate-500", preview: "sidebar-light" },
  { id: 6, name: "Professional Sidebar Teal", color: "bg-teal-700", preview: "sidebar-dark" },
  { id: 7, name: "Muted Coral Corporate", color: "bg-rose-500", preview: "bar-top" },
  { id: 8, name: "Compact ATS Single", color: "bg-slate-700", preview: "single-compact" },
  { id: 9, name: "Premium Charcoal Sidebar", color: "bg-slate-700", preview: "sidebar-dark" },
  { id: 10, name: "Blue Heading Corporate", color: "bg-blue-700", preview: "bar-top" },
  { id: 11, name: "Classic Two Column", color: "bg-stone-600", preview: "sidebar-light" },
  { id: 12, name: "Soft Green Corporate", color: "bg-emerald-700", preview: "single" },
  { id: 13, name: "Rose Sidebar Corporate", color: "bg-rose-500", preview: "sidebar-light" },
  { id: 14, name: "Minimal Left Accent", color: "bg-amber-600", preview: "left-accent" },
  { id: 15, name: "Corporate Clean", color: "bg-slate-700", preview: "sidebar-light" },
];

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

export const TemplateSelector = memo(({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) => {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm">Choose Template</h3>

      <ScrollArea className="h-[280px] pr-4">
        <div className="grid grid-cols-2 gap-2">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={`p-3 cursor-pointer transition-all hover:shadow-md relative ${
                selectedTemplate === template.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => onSelectTemplate(template.id)}
            >
              <div className="h-16 rounded mb-2 flex overflow-hidden border bg-white">
                <MiniPreview preview={template.preview} color={template.color} />
              </div>

              <p className="text-xs font-medium truncate">{template.name}</p>

              {selectedTemplate === template.id ? (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
});
