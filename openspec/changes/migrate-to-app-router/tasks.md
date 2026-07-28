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
- [x] 3.4 6 頁表單全數遷移（recipe-draft / recipe-draft-video / upload ×3 / user-center-edit）→ client `page.tsx` + `useAuth` 守衛；連帶遷 `useAuth`（`pathname`→`usePathname`）、`useVideoEditor`、5 元件（`router.query`→`useSearchParams`、`router.push({pathname,query})` 物件式→字串 URL）；`setupTests` 加 next/navigation 全域 mock，`useAuth`/`useVideoEditor` 測試 mock 對應更新。**所有 19 route pages 遷移完成**

## 4. SSR/ISR 資料頁（Server data pages）

- [x] 4.1 `index`（`getStaticProps` → async Server Component fetch + `revalidate=3600`，維持 `○` static/ISR；`PageSEO`+structuredData → `generateMetadata`+`JsonLd`；tabs/load-more 抽成 client 元件；`fetchHomeFeatures/Recipes` fetch 加 `next.revalidate`）
- [x] 4.2 `recipe-page/[...id]`（`generateStaticParams`（空，按需 ISR）+ `revalidate`；`fallback` → `loading.tsx`；`useWakeLock` 劃 client 包裝；`RecipeSEO` → `generateMetadata` + `JsonLd`；無效 id → `notFound()`）
- [x] 4.3 `user/[...displayId]`（`getServerSideProps` → async Server Component + `cookies()`（組 req 沿用 `fetchUserProfileServer`）；400→`notFound()`；`ƒ` dynamic SSR；連帶遷 `AuthorProfile`（`useParams`）+ `UserCenter` + 3 tabs + `useUserCenter`（`router.push`→next/navigation））
- [x] 4.4 SEO 元件重構：RSC `JsonLd`（內嵌 `<script>`）取代 next/head 版 `StructuredData`；`PageSEO`/`RecipeSEO`/`StructuredData` 已全數改用 `generateMetadata` + `JsonLd`，現無外部引用（3 個舊 SEO 元件檔於收尾階段刪除）

## 5. API Route Handlers

- [x] 5.1 新增 App Router 版代理 helper `proxyAuthRequestApp`（Web `Request` → `NextResponse`；token 由 `request.cookies`、新 token 更新 cookie、query 自動附加）；舊 `proxyAuthRequest` 待上傳批遷完後移除
- [x] 5.2 遷移 13 支純 proxy route → `app/**/route.ts`（每 method 一個 export、405 交框架自動處理）；`path-param-encoding` 安全測試更新為 App Router 版。剩 4 支上傳-proxy 併入 5.3、6 支自訂（email-login / google×2 / logout / test-token / search）併入 5.4
- [x] 5.3 上傳批 5 支重寫（`create`/`submit-draft`/`video`/`user/profile`/`csp-report`）：`formidable`+`bodyParser:false` → `await request.formData()`；Web `File` 本身是 Blob 直接轉發（`fileToBlob` 移除）；手動驗 `File.size`(413)/`File.type`(415)；`lib/upload` 精簡為常數；`upload-limits.test` 改 App Router 版、刪除已失效的 `upload.test`。**Phase 5 完成：24 支 API 全數遷移，`pages/` 只剩 `_app`/`_document`**
- [x] 5.4 自訂批 6 支遷移：`recipes/search`（GET proxy）、`auth/logout`（清 cookie）、`auth/test-token`（dev）、`auth/email/login`（設 cookie）、`auth/google/google`+`auth/google/callback`（OAuth；`NextResponse.redirect` + cookie，**Tier-C state 待後端另加**）。cookie 於 App Router 以 `NextResponse.cookies` 設/清。`csp-report`（用 formidable）併入上傳批

## 6. 收尾（Cleanup）

- [x] 6.1 移除 `_app.tsx` / `_document.tsx`（**`src/pages/` 完全移除，Pages Router 退場**）；一併移除已無用的舊 `proxyAuthRequest` 與 3 個死 SEO 元件（`PageSEO`/`RecipeSEO`/`StructuredData`）
- [x] 6.2 `next/router` 已無殘留（全站改 `next/navigation`）；`_app` 的 `noLayoutPages` 隨 `_app` 移除而消失
- [~] 6.3 build + jest（562）+ lint 全綠（每批 CI 驗證）；**`formidable` 依賴 + `setupTests.js` 的死 `next/router` mock 已移除（src 已 0 個 `next/router` 引用）**；e2e 路徑走查 / 全站手動回歸 / SEO 比對 / CSP enforce（GTM nonce）屬部署階段驗證，留待進 prod 前執行

## 7. 驗收

- [x] 7.1 `npm run build` 綠燈；`src/pages/` 已完全移除（app-only；route table 僅剩 `Route (app)`）
- [~] 7.2 逐頁走查（登入 / 含 Vimeo 的食譜頁 / GTM / 上傳）—— 屬部署階段手動驗證，留待進 prod 前執行
- [x] 7.3 `openspec validate migrate-to-app-router --strict` 通過
