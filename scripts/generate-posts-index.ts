import fs from "fs";
import path from "path";
import matter from "gray-matter";

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

export function buildPostsIndex(): MarkdownPost[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const files = fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"));
  const posts: MarkdownPost[] = files.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
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
  });

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

function main() {
  console.log("📝 Generating posts index for server/worker runtime...");
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
  fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2), "utf8");
  console.log(`✅ Generated ${posts.length} posts into ${outputPath}`);
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(__filename)
) {
  main();
}
