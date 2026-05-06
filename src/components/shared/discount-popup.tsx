"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Sparkles, Clock, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

const DISCOUNT_CODE = "HUMANLY25";
const DISCOUNT_PCT = 20;
const DELAY_MS = 3000; // 3 seconds
const TIMER_SECS = 15 * 60; // 15 minutes

export function DiscountPopup() {
  const { isSignedIn, isLoaded } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECS);
  const [dismissed, setDismissed] = useState(false);

  // Show after delay — only for guests
  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) return;

    const t = setTimeout(() => setIsVisible(true), DELAY_MS);
    return () => clearTimeout(t);
  }, [isLoaded, isSignedIn]);

  // Countdown timer
  useEffect(() => {
    if (!isVisible || timeLeft <= 0) return;

    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [isVisible, timeLeft]);

  const handleClose = () => {
    setIsVisible(false);
    setDismissed(true);
  };

  const handleClaim = () => {
    navigator.clipboard?.writeText(DISCOUNT_CODE);
    window.location.href = "/pricing";
  };

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  // Don't render at all if signed in or dismissed
  if (!isLoaded || isSignedIn || dismissed) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 left-6 z-[9999] w-64 transition-all duration-500 ease-out",
        isVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-8 opacity-0 scale-95 pointer-events-none",
      )}
    >
      <div className="relative rounded-xl border border-primary/30 bg-card shadow-2xl overflow-hidden">
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 z-10 flex size-5 items-center justify-center rounded-full bg-muted hover:bg-destructive/20 hover:text-destructive transition-colors"
          aria-label="Close"
        >
          <X className="size-3" />
        </button>

        {/* Sparkle */}
        <Sparkles className="absolute top-3 left-3 size-3.5 text-primary animate-pulse" />

        <div className="px-4 pt-6 pb-4 flex flex-col gap-2.5">
          {/* Badge */}
          <div className="flex justify-center">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] gap-1">
              <Gift className="size-2.5" />
              Limited Offer
            </Badge>
          </div>

          {/* Headline */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Get</p>
            <p className="text-3xl font-black text-primary leading-none">
              {DISCOUNT_PCT}% OFF
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              on all premium plans
            </p>
          </div>

          {/* Code */}
          <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 py-2 text-center">
            <p className="text-[10px] text-muted-foreground mb-0.5">Use code</p>
            <code className="text-sm font-mono font-black text-primary tracking-widest select-all">
              {DISCOUNT_CODE}
            </code>
          </div>

          {/* Timer */}
          <div className="flex items-center justify-center gap-1.5 text-[11px]">
            <Clock className="size-3 text-orange-500 animate-pulse" />
            <span className="text-muted-foreground">Expires in</span>
            <span className="font-mono font-bold text-orange-500">
              {mm}:{ss}
            </span>
          </div>

          {/* CTA */}
          <Button
            onClick={handleClaim}
            size="sm"
            className="w-full h-8 text-xs font-bold"
          >
            Claim Discount →
          </Button>
        </div>
      </div>
    </div>
  );
}
