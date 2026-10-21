import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Pagination from "@/components/Pagination";
import { PostCard } from "@/components/PostCard";
import { getAllCategories, getPostsByCategory } from "@/lib/markdown-posts";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
    page: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug, page } = await params;
  const { category } = getPostsByCategory(slug, 1, 1);

  return {
    title: `${category.name} · Page ${page}`,
    description: `Posts in the ${category.name} category - page ${page}.`,
    alternates: { canonical: `/category/${slug}/page/${page}` },
  };
}

export default async function PaginatedCategoryPage({
  params,
}: CategoryPageProps) {
  const { slug, page: pageParam } = await params;
  const currentPage = Number.parseInt(pageParam, 10);

  if (Number.isNaN(currentPage) || currentPage < 2) {
    notFound();
  }

  const result = await getPostsByCategory(slug, currentPage, 12);
  if (!result || currentPage > result.pages) {
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
          Page {currentPage} of {pages} ({total} posts)
        </span>
      </div>

      <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No posts in this category.
        </p>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={pages}
        basePath={`/category/${slug}`}
      />
    </div>
  );
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  const params: { slug: string; page: string }[] = [];

  for (const category of categories) {
    const { pages } = getPostsByCategory(category.slug, 1, 12);
    for (let p = 2; p <= pages; p++) {
      params.push({ slug: category.slug, page: p.toString() });
    }
  }

  return params;
}
