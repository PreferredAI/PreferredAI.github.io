import Pagination from "@/components/Pagination";
import { PostCard } from "@/components/PostCard";
import { getAllPosts } from "@/lib/markdown-posts";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    page: string;
  }>;
}

export default async function PaginatedHomePage({ params }: PageProps) {
  const { page: pageParam } = await params;
  const currentPage = Number.parseInt(pageParam, 10);

  if (Number.isNaN(currentPage) || currentPage < 1) {
    notFound();
  }

  const { posts, pages } = await getAllPosts(currentPage, 10, {
    firstPageLimit: 9,
  });

  if (currentPage > pages) {
    notFound();
  }

  return (
    <div>
      <h2 className="mb-8 text-xl font-normal uppercase tracking-wide text-muted-foreground">
        Recent Posts
      </h2>

      <div className="grid gap-8 md:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-center text-muted-foreground">
          No posts available yet.
        </p>
      )}

      <Pagination currentPage={currentPage} totalPages={pages} basePath="/" />
    </div>
  );
}

export async function generateStaticParams() {
  const { pages } = await getAllPosts(1, 10, { firstPageLimit: 9 });

  return Array.from({ length: pages }, (_, i) => ({
    page: (i + 1).toString(),
  }));
}
