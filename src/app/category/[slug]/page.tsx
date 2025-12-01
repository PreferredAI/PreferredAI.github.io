import { getPostsByCategory, getAllCategories } from "@/lib/markdown-posts";
import { PostCard } from "@/components/PostCard";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getPostsByCategory(slug, 1, 12);

  if (!result) {
    notFound();
  }

  const { category, posts } = result;

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold uppercase tracking-wider text-gray-800">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-gray-600">{category.description}</p>
        )}
      </div>

      <div className="space-y-12">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-center text-gray-600">
          No posts in this category yet.
        </p>
      )}
    </div>
  );
}
