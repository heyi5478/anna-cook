# dependency-security Specification

## Purpose
TBD - created by archiving change security-hardening-tier-b. Update Purpose after archive.
## Requirements
### Requirement: 不得含已知高風險相依漏洞
專案 SHALL 保持相依套件無已知的 high/critical 等級安全漏洞，框架維持在受支援版本。

#### Scenario: 執行相依稽核
- **WHEN** 在有網路的環境執行 `npm audit`
- **THEN** 無 high 或 critical 等級的未處理漏洞

