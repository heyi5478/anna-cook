import type { NextConfig } from 'next';

// CSP（Content-Security-Policy）— 先以 Report-Only 收集違規、不阻擋；
// 穩定後（含以 nonce/hash 處理 GTM inline script）再改為強制。
// 涵蓋 GTM、Vimeo 播放器、後端圖片，以及 PWA 的 SW/manifest（worker-src/manifest-src）。
const cspReportOnly = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  // 報告階段暫留 'unsafe-inline'（GTM inline gtag）；enforce 前改 nonce/hash 並移除
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://annacook.rocket-coding.com https://*.vimeocdn.com",
  "font-src 'self' data:",
  'frame-src https://player.vimeo.com',
  "connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://annacook.rocket-coding.com https://*.vimeo.com",
  "media-src 'self' blob: https://*.vimeo.com https://*.vimeocdn.com",
  "worker-src 'self'",
  "manifest-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  'report-uri /api/csp-report',
].join('; ');

// 全站共用的安全性回應標頭
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
  { key: 'Content-Security-Policy-Report-Only', value: cspReportOnly },
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
