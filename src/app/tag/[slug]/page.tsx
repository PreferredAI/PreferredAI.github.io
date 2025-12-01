import { getPostsByTag, getAllTags } from "@/lib/markdown-posts";
import { PostCard } from "@/components/PostCard";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({
    slug: tag.slug,
  }));
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getPostsByTag(slug, 1, 12);

  if (!result) {
    notFound();
  }

  const { tag, posts } = result;

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold uppercase tracking-wider text-gray-800">
          #{tag.name}
        </h1>
        {tag.description && <p className="text-gray-600">{tag.description}</p>}
      </div>

      <div className="space-y-12">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-center text-gray-600">No posts with this tag yet.</p>
      )}
    </div>
  );
}
