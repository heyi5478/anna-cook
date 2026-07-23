## 1. Manifest 與 icons（pwa-installability）

- [x] 1.1 產生 icons（192 / 512 / maskable / `apple-touch-icon`），置於 `public/icons/`
- [x] 1.2 新增 `public/manifest.webmanifest`（name、icons、theme_color、background_color、`display: standalone`、start_url）
- [x] 1.3 於 `_document.tsx` / `_app.tsx` 加入 manifest 連結與 iOS meta（`apple-mobile-web-app-*`、`apple-touch-icon`）

## 2. 最小 Service Worker（pwa-installability）

- [x] 2.1 新增最小 SW（具 fetch handler、本階段不快取）並於用戶端註冊
- [ ] 2.2 於 Android Chrome 驗證出現安裝提示（beforeinstallprompt）、可加到主畫面並 standalone 啟動
- [ ] 2.3 於 iOS Safari 驗證可加到主畫面並 standalone 啟動

## 3. Screen Wake Lock（screen-wake-lock）

- [x] 3.1 新增 `useWakeLock` hook（feature detection、`visibilitychange` 重取/釋放）
- [x] 3.2 於 `recipe-page/[...id]` 掛載，煮菜頁可見時螢幕不熄滅
- [x] 3.3 不支援 Wake Lock 的瀏覽器優雅降級、無錯誤

## 4. CSP 相依（跨變更，對應 security-hardening-tier-c）

- [x] 4.1 確認 tier-c 的 CSP 已放行 `worker-src 'self'` / `manifest-src 'self'`
- [ ] 4.2 CSP 轉強制前，確認 PWA 的 SW/manifest 已就位（enforce 為未來 tier-c 步驟；SW/manifest 現已就位）

## 5. 驗收

- [x] 5.1 `npm run build` + jest（567）通過
- [ ] 5.2 Lighthouse Installability 檢查通過（可安裝、manifest 有效、已註冊 SW）
- [x] 5.3 `openspec validate add-pwa-support --strict` 通過

> 註：本環境（headless、無真實行動裝置 / Chrome Lighthouse）已以 `next start` + curl 驗證伺服器面：
> `/manifest.webmanifest`（200、`application/manifest+json`）、`/sw.js`、`/icons/*`（皆 200）、
> `Content-Security-Policy-Report-Only` 標頭、`POST /api/csp-report`（204 並記 log）皆正常；
> Dockerfile 已 `COPY public`，standalone 產物含 PWA 檔案。
> **待實機/工具驗收（2.2 Android 安裝提示、2.3 iOS 加到主畫面、5.2 Lighthouse）**——需真實裝置，列為部署後項目。
