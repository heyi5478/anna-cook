## 1. Manifest 與 icons（pwa-installability）

- [ ] 1.1 產生 icons（192 / 512 / maskable / `apple-touch-icon`），置於 `public/icons/`
- [ ] 1.2 新增 `public/manifest.webmanifest`（name、icons、theme_color、background_color、`display: standalone`、start_url）
- [ ] 1.3 於 `_document.tsx` / `_app.tsx` 加入 manifest 連結與 iOS meta（`apple-mobile-web-app-*`、`apple-touch-icon`）

## 2. 最小 Service Worker（pwa-installability）

- [ ] 2.1 新增最小 SW（具 fetch handler、本階段不快取）並於用戶端註冊
- [ ] 2.2 於 Android Chrome 驗證出現安裝提示（beforeinstallprompt）、可加到主畫面並 standalone 啟動
- [ ] 2.3 於 iOS Safari 驗證可加到主畫面並 standalone 啟動

## 3. Screen Wake Lock（screen-wake-lock）

- [ ] 3.1 新增 `useWakeLock` hook（feature detection、`visibilitychange` 重取/釋放）
- [ ] 3.2 於 `recipe-page/[...id]` 掛載，煮菜頁可見時螢幕不熄滅
- [ ] 3.3 不支援 Wake Lock 的瀏覽器優雅降級、無錯誤

## 4. CSP 相依（跨變更，對應 security-hardening-tier-c）

- [ ] 4.1 確認 tier-c 的 CSP 已放行 `worker-src 'self'` / `manifest-src 'self'`
- [ ] 4.2 CSP 轉強制前，確認 PWA 的 SW/manifest 已就位

## 5. 驗收

- [ ] 5.1 `npm run build` + jest 通過
- [ ] 5.2 Lighthouse Installability 檢查通過（可安裝、manifest 有效、已註冊 SW）
- [ ] 5.3 `openspec validate add-pwa-support --strict` 通過
