import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/PostCard";
import { getAllCategories, getPostsByCategory } from "@/lib/markdown-posts";

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { category, total } = getPostsByCategory(slug, 1, 1);

  return {
    title: category.name,
    description: `Posts in the ${category.name} category (${total}).`,
    alternates: { canonical: `/category/${slug}` },
  };
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
        <h1 className="mb-2 text-2xl font-bold uppercase tracking-wider text-foreground">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-muted-foreground">{category.description}</p>
        )}
      </div>

      <div className="space-y-12">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-center text-muted-foreground">
          No posts in this category yet.
        </p>
      )}
    </div>
  );
}
