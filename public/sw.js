/*
 * Anna Cook — 最小 Service Worker（PWA Tier 1）
 *
 * 目的：提供 fetch handler 以滿足「可安裝 PWA」條件（Android 安裝提示）。
 * 本階段刻意「不做離線快取」——一律走網路（pass-through），避免 stale 內容。
 * 離線 / runtime caching 留待後續變更（規劃以 @serwist/next 導入）。
 */

// 安裝後立即接手，不等既有分頁關閉
self.addEventListener('install', () => {
  self.skipWaiting();
});

// 啟用後接管所有分頁
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// 保留 fetch handler（可安裝條件）；不呼叫 respondWith → 交由瀏覽器正常走網路
self.addEventListener('fetch', () => {
  // no-op：本階段不介入請求、不快取
});
