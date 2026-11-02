import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const workspaceRoot = process.cwd();
const postsDirectory = path.join(workspaceRoot, "content", "posts");

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

function parseDateValue(value: unknown): string | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.length > 0) return trimmed;
  }
  return null;
}

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

export function formatPostFile(filePath: string): boolean {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  const data = { ...parsed.data };
  let content = parsed.content;

  let changed = false;

  // 1. Clean up doubled image brackets in content
  const cleanedContent = content.replace(
    /!\[([^\]]*)\]\s*!\[\]\(([^)]+)\)/g,
    "![$1]($2)",
  );
  if (cleanedContent !== content) {
    content = cleanedContent;
    changed = true;
  }

  // 2. Normalize and quote date
  if (data.date !== undefined) {
    const parsedDate = parseDateValue(data.date);
    if (parsedDate && data.date !== parsedDate) {
      data.date = parsedDate;
      changed = true;
    }
  }

  // 3. Fallback author
  if (!data.author || typeof data.author !== "string" || !data.author.trim()) {
    data.author = "Preferred.AI";
    changed = true;
  }

  // 4. Fallback excerpt
  if (
    !data.excerpt ||
    typeof data.excerpt !== "string" ||
    !data.excerpt.trim()
  ) {
    const derived = extractExcerpt(content);
    if (derived) {
      data.excerpt = derived;
      changed = true;
    }
  }

  // 5. Normalize category casing
  if (Array.isArray(data.categories)) {
    const normalized = data.categories.map((cat: unknown) => {
      if (typeof cat === "string") {
        return canonicalCategories[cat.toLowerCase()] || cat.trim();
      }
      return String(cat);
    });
    if (JSON.stringify(normalized) !== JSON.stringify(data.categories)) {
      data.categories = normalized;
      changed = true;
    }
  }

  if (changed) {
    // Re-stringify with gray-matter
    const updated = matter.stringify(content, data);
    fs.writeFileSync(filePath, updated, "utf8");
  }

  return changed;
}

export function formatAllPosts(): number {
  if (!fs.existsSync(postsDirectory)) return 0;
  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".md"));
  let formattedCount = 0;
  for (const file of files) {
    const fullPath = path.join(postsDirectory, file);
    if (formatPostFile(fullPath)) {
      console.log(`Formatted: ${file}`);
      formattedCount++;
    }
  }
  return formattedCount;
}

function main() {
  const count = formatAllPosts();
  if (count > 0) {
    console.log(`✨ Successfully formatted ${count} post(s).`);
  } else {
    console.log("All posts already properly formatted.");
  }
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(__filename)
) {
  main();
}
