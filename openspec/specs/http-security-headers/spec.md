# http-security-headers Specification

## Purpose
TBD - created by archiving change security-hardening-tier-a. Update Purpose after archive.
## Requirements
### Requirement: 全站回應必須帶基礎安全性標頭
應用程式 SHALL 對所有頁面與 API 回應附上下列標頭：`X-Content-Type-Options: nosniff`、`X-Frame-Options: SAMEORIGIN`、`Referrer-Policy: strict-origin-when-cross-origin`、`Strict-Transport-Security`（含 max-age）、以及 `Permissions-Policy`（未使用之瀏覽器功能一律停用）。

#### Scenario: 一般頁面回應
- **WHEN** 客戶端請求任一頁面或 API
- **THEN** 回應包含上述所有安全性標頭

### Requirement: 不得洩漏框架指紋
應用程式 MUST NOT 回傳 `X-Powered-By` 標頭。

#### Scenario: 檢視回應標頭
- **WHEN** 檢視任一回應的標頭
- **THEN** 回應中不存在 `X-Powered-By` 標頭

