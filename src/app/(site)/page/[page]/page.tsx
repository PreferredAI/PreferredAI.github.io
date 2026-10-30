import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryFilterBar from "@/components/CategoryFilterBar";
import Pagination from "@/components/Pagination";
import { PostCard } from "@/components/PostCard";
import { getAllPosts } from "@/lib/markdown-posts";

interface PageProps {
  params: Promise<{
    page: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { page } = await params;
  return {
    title: `Posts · Page ${page}`,
    alternates: {
      canonical: `/page/${page}`,
    },
  };
}

export default async function PaginatedHomePage({ params }: PageProps) {
  const { page: pageParam } = await params;
  const currentPage = Number.parseInt(pageParam, 10);

  if (Number.isNaN(currentPage) || currentPage < 2) {
    notFound();
  }

  const { posts, pages } = await getAllPosts(currentPage, 12, {
    firstPageLimit: 10,
  });

  if (currentPage > pages) {
    notFound();
  }

  return (
    <div>
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h1 className="text-xs font-semibold uppercase tracking-[0.08em] text-primary select-none">
          Recent Posts
        </h1>
        <span className="text-xs font-mono text-muted-foreground">
          Page {currentPage} of {pages}
        </span>
      </div>

      <CategoryFilterBar allHref="/" className="mb-6" />

      <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No posts available yet.
        </p>
      )}

      <Pagination currentPage={currentPage} totalPages={pages} basePath="/" />
    </div>
  );
}

export async function generateStaticParams() {
  const { pages } = await getAllPosts(1, 12, { firstPageLimit: 10 });
  if (pages <= 1) return [];

  return Array.from({ length: pages - 1 }, (_, i) => ({
    page: (i + 2).toString(),
  }));
}
