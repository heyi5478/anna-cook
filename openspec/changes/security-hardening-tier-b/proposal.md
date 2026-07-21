## Why

延續前端資安檢查（Tier A 已完成並歸檔）。本提案納入 **Tier B** —— 幾乎不影響正常使用、但需要選對參數並實測的加固項目：檔案上傳的資源界限、相依套件的已知漏洞、路徑參數的縱深防禦。對應 issue #164。

## What Changes

- **檔案上傳大小/型別限制 + 串流**：`video.ts`、`user/profile.ts`、`create.ts`、`submit-draft.ts` 目前用 `formidable({})`，無 `maxFileSize` 與型別白名單，且 `fs.readFileSync` 把整檔讀進記憶體 → 大檔（尤其影片）可 OOM。加入大小上限（≥ 合法上限、對齊後端）、mimetype 白名單，並改串流轉發。
- **相依套件漏洞**：`next@15.2.3` 落後多個安全修補版；連網跑 `npm audit`、升級到最新 15.x。
- **路徑參數驗證/編碼**：`proxyAuthRequest` 的 `url` 由 caller 用路徑參數串接，僅檢查存在/陣列。加入 `encodeURIComponent` 或格式驗證。

## Capabilities

### New Capabilities
- `file-upload-limits`: 檔案上傳的大小上限、型別白名單與串流處理
- `dependency-security`: 相依套件不得含已知高風險漏洞、框架保持在受支援版本
- `api-path-parameter-safety`: 路徑參數在組成後端 URL 前需驗證/編碼

### Modified Capabilities
_(無)_

## Impact

- **程式碼**：`src/pages/api/recipes/[recipeId]/video.ts`、`src/pages/api/user/profile.ts`、`src/pages/api/recipes/create.ts`、`src/pages/api/recipes/[recipeId]/submit-draft.ts`、`src/lib/auth-middleware.ts`、`package.json`
- **相依套件**：Next.js 升級
- **行為相容性**：對合法使用者無感；新增「拒絕過大/錯型別檔案」「拒絕異常路徑參數」的行為，需選對參數並實測
