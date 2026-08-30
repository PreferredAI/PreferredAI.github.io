import fs from "node:fs";
import path from "node:path";

const MAX_FILES = 20_000;
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const outputRoot = path.resolve(process.argv[2] || "out");

interface ExportFile {
  relativePath: string;
  size: number;
}

function listFiles(directory: string): ExportFile[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) {
      throw new Error(
        `Static export contains a symbolic link: ${absolutePath}`,
      );
    }
    if (entry.isDirectory()) return listFiles(absolutePath);
    if (!entry.isFile()) {
      throw new Error(
        `Static export contains an unsupported entry: ${absolutePath}`,
      );
    }
    return [
      {
        relativePath: path
          .relative(outputRoot, absolutePath)
          .split(path.sep)
          .join("/"),
        size: fs.statSync(absolutePath).size,
      },
    ];
  });
}

function assertRequiredOutput(files: ExportFile[], requiredPath: string): void {
  if (!files.some((file) => file.relativePath === requiredPath)) {
    throw new Error(`Static export is missing ${requiredPath}`);
  }
}

function main(): void {
  if (!fs.existsSync(outputRoot) || !fs.statSync(outputRoot).isDirectory()) {
    throw new Error(`Static export directory does not exist: ${outputRoot}`);
  }

  const files = listFiles(outputRoot);
  if (files.length > MAX_FILES) {
    throw new Error(
      `Cloudflare Pages file limit exceeded: ${files.length} > ${MAX_FILES}`,
    );
  }

  const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE);
  if (oversizedFiles.length > 0) {
    throw new Error(
      `Cloudflare Pages 25 MiB file limit exceeded: ${oversizedFiles
        .map((file) => `${file.relativePath} (${file.size} bytes)`)
        .join(", ")}`,
    );
  }

  const forbiddenArtifacts = files.filter(
    (file) =>
      file.relativePath === "_worker.js" ||
      file.relativePath === "_routes.json" ||
      file.relativePath.startsWith("_worker.js/") ||
      file.relativePath.startsWith("functions/"),
  );
  if (forbiddenArtifacts.length > 0) {
    throw new Error(
      `Static export contains Worker or Pages Functions artifacts: ${forbiddenArtifacts
        .map((file) => file.relativePath)
        .join(", ")}`,
    );
  }

  for (const requiredPath of [
    "index.html",
    "404.html",
    "feed.xml",
    "robots.txt",
    "sitemap.xml",
    "_headers",
    "_redirects",
  ]) {
    assertRequiredOutput(files, requiredPath);
  }

  if (!files.some((file) => file.relativePath.startsWith("_next/static/"))) {
    throw new Error("Static export is missing Next.js static assets");
  }
  if (!files.some((file) => file.relativePath.startsWith("uploads/"))) {
    throw new Error("Static export is missing editorial media");
  }
  if (!files.some((file) => file.relativePath.startsWith("optimized/"))) {
    throw new Error("Static export is missing generated responsive images");
  }

  if (process.env.PREFERREDAI_NOINDEX === "true") {
    const indexHtml = fs.readFileSync(
      path.join(outputRoot, "index.html"),
      "utf8",
    );
    if (!/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(indexHtml)) {
      throw new Error("Preview export is missing its noindex robots metadata");
    }
  }

  const largestFile = files.reduce(
    (largest, file) => (file.size > largest.size ? file : largest),
    { relativePath: "", size: 0 },
  );
  const summary = `Static export passed: ${files.length} files; largest is ${largestFile.relativePath} (${largestFile.size} bytes).`;
  console.log(summary);

  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`, "utf8");
  }
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
