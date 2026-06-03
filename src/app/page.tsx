import { getAllPosts } from "@/lib/markdown-posts";
import { PostCard } from "@/components/PostCard";
import Pagination from "@/components/Pagination";

export default async function Home() {
  const { posts, pages } = await getAllPosts(1, 10);

  return (
    <div>
      <h1 className="mb-8 text-xl font-normal uppercase tracking-wide text-muted-foreground">
        Recent Posts
      </h1>

      <div className="grid gap-8 md:grid-cols-2">
        {posts.map((post, index) => (
          <PostCard key={post.slug} post={post} priority={index < 2} />
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-center text-muted-foreground">No posts available yet.</p>
      )}

      <Pagination currentPage={1} totalPages={pages} basePath="/" />
    </div>
  );
}
