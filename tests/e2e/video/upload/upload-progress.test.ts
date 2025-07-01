import { test, expect } from '@playwright/test';
import {
  uploadVideoFile,
  monitorUploadProgress,
  waitForUploadComplete,
  cleanupUploadedFiles,
} from '../../../helpers/video/video-upload';
import { isMobileDevice } from '../../../helpers/video/device-detection';
import {
  waitForElementVisible,
  waitForNetworkIdle,
} from '../../../helpers/common/wait-utils';
import {
  assertTextContent,
  assertNumberInRange,
} from '../../../helpers/common/assertion-helpers';
import { getDefaultTestVideo } from '../../../helpers/common/test-data';

/**
 * 上傳進度和狀態測試
 */
test.describe('上傳進度和狀態管理', () => {
  let testVideoPath: string;

  /**
   * 每個測試前的準備工作
   */
  test.beforeEach(async ({ page }) => {
    // 取得測試影片檔案路徑
    const testVideo = getDefaultTestVideo();
    testVideoPath = `tests/fixtures/videos/${testVideo.filename}`;

    // 導航到影片上傳頁面
    await page.goto('/upload-video');
    await waitForNetworkIdle(page);
  });

  /**
   * 每個測試後的清理工作
   */
  test.afterEach(async ({ page }) => {
    // 清理上傳的檔案
    await cleanupUploadedFiles(page);
  });

  /**
   * 測試上傳進度條的正確顯示
   */
  test('應該正確顯示上傳進度條', async ({ page }) => {
    // 開始上傳檔案
    await uploadVideoFile(page, testVideoPath);

    // 檢查進度條元素出現
    await waitForElementVisible(page, '[data-testid="upload-progress"]');

    // 驗證進度條初始狀態
    const progressBar = page.locator('[data-testid="upload-progress-bar"]');
    await expect(progressBar).toBeVisible();

    // 檢查進度百分比顯示
    const progressText = page.locator('[data-testid="upload-progress-text"]');
    await expect(progressText).toBeVisible();

    // 驗證進度文字格式
    const progressContent = await progressText.textContent();
    expect(progressContent).toMatch(/\d+%/);
  });

  /**
   * 測試上傳進度的實時更新
   */
  test('進度條應該實時更新上傳進度', async ({ page }) => {
    // 開始上傳並監控進度
    await uploadVideoFile(page, testVideoPath);

    const progressHistory = await monitorUploadProgress(page);

    // 驗證進度歷史記錄
    expect(progressHistory.length).toBeGreaterThan(0);

    // 檢查進度是否遞增
    let lastProgress = 0;
    progressHistory.forEach((progress) => {
      expect(progress.percent).toBeGreaterThanOrEqual(lastProgress);
      lastProgress = progress.percent;
    });

    // 最終進度應該達到 100%
    const finalProgress = progressHistory[progressHistory.length - 1];
    expect(finalProgress.percent).toBe(100);
    expect(finalProgress.status).toBe('completed');
  });

  /**
   * 測試上傳狀態的正確管理
   */
  test('應該正確管理上傳過程的各種狀態', async ({ page }) => {
    // 初始狀態：準備上傳
    await expect(page.locator('[data-testid="upload-status"]')).toContainText(
      '準備上傳',
    );

    // 開始上傳
    await uploadVideoFile(page, testVideoPath);

    // 上傳中狀態
    await waitForElementVisible(page, '[data-testid="upload-status"]');
    await expect(page.locator('[data-testid="upload-status"]')).toContainText(
      '上傳中',
    );

    // 檢查上傳中的指示器
    await expect(page.locator('[data-testid="upload-spinner"]')).toBeVisible();

    // 等待上傳完成
    await waitForUploadComplete(page);

    // 完成狀態
    await expect(page.locator('[data-testid="upload-status"]')).toContainText(
      '上傳完成',
    );
    await expect(
      page.locator('[data-testid="upload-spinner"]'),
    ).not.toBeVisible();
  });

  /**
   * 測試上傳速度和時間估算
   */
  test('應該顯示上傳速度和剩餘時間估算', async ({ page }) => {
    await uploadVideoFile(page, testVideoPath);

    // 等待上傳開始並顯示速度資訊
    await waitForElementVisible(page, '[data-testid="upload-speed"]');

    // 檢查上傳速度格式
    const speedText = await page
      .locator('[data-testid="upload-speed"]')
      .textContent();
    expect(speedText).toMatch(/\d+(\.\d+)?\s*(KB\/s|MB\/s)/);

    // 檢查剩餘時間估算
    const etaElement = page.locator('[data-testid="upload-eta"]');
    if (await etaElement.isVisible()) {
      const etaText = await etaElement.textContent();
      expect(etaText).toMatch(/(剩餘|約)\s*\d+/);
    }
  });

  /**
   * 測試上傳完成後的狀態轉換
   */
  test('上傳完成後應該正確轉換到下一步驟', async ({ page }) => {
    await uploadVideoFile(page, testVideoPath);
    await waitForUploadComplete(page);

    // 檢查完成後的成功訊息
    await waitForElementVisible(
      page,
      '[data-testid="upload-success-indicator"]',
    );
    await assertTextContent(
      page,
      '[data-testid="upload-success-indicator"]',
      '上傳成功',
    );

    // 檢查下一步按鈕
    await expect(page.locator('[data-testid="proceed-btn"]')).toBeVisible();
    await expect(page.locator('[data-testid="proceed-btn"]')).toBeEnabled();

    // 檢查重新上傳選項
    await expect(page.locator('[data-testid="re-upload-btn"]')).toBeVisible();

    // 驗證按鈕文字
    await assertTextContent(page, '[data-testid="proceed-btn"]', '下一步');
    await assertTextContent(page, '[data-testid="re-upload-btn"]', '重新上傳');
  });

  /**
   * 測試上傳暫停和恢復功能
   */
  test('應該支援上傳暫停和恢復功能', async ({ page }) => {
    await uploadVideoFile(page, testVideoPath);

    // 等待上傳開始
    await waitForElementVisible(page, '[data-testid="upload-progress"]');

    // 檢查暫停按鈕
    const pauseBtn = page.locator('[data-testid="pause-upload-btn"]');
    if (await pauseBtn.isVisible()) {
      await pauseBtn.click();

      // 檢查暫停狀態
      await expect(page.locator('[data-testid="upload-status"]')).toContainText(
        '已暫停',
      );

      // 檢查恢復按鈕
      const resumeBtn = page.locator('[data-testid="resume-upload-btn"]');
      await expect(resumeBtn).toBeVisible();
      await resumeBtn.click();

      // 檢查恢復狀態
      await expect(page.locator('[data-testid="upload-status"]')).toContainText(
        '上傳中',
      );
    }
  });

  /**
   * 測試上傳取消功能
   */
  test('應該支援取消上傳功能', async ({ page }) => {
    await uploadVideoFile(page, testVideoPath);

    // 等待上傳開始
    await waitForElementVisible(page, '[data-testid="upload-progress"]');

    // 點擊取消按鈕
    const cancelBtn = page.locator('[data-testid="cancel-upload-btn"]');
    await expect(cancelBtn).toBeVisible();
    await cancelBtn.click();

    // 確認取消對話框
    const confirmBtn = page.locator('[data-testid="confirm-cancel-btn"]');
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
    }

    // 檢查取消後的狀態
    await expect(page.locator('[data-testid="upload-status"]')).toContainText(
      '已取消',
    );
    await expect(
      page.locator('[data-testid="upload-progress"]'),
    ).not.toBeVisible();

    // 檢查重新開始選項
    await expect(
      page.locator('[data-testid="restart-upload-btn"]'),
    ).toBeVisible();
  });

  /**
   * 測試行動裝置上的進度顯示
   */
  test('行動裝置應該顯示適合的進度介面', async ({ page }) => {
    const isMobile = await isMobileDevice(page);

    await uploadVideoFile(page, testVideoPath);
    await waitForElementVisible(page, '[data-testid="upload-progress"]');

    if (isMobile) {
      // 行動裝置應該顯示簡化的進度界面
      await expect(
        page.locator('[data-testid="mobile-progress-bar"]'),
      ).toBeVisible();

      // 檢查觸控友好的控制按鈕
      const mobileControls = page.locator(
        '[data-testid="mobile-upload-controls"]',
      );
      await expect(mobileControls).toBeVisible();

      // 確保按鈕足夠大
      const cancelBtn = page.locator('[data-testid="mobile-cancel-btn"]');
      if (await cancelBtn.isVisible()) {
        const boundingBox = await cancelBtn.boundingBox();
        expect(boundingBox?.height).toBeGreaterThanOrEqual(44);
      }
    } else {
      // 桌面版顯示詳細的進度資訊
      await expect(
        page.locator('[data-testid="desktop-progress-panel"]'),
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="detailed-upload-info"]'),
      ).toBeVisible();
    }
  });

  /**
   * 測試上傳錯誤的處理
   */
  test('應該正確處理上傳過程中的錯誤', async ({ page }) => {
    // 模擬網路錯誤
    await page.route('**/upload-video', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: '伺服器錯誤' }),
      });
    });

    await uploadVideoFile(page, testVideoPath);

    // 檢查錯誤狀態
    await waitForElementVisible(page, '[data-testid="upload-error"]');
    await assertTextContent(
      page,
      '[data-testid="upload-error"]',
      /上傳失敗|錯誤/,
    );

    // 檢查重試選項
    await expect(
      page.locator('[data-testid="retry-upload-btn"]'),
    ).toBeVisible();
    await assertTextContent(page, '[data-testid="retry-upload-btn"]', '重試');
  });

  /**
   * 測試多檔案上傳的進度管理
   */
  test('批次上傳時應該顯示總體進度', async ({ page }) => {
    // 模擬選擇多個檔案（如果支援）
    const fileInput = page.locator('[data-testid="video-upload-input"]');

    // 檢查是否支援多檔案上傳
    const multipleAttr = await fileInput.getAttribute('multiple');

    if (multipleAttr !== null) {
      await fileInput.setInputFiles([
        testVideoPath,
        'tests/fixtures/videos/test-video-medium.mp4',
      ]);

      // 檢查總體進度顯示
      await waitForElementVisible(
        page,
        '[data-testid="batch-upload-progress"]',
      );

      // 檢查個別檔案進度
      await expect(
        page.locator('[data-testid="file-progress-item"]').first(),
      ).toBeVisible();

      // 驗證總體進度計算
      const totalProgress = page.locator('[data-testid="total-progress"]');
      await expect(totalProgress).toBeVisible();
    }
  });

  /**
   * 測試進度數據的準確性
   */
  test('進度數據應該準確反映上傳狀態', async ({ page }) => {
    await uploadVideoFile(page, testVideoPath);

    const progressHistory = await monitorUploadProgress(page);

    // 驗證進度數據的合理性
    progressHistory.forEach((progress, index) => {
      // 進度百分比應該在 0-100 之間
      assertNumberInRange(progress.percent, 50, undefined, 50); // 使用範圍檢查

      // 狀態應該是有效的
      expect(['uploading', 'processing', 'completed', 'error']).toContain(
        progress.status,
      );

      // 進度應該是非遞減的
      if (index > 0) {
        expect(progress.percent).toBeGreaterThanOrEqual(
          progressHistory[index - 1].percent,
        );
      }
    });

    // 最終狀態檢查
    const finalProgress = progressHistory[progressHistory.length - 1];
    expect(finalProgress.percent).toBe(100);
    expect(finalProgress.status).toBe('completed');
  });
});
