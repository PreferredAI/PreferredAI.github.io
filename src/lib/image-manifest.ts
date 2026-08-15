import generatedImageManifest from "@/data/generated-image-manifest.json";

export interface ImageManifestEntry {
  sourceWidth: number;
  sourceHeight: number;
}

export interface ImageManifest {
  version: number;
  images: Record<string, ImageManifestEntry>;
}

export const imageManifest = generatedImageManifest as ImageManifest;

export function normalizeLocalImagePath(src: string): string {
  const pathOnly = src.split(/[?#]/, 1)[0];
  return pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`;
}

export function getImageManifestEntry(
  src: string,
): ImageManifestEntry | undefined {
  return imageManifest.images[normalizeLocalImagePath(src)];
}

export function selectGeneratedWidth(
  availableWidths: number[],
  requestedWidth: number,
): number | undefined {
  return (
    availableWidths.find((width) => width >= requestedWidth) ??
    availableWidths.at(-1)
  );
}

export function getGeneratedImagePath(src: string, width: number): string {
  return `/optimized/${width}${normalizeLocalImagePath(src)}.webp`;
}
