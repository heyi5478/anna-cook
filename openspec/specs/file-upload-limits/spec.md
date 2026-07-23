# file-upload-limits Specification

## Purpose
TBD - created by archiving change security-hardening-tier-b. Update Purpose after archive.
## Requirements
### Requirement: 檔案上傳必須有大小與型別界限
上傳端點 SHALL 設定 `maxFileSize` 上限並限制允許的 MIME 型別；超過大小或非允許型別的上傳 MUST 被拒絕。

#### Scenario: 上傳超過大小上限的檔案
- **WHEN** 使用者上傳超過設定 `maxFileSize` 的檔案
- **THEN** 伺服器拒絕該請求並回傳錯誤，且不會把整檔載入記憶體

#### Scenario: 上傳非允許型別
- **WHEN** 使用者上傳不在白名單內的 MIME 型別
- **THEN** 伺服器拒絕該請求

### Requirement: 上傳內容不得整檔載入記憶體
上傳處理 SHALL 以串流方式轉發到後端，MUST NOT 使用 `fs.readFileSync` 一次性讀入整個檔案。

#### Scenario: 上傳大型影片
- **WHEN** 使用者上傳大型影片檔
- **THEN** 內容以串流轉發，記憶體用量不隨檔案大小線性成長

