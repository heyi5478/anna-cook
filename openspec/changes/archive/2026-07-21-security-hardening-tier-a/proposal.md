## Why

先前對 anna-cook 前端的資安檢查發現多項問題。本提案只納入 **Tier A** —— 可在**不影響現有功能**的前提下立即處理的加固／死碼清除／設定類項目，先解決「風險最高、改動最小」的部分。其中最嚴重的是食譜詳細頁的**儲存型 XSS**（JSON-LD 未跳脫）：任何註冊使用者只要把食譜命名為含 `</script>` 的字串，即可對全站訪客執行任意 JavaScript。

## What Changes

- **JSON-LD 輸出跳脫**：`StructuredData.tsx` 用 `JSON.stringify` 產生的內容經 `dangerouslySetInnerHTML` 注入 `<script type="application/ld+json">`，未跳脫 `<`/`>`/`&`，使食譜名稱/描述可突破 `<script>` 注入腳本。改為跳脫這些字元，消除儲存型 XSS。
- **HTTP 安全標頭**：`next.config.ts` 新增 `X-Content-Type-Options`、`X-Frame-Options`、`Referrer-Policy`、`Strict-Transport-Security`、`Permissions-Policy`，並關閉 `poweredByHeader`。（**不含 CSP** —— CSP 會影響 Vimeo 播放器與 GTM，屬後續 Tier。）
- **移除日誌中的 token**：`setServerCookie` 等處會把含 JWT 的完整 cookie 字串寫進伺服器日誌，予以移除；並修正 `setServerCookie` 中與實際行為矛盾的 log 文字。
- **統一 token 存放為 HttpOnly**：移除已成死碼的 localStorage token 與非 HttpOnly cookie 寫入路徑（`setClientCookie` 的 `httpOnly:false`、`updateAuthToken` 寫 `localStorage('authToken')`、`getAuthToken`），保留與 token 無關的 `userData` localStorage。
- **API 錯誤訊息一般化**：多個 API route 目前把內部 `error.message` 回傳給客戶端，改為回傳一般化訊息，詳細只記在伺服器端。

以上皆為**非破壞性**變更，對合法使用者無任何可見的功能差異。

## Capabilities

### New Capabilities
- `structured-data-rendering`: 結構化資料（JSON-LD）輸出到 HTML 時，對 HTML 敏感字元的安全跳脫要求
- `http-security-headers`: 前端回應必須帶上的安全性 HTTP 標頭（本階段不含 CSP）
- `auth-token-security`: JWT token 的存放與日誌處理 —— 僅存於 HttpOnly cookie、且不得寫入任何日誌
- `api-error-handling`: API 錯誤回應不得向客戶端洩漏內部例外細節

### Modified Capabilities
_(無 —— `openspec/specs/` 目前為空，無既有 capability 的需求被更動)_

## Impact

- **程式碼**：`src/components/seo/StructuredData.tsx`、`next.config.ts`、`src/lib/utils/auth.ts`、`src/services/utils/http.ts`、`src/services/server-api.ts`、`src/pages/api/**`（多個 route 的錯誤回應）
- **相依套件**：無變更
- **行為相容性**：對一般使用者**零功能影響**（Tier A 定義）；`getAuthToken()`、`setClientCookie()` 等為死碼移除，已於資安檢查中確認無呼叫端
- **不在本次範圍（留待後續 Tier）**：CSP（Tier C）、JWT 驗簽 / `check-current-user`（Tier C）、上傳大小與型別限制（Tier B）、OAuth `state`、路徑參數驗證、Next.js 版本升級
