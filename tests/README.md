# Playwright 測試說明

## 🚀 快速開始

### 安裝瀏覽器
```bash
npx playwright install
```

### 執行測試
```bash
# 執行所有測試
npm run test:e2e

# 使用 UI 模式
npm run test:e2e:ui

# 執行特定測試
npx playwright test tests/e2e/navigation/01-homepage.test.ts
```

## 📁 目錄結構

- `tests/e2e/` - E2E 測試檔案
- `tests/helpers/` - 測試助手函式
- `tests/config/` - 測試配置
- `tests/.auth/` - 認證狀態檔案（不提交到 git）

## 🔧 環境變數

在 `.env.local` 中設定：
```
TEST_USER_EMAIL=your-test-email@example.com
TEST_USER_PASSWORD=your-test-password
```

## 🔑 認證（auth setup）

需認證的測試依賴 `tests/auth.setup.ts` 產生的 `tests/.auth/user.json`（由 `setup` 專案先跑）。
它以**真實 `/signin-email` 流程**登入：填入帳密後，透過表單本身使用的登入 API 送出，
成功判斷為「登入 API 200 + `/api/auth/check` 200 + 取得 `token` cookie」。

- 憑證**必須**由環境變數提供，缺少時 setup 會明確失敗（不使用任何寫死值）：
  ```bash
  TEST_USER_EMAIL=... TEST_USER_PASSWORD=... npm run test:e2e
  ```
  （Playwright 不會自動載入 `.env.local`，請走 shell env 或你的 env 管理工具。）

## 🖥️ 對「本機當前程式碼」跑（PR gating）

e2e 的價值是在合併/部署前擋回歸，因此應對**當前程式碼**跑，而非已部署的 PROD。
可用 `E2E_BASE_URL` 覆寫 baseURL 指向本機自建的伺服器（設定後會自動略過內建 webServer）：

```bash
# 另起一個載入 .env 的本機伺服器（例：port 3002），再讓測試指向它
E2E_BASE_URL=http://localhost:3002 TEST_USER_EMAIL=... TEST_USER_PASSWORD=... \
  npx playwright test --project=chromium-auth
```

> ⚠️ 後端注意：`.env` 的 `NEXT_PUBLIC_API_BASE_URL_DEV` 目前**缺少 `/api`**（PROD 的
> `NEXT_PUBLIC_API_BASE_URL` 有），dev 模式登入會打到 `/auth/login` 而得到 401。對本機 dev
> 驗證時請覆寫為含 `/api` 的值（`NEXT_PUBLIC_API_BASE_URL_DEV=https://annacook.rocket-coding.com/api`）。
>
> ⚠️ DEV 與 PROD **共用同一後端**，沒有獨立 staging；請只用「非寫入」測試 + 專用測試帳號，避免污染正式資料。

## 🧟 Quarantine 政策

`tests/e2e/video/**` 目前有 18 個測試檔瞄準**尚未實作**的功能（播放器、時間軸/片段編輯器、
縮圖、上傳進度/錯誤 UI…），已用 **`test.describe.skip`** quarantine（檔頭註明原因），保留為 backlog、
不刪除；待功能實作並提供對應 `data-testid` 後再逐案解除。分類詳見
`openspec/changes/fix-e2e-test-suite/triage.md`。目前的綠燈保留集：`navigation/01-homepage.test.ts`
與 `video/upload/upload-smoke.test.ts`。

## 📖 測試結構

### 助手函式
- `test-base.ts` - 基礎測試工具和 fixtures
- `assertion-helpers.ts` - 斷言助手函式
- `test-config.ts` - 測試環境配置

### 測試類型
- **Navigation** - 頁面導覽測試
- **Auth** - 認證相關測試  
- **Recipes** - 食譜功能測試
- **Video** - 影片相關測試
- **User** - 用戶功能測試

## 🛠️ 撰寫測試

### 基本測試範例
```typescript
import { test, expect, waitForPageLoad } from '../helpers/test-base';
import { expectPageTitle } from '../helpers/common/assertion-helpers';

test('測試範例', async ({ page }) => {
  await page.goto('/');
  await waitForPageLoad(page);
  await expectPageTitle(page, '頁面標題');
});
```

### 使用配置
```typescript
import { getConfig } from '../config/test-config';

const config = getConfig();
const testUser = config.testUser;
```

## 🔍 調試測試

### UI 模式
```bash
npx playwright test --ui
```

### 偵錯模式
```bash
npx playwright test --debug
```

### 產生測試報告
```bash
npx playwright show-report
``` 