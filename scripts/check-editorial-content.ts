import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const workspaceRoot = process.cwd();
const postsDirectory = path.join(workspaceRoot, "content", "posts");
const publicDirectory = path.join(workspaceRoot, "public");
const mediaDirectories = [
  path.join(publicDirectory, "uploads"),
  path.join(publicDirectory, "team", "members"),
];
const maxPagesFileSize = 25 * 1024 * 1024;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const allowedPostKeys = new Set([
  "title",
  "date",
  "author",
  "excerpt",
  "cover",
  "featuredImage",
  "categories",
  "tags",
  "seoTitle",
  "seoDescription",
]);
const allowedCategories = new Set([
  "Announcement",
  "Defense",
  "Education",
  "Presentation",
  "Publication",
  "Social",
  "Travel",
  "Video",
]);
const dangerousMarkdown = [
  /<\s*(?:script|object|embed|form|style|base|link|meta)\b/i,
  /\son[a-z]+\s*=/i,
  /(?:href|src)\s*=\s*["']?\s*javascript:/i,
];
const angleWrappedMediaReference = /<((?:\/uploads|\/team\/members)\/[^>]+)>/gu;
const localMediaReference = /\/(?:uploads|team\/members)\/[^)\]}\s"'<>]+/gu;

function requiredString(
  data: Record<string, unknown>,
  key: string,
  filename: string,
): string {
  const value = data[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${filename}: ${key} must be a non-empty string`);
  }
  if (value !== value.trim()) {
    throw new Error(`${filename}: ${key} must not have surrounding whitespace`);
  }
  return value;
}

function isRealDate(value: string): boolean {
  if (!datePattern.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function stringArray(
  data: Record<string, unknown>,
  key: string,
  filename: string,
): string[] {
  const value = data[key];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`${filename}: ${key} must be an array of strings`);
  }
  return value;
}

function resolveMediaReference(reference: string, filename: string): string {
  const pathOnly = reference.split(/[?#]/, 1)[0];
  let decodedPath: string;
  try {
    decodedPath = decodeURIComponent(pathOnly);
  } catch {
    throw new Error(
      `${filename}: media reference is not valid URL encoding: ${reference}`,
    );
  }

  const resolved = path.resolve(publicDirectory, `.${decodedPath}`);
  if (!resolved.startsWith(`${publicDirectory}${path.sep}`)) {
    throw new Error(
      `${filename}: media reference escapes public/: ${reference}`,
    );
  }
  return resolved;
}

function validateMediaReference(reference: string, filename: string): void {
  const mediaPath = resolveMediaReference(reference, filename);
  if (!fs.existsSync(mediaPath) || !fs.statSync(mediaPath).isFile()) {
    throw new Error(
      `${filename}: referenced media does not exist: ${reference}`,
    );
  }
}

function validatePost(filename: string): number {
  const slug = filename.replace(/\.md$/, "");
  if (!slugPattern.test(slug)) {
    throw new Error(
      `${filename}: post filename must be a lowercase URL-safe slug`,
    );
  }

  const markdown = fs.readFileSync(path.join(postsDirectory, filename), "utf8");
  const { data, content } = matter(markdown) as {
    data: Record<string, unknown>;
    content: string;
  };
  const unexpectedKeys = Object.keys(data).filter(
    (key) => !allowedPostKeys.has(key),
  );
  if (unexpectedKeys.length > 0) {
    throw new Error(
      `${filename}: unexpected frontmatter field(s): ${unexpectedKeys.join(", ")}`,
    );
  }

  requiredString(data, "title", filename);
  requiredString(data, "author", filename);
  requiredString(data, "excerpt", filename);
  const date = requiredString(data, "date", filename);
  if (!isRealDate(date)) {
    throw new Error(`${filename}: date must be a real YYYY-MM-DD date`);
  }

  const featuredImage =
    typeof data.cover === "string" ? data.cover : data.featuredImage;
  if (
    typeof featuredImage !== "string" ||
    !featuredImage.startsWith("/uploads/")
  ) {
    throw new Error(
      `${filename}: cover or featuredImage must use /uploads/...`,
    );
  }
  validateMediaReference(featuredImage, filename);

  const categories = stringArray(data, "categories", filename);
  if (
    categories.length === 0 ||
    categories.some((category) => !allowedCategories.has(category))
  ) {
    throw new Error(
      `${filename}: categories must contain only ${[...allowedCategories].join(", ")}`,
    );
  }
  stringArray(data, "tags", filename);
  for (const optionalKey of ["seoTitle", "seoDescription"]) {
    const value = data[optionalKey];
    if (value !== undefined && typeof value !== "string") {
      throw new Error(`${filename}: ${optionalKey} must be a string`);
    }
  }

  for (const pattern of dangerousMarkdown) {
    if (pattern.test(content)) {
      throw new Error(
        `${filename}: Markdown contains an unsafe HTML construct`,
      );
    }
  }

  const references = new Set<string>();
  const markdownWithoutAngleReferences = markdown.replace(
    angleWrappedMediaReference,
    (_match, reference: string) => {
      references.add(reference);
      return "";
    },
  );
  for (const reference of markdownWithoutAngleReferences.match(
    localMediaReference,
  ) || []) {
    references.add(reference);
  }
  for (const reference of references)
    validateMediaReference(reference, filename);
  return references.size;
}

function detectMediaType(header: Buffer): string | null {
  if (
    header.length >= 3 &&
    header[0] === 0xff &&
    header[1] === 0xd8 &&
    header[2] === 0xff
  ) {
    return "jpeg";
  }
  if (
    header
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return "png";
  }
  if (
    header.subarray(0, 4).toString("ascii") === "RIFF" &&
    header.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "webp";
  }
  if (["GIF87a", "GIF89a"].includes(header.subarray(0, 6).toString("ascii"))) {
    return "gif";
  }
  if (header.subarray(0, 5).toString("ascii") === "%PDF-") return "pdf";
  return null;
}

function readMediaHeader(filename: string): Buffer {
  const descriptor = fs.openSync(filename, "r");
  try {
    const header = Buffer.alloc(12);
    const bytesRead = fs.readSync(descriptor, header, 0, header.length, 0);
    return header.subarray(0, bytesRead);
  } finally {
    fs.closeSync(descriptor);
  }
}

function validateMediaDirectory(directory: string): number {
  let count = 0;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) {
      continue;
    }
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      count += validateMediaDirectory(entryPath);
      continue;
    }
    if (!entry.isFile()) {
      throw new Error(`Unsupported media filesystem entry: ${entryPath}`);
    }

    const stats = fs.statSync(entryPath);
    if (stats.size === 0 || stats.size > maxPagesFileSize) {
      throw new Error(
        `${entryPath}: media must be non-empty and no larger than 25 MiB`,
      );
    }

    const extension = path.extname(entry.name).toLowerCase();
    const expectedType =
      extension === ".jpg" || extension === ".jpeg"
        ? "jpeg"
        : extension.slice(1);
    if (!["jpeg", "png", "webp", "gif", "pdf"].includes(expectedType)) {
      throw new Error(`${entryPath}: unsupported media extension ${extension}`);
    }

    const detectedType = detectMediaType(readMediaHeader(entryPath));
    if (detectedType !== expectedType) {
      throw new Error(
        `${entryPath}: extension does not match file contents (${detectedType || "unknown"})`,
      );
    }
    count++;
  }
  return count;
}

function main(): void {
  if (!fs.existsSync(postsDirectory)) {
    throw new Error(`Missing posts directory: ${postsDirectory}`);
  }

  const filenames = fs
    .readdirSync(postsDirectory)
    .filter((filename) => filename.endsWith(".md"))
    .sort();
  if (filenames.length === 0)
    throw new Error("Posts collection must not be empty");

  const mediaReferences = filenames.reduce(
    (total, filename) => total + validatePost(filename),
    0,
  );
  const mediaFiles = mediaDirectories.reduce((total, directory) => {
    if (!fs.existsSync(directory)) {
      throw new Error(`Missing media directory: ${directory}`);
    }
    return total + validateMediaDirectory(directory);
  }, 0);
  console.log(
    `Editorial content check passed (${filenames.length} posts, ${mediaReferences} local references, ${mediaFiles} verified media files).`,
  );
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
