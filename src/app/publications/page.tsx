import { Metadata } from "next";
import fs from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";

export const metadata: Metadata = {
  title: "Publications - Preferred.AI",
  description: "Research papers and publications from Preferred.AI",
};

async function getPublicationsContent() {
  const filePath = path.join(process.cwd(), "content", "publications.md");

  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const processedContent = await remark().use(html).process(fileContents);
    return processedContent.toString();
  } catch (error) {
    console.error("Error reading publications content:", error);
    return "<h1>Publications</h1><p>Content not available.</p>";
  }
}

export default async function PublicationsPage() {
  const content = await getPublicationsContent();

  return (
    <div className="prose prose-lg max-w-none">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
