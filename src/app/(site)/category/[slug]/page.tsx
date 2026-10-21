import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Pagination from "@/components/Pagination";
import { PostCard } from "@/components/PostCard";
import { getAllCategories, getPostsByCategory } from "@/lib/markdown-posts";

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { category, total } = getPostsByCategory(slug, 1, 1);

  return {
    title: category.name,
    description: `Posts in the ${category.name} category (${total}).`,
    alternates: { canonical: `/category/${slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getPostsByCategory(slug, 1, 12);

  if (!result) {
    notFound();
  }

  const { category, posts, total, pages } = result;

  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-xs text-muted-foreground mt-1">
              {category.description}
            </p>
          )}
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          {total} {total === 1 ? "post" : "posts"}
        </span>
      </div>

      <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No posts in this category yet.
        </p>
      )}

      <Pagination
        currentPage={1}
        totalPages={pages}
        basePath={`/category/${slug}`}
      />
    </div>
  );
}
