## Context

Tier B 來自資安檢查，特性是「非破壞性但需選對參數/測試」。上傳端點以 `formidable` 解析並用 `fs.readFileSync` 整檔進記憶體轉發；`proxyAuthRequest` 以字串串接路徑參數組成後端 URL。

## Goals / Non-Goals

**Goals:**
- 檔案上傳有大小/型別界限且以串流處理。
- 無已知 high/critical 相依漏洞、框架保持受支援版本。
- 路徑參數安全地組成後端 URL。

**Non-Goals:**
- CSP、JWT 驗簽、OAuth state（皆屬 Tier C）。
- 改變合法使用者可見的功能行為。

## Decisions

1. **上傳限制**：以 `formidable({ maxFileSize, filter })` 實作——`maxFileSize` 設 ≥ 合法上限並對齊後端；`filter` 用 mimetype 白名單（影片端點放影片、頭像放圖片）。`readFileSync` → 以 stream/pipe 轉發，避免整檔進記憶體。
2. **相依**：先連網 `npm audit` 取得 high/critical 清單，升級到最新 15.x（patch/minor），跑 `npm run build` + jest 驗證；必要時逐一評估 breaking。
3. **路徑參數**：以 `encodeURIComponent` 包裹（對數字/英數 ID 透明）；明確為數字的 ID（如 recipeId）可加格式驗證。

## Risks / Trade-offs

- [maxFileSize 設太低擋掉合法上傳] → 設 ≥ 實際上限並對齊後端，以實測驗證。
- [Next 升級引入行為變更] → 只在 15.x 內升，跑 build + 測試把關。
- [路徑參數嚴格驗證擋掉合法值] → 以 `encodeURIComponent` 為主（透明），格式驗證僅用於明確數字型 ID。

## Migration Plan

無資料遷移；升級 + 設定調整；回滾＝revert 對應 commit。

## Open Questions

- 各端點的 `maxFileSize` 上限值（需對齊後端與實際需求）。
- Next.js 目標版本（依 `npm audit` 結果決定）。
