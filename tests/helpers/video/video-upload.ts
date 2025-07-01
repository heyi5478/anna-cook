import { Page, expect } from '@playwright/test';

/**
 * 影片上傳相關的測試檔案型別定義
 */
export type VideoUploadTestFile = {
  path: string;
  name: string;
  size: number;
  type: string;
  duration?: number;
};

/**
 * 影片上傳進度追蹤型別
 */
export type VideoUploadProgress = {
  percent: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  message?: string;
};

/**
 * 影片上傳設定型別
 */
export type VideoUploadConfig = {
  timeout?: number;
  maxFileSize?: number;
  allowedTypes?: string[];
  progressCheckInterval?: number;
};

/**
 * 預設影片上傳設定
 */
const DEFAULT_UPLOAD_CONFIG: VideoUploadConfig = {
  timeout: 60000,
  maxFileSize: 100 * 1024 * 1024, // 100MB
  allowedTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
  progressCheckInterval: 1000,
};

/**
 * 取得影片上傳輸入元素
 */
export const getVideoUploadInput = async (page: Page): Promise<any> => {
  return page.locator('[data-testid="video-upload-input"]');
};

/**
 * 等待影片上傳按鈕可用
 */
export const waitForUploadButtonEnabled = async (page: Page): Promise<void> => {
  await page.waitForSelector(
    '[data-testid="video-upload-btn"]:not([disabled])',
    {
      timeout: 10000,
    },
  );
};

/**
 * 驗證影片檔案格式是否支援
 */
export const validateVideoFile = (
  file: VideoUploadTestFile,
  config: VideoUploadConfig = {},
): boolean => {
  const finalConfig = { ...DEFAULT_UPLOAD_CONFIG, ...config };

  // 檢查檔案大小
  if (file.size > finalConfig.maxFileSize!) {
    throw new Error(
      `檔案大小 ${file.size} 超過限制 ${finalConfig.maxFileSize}`,
    );
  }

  // 檢查檔案類型
  if (!finalConfig.allowedTypes!.includes(file.type)) {
    throw new Error(`不支援的檔案類型: ${file.type}`);
  }

  return true;
};

/**
 * 模擬影片檔案上傳操作
 */
export const uploadVideoFile = async (
  page: Page,
  filePath: string,
  config: VideoUploadConfig = {},
): Promise<void> => {
  // 合併配置設定
  const finalConfig = { ...DEFAULT_UPLOAD_CONFIG, ...config };

  // 取得檔案上傳輸入元素
  const fileInput = await getVideoUploadInput(page);

  // 確認檔案輸入元素存在
  await expect(fileInput).toBeVisible();

  // 設定檔案
  await fileInput.setInputFiles(filePath);

  // 等待檔案選擇完成，使用配置中的延遲或預設值
  const delay = finalConfig.progressCheckInterval || 500;
  await page.waitForTimeout(delay);
};

/**
 * 監控影片上傳進度
 */
export const monitorUploadProgress = async (
  page: Page,
  config: VideoUploadConfig = {},
): Promise<VideoUploadProgress[]> => {
  const finalConfig = { ...DEFAULT_UPLOAD_CONFIG, ...config };
  const progressHistory: VideoUploadProgress[] = [];

  // 設定進度監控超時
  const startTime = Date.now();

  // 進度監控需要循環等待，因此使用 eslint-disable
  /* eslint-disable no-await-in-loop */
  while (Date.now() - startTime < finalConfig.timeout!) {
    try {
      // 檢查進度條元素
      const progressElement = page.locator('[data-testid="upload-progress"]');

      if (await progressElement.isVisible()) {
        const progressText = await progressElement.textContent();
        const progressPercent =
          await progressElement.getAttribute('data-progress');

        const progress: VideoUploadProgress = {
          percent: parseInt(progressPercent || '0', 10),
          status: 'uploading',
          message: progressText || undefined,
        };

        progressHistory.push(progress);

        // 檢查是否完成
        if (progress.percent >= 100) {
          progress.status = 'completed';
          break;
        }

        // 檢查是否有錯誤
        const errorElement = page.locator('[data-testid="upload-error"]');
        if (await errorElement.isVisible()) {
          progress.status = 'error';
          progress.message = (await errorElement.textContent()) || '上傳失敗';
          break;
        }
      }

      await page.waitForTimeout(finalConfig.progressCheckInterval!);
    } catch (error) {
      console.warn('監控上傳進度時發生錯誤:', error);
      break;
    }
  }
  /* eslint-enable no-await-in-loop */

  return progressHistory;
};

