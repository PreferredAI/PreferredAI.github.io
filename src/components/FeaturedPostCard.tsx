import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

interface FeaturedPostCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    featuredImage: string;
    author: string;
    categories: string[];
    tags: string[];
  };
}

function formatDate(dateString: string): string {
  return format(new Date(dateString), "MMMM d, yyyy");
}

export function FeaturedPostCard({ post }: FeaturedPostCardProps) {
  return (
    <article className="group relative flex flex-col md:grid md:grid-cols-12 md:gap-6 bg-card border border-border/80 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-foreground/20 hover:shadow-sm transition-all duration-200 overflow-hidden w-full h-full">
      {/* Featured Image Link (7 columns on desktop) */}
      <Link
        href={`/blog/${post.slug}`}
        className="md:col-span-7 overflow-hidden rounded-xl relative select-none block aspect-video md:aspect-auto md:min-h-[260px] md:h-full w-full bg-muted"
      >
        {post.featuredImage ? (
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 650px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            priority
          />
        ) : (
          <div className="w-full h-full bg-muted/50 flex items-center justify-center border border-border/40 rounded-xl">
            <span className="text-xs font-mono font-medium text-muted-foreground tracking-wider">
              PREFERRED.AI
            </span>
          </div>
        )}
      </Link>

      {/* Card Content Info (5 columns on desktop) */}
      <div className="md:col-span-5 flex flex-col justify-between mt-5 md:mt-0 space-y-3">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 text-[11px] font-semibold select-none">
              Featured
            </span>
            {post.categories.length > 0 && (
              <span className="inline-flex gap-1.5">
                {post.categories.slice(0, 1).map((category) => {
                  const categorySlug = category
                    .toLowerCase()
                    .replace(/\s+/g, "-");
                  return (
                    <Link
                      key={categorySlug}
                      href={`/category/${categorySlug}`}
                      className="px-2 py-0.5 rounded-md bg-primary/10 text-[11px] font-medium text-primary border border-primary/20 hover:bg-primary/20 transition-colors select-none"
                    >
                      {category}
                    </Link>
                  );
                })}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-bold leading-snug text-balance text-foreground group-hover:text-primary transition-colors duration-150">
            <Link href={`/blog/${post.slug}`} className="text-inherit">
              {post.title}
            </Link>
          </h2>

          {/* Excerpt Summary */}
          {post.excerpt && (
            <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3 md:line-clamp-4">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Author & Date Metadata */}
        {(post.date || post.author) && (
          <div className="border-t border-border/60 pt-3 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
              {post.author && (
                <span className="font-medium text-foreground/90">
                  {post.author}
                </span>
              )}
              {post.author && post.date && (
                <span className="text-muted-foreground/40">•</span>
              )}
              {post.date && (
                <time
                  dateTime={post.date}
                  className="font-mono text-[11px] text-muted-foreground"
                >
                  {formatDate(post.date)}
                </time>
              )}
            </div>
            <span className="text-xs font-medium text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all">
              Read →
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
