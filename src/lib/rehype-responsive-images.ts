import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";
import {
  getGeneratedImagePath,
  getImageManifestEntry,
  normalizeLocalImagePath,
} from "./image-manifest";
import { getGeneratedWidths } from "./image-widths";

const ARTICLE_IMAGE_SIZES = "(max-width: 944px) calc(100vw - 3rem), 896px";
const RESPONSIVE_PROPERTIES = new Set([
  "srcSet",
  "sizes",
  "loading",
  "decoding",
]);

/** Add responsive generated variants and layout dimensions to local Markdown images. */
export default function rehypeResponsiveImages() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "img") return;

      // Never trust responsive-source properties supplied through raw HTML. The plugin
      // reconstructs them below only for images present in the generated manifest.
      const properties = Object.fromEntries(
        Object.entries(node.properties).filter(
          ([name]) => !RESPONSIVE_PROPERTIES.has(name),
        ),
      );

      const src = typeof properties.src === "string" ? properties.src : "";
      const entry = getImageManifestEntry(src);

      if (!entry) {
        node.properties = properties;
        return;
      }

      const normalizedSrc = normalizeLocalImagePath(src);
      const layoutProperties = {
        ...properties,
        width: entry.sourceWidth,
        height: entry.sourceHeight,
        loading: "lazy",
        decoding: "async",
      };

      // Optimized files are generated during production builds and intentionally remain
      // gitignored. A fresh development checkout therefore serves the source image.
      if (process.env.NODE_ENV === "development") {
        node.properties = layoutProperties;
        return;
      }

      const widths = getGeneratedWidths(entry.sourceWidth);
      const largestWidth = widths.at(-1);
      if (!largestWidth) return;

      node.properties = {
        ...layoutProperties,
        src: getGeneratedImagePath(normalizedSrc, largestWidth),
        srcSet: widths
          .map(
            (width) =>
              `${getGeneratedImagePath(normalizedSrc, width)} ${width}w`,
          )
          .join(", "),
        sizes: ARTICLE_IMAGE_SIZES,
      };
    });
  };
}
