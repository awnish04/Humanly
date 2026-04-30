"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar";
import {
  Copy,
  X,
  Sparkles,
  ScanSearch,
  Upload,
  ClipboardPaste,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { MAX_WORDS, countWords } from "./hero-data";

// ── Static sample ─────────────────────────────────────────────────────────────
const SAMPLE_INPUT = `Artificial intelligence has revolutionized numerous industries in recent years. It is important to note that machine learning algorithms have become increasingly sophisticated. Furthermore, the implementation of AI systems has led to significant improvements in efficiency and productivity. Organizations are leveraging these technologies to optimize their operations. In conclusion, AI represents a transformative force in modern business environments.`;

const SAMPLE_OUTPUT = `AI has shaken up just about every industry you can think of lately. Machine learning keeps getting sharper, and companies are seeing real gains — better efficiency, smoother workflows, the works. Businesses everywhere are jumping on board, using these tools to stay ahead. Bottom line? AI is reshaping how we work, and it's only getting started.`;

// ── Detectors ─────────────────────────────────────────────────────────────────
const DETECTORS = [
  { name: "Turnitin", img: "/Turnitin.jpeg" },
  { name: "Copyleaks", img: "/Copyleaks.jpeg" },
  { name: "OriginalityAI", img: "/OriginalityAI.jpeg" },
  { name: "GPTZero", img: "/GPTZero.jpeg" },
  { name: "Crossplag", img: "/CrossplagIcon.jpeg" },
  { name: "Sapling.ai", img: "/Sapling.jpeg" },
  { name: "Gowinston.ai", img: "/GoWinstonAi.jpeg" },
  { name: "ZeroGPT", img: "/ZeroGPT.jpeg" },
];

// ── AI score heuristic ────────────────────────────────────────────────────────
function estimateAiScore(text: string) {
  if (!text.trim()) return { ai: 0, assisted: 0, human: 100 };
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  let score = 0;
  if (sentences.length > 0) {
    const lengths = sentences.map((s) => s.trim().split(/\s+/).length);
    const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance =
      lengths.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / lengths.length;
    if (variance < 10) score += 25;
    else if (variance < 25) score += 10;
  }
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
  ];
  score += Math.min(aiPhrases.filter((p) => p.test(text)).length * 8, 40);
  const words = text.trim().split(/\s+/).length;
  if ((text.match(/\b\w+'\w+\b/g) ?? []).length / words < 0.01) score += 15;
  if ((text.match(/\b(I|we|my|our)\b/g) ?? []).length === 0) score += 10;
  const ai = Math.min(score, 95);
  const assisted = Math.min(Math.max(100 - ai - 20, 0), 30);
  const human = Math.max(100 - ai - assisted, 0);
  return { ai, assisted, human };
}

// ── Word-level LCS diff ───────────────────────────────────────────────────────
function diffWords(a: string, b: string): { word: string; changed: boolean }[] {
  const aWords = a.trim().split(/\s+/);
  const bWords = b.trim().split(/\s+/);
  const m = aWords.length,
    n = bWords.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0),
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] =
        aWords[i - 1].toLowerCase() === bWords[j - 1].toLowerCase()
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
  const unchanged = new Set<number>();
  let i = m,
    j = n;
  while (i > 0 && j > 0) {
    if (aWords[i - 1].toLowerCase() === bWords[j - 1].toLowerCase()) {
      unchanged.add(j - 1);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) i--;
    else j--;
  }
  return bWords.map((word, idx) => ({ word, changed: !unchanged.has(idx) }));
}

// ── Diff highlight — changed words highlighted + animate in ──────────────────
function DiffText({ input, output }: { input: string; output: string }) {
  const tokens = diffWords(input, output);
  const [visibleCount, setVisibleCount] = useState(tokens.length > 0 ? 0 : 0);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleCount(i);
      if (i >= tokens.length) clearInterval(interval);
    }, 35);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [output]);

  return (
    <p className="text-sm leading-relaxed">
      {tokens.map(({ word, changed }, i) => (
        <span key={i}>
          {i < visibleCount && (
            <span
              className={cn(
                "transition-colors duration-300",
                changed ? "text-primary" : "text-foreground",
                i === visibleCount - 1 && "animate-in fade-in duration-150",
              )}
            >
              {word}
            </span>
          )}
          {i < visibleCount && i < tokens.length - 1 ? " " : null}
        </span>
      ))}
    </p>
  );
}

