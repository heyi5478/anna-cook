import { test, expect } from '@playwright/test';

// 首頁基本功能測試
test.describe('首頁功能', () => {
  // 測試首頁是否正常載入
  test('應該能夠正常載入首頁', async ({ page }) => {
    await page.goto('/');

    // 驗證頁面標題
    await expect(page).toHaveTitle(/Anna Cook/);

    // 驗證頁面載入完成
    await expect(page.locator('body')).toBeVisible();
  });

  // 測試導覽列是否存在
  test('應該顯示導覽列', async ({ page }) => {
    await page.goto('/');

    // 等待頁面載入
    await page.waitForLoadState('networkidle');

    // 驗證導覽列存在（根據您的實際結構調整選擇器）
    await expect(page.locator('nav')).toBeVisible();
  });
});
