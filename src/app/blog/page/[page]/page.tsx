import { getAllPosts } from "@/lib/markdown-posts";
import { PostCard } from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    page: string;
  }>;
}

export default async function PaginatedBlogPage({ params }: PageProps) {
  const { page: pageParam } = await params;
  const currentPage = parseInt(pageParam, 10);

  if (isNaN(currentPage) || currentPage < 1) {
    notFound();
  }

  const { posts, total, pages } = await getAllPosts(currentPage, 12);

  if (currentPage > pages) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold uppercase tracking-wider text-gray-800">
        Blog
      </h1>

      <div className="space-y-12">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-center text-gray-600">No posts found.</p>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={pages}
        basePath="/blog"
      />
    </div>
  );
}

export async function generateStaticParams() {
  const { pages } = await getAllPosts(1, 12);

  return Array.from({ length: pages }, (_, i) => ({
    page: (i + 1).toString(),
  }));
}
