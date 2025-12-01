import { getAllPosts } from "@/lib/markdown-posts";
import { PostCard } from "@/components/PostCard";
import Pagination from "@/components/Pagination";

export default async function Home() {
  const { posts, total, pages } = await getAllPosts(1, 10);

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

      <Pagination currentPage={1} totalPages={pages} basePath="/" />
    </div>
  );
}
