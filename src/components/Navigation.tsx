"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import BrandLogo from "@/assets/Brand.png";

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAppsOpen, setIsAppsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect --
       localStorage and matchMedia are unavailable during SSR, so the theme
       must be synced into state after mount (standard hydration guard). */
    setMounted(true);
    const theme = localStorage.getItem("theme");
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    setIsDark(theme === "dark" || (!theme && systemDark));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsAppsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const isActive = (path: string) => {
    if (path === "/blog") {
      return pathname.startsWith("/blog") || pathname === "/";
    }
    return pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/people", label: "Team" },
    { href: "/blog", label: "Blog" },
    { href: "/publications", label: "Papers" },
  ];

  return (
    <header className="fixed top-4 inset-x-0 z-50 mx-auto w-full max-w-[1360px] px-4 select-none">
      <nav
        className={`flex items-center justify-between w-full px-4 sm:px-6 py-2 rounded-full transition-all duration-300 ${
          isMobileMenuOpen
            ? "bg-transparent border-transparent shadow-none backdrop-blur-none"
            : "bg-card/75 dark:bg-card/45 backdrop-blur-md border border-border/50 dark:border-white/5 shadow-md shadow-black/[0.02]"
        }`}
      >
        {/* Left: brand logo + persistent tagline (xl and up) */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className={`hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 ${
              isMobileMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <Image
              src={BrandLogo}
              alt="Preferred.AI"
              className="h-9 w-auto object-contain rounded-md"
              priority
              unoptimized
            />
          </Link>
          <span
            aria-hidden="true"
            className="hidden xl:block h-5 w-px bg-border"
          />
          <span className="hidden xl:block text-sm font-medium tracking-tight text-muted-foreground whitespace-nowrap">
            Preferences and Recommendations from Data &amp; AI
          </span>
        </div>

        {/* Right cluster: nav links + apps + actions, grouped to the right */}
        <div className="hidden md:flex items-center gap-x-3 lg:gap-x-4">
          {/* Navigation Links (Desktop) */}
          <div className="flex items-center gap-x-1 lg:gap-x-1.5">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium tracking-normal transition-all duration-200 relative ${
                    active
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10"
                  }`}
                >
                  {active && (
                    <span className="absolute bottom-0.5 inset-x-3.5 h-0.5 bg-primary rounded-full" />
                  )}
                  {link.label}
                </Link>
              );
            })}

            {/* Interactive Apps Dropdown Popover */}
            <div
              className="relative"
              onMouseEnter={() => setIsAppsOpen(true)}
              onMouseLeave={() => setIsAppsOpen(false)}
              onFocus={() => setIsAppsOpen(true)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setIsAppsOpen(false);
                }
              }}
            >
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={isAppsOpen}
                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-sm font-medium tracking-normal transition-all duration-200 ${
                  isAppsOpen
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10"
                }`}
              >
                Apps
                <svg
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${isAppsOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Popover Dropdown */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 top-full pt-1.5 w-28 transition-all duration-200 origin-top ${
                  isAppsOpen
                    ? "opacity-100 translate-y-0 visible scale-100"
                    : "opacity-0 -translate-y-1 invisible scale-95"
                }`}
              >
                <div className="rounded-xl bg-card/95 backdrop-blur-md border border-border/70 p-1 shadow-md shadow-black/10 overflow-hidden">
                  <a
                    href="https://cornac.preferred.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between py-2 px-3 text-sm font-medium text-foreground/85 hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 rounded-lg transition-all whitespace-nowrap"
                  >
                    <span>Cornac</span>
                    <span className="text-xs text-muted-foreground/60 font-mono transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      ↗
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Theme Toggle & Join CTA button (Desktop) */}
          <div className="flex items-center gap-2.5">
            {!mounted ? (
              /* Reserve the toggle's footprint pre-hydration to avoid layout shift */
              <div aria-hidden="true" className="p-1.5">
                <div className="h-4 w-4" />
              </div>
            ) : (
              <button
                type="button"
                onClick={toggleTheme}
                className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/70 dark:hover:bg-white/5 transition-all cursor-pointer hover:rotate-12 active:scale-90"
                aria-label="Toggle Theme"
              >
                {isDark ? (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
            )}

            <Link
              href="/join"
              className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-semibold tracking-normal text-white transition-all duration-200 hover:scale-105 active:scale-95 shadow-xs ${
                isActive("/join")
                  ? "bg-primary ring-2 ring-primary/30"
                  : "bg-primary hover:bg-primary/95"
              }`}
            >
              Join Us
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button (Hamburger Icon that animates into "X") */}
        <button
          type="button"
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav-menu"
          className="flex md:hidden flex-col gap-1.5 p-2 rounded-full hover:bg-muted dark:hover:bg-white/5 transition-colors relative z-50 cursor-pointer"
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-5 bg-foreground transition-all duration-300 ${
              isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-foreground transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-foreground transition-all duration-300 ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile Navigation Panel */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Frosted Backdrop Overlay */}
        <div
          className="fixed inset-0 bg-black/15 backdrop-blur-sm transition-opacity"
          onClick={closeMobileMenu}
        />

        {/* Drawer Menu Panel */}
        <nav
          id="mobile-nav-menu"
          className={`fixed right-0 top-0 h-full w-72 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-2xl border-l border-border/60 flex flex-col p-6 pt-24 gap-4 transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium tracking-normal text-center transition-all ${
                  active
                    ? "bg-primary/10 font-semibold text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Apps section for Mobile Menu */}
          <div className="border-t border-border/60 pt-4 mt-2">
            <div className="px-4 pb-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider text-center">
              Apps
            </div>
            <a
              href="https://cornac.preferred.ai"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMobileMenu}
              className="block text-center py-2 px-4 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl transition-all"
            >
              Cornac ↗
            </a>
          </div>

          {/* Theme Toggle for Mobile */}
          {mounted && (
            <div className="flex items-center justify-between border-t border-border/60 pt-4 mt-2 px-4 select-none">
              <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">
                Theme
              </span>
              <button
                type="button"
                onClick={toggleTheme}
                className="p-1.5 rounded-full text-muted-foreground hover:text-foreground bg-muted dark:bg-white/5 transition-all cursor-pointer"
                aria-label="Toggle Theme"
              >
                {isDark ? (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
            </div>
          )}

          {/* Standout Join CTA button inside Mobile Menu */}
          <Link
            href="/join"
            onClick={closeMobileMenu}
            className={`mt-auto text-center py-2.5 rounded-full text-xs font-semibold tracking-wide text-white transition-all shadow-xs ${
              isActive("/join")
                ? "bg-primary ring-2 ring-primary/30"
                : "bg-primary hover:bg-primary/95"
            }`}
          >
            Join Us
          </Link>
        </nav>
      </div>
    </header>
  );
}
