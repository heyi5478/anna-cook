## ADDED Requirements

### Requirement: 必須導入 Content-Security-Policy
應用程式 SHALL 提供 CSP：先以 `Content-Security-Policy-Report-Only` 收集違規，穩定後以 `Content-Security-Policy` 強制，且涵蓋既有必要來源（Vimeo、GTM、後端圖片）而不破壞功能。

#### Scenario: 導入初期（report-only）
- **WHEN** CSP 以 report-only 模式部署
- **THEN** 既有頁面功能正常，違規以報告收集而不被封鎖

#### Scenario: 強制階段
- **WHEN** CSP 改為強制模式
- **THEN** 未列入白名單的 inline/外部來源被封鎖，Vimeo 播放器與 GTM 仍正常運作
