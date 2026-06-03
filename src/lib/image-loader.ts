import type { ImageLoaderProps } from "next/image";

export default function imageLoader({ src, width }: ImageLoaderProps) {
  // If it's a remote URL or external asset, return it as-is
  if (src.startsWith("http") || src.startsWith("//") || src.startsWith("data:")) {
    return src;
  }

  // Ensure cleanSrc starts with a slash
  let cleanSrc = src;
  if (!cleanSrc.startsWith("/")) {
    cleanSrc = "/" + cleanSrc;
  }

  // We only optimize local images located in /team/ and /uploads/ folders
  const isOptimizedFolder = cleanSrc.startsWith("/team/") || cleanSrc.startsWith("/uploads/");
  if (!isOptimizedFolder) {
    return src;
  }

  // Return the path pointing to the static optimized directory
  return `/optimized/${width}${cleanSrc}`;
}
