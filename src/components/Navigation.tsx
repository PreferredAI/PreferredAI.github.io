"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(theme === "dark" || (!theme && systemDark));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

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
      <nav className={`flex items-center justify-between w-full px-4 sm:px-6 py-2 rounded-full transition-all duration-300 ${
        isMobileMenuOpen
          ? "bg-transparent border-transparent shadow-none backdrop-blur-none"
          : "bg-card/75 dark:bg-card/45 backdrop-blur-md border border-border/50 dark:border-white/5 shadow-md shadow-black/[0.02]"
      }`}>
        
        {/* Brand Logo Section */}
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

        {/* Center Section: Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-x-1.5 lg:gap-x-2.5">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 relative ${
                  active 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-white/5"
                }`}
              >
                {active && (
                  <span className="absolute inset-0 bg-primary/8 border border-primary/15 rounded-full -z-10" />
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
          >
            <button 
              className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 ${
                isAppsOpen 
                  ? "text-foreground bg-gray-100/50 dark:bg-white/5" 
                  : "text-muted-foreground hover:text-foreground hover:bg-gray-100/50 dark:hover:bg-white/5"
              }`}
            >
              Apps
              <svg
                className={`h-3.5 w-3.5 transition-transform duration-200 ${isAppsOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Popover Dropdown */}
            <div 
              className={`absolute left-1/2 -translate-x-1/2 top-full pt-2 w-32 transition-all duration-300 origin-top ${
                isAppsOpen 
                  ? "opacity-100 translate-y-0 visible scale-100" 
                  : "opacity-0 -translate-y-1 invisible scale-95"
              }`}
            >
              <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-border/60 p-1 shadow-lg ring-1 ring-black/5 dark:ring-white/5 overflow-hidden">
                <a
                  href="https://cornac.preferred.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center py-2 px-3 text-sm font-bold text-foreground/80 hover:text-primary hover:bg-primary/10 dark:hover:bg-white/5 rounded-xl transition-all"
                >
                  Cornac
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Theme Toggle & Join CTA button (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-white/5 transition-all cursor-pointer hover:rotate-12 active:scale-90"
              aria-label="Toggle Theme"
            >
              {isDark ? (
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          )}

          <Link
            href="/join"
            className={`inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-bold tracking-wider !text-white hover:!text-white transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm shadow-primary/10 ${
              isActive("/join")
                ? "bg-primary/85 shadow-inner"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            JOIN US
          </Link>
        </div>

        {/* Mobile Menu Button (Hamburger Icon that animates into "X") */}
        <button
          onClick={toggleMobileMenu}
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
                className={`px-4 py-2.5 rounded-full text-sm font-semibold tracking-wide text-center transition-all ${
                  active
                    ? "bg-primary/8 text-primary border border-primary/15"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-white/5"
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
              className="block text-center py-2.5 px-4 text-sm font-semibold text-muted-foreground hover:text-primary hover:bg-primary/10 dark:hover:bg-white/5 rounded-full transition-all"
            >
              Cornac
            </a>
          </div>

          {/* Theme Toggle for Mobile */}
          {mounted && (
            <div className="flex items-center justify-between border-t border-border/60 pt-4 mt-2 px-4 select-none">
              <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">Theme</span>
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-full text-muted-foreground hover:text-foreground bg-muted dark:bg-white/5 transition-all cursor-pointer"
                aria-label="Toggle Theme"
              >
                {isDark ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          )}

          {/* Standout Join CTA button inside Mobile Menu */}
          <Link
            href="/join"
            onClick={closeMobileMenu}
            className={`mt-auto text-center py-3 rounded-full text-sm font-bold tracking-wider !text-white hover:!text-white transition-all shadow-md shadow-primary/10 ${
              isActive("/join")
                ? "bg-primary/85"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            JOIN US
          </Link>
        </nav>
      </div>
    </header>
  );
}
