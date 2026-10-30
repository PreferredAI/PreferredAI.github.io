import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

interface PostCardProps {
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
  priority?: boolean;
}

function formatDate(dateString: string): string {
  return format(new Date(dateString), "MMMM d, yyyy");
}

export function PostCard({ post, priority }: PostCardProps) {
  return (
    <article className="group flex flex-col bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-foreground/20 hover:shadow-sm transition-all duration-200">
      {/* Featured Image Link */}
      <Link
        href={`/blog/${post.slug}`}
        className="mb-3.5 block overflow-hidden rounded-xl relative select-none bg-muted aspect-video w-full"
      >
        {post.featuredImage ? (
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            priority={priority}
          />
        ) : (
          <div className="w-full h-full bg-muted/50 flex items-center justify-center border border-border/40 rounded-xl">
            <span className="text-[10px] font-mono font-medium text-muted-foreground tracking-wider">
              PREFERRED.AI
            </span>
          </div>
        )}
      </Link>

      {/* Card Content info */}
      <div className="flex flex-col flex-1 space-y-2.5 justify-between">
        <div className="space-y-2">
          {/* Categories Pill Badging */}
          {post.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 select-none">
              {post.categories.map((category) => {
                const categorySlug = category
                  .toLowerCase()
                  .replace(/\s+/g, "-");
                return (
                  <Link
                    key={categorySlug}
                    href={`/category/${categorySlug}`}
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    {category}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Title */}
          <h2 className="text-base sm:text-lg font-bold leading-snug text-balance text-foreground group-hover:text-primary transition-colors duration-150">
            <Link href={`/blog/${post.slug}`} className="text-inherit">
              {post.title}
            </Link>
          </h2>
        </div>

        {/* Excerpt Summary */}
        {post.excerpt && (
          <p className="text-xs sm:text-[13.5px] leading-relaxed text-muted-foreground line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Bottom Panel: Author & Date Metadata */}
        {(post.date || post.author) && (
          <div className="border-t border-border/60 pt-3 flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground">
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
        )}
      </div>
    </article>
  );
}
