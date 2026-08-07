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
    <div className="mt-12 flex items-center justify-center gap-2">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground/80 hover:bg-muted dark:hover:bg-white/5 hover:text-primary transition-all"
        >
          Previous
        </Link>
      ) : (
        <span className="cursor-not-allowed rounded-lg border border-border/40 px-4 py-2 text-sm font-medium text-muted-foreground/40">
          Previous
        </span>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {renderPageNumbers().map((item) => {
          if (item.value === "...") {
            return (
              <span key={item.key} className="px-2 text-muted-foreground/60">
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
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border text-foreground/80 hover:bg-muted dark:hover:bg-white/5 hover:text-primary"
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
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground/80 hover:bg-muted dark:hover:bg-white/5 hover:text-primary transition-all"
        >
          Next
        </Link>
      ) : (
        <span className="cursor-not-allowed rounded-lg border border-border/40 px-4 py-2 text-sm font-medium text-muted-foreground/40">
          Next
        </span>
      )}
    </div>
  );
}
