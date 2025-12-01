import fs from 'fs';
import path from 'path';

const contentDir = path.join(process.cwd(), 'content');

interface CleanupStats {
  filesScanned: number;
  filesModified: number;
  base64ImagesRemoved: number;
  shareButtonsRemoved: number;
  excessiveNewlinesFixed: number;
  wordpressLinksRemoved: number;
}

function cleanupMarkdown(content: string): { cleaned: string; changes: number } {
  let cleaned = content;
  let changes = 0;

  // 1. Remove base64 placeholder images (multiple formats)
  // Format 1: ![](data:image...) or !(data:image...)
  const base64Pattern1 = /!\[?[^\]]*\]?\(data:image\/[^;]+;base64,[^\)]+\)\s*\n*/g;
  const base64Matches1 = content.match(base64Pattern1);
  if (base64Matches1) {
    changes += base64Matches1.length;
    cleaned = cleaned.replace(base64Pattern1, '');
  }

  // Format 2: * (data:image...) in list items
  const base64Pattern2 = /^\*\s+\(data:image\/[^;]+;base64,[^\)]+\)\s*\n*/gm;
  const base64Matches2 = cleaned.match(base64Pattern2);
  if (base64Matches2) {
    changes += base64Matches2.length;
    cleaned = cleaned.replace(base64Pattern2, '');
  }

  // Format 3: (data:image...) standalone
  const base64Pattern3 = /^\(data:image\/[^;]+;base64,[^\)]+\)\s*\n*/gm;
  const base64Matches3 = cleaned.match(base64Pattern3);
  if (base64Matches3) {
    changes += base64Matches3.length;
    cleaned = cleaned.replace(base64Pattern3, '');
  }

  // Format 4: ](url)(data:image...) after links
  const base64Pattern4 = /\]\([^)]+\)\(data:image\/[^;]+;base64,[^\)]+\)\s*\n*/g;
  const base64Matches4 = cleaned.match(base64Pattern4);
  if (base64Matches4) {
    changes += base64Matches4.length;
    cleaned = cleaned.replace(base64Pattern4, '');
  }

  // 2. Remove WordPress share buttons (multiple formats)
  // Full format: Share\n\n(twitter url)\n\n(facebook url)\n\n(pinterest url)\n\n(linkedin url)
  const shareButtonPattern1 = /Share\s*\n+\([^)]*twitter\.com\/intent\/tweet[^)]*\)\s*\n+\([^)]*facebook\.com\/sharer[^)]*\)\s*\n+\([^)]*pinterest\.com\/pin\/create[^)]*\)\s*\n+\([^)]*linkedin\.com\/shareArticle[^)]*\)/gs;
  if (shareButtonPattern1.test(cleaned)) {
    changes++;
    cleaned = cleaned.replace(shareButtonPattern1, '');
  }

  // Incomplete format: Share\n\n(single share url)
  const shareButtonPattern2 = /Share\s*\n+\([^)]*(?:twitter\.com\/intent\/tweet|facebook\.com\/sharer|pinterest\.com|linkedin\.com\/shareArticle)[^)]*\)\s*\n*/gs;
  if (shareButtonPattern2.test(cleaned)) {
    changes++;
    cleaned = cleaned.replace(shareButtonPattern2, '');
  }

  // Link format: []\n\n(share url with "Share on...")
  const shareButtonPattern3 = /\[\s*\n*\]\([^)]*(?:twitter\.com\/intent\/tweet|facebook\.com\/sharer|pinterest\.com|linkedin\.com\/shareArticle)[^)]*"Share on[^"]*"\)\s*\n*/gs;
  if (shareButtonPattern3.test(cleaned)) {
    changes++;
    cleaned = cleaned.replace(shareButtonPattern3, '');
  }

  // Simple format: (share url with "Share on...")
  const shareButtonPattern4 = /\([^)]*(?:twitter\.com\/intent\/tweet|facebook\.com\/sharer|pinterest\.com|linkedin\.com\/shareArticle)[^)]*"Share on[^"]*"\)\s*\n*/gs;
  const shareMatches4 = cleaned.match(shareButtonPattern4);
  if (shareMatches4) {
    changes += shareMatches4.length;
    cleaned = cleaned.replace(shareButtonPattern4, '');
  }

  // With closing bracket: ](share url)
  const shareButtonPattern5 = /\]\([^)]*(?:twitter\.com\/intent\/tweet|facebook\.com\/sharer|pinterest\.com|linkedin\.com\/shareArticle)[^)]*"Share on[^"]*"\)\s*\n*/gs;
  const shareMatches5 = cleaned.match(shareButtonPattern5);
  if (shareMatches5) {
    changes += shareMatches5.length;
    cleaned = cleaned.replace(shareButtonPattern5, '');
  }

  // 3. Remove WordPress metadata lines (author, date links at top)
  const wpMetaPattern = /^\*\s+\[[^\]]+\]\(https:\/\/preferred\.ai\/[^\)]+\)\s*\/\s*\[[^\]]+\]\(https:\/\/preferred\.ai\/[^\)]+\)\s*\n+/gm;
  if (wpMetaPattern.test(cleaned)) {
    changes++;
    cleaned = cleaned.replace(wpMetaPattern, '');
  }

  // 3b. Remove category links at top (e.g., * (/category/presentation/) / (/category/travel/))
  const categoryLinksPattern = /^\*\s+(?:\(\/category\/[^)]+\)\s*\/?\s*)+\n+/gm;
  if (categoryLinksPattern.test(cleaned)) {
    changes++;
    cleaned = cleaned.replace(categoryLinksPattern, '');
  }

  // 4. Remove "by [Author]" lines
  const byAuthorPattern = /^by \[[^\]]+\]\([^)]+\s+"[^"]*"\)\s*·\s*[^\n]+\n+/gm;
  if (byAuthorPattern.test(cleaned)) {
    changes++;
    cleaned = cleaned.replace(byAuthorPattern, '');
  }

  // 5. Remove duplicate heading that matches title
  const duplicateHeadingPattern = /^#\s+([^\n]+)\n+by\s+/m;
  if (duplicateHeadingPattern.test(cleaned)) {
    changes++;
    cleaned = cleaned.replace(duplicateHeadingPattern, '');
  }

  // 6. Remove broken image links stuck to end of sentences (e.g., "text!(/uploads/...)")
  // Pattern: punctuation followed immediately by !(/uploads...) without space
  const brokenImagePattern = /([.!?])(\!\([^)]*\/uploads[^)]*\))/g;
  const brokenMatches = content.match(brokenImagePattern);
  if (brokenMatches) {
    changes += brokenMatches.length;
    cleaned = cleaned.replace(brokenImagePattern, '$1');
  }

  // 7. Remove "You may also like..." section (including everything after it)
  // This section contains related posts that should be removed entirely
  const relatedPostsPattern = /####\s+You may also like\.{0,3}\s*\n[\s\S]*/gi;
  if (relatedPostsPattern.test(cleaned)) {
    changes++;
    cleaned = cleaned.replace(relatedPostsPattern, '');
  }

  // 7. Clean up excessive newlines (more than 2 consecutive)
  const excessiveNewlines = cleaned.match(/\n{3,}/g);
  if (excessiveNewlines) {
    changes += excessiveNewlines.length;
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  }

  // 8. Remove trailing whitespace
  cleaned = cleaned.replace(/[ \t]+$/gm, '');

  // 9. Ensure file ends with single newline
  cleaned = cleaned.replace(/\n*$/, '\n');

  // 10. Fix resized image references (e.g., image-1024x768.jpg -> image.jpg)
  // Pattern: /uploads/.../filename-WxH.ext -> /uploads/.../filename.ext
  const resizedImagePattern = /\/uploads\/([^)]*)-\d+x\d+\.([a-z]+)/g;
  const resizedMatches = content.match(resizedImagePattern);
  if (resizedMatches) {
    changes += resizedMatches.length;
    cleaned = cleaned.replace(resizedImagePattern, '/uploads/$1.$2');
  }

  // 11. Fix image syntax: !(/uploads...) -> ![](/uploads...)
  const brokenImageSyntax = /!\(\/uploads([^)]+)\)/g;
  const brokenSyntaxMatches = cleaned.match(brokenImageSyntax);
  if (brokenSyntaxMatches) {
    changes += brokenSyntaxMatches.length;
    cleaned = cleaned.replace(brokenImageSyntax, '![](/uploads$1)');
  }

  return { cleaned, changes };
}

