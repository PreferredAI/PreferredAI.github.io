import CategoryFilterBar from "@/components/CategoryFilterBar";
import Pagination from "@/components/Pagination";
import { PostCard } from "@/components/PostCard";
import { getAllPosts } from "@/lib/markdown-posts";

export default async function BlogPage() {
  const { posts, pages } = await getAllPosts(1, 12);

  return (
    <div>
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h1 className="text-xs font-semibold uppercase tracking-[0.08em] text-primary select-none">
          Blog Posts
        </h1>
        <span className="text-xs font-mono text-muted-foreground">
          All articles & updates
        </span>
      </div>

      <CategoryFilterBar allHref="/blog" className="mb-6" />

      <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <PostCard key={post.slug} post={post} priority={index < 3} />
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No posts found.
        </p>
      )}

      <Pagination currentPage={1} totalPages={pages} basePath="/blog" />
    </div>
  );
}
