## Why

Anna Cook 目前只有手機版，核心情境是「使用者把手機架在廚房、邊煮邊看食譜」。將站台升級為可安裝的 PWA，能提供加到主畫面、standalone 全螢幕，以及煮菜時螢幕不自動熄滅（Screen Wake Lock）——這幾項對食譜類應用是真實體驗痛點，成本低、且與現有 mobile-first 設計天然契合。本階段聚焦「可安裝 + 廚房模式」，離線快取留待後續變更。

## What Changes

- **Web App Manifest + icons**：新增 `manifest.webmanifest`（name、icons 192/512/maskable、theme_color、background_color、`display: standalone`、start_url）與對應 icon 資產；於 `_document.tsx` / `_app.tsx` 補上 manifest 連結與 iOS 專用 meta（`apple-touch-icon`、`apple-mobile-web-app-*`）。
- **最小 Service Worker**：註冊一支最小 SW（具 fetch handler，本階段不做離線快取），以滿足 Android 安裝提示（beforeinstallprompt）條件；iOS 走 Add to Home Screen 不需 SW。
- **Screen Wake Lock**：新增 `useWakeLock` hook，於食譜煮菜頁（`recipe-page/[...id]`）在頁面可見時請求 wake lock、於隱藏或離開時釋放。
- **與 CSP 的相依**：本變更引入 SW 與 manifest，`content-security-policy`（security-hardening-tier-c）需放行 `worker-src 'self'` / `manifest-src 'self'`，且 CSP 轉強制前 PWA 資產需先就位（見該變更）。

## Capabilities

### New Capabilities
- `pwa-installability`: 提供 Web App Manifest、icons 與最小 Service Worker，使站台可安裝到主畫面並以 standalone 模式啟動
- `screen-wake-lock`: 於食譜煮菜頁請求螢幕 Wake Lock，避免烹飪過程螢幕自動熄滅

### Modified Capabilities
_(無)_

## Impact

- **程式碼**：`public/manifest.webmanifest`、`public/icons/*`、`src/pages/_document.tsx`、`src/pages/_app.tsx`、`src/pages/recipe-page/[...id].tsx`、`src/hooks/useWakeLock.ts`、最小 SW（`public/sw.js` 或以工具產生）
- **相依**：`content-security-policy` / `http-security-headers`（CSP 白名單需含 `worker-src 'self'`/`manifest-src 'self'`；enforce 順序見 security-hardening-tier-c）
- **行為相容性**：純疊加；未安裝或不支援 Wake Lock 的瀏覽器以 feature detection 優雅降級，維持現狀
