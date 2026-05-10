/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState, useEffect, useTransition } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./user-menu";
import { AuthToast } from "./auth-toast";
import { ArrowRightIcon } from "lucide-react";

const NAV_LINKS = [
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const DASHBOARD_ROUTES = ["/user-dashboard", "/admin"];

// Animated hamburger ↔ X toggle
function MenuToggle({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      className="relative flex size-9 items-center justify-center rounded-lg border border-border bg-muted text-foreground transition-colors hover:bg-muted/80 md:hidden"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <motion.line
          x1="2"
          y1="5"
          x2="16"
          y2="5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
          style={{ originX: "50%", originY: "50%" }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        />
        <motion.line
          x1="2"
          y1="9"
          x2="16"
          y2="9"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
          style={{ originX: "50%", originY: "50%" }}
          transition={{ duration: 0.2 }}
        />
        <motion.line
          x1="2"
          y1="13"
          x2="16"
          y2="13"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
          style={{ originX: "50%", originY: "50%" }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        />
      </svg>
    </button>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const [, startTransition] = useTransition();
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

  // Close menu on route change
  useEffect(() => {
    startTransition(() => setMenuOpen(false));
  }, [pathname]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isDashboard = DASHBOARD_ROUTES.some((r) => pathname.startsWith(r));
  if (isDashboard) return null;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ease-in-out",
          scrolled || menuOpen
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
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
            className="flex shrink-0 items-center"
          >
            <img
              src="/HumanlyLogo-2.png"
              alt="Humanly"
              className="h-12 w-auto object-contain select-none"
            />
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
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 40,
                      }}
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
                  <Link href="/login">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      Log in
                    </Button>
                  </Link>

                  <Link href="/login">
                    <Button size="lg" className="w-full sm:w-auto gap-2">
                      Try for free
                    </Button>
                  </Link>
                </div>
                <MenuToggle
                  open={menuOpen}
                  onClick={() => setMenuOpen((v) => !v)}
                />
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Fullscreen mobile menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            role="dialog"
            aria-label="Mobile navigation"
            aria-modal="true"
            className="fixed inset-0 z-40 flex flex-col md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Blurred backdrop */}
            <div className="absolute inset-0 bg-background/98 backdrop-blur-xl" />

            {/* Slide-in panel */}
            <motion.div
              className="relative z-10 flex flex-col h-full pt-(--navbar-height)"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <nav className="flex flex-col items-center justify-center flex-1 gap-3 px-6">
                {NAV_LINKS.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{
                        delay: 0.06 + i * 0.08,
                        duration: 0.4,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      className="w-full max-w-xs"
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className={cn(
                          "flex items-center justify-center w-full rounded-2xl px-6 py-4 text-2xl font-bold transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-muted",
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Auth buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{
                    delay: 0.06 + NAV_LINKS.length * 0.08,
                    duration: 0.4,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="w-full max-w-xs flex flex-col gap-3 mt-4 pt-4 border-t border-border"
                >
                  <Link href="/login" onClick={() => setMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full h-12 text-base rounded-2xl"
                    >
                      Log in
                    </Button>
                  </Link>
                  <Link href="/login" onClick={() => setMenuOpen(false)}>
                    <Button className="w-full h-12 text-base rounded-2xl">
                      Try for free
                    </Button>
                  </Link>
                </motion.div>
              </nav>

              {/* Faded logo watermark at bottom */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.35 }}
                className="pb-10 flex justify-center"
              >
                <img
                  src="/HumanlyLogo-2.png"
                  alt=""
                  className="h-7 w-auto opacity-15 select-none"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
