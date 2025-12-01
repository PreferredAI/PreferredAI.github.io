import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isProd && isGitHubPages ? '/preferred-ai-nextjs' : '',
  assetPrefix: isProd && isGitHubPages ? '/preferred-ai-nextjs' : '',
};

export default nextConfig;
