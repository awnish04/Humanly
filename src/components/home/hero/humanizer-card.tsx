"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Copy, X, Sparkles, ScanSearch } from "lucide-react";
import { toast } from "sonner";
import { MAX_WORDS, countWords } from "./hero-data";

// ── AI score heuristic ────────────────────────────────────────────────────────
function estimateAiScore(text: string): number {
  if (!text.trim()) return 0;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  if (!sentences.length) return 0;
  let score = 0;
  const lengths = sentences.map((s) => s.trim().split(/\s+/).length);
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance =
    lengths.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / lengths.length;
  if (variance < 10) score += 25;
  else if (variance < 25) score += 10;
  const aiPhrases = [
    /\bit is important to note\b/i,
    /\bfurthermore\b/i,
    /\bmoreover\b/i,
    /\bin conclusion\b/i,
    /\bin summary\b/i,
    /\boverall\b/i,
    /\bsignificant(ly)?\b/i,
    /\bultimately\b/i,
    /\bnevertheless\b/i,
    /\bin addition\b/i,
    /\bto summarize\b/i,
    /\bit should be noted\b/i,
  ];
  score += Math.min(aiPhrases.filter((p) => p.test(text)).length * 8, 40);
  const words = text.trim().split(/\s+/).length;
  if ((text.match(/\b\w+'\w+\b/g) ?? []).length / words < 0.01) score += 15;
  if (
    (text.match(/\b(is|are|was|were|be|been|being)\s+\w+ed\b/gi) ?? []).length /
      sentences.length >
    0.5
  )
    score += 10;
  if (
    (text.match(/\b(I|we|my|our|I've|we've|I'm|we're)\b/g) ?? []).length === 0
  )
    score += 10;
  return Math.min(score, 100);
}

function AiScoreBadge({ score }: { score: number }) {
  const label =
    score >= 70 ? "Likely AI" : score >= 40 ? "Mixed" : "Likely Human";
  const color =
    score >= 70
      ? "bg-destructive/10 text-destructive border-destructive/30"
      : score >= 40
        ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/30 dark:text-yellow-400"
        : "bg-primary/10 text-primary border-primary/30";
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs font-semibold",
        color,
      )}
    >
      <span>
        {score}% AI · {label}
      </span>
      <div className="w-12 h-1.5 rounded-full bg-current/20 overflow-hidden">
        <div
          className="h-full rounded-full bg-current transition-all duration-500"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export function HumanizerCard() {
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [activeOption, setActiveOption] = useState(0);
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [aiScore, setAiScore] = useState<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = countWords(inputText);
  const isOverLimit = wordCount > MAX_WORDS;
  const outputText = results[activeOption] ?? "";
  const outputWordCount = countWords(outputText);

  const handleClear = () => {
    setInputText("");
    setResults([]);
    setActiveOption(0);
    setAiScore(null);
  };
  const handleCopyOutput = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      toast.success("Copied!");
    } catch {
      toast.error("Failed to copy");
    }
  };
  const handleDetect = () => {
    if (!inputText.trim()) {
      toast.error("Enter text to check");
      return;
    }
    setDetecting(true);
    setTimeout(() => {
      setAiScore(estimateAiScore(inputText));
      setDetecting(false);
    }, 600);
  };
  const handleHumanize = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text");
      return;
    }
    if (isOverLimit) {
      toast.error(`Max ${MAX_WORDS} words`);
      return;
    }
    setLoading(true);
    setAiScore(null);
    try {
      const res = await fetch("/api/humanize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Failed");
        return;
      }
      setResults((data.results as { text: string }[]).map((r) => r.text));
      setActiveOption(0);
      toast.success("Done! 🎉");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
      {/* Both panels use the same 3-row grid: header / textarea / footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x divide-border">
        {/* ── LEFT ── */}
        <div className="grid grid-rows-[44px_1fr_52px]">
          {/* Header — 44px */}
          <div className="flex items-center px-4 border-b border-border">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Input
            </span>
            {aiScore !== null && (
              <span className="ml-3">
                <AiScoreBadge score={aiScore} />
              </span>
            )}
          </div>

          {/* Textarea */}
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setAiScore(null);
            }}
            placeholder="Paste your AI-generated text here…"
            className={cn(
              "w-full h-full resize-none bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground outline-none border-0 min-h-[380px] sm:min-h-[460px] lg:min-h-[520px]",
              isOverLimit && "text-destructive",
            )}
          />

          {/* Footer — 52px */}
          <div className="flex items-center justify-between gap-2 px-4 border-t border-border">
            <span
              className={cn(
                "text-xs",
                isOverLimit
                  ? "text-destructive font-semibold"
                  : "text-muted-foreground",
              )}
            >
              {wordCount} / {MAX_WORDS} words
            </span>
            <div className="flex items-center gap-2">
              {inputText && (
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="size-3" /> Clear
                </button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleDetect}
                disabled={detecting || !inputText.trim()}
                className="gap-1.5 h-7 px-2.5 text-xs"
              >
                {detecting ? (
                  <span className="size-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ScanSearch className="size-3.5" />
                )}
                Check AI
              </Button>
              <Button
                size="sm"
                onClick={handleHumanize}
                disabled={isOverLimit || loading || !inputText.trim()}
                className="gap-1.5 h-7 px-2.5 text-xs"
              >
                {loading ? (
                  <>
                    <span className="size-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Humanizing…
                  </>
                ) : (
                  <>
                    <Sparkles className="size-3.5" />
                    Humanize AI
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="grid grid-rows-[44px_1fr_52px] border-t md:border-t-0 border-border">
          {/* Header — 44px */}
          <div className="flex items-center justify-between px-4 border-b border-border">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {outputText ? "Result" : "Output"}
            </span>
            {results.length > 1 && (
              <div className="flex items-center gap-1">
                {results.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveOption(i)}
                    className={cn(
                      "px-2 py-0.5 rounded-md text-xs font-medium transition-colors",
                      activeOption === i
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Output */}
          <div className="overflow-y-auto bg-background p-4 min-h-[380px] sm:min-h-[460px] lg:min-h-[520px]">
            <p
              className={cn(
                "text-sm whitespace-pre-wrap leading-relaxed",
                outputText ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {outputText || "Humanized text will appear here"}
            </p>
          </div>

          {/* Footer — 52px */}
          <div className="flex items-center justify-between gap-2 px-4 border-t border-border">
            <span className="text-xs text-muted-foreground">
              {outputWordCount} / {MAX_WORDS} words
            </span>
            {outputText && (
              <button
                onClick={handleCopyOutput}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Copy className="size-3" /> Copy
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
