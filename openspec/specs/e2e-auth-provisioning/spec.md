# e2e-auth-provisioning Specification

## Purpose
TBD - created by archiving change fix-e2e-test-suite. Update Purpose after archive.
## Requirements
### Requirement: 認證 setup 必須真的產生已登入的 storageState

e2e 測試框架 SHALL 透過驅動真實的 `/signin-email` 登入流程，產生 `tests/.auth/user.json`（含有效的認證 `token` cookie），供所有需認證的 Playwright 專案以 `storageState` 載入。`setup` 專案 SHALL 能被 Playwright 探測到（匹配非 0 個測試）。

#### Scenario: setup 執行後產生 storageState

- **WHEN** `setup` 專案執行
- **THEN** 以 `/signin-email` 成功登入，並將含 `token` cookie 的 storageState 寫入 `tests/.auth/user.json`

#### Scenario: setup 專案能被 Playwright 探測

- **WHEN** 執行 `npx playwright test --project=setup --list`
- **THEN** 匹配到 `tests/auth.setup.ts`（總數非 0），而非回報 `Total: 0 tests`

#### Scenario: 認證檔缺失時不再是 ENOENT 連鎖

- **WHEN** auth 專案（如 `chromium-auth`）在 `setup` 依賴執行後啟動
- **THEN** `storageState` 檔存在且可載入，測試不再以 `ENOENT: ./tests/.auth/user.json` 失敗

### Requirement: 認證憑證不得寫死於版控

認證憑證 SHALL 來自環境變數 `TEST_USER_EMAIL` 與 `TEST_USER_PASSWORD`；已提交的 `auth.setup.ts` MUST NOT 含寫死的密碼。缺少憑證時，setup SHALL 以清楚訊息失敗，而非退回使用寫死值。

#### Scenario: 憑證由環境變數提供

- **WHEN** 已設定 `TEST_USER_EMAIL` / `TEST_USER_PASSWORD`
- **THEN** setup 以該憑證登入，且原始碼中不出現明文密碼

#### Scenario: 缺少憑證時明確失敗

- **WHEN** 未設定 `TEST_USER_EMAIL` / `TEST_USER_PASSWORD`
- **THEN** setup 以「缺少測試憑證」的清楚訊息失敗，且不使用任何寫死密碼

### Requirement: 成功判斷以真實登入結果為準

登入成功 SHALL 以「導回 `/` 且持有認證 `token` cookie」判定，MUST NOT 依賴應用程式中不存在的 UI 掛鉤（例如 `[data-testid="user-menu"]`）。

#### Scenario: 以導頁與 cookie 判定成功

- **WHEN** 於 `/signin-email` 提交有效憑證
- **THEN** 頁面導回 `/` 且瀏覽器 context 具備 `token` cookie，據此判定登入成功

