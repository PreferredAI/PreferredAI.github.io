import { getAllPosts } from "@/lib/markdown-posts";
import { PostCard } from "@/components/PostCard";
import Pagination from "@/components/Pagination";

export default async function BlogPage() {
  const { posts, total, pages } = await getAllPosts(1, 12);

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

      <Pagination currentPage={1} totalPages={pages} basePath="/blog" />
    </div>
  );
}
