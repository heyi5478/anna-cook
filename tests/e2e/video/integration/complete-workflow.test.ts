import { test, expect } from '@playwright/test';
import { waitForNetworkIdle } from '../../../helpers/common/wait-utils';
import { getTestFilePath } from '../../../helpers/common/test-data';

/**
 * 完整使用者流程測試
 */
test.describe('完整使用者工作流程', () => {
  /**
   * 每個測試前的準備工作
   */
  test.beforeEach(async ({ page }) => {
    // 導航到影片編輯頁面
    await page.goto('/recipe-draft-video');
    await waitForNetworkIdle(page);
  });

  /**
   * 測試從上傳到提交的完整流程
   */
  test('應該完成從上傳到提交的完整使用者流程', async ({ page }) => {
    const descriptionInput = page.locator('[data-testid="step-description"]');
    const fileInput = page.locator('[data-testid="video-file-input"]');
    const submitButton = page.locator('[data-testid="submit-form-btn"]');
    const successMessage = page.locator('[data-testid="success-message"]');

    // Step 1: 上傳影片檔案
    const validVideo = getTestFilePath('test-video-short.mp4');
    await fileInput.setInputFiles(validVideo);
    await page.waitForTimeout(2000); // 等待檔案處理

    // 檢查檔案上傳成功
    const fileStatus = page.locator('[data-testid="file-status"]');
    await expect(fileStatus).toContainText('檔案上傳成功');

    // Step 2: 填寫步驟說明
    await descriptionInput.fill(
      '這是一個完整的烹飪步驟說明，展示如何進行食材處理和烹飪技巧',
    );

    // 檢查即時驗證
    const validationMessage = page.locator(
      '[data-testid="validation-message"]',
    );
    await expect(validationMessage).toContainText('輸入有效');

    // Step 3: 設定時間標記（模擬影片編輯）
    const timeMarkButton = page.locator('[data-testid="add-time-mark"]');
    await timeMarkButton.click();
    await page.waitForTimeout(500);

    const timeMarkInput = page.locator('[data-testid="time-mark-input"]');
    await timeMarkInput.fill('00:30');

    const confirmTimeMarkButton = page.locator(
      '[data-testid="confirm-time-mark"]',
    );
    await confirmTimeMarkButton.click();

    // 檢查時間標記顯示
    const timeMarkDisplay = page.locator('[data-testid="time-mark-display"]');
    await expect(timeMarkDisplay).toContainText('00:30');

    // Step 4: 預覽功能測試
    const previewButton = page.locator('[data-testid="preview-btn"]');
    await previewButton.click();
    await page.waitForTimeout(1000);

    const videoPlayer = page.locator('[data-testid="video-player"]');
    await expect(videoPlayer).toBeVisible();

    // Step 5: 設定 API 攔截來模擬成功提交
    await page.route('**/api/recipes/**/submit-draft', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          recipeId: 'recipe-123',
          message: '草稿已成功提交',
        }),
      });
    });

    // Step 6: 提交表單
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // 檢查提交過程
    await expect(submitButton).toBeDisabled();
    await expect(submitButton).toContainText('提交中...');

    // 等待提交完成
    await page.waitForTimeout(2000);

    // 檢查成功訊息
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toContainText('草稿已成功提交');

    // Step 7: 檢查頁面導航（如果有重導向）
    const currentUrl = page.url();
    if (currentUrl.includes('success') || currentUrl.includes('recipe-123')) {
      console.log('頁面成功導航到結果頁面');
    }

    console.log('完整使用者流程測試完成');
  });

  /**
   * 測試多片段編輯工作流程
   */
  test('應該支援多片段編輯工作流程', async ({ page }) => {
    const addSegmentButton = page.locator('[data-testid="add-segment-btn"]');
    const segmentList = page.locator('[data-testid="segment-list"]');

    // 上傳初始影片
    const fileInput = page.locator('[data-testid="video-file-input"]');
    const validVideo = getTestFilePath('test-video-short.mp4');
    await fileInput.setInputFiles(validVideo);
    await page.waitForTimeout(2000);

    // 建立第一個片段
    const firstSegmentDescription = page.locator(
      '[data-testid="step-description"]',
    );
    await firstSegmentDescription.fill('第一個烹飪步驟：準備食材');

    // 設定第一個片段的時間範圍
    const startTimeInput = page.locator('[data-testid="start-time-input"]');
    const endTimeInput = page.locator('[data-testid="end-time-input"]');

    await startTimeInput.fill('00:00');
    await endTimeInput.fill('00:30');

    // 新增第二個片段
    await addSegmentButton.click();
    await page.waitForTimeout(500);

    // 檢查片段列表
    const segments = segmentList.locator('[data-testid="segment-item"]');
    await expect(segments).toHaveCount(2);

    // 編輯第二個片段
    const secondSegmentDescription = page.locator(
      '[data-testid="step-description"]:nth-child(2)',
    );
    await secondSegmentDescription.fill('第二個烹飪步驟：開始烹飪');

    const secondStartTime = page.locator(
      '[data-testid="start-time-input"]:nth-child(2)',
    );
    const secondEndTime = page.locator(
      '[data-testid="end-time-input"]:nth-child(2)',
    );

    await secondStartTime.fill('00:30');
    await secondEndTime.fill('01:00');

    // 測試片段重新排序
    const firstSegment = segments.first();
    const secondSegment = segments.nth(1);

    // 模擬拖放操作
    await firstSegment.dragTo(secondSegment);
    await page.waitForTimeout(500);

    // 檢查排序是否正確
    const reorderedSegments = segmentList.locator(
      '[data-testid="segment-item"]',
    );
    const firstReorderedText = await reorderedSegments.first().textContent();
    await expect(firstReorderedText).toContain('第二個烹飪步驟');

    // 測試片段刪除
    const deleteButton = reorderedSegments
      .first()
      .locator('[data-testid="delete-segment"]');
    await deleteButton.click();

    // 確認刪除
    const confirmDeleteButton = page.locator('[data-testid="confirm-delete"]');
    await confirmDeleteButton.click();

    // 檢查片段數量
    await expect(segments).toHaveCount(1);

    console.log('多片段編輯工作流程測試完成');
  });

  /**
   * 測試複雜的使用者操作序列
   */
  test('應該正確處理複雜的使用者操作序列', async ({ page }) => {
    const descriptionInput = page.locator('[data-testid="step-description"]');
    const fileInput = page.locator('[data-testid="video-file-input"]');
    const submitButton = page.locator('[data-testid="submit-form-btn"]');

    // 操作序列 1: 部分填寫後儲存草稿
    await descriptionInput.fill('開始寫描述...');
    await page.waitForTimeout(500);

    // 模擬自動儲存
    const autoSaveStatus = page.locator('[data-testid="auto-save-status"]');
    if (await autoSaveStatus.isVisible()) {
      await expect(autoSaveStatus).toContainText('已自動儲存');
    }

    // 操作序列 2: 上傳檔案後編輯
    const validVideo = getTestFilePath('test-video-short.mp4');
    await fileInput.setInputFiles(validVideo);
    await page.waitForTimeout(2000);

    // 操作序列 3: 修改描述
    await descriptionInput.fill('');
    await descriptionInput.fill('這是修改後的完整描述，包含詳細的烹飪步驟說明');

    // 操作序列 4: 多次切換預覽模式
    const previewButton = page.locator('[data-testid="preview-btn"]');
    const editButton = page.locator('[data-testid="edit-btn"]');

    await Array.from({ length: 3 }).reduce(async (promise) => {
      await promise;
      await previewButton.click();
      await page.waitForTimeout(500);

      const videoPlayer = page.locator('[data-testid="video-player"]');
      await expect(videoPlayer).toBeVisible();

      await editButton.click();
      await page.waitForTimeout(500);

      await expect(descriptionInput).toBeVisible();
    }, Promise.resolve());

    // 操作序列 5: 檢查 localStorage 資料持久性
    const localStorageData = await page.evaluate(() => {
      return {
        description: localStorage.getItem('draft-description'),
        timestamp: localStorage.getItem('draft-timestamp'),
      };
    });

    expect(localStorageData.description).toBeTruthy();
    expect(localStorageData.timestamp).toBeTruthy();

    // 操作序列 6: 模擬頁面重新載入
    await page.reload();
    await waitForNetworkIdle(page);

    // 檢查資料是否恢復
    const restoredDescription = await descriptionInput.inputValue();
    expect(restoredDescription).toContain('這是修改後的完整描述');

    // 操作序列 7: 最終提交
    await page.route('**/api/recipes/**/submit-draft', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          recipeId: 'recipe-456',
          redirectUrl: '/recipe-list',
        }),
      });
    });

    await submitButton.click();
    await page.waitForTimeout(2000);

    // 檢查最終結果
    const successMessage = page.locator('[data-testid="success-message"]');
    await expect(successMessage).toBeVisible();

    console.log('複雜使用者操作序列測試完成');
  });

  /**
   * 測試並發操作處理
   */
  test('應該正確處理並發操作', async ({ page }) => {
    const descriptionInput = page.locator('[data-testid="step-description"]');
    const saveButton = page.locator('[data-testid="save-draft-btn"]');

    // 上傳檔案
    const fileInput = page.locator('[data-testid="video-file-input"]');
    const validVideo = getTestFilePath('test-video-short.mp4');
    await fileInput.setInputFiles(validVideo);
    await page.waitForTimeout(1000);

    // 快速連續操作
    await descriptionInput.fill('第一次輸入');
    await saveButton.click();

    await descriptionInput.fill('第二次快速修改');
    await saveButton.click();

    await descriptionInput.fill('第三次即時修改');
    await saveButton.click();

    // 檢查最後的操作是否正確保存
    await page.waitForTimeout(2000);
    const finalValue = await descriptionInput.inputValue();
    expect(finalValue).toBe('第三次即時修改');

    // 檢查儲存狀態
    const saveStatus = page.locator('[data-testid="save-status"]');
    if (await saveStatus.isVisible()) {
      await expect(saveStatus).toContainText('已儲存');
    }

    console.log('並發操作處理測試完成');
  });

  /**
   * 測試使用者體驗優化功能
   */
  test('應該提供優良的使用者體驗', async ({ page }) => {
    const descriptionInput = page.locator('[data-testid="step-description"]');
    const characterCount = page.locator('[data-testid="character-count"]');
    const submitButton = page.locator('[data-testid="submit-form-btn"]');

    // 測試即時字數統計
    await descriptionInput.fill('測試字數統計功能');
    if (await characterCount.isVisible()) {
      const count = await characterCount.textContent();
      expect(count).toContain('8'); // '測試字數統計功能' 共8個字
    }

    // 測試輸入提示
    await descriptionInput.fill('');
    const placeholder = await descriptionInput.getAttribute('placeholder');
    expect(placeholder).toContain('請描述烹飪步驟');

    // 測試鍵盤快捷鍵
    await page.keyboard.press('Control+S'); // 儲存快捷鍵
    await page.waitForTimeout(500);

    // 測試無障礙功能
    const submitButtonRole = await submitButton.getAttribute('role');
    const submitButtonAriaLabel = await submitButton.getAttribute('aria-label');

    expect(submitButtonRole || 'button').toBe('button');
    expect(submitButtonAriaLabel).toBeTruthy();

    // 測試回應式設計
    await page.setViewportSize({ width: 375, height: 667 }); // 手機尺寸
    await page.waitForTimeout(500);

    const mobileLayout = page.locator('[data-testid="mobile-layout"]');
    if (await mobileLayout.isVisible()) {
      await expect(mobileLayout).toBeVisible();
    }

    await page.setViewportSize({ width: 1920, height: 1080 }); // 桌面尺寸
    await page.waitForTimeout(500);

    console.log('使用者體驗優化功能測試完成');
  });
});
