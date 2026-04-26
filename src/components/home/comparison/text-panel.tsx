import { cn } from "@/lib/utils";

interface TextPanelProps {
  title: string;
  content: string;
  label: string;
  variant: "before" | "after";
}

export function TextPanel({ title, content, label, variant }: TextPanelProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col p-8 rounded-2xl",
        variant === "before"
          ? "bg-destructive/10 border border-destructive/20"
          : "bg-primary/10 border border-primary/20",
      )}
    >
      {/* Header */}
      <div className="flex flex-col gap-2 mb-6">
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <span
          className={cn(
            "text-xs font-semibold uppercase tracking-wide",
            variant === "before" ? "text-destructive" : "text-primary",
          )}
        >
          {label}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap text-justify">
          {content}
        </p>
      </div>
    </div>
  );
}
