## Context

Anna Cook 為 Next.js Pages Router、mobile-first，內嵌 Vimeo 播放器並經 `_document.tsx` 載入 GTM。目前無任何 PWA 設定（無 manifest / SW）。本變更加入「可安裝 + 廚房模式」，離線留待後續。PWA 的 SW/manifest 與 security-hardening-tier-c 的 CSP 有相依。

## Goals / Non-Goals

**Goals:**
- 站台可安裝到主畫面、以 standalone 啟動。
- 食譜煮菜頁螢幕不自動熄滅。
- 純疊加、不動現有路由與資料流。

**Non-Goals:**
- 離線快取 / runtime caching（後續 `add-pwa-offline`，改用 `@serwist/next`）。
- Web Push / background sync / share target。
- 桌面 RWD 改版；App Router 遷移。

## Decisions

1. **Router 無關**：manifest/icons 為靜態資產、Wake Lock 為瀏覽器 API、SW 與 Pages/App Router 無關；本變更不涉及 App Router 遷移。
2. **最小 SW**：本階段只註冊具 fetch handler 的最小 SW 以滿足 Android 安裝條件，不做快取（避免 stale 內容）；離線在後續變更以 `@serwist/next` 導入（Pages Router 亦支援，取代少維護的 next-pwa）。
3. **Icon 來源**：以既有 `public/big-logo.png` / `public/login-logo.svg` 產生 192/512/maskable 與 `apple-touch-icon`。
4. **Wake Lock 範圍**：僅在食譜煮菜頁（`recipe-page/[...id]`）啟用；`visibilitychange` 回可見時重新請求、隱藏/離開時釋放；不支援者優雅降級。
5. **CSP 相依**：CSP 需放行 `worker-src 'self'` / `manifest-src 'self'`；CSP 轉強制前 PWA 資產需先就位（見 security-hardening-tier-c 的 design Migration Plan）。

## Risks / Trade-offs

- [iOS PWA 限制]：iOS 對 SW / 安裝限制較多，但 Add to Home Screen + standalone + Wake Lock 於現行 iOS 可用 → 以 feature detection 降級。
- [Vimeo 影片無法離線]：即使日後做離線，串流影片仍無法快取 → 離線定位為「文字/圖片弱網更順」，不承諾影片離線。
- [SW 更新/快取失效]：本階段 SW 不做快取以避免 stale；離線變更需一併處理版本更新提示。

## Migration Plan

先加 manifest/icons/meta 與 Wake Lock（純前端、可回滾＝移除檔案與連結）；最小 SW 上線後，於 security-hardening-tier-c 的 CSP 放行 `worker-src`/`manifest-src` 並維持 report-only，待穩定再 enforce。

## Open Questions

- 最小 SW 自寫 vs 直接以 Serwist 一步到位（會提前引入離線範圍）。
- theme_color / background_color 的品牌色值定案。
