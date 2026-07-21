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
    <article className="group relative flex flex-col md:grid md:grid-cols-12 md:gap-8 bg-card/90 border border-border/70 rounded-3xl p-6 shadow-sm shadow-black/[0.01] hover:-translate-y-1 hover:shadow-md hover:border-primary/45 transition-all duration-300 overflow-hidden mb-10">
      {/* Featured Image Link (7 columns on desktop) */}
      <Link
        href={`/blog/${post.slug}`}
        className="md:col-span-7 overflow-hidden rounded-2xl relative select-none block aspect-video md:aspect-[16/10] w-full"
      >
        {post.featuredImage ? (
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 650px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-card flex items-center justify-center border border-border/40 rounded-2xl">
            <span className="text-xs font-bold text-primary/80 tracking-widest">
              FEATURED POST
            </span>
          </div>
        )}
      </Link>

      {/* Card Content Info (5 columns on desktop) */}
      <div className="md:col-span-5 flex flex-col justify-between mt-6 md:mt-0 space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[9px] font-black bg-primary text-white tracking-widest uppercase">
              FEATURED
            </span>
            {/* Category badge */}
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
                      className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider bg-primary/6 hover:bg-primary/12 text-primary border border-primary/10 transition-all uppercase"
                    >
                      {category}
                    </Link>
                  );
                })}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold leading-tight text-balance text-foreground group-hover:text-primary transition-colors duration-200">
            <Link href={`/blog/${post.slug}`} className="text-inherit">
              {post.title}
            </Link>
          </h2>

          {/* Excerpt Summary */}
          {post.excerpt && (
            <p className="text-sm sm:text-[15px] leading-relaxed text-pretty text-muted-foreground line-clamp-4 md:line-clamp-5">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Date Metadata */}
        {post.date && (
          <div className="border-t border-border/50 pt-4 flex items-center justify-between">
            <time
              dateTime={post.date}
              className="text-xs font-bold text-muted-foreground tracking-wider uppercase"
            >
              {formatDate(post.date)}
            </time>
            <span className="text-xs font-bold text-primary group-hover:translate-x-1.5 transition-transform duration-300">
              Read article →
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
