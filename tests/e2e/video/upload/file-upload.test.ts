import { test, expect } from '@playwright/test';
import {
  uploadVideoFile,
  waitForUploadComplete,
  verifyUploadSuccess,
  cleanupUploadedFiles,
} from '../../../helpers/video/video-upload';
import { isMobileDevice } from '../../../helpers/video/device-detection';
import {
  waitForElementVisible,
  waitForNetworkIdle,
} from '../../../helpers/common/wait-utils';
import {
  assertElementInteractable,
  assertTextContent,
} from '../../../helpers/common/assertion-helpers';
import { getDefaultTestVideo } from '../../../helpers/common/test-data';

/**
 * 影片檔案上傳功能測試
 */
test.describe('影片檔案上傳功能', () => {
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
   * 測試有效影片檔案上傳
   */
  test('應該能夠成功上傳有效的影片檔案', async ({ page }) => {
    // 檢查上傳區域是否顯示
    await assertElementInteractable(page, '[data-testid="video-upload-area"]');

    // 上傳影片檔案
    await uploadVideoFile(page, testVideoPath);

    // 等待上傳完成
    const uploadSuccess = await waitForUploadComplete(page);
    expect(uploadSuccess).toBe(true);

    // 驗證上傳成功狀態
    await verifyUploadSuccess(page);

    // 檢查成功訊息
    await expect(
      page.locator('[data-testid="upload-success-message"]'),
    ).toBeVisible();
    await assertTextContent(
      page,
      '[data-testid="upload-success-message"]',
      '影片上傳成功！',
    );
  });

  /**
   * 測試影片預覽功能
   */
  test('上傳後應該正確顯示影片預覽', async ({ page }) => {
    // 上傳影片檔案
    await uploadVideoFile(page, testVideoPath);
    await waitForUploadComplete(page);

    // 等待影片預覽元素出現
    await waitForElementVisible(page, '[data-testid="video-preview"]');

    // 驗證影片預覽元素
    const videoPreview = page.locator('[data-testid="video-preview"]');
    await expect(videoPreview).toBeVisible();

    // 檢查影片來源是否設定
    const videoSrc = await videoPreview.getAttribute('src');
    expect(videoSrc).toBeTruthy();
    expect(videoSrc).toContain('blob:');

    // 驗證影片控制項
    await expect(page.locator('[data-testid="video-controls"]')).toBeVisible();
    await expect(page.locator('[data-testid="play-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="progress-bar"]')).toBeVisible();
  });

  /**
   * 測試上傳後的 UI 狀態變更
   */
  test('上傳完成後應該正確更新 UI 狀態', async ({ page }) => {
    // 檢查初始狀態
    await expect(
      page.locator('[data-testid="upload-area-initial"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="upload-complete-state"]'),
    ).not.toBeVisible();

    // 上傳檔案
    await uploadVideoFile(page, testVideoPath);
    await waitForUploadComplete(page);

    // 檢查上傳完成後的狀態
    await expect(
      page.locator('[data-testid="upload-complete-state"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="upload-area-initial"]'),
    ).not.toBeVisible();

    // 檢查動作按鈕
    await expect(
      page.locator('[data-testid="replace-video-btn"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="proceed-to-edit-btn"]'),
    ).toBeVisible();

    // 驗證按鈕文字
    await assertTextContent(
      page,
      '[data-testid="replace-video-btn"]',
      '更換影片',
    );
    await assertTextContent(
      page,
      '[data-testid="proceed-to-edit-btn"]',
      '繼續編輯',
    );
  });

  /**
   * 測試拖拽上傳功能
   */
  test('應該支援拖拽方式上傳影片', async ({ page }) => {
    // 模擬檔案拖拽事件
    const uploadArea = page.locator('[data-testid="video-upload-area"]');

    // 模擬拖拽進入
    await uploadArea.dispatchEvent('dragenter', {
      dataTransfer: {
        files: [{ name: 'test-video.mp4', type: 'video/mp4' }],
      },
    });

    // 檢查拖拽狀態樣式
    await expect(uploadArea).toHaveClass(/drag-over/);

    // 模擬拖拽離開
    await uploadArea.dispatchEvent('dragleave');
    await expect(uploadArea).not.toHaveClass(/drag-over/);

    // 模擬檔案放置
    await uploadArea.dispatchEvent('drop', {
      dataTransfer: {
        files: [
          {
            name: 'test-video.mp4',
            type: 'video/mp4',
            size: 10 * 1024 * 1024, // 10MB
          },
        ],
      },
    });

    // 驗證上傳開始
    await waitForElementVisible(page, '[data-testid="upload-progress"]');
  });

  /**
   * 測試行動裝置上的上傳體驗
   */
  test('在行動裝置上應該提供適合的上傳介面', async ({ page }) => {
    const isMobile = await isMobileDevice(page);

    if (isMobile) {
      // 檢查行動裝置專用的上傳按鈕
      await expect(
        page.locator('[data-testid="mobile-upload-btn"]'),
      ).toBeVisible();

      // 檢查觸控友好的上傳區域
      const uploadArea = page.locator('[data-testid="video-upload-area"]');
      const boundingBox = await uploadArea.boundingBox();

      // 確保觸控區域足夠大（至少 44px 高度）
      expect(boundingBox?.height).toBeGreaterThanOrEqual(44);
    } else {
      // 桌面版本的介面檢查
      await expect(
        page.locator('[data-testid="desktop-upload-interface"]'),
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="drag-drop-area"]'),
      ).toBeVisible();
    }

    // 無論裝置類型，都應該能成功上傳
    await uploadVideoFile(page, testVideoPath);
    const uploadSuccess = await waitForUploadComplete(page);
    expect(uploadSuccess).toBe(true);
  });

  /**
   * 測試多檔案選擇提示
   */
  test('選擇多個檔案時應該顯示適當提示', async ({ page }) => {
    // 模擬選擇多個檔案（雖然只應該接受一個）
    const fileInput = page.locator('[data-testid="video-upload-input"]');

    // 嘗試設定多個檔案
    await fileInput.setInputFiles([
      testVideoPath,
      'tests/fixtures/videos/test-video-medium.mp4',
    ]);

    // 檢查是否顯示單一檔案限制的提示
    await waitForElementVisible(page, '[data-testid="single-file-warning"]');
    await assertTextContent(
      page,
      '[data-testid="single-file-warning"]',
      '請一次只上傳一個影片檔案',
    );

    // 確認只處理第一個檔案
    const uploadedFileInfo = page.locator('[data-testid="uploaded-file-info"]');
    await expect(uploadedFileInfo).toContainText('test-video-short.mp4');
  });

  /**
   * 測試檔案資訊顯示
   */
  test('上傳後應該顯示正確的檔案資訊', async ({ page }) => {
    await uploadVideoFile(page, testVideoPath);
    await waitForUploadComplete(page);

    // 檢查檔案資訊區域
    await expect(page.locator('[data-testid="file-info-panel"]')).toBeVisible();

    // 驗證檔案名稱
    await expect(page.locator('[data-testid="file-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="file-name"]')).toContainText(
      'test-video-short.mp4',
    );

    // 驗證檔案大小
    await expect(page.locator('[data-testid="file-size"]')).toBeVisible();
    const fileSizeText = await page
      .locator('[data-testid="file-size"]')
      .textContent();
    expect(fileSizeText).toMatch(/\d+(\.\d+)?\s*(KB|MB|GB)/);

    // 驗證影片時長（如果檢測到）
    const durationElement = page.locator('[data-testid="video-duration"]');
    if (await durationElement.isVisible()) {
      const durationText = await durationElement.textContent();
      expect(durationText).toMatch(/\d{2}:\d{2}/); // MM:SS 格式
    }
  });
});
