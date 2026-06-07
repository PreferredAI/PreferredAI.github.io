import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

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
    <article className="group flex flex-col bg-card/85 border border-border/70 rounded-3xl p-5 shadow-sm shadow-black/[0.01] hover:-translate-y-1 hover:shadow-md hover:border-border hover:bg-card transition-all duration-300">
      
      {/* Featured Image Link */}
      <Link href={`/blog/${post.slug}`} className="mb-4 block overflow-hidden rounded-2xl relative select-none">
        {post.featuredImage ? (
          <div className="relative aspect-video w-full">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={priority}
            />
          </div>
        ) : (
          <div className="aspect-video w-full bg-gradient-to-br from-primary/10 to-card flex items-center justify-center border border-border/40 rounded-2xl">
            <span className="text-[10px] font-bold text-primary/80 tracking-wider">PREFERRED.AI</span>
          </div>
        )}
      </Link>

      {/* Card Content info */}
      <div className="flex flex-col flex-1 space-y-3 justify-between">
        
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
                    className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider bg-primary/6 hover:bg-primary/12 text-primary border border-primary/10 transition-all uppercase"
                  >
                    {category}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Title */}
          <h2 className="text-lg sm:text-xl font-extrabold leading-tight text-balance text-foreground group-hover:text-primary transition-colors duration-200">
            <Link href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h2>
        </div>

        {/* Excerpt Summary */}
        {post.excerpt && (
          <p className="text-sm sm:text-[15px] leading-relaxed text-pretty text-muted-foreground line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Bottom Panel: Date Metadata */}
        {post.date && (
          <div className="border-t border-border/50 pt-3">
            <time dateTime={post.date} className="text-xs font-bold text-muted-foreground tracking-wider uppercase">
              {formatDate(post.date)}
            </time>
          </div>
        )}

      </div>
    </article>
  );
}
