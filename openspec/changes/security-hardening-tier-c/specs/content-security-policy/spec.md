## ADDED Requirements

### Requirement: 必須導入 Content-Security-Policy
應用程式 SHALL 提供 CSP：先以 `Content-Security-Policy-Report-Only` 收集違規，穩定後以 `Content-Security-Policy` 強制，且涵蓋既有必要來源（Vimeo、GTM、後端圖片）而不破壞功能。

#### Scenario: 導入初期（report-only）
- **WHEN** CSP 以 report-only 模式部署
- **THEN** 既有頁面功能正常，違規以報告收集而不被封鎖

#### Scenario: 強制階段
- **WHEN** CSP 改為強制模式
- **THEN** 未列入白名單的 inline/外部來源被封鎖，Vimeo 播放器與 GTM 仍正常運作

### Requirement: CSP 不得破壞 PWA 的 Service Worker 與 manifest
CSP 的來源白名單 SHALL 包含 `worker-src 'self'` 與 `manifest-src 'self'`，使 `add-pwa-support` 引入的 Service Worker 可註冊、Web App Manifest 可載入。CSP 轉為強制前，PWA 的 SW/manifest MUST 已就位，以避免破壞安裝與啟動。

#### Scenario: PWA 資產在 CSP 下正常
- **WHEN** CSP（report-only 或強制）部署，且站台已註冊 Service Worker、連結 manifest
- **THEN** Service Worker 註冊成功、manifest 正常載入，皆未被 CSP 封鎖
