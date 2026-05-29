"use client";

import React, { useState, useMemo } from "react";
import { Publication, YearSection } from "@/data/publications";
import { PUBLICATION_CATEGORIES } from "@/data/publicationCategories";

// ----------------------------------------------------
// Custom Zero-Dependency Responsive SVG Icon Components
// ----------------------------------------------------
const SearchIcon = () => (
  <svg
    className="h-4 w-4 text-muted-foreground group-focus-within:text-red-600 transition-colors"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const PdfIcon = () => (
  <svg
    className="h-3.5 w-3.5 text-red-500"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 9h1.5M9 13h6M9 17h6"
    />
  </svg>
);

const CodeIcon = () => (
  <svg
    className="h-3.5 w-3.5 text-gray-700 dark:text-gray-400"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
    />
  </svg>
);

const SlidesIcon = () => (
  <svg
    className="h-3.5 w-3.5 text-amber-600"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 12l3-3 3 3 4-4M8 21h8M12 17v4M3 4h18M4 4v10a2 2 0 002 2h12a2 2 0 002-2V4"
    />
  </svg>
);

const VideoIcon = () => (
  <svg
    className="h-3.5 w-3.5 text-red-600"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

const LinkIcon = () => (
  <svg
    className="h-3.5 w-3.5 text-blue-600"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
);

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
        return "hover:border-red-300 dark:hover:border-red-900/60 hover:bg-red-50/45 dark:hover:bg-red-950/20 hover:text-red-700 dark:hover:text-red-400";
      case "code":
        return "hover:border-gray-400 dark:hover:border-gray-700 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white";
      case "slides":
        return "hover:border-amber-300 dark:hover:border-amber-900/60 hover:bg-amber-50/45 dark:hover:bg-amber-950/20 hover:text-amber-700 dark:hover:text-amber-400";
      case "video":
        return "hover:border-red-400 dark:hover:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-700 dark:hover:text-red-400";
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

export default function PublicationsExplorer({ data }: ExplorerProps) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");

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

  // Live searching and categorization filters compilation
  const filteredData = useMemo(() => {
    const query = search.toLowerCase().trim();

    return data
      .map((section) => {
        const filteredPubs = section.publications.filter((pub) => {
          const matchesQuery =
            query === "" ||
            pub.title.toLowerCase().includes(query) ||
            pub.authors.toLowerCase().includes(query) ||
            pub.venue.toLowerCase().includes(query) ||
            section.year.includes(query);

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
          type="text"
          placeholder="Search papers by keywords, venue, authors or year..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-12 py-3 rounded-2xl border border-border/80 bg-card/70 text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500/80 transition-all duration-300 text-sm font-medium"
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
      <div className="flex flex-wrap gap-2 border-b border-border/40 pb-4 select-none">
        {PUBLICATION_CATEGORIES.map((tab) => (
          <button
            key={tab.id}
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
              <ul className="ml-4 border-l border-border/70 relative space-y-2">
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
                    <li key={pubIndex} className="relative ml-7 pb-6 group">
                      {/* Timeline concentric indicator bullet */}
                      <div className="absolute -left-[33px] top-1.5 z-10 flex items-center justify-center">
                        <div className="size-2.5 rounded-full border-2 border-primary bg-background flex items-center justify-center relative shadow-sm transition-transform duration-300 group-hover:scale-125">
                          <span className="absolute size-1.5 rounded-full bg-primary" />
                        </div>
                      </div>

                      {/* Content Card */}
                      <div className="flex flex-col gap-1.5 pl-1.5">
                        {/* Title */}
                        <h3 className="font-bold text-foreground text-sm sm:text-base leading-snug group-hover:text-primary transition-colors duration-200">
                          {pub.pdfUrl ? (
                            <a
                              href={pub.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
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
                        <p className="text-xs font-semibold text-red-750 dark:text-red-400/80 leading-normal">
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
                          <div className="flex flex-wrap gap-2 mt-2">
                            {links.map((link, idx) => (
                              <LinkBadge key={idx} link={link} />
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
