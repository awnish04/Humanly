"use client";

/**
 * Visitor Tracker Component
 * Tracks page visits, time spent, and click events
 */

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Generate a session ID that persists for the browser session
function getSessionId(): string {
  if (typeof window === "undefined") return "";

  let sessionId = sessionStorage.getItem("visitor_session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem("visitor_session_id", sessionId);
  }
  return sessionId;
}

// Detect if browser is Brave (client-side only)
async function isBraveBrowser(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    // @ts-expect-error - Brave adds navigator.brave
    return (navigator.brave && (await navigator.brave.isBrave())) || false;
  } catch {
    return false;
  }
}

export function VisitorTracker() {
  const pathname = usePathname();
  const visitIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    // Don't track admin routes
    if (pathname.startsWith("/admin")) return;

    const trackVisitor = async () => {
      try {
        const sessionId = getSessionId();
        const referrer = document.referrer || "direct";
        const isBrave = await isBraveBrowser();

        const response = await fetch("/api/track-visitor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page: pathname,
            referrer,
            sessionId,
            isBrave,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          visitIdRef.current = data.visitId;
          startTimeRef.current = Date.now();
        }
      } catch (error) {
        console.error("Failed to track visitor:", error);
      }
    };

    trackVisitor();

    // Track time spent when leaving page
    const handleBeforeUnload = () => {
      if (visitIdRef.current) {
        const timeSpent = Math.floor(
          (Date.now() - startTimeRef.current) / 1000,
        );

        // Use sendBeacon for reliable tracking on page unload
        const data = JSON.stringify({
          visitId: visitIdRef.current,
          timeSpent,
        });

        navigator.sendBeacon("/api/track-time", data);
      }
    };

    // Track clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Get element details
      const elementType = target.tagName.toLowerCase();
      const elementText = target.textContent?.trim().substring(0, 100) || "";
      const elementId = target.id || undefined;
      const elementClass = target.className || undefined;

      // Don't await - fire and forget
      fetch("/api/track-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: pathname,
          elementType,
          elementText,
          elementId,
          elementClass,
          xPosition: e.clientX,
          yPosition: e.clientY,
        }),
      }).catch(() => {});
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleClick);

      // Track time on component unmount (route change)
      if (visitIdRef.current) {
        const timeSpent = Math.floor(
          (Date.now() - startTimeRef.current) / 1000,
        );
        fetch("/api/track-time", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visitId: visitIdRef.current,
            timeSpent,
          }),
        }).catch(() => {});
      }
    };
  }, [pathname]);

  return null;
}
