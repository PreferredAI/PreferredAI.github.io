"use client";

import { PUBLICATION_CATEGORIES } from "@/data/publicationCategories";
import type { Publication, YearSection } from "@/data/publications";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CodeIcon,
  LinkIcon,
  PdfIcon,
  SearchIcon,
  SlidesIcon,
  VideoIcon,
} from "./icons";

// Lowercase and strip diacritics so search is case- and accent-insensitive.
const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

// ----------------------------------------------------
// Sub-Components for Badge Rendering
// ----------------------------------------------------
interface StructuredLink {
  type: "pdf" | "code" | "slides" | "video" | "link";
  label: string;
  url: string;
}

const LinkBadge: React.FC<{ link: StructuredLink }> = ({ link }) => {
  const getIcon = () => {
    switch (link.type) {
      case "pdf":
        return <PdfIcon />;
      case "code":
        return <CodeIcon />;
      case "slides":
        return <SlidesIcon />;
      case "video":
        return <VideoIcon />;
      default:
        return <LinkIcon />;
    }
  };

  const getHoverStyles = () => {
    switch (link.type) {
      case "pdf":
        return "hover:border-primary/30 dark:hover:border-primary/45 hover:bg-primary/5 dark:hover:bg-primary/10 hover:text-primary";
      case "code":
        return "hover:border-gray-400 dark:hover:border-gray-700 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white";
      case "slides":
        return "hover:border-amber-300 dark:hover:border-amber-900/60 hover:bg-amber-50/45 dark:hover:bg-amber-950/20 hover:text-amber-700 dark:hover:text-amber-400";
      case "video":
        return "hover:border-primary/40 dark:hover:border-primary/45 hover:bg-primary/5 dark:hover:bg-primary/10 hover:text-primary";
      default:
        return "hover:border-blue-300 dark:hover:border-blue-900/60 hover:bg-blue-50/45 dark:hover:bg-blue-950/20 hover:text-blue-700 dark:hover:text-blue-400";
    }
  };

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border border-border/65 bg-muted/40 text-[11px] font-bold text-muted-foreground shadow-sm transition-all select-none ${getHoverStyles()}`}
    >
      {getIcon()}
      {link.label}
    </a>
  );
};

// ----------------------------------------------------
// Main Component
// ----------------------------------------------------
interface ExplorerProps {
  data: YearSection[];
}

// Helper keyword matcher
const matchesTab = (pub: Publication, tabId: string) => {
  if (tabId === "All") return true;

  const filter = PUBLICATION_CATEGORIES.find((c) => c.id === tabId);
  if (!filter) return true;

  const titleLower = pub.title.toLowerCase();
  const venueLower = pub.venue.toLowerCase();

  return filter.keywords.some(
    (keyword) => titleLower.includes(keyword) || venueLower.includes(keyword),
  );
};

export default function PublicationsExplorer({ data }: ExplorerProps) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when "/" is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Live searching and categorization filters compilation
  const filteredData = useMemo(() => {
    // Split the query into words so they can match in any order across any
    // field (e.g. "Zhang Ce" matches author "Delvin Ce Zhang"). Accents are
    // folded so "Nguyen" matches "Nguyễn".
    const tokens = normalizeText(search).split(/\s+/).filter(Boolean);

    return data
      .map((section) => {
        const filteredPubs = section.publications.filter((pub) => {
          const haystack = normalizeText(
            `${pub.title} ${pub.authors} ${pub.venue} ${section.year}`,
          );
          const matchesQuery = tokens.every((token) =>
            haystack.includes(token),
          );

          const matchesCategory = matchesTab(pub, activeTab);

          return matchesQuery && matchesCategory;
        });

        return {
          ...section,
          publications: filteredPubs,
        };
      })
      .filter((section) => section.publications.length > 0);
  }, [data, search, activeTab]);

  return (
    <div className="space-y-8">
      {/* 1. Dynamic Search Header */}
      <div className="relative group">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none select-none">
          <SearchIcon />
        </div>
        <input
          ref={searchInputRef}
          type="text"
          aria-label="Search publications by keyword, venue, author, or year"
          placeholder="Search papers by keywords, venue, authors or year... (Press '/' to search)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-12 py-3 rounded-2xl border border-border/80 bg-card/70 text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/80 transition-all duration-300 text-sm font-medium"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* 2. Categorization Pills Bar */}
      <div
        role="tablist"
        aria-label="Publication Categories"
        className="flex flex-wrap gap-2 border-b border-border/40 pb-4 select-none"
      >
        {PUBLICATION_CATEGORIES.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 cursor-pointer ${
              activeTab === tab.id
                ? "bg-primary/8 border-primary/15 text-primary shadow-sm"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Render Publications Lists */}
      {filteredData.length > 0 ? (
        <div className="space-y-10">
          {filteredData.map((section) => (
            <div key={section.year} className="space-y-4">
              {/* Year Divider */}
              <h2 className="text-base font-extrabold tracking-tight text-foreground border-b border-border/60 pb-1.5 w-fit select-none">
                {section.year}
              </h2>

              {/* timeline container list */}
              <ul className="ml-4 border-l border-border/70 relative">
                {section.publications.map((pub, pubIndex) => {
                  // Dynamically map publication links into StructuredLink layout
                  const links: StructuredLink[] = [];

                  if (pub.pdfUrl) {
                    links.push({ type: "pdf", label: "PDF", url: pub.pdfUrl });
                  }

                  if (pub.extraLinks) {
                    pub.extraLinks.forEach((link) => {
                      const textLower = link.text.toLowerCase();
                      let type: "pdf" | "code" | "slides" | "video" | "link" =
                        "link";

                      if (
                        textLower.includes("code") ||
                        textLower.includes("github") ||
                        textLower.includes("bitbucket")
                      ) {
                        type = "code";
                      } else if (
                        textLower.includes("slides") ||
                        textLower.includes("poster")
                      ) {
                        type = "slides";
                      } else if (
                        textLower.includes("video") ||
                        textLower.includes("youtube") ||
                        textLower.includes("youtu.be")
                      ) {
                        type = "video";
                      } else if (textLower.includes("pdf")) {
                        type = "pdf";
                      }

                      links.push({ type, label: link.text, url: link.url });
                    });
                  }

                  return (
                    <li
                      key={`${pub.title}-${pubIndex}`}
                      className="relative ml-7 pb-6 group"
                    >
                      {/* Timeline concentric indicator bullet (optically centered on the border line) */}
                      <div className="absolute -left-[28px] -translate-x-1/2 w-6 top-[7px] z-10 flex items-center justify-center">
                        {pubIndex === 0 ? (
                          <div className="size-2.5 rounded-full border-2 border-primary bg-background flex items-center justify-center relative shadow-sm transition-transform duration-300 group-hover:scale-125">
                            <span className="absolute size-1.5 rounded-full bg-primary" />
                          </div>
                        ) : (
                          <div className="size-1.5 rounded-full bg-border dark:bg-zinc-800 border border-transparent group-hover:border-primary group-hover:bg-primary transition-all duration-300" />
                        )}
                      </div>

                      {/* Content Card */}
                      <div className="flex flex-col gap-1 pl-1.5">
                        {/* Title */}
                        <h3 className="font-bold text-foreground text-sm sm:text-base leading-snug group-hover:text-primary transition-colors duration-200">
                          {pub.pdfUrl ? (
                            <a
                              href={pub.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-inherit"
                            >
                              {pub.title}
                            </a>
                          ) : (
                            pub.title
                          )}
                        </h3>

                        {/* Authors */}
                        <p className="text-xs sm:text-sm text-muted-foreground leading-normal">
                          by{" "}
                          <span className="font-semibold text-foreground/90">
                            {pub.authors}
                          </span>
                        </p>

                        {/* Venue */}
                        <p className="text-xs font-semibold text-primary leading-normal">
                          {pub.venue}
                        </p>

                        {/* Award box rendering */}
                        {pub.award && (
                          <div className="inline-flex w-fit items-center gap-1 mt-1 px-3 py-1 rounded-xl text-[10px] font-extrabold bg-amber-50 dark:bg-amber-950/15 border border-amber-200/50 dark:border-amber-900/35 text-amber-800 dark:text-amber-400 shadow-sm shadow-amber-500/[0.02] select-none">
                            🏆 {pub.award.text}
                          </div>
                        )}

                        {/* Link badges row */}
                        {links.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {links.map((link) => (
                              <LinkBadge
                                key={`${link.url}-${link.label}`}
                                link={link}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-border rounded-3xl select-none">
          <p className="text-sm font-semibold text-muted-foreground">
            No publications found matching your search criteria.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setActiveTab("All");
            }}
            className="text-xs font-bold text-primary mt-2.5 hover:underline cursor-pointer"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
}
