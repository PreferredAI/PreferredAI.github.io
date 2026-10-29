import fs from "fs";
import type { Metadata } from "next";
import path from "path";
import generatedPostsData from "@/data/generated-posts.json";
import { markdownToHtml } from "@/lib/markdown-posts";

export const metadata: Metadata = {
  title: "About",
  description:
    "Preferred.AI is a research undertaking at the Singapore Management University (SMU) – School of Computing and Information Systems (SCIS) led by Hady W. Lauw.",
};

async function getAboutContent() {
  const filePath = path.join(process.cwd(), "content", "about.md");

  try {
    if (fs.existsSync?.(filePath)) {
      const fileContents = fs.readFileSync(filePath, "utf8");
      return await markdownToHtml(fileContents);
    }
  } catch {
    // Next.js may evaluate the module from a bundle without direct source files.
  }

  const aboutMd =
    (generatedPostsData as { aboutContent?: string }).aboutContent || "";
  if (aboutMd) {
    return await markdownToHtml(aboutMd);
  }

  return "<h1>About</h1><p>Content not available.</p>";
}

export default async function AboutPage() {
  const content = await getAboutContent();

  return (
    <div className="max-w-5xl mx-auto bg-card border border-border/80 rounded-2xl p-6 sm:p-10 shadow-xs">
      <div
        className="prose dark:prose-invert prose-neutral max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-2xl sm:prose-h1:text-3xl prose-h2:text-xl sm:prose-h2:text-2xl prose-a:font-medium prose-a:text-primary prose-a:underline prose-a:underline-offset-4 prose-a:decoration-primary/30 hover:prose-a:text-primary/80 hover:prose-a:decoration-primary transition-colors"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
