## ADDED Requirements

### Requirement: 授權決策不得依賴未驗證的 JWT claims
系統 MUST NOT 以未經簽章驗證的 JWT claims 作為授權或身分判斷依據；此類判斷 SHALL 以會驗簽的後端結果為準。

#### Scenario: 偽造 JWT claims
- **WHEN** 使用者提供一個簽章無效、但 payload 聲稱為他人身分的 JWT
- **THEN** 系統不因該 payload 給予對應權限或身分，授權以後端驗簽結果為準
