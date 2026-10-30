import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  allowedDevOrigins: ["127.0.0.1"],
};

if (process.env.SKIP_OPENNEXT_DEV_INIT !== "true") {
  initOpenNextCloudflareForDev();
}

export default nextConfig;
