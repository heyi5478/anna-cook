## ADDED Requirements

### Requirement: OAuth 流程必須使用並驗證 state
Google OAuth 授權流程 SHALL 產生不可預測的 `state` 並在 callback 驗證，未通過驗證的回調 MUST 被拒絕。

#### Scenario: callback 的 state 不符或缺失
- **WHEN** OAuth callback 帶回的 `state` 與發起時不符或缺失
- **THEN** 系統拒絕該回調，不建立登入狀態
