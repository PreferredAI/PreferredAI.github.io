import type { ImageLoaderProps } from "next/image";
import {
  getGeneratedImagePath,
  getImageManifestEntry,
  selectGeneratedWidth,
} from "./image-manifest";
import { getGeneratedWidths } from "./image-widths";

export default function imageLoader({ src, width }: ImageLoaderProps) {
  // If it's a remote URL or external asset, return it as-is
  if (
    src.startsWith("http") ||
    src.startsWith("//") ||
    src.startsWith("data:")
  ) {
    return src;
  }

  // In development, serve the original unoptimized images directly with width query to satisfy Next.js check
  if (process.env.NODE_ENV === "development") {
    const separator = src.includes("?") ? "&" : "?";
    return `${src}${separator}w=${width}`;
  }

  const entry = getImageManifestEntry(src);
  const generatedWidth = entry
    ? selectGeneratedWidth(getGeneratedWidths(entry.sourceWidth), width)
    : undefined;

  return generatedWidth ? getGeneratedImagePath(src, generatedWidth) : src;
}
