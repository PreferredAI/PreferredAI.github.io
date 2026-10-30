import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const adminRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const directories = [
  "content/posts",
  "content/people",
  "content",
  "public/uploads",
  "public/team/members",
  "public/team",
];

for (const relativeDirectory of directories) {
  const target = path.join(adminRoot, relativeDirectory);
  try {
    const stats = fs.lstatSync(target);
    if (stats.isSymbolicLink()) {
      fs.unlinkSync(target);
      console.log(`Unlinked local symlink: ${relativeDirectory}`);
    }
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}
