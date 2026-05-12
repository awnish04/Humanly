/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState, useEffect, useTransition } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./user-menu";

const NAV_LINKS = [
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const DASHBOARD_ROUTES = ["/user-dashboard", "/admin"];

function MenuToggle({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      className="flex size-9 items-center justify-center rounded-full border border-border bg-muted text-foreground transition-colors hover:bg-muted/80 lg:hidden"
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
  const { theme, setTheme } = useTheme();
  const [, startTransition] = useTransition();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    startTransition(() => setMenuOpen(false));
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  if (DASHBOARD_ROUTES.some((r) => pathname.startsWith(r))) return null;

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
        <div className="container-page h-full grid grid-cols-2 lg:grid-cols-3 items-center">
          {/* Logo */}
          <div className="flex items-center justify-start">
            <Link
              href="/"
              aria-label="Humanly home"
              className="flex shrink-0 items-center"
            >
              <img
                src="/HumanlyLogoPurple-2.png"
                alt="Humanly"
                className="h-12 w-auto object-contain select-none"
              />
            </Link>
          </div>

          {/* Desktop nav — centered, lg only */}
          <nav
            aria-label="Main navigation"
            className="hidden lg:flex items-center gap-1 flex-1 justify-center"
            onMouseLeave={() => setHovered(null)}
          >
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              const isHov = hovered === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => setHovered(link.href)}
                  className="relative px-4 py-2 text-sm font-medium rounded-full"
                >
                  {(isHov || (isActive && !hovered)) && (
                    <motion.span
                      layoutId="nav-pill"
                      className={cn(
                        "absolute inset-0 rounded-full",
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
                        : isHov
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

          {/* Right side */}
          <div className="flex items-center justify-end gap-2">
            {/* Desktop only: theme toggle + auth */}
            <div className="hidden lg:flex items-center gap-3">
              <AnimatedThemeToggler
                variant="circle"
                className="flex p-2 items-center justify-center rounded-full border border-border bg-muted text-foreground transition-colors hover:bg-muted/80 [&_svg]:size-4"
              />
              {isSignedIn ? (
                <UserMenu />
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button className="w-full sm:w-auto h-12 px-7 text-base font-semibold rounded-xl gap-2 shadow-lg shadow-primary/20">
                      Log in
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile: hamburger only */}
            <MenuToggle
              open={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            />
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            role="dialog"
            aria-label="Mobile navigation"
            aria-modal="true"
            className="fixed inset-0 z-40 flex flex-col lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="absolute inset-0 bg-background/98 backdrop-blur-xl" />

            <motion.div
              className="relative z-10 flex flex-col h-full pt-(--navbar-height)"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <nav className="flex flex-col items-center justify-center flex-1 gap-3 px-6">
                {/* Nav links */}
                {NAV_LINKS.map((link, i) => (
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
                        "flex items-center justify-center w-full rounded-full px-6 py-4 text-2xl font-bold transition-colors",
                        pathname === link.href
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted",
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Auth + theme section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{
                    delay: 0.06 + NAV_LINKS.length * 0.08,
                    duration: 0.4,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="w-full max-w-xs flex flex-col gap-2 pt-4 border-t border-border"
                >
                  {/* Inline theme switcher — Sun / Moon pill */}
                  <div className="flex items-center gap-1 mx-1 mt-1 rounded-lg border border-border bg-muted p-1">
                    <button
                      onClick={() => setTheme("light")}
                      aria-label="Light mode"
                      className={cn(
                        "flex-1 flex items-center justify-center py-1 rounded-md transition-colors",
                        theme === "light"
                          ? "bg-background shadow-sm text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Sun className="size-3.5" aria-hidden />
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      aria-label="Dark mode"
                      className={cn(
                        "flex-1 flex items-center justify-center py-1 rounded-md transition-colors",
                        theme === "dark"
                          ? "bg-background shadow-sm text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Moon className="size-3.5" aria-hidden />
                    </button>
                  </div>

                  {isSignedIn ? (
                    /* Signed-in: full card row triggers UserMenu dropdown */
                    <UserMenu variant="card" />
                  ) : (
                    /* Signed-out: login + try for free */
                    <>
                      <Link href="/login" onClick={() => setMenuOpen(false)}>
                        <Button
                          variant="outline"
                          className="w-full h-12 text-base rounded-xl"
                        >
                          Log in
                        </Button>
                      </Link>
                      <Link href="/login" onClick={() => setMenuOpen(false)}>
                        <Button className="w-full h-12 text-base rounded-xl">
                          Try for free
                        </Button>
                      </Link>
                    </>
                  )}
                </motion.div>
              </nav>

              {/* Bottom logo watermark */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.35 }}
                className="pb-10 flex justify-center"
              >
                <img
                  src="/HumanlyLogoPurple-2.png"
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
