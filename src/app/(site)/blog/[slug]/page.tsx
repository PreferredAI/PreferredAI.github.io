import { format } from "date-fns";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllPostSlugs,
  getPostBySlug,
  markdownToHtml,
} from "@/lib/markdown-posts";
import { siteName, siteUrl } from "@/lib/site";

function formatDate(dateString: string): string {
  return format(new Date(dateString), "MMMM d, yyyy");
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post not found" };
  }

  const url = `/blog/${slug}`;
  const images = post.featuredImage ? [post.featuredImage] : undefined;
  // seoTitle bakes in "- Preferred.AI"; strip it so the global title template
  // doesn't double the brand ("Title - Preferred.AI · Preferred.AI").
  const title = post.seoTitle
    .replace(/\s*[-–|]\s*Preferred\.AI\s*$/i, "")
    .trim();

  return {
    title,
    description: post.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description: post.seoDescription,
      url,
      siteName,
      publishedTime: post.date || undefined,
      authors: post.author ? [post.author] : undefined,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.seoDescription,
      images,
    },
  };
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

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription,
    datePublished: post.date || undefined,
    author: post.author ? { "@type": "Person", name: post.author } : undefined,
    image: post.featuredImage ? `${siteUrl}${post.featuredImage}` : undefined,
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
    mainEntityOfPage: `${siteUrl}/blog/${slug}`,
  };

  return (
    <article className="max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingJsonLd),
        }}
      />
      {post.featuredImage && (
        <div className="relative mb-8 aspect-video overflow-hidden rounded">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <h1 className="mb-6 text-3xl font-bold leading-tight md:text-4xl">
        {post.title}
      </h1>

      <div className="mb-8 flex flex-wrap items-center gap-2 text-xs">
        {post.categories.length > 0 &&
          post.categories.map((category, index) => {
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
