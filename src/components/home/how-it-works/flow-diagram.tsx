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

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// To add/remove an input AI tool: edit the INPUTS array below.
// Each entry needs a `name` (shown as label) and `logo` (path inside /public).
// ─────────────────────────────────────────────────────────────────────────────
const INPUTS = [
  { name: "ChatGPT", logo: "/chatgpt-6.svg" },
  { name: "Claude", logo: "/claude-logo.svg" },
  { name: "Deepseek", logo: "/deepseek-2.svg" },
  { name: "Grok", logo: "/grok-1.svg" },
  { name: "Gemini", logo: "/gemini-icon-logo.svg" },
  { name: "NotebookLM", logo: "/google-notebooklm-logo-icon.svg" },
];

// To add/remove an output type: edit the OUTPUTS array below.
// `icon` is any lucide-react icon. `color/bg/border` control the circle style.
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

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED PATH
// Draws a curved SVG line that animates in (stroke-dashoffset trick).
// `d`     — the SVG path string (cubic bezier)
// `delay` — seconds before the draw animation starts
// ─────────────────────────────────────────────────────────────────────────────
function AnimatedPath({ d, delay = 0 }: { d: string; delay?: number }) {
  const ref = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(500); // total path length in SVG units
  const [on, setOn] = useState(false); // whether the draw animation has fired

  useEffect(() => {
    // Measure the actual path length so the dash exactly covers it
    if (ref.current) setLen(ref.current.getTotalLength());
    // Start drawing after `delay` seconds
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
        // When `on` is false the dash offset equals the full length → invisible
        // When `on` is true the offset goes to 0 → fully drawn
        strokeDasharray: len,
        strokeDashoffset: on ? 0 : len,
        transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)",
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSIVE CONFIG
// All sizing lives here. To tweak any breakpoint just change the values below.
//
// HOW TO CHANGE GAPS BETWEEN ICONS:
//   → Change H (canvas height). More H = more vertical space = bigger gaps.
//     e.g. H: isSm ? 400 : isMd ? 500 : 580   ← reduce for tighter gaps
//          H: isSm ? 560 : isMd ? 680 : 780   ← increase for more gaps
//
// HOW TO CHANGE ICON / LOGO SIZES:
//   → Change logoSz / nodeSz (Tailwind size classes like "size-5", "size-8").
//     logoSz controls the input logo circles.
//     nodeSz controls the output icon circles.
//     NODE_R must roughly match half the pixel size of logoSz/nodeSz so that
//     the SVG paths connect to the correct edge of each circle.
//     Tailwind size-5 = 20px → NODE_R ≈ 10
//     Tailwind size-7 = 28px → NODE_R ≈ 14
//     Tailwind size-14 = 56px → NODE_R ≈ 28
//
// HOW TO CHANGE LABEL TEXT SIZE:
//   → Change labelSz (e.g. "text-[8px]", "text-xs", "text-sm").
//
// BREAKPOINTS:
//   isSm  → screen width < 480px  (phones)
//   isMd  → screen width < 900px  (tablets / small laptops)
//   else  → screen width ≥ 900px  (desktop)
// ─────────────────────────────────────────────────────────────────────────────
function useConfig() {
  const [w, setW] = useState(900);

  useEffect(() => {
    const update = () => setW(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const isSm = w < 480; // phone
  const isMd = w < 900; // tablet / small laptop

  // NODE_R = half the pixel size of the logo/icon circle.
  // Must stay in sync with logoSz/nodeSz or paths won't connect to circle edges.
  const NODE_R = isSm ? 10 : isMd ? 14 : 28;

  // CNW = center Humanly node width/height in SVG units
  const CNW = isSm ? 26 : isMd ? 40 : 72;

  return {
    // ── Canvas ──────────────────────────────────────────────────────────────
    // W = SVG viewBox width. Wider = more horizontal space for paths.
    W: isSm ? 320 : isMd ? 700 : 900,
    // H = SVG viewBox height. ↑ H = ↑ gap between icons. ↓ H = tighter gaps.
    // TO CHANGE GAPS: edit these three numbers ↓
    H: isSm ? 420 : isMd ? 520 : 550,

    // ── Node geometry ────────────────────────────────────────────────────────
    NODE_R,
    CNW,
    // IN_X = x-center of the left (input) column in SVG units
    IN_X: isSm ? 16 : isMd ? 24 : 60,
    // OUT_X = x-center of the right (output) column in SVG units
    OUT_X: isSm ? 304 : isMd ? 676 : 840,

    // ── Dot size on the animated paths ──────────────────────────────────────
    dotR: isSm ? 2 : isMd ? 2.5 : 4,

    // ── Visual sizes (Tailwind classes) ─────────────────────────────────────
    // TO CHANGE LOGO SIZE: edit logoSz values ↓ (keep NODE_R in sync)
    logoSz: isSm ? "size-5" : isMd ? "size-8" : "size-14",
    // TO CHANGE OUTPUT ICON SIZE: edit nodeSz values ↓
    nodeSz: isSm ? "size-5" : isMd ? "size-8" : "size-14",
    // Icon inside the output circle
    iconSz: isSm ? "size-2.5" : isMd ? "size-3.5" : "size-6",
    // TO CHANGE LABEL TEXT SIZE: edit labelSz values ↓
    labelSz: isSm ? "text-[5px]" : isMd ? "text-[5px]" : "text-[10px]",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// Layout: absolute-positioned HTML nodes on top of an SVG canvas.
// The SVG draws the curved paths + travelling dots.
// HTML nodes render the logo/icon circles and labels.
// pct() converts SVG coordinates → CSS percentages so they scale with the div.
// ─────────────────────────────────────────────────────────────────────────────
export function FlowDiagram() {
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
  } = useConfig();

  const CX = W / 2; // center x of the whole canvas
  const CY = H / 2; // center y of the whole canvas

  // spacing = vertical distance between each node row
  // Derived from H automatically — change H above to adjust gaps
  const spacing = H / (INPUTS.length + 1);

  // ── Path generation ────────────────────────────────────────────────────────
  // Each input path: starts at the right edge of the logo circle,
  // curves to the left edge of the center Humanly node.
  const inPaths = INPUTS.map((_, i) => {
    const y = spacing * (i + 1); // vertical center of this node
    const x1 = IN_X + NODE_R; // right edge of logo circle
    const x2 = CX - CNW / 2; // left edge of center node
    const cp = x1 + (x2 - x1) * 0.55; // control point (how curved the line is)
    return `M${x1},${y} C${cp},${y} ${cp},${CY} ${x2},${CY}`;
  });

  // Each output path: starts at the right edge of the center node,
  // curves to the left edge of the output icon circle.
  const outPaths = OUTPUTS.map((_, i) => {
    const y = spacing * (i + 1);
    const x1 = CX + CNW / 2; // right edge of center node
    const x2 = OUT_X - NODE_R; // left edge of output circle
    const cp = x1 + (x2 - x1) * 0.45;
    return `M${x1},${CY} C${cp},${CY} ${cp},${y} ${x2},${y}`;
  });

  // Converts an SVG coordinate to a CSS percentage string
  // Used to position HTML nodes over the SVG canvas
  const pct = (val: number, total: number) => `${(val / total) * 100}%`;

  return (
    // Container: fixed aspect ratio so the diagram scales proportionally
    <div
      className="relative w-full mx-auto select-none overflow-hidden"
      style={{ aspectRatio: `${W}/${H}` }}
    >
      {/* ── SVG layer: paths and travelling dots ── */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden
      >
        {/* Named path definitions — referenced by animateMotion below */}
        <defs>
          {inPaths.map((d, i) => (
            <path key={`in-${i}`} id={`in-${i}`} d={d} fill="none" />
          ))}
          {outPaths.map((d, i) => (
            <path key={`out-${i}`} id={`out-${i}`} d={d} fill="none" />
          ))}
        </defs>

        {/* Draw-on animated lines */}
        {inPaths.map((d, i) => (
          <AnimatedPath key={`in-${i}`} d={d} delay={i * 0.1} />
        ))}
        {outPaths.map((d, i) => (
          <AnimatedPath key={`out-${i}`} d={d} delay={0.8 + i * 0.1} />
        ))}

        {/* Travelling dots on input paths — loop forever */}
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

        {/* Travelling dots on output paths */}
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

      {/* ── Left column: input AI tool logos ── */}
      {INPUTS.map((d, i) => {
        const cy = spacing * (i + 1); // vertical center of this node in SVG units
        return (
          <div
            key={d.name}
            className="absolute flex flex-col items-center gap-0.5"
            style={{
              // Position the div so its center aligns with (IN_X, cy) in SVG space
              left: pct(IN_X - NODE_R, W),
              top: pct(cy - NODE_R, H),
              width: pct(NODE_R * 2.5, W), // width = diameter of the circle
            }}
          >
            {/* Logo circle — white bg so dark logos are visible in dark mode */}
            <div
              className={cn(
                "shrink-0 rounded-full border border-border bg-white dark:bg-zinc-100 shadow-sm overflow-hidden p-0.5",
                logoSz, // size class from useConfig — change logoSz to resize
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
            {/* Label below the circle */}
            <span
              className={cn(
                "font-semibold text-foreground whitespace-nowrap leading-none",
                labelSz,
              )}
            >
              {d.name}
            </span>
          </div>
        );
      })}

      {/* ── Center: Humanly node ── */}
      <div
        className="absolute flex flex-col items-center gap-0.5"
        style={{
          left: pct(CX - CNW / 2, W),
          top: pct(CY - CNW / 2, H),
          width: pct(CNW, W),
        }}
      >
        <div className="w-full aspect-square rounded-full bg-foreground dark:bg-zinc-800 border border-border shadow-2xl flex items-center justify-center overflow-hidden p-0.5">
          <img
            src="/HumanlyLogoPurple-2.png"
            alt="Humanly"
            className="w-full h-full object-contain select-none"
          />
        </div>
        <span
          className={cn(
            "font-bold text-foreground whitespace-nowrap leading-none",
            labelSz,
          )}
        >
          Humanly
        </span>
      </div>

      {/* ── Right column: output type icons ── */}
      {OUTPUTS.map((out, i) => {
        const Icon = out.icon;
        const cy = spacing * (i + 1);
        return (
          <div
            key={out.name}
            className="absolute flex flex-col items-center gap-0.5"
            style={{
              left: pct(OUT_X - NODE_R, W),
              top: pct(cy - NODE_R, H),
              width: pct(NODE_R * 1.5, W),
            }}
          >
            {/* Coloured icon circle */}
            <div
              className={cn(
                "shrink-0 rounded-full border flex items-center justify-center",
                nodeSz, // size class — change nodeSz to resize
                out.bg, // background colour
                out.border, // border colour
              )}
            >
              <Icon className={cn(iconSz, out.color)} />
            </div>
            <span
              className={cn(
                "font-semibold text-foreground whitespace-nowrap leading-none",
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
