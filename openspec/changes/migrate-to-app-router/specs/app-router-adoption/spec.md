## ADDED Requirements

### Requirement: App Router 與 Pages Router 並存且路由唯一
遷移期間 `app/` 與 `pages/` SHALL 並存；同一 URL SHALL 僅由其中一邊提供，MUST NOT 同時存在於兩邊。

#### Scenario: 遷移單一頁面
- **WHEN** 將某頁由 `pages/` 遷至 `app/`
- **THEN** 同時移除該頁的 `pages/` 版本，`next build` 無路由衝突且該 URL 由 App Router 提供

#### Scenario: 未遷移頁面不受影響
- **WHEN** 僅遷移部分頁面
- **THEN** 其餘 `pages/` 路由與 `pages/api` 仍正常運作

### Requirement: 遷移須保真（不改變對外行為）
遷移後的頁面 SHALL 保留原有 URL、視覺呈現、互動行為與 SEO metadata，MUST NOT 造成對外行為回歸。

#### Scenario: 靜態頁遷移後
- **WHEN** `privacy-policy` 由 `pages/` 遷至 `app/`
- **THEN** URL 維持 `/privacy-policy`、內容與版面不變、`next build` 綠燈

### Requirement: 共用元件須正確標註 client 邊界
被 server 端（root layout 或 server component）渲染、且使用 React hook 或瀏覽器 API 的元件 MUST 標註 `'use client'`。

#### Scenario: Toaster 於 root layout 渲染
- **WHEN** `Toaster`（使用 `useToast`/`useState`）自 `app/layout.tsx` 渲染
- **THEN** 該元件標註 `'use client'`，`next build` 的靜態預渲染不出現 `useState is not a function` 錯誤

### Requirement: 讀取 URL query 的頁面須以 Suspense 包裹
使用 `useSearchParams()` 的頁面 MUST 由 server 端 `page.tsx` 以 `<Suspense>` 邊界包住讀取 query 的 client 元件；讀值 SHALL 以 optional chaining 處理可能的 null。

#### Scenario: recipe-video 讀取 ?id
- **WHEN** `/recipe-video?id=<n>` 頁面於 client 端以 `useSearchParams()` 取得 `id`
- **THEN** 該頁由 server `page.tsx` 以 `<Suspense>` 包裹，`next build` 可靜態預渲染（○）而不因缺 Suspense 邊界失敗

### Requirement: SEO metadata 以 Metadata API 提供
遷移頁面的 `title`/`description`/`canonical`/OG 等 SHALL 以 Metadata API（`export const metadata` 或 `generateMetadata`）提供，取代 `next/head`；結構化資料（JSON-LD）MAY 保留為元件內嵌 `<script>`。

#### Scenario: 靜態頁 metadata
- **WHEN** 遷移一個原以 `next/head` 設定標題的靜態頁
- **THEN** 改以 `export const metadata` 提供，且輸出的 HTML 含對應 `<title>`/`<meta>`

#### Scenario: 依 client 資料的動態標題
- **WHEN** 頁面標題取決於 client 端抓取的資料（無法於 server `generateMetadata` 取得）
- **THEN** 以 server 端靜態 metadata 作為基底，並於 client 端以 `document.title` 設定動態標題

### Requirement: 版面以 route group 表達 Header 有無
需要 Header/Footer 的頁面 SHALL 置於 `(site)` route group；不需要者 SHALL 置於 `(bare)` route group，取代 `_app` 的 `noLayoutPages` 條件式判斷。

#### Scenario: 有無 Header 的兩類頁面
- **WHEN** `privacy-policy` 置於 `(site)`、`recipe-video` 置於 `(bare)`
- **THEN** 前者渲染出 Header/Footer，後者不含 Header，且兩者 URL 皆不含 route group 括號

### Requirement: API 遷移為 Route Handler 且保留合約
`pages/api` 遷至 App Router `route.ts` 時 SHALL 保留原路徑、HTTP 方法、狀態碼與回應合約；檔案上傳 SHALL 由 `formidable` + `bodyParser:false` 改用 Web `request.formData()`，並維持既有大小上限與 MIME 型別限制。

#### Scenario: 檔案上傳 route 遷移
- **WHEN** 建立食譜的上傳 route 遷至 `route.ts`
- **THEN** 以 `request.formData()` 解析，超過大小上限仍回 413、不支援型別仍回 415，成功仍代理至後端

### Requirement: 既有安全標頭與 CSP 不得回歸
遷移後 `next.config.ts` 的安全性回應標頭與 `Content-Security-Policy-Report-Only` SHALL 維持生效；GTM inline script 搬至 `app/layout` 後，CSP 轉為強制前 MUST 先完成 inline 處理（nonce 或 hash）。

#### Scenario: 遷移後檢視回應標頭
- **WHEN** 請求任一 App Router 頁面
- **THEN** 回應仍包含既有安全性標頭與 CSP（report-only）
