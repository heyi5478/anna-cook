import type { NextConfig } from 'next';

// 展示版只匯出靜態頁面，不載入正式網站的 API、SSR 或環境變數設定
const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
