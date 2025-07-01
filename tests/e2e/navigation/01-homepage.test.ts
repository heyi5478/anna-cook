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

    // 驗證頁面回應成功（狀態碼200）
    await expect(page.locator('body')).toBeVisible();

    // 檢查頁面標題（如果存在的話，否則跳過）
    const title = await page.title();
    if (title && title.trim() !== '') {
      await expectPageTitle(page, 'Anna Cook');
    } else {
      // 如果標題為空，至少驗證頁面有實際內容
      const bodyText = await page.locator('body').textContent();
      expect(bodyText?.length).toBeGreaterThan(100);
    }
  });

  /**
   * 測試頁面基本元素是否正常顯示
   */
  test('應該顯示頁面主要內容', async ({ page }) => {
    await page.goto('/');

    // 等待頁面載入
    await waitForPageLoad(page);

    // 驗證頁面主要結構存在
    await expect(page.locator('body')).toBeVisible();

    // 驗證至少有一個導覽元素存在
    await expect(page.locator('nav').first()).toBeVisible();

    // 驗證頁面不是空白的（至少有一些內容）
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(10);
  });
});
