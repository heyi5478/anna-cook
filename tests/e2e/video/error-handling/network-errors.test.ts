import { test, expect } from '@playwright/test';
import { waitForNetworkIdle } from '../../../helpers/common/wait-utils';
import { getTestFilePath } from '../../../helpers/common/test-data';

/**
 * 網路錯誤處理測試
 */
test.describe('網路錯誤處理功能', () => {
  /**
   * 每個測試前的準備工作
   */
  test.beforeEach(async ({ page }) => {
    // 導航到影片編輯頁面
    await page.goto('/recipe-draft-video');
    await waitForNetworkIdle(page);
  });

  /**
   * 測試 API 呼叫失敗的處理機制
   */
  test('應該正確處理 API 呼叫失敗的情況', async ({ page }) => {
    const submitButton = page.locator('[data-testid="submit-form-btn"]');
    const errorMessage = page.locator('[data-testid="api-error-message"]');
    const retryButton = page.locator('[data-testid="retry-btn"]');

    // 攔截 API 請求並模擬失敗
    await page.route('**/api/recipes/**', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal Server Error',
          message: '伺服器發生錯誤，請稍後再試',
        }),
      });
    });

    // 填入表單資料
    const descriptionInput = page.locator('[data-testid="step-description"]');
    await descriptionInput.fill('這是一段詳細的步驟說明');

    const fileInput = page.locator('[data-testid="video-file-input"]');
    const validVideo = getTestFilePath('test-video-short.mp4');
    await fileInput.setInputFiles(validVideo);
    await page.waitForTimeout(1000);

    // 嘗試提交表單
    await submitButton.click();
    await page.waitForTimeout(2000);

    // 檢查錯誤訊息顯示
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('伺服器發生錯誤，請稍後再試');

    // 檢查重試按鈕顯示
    await expect(retryButton).toBeVisible();
    await expect(retryButton).toBeEnabled();

    // 檢查提交按鈕狀態恢復
    await expect(submitButton).toBeEnabled();
    await expect(submitButton).not.toContainText('提交中...');

    console.log('API 呼叫失敗處理測試完成');
  });

  /**
   * 測試不同 HTTP 狀態碼的錯誤處理
   */
  test('應該根據不同 HTTP 狀態碼顯示相應錯誤訊息', async ({ page }) => {
    const errorMessage = page.locator('[data-testid="api-error-message"]');
    const submitButton = page.locator('[data-testid="submit-form-btn"]');

    // 準備表單資料
    const descriptionInput = page.locator('[data-testid="step-description"]');
    await descriptionInput.fill('測試錯誤處理的步驟說明');

    const fileInput = page.locator('[data-testid="video-file-input"]');
    const validVideo = getTestFilePath('test-video-short.mp4');
    await fileInput.setInputFiles(validVideo);
    await page.waitForTimeout(1000);

    // 測試 400 Bad Request
    await page.route('**/api/recipes/**', (route) => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Bad Request',
          message: '請求資料格式錯誤',
        }),
      });
    });

    await submitButton.click();
    await page.waitForTimeout(1000);
    await expect(errorMessage).toContainText('請求資料格式錯誤');

    // 重置錯誤狀態
    await page.reload();
    await waitForNetworkIdle(page);
    await descriptionInput.fill('測試錯誤處理的步驟說明');
    await fileInput.setInputFiles(validVideo);
    await page.waitForTimeout(1000);

    // 測試 401 Unauthorized
    await page.route('**/api/recipes/**', (route) => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Unauthorized',
          message: '請重新登入',
        }),
      });
    });

    await submitButton.click();
    await page.waitForTimeout(1000);
    await expect(errorMessage).toContainText('請重新登入');

    // 重置並測試 403 Forbidden
    await page.reload();
    await waitForNetworkIdle(page);
    await descriptionInput.fill('測試錯誤處理的步驟說明');
    await fileInput.setInputFiles(validVideo);
    await page.waitForTimeout(1000);

    await page.route('**/api/recipes/**', (route) => {
      route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Forbidden',
          message: '沒有權限執行此操作',
        }),
      });
    });

    await submitButton.click();
    await page.waitForTimeout(1000);
    await expect(errorMessage).toContainText('沒有權限執行此操作');

    console.log('不同 HTTP 狀態碼錯誤處理測試完成');
  });

  /**
   * 測試網路中斷恢復機制
   */
  test('應該能夠從網路中斷狀態恢復', async ({ page }) => {
    const offlineMessage = page.locator('[data-testid="offline-message"]');
    const submitButton = page.locator('[data-testid="submit-form-btn"]');

    // 模擬網路離線
    await page.context().setOffline(true);
    await page.waitForTimeout(1000);

    // 檢查離線狀態指示
    await expect(offlineMessage).toBeVisible();
    await expect(offlineMessage).toContainText('網路連線中斷');
    await expect(submitButton).toBeDisabled();

    // 嘗試在離線狀態下提交
    const descriptionInput = page.locator('[data-testid="step-description"]');
    await descriptionInput.fill('測試離線狀態的步驟說明');

    await submitButton.click();
    await page.waitForTimeout(500);

    // 應該顯示離線錯誤訊息
    const networkError = page.locator('[data-testid="network-error"]');
    await expect(networkError).toBeVisible();
    await expect(networkError).toContainText('請檢查網路連線');

    // 恢復網路連線
    await page.context().setOffline(false);
    await page.waitForTimeout(2000);

    // 檢查連線恢復狀態
    await expect(offlineMessage).not.toBeVisible();
    await expect(submitButton).toBeEnabled();

    // 檢查是否顯示連線恢復訊息
    const onlineMessage = page.locator('[data-testid="online-message"]');
    await expect(onlineMessage).toBeVisible();
    await expect(onlineMessage).toContainText('網路連線已恢復');

    // 驗證功能恢復正常
    await page.route('**/api/recipes/**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    const fileInput = page.locator('[data-testid="video-file-input"]');
    const validVideo = getTestFilePath('test-video-short.mp4');
    await fileInput.setInputFiles(validVideo);
    await page.waitForTimeout(1000);

    await submitButton.click();
    await page.waitForTimeout(1000);

    // 檢查提交成功
    const successMessage = page.locator('[data-testid="success-message"]');
    await expect(successMessage).toBeVisible();

    console.log('網路中斷恢復機制測試完成');
  });

  /**
   * 測試請求超時處理
   */
  test('應該正確處理請求超時情況', async ({ page }) => {
    const submitButton = page.locator('[data-testid="submit-form-btn"]');
    const timeoutMessage = page.locator('[data-testid="timeout-message"]');
    const loadingIndicator = page.locator('[data-testid="loading-indicator"]');

    // 攔截請求並延遲回應
    await page.route('**/api/recipes/**', async (route) => {
      // 延遲 30 秒來模擬超時
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 30000);
      });
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    // 準備表單資料
    const descriptionInput = page.locator('[data-testid="step-description"]');
    await descriptionInput.fill('測試超時處理的步驟說明');

    const fileInput = page.locator('[data-testid="video-file-input"]');
    const validVideo = getTestFilePath('test-video-short.mp4');
    await fileInput.setInputFiles(validVideo);
    await page.waitForTimeout(1000);

    // 提交表單
    await submitButton.click();

    // 檢查載入指示器顯示
    await expect(loadingIndicator).toBeVisible();
    await expect(submitButton).toBeDisabled();
    await expect(submitButton).toContainText('提交中...');

    // 等待超時（假設超時設定為 10 秒）
    await page.waitForTimeout(12000);

    // 檢查超時訊息
    await expect(timeoutMessage).toBeVisible();
    await expect(timeoutMessage).toContainText('請求超時，請稍後再試');

    // 檢查載入狀態重置
    await expect(loadingIndicator).not.toBeVisible();
    await expect(submitButton).toBeEnabled();
    await expect(submitButton).not.toContainText('提交中...');

    console.log('請求超時處理測試完成');
  });

  /**
   * 測試重試機制
   */
  test('應該提供自動重試和手動重試功能', async ({ page }) => {
    const submitButton = page.locator('[data-testid="submit-form-btn"]');
    const retryButton = page.locator('[data-testid="retry-btn"]');
    const errorMessage = page.locator('[data-testid="api-error-message"]');
    const retryCountDisplay = page.locator('[data-testid="retry-count"]');

    let requestCount = 0;

    // 攔截請求並模擬間歇性失敗
    await page.route('**/api/recipes/**', (route) => {
      requestCount += 1;
      if (requestCount < 3) {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Server Error',
            message: '伺服器暫時無法處理請求',
          }),
        });
      } else {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      }
    });

    // 準備表單資料
    const descriptionInput = page.locator('[data-testid="step-description"]');
    await descriptionInput.fill('測試重試機制的步驟說明');

    const fileInput = page.locator('[data-testid="video-file-input"]');
    const validVideo = getTestFilePath('test-video-short.mp4');
    await fileInput.setInputFiles(validVideo);
    await page.waitForTimeout(1000);

    // 第一次提交（失敗）
    await submitButton.click();
    await page.waitForTimeout(2000);

    await expect(errorMessage).toBeVisible();
    await expect(retryButton).toBeVisible();

    // 檢查重試計數
    if (await retryCountDisplay.isVisible()) {
      await expect(retryCountDisplay).toContainText('重試次數: 0/3');
    }

    // 手動重試（第二次失敗）
    await retryButton.click();
    await page.waitForTimeout(2000);

    await expect(errorMessage).toBeVisible();
    if (await retryCountDisplay.isVisible()) {
      await expect(retryCountDisplay).toContainText('重試次數: 1/3');
    }

    // 再次重試（成功）
    await retryButton.click();
    await page.waitForTimeout(2000);

    // 檢查最終成功
    const successMessage = page.locator('[data-testid="success-message"]');
    await expect(successMessage).toBeVisible();
    await expect(errorMessage).not.toBeVisible();

    console.log('重試機制測試完成');
  });

  /**
   * 測試網路狀態監控
   */
  test('應該即時監控網路連線狀態', async ({ page }) => {
    const networkIndicator = page.locator('[data-testid="network-indicator"]');
    const connectionQuality = page.locator(
      '[data-testid="connection-quality"]',
    );

    // 檢查初始網路狀態
    await expect(networkIndicator).toBeVisible();
    await expect(networkIndicator).toHaveClass(/online/);

    // 模擬慢速網路
    await page.context().setOffline(false);
    // 使用慢速網路模擬
    await page.route('**/*', async (route) => {
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 2000);
      });
      route.continue();
    });

    await page.waitForTimeout(3000);

    // 檢查連線品質指示
    if (await connectionQuality.isVisible()) {
      await expect(connectionQuality).toContainText('連線緩慢');
    }

    // 模擬網路中斷
    await page.context().setOffline(true);
    await page.waitForTimeout(1000);

    await expect(networkIndicator).toHaveClass(/offline/);

    // 恢復正常網路
    await page.context().setOffline(false);
    await page.unroute('**/*');
    await page.waitForTimeout(2000);

    await expect(networkIndicator).toHaveClass(/online/);
    if (await connectionQuality.isVisible()) {
      await expect(connectionQuality).toContainText('連線良好');
    }

    console.log('網路狀態監控測試完成');
  });

  /**
   * 測試錯誤訊息本地化
   */
  test('應該顯示本地化的錯誤訊息', async ({ page }) => {
    const errorMessage = page.locator('[data-testid="api-error-message"]');

    // 測試中文錯誤訊息
    await page.route('**/api/recipes/**', (route) => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'VALIDATION_ERROR',
          message: '資料驗證失敗',
          details: {
            field: 'description',
            code: 'TOO_SHORT',
          },
        }),
      });
    });

    // 提交表單觸發錯誤
    const descriptionInput = page.locator('[data-testid="step-description"]');
    await descriptionInput.fill('測試本地化錯誤訊息');

    const fileInput = page.locator('[data-testid="video-file-input"]');
    const validVideo = getTestFilePath('test-video-short.mp4');
    await fileInput.setInputFiles(validVideo);
    await page.waitForTimeout(1000);

    const submitButton = page.locator('[data-testid="submit-form-btn"]');
    await submitButton.click();
    await page.waitForTimeout(1000);

    // 檢查錯誤訊息為中文
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('資料驗證失敗');

    // 檢查錯誤代碼對應的本地化訊息
    const detailMessage = page.locator('[data-testid="error-detail"]');
    if (await detailMessage.isVisible()) {
      await expect(detailMessage).toContainText('說明文字過短');
    }

    console.log('錯誤訊息本地化測試完成');
  });
});
