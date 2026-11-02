import fs from "fs";
import matter from "gray-matter";
import path from "path";

const postsDirectory = path.join(process.cwd(), "content", "posts");
const outputPath = path.join(
  process.cwd(),
  "src",
  "data",
  "generated-posts.json",
);

export interface MarkdownPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  featuredImage: string;
  featured?: boolean;
  categories: string[];
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  content: string;
}

const canonicalCategories: Record<string, string> = {
  announcement: "Announcement",
  defense: "Defense",
  education: "Education",
  presentation: "Presentation",
  publication: "Publication",
  social: "Social",
  travel: "Travel",
  video: "Video",
};

function extractExcerpt(content: string): string {
  const plainText = content
    .replace(/^#+\s+.*$/gm, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/[*_`]/g, "")
    .trim();
  const firstPara = plainText.split(/\n\s*\n/)[0] || "";
  const cleaned = firstPara.replace(/\s+/g, " ").trim();
  return cleaned.length > 200 ? `${cleaned.slice(0, 197)}...` : cleaned;
}

function trimStr(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parsePostDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return typeof value === "string" ? value.trim() : "";
}

export function buildPostsIndex(): MarkdownPost[] {
  if (!fs.existsSync(postsDirectory)) {
    throw new Error(`Missing posts directory: ${postsDirectory}`);
  }

  const files = fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"));
  if (files.length === 0) {
    throw new Error("Posts collection must contain at least one post");
  }
  const posts: MarkdownPost[] = files.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const title = trimStr(data.title);
    const excerpt = trimStr(data.excerpt) || extractExcerpt(content);
    const author = trimStr(data.author) || "Preferred.AI";
    const explicitImage = trimStr(data.cover) || trimStr(data.featuredImage);
    const contentImage =
      content.match(/!\[.*?\]\((\/uploads\/[^)]+)\)/)?.[1] || "";
    const featuredImage = explicitImage || contentImage;

    const rawCategories = Array.isArray(data.categories)
      ? data.categories.map(trimStr).filter(Boolean)
      : [];
    const categories = rawCategories.map(
      (cat) => canonicalCategories[cat.toLowerCase()] || cat,
    );
    if (categories.length === 0) {
      categories.push("Announcement");
    }

    return {
      slug,
      title,
      date: parsePostDate(data.date),
      author,
      excerpt,
      featuredImage,
      featured: Boolean(data.featured),
      categories,
      tags: Array.isArray(data.tags)
        ? data.tags.map(trimStr).filter(Boolean)
        : [],
      seoTitle: trimStr(data.seoTitle) || title,
      seoDescription: trimStr(data.seoDescription) || excerpt,
      content,
    };
  });

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

function main() {
  console.log("Generating posts index for the static build...");
  const posts = buildPostsIndex();
  let aboutContent = "";
  const aboutPath = path.join(process.cwd(), "content", "about.md");
  if (fs.existsSync(aboutPath)) {
    aboutContent = fs.readFileSync(aboutPath, "utf8");
  }

  const payload = {
    aboutContent,
    posts,
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`✅ Generated ${posts.length} posts into ${outputPath}`);
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(__filename)
) {
  main();
}
