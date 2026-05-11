"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { LogOut, LayoutDashboard, Settings, ChevronUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  /** "avatar" (default) — small avatar button used in desktop navbar
   *  "card" — full-width card row used in mobile menu */
  variant?: "avatar" | "card";
}

export function UserMenu({ variant = "avatar" }: UserMenuProps) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = async () => {
    await signOut({ redirectUrl: "/" });
    toast.success("Signed out successfully");
  };

  const initials =
    user?.firstName?.[0] ??
    user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ??
    "U";
  const name =
    user?.fullName ?? user?.emailAddresses?.[0]?.emailAddress ?? "User";
  const email = user?.emailAddresses?.[0]?.emailAddress ?? "";

  const close = () => setOpen(false);

  // Dropdown position: above for card variant (mobile), below for avatar (desktop)
  const dropdownClass =
    variant === "card"
      ? "absolute bottom-full left-0 right-0 mb-1 z-50 w-full rounded-xl border border-border bg-card shadow-xl overflow-hidden"
      : "absolute right-0 top-10 z-50 w-56 rounded-xl border border-border bg-card shadow-xl overflow-hidden";

  return (
    <div ref={ref} className="relative w-full items-center flex">
      {variant === "card" ? (
        /* ── Card trigger (mobile menu) ── */
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="User menu"
          aria-expanded={open}
          className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-colors w-full group"
        >
          <Avatar className="size-7 shrink-0">
            <AvatarImage src={user?.imageUrl} alt={name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start min-w-0 flex-1">
            <span className="text-xs font-semibold text-foreground truncate w-full text-left">
              {name}
            </span>
            <span className="text-[10px] text-muted-foreground truncate w-full text-left">
              {email}
            </span>
          </div>
          <ChevronUp
            className={cn(
              "size-3.5 text-muted-foreground shrink-0 transition-transform duration-200",
              open ? "rotate-180" : "rotate-0",
            )}
            aria-hidden
          />
        </button>
      ) : (
        /* ── Avatar trigger (desktop navbar) ── */
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="User menu"
        >
          <Avatar className="size-8 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/50 transition-all">
            <AvatarImage src={user?.imageUrl} alt={name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      )}

      {/* ── Dropdown menu ── */}
      {open && (
        <div className={dropdownClass}>
          {/* User info header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <Avatar className="size-8">
              <AvatarImage src={user?.imageUrl} alt={name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {name}
              </p>
              <p className="text-xs text-muted-foreground truncate">{email}</p>
            </div>
          </div>

          {/* Nav links */}
          <div className="py-1">
            <Link
              href="/user-dashboard"
              onClick={close}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <LayoutDashboard className="size-4 text-muted-foreground" />
              Dashboard
            </Link>
            <Link
              href="/user-dashboard/settings/account"
              onClick={close}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <Settings className="size-4 text-muted-foreground" />
              Settings
            </Link>
          </div>

          {/* Sign out */}
          <div className="border-t border-border py-1">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
