import { Page, expect } from '@playwright/test';

/**
 * 縮圖資料型別
 */
export type ThumbnailData = {
  url: string;
  timePosition: number;
  index: number;
  width: number;
  height: number;
  quality?: number;
};

/**
 * 縮圖生成設定型別
 */
export type ThumbnailGenerationConfig = {
  count?: number;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  timeout?: number;
};

/**
 * 縮圖驗證設定型別
 */
export type ThumbnailValidationConfig = {
  minWidth?: number;
  minHeight?: number;
  maxFileSize?: number;
  expectedFormat?: string;
};

/**
 * 預設縮圖設定
 */
const DEFAULT_THUMBNAIL_CONFIG: ThumbnailGenerationConfig = {
  count: 10,
  width: 160,
  height: 90,
  quality: 0.7,
  format: 'jpeg',
  timeout: 30000,
};

/**
 * 預設縮圖驗證設定
 */
const DEFAULT_VALIDATION_CONFIG: ThumbnailValidationConfig = {
  minWidth: 100,
  minHeight: 50,
  maxFileSize: 50 * 1024, // 50KB
  expectedFormat: 'jpeg',
};

/**
 * 等待縮圖生成完成
 */
export const waitForThumbnailGeneration = async (
  page: Page,
  config: ThumbnailGenerationConfig = {},
): Promise<void> => {
  const finalConfig = { ...DEFAULT_THUMBNAIL_CONFIG, ...config };

  // 等待縮圖容器出現
  await page.waitForSelector('[data-testid="thumbnail-container"]', {
    timeout: finalConfig.timeout,
  });

  // 等待指定數量的縮圖載入完成
  await page.waitForFunction(
    (expectedCount) => {
      const thumbnails = document.querySelectorAll(
        '[data-testid="thumbnail-item"]',
      );
      return thumbnails.length >= (expectedCount || 0);
    },
    finalConfig.count || DEFAULT_THUMBNAIL_CONFIG.count,
    { timeout: finalConfig.timeout },
  );

  console.log(`已等待 ${finalConfig.count} 個縮圖生成完成`);
};

/**
 * 取得所有縮圖資料
 */
export const getAllThumbnails = async (
  page: Page,
): Promise<ThumbnailData[]> => {
  return page.evaluate(() => {
    const thumbnailElements = document.querySelectorAll(
      '[data-testid="thumbnail-item"]',
    );
    return Array.from(thumbnailElements).map((element, index) => {
      const imgElement = element.querySelector('img') as HTMLImageElement;
      // const timeElement = element.querySelector('[data-testid="thumbnail-time"]');

      return {
        url: imgElement?.src || '',
        timePosition: parseFloat(
          element.getAttribute('data-time-position') || '0',
        ),
        index,
        width: imgElement?.naturalWidth || 0,
        height: imgElement?.naturalHeight || 0,
        quality: parseFloat(element.getAttribute('data-quality') || '0.7'),
      };
    });
  });
};

/**
 * 點擊指定縮圖
 */
export const clickThumbnail = async (
  page: Page,
  index: number,
): Promise<void> => {
  const thumbnail = page.locator(
    `[data-testid="thumbnail-item"]:nth-child(${index + 1})`,
  );
  await expect(thumbnail).toBeVisible();
  await thumbnail.click();

  console.log(`已點擊第 ${index + 1} 個縮圖`);
};

/**
 * 驗證縮圖載入狀態
 */
export const verifyThumbnailLoading = async (
  page: Page,
  index: number,
): Promise<void> => {
  const thumbnail = page.locator(
    `[data-testid="thumbnail-item"]:nth-child(${index + 1})`,
  );
  const img = thumbnail.locator('img');

  // 檢查縮圖元素存在
  await expect(thumbnail).toBeVisible();

  // 檢查圖片載入完成
  await expect(img).toBeVisible();

  // 驗證圖片有有效的 src
  const imgSrc = await img.getAttribute('src');
  expect(imgSrc).toBeTruthy();
  expect(imgSrc).not.toBe('');

  console.log(`縮圖 ${index + 1} 載入狀態驗證通過`);
};

/**
 * 驗證縮圖尺寸
 */
export const verifyThumbnailDimensions = async (
  page: Page,
  index: number,
  expectedWidth?: number,
  expectedHeight?: number,
): Promise<void> => {
  const thumbnails = await getAllThumbnails(page);
  const thumbnail = thumbnails[index];

  if (!thumbnail) {
    throw new Error(`找不到索引為 ${index} 的縮圖`);
  }

  if (expectedWidth !== undefined) {
    expect(thumbnail.width).toBe(expectedWidth);
  }

  if (expectedHeight !== undefined) {
    expect(thumbnail.height).toBe(expectedHeight);
  }

  console.log(
    `縮圖 ${index + 1} 尺寸驗證通過: ${thumbnail.width}x${thumbnail.height}`,
  );
};

/**
 * 驗證縮圖時間位置
 */
export const verifyThumbnailTimePosition = async (
  page: Page,
  index: number,
  expectedTime: number,
  tolerance: number = 1,
): Promise<void> => {
  const thumbnails = await getAllThumbnails(page);
  const thumbnail = thumbnails[index];

  if (!thumbnail) {
    throw new Error(`找不到索引為 ${index} 的縮圖`);
  }

  const timeDifference = Math.abs(thumbnail.timePosition - expectedTime);
  expect(timeDifference).toBeLessThanOrEqual(tolerance);

  console.log(
    `縮圖 ${index + 1} 時間位置驗證通過: ${thumbnail.timePosition}秒`,
  );
};

