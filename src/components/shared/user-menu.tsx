"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { LogOut, LayoutDashboard } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserMenu() {
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

  return (
    <div ref={ref} className="relative flex items-center justify-end">
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

      {open && (
        <div className="absolute right-0 top-10 z-50 w-56 rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
          {/* User info */}
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

          {/* Dashboard link */}
          <div className="py-1">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <LayoutDashboard className="size-4 text-muted-foreground" />
              Dashboard
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
