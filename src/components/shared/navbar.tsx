"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./user-menu";
import { AuthToast } from "./auth-toast";

const NAV_LINKS = [
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

// Routes that use the dashboard layout (no navbar/footer)
const DASHBOARD_ROUTES = ["/user-dashboard", "/admin"];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Hide on dashboard routes — must be AFTER all hooks
  const isDashboard = DASHBOARD_ROUTES.some((r) => pathname.startsWith(r));
  if (isDashboard) return null;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ease-in-out",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent border-b border-transparent",
      )}
      style={{ height: "var(--navbar-height)" }}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      <div className="container-page h-full grid grid-cols-3 items-center">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Humanly home"
          className="flex shrink-0 items-center gap-2.5"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground select-none">
            H
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Humanly
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-center justify-center gap-1"
          onMouseLeave={() => setHovered(null)}
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const isHovered = hovered === link.href;
            const showPill = isHovered || (isActive && !hovered);
            return (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={() => setHovered(link.href)}
                className="relative px-3 py-2 text-sm font-medium rounded-lg"
              >
                {showPill && (
                  <motion.span
                    layoutId="nav-pill"
                    className={cn(
                      "absolute inset-0 rounded-lg",
                      isActive ? "bg-primary/10" : "bg-muted",
                    )}
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                <span
                  className={cn(
                    "relative z-10 transition-colors duration-100",
                    isActive
                      ? "text-primary font-semibold"
                      : isHovered
                        ? "text-foreground"
                        : "text-muted-foreground",
                  )}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="md:hidden" />

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <AuthToast />
          <AnimatedThemeToggler
            variant="circle"
            className="flex size-8 items-center justify-center rounded-full border border-border bg-muted text-foreground transition-colors hover:bg-muted/80 [&_svg]:size-4"
          />
          {isSignedIn ? (
            <UserMenu />
          ) : (
            <>
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-sm font-medium text-muted-foreground rounded-md transition-colors hover:text-foreground hover:bg-muted"
                >
                  Log in
                </Link>
                <Link href="/login">
                  <Button>Try for free</Button>
                </Link>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                onClick={() => setMenuOpen((v) => !v)}
              >
                {menuOpen ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        className={cn(
          "md:hidden overflow-hidden border-b border-border bg-background/95 backdrop-blur-md transition-all duration-300 ease-in-out",
          menuOpen
            ? "max-h-72 opacity-100"
            : "max-h-0 opacity-0 pointer-events-none",
        )}
      >
        <nav className="container-page flex flex-col gap-1 py-4">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          {!isSignedIn && (
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Log in
              </Link>
              <Link href="/login" onClick={() => setMenuOpen(false)}>
                <Button className="w-full">Try for free</Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