/**
 * 驗證縮圖品質
 */
export const verifyThumbnailQuality = async (
  page: Page,
  config: ThumbnailValidationConfig = {},
): Promise<void> => {
  const finalConfig = { ...DEFAULT_VALIDATION_CONFIG, ...config };
  const thumbnails = await getAllThumbnails(page);

  for (let i = 0; i < thumbnails.length; i += 1) {
    const thumbnail = thumbnails[i];

    // 驗證最小尺寸
    expect(thumbnail.width).toBeGreaterThanOrEqual(finalConfig.minWidth!);
    expect(thumbnail.height).toBeGreaterThanOrEqual(finalConfig.minHeight!);

    // 驗證 URL 格式
    expect(thumbnail.url).toMatch(/^data:image\//);

    console.log(`縮圖 ${i + 1} 品質驗證通過`);
  }

  console.log('所有縮圖品質驗證通過');
};

/**
 * 檢查縮圖載入錯誤
 */
export const checkThumbnailErrors = async (page: Page): Promise<string[]> => {
  // 檢查縮圖載入錯誤
  const errorElements = page.locator('[data-testid="thumbnail-error"]');
  const errorCount = await errorElements.count();

  // 使用 Promise.all 來並行處理，避免迴圈中的 await
  const errorTexts = await Promise.all(
    Array.from({ length: errorCount }, (_, i) =>
      errorElements.nth(i).textContent(),
    ),
  );

  // 過濾掉空值
  return errorTexts.filter((text): text is string => Boolean(text));
};

/**
 * 等待特定縮圖載入
 */
export const waitForSpecificThumbnail = async (
  page: Page,
  index: number,
  timeout: number = 10000,
): Promise<void> => {
  const thumbnail = page.locator(
    `[data-testid="thumbnail-item"]:nth-child(${index + 1})`,
  );

  // 等待縮圖元素出現
  await expect(thumbnail).toBeVisible({ timeout });

  // 等待圖片載入完成
  await page.waitForFunction(
    (thumbnailIndex) => {
      const thumbnailElement = document.querySelector(
        `[data-testid="thumbnail-item"]:nth-child(${thumbnailIndex + 1}) img`,
      ) as HTMLImageElement;
      return (
        thumbnailElement &&
        thumbnailElement.complete &&
        thumbnailElement.naturalWidth > 0
      );
    },
    index,
    { timeout },
  );

  console.log(`縮圖 ${index + 1} 載入完成`);
};

/**
 * 驗證縮圖時間軸分布
 */
export const verifyThumbnailDistribution = async (
  page: Page,
  videoDuration: number,
): Promise<void> => {
  const thumbnails = await getAllThumbnails(page);

  if (thumbnails.length === 0) {
    throw new Error('沒有找到任何縮圖');
  }

  // 驗證縮圖時間位置的分布均勻性
  const expectedInterval = videoDuration / thumbnails.length;

  for (let i = 0; i < thumbnails.length; i += 1) {
    const expectedTime = i * expectedInterval;
    const actualTime = thumbnails[i].timePosition;
    const tolerance = expectedInterval * 0.2; // 允許 20% 的誤差

    expect(Math.abs(actualTime - expectedTime)).toBeLessThanOrEqual(tolerance);
  }

  console.log('縮圖時間軸分布驗證通過');
};

/**
 * 取得縮圖點擊後的影片時間
 */
export const getThumbnailClickTime = async (
  page: Page,
  index: number,
): Promise<number> => {
  // 點擊縮圖
  await clickThumbnail(page, index);

  // 等待影片時間更新
  await page.waitForTimeout(500);

  // 取得當前影片時間
  return page.evaluate(() => {
    const video = document.querySelector(
      '[data-testid="video-player"]',
    ) as HTMLVideoElement;
    return video ? video.currentTime : 0;
  });
};

/**
 * 驗證縮圖點擊功能
 */
export const verifyThumbnailClickNavigation = async (
  page: Page,
  index: number,
  tolerance: number = 1,
): Promise<void> => {
  const thumbnails = await getAllThumbnails(page);
  const thumbnail = thumbnails[index];

  if (!thumbnail) {
    throw new Error(`找不到索引為 ${index} 的縮圖`);
  }

  const expectedTime = thumbnail.timePosition;
  const actualTime = await getThumbnailClickTime(page, index);

  expect(Math.abs(actualTime - expectedTime)).toBeLessThanOrEqual(tolerance);

  console.log(`縮圖 ${index + 1} 點擊導航功能驗證通過`);
};

/**
 * 取得縮圖總數
 */
export const getThumbnailCount = async (page: Page): Promise<number> => {
  const thumbnails = await getAllThumbnails(page);
  return thumbnails.length;
};

/**
 * 清理縮圖資源
 */
export const cleanupThumbnails = async (page: Page): Promise<void> => {
  try {
    await page.evaluate(() => {
      // 清理縮圖快取
      localStorage.removeItem('thumbnailCache');
      sessionStorage.removeItem('generatedThumbnails');
    });

    console.log('已清理縮圖資源');
  } catch (error) {
    console.warn('清理縮圖資源時發生錯誤:', error);
  }
};
