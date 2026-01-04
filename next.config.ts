import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  // 仅在 GitHub Actions 环境下（部署到 GitHub Pages 时）添加路径前缀
  // 这样 Vercel（没有 GITHUB_ACTIONS 变量）就会保持在根路径，互不影响
  basePath: isGithubActions ? '/Photo-Layout-Tool' : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
