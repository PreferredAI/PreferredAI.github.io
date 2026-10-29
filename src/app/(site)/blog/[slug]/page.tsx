import { format } from "date-fns";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MermaidRenderer } from "@/components/MermaidRenderer";
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

  // Strip a leading # Title if it duplicates the post title to avoid double h1
  const normalizedContent = post.content.replace(
    /^\s*#\s+[^\n]+(?:\r?\n|$)/,
    "",
  );
  const contentHtml = await markdownToHtml(normalizedContent);

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
    <article className="mx-auto max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mb-6">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <span className="text-muted-foreground/60 group-hover:-translate-x-0.5 group-hover:text-primary transition-transform">
            ←
          </span>
          <span>Back to blog</span>
        </Link>
      </div>

      {post.categories.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          {post.categories.map((category) => {
            const categorySlug = category.toLowerCase().replace(/\s+/g, "-");
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

      <h1 className="mb-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight text-balance">
        {post.title}
      </h1>

      {(post.author || post.date) && (
        <div className="mb-8 flex flex-wrap items-center gap-2 text-xs text-muted-foreground pb-6 border-b border-border/60">
          {post.author && (
            <span>
              By{" "}
              <span className="font-medium text-foreground">{post.author}</span>
            </span>
          )}
          {post.author && post.date && (
            <span className="text-muted-foreground/40">•</span>
          )}
          {post.date && (
            <time dateTime={post.date} className="font-mono">
              {formatDate(post.date)}
            </time>
          )}
        </div>
      )}

      {post.featuredImage && (
        <div className="relative mb-8 aspect-video overflow-hidden rounded-2xl border border-border/60 bg-muted">
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

      <div
        className="prose dark:prose-invert prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
      <MermaidRenderer />
    </article>
  );
}
