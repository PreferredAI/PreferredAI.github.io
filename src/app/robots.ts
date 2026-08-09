import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/keystatic/"],
      },
    ],
    sitemap: "https://preferred.ai/sitemap.xml",
  };
}
