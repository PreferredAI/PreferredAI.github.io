import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const getPageUrl = (page: number) => {
    if (page === 1) {
      return basePath;
    }
    return `${basePath}${basePath.endsWith("/") ? "" : "/"}page/${page}`;
  };

  const renderPageNumbers = () => {
    const pages: { key: string; value: number | "..." }[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push({ key: `page-${i}`, value: i });
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push({ key: `page-${i}`, value: i });
        }
        pages.push({ key: "ellipsis-end", value: "..." });
        pages.push({ key: `page-${totalPages}`, value: totalPages });
      } else if (currentPage >= totalPages - 2) {
        pages.push({ key: "page-1", value: 1 });
        pages.push({ key: "ellipsis-start", value: "..." });
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push({ key: `page-${i}`, value: i });
        }
      } else {
        pages.push({ key: "page-1", value: 1 });
        pages.push({ key: "ellipsis-start", value: "..." });
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push({ key: `page-${i}`, value: i });
        }
        pages.push({ key: "ellipsis-end", value: "..." });
        pages.push({ key: `page-${totalPages}`, value: totalPages });
      }
    }

    return pages;
  };

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-1 sm:gap-1.5"
    >
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="rounded-lg border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/70 transition-colors"
          rel="prev"
        >
          Previous
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="cursor-not-allowed rounded-lg border border-border/40 bg-card/40 px-3 py-1.5 text-xs font-medium text-muted-foreground/40 select-none"
        >
          Previous
        </span>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {renderPageNumbers().map((item) => {
          if (item.value === "...") {
            return (
              <span
                key={item.key}
                className="px-2 text-xs font-mono text-muted-foreground/60 select-none"
              >
                ...
              </span>
            );
          }

          const pageNum = item.value as number;
          const isActive = pageNum === currentPage;

          return (
            <Link
              key={item.key}
              href={getPageUrl(pageNum)}
              aria-current={isActive ? "page" : undefined}
              className={`rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition-colors ${
                isActive
                  ? "bg-primary text-white shadow-xs"
                  : "border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-muted/70"
              }`}
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="rounded-lg border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/70 transition-colors"
          rel="next"
        >
          Next
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="cursor-not-allowed rounded-lg border border-border/40 bg-card/40 px-3 py-1.5 text-xs font-medium text-muted-foreground/40 select-none"
        >
          Next
        </span>
      )}
    </nav>
  );
}
