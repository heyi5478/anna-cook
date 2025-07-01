import { test, expect } from '@playwright/test';
import { waitForNetworkIdle } from '../../../helpers/common/wait-utils';
import { getTestFilePath } from '../../../helpers/common/test-data';

/**
 * 錯誤恢復測試
 */
test.describe('錯誤恢復功能', () => {
  /**
   * 每個測試前的準備工作
   */
  test.beforeEach(async ({ page }) => {
    // 導航到影片編輯頁面
    await page.goto('/recipe-draft-video');
    await waitForNetworkIdle(page);
  });

  /**
   * 測試網路中斷後的恢復機制
   */
  test('應該在網路中斷後正確恢復功能', async ({ page }) => {
    const descriptionInput = page.locator('[data-testid="step-description"]');
    const fileInput = page.locator('[data-testid="video-file-input"]');
    const submitButton = page.locator('[data-testid="submit-form-btn"]');
    const networkStatus = page.locator('[data-testid="network-status"]');
    const retryButton = page.locator('[data-testid="retry-btn"]');

    // 準備測試資料
    const validVideo = getTestFilePath('test-video-short.mp4');
    await fileInput.setInputFiles(validVideo);
    await page.waitForTimeout(1000);

    await descriptionInput.fill('測試網路中斷恢復的烹飪步驟說明');

    // 模擬網路中斷
    await page.context().setOffline(true);
    await page.waitForTimeout(1000);

    // 檢查網路狀態指示
    if (await networkStatus.isVisible()) {
      await expect(networkStatus).toContainText('網路連線中斷');
      await expect(networkStatus).toHaveClass(/offline/);
    }

    // 嘗試在離線狀態下提交
    await submitButton.click();
    await page.waitForTimeout(500);

    // 檢查離線錯誤訊息
    const offlineError = page.locator('[data-testid="offline-error"]');
    await expect(offlineError).toBeVisible();
    await expect(offlineError).toContainText('網路連線中斷，請檢查網路設定');

    // 恢復網路連線
    await page.context().setOffline(false);
    await page.waitForTimeout(2000);

    // 檢查網路恢復狀態
    if (await networkStatus.isVisible()) {
      await expect(networkStatus).toContainText('網路連線已恢復');
      await expect(networkStatus).toHaveClass(/online/);
    }

    // 檢查重試按鈕功能
    if (await retryButton.isVisible()) {
      await retryButton.click();
    } else {
      await submitButton.click();
    }

    // 設定 API 攔截來模擬成功回應
    await page.route('**/api/recipes/**/submit-draft', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: '提交成功',
        }),
      });
    });

    await page.waitForTimeout(2000);

    // 檢查提交成功
    const successMessage = page.locator('[data-testid="success-message"]');
    await expect(successMessage).toBeVisible();

    console.log('網路中斷恢復測試完成');
  });

  /**
   * 測試瀏覽器重新載入後的狀態恢復
   */
  test('應該在瀏覽器重新載入後恢復狀態', async ({ page }) => {
    const descriptionInput = page.locator('[data-testid="step-description"]');
    const fileInput = page.locator('[data-testid="video-file-input"]');

    // 填寫表單資料
    const originalDescription =
      '這是需要恢復的烹飪步驟說明，包含詳細的操作流程';
    await descriptionInput.fill(originalDescription);

    const validVideo = getTestFilePath('test-video-short.mp4');
    await fileInput.setInputFiles(validVideo);
    await page.waitForTimeout(2000);

    // 設定時間標記
    const timeMarkButton = page.locator('[data-testid="add-time-mark"]');
    if (await timeMarkButton.isVisible()) {
      await timeMarkButton.click();
      const timeMarkInput = page.locator('[data-testid="time-mark-input"]');
      await timeMarkInput.fill('01:30');

      const confirmButton = page.locator('[data-testid="confirm-time-mark"]');
      await confirmButton.click();
    }

    // 檢查資料是否保存到 localStorage
    const beforeReloadData = await page.evaluate(() => {
      return {
        description: localStorage.getItem('draft-description'),
        fileName: localStorage.getItem('uploaded-file-name'),
        timeMark: localStorage.getItem('time-marks'),
        timestamp: localStorage.getItem('last-save-timestamp'),
      };
    });

    expect(beforeReloadData.description).toBeTruthy();
    expect(beforeReloadData.timestamp).toBeTruthy();

    // 重新載入頁面
    await page.reload();
    await waitForNetworkIdle(page);

    // 檢查狀態恢復
    const restoredDescription = await descriptionInput.inputValue();
    expect(restoredDescription).toBe(originalDescription);

    // 檢查檔案狀態恢復
    const fileStatus = page.locator('[data-testid="file-status"]');
    if (await fileStatus.isVisible()) {
      await expect(fileStatus).toContainText('檔案已恢復');
    }

    // 檢查時間標記恢復
    const timeMarkDisplay = page.locator('[data-testid="time-mark-display"]');
    if (await timeMarkDisplay.isVisible()) {
      await expect(timeMarkDisplay).toContainText('01:30');
    }

    // 檢查恢復後的 localStorage 資料
    const afterReloadData = await page.evaluate(() => {
      return {
        description: localStorage.getItem('draft-description'),
        timestamp: localStorage.getItem('last-save-timestamp'),
      };
    });

    expect(afterReloadData.description).toBe(originalDescription);
    expect(afterReloadData.timestamp).toBeTruthy();

    console.log('瀏覽器重新載入狀態恢復測試完成');
  });

  /**
   * 測試 API 錯誤後的恢復機制
   */
  test('應該在 API 錯誤後提供恢復選項', async ({ page }) => {
    const descriptionInput = page.locator('[data-testid="step-description"]');
    const fileInput = page.locator('[data-testid="video-file-input"]');
    const submitButton = page.locator('[data-testid="submit-form-btn"]');
    const errorMessage = page.locator('[data-testid="api-error-message"]');
    const retryButton = page.locator('[data-testid="retry-btn"]');

    // 準備測試資料
    await descriptionInput.fill('測試 API 錯誤恢復的烹飪步驟');
    const validVideo = getTestFilePath('test-video-short.mp4');
    await fileInput.setInputFiles(validVideo);
    await page.waitForTimeout(1000);

    // 模擬 API 錯誤
    await page.route('**/api/recipes/**/submit-draft', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal Server Error',
          message: '伺服器發生錯誤，請稍後再試',
        }),
      });
    });

    // 嘗試提交
    await submitButton.click();
    await page.waitForTimeout(2000);

    // 檢查錯誤訊息顯示
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('伺服器發生錯誤');

    // 檢查重試按鈕
    await expect(retryButton).toBeVisible();
    await expect(retryButton).toBeEnabled();

    // 檢查表單資料是否保持
    const preservedDescription = await descriptionInput.inputValue();
    expect(preservedDescription).toBe('測試 API 錯誤恢復的烹飪步驟');

    // 修正 API 回應
    await page.unroute('**/api/recipes/**/submit-draft');
    await page.route('**/api/recipes/**/submit-draft', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: '提交成功',
        }),
      });
    });

    // 重試提交
    await retryButton.click();
    await page.waitForTimeout(2000);

    // 檢查成功訊息
    const successMessage = page.locator('[data-testid="success-message"]');
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toContainText('提交成功');

    console.log('API 錯誤恢復測試完成');
  });

  /**
   * 測試異常情況下的使用者體驗
   */
  test('應該在異常情況下維持良好的使用者體驗', async ({ page }) => {
    const descriptionInput = page.locator('[data-testid="step-description"]');
    const submitButton = page.locator('[data-testid="submit-form-btn"]');
    const loadingIndicator = page.locator('[data-testid="loading-indicator"]');

    // 填寫表單
    await descriptionInput.fill('測試異常情況處理的烹飪步驟');

    // 測試超長請求處理
    await page.route('**/api/recipes/**', async (route) => {
      // 延遲 10 秒回應
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 10000);
      });
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await submitButton.click();

    // 檢查載入指示器
    await expect(loadingIndicator).toBeVisible();
    await expect(submitButton).toBeDisabled();

    // 檢查使用者是否可以取消操作
    const cancelButton = page.locator('[data-testid="cancel-submit-btn"]');
    if (await cancelButton.isVisible()) {
      await cancelButton.click();

      // 檢查取消後的狀態
      await expect(loadingIndicator).not.toBeVisible();
      await expect(submitButton).toBeEnabled();
    }

    console.log('異常情況使用者體驗測試完成');
  });
});
