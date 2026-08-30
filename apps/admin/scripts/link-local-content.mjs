import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const adminRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const contentRoot = path.resolve(adminRoot, "..", "..");
const directories = [
  "content/posts",
  "content/people",
  "public/uploads",
  "public/team/members",
];

function fail(message) {
  throw new Error(
    `${message}\nRestore the editorial directories in the workspace root.`,
  );
}

for (const relativeDirectory of directories) {
  const source = path.join(contentRoot, relativeDirectory);
  const destination = path.join(adminRoot, relativeDirectory);

  if (!fs.existsSync(source) || !fs.statSync(source).isDirectory()) {
    fail(`Missing editor content directory: ${source}`);
  }

  let destinationStats;
  try {
    destinationStats = fs.lstatSync(destination);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  if (destinationStats) {
    if (!destinationStats.isSymbolicLink()) {
      fail(`Refusing to replace non-symlink editor path: ${destination}`);
    }
    fs.unlinkSync(destination);
  }

  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.symlinkSync(source, destination, "dir");
}

console.log(
  `Linked local Keystatic storage to workspace content in ${contentRoot}.`,
);
