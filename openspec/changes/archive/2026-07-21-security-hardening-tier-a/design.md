## Context

Tier A 來自先前的前端資安檢查，定義為「可在不影響現有功能下立即處理」的加固類項目。相關背景：

- 前端 Next.js（Pages Router）主要作為代理層，實際認證由後端負責。
- 真正的 session 已使用 **HttpOnly cookie**（伺服器端登入路由設定），但另有**死碼**會把 JWT 複製到 `localStorage` 與非 HttpOnly cookie（`getAuthToken()` 無任何呼叫端、客戶端無 `Authorization` 直傳，已於檢查中確認）。
- JSON-LD 透過 `dangerouslySetInnerHTML` 輸出；食譜名稱/描述（使用者生成內容）會流入，形成可達的儲存型 XSS。
- 專案嵌入 Vimeo 播放器，並在 `_document.tsx` 載入 GTM（含 inline script）。

## Goals / Non-Goals

**Goals:**
- 消除食譜詳細頁可達的**儲存型 XSS**（JSON-LD 未跳脫）。
- 加上基礎安全性 HTTP 標頭（不含 CSP）。
- 停止把 token 寫入日誌。
- 讓 HttpOnly cookie 成為**唯一**的 token 存放處，移除 JS 可讀的複本。
- 停止向客戶端洩漏內部例外訊息。
- 全程對合法使用者**零功能影響**。

**Non-Goals:**
- **CSP**：會擋到 Vimeo/GTM，需以 report-only 逐步導入 → 留待後續 Tier。
- **JWT 驗簽 / `check-current-user`**：前端無簽章密鑰，屬後端責任 → Tier C。
- 上傳大小/型別限制（Tier B）、OAuth `state`、路徑參數驗證、Next.js 升級。

## Decisions

1. **JSON-LD 跳脫**：在 `StructuredData.tsx` 的 `generateJsonLd` 對 `JSON.stringify` 結果跳脫 `<`→`<`、`>`→`>`、`&`→`&`、` `、` `。
   - 為何：Next.js 官方建議做法，輸出仍是**合法 JSON-LD**（解析器會還原跳脫），零新相依、零語意變化。
   - 替代方案：改用 sanitizer 套件或 `next/script` → 否決（過度、增加相依）。
2. **安全標頭**：以 `next.config.ts` 的 `headers()` 全站套用，而非 per-route 或 middleware。
   - 為何：單一來源、Pages Router 原生支援、無執行期成本。
   - 值：`X-Content-Type-Options: nosniff`、`X-Frame-Options: SAMEORIGIN`、`Referrer-Policy: strict-origin-when-cross-origin`、`Strict-Transport-Security`（中等 max-age、暫不 preload）、`Permissions-Policy`（未使用的功能一律 deny）、`poweredByHeader: false`。**刻意不含 CSP。**
3. **Token 單一存放**：移除 `setClientCookie(httpOnly:false)`、`updateAuthToken` 的 `localStorage('authToken')`、`getAuthToken()`；保留與 token 無關的 `userData` localStorage（UI 狀態）。移除各處把含 token 的 cookie 字串寫入 log 的呼叫。
   - 為何：HttpOnly cookie 已是實際 session 來源；死碼移除可縮小 XSS 影響面。
4. **錯誤回應一般化**：API route 回傳穩定的一般化訊息，內部細節改用 `console.error` 留在伺服器端。

## Risks / Trade-offs

- [JSON-LD 跳脫破壞結構化資料] → 這些是標準 JSON 字串跳脫，解析器會還原，語意不變；以 Google Rich Results 測試驗證。
- [`X-Frame-Options` 擋掉合法嵌入] → 食譜站不被他站 iframe；選 `SAMEORIGIN` 而非 `DENY` 保留同源。
- [HSTS 鎖死 HTTPS] → 生產環境已強制 HTTPS；用中等 max-age、初期不加 preload。
- [移除 token 死碼其實有隱藏使用者] → 已 grep 確認無呼叫端；以 `npm run build` + 既有測試把關。

## Migration Plan

純新增設定與死碼移除，**無資料遷移**。走既有部署流程；回滾＝revert 該 commit；無環境變數變更。

## Open Questions

- HSTS 的 `max-age` 最終值、是否日後加入 `preload`。
- `Permissions-Policy` 要 deny 的功能清單（提案：camera/microphone/geolocation 等未使用者全 deny）。
