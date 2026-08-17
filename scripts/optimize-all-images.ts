import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { getGeneratedWidths } from "../src/lib/image-widths";

const PIPELINE_VERSION = 2;
const PUBLIC_DIR = path.join(process.cwd(), "public");
const OPTIMIZED_DIR = path.join(PUBLIC_DIR, "optimized");
const MANIFEST_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "generated-image-manifest.json",
);
const CACHE_MANIFEST_PATH = path.join(
  process.cwd(),
  ".cache",
  "image-optimizer.json",
);
const DIRS_TO_SCAN = ["team", "uploads"];
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const CONCURRENCY = 4;

interface ImageManifestEntry {
  sourceWidth: number;
  sourceHeight: number;
}

interface ImageCacheEntry {
  sourceHash: string;
  widths: number[];
}

interface ImageCacheManifest {
  version: number;
  images: Record<string, ImageCacheEntry>;
}

interface OptimizationResult {
  key: string;
  entry: ImageManifestEntry;
  cacheEntry: ImageCacheEntry;
  expectedOutputs: string[];
  converted: number;
}

function toPosixPath(value: string): string {
  return value.split(path.sep).join("/");
}

function getFilesRecursively(relativeDirectory: string): string[] {
  const absoluteDirectory = path.join(PUBLIC_DIR, relativeDirectory);
  if (!fs.existsSync(absoluteDirectory)) return [];

  return fs
    .readdirSync(absoluteDirectory, { withFileTypes: true })
    .flatMap((entry) => {
      const relativePath = path.join(relativeDirectory, entry.name);
      if (entry.isDirectory()) return getFilesRecursively(relativePath);
      return IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())
        ? [toPosixPath(relativePath)]
        : [];
    });
}

function readJson<T>(filename: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(filename, "utf8"));
  } catch {
    return null;
  }
}

function readPreviousCacheManifest(): ImageCacheManifest | null {
  const cacheManifest = readJson<ImageCacheManifest>(CACHE_MANIFEST_PATH);
  if (cacheManifest) return cacheManifest;

  // One-time migration from pipeline v2 manifests that included build-only hashes.
  return readJson<ImageCacheManifest>(MANIFEST_PATH);
}

function hashFile(filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = fs.createReadStream(filename);
    stream.on("error", reject);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}

function getOutputPath(relativeSource: string, width: number): string {
  return path.join(OPTIMIZED_DIR, String(width), `${relativeSource}.webp`);
}

async function optimizeImage(
  relativeSource: string,
  previousManifest: ImageCacheManifest | null,
): Promise<OptimizationResult> {
  const absoluteSource = path.join(PUBLIC_DIR, relativeSource);
  const [metadata, sourceHash] = await Promise.all([
    sharp(absoluteSource).metadata(),
    hashFile(absoluteSource),
  ]);

  if (!metadata.width || !metadata.height) {
    throw new Error(`Could not read image dimensions: /${relativeSource}`);
  }

  const widths = getGeneratedWidths(metadata.width);
  const key = `/${relativeSource}`;
  const previous = previousManifest?.images[key];
  const sourceIsUnchanged =
    previousManifest?.version === PIPELINE_VERSION &&
    previous?.sourceHash === sourceHash &&
    previous.widths.join(",") === widths.join(",");
  const expectedOutputs: string[] = [];
  let converted = 0;

  for (const width of widths) {
    const outputPath = getOutputPath(relativeSource, width);
    expectedOutputs.push(outputPath);

    if (sourceIsUnchanged && fs.existsSync(outputPath)) continue;

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    await sharp(absoluteSource)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82, alphaQuality: 90, effort: 4 })
      .toFile(outputPath);
    converted++;
  }

  return {
    key,
    expectedOutputs,
    converted,
    entry: {
      sourceWidth: metadata.width,
      sourceHeight: metadata.height,
    },
    cacheEntry: {
      sourceHash,
      widths,
    },
  };
}

async function mapWithConcurrency<T, R>(
  values: T[],
  worker: (value: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(values.length);
  let nextIndex = 0;

  async function runWorker() {
    while (nextIndex < values.length) {
      const index = nextIndex++;
      results[index] = await worker(values[index]);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, values.length) }, runWorker),
  );
  return results;
}

function removeStaleOutputs(expectedOutputs: Set<string>): number {
  if (!fs.existsSync(OPTIMIZED_DIR)) return 0;
  let removed = 0;

  function visitDirectory(directory: string) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        visitDirectory(absolutePath);
        if (fs.readdirSync(absolutePath).length === 0)
          fs.rmdirSync(absolutePath);
      } else if (!expectedOutputs.has(absolutePath)) {
        fs.unlinkSync(absolutePath);
        removed++;
      }
    }
  }

  visitDirectory(OPTIMIZED_DIR);
  return removed;
}

async function main() {
  const allImages = DIRS_TO_SCAN.flatMap(getFilesRecursively).sort((a, b) =>
    a.localeCompare(b),
  );
  const previousManifest = readPreviousCacheManifest();

  console.log(`Optimizing ${allImages.length} source images...`);
  const startedAt = Date.now();
  const results = await mapWithConcurrency(allImages, (relativeSource) =>
    optimizeImage(relativeSource, previousManifest),
  );

  const images = Object.fromEntries(
    results.map(({ key, entry }) => [key, entry]),
  );
  const cacheImages = Object.fromEntries(
    results.map(({ key, cacheEntry }) => [key, cacheEntry]),
  );
  const expectedOutputs = new Set(
    results.flatMap(({ expectedOutputs: outputPaths }) => outputPaths),
  );
  const removed = removeStaleOutputs(expectedOutputs);
  const converted = results.reduce(
    (total, result) => total + result.converted,
    0,
  );

  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  fs.writeFileSync(
    MANIFEST_PATH,
    `${JSON.stringify({ version: PIPELINE_VERSION, images }, null, 2)}\n`,
    "utf8",
  );
  fs.mkdirSync(path.dirname(CACHE_MANIFEST_PATH), { recursive: true });
  fs.writeFileSync(
    CACHE_MANIFEST_PATH,
    `${JSON.stringify(
      { version: PIPELINE_VERSION, images: cacheImages },
      null,
      2,
    )}\n`,
    "utf8",
  );

  const duration = ((Date.now() - startedAt) / 1000).toFixed(2);
  console.log(
    `Image pipeline finished in ${duration}s: ${converted} converted, ${expectedOutputs.size - converted} reused, ${removed} stale removed.`,
  );
}

main().catch((error) => {
  console.error("Image optimization failed:", error);
  process.exitCode = 1;
});
