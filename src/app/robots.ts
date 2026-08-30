import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (process.env.PREFERREDAI_NOINDEX === "true") {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

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
