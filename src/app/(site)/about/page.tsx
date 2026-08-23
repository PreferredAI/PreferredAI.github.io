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
    // Edge / Worker runtimes
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
    <div className="prose dark:prose-invert prose-lg max-w-none">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
