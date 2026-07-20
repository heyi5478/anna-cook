import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // 產出自包含的 standalone server（server.js + 精簡依賴），供 Docker 部署使用
  output: 'standalone',
  images: {
    domains: ['annacook.rocket-coding.com'],
  },
};

export default nextConfig;
