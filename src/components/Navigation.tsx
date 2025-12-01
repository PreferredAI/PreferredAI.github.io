"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/blog") {
      return pathname.startsWith("/blog") || pathname === "/";
    }
    return pathname === path;
  };

  return (
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
  );
}
