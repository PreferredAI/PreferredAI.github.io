import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  getGeneratedImagePath,
  imageManifest,
} from "../src/lib/image-manifest";
import { getGeneratedWidths } from "../src/lib/image-widths";
import { markdownToHtml } from "../src/lib/markdown-posts";

const hostileMarkdown = `
# Safe heading

<script>alert("xss")</script>
<img src="https://example.com/image.jpg" onerror="alert('xss')" srcset="javascript:alert('xss') 1x">
<a href="javascript:alert('xss')">unsafe link</a>
<iframe src="https://evil.example/embed/video" onload="alert('xss')"></iframe>
<iframe src="https://www.youtube.com/embed/abc_123?feature=oembed" onload="alert('xss')"></iframe>
`;

async function main() {
  const hostileHtml = await markdownToHtml(hostileMarkdown);

  assert.match(hostileHtml, /<h1>Safe heading<\/h1>/);
  assert.match(hostileHtml, /https:\/\/www\.youtube\.com\/embed\/abc_123/);
  assert.match(hostileHtml, /class="video-embed"/);
  assert.match(hostileHtml, /loading="lazy"/);
  assert.match(
    hostileHtml,
    /sandbox="allow-scripts allow-same-origin allow-presentation"/,
  );
  assert.doesNotMatch(hostileHtml, /<script|onerror|onload|evil\.example/i);
  assert.doesNotMatch(hostileHtml, /(?:href|src)=["']javascript:/i);

  const postsDirectory = path.join(process.cwd(), "content", "posts");
  const postsWithEmbeds = fs
    .readdirSync(postsDirectory)
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) =>
      fs.readFileSync(path.join(postsDirectory, filename), "utf8"),
    )
    .filter((markdown) => markdown.includes("<iframe"));

  const renderedPosts = await Promise.all(postsWithEmbeds.map(markdownToHtml));
  for (const html of renderedPosts) {
    assert.match(html, /<iframe[^>]+class="video-embed"/);
    assert.doesNotMatch(html, /frameborder=|width="720"|height="405"/i);
  }

  const responsiveImage = Object.entries(imageManifest.images).find(([src]) =>
    src.startsWith("/uploads/"),
  );
  assert.ok(responsiveImage, "Expected an uploaded image in the manifest");
  const [imageSrc, imageEntry] = responsiveImage;
  const responsiveHtml = await markdownToHtml(`![Example](${imageSrc})`);
  const largestWidth = getGeneratedWidths(imageEntry.sourceWidth).at(-1);
  assert.ok(largestWidth, "Expected at least one generated image width");
  assert.match(
    responsiveHtml,
    new RegExp(getGeneratedImagePath(imageSrc, largestWidth)),
  );
  assert.match(responsiveHtml, /srcset="[^"]+ \d+w/);
  assert.match(responsiveHtml, /sizes="[^"]+"/);
  assert.match(responsiveHtml, /decoding="async"/);
  assert.match(responsiveHtml, new RegExp(`width="${imageEntry.sourceWidth}"`));
  assert.match(
    responsiveHtml,
    new RegExp(`height="${imageEntry.sourceHeight}"`),
  );

  console.log(
    `Markdown security check passed (${renderedPosts.length} articles with compatible embeds).`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
