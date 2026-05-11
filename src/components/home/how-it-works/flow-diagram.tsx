/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  FileText,
  Mail,
  BookOpen,
  MessageSquare,
  PenLine,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Data ──────────────────────────────────────────────────────────────────────

const INPUTS = [
  { name: "ChatGPT", logo: "/chatgpt-6.svg" },
  { name: "Claude", logo: "/claude-logo.svg" },
  { name: "Deepseek", logo: "/deepseek-2.svg" },
  { name: "Grok", logo: "/grok-1.svg" },
  { name: "Gemini", logo: "/gemini-icon-logo.svg" },
  { name: "NotebookLM", logo: "/google-notebooklm-logo-icon.svg" },
];

const OUTPUTS = [
  {
    name: "Blog Post",
    icon: BookOpen,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/30",
  },
  {
    name: "Essay",
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
  },
  {
    name: "Email",
    icon: Mail,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
  },
  {
    name: "Social",
    icon: MessageSquare,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    border: "border-pink-500/30",
  },
  {
    name: "Report",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
  },
  {
    name: "Article",
    icon: PenLine,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
  },
];

// ── Animated draw-on path ─────────────────────────────────────────────────────

function AnimatedPath({ d, delay = 0 }: { d: string; delay?: number }) {
  const ref = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(500);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (ref.current) setLen(ref.current.getTotalLength());
    const t = setTimeout(() => setOn(true), delay * 1000 + 100);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <path
      ref={ref}
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className="text-border"
      style={{
        strokeDasharray: len,
        strokeDashoffset: on ? 0 : len,
        transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)",
      }}
    />
  );
}

// ── Responsive config hook ────────────────────────────────────────────────────

