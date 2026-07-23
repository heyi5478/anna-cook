## 1. JWT 驗簽（jwt-signature-verification）

- [ ] 1.1 後端（anna-cook-backend）實作 JWT 簽章驗證
- [ ] 1.2 前端移除 `check-current-user` 等以未驗證 claims 做的判斷，改以後端結果為準
- [ ] 1.3 逐頁驗證「是否本人」行為正確

## 2. CSP（content-security-policy）

- [x] 2.1 以 `Content-Security-Policy-Report-Only` 部署，收集違規報告（隨 add-pwa-support 導入：`next.config` 標頭 + `/api/csp-report` 收集端點）
- [ ] 2.2 放行 Vimeo / GTM / 後端圖片、`worker-src 'self'`/`manifest-src 'self'`（PWA，見 add-pwa-support）、處理 inline script（nonce 或 hash）
- [ ] 2.3 穩定後改為強制 `Content-Security-Policy`

## 3. OAuth state（oauth-csrf-protection）

- [ ] 3.1 後端在授權 URL 產生 `state`、callback 驗證
- [ ] 3.2 前端配合帶回 `state`

## 4. 驗收

- [ ] 4.1 逐頁走查（登入、含 Vimeo 的食譜頁、GTM）功能正常
- [ ] 4.2 `openspec validate security-hardening-tier-c --strict` 通過
