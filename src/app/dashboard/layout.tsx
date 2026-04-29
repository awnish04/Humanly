"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import {
  Home,
  Sparkles,
  Zap,
  Settings,
  HelpCircle,
  LogOut,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  User,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const TOP_NAV = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Humanizer", href: "/", icon: Sparkles },
];

// Only 2 items under Settings dropdown
const SETTINGS_ITEMS = [
  { label: "Account", href: "/account", icon: User },
  { label: "App Settings", href: "/settings", icon: LayoutGrid },
];

const BOTTOM_NAV = [
  { label: "Upgrade", href: "/pricing", icon: Zap, highlight: true },
  { label: "Help", href: "/contact", icon: HelpCircle },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();
  const { theme, setTheme } = useTheme();
  const [signOutOpen, setSignOutOpen] = useState(false);

  const isSettingsActive =
    pathname.startsWith("/account") || pathname.startsWith("/settings");
  const [settingsOpen, setSettingsOpen] = useState(isSettingsActive);

  // Auto-open settings dropdown when on a settings route
  useEffect(() => {
    if (isSettingsActive) setSettingsOpen(true);
  }, [isSettingsActive]);

  // Auto-collapse on small screens
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    const check = () => {
      if (window.innerWidth < 768) setCollapsed(true);
      else setCollapsed(false);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const name = user?.fullName ?? user?.firstName ?? "User";
  const email = user?.emailAddresses?.[0]?.emailAddress ?? "";
  const initials = (user?.firstName?.[0] ?? "U").toUpperCase();

  const handleSignOut = async () => {
    setSignOutOpen(false);
    await signOut({ redirectUrl: "/" });
    toast.success("Signed out successfully");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* ── Sidebar ── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-card transition-all duration-300",
          collapsed ? "w-14" : "w-52",
        )}
      >
        {/* Logo + toggle */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-border min-h-[57px]">
          {!collapsed ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 min-w-0"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                  H
                </span>
                <span className="text-base font-bold tracking-tight text-foreground truncate">
                  Humanly
                </span>
              </Link>
              <button
                onClick={() => setCollapsed(true)}
                className="ml-1 flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Collapse"
              >
                <ChevronLeft className="size-3.5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setCollapsed(false)}
              className="mx-auto flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground"
              aria-label="Expand"
            >
              H
            </button>
          )}
        </div>

        {/* Top nav */}
        <nav className="flex flex-col gap-0.5 px-2 py-3 flex-1 overflow-y-auto">
          {TOP_NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-colors",
                  collapsed && "justify-center",
                  active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {!collapsed && item.label}
              </Link>
            );
          })}

          {/* Settings toggle */}
          <button
            onClick={() => setSettingsOpen((v) => !v)}
            title={collapsed ? "Settings" : undefined}
            className={cn(
              "flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-colors w-full",
              collapsed && "justify-center",
              isSettingsActive
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Settings className="size-4 shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">Settings</span>
                <ChevronDown
                  className={cn(
                    "size-3.5 transition-transform duration-200",
                    settingsOpen && "rotate-180",
                  )}
                />
              </>
            )}
          </button>

          {/* Settings submenu */}
          {settingsOpen && !collapsed && (
            <div className="ml-3 flex flex-col gap-2 border-l border-border pl-2 py-2">
              {SETTINGS_ITEMS.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 px-2 py-2 rounded-lg text-xs font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <item.icon className="size-3.5 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        {/* Bottom */}
        <div className="flex flex-col gap-0.5 px-2 pb-2 border-t border-border pt-2">
          {BOTTOM_NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-colors",
                collapsed && "justify-center",
                item.highlight
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="size-4 shrink-0" />
              {!collapsed && item.label}
            </Link>
          ))}

          {/* Theme toggle */}
          {!collapsed ? (
            <div className="flex items-center gap-1 mx-1 mt-1 rounded-lg border border-border bg-muted p-1">
              {(["light", "dark"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={cn(
                    "flex-1 flex items-center justify-center py-1 rounded-md transition-colors",
                    theme === t
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t === "light" ? (
                    <Sun className="size-3.5" />
                  ) : (
                    <Moon className="size-3.5" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center justify-center py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </button>
          )}

          {/* User row → sign-out dialog */}
          <button
            onClick={() => setSignOutOpen(true)}
            className={cn(
              "flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-colors w-full mt-1 group",
              collapsed && "justify-center",
            )}
            title={collapsed ? `Sign out (${name})` : undefined}
          >
            <Avatar className="size-7 shrink-0">
              <AvatarImage src={user?.imageUrl} alt={name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <>
                <div className="flex flex-col items-start min-w-0 flex-1">
                  <span className="text-xs font-semibold text-foreground truncate w-full text-left">
                    {name}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate w-full text-left">
                    {email}
                  </span>
                </div>
                <LogOut className="size-3.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={cn(
          "flex-1 min-h-screen transition-all duration-300",
          collapsed ? "ml-14" : "ml-52",
        )}
      >
        {children}
      </div>

      {/* Sign-out dialog */}
      <Dialog open={signOutOpen} onOpenChange={setSignOutOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Sign out</DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out of Humanly?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSignOutOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSignOut}>
              Sign out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
