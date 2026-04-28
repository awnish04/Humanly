"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

const FLAG = "humanly_just_signed_in";

export function AuthToast() {
  const { isSignedIn, isLoaded, user } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      // Check if we just came from a sign-in (flag set before redirect)
      if (sessionStorage.getItem(FLAG) === "1") {
        sessionStorage.removeItem(FLAG);
        const name = user?.firstName ?? user?.fullName ?? "back";
        toast.success(`Welcome ${name}! 🎉`, {
          description: "You're now signed in to Humanly.",
          duration: 4000,
        });
      }
    } else {
      // User is signed out — set flag so next sign-in triggers toast
      sessionStorage.setItem(FLAG, "1");
    }
  }, [isLoaded, isSignedIn, user]);

  return null;
}
