## ADDED Requirements

### Requirement: e2e 測試只覆蓋已實作的功能

e2e 套件 SHALL 僅對應用程式中**確實存在**的功能與 selector 進行斷言。瞄準尚未實作功能（例如自製播放器、時間軸／片段編輯器、縮圖產生器、頻寬／緩衝監測）的測試 MUST 以 `test.skip` 或 `test.describe.skip`（整檔）並註明原因加以 quarantine，並列入 backlog，而非放任其失敗。全套執行結果 SHALL 為「保留集通過、quarantine 集 skipped、0 個非預期失敗」。

#### Scenario: 未實作功能的測試被 quarantine

- **WHEN** 某測試瞄準應用程式中不存在的功能或 `data-testid`（如 `timeline-container`、`bandwidth-indicator`）
- **THEN** 該（檔）測試以 `test.describe.skip`（或 `test.skip`）標記、檔頭註明原因並記錄於 backlog，不計為失敗

#### Scenario: 全套執行收斂

- **WHEN** 執行 `npx playwright test`
- **THEN** 保留集全數通過、quarantine 集顯示為 skipped、且回報 0 個非預期失敗（unexpected）

### Requirement: 保留的真實流程必須有穩定且有紀錄的測試 selector

對保留在套件中的真實流程，應用程式 SHALL 在其實際互動的元素上提供穩定、有紀錄的 `data-testid`（例如影片上傳的 input 與拖放區）。測試對於**隱藏**的檔案 input MUST 以 `setInputFiles` 直接設定檔案，而非斷言其可見。

#### Scenario: 上傳 input 具穩定掛鉤且以 setInputFiles 操作

- **WHEN** 上傳測試選取影片檔
- **THEN** 測試以 `data-testid`（如 `video-upload-input`）定位真實的 `#video-upload` 隱藏 input，並以 `setInputFiles` 設定檔案，而不斷言該 input 可見

### Requirement: 測試素材必須可供裝

上傳相關測試所需的 fixture 影片 SHALL 以可重現方式供裝（提交小型樣本，或於 setup 動態產生），使測試不因缺檔而失敗，且 `getDefaultTestVideo()` 回傳的檔名與實際素材一致。

#### Scenario: fixture 影片就位

- **WHEN** 上傳測試在 `beforeEach` 取得 `getDefaultTestVideo()` 的路徑
- **THEN** `tests/fixtures/videos/` 內存在對應的小型影片檔，測試可據以上傳
