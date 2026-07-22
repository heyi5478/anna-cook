## 1. 檔案上傳界限（file-upload-limits）

- [ ] 1.1 `video.ts` / `user/profile.ts` / `create.ts` / `submit-draft.ts` 的 `formidable` 設定 `maxFileSize`（對齊後端）與 mimetype 白名單
- [ ] 1.2 上傳改以串流轉發，移除 `fs.readFileSync` 整檔讀取
- [ ] 1.3 實測各端點正常上傳不受影響、過大/錯型別被拒

## 2. 相依套件漏洞（dependency-security）

- [ ] 2.1 連網執行 `npm audit`，記錄 high/critical 清單
- [ ] 2.2 升級 Next.js 到最新 15.x，跑 `npm run build` + jest
- [ ] 2.3 處理其餘 high/critical 漏洞

## 3. 路徑參數安全（api-path-parameter-safety）

- [ ] 3.1 `proxyAuthRequest` 與各路由對路徑參數 `encodeURIComponent` / 格式驗證
- [ ] 3.2 驗證正常 ID 不受影響

## 4. 驗收

- [ ] 4.1 `npm run build` + jest 通過
- [ ] 4.2 `openspec validate security-hardening-tier-b --strict` 通過
