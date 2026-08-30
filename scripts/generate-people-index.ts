import fs from "node:fs";
import path from "node:path";
import { buildPeopleIndex } from "./people-content";

const outputPath = path.join(
  process.cwd(),
  "src",
  "data",
  "generated-people.json",
);

function main() {
  console.log("Generating People index for the static build...");
  const people = buildPeopleIndex();
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(people, null, 2)}\n`, "utf8");
  console.log(`Generated ${people.length} People profiles into ${outputPath}`);
}

main();
