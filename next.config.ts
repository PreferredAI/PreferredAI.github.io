import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

const isServerBuild = process.env.NEXT_OUTPUT_MODE === "server";

const nextConfig: NextConfig = {
  agentRules: false,
  ...(process.env.NODE_ENV === "production" && !isServerBuild
    ? { output: "export" }
    : {}),
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: [640, 1080, 1920, 3840],
    imageSizes: [256, 384],
  },
};

initOpenNextCloudflareForDev();

export default nextConfig;
