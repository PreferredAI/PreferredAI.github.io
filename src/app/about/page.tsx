import fs from "fs";
import path from "path";
import { markdownToHtml } from "@/lib/markdown-posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Preferred.AI is a research undertaking at the Singapore Management University (SMU) – School of Computing and Information Systems (SCIS) led by Hady W. Lauw.",
};

async function getAboutContent() {
  const filePath = path.join(process.cwd(), "content", "about.md");

  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    return await markdownToHtml(fileContents);
  } catch (error) {
    console.error("Error reading about content:", error);
    return "<h1>About</h1><p>Content not available.</p>";
  }
}

export default async function AboutPage() {
  const content = await getAboutContent();

  return (
    <div className="prose dark:prose-invert prose-lg max-w-none">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
