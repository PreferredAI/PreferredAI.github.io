import type { Element, Parent, Root } from "hast";
import { visit } from "unist-util-visit";

const ALLOWED_YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "www.youtube-nocookie.com",
]);
const YOUTUBE_EMBED_PATH = /^\/embed\/[A-Za-z0-9_-]+$/;

function getSafeYouTubeUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;

  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.port !== "" ||
      url.username !== "" ||
      url.password !== "" ||
      !ALLOWED_YOUTUBE_HOSTS.has(url.hostname.toLowerCase()) ||
      !YOUTUBE_EMBED_PATH.test(url.pathname)
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

/** Remove untrusted iframes and normalize the narrow YouTube compatibility allowlist. */
export default function rehypeSafeEmbeds() {
  return (tree: Root) => {
    visit(
      tree,
      "element",
      (node: Element, index, parent: Parent | undefined) => {
        if (node.tagName !== "iframe") return;

        const safeSrc = getSafeYouTubeUrl(node.properties.src);
        if (!safeSrc) {
          if (parent && index !== undefined) {
            parent.children.splice(index, 1);
            return index;
          }
          return;
        }

        node.properties = {
          src: safeSrc,
          title: "YouTube video player",
          loading: "lazy",
          referrerPolicy: "strict-origin-when-cross-origin",
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          allowFullScreen: true,
          sandbox: ["allow-scripts", "allow-same-origin", "allow-presentation"],
          className: ["video-embed"],
        };
      },
    );
  };
}
