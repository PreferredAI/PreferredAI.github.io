import fs from "fs";
import path from "path";
import sharp from "sharp";

const TARGET_WIDTHS = [256, 384, 640, 1080, 1920, 3840];
const PUBLIC_DIR = path.join(process.cwd(), "public");

// Directories to scan recursively for images
const DIRS_TO_SCAN = ["team", "uploads"];
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png"];

function getFilesRecursively(dir: string, fileList: string[] = []): string[] {
  const absoluteDir = path.join(PUBLIC_DIR, dir);
  if (!fs.existsSync(absoluteDir)) return fileList;

  const files = fs.readdirSync(absoluteDir);
  for (const file of files) {
    const relativePath = path.join(dir, file);
    const absolutePath = path.join(PUBLIC_DIR, relativePath);
    if (fs.statSync(absolutePath).isDirectory()) {
      getFilesRecursively(relativePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (IMAGE_EXTENSIONS.includes(ext)) {
        fileList.push(relativePath);
      }
    }
  }
  return fileList;
}

async function optimizeImage(srcRelativePath: string) {
  const srcAbsolutePath = path.join(PUBLIC_DIR, srcRelativePath);
  const srcStats = fs.statSync(srcAbsolutePath);
  const srcMtime = srcStats.mtimeMs;

  for (const width of TARGET_WIDTHS) {
    const destRelativePath = path.join("optimized", String(width), srcRelativePath);
    const destAbsolutePath = path.join(PUBLIC_DIR, destRelativePath);

    // Incremental cache check: Skip if optimized file exists and is newer than source
    if (fs.existsSync(destAbsolutePath)) {
      const destStats = fs.statSync(destAbsolutePath);
      if (destStats.mtimeMs >= srcMtime) {
        continue;
      }
    }

    // Create target directory if it doesn't exist
    const destDir = path.dirname(destAbsolutePath);
    fs.mkdirSync(destDir, { recursive: true });

    try {
      const ext = path.extname(srcRelativePath).toLowerCase();
      const image = sharp(srcAbsolutePath);

      // Perform high-quality resizing
      // withoutEnlargement: true ensures we don't upscale small original images
      let transformer = image.resize({ width, withoutEnlargement: true });

      if (ext === ".png") {
        transformer = transformer.png({ compressionLevel: 8, palette: true });
      } else {
        transformer = transformer.jpeg({ quality: 80, progressive: true });
      }

      await transformer.toFile(destAbsolutePath);
      // console.log(`✅ Optimized: /${srcRelativePath} ➡️ /${destRelativePath}`);
    } catch (error) {
      console.error(`❌ Failed to optimize /${srcRelativePath} at width ${width}:`, error);
    }
  }
}

async function main() {
  console.log("🚀 Scanning public directories for image optimization...");
  let allImages: string[] = [];
  for (const dir of DIRS_TO_SCAN) {
    allImages = allImages.concat(getFilesRecursively(dir));
  }

  console.log(`🔍 Found ${allImages.length} images to optimize.`);

  const startTime = Date.now();
  for (const relativePath of allImages) {
    await optimizeImage(relativePath);
  }
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`🎉 Image optimization pipeline finished in ${duration}s.`);
}

main().catch((err) => {
  console.error("FATAL: Image optimization script failed:", err);
  process.exit(1);
});
