## Why

專案原本規範禁止 App Router，該禁令已於 2026-07-24 解除。App Router 帶來 Server Components（縮小 client bundle）、nested layouts、Metadata API、streaming 等好處。本提案將 Pages Router **漸進式**遷移至 App Router：`app/` 與 `pages/` 並存、逐頁進行、隨時可回退。可行性已由兩個 PoC 驗證（`privacy-policy`、`recipe-video`），build 綠燈且與 Pages Router 並存無衝突。

## What Changes

- **基礎建設（已完成）**：建立 `app/` root layout（以 Metadata API + `next/script` 取代 `_document`/`_app` 的 GTM、PWA meta、favicon、theme-color、Toaster、SW 註冊）；建立 `(site)`（含 Header/Footer）與 `(bare)`（無 Header）兩個 route group，取代 `_app` 的 `noLayoutPages` 條件式版面。
- **逐頁遷移**：19 個 route pages 由 `pages/` 遷至 `app/`；`next/head` → Metadata API；`next/router` → `next/navigation`；`getStaticProps`/`getServerSideProps`/`getStaticPaths` → Server Component fetch / `generateStaticParams` / `cookies()`。
- **API 遷移**：24 支 `pages/api` → `app` Route Handlers（`route.ts`）；其中 5 支檔案上傳由 `formidable` + `bodyParser:false` **重寫**為 Web `request.formData()`。
- **收尾**：所有 pages 路由遷移後移除 `_app.tsx`/`_document.tsx`，清理殘留。
- **不改變對外行為**：URL、視覺、互動、SEO 與 API 合約皆須保真（no regression）。

## Capabilities

### New Capabilities
- `app-router-adoption`: 規範 Pages→App Router 的並存、保真、client 邊界、query/Suspense、Metadata、route group、API Route Handler 與安全標頭不回歸等要求

### Modified Capabilities
_(無)_

## Impact

- **程式碼**：新增 `src/app/**`；逐步移除對應 `src/pages/**`；調整被 server 邊界渲染的共用元件（補 `'use client'`）；改寫 `src/lib/auth-middleware.ts`（proxy helper 由 `req/res` → `Request/Response`）與 `src/lib/upload.ts`（上傳）。`next.config.ts` 的安全標頭/CSP 兩種 router 通用，維持不變。
- **行為相容性**：以保真為原則，不改變 URL 與對外行為；`_app`/`_document` 於全部遷移後才移除。
- **測試**：API handler 測試極少（0 支直接呼叫 handler）；Playwright e2e 路徑不變；`use-toast` 等單元測試不受 `'use client'` 影響。
- **相依/協調**：與 Tier-C 輕度協調——GTM nonce 待搬入 `app/layout` 後再處理；OAuth `state`（3.2）落在遷移後的 `app` 版 google route。Tier-C 非本遷移的 blocker。
