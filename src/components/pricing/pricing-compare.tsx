import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";

// ── Data ──────────────────────────────────────────────────────────────────────

type CellValue =
  | { type: "text"; value: string; highlight?: boolean }
  | { type: "check" }
  | { type: "cross" }
  | { type: "neutral"; value: string };

interface Row {
  feature: string;
  description?: string;
  chatgpt: CellValue;
  others: CellValue;
  humanly: CellValue;
}

const ROWS: Row[] = [
  {
    feature: "AI Detection Resistance",
    description:
      "Ability to bypass advanced AI detectors like Turnitin, Originality AI, GPTZero, etc.",
    chatgpt: { type: "text", value: "10–30%", highlight: false },
    others: { type: "text", value: "40–80%", highlight: false },
    humanly: { type: "text", value: "99%", highlight: true },
  },
  {
    feature: "Rewriting Level",
    description: "How deeply the text is rewritten",
    chatgpt: { type: "neutral", value: "Paraphrasing" },
    others: { type: "neutral", value: "Slight restructuring" },
    humanly: { type: "text", value: "Deep rewriting", highlight: true },
  },
  {
    feature: "Content Quality",
    description: "Natural flow and readability of output",
    chatgpt: { type: "neutral", value: "Robotic & detectable" },
    others: { type: "neutral", value: "Often robotic" },
    humanly: { type: "text", value: "Human-like fluency", highlight: true },
  },
  {
    feature: "Rewriting Technique",
    description: "Methods used to rewrite text",
    chatgpt: { type: "neutral", value: "Prompt engineering" },
    others: { type: "neutral", value: "Advanced prompting" },
    humanly: {
      type: "text",
      value: "Specialized AI model trained on human texts",
      highlight: true,
    },
  },
  {
    feature: "Multiple Results",
    description: "Multiple output options to choose from",
    chatgpt: { type: "cross" },
    others: { type: "cross" },
    humanly: { type: "check" },
  },
  {
    feature: "Academic Use",
    description: "Passes university-grade AI detection systems",
    chatgpt: { type: "cross" },
    others: { type: "cross" },
    humanly: { type: "check" },
  },
  {
    feature: "SEO Optimization",
    description: "Rewritten texts indexed naturally by Google",
    chatgpt: { type: "cross" },
    others: { type: "neutral", value: "Limited" },
    humanly: { type: "check" },
  },
  {
    feature: "Turnitin Bypass",
    description: "Specifically trained to pass Turnitin checks",
    chatgpt: { type: "cross" },
    others: { type: "cross" },
    humanly: { type: "check" },
  },
  {
    feature: "Plagiarism-Free Output",
    description: "Unique content that won't trigger plagiarism tools",
    chatgpt: { type: "cross" },
    others: { type: "neutral", value: "Partial" },
    humanly: { type: "check" },
  },
  {
    feature: "Unlimited AI Detection",
    description: "Check any text for AI patterns at no extra cost",
    chatgpt: { type: "cross" },
    others: { type: "cross" },
    humanly: { type: "check" },
  },
];

// ── Cell renderer ─────────────────────────────────────────────────────────────
function Cell({ value, isHumanly }: { value: CellValue; isHumanly?: boolean }) {
  if (value.type === "check") {
    return (
      <div className="flex justify-center">
        <Check className="size-5 text-primary" strokeWidth={2.5} />
      </div>
    );
  }
  if (value.type === "cross") {
    return (
      <div className="flex justify-center">
        <X className="size-4 text-destructive" strokeWidth={2.5} />
      </div>
    );
  }
  if (value.type === "neutral") {
    return (
      <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
        <Minus className="size-3.5 shrink-0" />
        {value.value}
      </div>
    );
  }
  // text
  return (
    <p
      className={cn(
        "text-sm text-center",
        value.highlight
          ? "font-semibold text-primary"
          : "text-muted-foreground",
      )}
    >
      {value.value}
    </p>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
export function PricingCompare() {
  return (
    <section className="section">
      <div className="container-page">
        <BlurFade delay={0} duration={0.5} inView>
          <div className="flex flex-col gap-1 items-center text-center mb-12">
            <Badge
              variant="outline"
              className="w-fit rounded-full border-primary/30 text-primary px-3 py-1 text-xs"
            >
              ✦ Comparison
            </Badge>
            <h2 className=" max-w-4xl">
              Why choose Humanly over other rewriting tools?
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-base">
              Traditional AI rewriters rely on basic prompt engineering advanced
              detectors catch them every time. Humanly uses a specially trained
              model that learns from thousands of human-written texts.
            </p>
          </div>
        </BlurFade>

        <BlurFade delay={0.15} duration={0.5} inView>
          <div className="w-full overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[640px] border-collapse">
              {/* Header */}
              <thead>
                <tr>
                  {/* Feature column */}
                  <th className="w-[35%] px-6 py-5 text-left text-sm font-semibold text-muted-foreground border-b border-border bg-muted/30">
                    Feature
                  </th>
                  {/* ChatGPT */}
                  <th className="w-[21%] px-4 py-5 text-center border-b border-border bg-muted/30">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm font-bold text-foreground">
                        ChatGPT
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Raw AI output
                      </span>
                    </div>
                  </th>
                  {/* Other Humanizers */}
                  <th className="w-[21%] px-4 py-5 text-center border-b border-border bg-muted/30">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm font-bold text-foreground">
                        Other Humanizers
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Generic tools
                      </span>
                    </div>
                  </th>
                  {/* Humanly — highlighted */}
                  <th className="w-[23%] px-4 py-5 text-center border-b border-border bg-primary/5">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="flex size-5 items-center justify-center rounded-md bg-primary text-[10px] font-bold text-primary-foreground">
                          H
                        </span>
                        <span className="text-sm font-bold text-primary">
                          Humanly
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Specialized engine
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>

              {/* Rows */}
              <tbody>
                {ROWS.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={cn(
                      i < ROWS.length - 1 && "border-b border-border",
                    )}
                  >
                    {/* Feature */}
                    <td className="px-6 py-4 bg-muted/10">
                      <p className="text-sm font-semibold text-foreground">
                        {row.feature}
                      </p>
                      {row.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 max-w-none">
                          {row.description}
                        </p>
                      )}
                    </td>
                    {/* ChatGPT */}
                    <td className="px-4 py-4 text-center">
                      <Cell value={row.chatgpt} />
                    </td>
                    {/* Others */}
                    <td className="px-4 py-4 text-center">
                      <Cell value={row.others} />
                    </td>
                    {/* Humanly */}
                    <td className="px-4 py-4 text-center bg-primary/5">
                      <Cell value={row.humanly} isHumanly />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
