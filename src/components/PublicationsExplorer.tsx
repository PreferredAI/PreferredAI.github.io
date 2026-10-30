"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { PUBLICATION_CATEGORIES } from "@/data/publicationCategories";
import type { Publication, YearSection } from "@/data/publications";
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

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-border/70 bg-muted/40 text-[11px] font-medium text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors select-none"
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

  const totalFilteredPubs = useMemo(() => {
    return filteredData.reduce((acc, sec) => acc + sec.publications.length, 0);
  }, [filteredData]);

  return (
    <div className="space-y-6">
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
          className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-border/80 bg-background text-foreground placeholder:text-muted-foreground shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* 2. Categorization Pills Bar & Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3.5">
        <div
          role="tablist"
          aria-label="Publication Categories"
          className="flex flex-wrap gap-1.5 select-none"
        >
          {PUBLICATION_CATEGORIES.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "bg-primary text-white border-primary shadow-xs shadow-primary/25"
                  : "border-border/60 bg-muted/40 text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="text-xs font-mono text-muted-foreground shrink-0 select-none">
          Showing {totalFilteredPubs}{" "}
          {totalFilteredPubs === 1 ? "paper" : "papers"}
        </span>
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
                {section.publications.map((pub) => {
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
                      key={`${pub.title}-${pub.authors}-${pub.venue}`}
                      className="relative ml-7 pb-6 group"
                    >
                      {/* Timeline concentric indicator bullet (optically centered on the border line) */}
                      <div className="absolute -left-[28px] -translate-x-1/2 w-6 top-[7px] z-10 flex items-center justify-center">
                        <div className="size-2 rounded-full bg-primary ring-2 ring-background shadow-xs transition-transform duration-150 group-hover:scale-125" />
                      </div>

                      {/* Content Card */}
                      <div className="flex flex-col gap-1 pl-1.5">
                        {/* Title */}
                        <h3 className="font-bold text-foreground text-sm sm:text-base leading-snug group-hover:text-primary transition-colors duration-150">
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
                          <span className="font-medium text-foreground/90">
                            {pub.authors}
                          </span>
                        </p>

                        {/* Venue */}
                        <p className="text-xs font-medium text-muted-foreground leading-normal">
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
