import Link from "next/link";
import { getAllPosts } from "@/lib/markdown-posts";
import { PostCard } from "@/components/PostCard";
import { FeaturedPostCard } from "@/components/FeaturedPostCard";
import Pagination from "@/components/Pagination";

export default async function Home() {
  const { posts, pages } = await getAllPosts(1, 10, { firstPageLimit: 9 });

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div>
      <h1 className="mb-8 text-3xl md:text-4xl font-extrabold tracking-tight text-balance text-foreground">
        Recent posts
      </h1>

      {featuredPost && (
        <div className="feed-feature">
          <FeaturedPostCard post={featuredPost} />
        </div>
      )}

      {remainingPosts.length > 0 && (
        <div className="feed-grid grid gap-8 md:grid-cols-2">
          {remainingPosts.map((post, index) => (
            <PostCard key={post.slug} post={post} priority={index < 2} />
          ))}
        </div>
      )}

      {posts.length === 0 && (
        <div className="rounded-3xl border border-border/70 bg-card/85 px-6 py-16 text-center">
          <p className="text-lg font-extrabold text-foreground">No posts yet</p>
          <p className="mx-auto mt-2 max-w-md text-pretty text-muted-foreground">
            Writing from the lab will appear here. In the meantime, browse our
            publications or read about the group.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/publications"
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-bold tracking-wide !text-white transition-all duration-200 hover:scale-105 hover:bg-primary/90 active:scale-95"
            >
              View publications
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2 text-sm font-semibold tracking-wide text-foreground transition-colors hover:bg-muted dark:hover:bg-white/5"
            >
              About the lab
            </Link>
          </div>
        </div>
      )}

      <Pagination currentPage={1} totalPages={pages} basePath="/" />
    </div>
  );
}
