"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ClipboardPaste } from "lucide-react";
import { MAX_WORDS, INTENSITY_STEPS, countWords } from "./hero-data";

export function HumanizerCard() {
  const [text, setText] = useState("");
  const [intensity, setIntensity] = useState(50);
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = countWords(text);
  const isOverLimit = wordCount > MAX_WORDS;

  const intensityLabel =
    INTENSITY_STEPS.find((s) => s.value === intensity)?.label ??
    (intensity < 50 ? "Basic" : intensity < 100 ? "Enhanced" : "Aggressive");

  const handlePaste = useCallback(async () => {
    try {
      const clip = await navigator.clipboard.readText();
      setText(clip);
      setError("");
    } catch {
      textareaRef.current?.focus();
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (!text.trim()) {
      setError("Please enter some text to humanize.");
      return;
    }
    if (isOverLimit) {
      setError(`Reduce text to ${MAX_WORDS} words or fewer.`);
      return;
    }
    setError("");
    alert("Humanizing… (API integration pending)");
  }, [text, isOverLimit]);

  return (
    <Card className="w-full shadow-2xl gap-0 py-0 overflow-hidden flex flex-col min-h-[420px] sm:min-h-[520px] lg:min-h-[600px]">
      {/* Textarea area */}
      <CardContent className="p-4 sm:p-5 pb-3 flex-1 flex flex-col">
        {/* Header row */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-muted-foreground">Type or</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePaste}
            className="h-7 px-2.5 text-xs gap-1.5 rounded-md"
          >
            <ClipboardPaste className="size-3" />
            Paste
          </Button>
        </div>

        {/* Textarea */}
        <Textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError("");
          }}
          placeholder="Paste your AI-generated text here…"
          rows={8}
          aria-label="AI text input"
          aria-describedby="word-count"
          className={cn(
            "flex-1 resize-none",
            isOverLimit &&
              "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
          )}
        />

        {/* Word count + progress bar */}
        <div className="mt-2 space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {wordCount > 0 && (
                <span
                  className={cn(isOverLimit && "text-destructive font-medium")}
                >
                  {wordCount} word{wordCount !== 1 ? "s" : ""}
                </span>
              )}
            </span>
            <div
              id="word-count"
              aria-live="polite"
              className={cn(
                "text-xs font-mono tabular-nums",
                isOverLimit
                  ? "text-destructive font-semibold"
                  : "text-muted-foreground",
              )}
            >
              {wordCount} / {MAX_WORDS}
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-0.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                isOverLimit
                  ? "bg-destructive"
                  : wordCount > MAX_WORDS * 0.8
                    ? "bg-yellow-500"
                    : "bg-primary",
              )}
              style={{
                width: `${Math.min((wordCount / MAX_WORDS) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      </CardContent>

      {/* Divider */}
      <div className="divider-gradient mx-4 sm:mx-5" />

      {/* Controls */}
      <CardFooter className="px-6 sm:px-8 py-5 flex-col gap-4 items-stretch">
        {/* Intensity slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs select-none">
            {INTENSITY_STEPS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setIntensity(s.value)}
                className={cn(
                  "font-medium transition-colors",
                  intensity === s.value
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
          <Slider
            value={intensity}
            onValueChange={(v) => setIntensity(v as number)}
            min={0}
            max={100}
            step={50}
            aria-label={`Humanization intensity: ${intensityLabel}`}
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-start sm:items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={handleSubmit}
            disabled={isOverLimit}
          >
            Check for AI
          </Button>
          <Button onClick={handleSubmit} disabled={isOverLimit}>
            Humanize Now
          </Button>
        </div>

        {error && (
          <p role="alert" className="text-xs text-destructive -mt-2">
            {error}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
