import Link from "next/link";
import { getAllCategories } from "@/lib/markdown-posts";

interface CategoryFilterBarProps {
  activeSlug?: string;
  allHref?: string;
  className?: string;
}

export default function CategoryFilterBar({
  activeSlug,
  allHref = "/blog",
  className = "",
}: CategoryFilterBarProps) {
  const categories = getAllCategories();
  if (categories.length === 0) return null;

  const normalizedActive = activeSlug?.toLowerCase();
  const isAllActive = !normalizedActive;

  return (
    <nav
      aria-label="Filter posts by category"
      className={`flex flex-wrap items-center gap-2 select-none ${className}`.trim()}
    >
      <Link
        href={allHref}
        aria-current={isAllActive ? "page" : undefined}
        className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
          isAllActive
            ? "bg-primary text-white hover:text-white border-primary shadow-xs shadow-primary/20"
            : "bg-card border-border/80 text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5"
        }`}
      >
        All Posts
      </Link>

      {categories.map((category) => {
        const isActive = normalizedActive === category.slug.toLowerCase();
        return (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            aria-current={isActive ? "page" : undefined}
            className={`group inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${
              isActive
                ? "bg-primary text-white hover:text-white border-primary shadow-xs shadow-primary/20"
                : "bg-card border-border/80 text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5"
            }`}
          >
            <span>{category.name}</span>
            <span
              className={`px-1.5 py-0.5 leading-none text-[10px] font-mono font-medium rounded-full border transition-colors ${
                isActive
                  ? "bg-white/20 text-white border-white/25"
                  : "bg-muted text-muted-foreground/80 border-border/50 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20"
              }`}
            >
              {category.count}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
