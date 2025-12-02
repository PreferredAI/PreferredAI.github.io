"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden items-center gap-6 md:flex">
        <Link
          href="/about"
          className={
            isActive("/about")
              ? "rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white"
              : "text-gray-700 hover:text-gray-900"
          }
        >
          About
        </Link>
        <Link
          href="/people"
          className={
            isActive("/people")
              ? "rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white"
              : "text-gray-700 hover:text-gray-900"
          }
        >
          Team
        </Link>
        <Link
          href="/blog"
          className={
            isActive("/blog")
              ? "rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white"
              : "text-gray-700 hover:text-gray-900"
          }
        >
          Blog
        </Link>
        <Link
          href="/publications"
          className={
            isActive("/publications")
              ? "rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white"
              : "text-gray-700 hover:text-gray-900"
          }
        >
          Papers
        </Link>
        {/* <div className="group relative">
        <button className="text-gray-700 hover:text-gray-900">
          Projects
        </button>
      </div>
      <div className="group relative">
        <button className="text-gray-700 hover:text-gray-900">Apps</button>
      </div> */}
        <Link
          href="/join"
          className={
            isActive("/join")
              ? "rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white"
              : "text-gray-700 hover:text-gray-900"
          }
        >
          Join
        </Link>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="flex md:hidden flex-col gap-1.5 p-2"
        aria-label="Toggle menu"
      >
        <span
          className={`block h-0.5 w-6 bg-gray-900 transition-all ${
            isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-gray-900 transition-all ${
            isMobileMenuOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-gray-900 transition-all ${
            isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20"
            onClick={closeMobileMenu}
          />

          {/* Menu Panel */}
          <nav className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl">
            <div className="flex flex-col p-6 gap-4">
              <button
                onClick={closeMobileMenu}
                className="self-end p-2"
                aria-label="Close menu"
              >
                <span className="block h-0.5 w-6 bg-gray-900 rotate-45 translate-y-0.5" />
                <span className="block h-0.5 w-6 bg-gray-900 -rotate-45 -translate-y-0.5" />
              </button>

              <Link
                href="/about"
                onClick={closeMobileMenu}
                className={
                  isActive("/about")
                    ? "rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white text-center"
                    : "text-gray-700 hover:text-gray-900 px-4 py-2"
                }
              >
                About
              </Link>
              <Link
                href="/people"
                onClick={closeMobileMenu}
                className={
                  isActive("/people")
                    ? "rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white text-center"
                    : "text-gray-700 hover:text-gray-900 px-4 py-2"
                }
              >
                Team
              </Link>
              <Link
                href="/blog"
                onClick={closeMobileMenu}
                className={
                  isActive("/blog")
                    ? "rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white text-center"
                    : "text-gray-700 hover:text-gray-900 px-4 py-2"
                }
              >
                Blog
              </Link>
              <Link
                href="/publications"
                onClick={closeMobileMenu}
                className={
                  isActive("/publications")
                    ? "rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white text-center"
                    : "text-gray-700 hover:text-gray-900 px-4 py-2"
                }
              >
                Papers
              </Link>
              <Link
                href="/join"
                onClick={closeMobileMenu}
                className={
                  isActive("/join")
                    ? "rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white text-center"
                    : "text-gray-700 hover:text-gray-900 px-4 py-2"
                }
              >
                Join
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
