## Why

延續前端資安檢查（Tier A 已完成並歸檔）。本提案納入 **Tier C** —— 會動到運作中行為、需搭配後端或謹慎導入的項目：JWT 驗簽、CSP、OAuth CSRF 防護。對應 issue #165。

## What Changes

- **JWT 驗簽 / 移除未驗證信任**：`src/lib/auth-middleware.ts` 的 `parseJWT` 與 `check-current-user` 只解碼 payload、未驗簽，可偽造 claims。授權判斷改以（會驗簽的）後端結果為準；後端務必驗簽。
- **CSP**：Tier A 已加其他安全標頭但刻意未含 CSP。以 `Content-Security-Policy-Report-Only` 先行，逐步放行 Vimeo / GTM / 後端圖片後改為強制。另需放行 `worker-src 'self'` / `manifest-src 'self'` 供 `add-pwa-support` 的 PWA；enforce 前 SW/manifest 需先就位。
- **OAuth `state`**：Google 登入流程加入 `state` 產生與驗證，防登入 CSRF。

## Capabilities

### New Capabilities
- `jwt-signature-verification`: JWT claims 僅在驗簽後才可信任，未驗證 claims 不得作為授權依據
- `content-security-policy`: 導入 CSP（先 report-only 再強制），涵蓋既有第三方來源
- `oauth-csrf-protection`: OAuth 授權流程使用並驗證 `state`

### Modified Capabilities
_(無)_

## Impact

- **程式碼**：`src/lib/auth-middleware.ts`、`src/pages/api/user/check-current-user.ts`、`next.config.ts`、`src/pages/api/auth/google/*`，以及 **anna-cook-backend**（驗簽、OAuth）
- **行為相容性**：會改動「是否本人」判斷、加入 CSP（需先 report-only 調校）、OAuth 流程
- **相依**：需與後端重建協調
