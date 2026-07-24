## 1. 認證 Foundation（e2e-auth-provisioning）

- [x] 1.1 修 `playwright.config.ts`：讓 `setup` 專案抓得到 `tests/auth.setup.ts`（`setup` 專案給定 `testDir: './tests'` + `testMatch: /auth\.setup\.ts/`，或把檔案移進 `tests/e2e/`）— 已驗證 `--project=setup --list` 由 0 → 1 test
- [x] 1.2 改寫 `tests/auth.setup.ts`：改走 `/signin-email`（非 `/login`），以 placeholder 定位 email／password 欄位；**送出改由頁面內呼叫表單本身使用的登入 API**（approach B — 避免 UI hydration/analytics flaky，符合 Playwright auth setup 建議）
- [x] 1.3 憑證改讀環境變數 `TEST_USER_EMAIL` / `TEST_USER_PASSWORD`；缺少時明確拋錯，**不**寫死密碼
- [x] 1.4 成功判斷改為「登入 API 200 + `/api/auth/check` 200 + 存在 `token` cookie」，移除對不存在的 `[data-testid="user-menu"]` 依賴
- [x] 1.5 驗證：`npx playwright test --project=setup --list` = 1（原 0）；執行後 setup 綠、產生含 `token` cookie 的 `tests/.auth/user.json`

> 註：此登入流程已於 2026-07-23 用測試帳號實測可行——`/api/auth/email/login` 回 200、發 `HttpOnly` `token` cookie、`/api/auth/check` 回 200；瀏覽器走 `/signin-email` 亦成功導回 `/`。本節為把該 spike 正式落地成可重現的 setup。

## 2. 現況盤點與分類（e2e-suite-alignment）

- [x] 2.1 逐檔對照 5 大類（`upload` / `editor` / `thumbnails` / `error-handling` / `integration` / `cross-browser`）與真實路由（`upload-video`、`recipe-video`、`recipe-draft-video` …）與元件，標記 keep / rewrite / quarantine — 決策：僅 upload 頁真實可測，其餘全 quarantine
- [x] 2.2 產出對照表：測試要求的 216 個 `data-testid` vs 現有 3 個 — 見 `triage.md`（3 個皆 Button 變體、非功能掛鉤；抽樣功能掛鉤 0 命中）
- [x] 2.3 未實作功能的測試 → `test.describe.skip`（比 beforeEach+test.skip 乾淨，連 before/afterEach 一併跳過，避免對未導頁的 page 清理而報錯），原因記於檔頭註解；已 quarantine 全部 18 個 video 測試檔

## 3. 保留 upload 真功能為綠（e2e-suite-alignment）

- [x] 3.1 在真實元件補少量穩定 `data-testid`：`UploadArea.tsx` 的 `#video-upload` input → `video-upload-input`；外層拖放區 → `video-upload-dropzone`（已於 fresh dev server 驗證 testids 生效、smoke 通過）
- [x] 3.2 修 `tests/helpers/video/video-upload.ts`：`toBeVisible` → `toBeAttached`，改以 `setInputFiles` 直接設定隱藏 input
- [x] 3.3 供裝 fixture：改用 smoke 測試內的記憶體 `video/mp4` buffer（bundled ffmpeg 無法產 mp4/webm，且不手造二進位）— 已寫入 `upload-smoke.test.ts`
- [x] 3.4 新增 `upload-smoke.test.ts` 於 `chromium-auth` 綠燈 — 已於本機 fresh dev server（:3002）驗證通過（setup + smoke = 2 passed）

## 4. 收斂與驗收

- [x] 4.1 chromium-engine 全跑（no-auth + auth + mobile）：5 passed（setup+homepage+smoke×2）、**292 skipped**、**0 failures** — ⚠️ firefox/webkit 引擎未安裝（`npx playwright install firefox webkit` 後可補跑，測試邏輯相同）
- [x] 4.2 更新 `tests/README.md`：說明認證前置（env 憑證 + E2E_BASE_URL）、fixture、quarantine 政策
- [x] 4.3 `openspec validate fix-e2e-test-suite --strict` 通過（valid）
