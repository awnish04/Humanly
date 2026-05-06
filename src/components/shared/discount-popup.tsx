"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Clock, Gift, X, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Discount {
  id: string;
  code: string;
  percentage: number;
  description: string;
  ctaText: string;
  ctaLink: string;
  showTimer: boolean;
  timerMinutes: number;
  delaySeconds: number;
  expiresAt?: string; // ISO date string from admin
}

const QUERY = `query { discounts { id code percentage description ctaText ctaLink enabled showTimer timerMinutes delaySeconds expiresAt } }`;

const fmt = (s: number) => {
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (d > 0)
    return `${d}d ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

export function DiscountPopup() {
  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [closed, setClosed] = useState(false);
  // Each discount gets its own independent timer
  const [timers, setTimers] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!isLoaded || isSignedIn || isAdmin) return;
    fetch("/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query: QUERY }),
    })
      .then((r) => r.json())
      .then((json) => {
        const all = (json?.data?.discounts ?? []) as (Discount & {
          enabled: boolean;
        })[];
        const active = all.filter((d) => d.enabled);
        if (!active.length) return;
        setDiscounts(active);
        // Each card starts its own timer from its own timerMinutes
        const t: Record<string, number> = {};
        active.forEach((d) => {
          if (d.expiresAt) {
            // Use actual expiry date — seconds remaining until that moment
            const secsLeft = Math.max(
              0,
              Math.floor((new Date(d.expiresAt).getTime() - Date.now()) / 1000),
            );
            t[d.id] = secsLeft;
          } else {
            // Fallback: timerMinutes countdown
            t[d.id] = d.timerMinutes * 60;
          }
        });
        setTimers(t);
        const delay = Math.min(...active.map((d) => d.delaySeconds)) * 1000;
        const timer = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(timer);
      })
      .catch(() => {});
  }, [isLoaded, isSignedIn, isAdmin]);

  // Single interval ticks all timers independently
  useEffect(() => {
    if (!visible || !discounts.length) return;
    const iv = setInterval(() => {
      setTimers((prev) => {
        const next = { ...prev };
        discounts.forEach((d) => {
          if (d.showTimer) {
            if (d.expiresAt) {
              // Recalculate from actual expiry date every tick for accuracy
              next[d.id] = Math.max(
                0,
                Math.floor(
                  (new Date(d.expiresAt).getTime() - Date.now()) / 1000,
                ),
              );
            } else if ((next[d.id] ?? 0) > 0) {
              next[d.id] = (next[d.id] ?? 0) - 1;
            }
          }
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [visible, discounts]);

  if (
    !isLoaded ||
    isSignedIn ||
    isAdmin ||
    closed ||
    !visible ||
    !discounts.length
  )
    return null;

  const n = discounts.length;
  const CARD_H = 268;
  const CARD_GAP = 12;
  const PEEK = 8;

  // Collapsed height: top card + peeking cards
  const collapsedH = CARD_H + (n > 1 ? (n - 1) * PEEK : 0);
  // Full expanded height
  const fullExpandedH = n * CARD_H + (n - 1) * CARD_GAP;

  return (
    <div
      className={cn(
        "fixed bottom-6 left-6 z-9999 w-64 flex flex-col gap-3 transition-all duration-500 ease-out",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-8 opacity-0 pointer-events-none",
      )}
    >
      {/* ── Scrollable stack container ── */}
      <div
        className={cn(
          "relative transition-all duration-500",
          // When expanded and content overflows viewport, scroll
          expanded && "overflow-y-auto overflow-x-hidden",
        )}
        style={{
          // Collapsed: exact height of stacked cards
          // Expanded: cap at 70vh so it never goes off screen, scroll if needed
          height: expanded
            ? `min(${fullExpandedH}px, 70vh)`
            : `${collapsedH}px`,
        }}
      >
        {/* Inner container — full height for absolute positioning */}
        <div
          className="relative"
          style={{
            height: expanded ? `${fullExpandedH}px` : `${collapsedH}px`,
          }}
        >
          {discounts.map((d, i) => {
            const t = timers[d.id] ?? 0;
            const isTop = i === 0;

            // Collapsed: peek downward
            const collapsedY = isTop ? 0 : i * PEEK;
            const collapsedScale = isTop ? 1 : 1 - i * 0.03;

            // Expanded: full spacing
            const expandedY = i * (CARD_H + CARD_GAP);

            return (
              <div
                key={d.id}
                className="absolute inset-x-0"
                style={{
                  zIndex: n - i,
                  transform: expanded
                    ? `translateY(${expandedY}px) scale(1)`
                    : `translateY(${collapsedY}px) scale(${collapsedScale})`,
                  opacity: expanded ? 1 : isTop ? 1 : i === 1 ? 0.82 : 0.64,
                  transition: "all 0.45s cubic-bezier(.68,-0.55,.27,1.55)",
                  pointerEvents: !expanded && !isTop ? "none" : "auto",
                }}
              >
                <Card className="relative border-primary/30 gap-0 py-0 shadow-2xl">
                  <Sparkles className="absolute top-3 left-3 size-3.5 text-primary animate-pulse" />

                  {isTop && (
                    <button
                      onClick={() => setClosed(true)}
                      className="absolute top-2 right-2 z-10 flex size-5 items-center justify-center rounded-full bg-muted hover:bg-destructive/20 hover:text-destructive transition-colors"
                      aria-label="Close"
                    >
                      <X className="size-3" />
                    </button>
                  )}

                  <CardContent className="pt-6 pb-4 px-4 flex flex-col gap-2.5">
                    <div className="flex justify-center">
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] gap-1">
                        <Gift className="size-2.5" />
                        Limited Offer
                      </Badge>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Get</p>
                      <p className="text-3xl font-black text-primary leading-none">
                        {d.percentage}% OFF
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {d.description}
                      </p>
                    </div>

                    <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 py-2 text-center">
                      <p className="text-[10px] text-muted-foreground mb-0.5">
                        Use code
                      </p>
                      <code className="text-sm font-mono font-black text-primary tracking-widest select-all">
                        {d.code}
                      </code>
                    </div>

                    {/* Timer — each card shows its own independent countdown */}
                    {d.showTimer && t > 0 && (
                      <div className="flex items-center justify-center gap-1.5 text-[11px]">
                        <Clock className="size-3 text-orange-500 animate-pulse" />
                        <span className="text-muted-foreground">
                          Expires in
                        </span>
                        <span className="font-mono font-bold text-orange-500">
                          {fmt(t)}
                        </span>
                      </div>
                    )}

                    <Button
                      size="sm"
                      className="w-full h-8 text-xs font-bold"
                      onClick={() => {
                        navigator.clipboard?.writeText(d.code);
                        window.location.href = d.ctaLink ?? "/pricing";
                      }}
                    >
                      {d.ctaText} →
                    </Button>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Toggle button — sits below with flex gap, only when 2+ cards ── */}
      {n > 1 && (
        <div className="flex justify-center">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-card border border-border text-foreground text-sm font-bold shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
          >
            {expanded ? "Hide" : "Show All"}
            <svg
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              className="transition-transform duration-300"
              style={{
                transform: expanded ? "rotate(0deg)" : "rotate(180deg)",
              }}
            >
              <path
                d="M1 6L6 1L11 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
