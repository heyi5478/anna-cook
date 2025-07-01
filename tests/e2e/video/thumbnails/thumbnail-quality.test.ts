import { test, expect } from '@playwright/test';
import {
  waitForVideoLoaded,
  getVideoDuration,
} from '../../../helpers/video/video-playback';
import { isMobileDevice } from '../../../helpers/video/device-detection';
import {
  waitForThumbnailGeneration,
  getAllThumbnails,
  verifyThumbnailQuality,
  verifyThumbnailDistribution,
  cleanupThumbnails,
  waitForSpecificThumbnail,
} from '../../../helpers/video/thumbnail-helpers';
import { waitForNetworkIdle } from '../../../helpers/common/wait-utils';
import { assertNumberInRange } from '../../../helpers/common/assertion-helpers';
import { getDefaultTestVideo } from '../../../helpers/common/test-data';

/**
 * 縮圖品質驗證測試
 */
test.describe('縮圖品質驗證功能', () => {
  /**
   * 每個測試前的準備工作
   */
  test.beforeEach(async ({ page }) => {
    // 取得測試影片檔案路徑
    getDefaultTestVideo();

    // 導航到影片編輯頁面
    await page.goto('/recipe-draft-video');
    await waitForNetworkIdle(page);

    // 等待影片載入完成
    await waitForVideoLoaded(page);
  });

  /**
   * 每個測試後的清理工作
   */
  test.afterEach(async ({ page }) => {
    // 清理縮圖資源
    await cleanupThumbnails(page);
  });

  /**
   * 測試縮圖解析度驗證
   */
  test('應該生成符合解析度要求的縮圖', async ({ page }) => {
    // 檢查是否為行動裝置以決定縮圖數量
    const isMobile = await isMobileDevice(page);
    const expectedCount = isMobile ? 3 : 10;

    // 等待縮圖生成完成
    await waitForThumbnailGeneration(page, { count: expectedCount });

    // 獲取所有縮圖資料
    const thumbnails = await getAllThumbnails(page);
    expect(thumbnails).toHaveLength(expectedCount);

    // 驗證每個縮圖的解析度
    await thumbnails.reduce(async (previousPromise, thumbnail, index) => {
      await previousPromise;

      // 檢查預設解析度 160x90
      expect(thumbnail.width).toBe(160);
      expect(thumbnail.height).toBe(90);

      // 驗證寬高比正確 (16:9)
      const aspectRatio = thumbnail.width / thumbnail.height;
      assertNumberInRange(
        aspectRatio,
        16 / 9,
        `縮圖 ${index + 1} 寬高比`,
        0.01,
      );

      // 檢查解析度不為0
      expect(thumbnail.width).toBeGreaterThan(0);
      expect(thumbnail.height).toBeGreaterThan(0);

      console.log(
        `縮圖 ${index + 1} 解析度驗證通過: ${thumbnail.width}x${thumbnail.height}`,
      );
    }, Promise.resolve());

    // 驗證所有縮圖尺寸一致性
    const firstThumbnail = thumbnails[0];
    await thumbnails.reduce(async (previousPromise, thumbnail) => {
      await previousPromise;

      expect(thumbnail.width).toBe(firstThumbnail.width);
      expect(thumbnail.height).toBe(firstThumbnail.height);
    }, Promise.resolve());

    console.log('縮圖解析度驗證完成');
  });

  /**
   * 測試縮圖檔案大小驗證
   */
  test('應該生成合理檔案大小的縮圖', async ({ page }) => {
    const isMobile = await isMobileDevice(page);
    const expectedCount = isMobile ? 3 : 10;

    // 等待縮圖生成完成
    await waitForThumbnailGeneration(page, { count: expectedCount });

    // 獲取所有縮圖資料
    const thumbnails = await getAllThumbnails(page);

    // 驗證每個縮圖的檔案大小
    const fileSizes: number[] = [];

    await thumbnails.reduce(async (previousPromise, thumbnail, index) => {
      await previousPromise;

      // 計算 base64 編碼的檔案大小
      const base64Data = thumbnail.url.split(',')[1];
      const fileSize = (base64Data.length * 3) / 4; // base64 to bytes

      fileSizes.push(fileSize);

      // 根據設備類型設定不同的檔案大小限制
      const maxSize = isMobile ? 20 * 1024 : 50 * 1024; // 行動版20KB，桌面版50KB
      expect(fileSize).toBeLessThan(maxSize);

      // 確保檔案大小不會太小 (至少1KB)
      expect(fileSize).toBeGreaterThan(1 * 1024);

      console.log(
        `縮圖 ${index + 1} 檔案大小: ${(fileSize / 1024).toFixed(2)}KB`,
      );
    }, Promise.resolve());

    // 計算平均檔案大小
    const avgSize =
      fileSizes.reduce((sum, size) => sum + size, 0) / fileSizes.length;
    const expectedAvgSize = isMobile ? 15 * 1024 : 35 * 1024;

    expect(avgSize).toBeLessThan(expectedAvgSize);

    // 檢查檔案大小變異性合理
    const maxSize = fileSizes.length > 0 ? Math.max(...fileSizes) : 0;
    const minSize = fileSizes.length > 0 ? Math.min(...fileSizes) : 0;
    const sizeVariation = avgSize > 0 ? (maxSize - minSize) / avgSize : 0;

    // 變異性不應該超過50%
    expect(sizeVariation).toBeLessThan(0.5);

    console.log(`平均檔案大小: ${(avgSize / 1024).toFixed(2)}KB`);
  });

  /**
   * 測試base64編碼正確性
   */
  test('應該生成有效的base64編碼縮圖', async ({ page }) => {
    const isMobile = await isMobileDevice(page);
    const expectedCount = isMobile ? 3 : 10;

    // 等待縮圖生成完成
    await waitForThumbnailGeneration(page, { count: expectedCount });

    // 獲取所有縮圖資料
    const thumbnails = await getAllThumbnails(page);

    // 驗證每個縮圖的base64編碼
    await thumbnails.reduce(async (previousPromise, thumbnail, index) => {
      await previousPromise;

      // 檢查URL格式正確
      expect(thumbnail.url).toMatch(/^data:image\/(jpeg|png|webp);base64,/);

      // 分離MIME類型和base64資料
      const parts = thumbnail.url.split(',');
      expect(parts).toHaveLength(2);

      const mimeType = parts[0];
      const base64Data = parts[1];

      // 驗證MIME類型
      expect(mimeType).toMatch(/^data:image\/(jpeg|png|webp);base64$/);

      // 驗證base64編碼格式
      expect(base64Data).toMatch(/^[A-Za-z0-9+/]*={0,2}$/);

      // 檢查base64資料長度合理
      expect(base64Data.length).toBeGreaterThan(100);
      expect(base64Data.length % 4).toBe(0); // base64應該是4的倍數

      // 驗證可以解碼
      try {
        const decoded = atob(base64Data);
        expect(decoded.length).toBeGreaterThan(0);
      } catch (error) {
        throw new Error(`縮圖 ${index + 1} base64解碼失敗`);
      }

      console.log(`縮圖 ${index + 1} base64編碼驗證通過`);
    }, Promise.resolve());

    // 測試在瀏覽器中載入縮圖
    const firstThumbnail = thumbnails[0];
    const loadResult = await page.evaluate((dataUrl) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () =>
          resolve({ success: true, width: img.width, height: img.height });
        img.onerror = () => resolve({ success: false });
        img.src = dataUrl;
      });
    }, firstThumbnail.url);

    expect(loadResult).toMatchObject({
      success: true,
      width: 160,
      height: 90,
    });

    console.log('base64編碼正確性驗證完成');
  });

  /**
   * 測試縮圖載入效能
   */
  test('縮圖載入應該具有良好的效能表現', async ({ page }) => {
    const isMobile = await isMobileDevice(page);
    const expectedCount = isMobile ? 3 : 10;

    // 記錄整體載入開始時間
    const overallStartTime = Date.now();

    // 等待縮圖生成完成
    await waitForThumbnailGeneration(page, {
      count: expectedCount,
      timeout: 15000,
    });

    const overallLoadTime = Date.now() - overallStartTime;

    // 驗證整體載入時間合理
    const maxOverallTime = isMobile ? 8000 : 12000; // 行動版8秒，桌面版12秒
    expect(overallLoadTime).toBeLessThan(maxOverallTime);

    // 測試單個縮圖載入效能
    const individualLoadTimes: number[] = [];

    await Array.from({ length: expectedCount }, (_, index) => index).reduce(
      async (previousPromise, index) => {
        await previousPromise;

        const startTime = Date.now();
        await waitForSpecificThumbnail(page, index, 3000);
        const loadTime = Date.now() - startTime;

        individualLoadTimes.push(loadTime);

        // 單個縮圖載入時間應該合理
        expect(loadTime).toBeLessThan(3000);

        console.log(`縮圖 ${index + 1} 載入時間: ${loadTime}ms`);
      },
      Promise.resolve(),
    );

    // 計算平均載入時間
    const avgLoadTime =
      individualLoadTimes.reduce((sum, time) => sum + time, 0) /
      individualLoadTimes.length;
    const maxAvgTime = isMobile ? 1500 : 2000;

    expect(avgLoadTime).toBeLessThan(maxAvgTime);

    // 檢查載入時間的一致性
    const maxIndividualTime =
      individualLoadTimes.length > 0 ? Math.max(...individualLoadTimes) : 0;
    const minIndividualTime =
      individualLoadTimes.length > 0 ? Math.min(...individualLoadTimes) : 0;
    const timeVariation =
      avgLoadTime > 0
        ? (maxIndividualTime - minIndividualTime) / avgLoadTime
        : 0;

    // 載入時間變異不應該太大
    expect(timeVariation).toBeLessThan(2.0);

    console.log(
      `平均載入時間: ${avgLoadTime.toFixed(2)}ms，總載入時間: ${overallLoadTime}ms`,
    );
  });

  /**
   * 測試不同品質設定的縮圖比較
   */
  test('應該正確處理不同品質設定的縮圖', async ({ page }) => {
    const isMobile = await isMobileDevice(page);

    // 測試高品質設定
    await page.click('[data-testid="high-quality-btn"]');
    await waitForThumbnailGeneration(page, { count: isMobile ? 3 : 10 });

    const highQualityThumbnails = await getAllThumbnails(page);

    // 清理並測試低品質設定
    await page.click('[data-testid="clear-thumbnails-btn"]');
    await page.click('[data-testid="low-quality-btn"]');
    await waitForThumbnailGeneration(page, { count: isMobile ? 3 : 10 });

    const lowQualityThumbnails = await getAllThumbnails(page);

    // 比較品質設定差異
    expect(highQualityThumbnails).toHaveLength(lowQualityThumbnails.length);

    await highQualityThumbnails.reduce(
      async (previousPromise, highQualityThumb, index) => {
        await previousPromise;

        const lowQualityThumb = lowQualityThumbnails[index];

        // 驗證品質值不同
        expect(highQualityThumb.quality ?? 0).toBeGreaterThan(
          lowQualityThumb.quality ?? 0,
        );

        // 計算檔案大小
        const highQualitySize =
          (highQualityThumb.url.split(',')[1].length * 3) / 4;
        const lowQualitySize =
          (lowQualityThumb.url.split(',')[1].length * 3) / 4;

        // 高品質縮圖應該有更大的檔案
        expect(highQualitySize).toBeGreaterThan(lowQualitySize);

        // 但解析度應該相同
        expect(highQualityThumb.width).toBe(lowQualityThumb.width);
        expect(highQualityThumb.height).toBe(lowQualityThumb.height);

        console.log(
          `縮圖 ${index + 1} 品質比較 - 高品質: ${(highQualitySize / 1024).toFixed(2)}KB, 低品質: ${(lowQualitySize / 1024).toFixed(2)}KB`,
        );
      },
      Promise.resolve(),
    );

    console.log('不同品質設定縮圖比較完成');
  });

  /**
   * 測試縮圖時間戳準確性
   */
  test('縮圖應該準確對應影片時間點', async ({ page }) => {
    // 獲取影片總時長
    const videoDuration = await getVideoDuration(page);
    expect(videoDuration).toBeGreaterThan(0);

    const isMobile = await isMobileDevice(page);
    const expectedCount = isMobile ? 3 : 10;

    // 等待縮圖生成完成
    await waitForThumbnailGeneration(page, { count: expectedCount });

    // 驗證縮圖時間軸分布
    await verifyThumbnailDistribution(page, videoDuration);

    // 獲取縮圖資料
    const thumbnails = await getAllThumbnails(page);

    // 檢查時間點準確性
    await thumbnails.reduce(async (previousPromise, thumbnail, index) => {
      await previousPromise;

      const expectedTime = (index / (expectedCount - 1)) * videoDuration;
      const actualTime = thumbnail.timePosition;
      const tolerance = (videoDuration / expectedCount) * 0.1; // 10%容忍度

      assertNumberInRange(
        actualTime,
        expectedTime,
        `縮圖 ${index + 1} 時間點`,
        tolerance,
      );

      // 驗證時間戳在合理範圍內
      expect(actualTime).toBeGreaterThanOrEqual(0);
      expect(actualTime).toBeLessThanOrEqual(videoDuration);

      console.log(
        `縮圖 ${index + 1} 時間點驗證通過: ${actualTime.toFixed(2)}s`,
      );
    }, Promise.resolve());

    // 檢查時間點遞增順序
    await thumbnails
      .slice(1)
      .reduce(async (previousPromise, thumbnail, index) => {
        await previousPromise;

        const previousThumbnail = thumbnails[index];
        expect(thumbnail.timePosition).toBeGreaterThanOrEqual(
          previousThumbnail.timePosition,
        );
      }, Promise.resolve());

    console.log('縮圖時間戳準確性驗證完成');
  });

  /**
   * 測試縮圖視覺品質檢查
   */
  test('應該檢查縮圖視覺品質符合標準', async ({ page }) => {
    const isMobile = await isMobileDevice(page);
    const expectedCount = isMobile ? 3 : 10;

    // 等待縮圖生成完成
    await waitForThumbnailGeneration(page, { count: expectedCount });

    // 使用綜合品質驗證函式
    await verifyThumbnailQuality(page, {
      minWidth: 160,
      minHeight: 90,
      maxFileSize: isMobile ? 20 * 1024 : 50 * 1024,
      expectedFormat: 'jpeg',
    });

    // 檢查縮圖視覺完整性
    const thumbnails = await getAllThumbnails(page);

    await thumbnails.reduce(async (previousPromise, thumbnail, index) => {
      await previousPromise;

      // 在瀏覽器中測試縮圖載入
      const imageValidation = await page.evaluate((dataUrl) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            // 檢查圖片是否完整載入
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;

            if (ctx) {
              ctx.drawImage(img, 0, 0);
              const imageData = ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height,
              );
              const pixels = imageData.data;

              // 檢查是否有像素資料
              let hasContent = false;
              for (let i = 0; i < pixels.length; i += 4) {
                if (
                  pixels[i] !== 0 ||
                  pixels[i + 1] !== 0 ||
                  pixels[i + 2] !== 0
                ) {
                  hasContent = true;
                  break;
                }
              }

              resolve({
                loaded: true,
                hasContent,
                width: img.width,
                height: img.height,
              });
            } else {
              resolve({ loaded: false, hasContent: false });
            }
          };
          img.onerror = () => resolve({ loaded: false, hasContent: false });
          img.src = dataUrl;
        });
      }, thumbnail.url);

      expect(imageValidation).toMatchObject({
        loaded: true,
        hasContent: true,
        width: 160,
        height: 90,
      });

      console.log(`縮圖 ${index + 1} 視覺品質檢查通過`);
    }, Promise.resolve());

    console.log('縮圖視覺品質檢查完成');
  });

  /**
   * 測試不同格式縮圖支援
   */
  test('應該支援不同格式的縮圖生成', async ({ page }) => {
    const formats = ['jpeg', 'png', 'webp'];
    const isMobile = await isMobileDevice(page);
    const expectedCount = isMobile ? 3 : 10;

    // 測試每種格式
    await formats.reduce(async (previousPromise, format) => {
      await previousPromise;

      // 設定格式
      await page.selectOption(
        '[data-testid="thumbnail-format-select"]',
        format,
      );

      // 生成縮圖
      await page.click('[data-testid="generate-thumbnails-btn"]');
      await waitForThumbnailGeneration(page, { count: expectedCount });

      // 獲取縮圖資料
      const thumbnails = await getAllThumbnails(page);

      // 驗證格式正確
      await thumbnails.reduce(async (prevPromise, thumbnail, index) => {
        await prevPromise;

        expect(thumbnail.url).toMatch(
          new RegExp(`^data:image/${format};base64,`),
        );
        console.log(`${format.toUpperCase()} 格式縮圖 ${index + 1} 驗證通過`);
      }, Promise.resolve());

      // 清理為下次測試準備
      await page.click('[data-testid="clear-thumbnails-btn"]');
      await page.waitForTimeout(500);

      console.log(`${format.toUpperCase()} 格式縮圖測試完成`);
    }, Promise.resolve());

    console.log('所有格式縮圖支援測試完成');
  });
});
