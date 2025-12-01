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
}

function formatDate(dateString: string): string {
  return format(new Date(dateString), "MMMM d, yyyy");
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group flex flex-col bg-white">
      <Link href={`/blog/${post.slug}`} className="mb-4 block">
        {post.featuredImage && (
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
      </Link>

      <div className="flex flex-col space-y-3">
        <h2 className="text-xl font-bold leading-tight">
          <Link href={`/blog/${post.slug}`} className="hover:text-gray-600">
            {post.title}
          </Link>
        </h2>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {post.categories.length > 0 && (
            <>
              {post.categories.map((category, index) => {
                const categorySlug = category
                  .toLowerCase()
                  .replace(/\s+/g, "-");
                return (
                  <span key={categorySlug}>
                    <Link
                      href={`/category/${categorySlug}`}
                      className="category-link"
                    >
                      {category.toUpperCase()}
                    </Link>
                    {index < post.categories.length - 1 && (
                      <span className="mx-1 text-gray-400">/</span>
                    )}
                  </span>
                );
              })}
            </>
          )}
          {post.date && post.categories.length > 0 && (
            <span className="text-gray-400">•</span>
          )}
          {post.date && (
            <time dateTime={post.date} className="post-date">
              {formatDate(post.date).toUpperCase()}
            </time>
          )}
        </div>

        {post.excerpt && (
          <p className="text-sm leading-relaxed text-gray-700">
            {post.excerpt}
          </p>
        )}
      </div>
    </article>
  );
}
