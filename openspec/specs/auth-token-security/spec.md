# auth-token-security Specification

## Purpose
TBD - created by archiving change security-hardening-tier-a. Update Purpose after archive.
## Requirements
### Requirement: JWT token 僅存於 HttpOnly cookie
系統 SHALL 只把認證 token 存放於 HttpOnly cookie；MUST NOT 將 token 寫入 `localStorage` 或任何 JavaScript 可讀的 cookie。與 token 無關的非敏感 UI 狀態（如 `userData`）不受此限。

#### Scenario: 登入後檢視客戶端儲存
- **WHEN** 使用者成功登入
- **THEN** token 只存在於 HttpOnly cookie，`localStorage` 與 `document.cookie` 皆不含 token

### Requirement: 不得將 token 寫入日誌
系統 MUST NOT 把認證 token（或含 token 的完整 cookie 字串）寫入伺服器端或客戶端日誌。

#### Scenario: 設定或換發 token cookie
- **WHEN** 伺服器端設定或換發 token cookie
- **THEN** 日誌中不出現 token 值或含 token 的完整 cookie 字串

