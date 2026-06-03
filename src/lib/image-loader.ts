import type { ImageLoaderProps } from "next/image";

export default function imageLoader({ src, width }: ImageLoaderProps) {
  // If it's a remote URL or external asset, return it as-is
  if (src.startsWith("http") || src.startsWith("//") || src.startsWith("data:")) {
    return src;
  }

  // Base path from next.config.ts (if running on GitHub Pages)
  const isProd = process.env.NODE_ENV === "production";
  const isGitHubPages = process.env.GITHUB_PAGES === "true";
  const basePath = isProd && isGitHubPages ? "/preferred-ai-nextjs" : "";

  // Normalize src to remove basePath if present (prevent double nesting)
  let cleanSrc = src;
  if (basePath && cleanSrc.startsWith(basePath)) {
    cleanSrc = cleanSrc.slice(basePath.length);
  }

  // Ensure cleanSrc starts with a slash
  if (!cleanSrc.startsWith("/")) {
    cleanSrc = "/" + cleanSrc;
  }

  // We only optimize local images located in /team/ and /uploads/ folders
  const isOptimizedFolder = cleanSrc.startsWith("/team/") || cleanSrc.startsWith("/uploads/");
  if (!isOptimizedFolder) {
    return src;
  }

  // Return the path pointing to the static optimized directory
  return `${basePath}/optimized/${width}${cleanSrc}`;
}