function useConfig() {
  const [w, setW] = useState(900);

  useEffect(() => {
    const update = () => setW(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Breakpoints
  const isSm = w < 480;
  const isMd = w < 768;

  return {
    W: isSm ? 340 : isMd ? 560 : 900,
    H: isSm ? 420 : isMd ? 460 : 500,
    NODE_R: isSm ? 18 : isMd ? 22 : 28,
    CNW: isSm ? 44 : isMd ? 56 : 72,
    IN_X: isSm ? 28 : isMd ? 44 : 60,
    OUT_X: isSm ? 312 : isMd ? 516 : 840,
    dotR: isSm ? 2.5 : isMd ? 3 : 4,
    logoSz: isSm ? "size-9" : isMd ? "size-10" : "size-12 sm:size-14",
    iconSz: isSm ? "size-4" : isMd ? "size-5" : "size-6",
    nodeSz: isSm ? "size-9" : isMd ? "size-10" : "size-14",
    labelSz: isSm ? "text-[8px]" : "text-[10px]",
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function FlowDiagram() {
  const cfg = useConfig();
  const {
    W,
    H,
    NODE_R,
    CNW,
    IN_X,
    OUT_X,
    dotR,
    logoSz,
    iconSz,
    nodeSz,
    labelSz,
  } = cfg;

  const CX = W / 2;
  const CY = H / 2;
  const count = INPUTS.length;
  const spacing = H / (count + 1);

  const inPaths = INPUTS.map((_, i) => {
    const y = spacing * (i + 1);
    const x1 = IN_X + NODE_R;
    const x2 = CX - CNW / 2;
    const cp = x1 + (x2 - x1) * 0.55;
    return `M${x1},${y} C${cp},${y} ${cp},${CY} ${x2},${CY}`;
  });

  const outPaths = OUTPUTS.map((_, i) => {
    const y = spacing * (i + 1);
    const x1 = CX + CNW / 2;
    const x2 = OUT_X - NODE_R;
    const cp = x1 + (x2 - x1) * 0.45;
    return `M${x1},${CY} C${cp},${CY} ${cp},${y} ${x2},${y}`;
  });

  const pct = (val: number, total: number) => `${(val / total) * 100}%`;

  return (
    <div
      className="relative w-full mx-auto select-none overflow-hidden"
      style={{ aspectRatio: `${W}/${H}` }}
    >
      {/* SVG paths + dots */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden
      >
        <defs>
          {inPaths.map((d, i) => (
            <path key={`in-${i}`} id={`in-${i}`} d={d} fill="none" />
          ))}
          {outPaths.map((d, i) => (
            <path key={`out-${i}`} id={`out-${i}`} d={d} fill="none" />
          ))}
        </defs>

        {inPaths.map((d, i) => (
          <AnimatedPath key={`in-${i}`} d={d} delay={i * 0.1} />
        ))}
        {outPaths.map((d, i) => (
          <AnimatedPath key={`out-${i}`} d={d} delay={0.8 + i * 0.1} />
        ))}

        {inPaths.map((_, i) => (
          <circle
            key={`dot-in-${i}`}
            r={dotR}
            className="fill-primary"
            opacity="0.85"
          >
            <animateMotion
              dur="2s"
              repeatCount="indefinite"
              begin={`${i * 0.35}s`}
            >
              <mpath xlinkHref={`#in-${i}`} />
            </animateMotion>
          </circle>
        ))}
        {outPaths.map((_, i) => (
          <circle
            key={`dot-out-${i}`}
            r={dotR}
            className="fill-primary"
            opacity="0.85"
          >
            <animateMotion
              dur="2s"
              repeatCount="indefinite"
              begin={`${1 + i * 0.35}s`}
            >
              <mpath xlinkHref={`#out-${i}`} />
            </animateMotion>
          </circle>
        ))}
      </svg>

      {/* Input logo nodes */}
      {INPUTS.map((d, i) => {
        const cy = spacing * (i + 1);
        return (
          <div
            key={d.name}
            className="absolute flex flex-col items-center gap-1"
            style={{
              left: pct(IN_X - NODE_R, W),
              top: pct(cy - NODE_R, H),
              width: pct(NODE_R * 2.5, W),
            }}
          >
            <div
              className={cn(
                "shrink-0 rounded-full border border-border bg-white dark:bg-zinc-100 shadow-sm overflow-hidden p-1",
                logoSz,
              )}
            >
              <img
                src={d.logo}
                alt={d.name}
                width={56}
                height={56}
                className="size-full object-contain"
              />
            </div>
            <span
              className={cn(
                "font-bold text-foreground whitespace-nowrap",
                labelSz,
              )}
            >
              {d.name}
            </span>
          </div>
        );
      })}

      {/* Center Humanly node */}
      <div
        className="absolute flex flex-col items-center gap-1"
        style={{
          left: pct(CX - CNW / 2, W),
          top: pct(CY - CNW / 2, H),
          width: pct(CNW, W),
        }}
      >
        <div className="w-full aspect-square rounded-full bg-foreground dark:bg-zinc-800 border border-border shadow-2xl flex items-center justify-center overflow-hidden p-1">
          <img
            src="/HumanlyLogo-2.png"
            alt="Humanly"
            className="w-full h-full object-contain select-none"
          />
        </div>
        <span
          className={cn("font-bold text-foreground whitespace-nowrap", labelSz)}
        >
          Humanly
        </span>
      </div>

      {/* Output icon nodes */}
      {OUTPUTS.map((out, i) => {
        const Icon = out.icon;
        const cy = spacing * (i + 1);
        return (
          <div
            key={out.name}
            className="absolute flex flex-col items-center gap-1"
            style={{
              left: pct(OUT_X - NODE_R, W),
              top: pct(cy - NODE_R, H),
              width: pct(NODE_R * 1.4, W),
            }}
          >
            <div
              className={cn(
                "shrink-0 rounded-full border flex items-center justify-center",
                nodeSz,
                out.bg,
                out.border,
              )}
            >
              <Icon className={cn(iconSz, out.color)} />
            </div>
            <span
              className={cn(
                "font-bold text-foreground whitespace-nowrap",
                labelSz,
              )}
            >
              {out.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
