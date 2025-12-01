import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

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

function getAllPostFiles(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'));
}

function parsePostFile(filename: string): MarkdownPost {
  const slug = filename.replace(/\.md$/, '');
  const fullPath = path.join(postsDirectory, filename);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || '',
    date: data.date || '',
    author: data.author || '',
    excerpt: data.excerpt || '',
    featuredImage: data.featuredImage || '',
    categories: data.categories || [],
    tags: data.tags || [],
    seoTitle: data.seoTitle || data.title || '',
    seoDescription: data.seoDescription || data.excerpt || '',
    content,
  };
}

export function getAllPosts(page = 1, limit = 10): { posts: PostPreview[]; total: number; pages: number } {
  const files = getAllPostFiles();
  const allPosts = files.map(parsePostFile);

  // Sort by date descending
  allPosts.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));

  const total = allPosts.length;
  const pages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;

  const posts = allPosts.slice(start, end).map(post => ({
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
  const filename = `${slug}.md`;
  const fullPath = path.join(postsDirectory, filename);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  return parsePostFile(filename);
}

export function getPostsByCategory(categorySlug: string, page = 1, limit = 10) {
  const files = getAllPostFiles();
  const allPosts = files.map(parsePostFile);

  // Filter by category (case-insensitive)
  const filteredPosts = allPosts.filter(post =>
    post.categories.some(cat =>
      cat.toLowerCase().replace(/\s+/g, '-') === categorySlug.toLowerCase()
    )
  );

  // Sort by date descending
  filteredPosts.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));

  const total = filteredPosts.length;
  const pages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;

  const posts = filteredPosts.slice(start, end).map(post => ({
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
  const categoryName = filteredPosts.length > 0
    ? filteredPosts[0].categories.find(cat =>
        cat.toLowerCase().replace(/\s+/g, '-') === categorySlug.toLowerCase()
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
  const files = getAllPostFiles();
  const allPosts = files.map(parsePostFile);

  // Filter by tag (case-insensitive)
  const filteredPosts = allPosts.filter(post =>
    post.tags.some(tag =>
      tag.toLowerCase().replace(/\s+/g, '-') === tagSlug.toLowerCase()
    )
  );

  // Sort by date descending
  filteredPosts.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));

  const total = filteredPosts.length;
  const pages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;

  const posts = filteredPosts.slice(start, end).map(post => ({
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
  const tagName = filteredPosts.length > 0
    ? filteredPosts[0].tags.find(tag =>
        tag.toLowerCase().replace(/\s+/g, '-') === tagSlug.toLowerCase()
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
  const files = getAllPostFiles();
  const allPosts = files.map(parsePostFile);

  const categoriesMap = new Map<string, { name: string; slug: string; count: number }>();

  allPosts.forEach(post => {
    post.categories.forEach(category => {
      const slug = category.toLowerCase().replace(/\s+/g, '-');
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
  const files = getAllPostFiles();
  const allPosts = files.map(parsePostFile);

  const tagsMap = new Map<string, { name: string; slug: string; count: number }>();

  allPosts.forEach(post => {
    post.tags.forEach(tag => {
      const slug = tag.toLowerCase().replace(/\s+/g, '-');
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
  const files = getAllPostFiles();
  return files.map(file => file.replace(/\.md$/, ''));
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(gfm)
    .use(html, { sanitize: false })
    .process(markdown);
  return result.toString();
}
