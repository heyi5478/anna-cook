# e2e 測試分類（triage）

診斷日（2026-07-23）量測：測試依賴 **216** 個不同的 `data-testid`，但 App 原本只有 **3** 個
（`default-btn` / `destructive-btn` / `outline-btn`，皆 Button 變體、非功能掛鉤）。抽樣測試假設
存在的功能掛鉤（`fullscreen-button`、`timeline-container`、`segment-list`、`thumbnail-grid`、
`bandwidth-indicator`、`buffer-progress`、`drag-drop-area`、`video-player`）於 `src/` **0 命中**。
結論：多數測試描述的是尚未實作的功能。

## 各區決策

| 區域 | 檔數 | 對應真實路由/元件 | 決策 | 原因 |
|---|---|---|---|---|
| `upload/*` | 3 | `/upload-video`（`UploadArea`：真實 dropzone + 隱藏 `#video-upload`） | **quarantine**（另建 smoke） | 現有測試仍需 `upload-progress`/`upload-success`/`video-preview`/`video-controls` 等未實作掛鉤；只有「選檔→顯示檔名」可測 → 改由新 `upload-smoke.test.ts` 覆蓋 |
| `editor/*` | 4 | 無（時間軸/片段/播放器編輯器未實作） | quarantine | 編輯器 UI 未實作 |
| `thumbnails/*` | 3 | 無（縮圖產生器未實作） | quarantine | 縮圖功能未實作 |
| `error-handling/*` | 2 | 無（頻寬/資源限制 UI 未實作） | quarantine | 錯誤處理 UI 未實作 |
| `integration/*` | 2 | 無（依賴上述多項） | quarantine | 完整流程依賴未實作功能 |
| `cross-browser/*` | 4 | 無（跨瀏覽器跑上述流程） | quarantine | 依賴未實作的播放器/上傳掛鉤 |

## 保留集（green）

- `navigation/01-homepage.test.ts`（no-auth）— 首頁 smoke。
- `video/upload/upload-smoke.test.ts`（auth，新增）— 登入 → `/upload-video` dropzone 可見 →
  `setInputFiles`（記憶體 `video/mp4`）→ 顯示檔名。同時驗證整條 harness（auth setup → storageState → 受保護頁）。

## Backlog（解除 quarantine 的條件）

每個 quarantine 檔頭已註明原因。當對應功能（播放器、時間軸/片段編輯器、縮圖、上傳進度/錯誤 UI…）
實作並提供對應 `data-testid` 後，將該檔的 `test.describe.skip` 改回 `test.describe` 並逐案對齊真實 UI。
