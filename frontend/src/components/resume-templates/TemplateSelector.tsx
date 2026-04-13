import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check } from "lucide-react";

interface TemplateSelectorProps {
  selectedTemplate: number;
  onSelectTemplate: (templateId: number) => void;
}

const templates = [
  { id: 1, name: "Teal Sidebar", color: "bg-teal-500", preview: "bg-white" },
  { id: 2, name: "Blue Professional", color: "bg-slate-700", preview: "bg-slate-100" },
  { id: 3, name: "Orange Creative", color: "bg-orange-500", preview: "bg-orange-50" },
  { id: 4, name: "Sky Blue Header", color: "bg-sky-200", preview: "bg-sky-50" },
  { id: 5, name: "Gray Modern", color: "bg-slate-500", preview: "bg-slate-50" },
  { id: 6, name: "Orange Two-Column", color: "bg-orange-400", preview: "bg-orange-50" },
  { id: 7, name: "Rose Elegant", color: "bg-rose-400", preview: "bg-rose-50" },
  { id: 8, name: "Clean Minimalist", color: "bg-blue-500", preview: "bg-blue-50" },
  { id: 9, name: "Dark Theme", color: "bg-gray-800", preview: "bg-gray-900" },
  { id: 10, name: "Modern Gradient", color: "bg-gradient-to-r from-blue-400 to-emerald-400", preview: "bg-gradient-to-br from-blue-50 via-white to-emerald-50" },

  // 🔹 NEW TEMPLATES
  { id: 11, name: "Classic Two Column", color: "bg-indigo-600", preview: "bg-indigo-50" },
  { id: 12, name: "Soft Green", color: "bg-emerald-500", preview: "bg-emerald-50" },
  { id: 13, name: "Creative Blocks", color: "bg-fuchsia-500", preview: "bg-fuchsia-50" },
  { id: 14, name: "Minimal Professional", color: "bg-slate-800", preview: "bg-white" },
  { id: 15, name: "Corporate Clean", color: "bg-slate-800", preview: "bg-slate-100" },
];

export const TemplateSelector = ({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) => {
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
              <div className={`h-16 rounded ${template.preview} mb-2 flex overflow-hidden border`}>

                {/* Shared mini preview patterns */}
                {(template.id === 1 || template.id === 8 || template.id === 11) && (
                  <div className="flex w-full">
                    <div className={`w-8 ${template.color}`} />
                    <div className="flex-1 p-1">
                      <div className="h-1 w-8 bg-gray-300 rounded mb-1" />
                      <div className="h-1 w-6 bg-gray-200 rounded" />
                    </div>
                  </div>
                )}

                {(template.id === 2 || template.id === 14 || template.id === 15) && (
                  <div className="flex w-full">
                    <div className={`w-6 ${template.color}`} />
                    <div className="flex-1 p-1 text-center">
                      <div className="h-1.5 w-10 bg-gray-300 rounded mx-auto mb-1" />
                      <div className="h-0.5 w-6 bg-gray-400 mx-auto" />
                    </div>
                  </div>
                )}

                {(template.id === 3 || template.id === 12) && (
                  <div className="flex w-full">
                    <div className={`w-8 ${template.color}`} />
                    <div className="flex-1 p-1">
                      <div className="h-1 w-10 bg-gray-300 rounded mb-1" />
                      <div className="h-1 w-8 bg-gray-200 rounded" />
                    </div>
                  </div>
                )}

                {(template.id === 4 || template.id === 13) && (
                  <div className="flex flex-col w-full">
                    <div className={`h-4 ${template.color}`} />
                    <div className="flex-1 p-1">
                      <div className="h-1 w-10 bg-gray-300 rounded mb-1 border-l-2 border-current pl-1" />
                    </div>
                  </div>
                )}

                {(template.id === 5 || template.id === 6 || template.id === 7) && (
                  <div className="flex w-full">
                    <div className="flex-1 flex flex-col">
                      <div className={`h-4 ${template.color}`} />
                      <div className="p-1">
                        <div className="h-1 w-8 bg-gray-300 rounded" />
                      </div>
                    </div>
                    <div className={`w-6 ${template.color}`} />
                  </div>
                )}

                {template.id === 9 && (
                  <div className="w-full bg-gray-900 p-1">
                    <div className="h-1 w-8 bg-gray-300 rounded mb-1" />
                    <div className="h-1 w-6 bg-gray-400 rounded mb-1" />
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-gray-700 rounded-full mr-1" />
                      <div className="h-0.5 w-4 bg-gray-500 rounded" />
                    </div>
                  </div>
                )}

                {template.id === 10 && (
                  <div className="w-full p-1">
                    <div className="h-1.5 w-10 bg-blue-300 rounded mb-1 mx-auto" />
                    <div className="flex justify-center gap-1 mb-1">
                      <div className={`h-1 w-6 ${template.color}`} />
                      <div className={`h-1 w-6 ${template.color}`} />
                    </div>
                    <div className="flex justify-center">
                      <div className="h-0.5 w-3 bg-emerald-300 rounded" />
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs font-medium truncate">{template.name}</p>

              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
