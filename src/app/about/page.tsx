import { Metadata } from "next";
import fs from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";

export const metadata: Metadata = {
  title: "About - Preferred.AI",
  description:
    "Preferred.AI is a research undertaking at the Singapore Management University (SMU) – School of Computing and Information Systems (SCIS) led by Hady W. Lauw.",
};

async function getAboutContent() {
  const filePath = path.join(process.cwd(), "content", "about.md");

  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const processedContent = await remark().use(html).process(fileContents);
    return processedContent.toString();
  } catch (error) {
    console.error("Error reading about content:", error);
    return "<h1>About</h1><p>Content not available.</p>";
  }
}

export default async function AboutPage() {
  const content = await getAboutContent();

  return (
    <div className="prose prose-lg max-w-none">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
