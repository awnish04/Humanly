"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

/**
 * Online Status Tracker
 * Sends periodic heartbeats to track user online status
 * Place this component in the root layout for authenticated users
 */
// online-status-tracker.tsx
export function OnlineStatusTracker() {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isSignedIn) return;

    const sendHeartbeat = () => {
      fetch("/api/user/heartbeat", { method: "POST" }).catch(() => {});
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 5000);

    const handleBeforeUnload = () => {
      navigator.sendBeacon("/api/user/offline");
    };

    // Also handle visibility change (tab switch, minimize)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        navigator.sendBeacon("/api/user/offline");
      } else {
        sendHeartbeat();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      // Don't call fetch here — session may already be gone
      navigator.sendBeacon("/api/user/offline");
    };
  }, [isSignedIn]);

  return null;
}