async function cleanupAllMarkdown() {
  console.log('🧹 Scanning and cleaning markdown files...\n');

  const stats: CleanupStats = {
    filesScanned: 0,
    filesModified: 0,
    base64ImagesRemoved: 0,
    shareButtonsRemoved: 0,
    excessiveNewlinesFixed: 0,
    wordpressLinksRemoved: 0,
  };

  // Scan content folder and posts folder
  const folders = [
    { path: contentDir, name: 'Static pages' },
    { path: path.join(contentDir, 'posts'), name: 'Blog posts' },
  ];

  for (const folder of folders) {
    if (!fs.existsSync(folder.path)) continue;

    console.log(`📁 ${folder.name}:`);
    const files = fs.readdirSync(folder.path).filter(file => file.endsWith('.md'));

    for (const file of files) {
      const filePath = path.join(folder.path, file);
      stats.filesScanned++;

      const content = fs.readFileSync(filePath, 'utf-8');
      const { cleaned, changes } = cleanupMarkdown(content);

      if (changes > 0) {
        fs.writeFileSync(filePath, cleaned, 'utf-8');
        stats.filesModified++;
        console.log(`  ✅ ${file}: ${changes} issue(s) fixed`);
      }
    }
    console.log('');
  }

  console.log('✨ Cleanup complete!\n');
  console.log(`📊 Summary:`);
  console.log(`   Files scanned: ${stats.filesScanned}`);
  console.log(`   Files modified: ${stats.filesModified}`);
  console.log(`   Files unchanged: ${stats.filesScanned - stats.filesModified}`);
}

cleanupAllMarkdown().catch(console.error);
