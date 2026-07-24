## 1. 基礎建設（Foundation）

- [x] 1.1 治理：解禁 App Router（`CLAUDE.md` + `.cursor` 規則改為遷移規範）
- [x] 1.2 `app/layout.tsx` root layout：Metadata + Viewport（PWA/apple/icons/theme-color）、GTM（`next/script`）、全域 CSS、`<Toaster/>`、SW 註冊
- [x] 1.3 route groups：`(site)`（含 Header/Footer 的 `Layout`）與 `(bare)`（無 Header）
- [x] 1.4 共用元件 client 邊界修正：`Header`、`Toaster`、`use-toast` 補 `'use client'`

## 2. 靜態內容頁（Static pages）

- [x] 2.1 `privacy-policy` → `app/(site)/privacy-policy/page.tsx`（PoC）
- [x] 2.2 `about-us`（含 `next/head` → Metadata）
- [x] 2.3 `fqa`（含 `next/head` → Metadata）
- [x] 2.4 `contact-us`（表單元件補 `'use client'`）

## 3. Client 互動頁（`next/router` → `next/navigation`）

- [x] 3.1 `recipe-video` → `app/(bare)/recipe-video/`（PoC：query + Suspense + bare group）
- [x] 3.2 `login` / `login-email` / `login-verify` / `signin-email`（auth，`(bare)` group；`login` 另含 `next/head`；client 元件 + server shell metadata，router.push → next/navigation）
- [x] 3.3 `recipe-list`（**RSC**：Server Component 讀 `searchParams` 於 server 端抓取；排序/分頁由 client `router.push` → server 重抓；`getStaticProps` 移除；資料快取 `revalidate 3600`；頁面轉為 `ƒ` dynamic）
- [ ] 3.4 `recipe-draft` / `recipe-draft-video` / `upload-recipe-step1` / `upload-recipe-step2` / `upload-video` / `user-center-edit`

## 4. SSR/ISR 資料頁（Server data pages）

- [ ] 4.1 `index`（`getStaticProps` → Server Component fetch + `revalidate`）
- [ ] 4.2 `recipe-page/[...id]`（`getStaticPaths` → `generateStaticParams`；`fallback` → `dynamicParams` + `loading.tsx`；`useWakeLock` 劃 client 邊界）
- [ ] 4.3 `user/[...displayId]`（`getServerSideProps` → Server Component + `cookies()`）
- [ ] 4.4 SEO 元件重構：`PageSEO`/`RecipeSEO` → `generateMetadata`；`StructuredData`（JSON-LD）保留為內嵌 `<script>`

## 5. API Route Handlers

- [ ] 5.1 改寫 `proxyAuthRequest`（`NextApiRequest/Response` → Web `Request/Response`）
- [ ] 5.2 批次遷移 19 支 proxy route → `app/**/route.ts`
- [ ] 5.3 重寫 5 支上傳 route（`formidable` + `bodyParser:false` → `request.formData()`）＋ 調整 `lib/upload` ＋ 更新 `upload-limits`/`path-param` 測試（維持 413/415 行為）
- [ ] 5.4 `csp-report`、auth routes（`google/*` 含 OAuth `state` 與後端協調）

## 6. 收尾（Cleanup）

- [ ] 6.1 全部 pages 路由遷移後移除 `_app.tsx` / `_document.tsx`
- [ ] 6.2 清理 `next/router` 殘留匯入、`_app` `noLayoutPages` 死碼
- [ ] 6.3 e2e 路徑走查、全站回歸、SEO 比對、評估 CSP enforce（GTM nonce）

## 7. 驗收

- [ ] 7.1 全站 `npm run build` 綠燈；`pages/` 無殘留（或列明刻意保留者）
- [ ] 7.2 逐頁走查（登入、含 Vimeo 的食譜頁、GTM、上傳）功能正常
- [ ] 7.3 `openspec validate migrate-to-app-router --strict` 通過
