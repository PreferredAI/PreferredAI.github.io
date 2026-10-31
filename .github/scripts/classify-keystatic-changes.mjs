import assert from "node:assert/strict";
import fs from "node:fs";

const BLOG_PREFIXES = ["content/posts/", "public/uploads/"];
const PEOPLE_PREFIXES = ["content/people/", "public/team/members/"];

function hasPrefix(filename, prefixes) {
  return prefixes.some((prefix) => filename.startsWith(prefix));
}

function extractSlugs(paths) {
  const slugs = new Set();
  for (const filename of paths) {
    const postMatch = filename.match(/^content\/posts\/([^/]+)\.md$/);
    if (postMatch) {
      slugs.add(postMatch[1]);
      continue;
    }
    const uploadMatch = filename.match(/^public\/uploads\/([^/]+)\//);
    if (uploadMatch && !/^\d{4}$/.test(uploadMatch[1])) {
      slugs.add(uploadMatch[1]);
      continue;
    }
    const personMatch = filename.match(/^content\/people\/([^/]+)\.json$/);
    if (personMatch) {
      slugs.add(personMatch[1]);
      continue;
    }
    const memberPhotoMatch = filename.match(
      /^public\/team\/members\/([^/]+)\//,
    );
    if (memberPhotoMatch) {
      slugs.add(memberPhotoMatch[1]);
    }
  }
  return [...slugs].sort();
}

function buildSummaryTitle(kind, slugs) {
  const prefixByKind = {
    blog: "Keystatic (Blog)",
    people: "Keystatic (People)",
    mixed: "Keystatic (Editorial)",
    ineligible: "Keystatic (Manual review)",
    empty: "Keystatic",
  };
  const prefix = prefixByKind[kind] || "Keystatic";
  if (slugs.length === 0) {
    return `${prefix}: publish changes`;
  }
  const shown = slugs.slice(0, 3).join(", ");
  const suffix = slugs.length > 3 ? ` (+${slugs.length - 3} more)` : "";
  return `${prefix}: ${shown}${suffix}`;
}

export function classifyPaths(inputPaths) {
  const paths = [...new Set(inputPaths.filter(Boolean))].sort();
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

  const eligible = paths.length > 0 && ineligiblePaths.length === 0;
  const hasPeople = peoplePaths.length > 0;
  const slugs = extractSlugs(paths);

  return {
    autoMergeBlog: eligible && kind === "blog",
    eligible,
    hasPeople,
    kind,
    paths,
    ineligiblePaths,
    slugs,
    summaryTitle: buildSummaryTitle(kind, slugs),
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

  const safeTitle = result.summaryTitle.replace(/[\r\n]+/g, " ").trim();
  fs.appendFileSync(
    outputPath,
    `${[
      `auto_merge_blog=${result.autoMergeBlog}`,
      `eligible=${result.eligible}`,
      `has_people=${result.hasPeople}`,
      `kind=${result.kind}`,
      `ineligible_count=${result.ineligiblePaths.length}`,
      `ineligible_paths=${result.ineligiblePaths.join(", ")}`,
      `summary_title=${safeTitle}`,
    ].join("\n")}\n`,
  );
}

function selfTest() {
  const blogOnly = classifyPaths([
    "content/posts/hello.md",
    "public/uploads/hello/cover.jpg",
  ]);
  assert.equal(blogOnly.kind, "blog");
  assert.equal(blogOnly.eligible, true);
  assert.equal(blogOnly.hasPeople, false);
  assert.equal(blogOnly.autoMergeBlog, true);
  assert.equal(blogOnly.summaryTitle, "Keystatic (Blog): hello");

  const peopleOnly = classifyPaths([
    "content/people/alex.json",
    "public/team/members/alex/photo.jpg",
  ]);
  assert.equal(peopleOnly.kind, "people");
  assert.equal(peopleOnly.eligible, true);
  assert.equal(peopleOnly.hasPeople, true);
  assert.equal(peopleOnly.autoMergeBlog, false);
  assert.equal(peopleOnly.summaryTitle, "Keystatic (People): alex");

  const mixed = classifyPaths([
    "content/posts/hello.md",
    "content/people/alex.json",
  ]);
  assert.equal(mixed.kind, "mixed");
  assert.equal(mixed.eligible, true);
  assert.equal(mixed.hasPeople, true);
  assert.equal(mixed.autoMergeBlog, false);
  assert.equal(mixed.summaryTitle, "Keystatic (Editorial): alex, hello");

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
} else if (args[0] === "--paths-file" && args[1]) {
  const lines = fs
    .readFileSync(args[1], "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const result = classifyPaths(lines);
  writeOutputs(result);
  console.log(JSON.stringify(result, null, 2));
} else {
  throw new Error(
    "Usage: classify-keystatic-changes.mjs --self-test | --github-json <file> | --paths-file <file>",
  );
}
