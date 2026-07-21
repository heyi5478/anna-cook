# api-error-handling Specification

## Purpose
TBD - created by archiving change security-hardening-tier-a. Update Purpose after archive.
## Requirements
### Requirement: API 錯誤回應不得洩漏內部細節
API route 發生例外時 SHALL 回傳一般化的錯誤訊息，且 MUST NOT 在回應中包含內部例外訊息（如 `error.message`）、堆疊追蹤或後端原始回應內容。內部細節 SHALL 改記錄於伺服器端日誌。

#### Scenario: 處理請求時擲出例外
- **WHEN** 某 API route 在處理或代理請求時擲出例外
- **THEN** 客戶端收到不含內部例外字串的一般化錯誤訊息，且詳細內容記錄於伺服器端 `console.error`

