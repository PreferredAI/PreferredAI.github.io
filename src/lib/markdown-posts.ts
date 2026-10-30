import fs from "fs";
import matter from "gray-matter";
import path from "path";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import gfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import generatedPostsData from "@/data/generated-posts.json";
import { markdownSanitizeSchema } from "./markdown-sanitize-schema";
import rehypeFigure from "./rehype-figure";
import rehypeResponsiveImages from "./rehype-responsive-images";
import rehypeSafeEmbeds from "./rehype-safe-embeds";

const postsDirectory = path.join(process.cwd(), "content", "posts");

export interface MarkdownPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  featuredImage: string;
  categories: string[];
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  content: string;
}

export interface PostPreview {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  featuredImage: string;
  categories: string[];
  tags: string[];
}

function parsePostFile(filename: string): MarkdownPost {
  const fullPath = path.join(postsDirectory, filename);

  const stats = fs.statSync(fullPath);
  const mtime = stats.mtimeMs;

  const cached = postCache.get(filename);
  if (cached && cached.mtime === mtime) {
    return cached.post;
  }

  const slug = filename.replace(/\.md$/, "");
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const post: MarkdownPost = {
    slug,
    title: data.title || "",
    date: data.date || "",
    author: data.author || "",
    excerpt: data.excerpt || "",
    featuredImage: data.cover || data.featuredImage || "",
    categories: data.categories || [],
    tags: data.tags || [],
    seoTitle: data.seoTitle || data.title || "",
    seoDescription: data.seoDescription || data.excerpt || "",
    content,
  };

  postCache.set(filename, { post, mtime });
  return post;
}

interface CacheEntry {
  post: MarkdownPost;
  mtime: number;
}

const postCache = new Map<string, CacheEntry>();

export function loadAllPosts(): MarkdownPost[] {
  try {
    if (fs.existsSync?.(postsDirectory)) {
      const files = fs
        .readdirSync(postsDirectory)
        .filter((file) => file.endsWith(".md"));
      if (files.length > 0) {
        const diskPosts = files.map(parsePostFile);
        diskPosts.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        return diskPosts;
      }
    }
  } catch {
    // Next.js may evaluate the module from a bundle without direct source files.
  }

  const posts =
    (generatedPostsData as { posts?: MarkdownPost[] }).posts ||
    (generatedPostsData as unknown as MarkdownPost[]);
  return posts;
}

export function getAllPosts(
  page = 1,
  limit = 10,
  options?: { firstPageLimit?: number },
): { posts: PostPreview[]; total: number; pages: number } {
  const allPosts = loadAllPosts();

  const total = allPosts.length;
  const firstPageLimit = options?.firstPageLimit ?? limit;

  let pages = 1;
  if (total > firstPageLimit) {
    pages = 1 + Math.ceil((total - firstPageLimit) / limit);
  }

  let start = 0;
  let end = limit;

  if (page === 1) {
    start = 0;
    end = firstPageLimit;
  } else {
    start = firstPageLimit + (page - 2) * limit;
    end = start + limit;
  }

  const posts = allPosts.slice(start, end).map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    author: post.author,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    categories: post.categories,
    tags: post.tags,
  }));

  return { posts, total, pages };
}

export function getPostBySlug(slug: string): MarkdownPost | null {
  try {
    const filename = `${slug}.md`;
    const fullPath = path.join(postsDirectory, filename);

    if (fs.existsSync?.(fullPath)) {
      return parsePostFile(filename);
    }
  } catch {
    // Edge / Worker runtimes do not have disk files
  }

  const allPosts = loadAllPosts();
  return allPosts.find((p) => p.slug === slug) || null;
}

export function getPostsByCategory(categorySlug: string, page = 1, limit = 10) {
  const allPosts = loadAllPosts();

  // Filter by category (case-insensitive)
  const filteredPosts = allPosts.filter((post) =>
    post.categories.some(
      (cat) =>
        cat.toLowerCase().replace(/\s+/g, "-") === categorySlug.toLowerCase(),
    ),
  );

  const total = filteredPosts.length;
  const pages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;

  const posts = filteredPosts.slice(start, end).map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    author: post.author,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    categories: post.categories,
    tags: post.tags,
  }));

  // Find category name
  const categoryName =
    filteredPosts.length > 0
      ? filteredPosts[0].categories.find(
          (cat) =>
            cat.toLowerCase().replace(/\s+/g, "-") ===
            categorySlug.toLowerCase(),
        ) || categorySlug
      : categorySlug;

  return {
    category: { name: categoryName, slug: categorySlug, description: null },
    posts,
    total,
    pages,
  };
}

export function getPostsByTag(tagSlug: string, page = 1, limit = 10) {
  const allPosts = loadAllPosts();

  // Filter by tag (case-insensitive)
  const filteredPosts = allPosts.filter((post) =>
    post.tags.some(
      (tag) => tag.toLowerCase().replace(/\s+/g, "-") === tagSlug.toLowerCase(),
    ),
  );

  const total = filteredPosts.length;
  const pages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;

  const posts = filteredPosts.slice(start, end).map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    author: post.author,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    categories: post.categories,
    tags: post.tags,
  }));

  // Find tag name
  const tagName =
    filteredPosts.length > 0
      ? filteredPosts[0].tags.find(
          (tag) =>
            tag.toLowerCase().replace(/\s+/g, "-") === tagSlug.toLowerCase(),
        ) || tagSlug
      : tagSlug;

  return {
    tag: { name: tagName, slug: tagSlug, description: null },
    posts,
    total,
    pages,
  };
}

export function getAllCategories() {
  const allPosts = loadAllPosts();

  const categoriesMap = new Map<
    string,
    { name: string; slug: string; count: number }
  >();

  allPosts.forEach((post) => {
    post.categories.forEach((category) => {
      const slug = category.toLowerCase().replace(/\s+/g, "-");
      if (categoriesMap.has(slug)) {
        categoriesMap.get(slug)!.count++;
      } else {
        categoriesMap.set(slug, { name: category, slug, count: 1 });
      }
    });
  });

  return Array.from(categoriesMap.values()).sort((a, b) => b.count - a.count);
}

export function getAllTags() {
  const allPosts = loadAllPosts();

  const tagsMap = new Map<
    string,
    { name: string; slug: string; count: number }
  >();

  allPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      const slug = tag.toLowerCase().replace(/\s+/g, "-");
      if (tagsMap.has(slug)) {
        tagsMap.get(slug)!.count++;
      } else {
        tagsMap.set(slug, { name: tag, slug, count: 1 });
      }
    });
  });

  return Array.from(tagsMap.values()).sort((a, b) => b.count - a.count);
}

export function getAllPostSlugs(): string[] {
  const allPosts = loadAllPosts();
  return allPosts.map((p) => p.slug);
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(gfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSafeEmbeds)
    .use(rehypeResponsiveImages)
    .use(rehypeFigure)
    .use(rehypeSanitize, markdownSanitizeSchema)
    .use(rehypeKatex, {
      trust: false,
      strict: "error",
    })
    .use(rehypeStringify)
    .process(markdown);
  return result.toString();
}
