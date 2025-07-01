import { test as setup, expect } from '@playwright/test';

/**
 * 認證設定 - 為所有測試準備登入狀態
 */
setup('authenticate', async ({ page }) => {
  // 前往登入頁面
  await page.goto('/login');

  // 執行登入流程（根據實際登入流程調整）
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'testpassword');
  await page.click('button[type="submit"]');

  // 等待登入完成
  await page.waitForURL('/');

  // 驗證登入成功
  await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();

  // 保存認證狀態
  await page.context().storageState({ path: './tests/.auth/user.json' });
});
