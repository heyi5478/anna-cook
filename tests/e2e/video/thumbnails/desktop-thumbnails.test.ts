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
  getThumbnailCount,
  verifyThumbnailDimensions,
  cleanupThumbnails,
} from '../../../helpers/video/thumbnail-helpers';
import {
  waitForElementVisible,
  waitForNetworkIdle,
} from '../../../helpers/common/wait-utils';
import {
  assertElementInteractable,
  assertTextContent,
  assertNumberInRange,
} from '../../../helpers/common/assertion-helpers';
import { getDefaultTestVideo } from '../../../helpers/common/test-data';

/**
 * 桌面版縮圖生成功能測試
 */
test.describe('桌面版縮圖生成功能', () => {
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

    // 確保在桌面環境下進行測試
    const isMobile = await isMobileDevice(page);
    test.skip(isMobile, '此測試僅適用於桌面版環境');
  });

  /**
   * 每個測試後的清理工作
   */
  test.afterEach(async ({ page }) => {
    // 清理縮圖資源
    await cleanupThumbnails(page);
  });

  /**
   * 測試桌面版生成10張縮圖功能
   */
  test('應該在桌面版環境下生成10張縮圖', async ({ page }) => {
    // 等待縮圖生成完成
    await waitForThumbnailGeneration(page, { count: 10 });

    // 驗證縮圖數量正確
    const thumbnailCount = await getThumbnailCount(page);
    expect(thumbnailCount).toBe(10);

    // 檢查縮圖容器可見
    await expect(
      page.locator('[data-testid="thumbnail-container"]'),
    ).toBeVisible();

    // 獲取所有縮圖資料
    const thumbnails = await getAllThumbnails(page);
    expect(thumbnails).toHaveLength(10);

    // 驗證每個縮圖都有有效的資料
    await thumbnails.reduce(async (previousPromise, thumbnail, index) => {
      await previousPromise;

      expect(thumbnail.url).toBeTruthy();
      expect(thumbnail.url).toMatch(/^data:image\//);
      expect(thumbnail.width).toBeGreaterThan(0);
      expect(thumbnail.height).toBeGreaterThan(0);
      expect(thumbnail.timePosition).toBeGreaterThanOrEqual(0);

      console.log(
        `縮圖 ${index + 1} 驗證通過: ${thumbnail.width}x${thumbnail.height}`,
      );
    }, Promise.resolve());

    // 驗證縮圖標記顯示
    await assertTextContent(page, '[data-testid="thumbnail-count"]', '10');
  });

  /**
   * 測試縮圖品質和格式檢查
   */
  test('應該生成符合品質標準的縮圖格式', async ({ page }) => {
    // 等待縮圖生成完成
    await waitForThumbnailGeneration(page, { count: 10 });

    // 驗證縮圖品質
    await verifyThumbnailQuality(page, {
      minWidth: 160,
      minHeight: 90,
      maxFileSize: 50 * 1024, // 50KB
      expectedFormat: 'jpeg',
    });

    // 檢查預設尺寸
    const thumbnails = await getAllThumbnails(page);

    await thumbnails.reduce(async (previousPromise, _, index) => {
      await previousPromise;
      await verifyThumbnailDimensions(page, index, 160, 90);
    }, Promise.resolve());

    // 驗證縮圖編碼格式
    const firstThumbnail = thumbnails[0];
    expect(firstThumbnail.url).toMatch(/^data:image\/jpeg/);

    // 檢查品質設定
    expect(firstThumbnail.quality).toBeGreaterThan(0.5);
    expect(firstThumbnail.quality).toBeLessThanOrEqual(1.0);

    // 驗證 base64 編碼正確性
    const base64Data = firstThumbnail.url.split(',')[1];
    expect(base64Data).toBeTruthy();
    expect(base64Data.length).toBeGreaterThan(100);

    console.log('縮圖品質和格式驗證通過');
  });

  /**
   * 測試縮圖生成時間效能
   */
  test('縮圖生成應該在合理時間內完成', async ({ page }) => {
    // 記錄開始時間
    const startTime = Date.now();

    // 觸發縮圖生成
    await page.click('[data-testid="generate-thumbnails-btn"]');

    // 等待縮圖生成完成
    await waitForThumbnailGeneration(page, {
      count: 10,
      timeout: 15000, // 15秒超時
    });

    // 記錄結束時間
    const endTime = Date.now();
    const generationTime = endTime - startTime;

    // 驗證生成時間合理 (應該在10秒內完成)
    expect(generationTime).toBeLessThan(10000);

    // 檢查效能指標
    await assertElementInteractable(
      page,
      '[data-testid="performance-metrics"]',
    );

    const metricsText = await page
      .locator('[data-testid="generation-time"]')
      .textContent();

    const reportedTime = parseFloat(metricsText?.replace(/[^\d.]/g, '') || '0');
    assertNumberInRange(reportedTime, generationTime / 1000, '效能報告時間', 1);

    console.log(`縮圖生成耗時: ${generationTime}ms`);
  });

  /**
   * 測試縮圖記憶體使用最佳化
   */
  test('應該正確管理縮圖生成的記憶體使用', async ({ page }) => {
    // 獲取初始記憶體使用量
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory
        ? (performance as any).memory.usedJSHeapSize
        : 0;
    });

    // 生成縮圖
    await waitForThumbnailGeneration(page, { count: 10 });

    // 檢查記憶體使用量
    const afterGenerationMemory = await page.evaluate(() => {
      return (performance as any).memory
        ? (performance as any).memory.usedJSHeapSize
        : 0;
    });

    // 計算記憶體增長
    const memoryIncrease = afterGenerationMemory - initialMemory;

    // 驗證記憶體增長合理 (應該小於100MB)
    expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024);

    // 清理縮圖並檢查記憶體釋放
    await page.click('[data-testid="clear-thumbnails-btn"]');
    await page.waitForTimeout(1000);

    const afterCleanupMemory = await page.evaluate(() => {
      // 強制垃圾回收 (如果可用)
      if (window.gc) {
        window.gc();
      }
      return (performance as any).memory
        ? (performance as any).memory.usedJSHeapSize
        : 0;
    });

    // 驗證記憶體有所釋放
    expect(afterCleanupMemory).toBeLessThan(afterGenerationMemory);

    console.log(`記憶體增長: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);
  });

  /**
   * 測試縮圖時間軸分布均勻性
   */
  test('縮圖應該均勻分布在影片時間軸上', async ({ page }) => {
    // 獲取影片總時長
    const videoDuration = await getVideoDuration(page);
    expect(videoDuration).toBeGreaterThan(0);

    // 等待縮圖生成
    await waitForThumbnailGeneration(page, { count: 10 });

    // 驗證縮圖時間軸分布
    await verifyThumbnailDistribution(page, videoDuration);

    // 檢查時間間隔
    const thumbnails = await getAllThumbnails(page);
    const expectedInterval = videoDuration / 10;

    // 使用 reduce 來驗證每個縮圖的時間位置
    await thumbnails.reduce(async (previousPromise, thumbnail, index) => {
      await previousPromise;

      const expectedTime = index * expectedInterval;
      const actualTime = thumbnail.timePosition;
      const tolerance = expectedInterval * 0.1; // 允許10%誤差

      assertNumberInRange(
        actualTime,
        expectedTime,
        `縮圖 ${index + 1} 時間位置`,
        tolerance,
      );
    }, Promise.resolve());

    console.log('縮圖時間軸分布驗證通過');
  });

  /**
   * 測試縮圖點擊導航功能
   */
  test('點擊縮圖應該能夠正確導航到對應時間點', async ({ page }) => {
    // 等待縮圖生成
    await waitForThumbnailGeneration(page, { count: 10 });

    const thumbnails = await getAllThumbnails(page);
    const testIndices = [0, 2, 5, 7, 9]; // 測試幾個不同的縮圖

    // 使用 reduce 來測試每個選定的縮圖
    await testIndices.reduce(async (previousPromise, index) => {
      await previousPromise;

      const thumbnail = thumbnails[index];
      const expectedTime = thumbnail.timePosition;

      // 點擊縮圖
      await page.click(
        `[data-testid="thumbnail-item"]:nth-child(${index + 1})`,
      );
      await page.waitForTimeout(500);

      // 獲取當前播放時間
      const currentTime = await page.evaluate(() => {
        const video = document.querySelector('video') as HTMLVideoElement;
        return video ? video.currentTime : 0;
      });

      // 驗證時間跳轉正確
      assertNumberInRange(
        currentTime,
        expectedTime,
        `縮圖 ${index + 1} 導航`,
        1,
      );

      console.log(`縮圖 ${index + 1} 點擊導航測試通過`);
    }, Promise.resolve());
  });

  /**
   * 測試縮圖載入錯誤處理
   */
  test('應該正確處理縮圖載入錯誤情況', async ({ page }) => {
    // 模擬網路錯誤影響縮圖載入
    await page.route('**/thumbnails/**', (route) => route.abort());

    // 嘗試生成縮圖
    await page.click('[data-testid="generate-thumbnails-btn"]');

    // 檢查錯誤提示
    await waitForElementVisible(page, '[data-testid="thumbnail-error"]');

    await assertTextContent(
      page,
      '[data-testid="thumbnail-error"]',
      /生成失敗|載入錯誤|無法生成縮圖/,
    );

    // 檢查重試按鈕
    await expect(
      page.locator('[data-testid="retry-thumbnail-btn"]'),
    ).toBeVisible();

    // 移除網路攔截並重試
    await page.unroute('**/thumbnails/**');
    await page.click('[data-testid="retry-thumbnail-btn"]');

    // 驗證重試後成功
    await waitForThumbnailGeneration(page, { count: 10 });

    const thumbnailCount = await getThumbnailCount(page);
    expect(thumbnailCount).toBe(10);

    console.log('縮圖錯誤處理測試通過');
  });

  /**
   * 測試縮圖快取機制
   */
  test('應該正確實作縮圖快取機制提升效能', async ({ page }) => {
    // 第一次生成縮圖
    const firstGenerationStart = Date.now();
    await waitForThumbnailGeneration(page, { count: 10 });
    const firstGenerationTime = Date.now() - firstGenerationStart;

    // 獲取縮圖資料
    const firstThumbnails = await getAllThumbnails(page);
    expect(firstThumbnails).toHaveLength(10);

    // 清除顯示但保留快取
    await page.click('[data-testid="clear-display-btn"]');

    // 再次生成縮圖 (應該使用快取)
    const secondGenerationStart = Date.now();
    await page.click('[data-testid="generate-thumbnails-btn"]');
    await waitForThumbnailGeneration(page, { count: 10 });
    const secondGenerationTime = Date.now() - secondGenerationStart;

    // 驗證第二次生成更快 (使用了快取)
    expect(secondGenerationTime).toBeLessThan(firstGenerationTime * 0.5);

    // 驗證縮圖內容一致
    const secondThumbnails = await getAllThumbnails(page);
    expect(secondThumbnails).toHaveLength(10);

    // 比較縮圖內容一致性
    await firstThumbnails.reduce(async (previousPromise, firstThumb, index) => {
      await previousPromise;

      const secondThumb = secondThumbnails[index];
      expect(secondThumb.url).toBe(firstThumb.url);
      expect(secondThumb.timePosition).toBe(firstThumb.timePosition);
    }, Promise.resolve());

    console.log(
      `快取效果: 第一次 ${firstGenerationTime}ms, 第二次 ${secondGenerationTime}ms`,
    );
  });
});
