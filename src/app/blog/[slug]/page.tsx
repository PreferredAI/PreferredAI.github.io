import {
  getPostBySlug,
  markdownToHtml,
  getAllPostSlugs,
} from "@/lib/markdown-posts";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

function formatDate(dateString: string): string {
  return format(new Date(dateString), "MMMM d, yyyy");
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const contentHtml = await markdownToHtml(post.content);

  return (
    <article className="max-w-4xl">
      {post.featuredImage && (
        <div className="relative mb-8 aspect-video overflow-hidden rounded">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <h1 className="mb-6 text-3xl font-bold leading-tight md:text-4xl">
        {post.title}
      </h1>

      <div className="mb-8 flex flex-wrap items-center gap-2 text-xs">
        {post.categories.length > 0 && (
          <>
            {post.categories.map((category, index) => {
              const categorySlug = category.toLowerCase().replace(/\s+/g, "-");
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

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </article>
  );
}
