import { getAllPosts } from "@/lib/markdown-posts";
import { PostCard } from "@/components/PostCard";
import Pagination from "@/components/Pagination";

export default async function BlogPage() {
  const { posts, pages } = await getAllPosts(1, 12);

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold uppercase tracking-wider text-foreground">
        Blog
      </h1>

      <div className="space-y-12">
        {posts.map((post, index) => (
          <PostCard key={post.slug} post={post} priority={index < 2} />
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-center text-muted-foreground">No posts found.</p>
      )}

      <Pagination currentPage={1} totalPages={pages} basePath="/blog" />
    </div>
  );
}
