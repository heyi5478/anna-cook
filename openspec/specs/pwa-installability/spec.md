# pwa-installability Specification

## Purpose
TBD - created by archiving change add-pwa-support. Update Purpose after archive.
## Requirements
### Requirement: 站台必須可安裝為 PWA
應用程式 SHALL 提供有效的 Web App Manifest（含 name、192 與 512 icons、`display: standalone`、start_url）與最小 Service Worker，使支援的瀏覽器可將站台安裝到主畫面並以 standalone 模式啟動。

#### Scenario: Android 可安裝
- **WHEN** 使用者以 Android Chrome 造訪站台
- **THEN** 瀏覽器提供安裝（加到主畫面）選項，安裝後以 standalone 模式（無瀏覽器網址列）啟動

#### Scenario: iOS 加到主畫面
- **WHEN** 使用者以 iOS Safari 選擇「加入主畫面」
- **THEN** 以自訂 `apple-touch-icon` 與 standalone 模式啟動，而非網頁截圖

### Requirement: manifest 與 SW 不得破壞既有安全標頭
Manifest 與 Service Worker SHALL 為同源（`self`）資產；其導入 MUST NOT 削弱既有 `http-security-headers`，且需與 `content-security-policy` 的 `worker-src` / `manifest-src` 白名單一致。

#### Scenario: 同源載入且與 CSP 一致
- **WHEN** 站台載入 manifest 並註冊 Service Worker，且 CSP 已放行 `worker-src 'self'` / `manifest-src 'self'`
- **THEN** 兩者皆自同源載入並正常運作，未被 CSP 封鎖

