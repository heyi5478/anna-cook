## Why

Playwright e2e「一堆 fail」的根因不是最近壞掉，而是**從未接上**：

- `playwright.config.ts` 的 `setup` 專案 `testDir: './tests/e2e'` 但 `testMatch: /.*\.setup\.ts/`，而 `tests/auth.setup.ts` 在 `tests/e2e/` **之外** → `setup` 匹配 **0 個測試**（`playwright test --project=setup --list` 回報 `Total: 0`）→ `tests/.auth/user.json` **從未產生** → 148 個需認證測試 × 4 個 auth 專案（**~592 個 run**）全在載入 storageState 時 `ENOENT` 死掉。只有 2 個首頁 no-auth 測試是綠的。
- 更深一層的落差：測試依賴 **216 個** 不同的 `data-testid`，但 App 只有 **3 個**（皆為 Button 變體 `default-btn` / `destructive-btn` / `outline-btn`，非功能掛鉤）。抽樣 `fullscreen-button`、`timeline-container`、`segment-list`、`thumbnail-grid`、`bandwidth-indicator`、`buffer-progress`、`drag-drop-area`、`video-player` 於 `src/` **0 命中**——測試描述的是一個**大部分尚未實作**的 App。

診斷於 2026-07-23：以 chrome-devtools 實測登入後的 `/upload-video`，**畫面正常**（三步驟精靈、「上傳您的影片」、可用的 `<input type="file" accept="video/*" id="video-upload">`），失敗純因測試 selector（`video-upload-input`）、斷言（對 `hidden` input 斷 `toBeVisible`）、與缺 fixture 影片。對應 e2e 修復需求。

## What Changes

- **認證 Foundation**：修 `playwright.config.ts` 讓 `setup` 專案抓得到 `tests/auth.setup.ts`；改寫 `auth.setup.ts` 走真實 `/signin-email` 流程、憑證改讀環境變數、成功判斷改為「導回 `/` 且持有 `token` cookie」（移除對不存在的 `[data-testid="user-menu"]` 依賴）。
- **分類重整（triage）**：逐檔對照真實路由/元件，把測試標記為 keep / rewrite / **quarantine**；未實作功能的測試以 `test.skip` + 原因保留為 backlog，不追求讓空氣功能變綠。
- **保留最小綠集**：對真實存在的 `upload/*` 流程，在真實元件補**少量**穩定 `data-testid`、修 hidden-input 斷言（改用 `setInputFiles`）、供裝 fixture 影片。

### Non-Goals

- **不**為了滿足生成測試而新建 216 個測試掛鉤，或整組尚未實作的功能（自製播放器、時間軸/片段編輯器、縮圖產生器、頻寬/緩衝監測）。
- **不**變更任何產品行為；本變更僅動測試基礎建設與（少量）測試掛鉤。

## Capabilities

### New Capabilities

- `e2e-auth-provisioning`：e2e 以真實 `/signin-email` + 環境變數憑證供裝「已登入」的 storageState，且 `setup` 專案可被 Playwright 探測到。
- `e2e-suite-alignment`：e2e 僅覆蓋**已實作**的功能；未實作者一律 quarantine（skip + 原因）；保留的流程具穩定且有紀錄的 selector 與可供裝的 fixture。

### Modified Capabilities

_(無)_

## Impact

- **測試／設定**：`playwright.config.ts`、`tests/auth.setup.ts`、`tests/config/test-config.ts`、`tests/helpers/video/*`、`tests/fixtures/videos/`、`tests/README.md`
- **程式碼（少量）**：於真實上傳元件補 `data-testid`（`src/pages/upload-video` 及相關元件）
- **行為相容性**：不改動產品行為；僅新增測試掛鉤與測試基礎建設
- **CI**：需提供 `TEST_USER_EMAIL` / `TEST_USER_PASSWORD`（secrets）；非 CI 由既有 webServer 走 `localhost:3000`
- **相依**：認證流程依賴 `anna-cook-backend` 的 `/auth/login`（已於 2026-07-23 實測可用）
