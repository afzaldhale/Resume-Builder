import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const normalizePastedContent = (value: string) =>
  value
    .replace(/\r\n/g, "\n")
    .replace(/[•▪◦]/g, "•")
    .replace(/^\s*[-*]\s+/gm, "• ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

interface SmartTextareaFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  helper: string;
  recommended: string;
  maxLength: number;
  minHeightClassName?: string;
}

export const SmartTextareaField = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  helper,
  recommended,
  maxLength,
  minHeightClassName = "min-h-[132px]",
}: SmartTextareaFieldProps) => {
  const count = value.trim().length;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={id} className="text-sm font-semibold text-slate-900">
          {label}
        </Label>
        <span className="text-[11px] text-slate-500">{count}/{maxLength}</span>
      </div>

      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onChange(normalizePastedContent(e.target.value))}
        placeholder={placeholder}
        maxLength={maxLength}
        className={[
          minHeightClassName,
          "rounded-2xl border-slate-200 bg-white/90 px-4 py-3.5 text-[15px] leading-6 text-slate-800 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-all duration-200 placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:ring-4 focus-visible:ring-blue-100",
        ].join(" ")}
      />

      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-3.5 py-3 text-[12px] text-slate-600">
        <p className="font-medium text-slate-700">{helper}</p>
        <p className="mt-1">Recommended: {recommended}</p>
        <p className="mt-1">Bullets supported. Pasted content is cleaned automatically when you leave the field.</p>
      </div>
    </div>
  );
};
