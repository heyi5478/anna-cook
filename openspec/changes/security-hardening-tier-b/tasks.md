## 1. 檔案上傳界限（file-upload-limits）

- [x] 1.1 `video.ts` / `user/profile.ts` / `create.ts` / `submit-draft.ts` 的 `formidable` 設定 `maxFileSize`（對齊後端）與 mimetype 白名單
- [x] 1.2 上傳改以串流轉發，移除 `fs.readFileSync` 整檔讀取
- [ ] 1.3 實測各端點正常上傳不受影響、過大/錯型別被拒

> 註：集中於 `src/lib/upload.ts`（`createUploadForm` + MIME 白名單 + `fileToBlob`）。大小上限為前端保守預設（圖片 5MB／影片 200MB），**上線前需與後端實際限制對齊**。串流以 `openAsBlob` 惰性讀取取代 `fs.readFileSync`（舊版 Node 後備整檔讀取）。1.3 需以實機/整合測試驗證；本次僅通過 build 與單元測試（554/554）。

## 2. 相依套件漏洞（dependency-security）

- [x] 2.1 連網執行 `npm audit`，記錄 high/critical 清單
- [x] 2.2 升級 Next.js 到最新 15.x，跑 `npm run build` + jest
- [x] 2.3 處理其餘 high/critical 漏洞（production 面向者已清；dev-only 殘留另案追蹤）

> 註：Next `15.2.3 → 15.5.21`；`npm audit fix`（非破壞性）將漏洞 38 → 15。
>
> **sharp / postcss**：改以 `package.json` `overrides` 強推修補版（`sharp@0.35.3`、`postcss@8.5.22`；postcss 為直接 devDep，用 `$postcss` 參照語法避開 EOVERRIDE）。`--force` 會把 Next 降到 9.3.3（重大破壞）故不採用。已驗證 `npm run build` + jest（567）通過，並以 `next start` 實測 `/_next/image` 對本地圖片最佳化為 webp 正常（HTTP 200），確認 Next 15.5 與 `sharp@0.35.3` 相容。
>
> **殘留（另案追蹤，不在本次範圍）**：`npm audit` 尚有 6 high + 6 low；其 high 為 `@typescript-eslint` v6（ESLint 工具鏈、devDependency，不進 production bundle、runtime 零暴露），修補需升到 v8（牽動 ESLint / airbnb config）。

## 3. 路徑參數安全（api-path-parameter-safety）

- [x] 3.1 `proxyAuthRequest` 與各路由對路徑參數 `encodeURIComponent` / 格式驗證
- [x] 3.2 驗證正常 ID 不受影響

> 註：13 個路由的路徑參數（recipeId / displayId / userId）皆以 `encodeURIComponent` 包裹；另補 `author-recipes` / `author-favorite-follow` 手動組裝的查詢值（isPublished / table / page）。encodeURIComponent 對正常 ID 為無操作，build 通過。

## 4. 驗收

- [x] 4.1 `npm run build` + jest 通過（build 綠燈、jest 554/554）
- [x] 4.2 `openspec validate security-hardening-tier-b --strict` 通過