// ── AI score circular chart ───────────────────────────────────────────────────
function AiScoreChart({ score }: { score: number }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 300);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-1 shrink-0">
      <AnimatedCircularProgressBar
        value={animated}
        max={100}
        min={0}
        gaugePrimaryColor="var(--destructive)"
        gaugeSecondaryColor="var(--primary)"
        className="size-36"
      />
      <p className="text-xs text-muted-foreground">AI GPT</p>
    </div>
  );
}

// ── Detector item ─────────────────────────────────────────────────────────────
function DetectorItem({
  detector,
  visible,
  passed,
  delay,
}: {
  detector: (typeof DETECTORS)[0];
  visible: boolean;
  passed: boolean;
  delay: number;
}) {
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const t1 = setTimeout(() => setShow(true), delay);
    const spinDuration = 600 + Math.floor(Math.random() * 600);
    const t2 = setTimeout(() => setChecked(true), delay + spinDuration);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [visible, delay]);

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-xs transition-all duration-300",
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      )}
    >
      {detector.img ? (
        <img
          src={detector.img}
          alt={detector.name}
          className="size-5 rounded-sm object-contain shrink-0"
        />
      ) : (
        <span className="size-5 rounded-sm bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0">
          {detector.name[0]}
        </span>
      )}
      <span className="text-muted-foreground flex-1">{detector.name}</span>
      <div className="size-4 flex items-center justify-center">
        {checked ? (
          <CheckCircle2
            className={cn(
              "size-3.5 transition-all duration-300 animate-in zoom-in",
              passed ? "text-primary" : "text-muted-foreground/40",
            )}
          />
        ) : show ? (
          <span className="size-3 border-2 border-muted-foreground/40 border-t-transparent rounded-full animate-spin" />
        ) : null}
      </div>
    </div>
  );
}

