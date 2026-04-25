"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { BlurFade } from "@/components/ui/blur-fade";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { ClipboardPaste } from "lucide-react";
import { AuroraText } from "../ui/aurora-text";

/* ── Constants ─────────────────────────────────────────── */
const MAX_WORDS = 300;

const INTENSITY_STEPS = [
  { value: 0, label: "Basic" },
  { value: 50, label: "Enhanced" },
  { value: 100, label: "Aggressive" },
];

const AVATARS = ["AK", "MR", "JS", "LP"];

const PLATFORMS = [
  {
    label: "X",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="size-4 fill-current shrink-0"
        aria-hidden
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="size-4 fill-current shrink-0"
        aria-hidden
      >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
      </svg>
    ),
  },
  {
    label: "Reddit",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="size-4 fill-current shrink-0"
        aria-hidden
      >
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
      </svg>
    ),
  },
];

function countWords(text: string) {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

/* ── Component ──────────────────────────────────────────── */
export function HeroSection() {
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
    <section
      id="main-content"
      aria-label="AI Text Humanizer"
      className="relative flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background glow — GPU-composited, no layout impact */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute rounded-full opacity-[0.15] blur-2xl"
          style={{
            width: "min(640px, 90vw)",
            height: "min(640px, 90vw)",
            background:
              "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
            top: "55%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      <div className="container-page relative z-10 flex flex-col items-center text-center pt-28 pb-16  gap-6">
        {/* Eyebrow badge */}
        <BlurFade delay={0} duration={0.4}>
          <div className="group relative inline-flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-all duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
            {/* Gradient border */}
            <span
              className={cn(
                "animate-gradient absolute inset-0 block h-full w-full rounded-full bg-linear-to-r from-(--chart-1)/50 via-(--chart-4)/50 to-(--chart-1)/50 bg-size-[300%_100%] p-px",
              )}
              style={{
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "destination-out",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "subtract",
              }}
            />

            {/* Content */}
            <span className="flex items-center gap-2 text-sm font-medium">
              ✨
              <AnimatedGradientText
                colorFrom="var(--chart-1)"
                colorTo="var(--chart-4)"
                speed={0.8}
              >
                AI-Powered Humanizer
              </AnimatedGradientText>
            </span>
          </div>
        </BlurFade>

        {/* Headline */}
        <BlurFade delay={0.1} duration={0.5}>
          <h1 className="text-balance max-w-3xl">
            Make AI Content Sound <AuroraText>100% Human</AuroraText>
          </h1>
        </BlurFade>

        {/* Sub-headline */}
        <BlurFade delay={0.2} duration={0.5}>
          <p className="max-w-lg text-base sm:text-lg text-muted-foreground text-balance mx-auto">
            Transform robotic ChatGPT or any AI drafts into natural, engaging
            writing. Works for blogs, emails, and social posts.
          </p>
        </BlurFade>

        {/* Social proof */}
        <BlurFade delay={0.3} duration={0.4}>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-2" aria-hidden>
                {AVATARS.map((a, i) => (
                  <span
                    key={a}
                    className={cn(
                      "inline-flex items-center justify-center size-8 rounded-full border-2 border-background text-[10px] font-bold text-primary-foreground select-none",
                      ["bg-primary", "bg-chart-2", "bg-chart-3", "bg-chart-4"][
                        i
                      ],
                    )}
                  >
                    {a}
                  </span>
                ))}
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <span
                  className="text-yellow-400 text-xs leading-none"
                  aria-hidden
                >
                  ★★★★★
                </span>
                <span className="text-xs text-muted-foreground">
                  1,000+ users
                </span>
              </div>
            </div>

            <span className="hidden sm:block w-px h-5 bg-border" aria-hidden />

            <div className="flex items-center gap-4">
              {PLATFORMS.map((p) => (
                <span
                  key={p.label}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium"
                >
                  {p.icon}
                  {p.label}
                </span>
              ))}
            </div>
          </div>
        </BlurFade>

        {/* ── Humanizer Card ── */}
        <BlurFade delay={0.4} duration={0.5} className="w-full max-w-3xl">
          <Card className="w-full shadow-2xl gap-0 py-0  overflow-hidden">
            {/* Textarea area */}
            <CardContent className="p-4 sm:p-5 pb-3">
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
                  "min-h-[200px] sm:min-h-[220px]",
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
                        className={cn(
                          isOverLimit && "text-destructive font-medium",
                        )}
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
            <CardFooter className="px-4 sm:px-5 py-4 flex-col gap-4 items-stretch">
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

              {/* Bottom row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-3">
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
                <p
                  role="alert"
                  className="hidden sm:block text-xs text-destructive -mt-2"
                >
                  {error}
                </p>
              )}
            </CardFooter>
          </Card>
        </BlurFade>
      </div>
    </section>
  );
}
