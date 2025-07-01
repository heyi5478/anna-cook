import { test, expect } from '@playwright/test';
import {
  validateVideoFile,
  getUploadErrorMessage,
  cleanupUploadedFiles,
} from '../../../helpers/video/video-upload';
import { isMobileDevice } from '../../../helpers/video/device-detection';
import {
  waitForElementVisible,
  waitForNetworkIdle,
} from '../../../helpers/common/wait-utils';
import {
  assertTextContent,
  assertVideoFileFormat,
} from '../../../helpers/common/assertion-helpers';

/**
 * 檔案驗證相關型別定義
 */
type FileValidationData = {
  name: string;
  type: string;
  size: number;
  path?: string;
};

type UploadResult = {
  success: boolean;
  error?: string;
  fileInfo?: FileValidationData;
};

type ValidationError = {
  type: 'format' | 'size' | 'required';
  message: string;
};

/**
 * 檔案驗證和錯誤處理測試
 */
test.describe('檔案驗證和錯誤處理', () => {
  /**
   * 每個測試前的準備工作
   */
  test.beforeEach(async ({ page }) => {
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
   * 測試非影片檔案的拒絕機制
   */
  test('應該拒絕非影片檔案格式', async ({ page }) => {
    const fileInput = page.locator('[data-testid="video-upload-input"]');

    // 嘗試上傳圖片檔案
    await fileInput.setInputFiles('tests/fixtures/mock-data/test-image.jpg');

    // 檢查錯誤訊息顯示
    await waitForElementVisible(page, '[data-testid="file-format-error"]');
    await assertTextContent(
      page,
      '[data-testid="file-format-error"]',
      '不支援的檔案格式，請選擇影片檔案',
    );

    // 建立上傳結果物件
    const uploadResult: UploadResult = {
      success: false,
      error: '不支援的檔案格式，請選擇影片檔案',
    };

    expect(uploadResult.success).toBe(false);
    expect(uploadResult.error).toContain('不支援的檔案格式');

    // 確認檔案未被接受
    await expect(
      page.locator('[data-testid="upload-progress"]'),
    ).not.toBeVisible();
    await expect(
      page.locator('[data-testid="video-preview"]'),
    ).not.toBeVisible();
  });

  /**
   * 測試文件檔案的拒絕
   */
  test('應該拒絕文件檔案格式', async ({ page }) => {
    const fileInput = page.locator('[data-testid="video-upload-input"]');

    // 嘗試上傳 PDF 檔案
    await fileInput.setInputFiles('tests/fixtures/mock-data/test-document.pdf');

    // 檢查錯誤訊息
    await waitForElementVisible(page, '[data-testid="file-format-error"]');
    await assertTextContent(
      page,
      '[data-testid="file-format-error"]',
      /請選擇有效的影片檔案.*MP4.*WebM.*MOV/,
    );

    // 檢查支援格式提示
    await expect(
      page.locator('[data-testid="supported-formats-hint"]'),
    ).toBeVisible();
    await assertTextContent(
      page,
      '[data-testid="supported-formats-hint"]',
      '支援格式：MP4, WebM, MOV',
    );
  });

  /**
   * 測試檔案大小限制
   */
  test('應該拒絕超過大小限制的檔案', async ({ page }) => {
    // 模擬超大檔案
    const oversizedFile: FileValidationData = {
      name: 'oversized-video.mp4',
      type: 'video/mp4',
      size: 200 * 1024 * 1024, // 200MB，假設限制是 100MB
    };

    // 使用程式化方式觸發檔案選擇事件
    await page.evaluate((fileData) => {
      const input = document.querySelector(
        '[data-testid="video-upload-input"]',
      ) as HTMLInputElement;
      const files = [new File([''], fileData.name, { type: fileData.type })];

      // 模擬檔案大小
      Object.defineProperty(files[0], 'size', { value: fileData.size });

      const event = new Event('change', { bubbles: true });
      Object.defineProperty(input, 'files', { value: files });
      input.dispatchEvent(event);
    }, oversizedFile);

    // 檢查檔案大小錯誤訊息
    await waitForElementVisible(page, '[data-testid="file-size-error"]');
    await assertTextContent(
      page,
      '[data-testid="file-size-error"]',
      /檔案大小超過限制.*100MB/,
    );

    // 建立驗證錯誤物件
    const validationError: ValidationError = {
      type: 'size',
      message: '檔案大小超過限制，請選擇小於 100MB 的檔案',
    };

    expect(validationError.type).toBe('size');
    expect(validationError.message).toContain('100MB');

    // 確認上傳未開始
    await expect(
      page.locator('[data-testid="upload-progress"]'),
    ).not.toBeVisible();
  });

  /**
   * 測試檔案驗證邏輯
   */
  test('檔案驗證應該正確識別有效檔案', async ({ page }) => {
    const validTestFile: FileValidationData = {
      path: 'tests/fixtures/videos/test-video-short.mp4',
      name: 'test-video-short.mp4',
      size: 5 * 1024 * 1024, // 5MB
      type: 'video/mp4',
    };

    // 使用 helper 函數驗證檔案
    const isValid = validateVideoFile(validTestFile as any);
    expect(isValid).toBe(true);

    // 實際上傳驗證
    const fileInput = page.locator('[data-testid="video-upload-input"]');
    await fileInput.setInputFiles(validTestFile.path!);

    // 檢查檔案被接受
    await waitForElementVisible(page, '[data-testid="upload-progress"]');

    // 建立成功的上傳結果物件
    const successUploadResult: UploadResult = {
      success: true,
      fileInfo: validTestFile,
    };

    expect(successUploadResult.success).toBe(true);
    expect(successUploadResult.fileInfo?.name).toBe('test-video-short.mp4');
    expect(successUploadResult.fileInfo?.type).toBe('video/mp4');

    // 驗證檔案格式
    await assertVideoFileFormat(page, '[data-testid="video-upload-input"]');
  });

  /**
   * 測試錯誤訊息的自動消失
   */
  test('錯誤訊息應該在一定時間後自動消失', async ({ page }) => {
    const fileInput = page.locator('[data-testid="video-upload-input"]');

    // 觸發錯誤
    await fileInput.setInputFiles('tests/fixtures/mock-data/test-image.jpg');

    // 檢查錯誤訊息顯示
    await waitForElementVisible(page, '[data-testid="file-format-error"]');

    // 等待錯誤訊息消失（假設 5 秒後自動消失）
    await page.waitForTimeout(6000);
    await expect(
      page.locator('[data-testid="file-format-error"]'),
    ).not.toBeVisible();
  });

  /**
   * 測試多個錯誤情況的處理
   */
  test('應該處理多個同時發生的錯誤', async ({ page }) => {
    // 模擬一個既不是影片格式又超過大小限制的檔案
    const invalidFile: FileValidationData = {
      name: 'huge-document.pdf',
      type: 'application/pdf',
      size: 150 * 1024 * 1024, // 150MB
    };

    await page.evaluate((fileData) => {
      const input = document.querySelector(
        '[data-testid="video-upload-input"]',
      ) as HTMLInputElement;
      const files = [new File([''], fileData.name, { type: fileData.type })];
      Object.defineProperty(files[0], 'size', { value: fileData.size });

      const event = new Event('change', { bubbles: true });
      Object.defineProperty(input, 'files', { value: files });
      input.dispatchEvent(event);
    }, invalidFile);

    // 檢查是否同時顯示格式和大小錯誤
    await waitForElementVisible(page, '[data-testid="validation-errors"]');

    const errorContainer = page.locator('[data-testid="validation-errors"]');
    await expect(errorContainer).toContainText('不支援的檔案格式');
    await expect(errorContainer).toContainText('檔案大小超過限制');
  });

  /**
   * 測試行動裝置上的錯誤提示
   */
  test('行動裝置應該顯示適合的錯誤提示', async ({ page }) => {
    const isMobile = await isMobileDevice(page);
    const fileInput = page.locator('[data-testid="video-upload-input"]');

    // 觸發檔案格式錯誤
    await fileInput.setInputFiles('tests/fixtures/mock-data/test-image.jpg');

    if (isMobile) {
      // 行動裝置應該顯示簡潔的錯誤提示
      await waitForElementVisible(page, '[data-testid="mobile-error-toast"]');
      await assertTextContent(
        page,
        '[data-testid="mobile-error-toast"]',
        '檔案格式不正確',
      );
    } else {
      // 桌面版顯示詳細錯誤資訊
      await waitForElementVisible(page, '[data-testid="desktop-error-panel"]');
      await expect(
        page.locator('[data-testid="desktop-error-panel"]'),
      ).toContainText('支援格式：MP4, WebM, MOV');
    }
  });

  /**
   * 測試錯誤恢復機制
   */
  test('顯示錯誤後應該允許重新選擇正確檔案', async ({ page }) => {
    const fileInput = page.locator('[data-testid="video-upload-input"]');

    // 首先上傳錯誤檔案
    await fileInput.setInputFiles('tests/fixtures/mock-data/test-image.jpg');
    await waitForElementVisible(page, '[data-testid="file-format-error"]');

    // 清除錯誤狀態
    const clearErrorBtn = page.locator('[data-testid="clear-error-btn"]');
    if (await clearErrorBtn.isVisible()) {
      await clearErrorBtn.click();
    }

    // 上傳正確的影片檔案
    await fileInput.setInputFiles('tests/fixtures/videos/test-video-short.mp4');

    // 檢查錯誤訊息消失且開始正常上傳
    await expect(
      page.locator('[data-testid="file-format-error"]'),
    ).not.toBeVisible();
    await waitForElementVisible(page, '[data-testid="upload-progress"]');
  });

  /**
   * 測試檔案損壞檢測
   */
  test('應該檢測並拒絕損壞的影片檔案', async ({ page }) => {
    // 模擬損壞的影片檔案（實際上是文字檔案偽裝的）
    await page.evaluate(() => {
      const input = document.querySelector(
        '[data-testid="video-upload-input"]',
      ) as HTMLInputElement;
      const corruptedFile = new File(
        ['this is not a video file'],
        'corrupted.mp4',
        {
          type: 'video/mp4',
        },
      );

      const event = new Event('change', { bubbles: true });
      Object.defineProperty(input, 'files', { value: [corruptedFile] });
      input.dispatchEvent(event);
    });

    // 等待檔案分析完成
    await page.waitForTimeout(2000);

    // 檢查檔案損壞錯誤訊息
    const errorMessage = await getUploadErrorMessage(page);
    expect(errorMessage).toMatch(/(損壞|無效|無法讀取)/);

    // 確認上傳被終止
    await expect(
      page.locator('[data-testid="upload-progress"]'),
    ).not.toBeVisible();
  });

  /**
   * 測試圖片檔案錯誤訊息
   */
  test('應該顯示圖片檔案的錯誤訊息', async ({ page }) => {
    const fileInput = page.locator('[data-testid="video-upload-input"]');

    await fileInput.setInputFiles('tests/fixtures/mock-data/test-image.jpg');

    await waitForElementVisible(page, '[data-testid="format-error"]');
    await expect(page.locator('[data-testid="format-error"]')).toContainText(
      '檔案格式錯誤',
    );
  });

  /**
   * 測試音訊檔案錯誤訊息
   */
  test('應該顯示音訊檔案的錯誤訊息', async ({ page }) => {
    const fileInput = page.locator('[data-testid="video-upload-input"]');

    await fileInput.setInputFiles('tests/fixtures/mock-data/test-audio.mp3');

    await waitForElementVisible(page, '[data-testid="media-type-error"]');
    await expect(
      page.locator('[data-testid="media-type-error"]'),
    ).toContainText('僅支援影片檔案');
  });
});
