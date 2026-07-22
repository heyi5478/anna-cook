import type { NextConfig } from 'next';

// 全站共用的安全性回應標頭（本階段不含 CSP —— CSP 會影響 Vimeo/GTM，另以後續變更導入）
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
];

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // 產出自包含的 standalone server（server.js + 精簡依賴），供 Docker 部署使用
  output: 'standalone',
  // 不回傳 X-Powered-By，避免洩漏框架指紋
  poweredByHeader: false,
  images: {
    domains: ['annacook.rocket-coding.com'],
  },
  // 對所有路由套用安全性標頭
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
