import assert from "node:assert/strict";
import fs from "node:fs";

const BLOG_PREFIXES = ["content/posts/", "public/uploads/"];
const PEOPLE_PREFIXES = ["content/people/", "public/team/members/"];

function hasPrefix(filename, prefixes) {
  return prefixes.some((prefix) => filename.startsWith(prefix));
}

export function classifyPaths(inputPaths) {
  const paths = [...new Set(inputPaths)].sort();
  const blogPaths = paths.filter((filename) =>
    hasPrefix(filename, BLOG_PREFIXES),
  );
  const peoplePaths = paths.filter((filename) =>
    hasPrefix(filename, PEOPLE_PREFIXES),
  );
  const ineligiblePaths = paths.filter(
    (filename) =>
      !hasPrefix(filename, BLOG_PREFIXES) &&
      !hasPrefix(filename, PEOPLE_PREFIXES),
  );

  let kind = "empty";
  if (ineligiblePaths.length > 0) kind = "ineligible";
  else if (blogPaths.length > 0 && peoplePaths.length > 0) kind = "mixed";
  else if (peoplePaths.length > 0) kind = "people";
  else if (blogPaths.length > 0) kind = "blog";

  return {
    eligible: paths.length > 0 && ineligiblePaths.length === 0,
    hasPeople: peoplePaths.length > 0,
    kind,
    paths,
    ineligiblePaths,
  };
}

function classifyGitHubFiles(parsed, expectedCount) {
  const pages = Array.isArray(parsed[0]) ? parsed : [parsed];
  const paths = [];
  let fileCount = 0;

  for (const page of pages) {
    for (const file of page) {
      fileCount++;
      if (typeof file.filename === "string") paths.push(file.filename);
      if (typeof file.previous_filename === "string") {
        paths.push(file.previous_filename);
      }
    }
  }

  if (
    expectedCount !== undefined &&
    (!Number.isInteger(expectedCount) || expectedCount !== fileCount)
  ) {
    paths.push(".github/incomplete-keystatic-diff");
  }

  return classifyPaths(paths);
}

function writeOutputs(result) {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) return;

  fs.appendFileSync(
    outputPath,
    `${[
      `eligible=${result.eligible}`,
      `has_people=${result.hasPeople}`,
      `kind=${result.kind}`,
      `ineligible_count=${result.ineligiblePaths.length}`,
      `ineligible_paths=${result.ineligiblePaths.join(", ")}`,
    ].join("\n")}\n`,
  );
}

function selfTest() {
  assert.deepEqual(classifyPaths(["content/posts/hello.md"]).kind, "blog");
  assert.deepEqual(
    classifyPaths([
      "content/people/alex.json",
      "public/team/members/alex/photo.jpg",
    ]).kind,
    "people",
  );
  assert.deepEqual(
    classifyPaths(["content/posts/hello.md", "content/people/alex.json"]).kind,
    "mixed",
  );
  assert.equal(
    classifyPaths(["content/posts/hello.md", "src/app/page.tsx"]).eligible,
    false,
  );
  assert.equal(classifyPaths([]).eligible, false);

  const renamed = classifyPaths([
    "content/people/alex.json",
    "src/data/alex.json",
  ]);
  assert.equal(renamed.kind, "ineligible");
  assert.deepEqual(renamed.ineligiblePaths, ["src/data/alex.json"]);

  const truncatedDiff = classifyGitHubFiles(
    [[{ filename: "content/posts/hello.md" }]],
    2,
  );
  assert.equal(truncatedDiff.kind, "ineligible");
  assert.deepEqual(truncatedDiff.ineligiblePaths, [
    ".github/incomplete-keystatic-diff",
  ]);
  console.log("Keystatic path policy self-test passed.");
}

const args = process.argv.slice(2);
if (args[0] === "--self-test") {
  selfTest();
} else if (args[0] === "--github-json" && args[1]) {
  const parsed = JSON.parse(fs.readFileSync(args[1], "utf8"));
  const expectedCountIndex = args.indexOf("--expected-count");
  const expectedCount =
    expectedCountIndex === -1
      ? undefined
      : Number(args[expectedCountIndex + 1]);
  const result = classifyGitHubFiles(parsed, expectedCount);
  writeOutputs(result);
  console.log(JSON.stringify(result, null, 2));
} else {
  throw new Error(
    "Usage: classify-keystatic-changes.mjs --self-test | --github-json <file>",
  );
}
