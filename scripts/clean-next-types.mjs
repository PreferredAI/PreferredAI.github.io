import fs from "node:fs";
import path from "node:path";

for (const relativeDirectory of [".next/types", ".next/dev/types"]) {
  fs.rmSync(path.join(process.cwd(), relativeDirectory), {
    recursive: true,
    force: true,
  });
}
