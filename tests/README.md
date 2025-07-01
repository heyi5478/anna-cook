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