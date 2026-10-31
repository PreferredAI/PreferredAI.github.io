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
  categories: string[];
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  content: string;
}

function trimStr(value: unknown): string {
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
    const excerpt = trimStr(data.excerpt);

    return {
      slug,
      title,
      date: trimStr(data.date),
      author: trimStr(data.author),
      excerpt,
      featuredImage: trimStr(data.cover) || trimStr(data.featuredImage),
      categories: Array.isArray(data.categories)
        ? data.categories.map(trimStr).filter(Boolean)
        : [],
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
