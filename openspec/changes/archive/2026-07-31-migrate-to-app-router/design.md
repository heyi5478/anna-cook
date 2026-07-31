## Context

現狀（遷移前）：19 route pages + 24 API routes、~46k LOC。資料抓取很輕（3 `getStaticProps`、1 `getStaticPaths`、1 `getServerSideProps`）。`next/router` 散布 28 檔（其中 `router.push` 19 檔為 API 相容、`router.query` 9 檔、`router.events` 0 檔）、`next/head` 6 檔。stack 為 Next 15.5 + React 19（原生支援 App Router，免升級）。

兩個 PoC 已完成並 commit：`privacy-policy`（純靜態）、`recipe-video`（讀 query + 無 Header + Vimeo）。以下設計與模式皆由 PoC 實測校準。

## Goals / Non-Goals

**Goals:**
- 增量、可回退地遷移至 App Router，`app/` 與 `pages/` 全程並存。
- 遷移保真：URL、視覺、互動、SEO、API 合約不回歸。
- 建立可重複套用的模式，降低逐頁成本。

**Non-Goals:**
- 一次性大爆炸式遷移。
- 為遷移而重寫商業邏輯或 UI。
- 立即把 CSP 由 report-only 改為 enforce（與遷移解耦）。

## Decisions

1. **並存 + 逐頁**：同一 URL 僅存在於 `app/` 或 `pages/` 一邊；遷移一頁＝新增 `app` 版並同時移除 `pages` 版（避免路由衝突）。
2. **版面 = route groups**：`(site)` 套用含 Header/Footer 的 `Layout`；`(bare)` 無 Header（登入頁、`recipe-video` 等）。取代 `_app` 的 `noLayoutPages` 陣列。
3. **root layout**：`app/layout.tsx` 提供 `<html>/<body>`、全域 CSS、GTM（`next/script`）、PWA/appleWebApp/icons/theme-color（Metadata + Viewport）、`<Toaster/>`、SW 註冊 client 元件。
4. **client 邊界**：被 server 邊界渲染且用 hook/瀏覽器 API 的元件補 `'use client'`。此為主要機械稅，且由 build 期 prerender error 精準指出。
5. **讀 query 的頁面 = server shell + Suspense + client 元件**：`page.tsx`（server）export `metadata`/`viewport` 並以 `<Suspense>` 包住 client 元件；client 元件用 `useSearchParams()`。
6. **Metadata**：靜態頁 `export const metadata`；動態且依 client 資料的標題以 `document.title` effect；`StructuredData`（JSON-LD）保留為內嵌 `<script>`。
7. **API**：`pages/api` handler(req,res) → `route.ts` 的 `GET/POST(request)`；共用 `proxyAuthRequest` 改寫一次即可帶動多數 proxy route；5 支上傳改用 `request.formData()`。
8. **安全標頭/CSP**：`next.config.ts` `headers()` 兩種 router 通用，維持不動。

## Patterns（PoC 校準出的可重複模板）

- **靜態頁**：`app/(site)/<path>/page.tsx`，server component，`export const metadata`。
- **client 互動頁**：`app/(bare|site)/<path>/page.tsx`（server shell：metadata + viewport + `<Suspense>`）＋ `*-client.tsx`（`'use client'`）。
- **query 存取**：`useSearchParams()?.get('x') ?? null`（**型別可能 null**，需 optional chaining；與 `router.query` 不同）。
- **導頁**：`router.push` 由 `next/navigation` 匯入即相容。

## Risks / Trade-offs

- [client 邊界遺漏] → build 期 `useState is not a function` prerender error 會精準指出，逐一補 `'use client'`。
- [`useSearchParams` 未包 Suspense] → build 失敗；一律採 server shell + Suspense 模板。
- [SEO 回歸] → 靠 SEO 的頁面逐頁比對 title/canonical/OG。
- [上傳 route 重寫] → 5 支風險最高，排最後、單獨驗證（含 413/415 行為）。
- [與 Tier-C 撞車] → 實測影響很小：JWT 前端已完成、CSP 為 config 層、僅 2 支 google route + GTM nonce 需輕度協調。

## Migration Plan

依 tasks.md 分 7 階段：基礎建設（已完成）→ 靜態頁 → client 互動頁 → SSR/ISR 資料頁 → API Route Handlers → 收尾（移除 `_app`/`_document`）→ 驗收。每階段跑 `quality:all` + e2e 綠燈才推進。回滾 = 還原該頁 `pages` 版並移除 `app` 版。

## Open Questions

- SSR/ISR 資料頁（`index`、`recipe-page`、`user`）的 RSC 化深度：是否真正把資料抓取移到 Server Component（拿 RSC 效益），或先以 client 抓取保真搬移。
- SEO 元件（`PageSEO`/`RecipeSEO`）重構為 `generateMetadata` 的介面設計。
- 上傳 route 以 Web FormData 重寫後，`lib/upload` 的大小/MIME 限制與測試對應。