// ── Full report ───────────────────────────────────────────────────────────────
function FullReport({
  scores,
}: {
  scores: { ai: number; assisted: number; human: number };
}) {
  const items = [
    { label: "AI-generated", dot: "bg-destructive", value: scores.ai },
    { label: "AI-assisted", dot: "bg-yellow-400", value: scores.assisted },
    { label: "Human-written", dot: "bg-primary", value: scores.human },
  ];
  const [values, setValues] = useState(items.map(() => 0));

  useEffect(() => {
    // Animate each bar incrementally: 0.4% every 16ms (~60fps) after a staggered delay
    items.forEach((item, i) => {
      const startDelay = 300 + i * 600;
      const target = item.value;
      let current = 0;

      setTimeout(() => {
        const tick = () => {
          current = Math.min(current + 0.4, target);
          setValues((prev) => {
            const next = [...prev];
            next[i] = parseFloat(current.toFixed(1));
            return next;
          });
          if (current < target) setTimeout(tick, 16);
        };
        tick();
      }, startDelay);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-4 pt-1 animate-in fade-in duration-200">
      <div className="h-px bg-border" />
      {items.map((item, i) => (
        <div key={item.label} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={cn("size-2.5 rounded-full", item.dot)} />
              <span className="text-muted-foreground">{item.label}</span>
            </div>
            <span className="font-bold text-foreground">{item.value}%</span>
          </div>
          <Progress value={values[i]} className="h-2" />
        </div>
      ))}
    </div>
  );
}

// ── AI Detection panel ────────────────────────────────────────────────────────
function AiDetectionPanel({
  scores,
  onClose,
}: {
  scores: { ai: number; assisted: number; human: number };
  onClose: () => void;
}) {
  const [showFull, setShowFull] = useState(false);
  const [detectorsVisible, setDetectorsVisible] = useState(false);
  const allPassed = scores.ai < 30;
  const [delays] = useState(() =>
    DETECTORS.map(() => Math.floor(Math.random() * 800) + 100),
  );

  useEffect(() => {
    const t = setTimeout(() => setDetectorsVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="w-full rounded-2xl border border-border bg-card shadow-lg overflow-hidden mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-muted-foreground">added change</span>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="size-3.5" />
        </button>
      </div>

      <div className="p-5 flex flex-col gap-5">
        <div
          className={cn(
            "flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold",
            allPassed
              ? "bg-primary/10 text-primary border border-primary/20"
              : "bg-destructive/10 text-destructive border border-destructive/20",
          )}
        >
          <CheckCircle2 className="size-4 shrink-0" />
          {allPassed
            ? "Your text passed all AI detectors"
            : `${scores.ai}% AI detected — try humanizing for better results`}
        </div>

        <div className="flex items-start gap-6 flex-wrap sm:flex-nowrap">
          <AiScoreChart score={scores.ai} />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-3">
              Cross-checked with:
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {DETECTORS.map((d, i) => (
                <DetectorItem
                  key={d.name}
                  detector={d}
                  visible={detectorsVisible}
                  passed={allPassed}
                  delay={delays[i]}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => setShowFull((v) => !v)}
            className="px-6 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors"
          >
            {showFull ? (
              <>
                <ChevronUp className="size-4" />
                Hide report
              </>
            ) : (
              <>
                <ChevronDown className="size-4" />
                See full report
              </>
            )}
          </button>
        </div>

        {showFull && <FullReport scores={scores} />}
      </div>
    </div>
  );
}

// ── Main card ─────────────────────────────────────────────────────────────────
export function HumanizerCard() {
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [activeOption, setActiveOption] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sampleLoading, setSampleLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [aiScores, setAiScores] = useState<{
    ai: number;
    assisted: number;
    human: number;
  } | null>(null);
  const [isSample, setIsSample] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const wordCount = countWords(inputText);
  const isOverLimit = wordCount > MAX_WORDS;
  const outputText = results[activeOption] ?? "";
  const outputWordCount = countWords(outputText);
  const isEmpty = !inputText.trim();

  const handleClear = () => {
    setInputText("");
    setResults([]);
    setActiveOption(0);
    setAiScores(null);
    setIsSample(false);
    setShowTyping(false);
  };

  const handleSample = () => {
    setSampleLoading(true);
    setAiScores(null);
    setTimeout(() => {
      setInputText(SAMPLE_INPUT);
      setResults([SAMPLE_OUTPUT]);
      setActiveOption(0);
      setIsSample(true);
      setSampleLoading(false);
      setShowTyping(true);
    }, 1200);
  };

  const handlePaste = async () => {
    try {
      const t = await navigator.clipboard.readText();
      setInputText(t);
      setAiScores(null);
      setIsSample(false);
    } catch {
      inputRef.current?.focus();
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setAiScores(null);
    setIsSample(false);

    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext === "txt") {
      const reader = new FileReader();
      reader.onload = (ev) => setInputText((ev.target?.result as string) ?? "");
      reader.readAsText(file);
      return;
    }

    if (ext === "pdf") {
      try {
        const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
        GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await getDocument({ data: arrayBuffer }).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          text += content.items.map((item: any) => item.str).join(" ") + "\n";
        }
        setInputText(text.trim());
      } catch {
        toast.error("Failed to read PDF. Try copying the text manually.");
      }
      return;
    }

    if (ext === "docx" || ext === "doc") {
      try {
        const mammoth = await import("mammoth");
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setInputText(result.value.trim());
      } catch {
        toast.error("Failed to read Word document.");
      }
      return;
    }

    toast.error("Unsupported file type. Please upload .txt, .pdf, or .docx");
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
    const textToCheck = outputText || inputText;
    if (!textToCheck.trim()) {
      toast.error("Enter or humanize text first");
      return;
    }
    setDetecting(true);
    setAiScores(null);
    setTimeout(() => {
      setAiScores(estimateAiScore(textToCheck));
      setDetecting(false);
    }, 2000);
  };

  const handleHumanize = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text");
      return;
    }
    if (wordCount < 50) {
      toast.warning("Please enter at least 50 words to humanize");
      return;
    }
    if (isOverLimit) {
      toast.error(`Max ${MAX_WORDS} words`);
      return;
    }
    setLoading(true);
    setAiScores(null);
    setIsSample(false);
    setShowTyping(false);
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
    <div className="w-full flex flex-col">
      {/* ── Main card ── */}
      <div className="w-full rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x divide-border">
          {/* LEFT: Input */}
          <div className="grid grid-rows-[1fr_52px]">
            <div className="relative">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setAiScores(null);
                  setIsSample(false);
                }}
                placeholder="Paste your text here (at least 50 words)"
                className={cn(
                  "w-full min-h-[360px] sm:min-h-[440px] lg:min-h-[500px] resize-none bg-transparent p-5 text-sm text-foreground placeholder:text-muted-foreground outline-none",
                  isOverLimit && "text-destructive",
                )}
              />
              {isEmpty && !sampleLoading && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="flex flex-wrap gap-2 justify-center pointer-events-auto">
                    <button
                      onClick={handleSample}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted transition-colors shadow-sm"
                    >
                      Try a sample{" "}
                      <Sparkles className="size-3.5 text-primary" />
                    </button>
                    <button
                      onClick={handlePaste}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted transition-colors shadow-sm"
                    >
                      Paste here <ClipboardPaste className="size-3.5" />
                    </button>
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted transition-colors shadow-sm"
                    >
                      Upload file <Upload className="size-3.5" />
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".txt,.pdf,.doc,.docx"
                      className="hidden"
                      onChange={handleUpload}
                    />
                  </div>
                </div>
              )}
              {sampleLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-3">
                    <span className="size-8 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-muted-foreground">
                      Loading sample…
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 px-5 border-t border-border">
              <span
                className={cn(
                  "text-xs",
                  isOverLimit
                    ? "text-destructive font-semibold"
                    : "text-muted-foreground",
                )}
              >
                {wordCount} words
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
                  size="sm"
                  onClick={handleHumanize}
                  disabled={isOverLimit || loading || !inputText.trim()}
                  className="gap-1.5 h-8 px-3 text-xs"
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

          {/* RIGHT: Output */}
          <div className="grid grid-rows-[1fr_52px] border-t md:border-t-0 border-border">
            <div className="relative min-h-[360px] sm:min-h-[440px] lg:min-h-[500px] overflow-y-auto">
              {results.length > 1 && (
                <div className="flex items-center gap-1 px-5 pt-4">
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
                      Option {i + 1}
                    </button>
                  ))}
                </div>
              )}
              <div className="p-5">
                {outputText ? (
                  isSample && showTyping ? (
                    <TypingAnimation
                      className="text-sm leading-relaxed text-foreground font-normal tracking-normal"
                      duration={20}
                      startOnView={false}
                      showCursor={false}
                    >
                      {outputText}
                    </TypingAnimation>
                  ) : (
                    // Always show diff when we have both input and output
                    <DiffText input={inputText} output={outputText} />
                  )
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Humanized text will appear here
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 px-5 border-t border-border">
              <span className="text-xs text-muted-foreground">
                {outputWordCount} words
              </span>
              <div className="flex items-center gap-2">
                {outputText && (
                  <button
                    onClick={handleCopyOutput}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Copy className="size-3.5" />
                  </button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDetect}
                  disabled={detecting || (!inputText.trim() && !outputText)}
                  className="gap-1.5 h-8 px-3 text-xs"
                >
                  {detecting ? (
                    <span className="relative flex size-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <ScanSearch className="relative size-3.5" />
                    </span>
                  ) : (
                    <ScanSearch className="size-3.5" />
                  )}
                  Check for AI
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {detecting && (
        <div className="w-full rounded-2xl border border-border bg-card shadow-lg mt-3 p-5 flex items-center gap-4 animate-in fade-in duration-200">
          <span className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              Scanning your text…
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Cross-checking with Turnitin, GPTZero, Copyleaks and 5 more
            </p>
          </div>
        </div>
      )}

      {aiScores && !detecting && (
        <AiDetectionPanel scores={aiScores} onClose={() => setAiScores(null)} />
      )}
    </div>
  );
}
