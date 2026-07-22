## Context

Tier C 特性是「會動到運作中行為、需搭配後端」。前端 `parseJWT` 未驗簽；專案嵌 Vimeo 播放器 + `_document.tsx` 載入 GTM（含 inline script），CSP 需謹慎；OAuth 由後端提供授權 URL、前端轉發 `code`。

## Goals / Non-Goals

**Goals:**
- 授權不依賴未驗證的 JWT claims。
- 導入 CSP 而不破壞既有功能（Vimeo / GTM）。
- OAuth 流程具備 CSRF 防護。

**Non-Goals:**
- Tier A / Tier B 的項目。
- 一步到位的強制 CSP。

## Decisions

1. **JWT**：前端無簽章密鑰、不自行驗簽；改為授權決策一律以後端驗簽結果為準，移除 `check-current-user` 的未驗證判斷。後端（`anna-cook-backend`）以密鑰/公鑰驗簽。
2. **CSP**：先 `Content-Security-Policy-Report-Only` 收集報告，放行 `player.vimeo.com`、`*.googletagmanager.com`、後端圖片網域、必要 inline（nonce 或 hash）；穩定後改為強制 `Content-Security-Policy`。
3. **OAuth state**：由後端在授權 URL 產生 `state`、callback 驗證，前端配合帶回。

## Risks / Trade-offs

- [CSP 一步到位擋掉 Vimeo/GTM] → 一律 report-only 先行、逐步放行。
- [移除前端 isCurrentUser 判斷造成 UI 行為改變] → 以後端 `isMe` 為準，逐頁驗證。
- [OAuth 改動需後端配合] → 與後端重建一起排程。

## Migration Plan

CSP 分兩階段（report-only → enforce）；JWT / OAuth 與後端協調上線；回滾＝移除 CSP 標頭 / revert。

## Open Questions

- CSP 最終來源白名單與 inline script 處理（nonce vs hash）。
- 後端驗簽與 OAuth `state` 的介面約定。
