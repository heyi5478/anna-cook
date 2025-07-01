import { test, expect, waitForPageLoad } from '../../helpers/test-base';
import { expectPageTitle } from '../../helpers/common/assertion-helpers';

/**
 * 首頁基本功能測試
 */
test.describe('首頁功能', () => {
  /**
   * 測試首頁是否正常載入
   */
  test('應該能夠正常載入首頁', async ({ page }) => {
    await page.goto('/');

    // 等待頁面完全載入
    await waitForPageLoad(page);

    // 驗證頁面標題
    await expectPageTitle(page, 'Anna Cook');

    // 驗證頁面載入完成
    await expect(page.locator('body')).toBeVisible();
  });

  /**
   * 測試導覽列是否存在
   */
  test('應該顯示導覽列', async ({ page }) => {
    await page.goto('/');

    // 等待頁面載入
    await waitForPageLoad(page);

    // 驗證導覽列存在
    await expect(page.locator('nav')).toBeVisible();
  });
});
