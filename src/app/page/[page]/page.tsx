import { getAllPosts } from "@/lib/markdown-posts";
import { PostCard } from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    page: string;
  }>;
}

export default async function PaginatedHomePage({ params }: PageProps) {
  const { page: pageParam } = await params;
  const currentPage = parseInt(pageParam, 10);

  if (isNaN(currentPage) || currentPage < 1) {
    notFound();
  }

  const { posts, total, pages } = await getAllPosts(currentPage, 10);

  if (currentPage > pages) {
    notFound();
  }

  return (
    <div>
      <h2 className="mb-8 text-xl font-normal uppercase tracking-wide text-gray-600">
        Recent Posts
      </h2>

      <div className="grid gap-8 md:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-center text-gray-600">No posts available yet.</p>
      )}

      <Pagination currentPage={currentPage} totalPages={pages} basePath="/" />
    </div>
  );
}

export async function generateStaticParams() {
  const { pages } = await getAllPosts(1, 10);

  return Array.from({ length: pages }, (_, i) => ({
    page: (i + 1).toString(),
  }));
}
