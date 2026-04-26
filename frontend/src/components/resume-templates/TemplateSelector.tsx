import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { premiumTemplateOptions } from "./premiumShared";

interface TemplateSelectorProps {
  selectedTemplate: number;
  onSelectTemplate: (templateId: number) => void;
}

const previewStyles: Record<number, string> = {
  1: "bg-[linear-gradient(180deg,#fff,#f8fafc)]",
  2: "bg-white",
  3: "bg-slate-100",
  4: "bg-[linear-gradient(135deg,#0f172a,#1e293b)]",
  5: "bg-[linear-gradient(180deg,#fffdfa,#fff7ed)]",
  6: "bg-white",
  7: "bg-[linear-gradient(135deg,#f8fafc,#ecfdf5)]",
  8: "bg-[linear-gradient(135deg,#111315,#27272a)]",
  9: "bg-[linear-gradient(180deg,#fff,#f0fdf4)]",
  10: "bg-[linear-gradient(135deg,#fff1f2,#eef2ff)]",
  11: "bg-[linear-gradient(180deg,#eef2ff,#fff)]",
  12: "bg-[linear-gradient(135deg,#eff6ff,#eef2ff)]",
  13: "bg-white",
  14: "bg-[linear-gradient(135deg,#020617,#111827)]",
  15: "bg-[linear-gradient(180deg,#fffdf7,#f5f5f4)]",
};

const accentStyles: Record<number, string> = {
  1: "bg-amber-400",
  2: "bg-neutral-900",
  3: "bg-teal-500",
  4: "bg-cyan-400",
  5: "bg-rose-400",
  6: "bg-black",
  7: "bg-emerald-500",
  8: "bg-amber-300",
  9: "bg-emerald-500",
  10: "bg-violet-500",
  11: "bg-indigo-500",
  12: "bg-sky-400",
  13: "bg-slate-500",
  14: "bg-cyan-400",
  15: "bg-amber-500",
};

export const TemplateSelector = ({
  selectedTemplate,
  onSelectTemplate,
}: TemplateSelectorProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-900">Choose Template</h3>

      <ScrollArea className="h-[300px] pr-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {premiumTemplateOptions.map((template) => (
            <Card
              key={template.id}
              className={`relative cursor-pointer rounded-2xl border p-3 transition-all hover:-translate-y-0.5 hover:shadow-md ${
                selectedTemplate === template.id
                  ? "border-slate-900 ring-2 ring-slate-900/10"
                  : "border-slate-200"
              }`}
              onClick={() => onSelectTemplate(template.id)}
            >
              <div
                className={`mb-3 h-20 overflow-hidden rounded-xl border border-slate-200 ${previewStyles[template.id]}`}
              >
                <div className="flex h-full">
                  <div className={`w-7 ${accentStyles[template.id]}`} />
                  <div className="flex-1 p-2">
                    <div className={`mb-2 h-2 w-20 rounded ${accentStyles[template.id]} opacity-80`} />
                    <div className="mb-1.5 h-1.5 w-28 rounded bg-slate-300/80" />
                    <div className="mb-1.5 h-1.5 w-24 rounded bg-slate-200/90" />
                    <div className="flex gap-1.5">
                      <div className="h-4 w-10 rounded-full bg-white/80" />
                      <div className="h-4 w-14 rounded-full bg-white/70" />
                      <div className="h-4 w-12 rounded-full bg-white/60" />
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm font-medium text-slate-900">{template.name}</p>
              <p className="mt-1 text-xs text-slate-500">Template {template.id}</p>

              {selectedTemplate === template.id ? (
                <div className="absolute right-2 top-2 rounded-full bg-slate-900 p-1 text-white">
                  <Check className="h-3 w-3" />
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
