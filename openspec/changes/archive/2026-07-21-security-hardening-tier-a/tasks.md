## 1. JSON-LD XSS 跳脫（structured-data-rendering）

- [x] 1.1 在 `src/components/seo/StructuredData.tsx` 的 `generateJsonLd` 對 `JSON.stringify` 結果跳脫 `<`→`<`、`>`→`>`、`&`→`&`、` `、` `
- [x] 1.2 手動驗證：以含 `</script>` 的食譜名稱渲染食譜詳細頁，確認腳本不執行且結構化資料仍為合法 JSON-LD

## 2. HTTP 安全標頭（http-security-headers）

- [x] 2.1 在 `next.config.ts` 新增 `async headers()`，套用 `X-Content-Type-Options: nosniff`、`X-Frame-Options: SAMEORIGIN`、`Referrer-Policy: strict-origin-when-cross-origin`、`Strict-Transport-Security`（中等 max-age、不 preload）、`Permissions-Policy`（未使用功能 deny）
- [x] 2.2 設定 `poweredByHeader: false`
- [x] 2.3 驗證：`curl -I` 確認上述標頭存在且無 `X-Powered-By`（**不加 CSP**）

## 3. Token 安全（auth-token-security）

- [x] 3.1 移除 `src/services/utils/http.ts` 中 `updateAuthToken` 寫入 `localStorage('authToken')` 與 `getAuthToken()`（保留與 token 無關的 `userData` localStorage）
- [x] 3.2 移除／停用 `src/lib/utils/auth.ts` 的 `setClientCookie`（`httpOnly:false`）死碼路徑
- [x] 3.3 移除把含 token 的完整 cookie 字串寫入日誌的 `console.log`（`setServerCookie` 等），並修正其中與實際行為矛盾的 log 文字
- [x] 3.4 `grep` 確認無殘留呼叫端後 `npm run build` 通過

## 4. API 錯誤訊息一般化（api-error-handling）

- [x] 4.1 盤點所有回傳 `error: error.message` / 內部細節的 API route（含 `src/lib/auth-middleware.ts` 的 `proxyAuthRequest`）
- [x] 4.2 改為回傳一般化錯誤訊息，內部細節改以 `console.error` 記在伺服器端

## 5. 驗收

- [x] 5.1 `npm run build` 與既有 Jest 測試全數通過
- [x] 5.2 `npx openspec validate security-hardening-tier-a --strict` 通過
- [x] 5.3 逐頁走查（首頁／食譜詳細／登入）確認無功能回歸