/**
 * 等待影片上傳完成
 */
export const waitForUploadComplete = async (
  page: Page,
  config: VideoUploadConfig = {},
): Promise<boolean> => {
  const finalConfig = { ...DEFAULT_UPLOAD_CONFIG, ...config };

  try {
    // 等待上傳完成訊息
    await page.waitForSelector('[data-testid="upload-success"]', {
      timeout: finalConfig.timeout,
    });

    // 確認沒有錯誤訊息
    const errorElement = page.locator('[data-testid="upload-error"]');
    await expect(errorElement).not.toBeVisible();

    return true;
  } catch (error) {
    console.error('等待上傳完成時發生錯誤:', error);
    return false;
  }
};

/**
 * 驗證影片上傳成功後的狀態
 */
export const verifyUploadSuccess = async (page: Page): Promise<void> => {
  // 檢查成功訊息
  const successMessage = page.locator('[data-testid="upload-success"]');
  await expect(successMessage).toBeVisible();

  // 檢查影片預覽是否顯示
  const videoPreview = page.locator('[data-testid="video-preview"]');
  await expect(videoPreview).toBeVisible();

  // 檢查影片控制項是否可用
  const videoControls = page.locator('[data-testid="video-controls"]');
  await expect(videoControls).toBeVisible();

  // 確認沒有錯誤訊息
  const errorMessage = page.locator('[data-testid="upload-error"]');
  await expect(errorMessage).not.toBeVisible();
};

/**
 * 清理上傳的暫存檔案
 */
export const cleanupUploadedFiles = async (page: Page): Promise<void> => {
  try {
    // 執行清理操作
    await page.evaluate(() => {
      // 清理 localStorage 中的暫存資料
      localStorage.removeItem('uploadedVideoData');
      localStorage.removeItem('videoUploadProgress');
    });

    console.log('已清理上傳檔案的暫存資料');
  } catch (error) {
    console.warn('清理暫存檔案時發生錯誤:', error);
  }
};

/**
 * 取得影片上傳的錯誤訊息
 */
export const getUploadErrorMessage = async (
  page: Page,
): Promise<string | null> => {
  try {
    const errorElement = page.locator('[data-testid="upload-error"]');
    if (await errorElement.isVisible()) {
      return await errorElement.textContent();
    }
    return null;
  } catch (error) {
    console.warn('取得錯誤訊息時發生錯誤:', error);
    return null;
  }
};

/**
 * 重試影片上傳操作
 */
export const retryVideoUpload = async (
  page: Page,
  filePath: string,
  maxRetries: number = 3,
): Promise<boolean> => {
  // 重試邏輯需要順序執行，因此使用 eslint-disable
  /* eslint-disable no-await-in-loop */
  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      console.log(`第 ${attempt} 次嘗試上傳影片...`);

      await uploadVideoFile(page, filePath);
      const success = await waitForUploadComplete(page);

      if (success) {
        await verifyUploadSuccess(page);
        console.log(`第 ${attempt} 次上傳成功`);
        return true;
      }

      const errorMessage = await getUploadErrorMessage(page);
      console.warn(`第 ${attempt} 次上傳失敗: ${errorMessage}`);

      if (attempt < maxRetries) {
        await page.waitForTimeout(2000); // 等待 2 秒後重試
      }
    } catch (error) {
      console.error(`第 ${attempt} 次上傳時發生例外:`, error);

      if (attempt < maxRetries) {
        await page.waitForTimeout(2000);
      }
    }
  }
  /* eslint-enable no-await-in-loop */

  return false;
};
