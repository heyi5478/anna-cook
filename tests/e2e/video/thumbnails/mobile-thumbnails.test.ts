import { test, expect } from '@playwright/test';
import { waitForVideoLoaded } from '../../../helpers/video/video-playback';
import { isMobileDevice } from '../../../helpers/video/device-detection';
import {
  waitForThumbnailGeneration,
  getAllThumbnails,
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
 * 行動版縮圖生成功能測試
 */
test.describe('行動版縮圖生成功能', () => {
  /**
   * 每個測試前的準備工作
   */
  test.beforeEach(async ({ page }) => {
    // 取得測試影片檔案路徑
    getDefaultTestVideo();

    // 設定行動裝置視窗大小
    await page.setViewportSize({ width: 375, height: 667 });

    // 導航到影片編輯頁面
    await page.goto('/recipe-draft-video');
    await waitForNetworkIdle(page);

    // 等待影片載入完成
    await waitForVideoLoaded(page);

    // 確保在行動環境下進行測試
    const isMobile = await isMobileDevice(page);
    test.skip(!isMobile, '此測試僅適用於行動版環境');
  });

  /**
   * 每個測試後的清理工作
   */
  test.afterEach(async ({ page }) => {
    // 清理縮圖資源
    await cleanupThumbnails(page);
  });

  /**
   * 測試行動版生成3張縮圖功能
   */
  test('應該在行動版環境下只生成3張縮圖', async ({ page }) => {
    // 等待縮圖生成完成 (行動版只生成3張)
    await waitForThumbnailGeneration(page, { count: 3 });

    // 驗證縮圖數量正確
    const thumbnailCount = await getThumbnailCount(page);
    expect(thumbnailCount).toBe(3);

    // 檢查行動版縮圖容器
    await expect(
      page.locator('[data-testid="mobile-thumbnail-container"]'),
    ).toBeVisible();

    // 獲取所有縮圖資料
    const thumbnails = await getAllThumbnails(page);
    expect(thumbnails).toHaveLength(3);

    // 驗證每個縮圖都有有效的資料
    await thumbnails.reduce(async (previousPromise, thumbnail, index) => {
      await previousPromise;

      expect(thumbnail.url).toBeTruthy();
      expect(thumbnail.url).toMatch(/^data:image\//);
      expect(thumbnail.width).toBeGreaterThan(0);
      expect(thumbnail.height).toBeGreaterThan(0);
      expect(thumbnail.timePosition).toBeGreaterThanOrEqual(0);

      console.log(
        `行動版縮圖 ${index + 1} 驗證通過: ${thumbnail.width}x${thumbnail.height}`,
      );
    }, Promise.resolve());

    // 驗證行動版縮圖計數顯示
    await assertTextContent(
      page,
      '[data-testid="mobile-thumbnail-count"]',
      '3',
    );
  });

  /**
   * 測試行動版記憶體使用最佳化
   */
  test('應該在行動版上實作記憶體使用最佳化', async ({ page }) => {
    // 獲取初始記憶體使用量
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory
        ? (performance as any).memory.usedJSHeapSize
        : 0;
    });

    // 生成行動版縮圖
    await waitForThumbnailGeneration(page, { count: 3 });

    // 檢查記憶體使用量
    const afterGenerationMemory = await page.evaluate(() => {
      return (performance as any).memory
        ? (performance as any).memory.usedJSHeapSize
        : 0;
    });

    // 計算記憶體增長
    const memoryIncrease = afterGenerationMemory - initialMemory;

    // 驗證行動版記憶體增長更少 (應該小於30MB)
    expect(memoryIncrease).toBeLessThan(30 * 1024 * 1024);

    // 驗證行動版縮圖品質設定較低
    const thumbnails = await getAllThumbnails(page);
    const firstThumbnail = thumbnails[0];

    // 行動版應該使用較低的品質設定
    expect(firstThumbnail.quality).toBeLessThanOrEqual(0.3);

    // 檢查縮圖檔案大小較小
    const base64Data = firstThumbnail.url.split(',')[1];
    const estimatedSize = (base64Data.length * 3) / 4; // base64 to bytes
    expect(estimatedSize).toBeLessThan(20 * 1024); // 小於20KB

    console.log(
      `行動版記憶體增長: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`,
    );
  });

  /**
   * 測試行動版縮圖生成效能最佳化
   */
  test('行動版縮圖生成應該有更好的效能表現', async ({ page }) => {
    // 記錄開始時間
    const startTime = Date.now();

    // 觸發行動版縮圖生成
    await page.click('[data-testid="mobile-generate-thumbnails-btn"]');

    // 等待縮圖生成完成
    await waitForThumbnailGeneration(page, {
      count: 3,
      timeout: 10000, // 10秒超時
    });

    // 記錄結束時間
    const endTime = Date.now();
    const generationTime = endTime - startTime;

    // 驗證行動版生成時間更快 (應該在5秒內完成)
    expect(generationTime).toBeLessThan(5000);

    // 檢查行動版效能指標
    await assertElementInteractable(
      page,
      '[data-testid="mobile-performance-metrics"]',
    );

    const metricsText = await page
      .locator('[data-testid="mobile-generation-time"]')
      .textContent();

    const reportedTime = parseFloat(metricsText?.replace(/[^\d.]/g, '') || '0');
    assertNumberInRange(
      reportedTime,
      generationTime / 1000,
      '行動版效能報告時間',
      0.5,
    );

    console.log(`行動版縮圖生成耗時: ${generationTime}ms`);
  });

  /**
   * 測試行動裝置特定的處理邏輯
   */
  test('應該正確實作行動裝置特定的縮圖處理邏輯', async ({ page }) => {
    // 檢查行動版特定元素
    await expect(
      page.locator('[data-testid="mobile-thumbnail-controls"]'),
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="mobile-thumbnail-info"]'),
    ).toBeVisible();

    // 生成縮圖
    await waitForThumbnailGeneration(page, { count: 3 });

    // 驗證行動版縮圖尺寸設定
    const thumbnails = await getAllThumbnails(page);

    await thumbnails.reduce(async (previousPromise, _, index) => {
      await previousPromise;

      // 行動版使用相同的縮圖尺寸，但品質較低
      await verifyThumbnailDimensions(page, index, 160, 90);
    }, Promise.resolve());

    // 檢查行動版特有的觸控控制
    await expect(
      page.locator('[data-testid="touch-thumbnail-controls"]'),
    ).toBeVisible();

    // 驗證觸控友好的縮圖大小
    const thumbnailElements = page.locator('[data-testid="thumbnail-item"]');
    const firstThumbnailBox = await thumbnailElements.first().boundingBox();

    // 確保觸控區域足夠大 (至少44px高)
    expect(firstThumbnailBox?.height).toBeGreaterThanOrEqual(44);

    // 檢查行動版縮圖間距
    const spacingInfo = await page.evaluate(() => {
      const elementsOnPage = document.querySelectorAll(
        '[data-testid="thumbnail-item"]',
      );
      if (elementsOnPage.length >= 2) {
        const first = elementsOnPage[0].getBoundingClientRect();
        const second = elementsOnPage[1].getBoundingClientRect();
        return second.left - first.right;
      }
      return 0;
    });

    // 驗證行動版縮圖間距適當
    expect(spacingInfo).toBeGreaterThanOrEqual(8); // 至少8px間距

    console.log('行動裝置特定處理邏輯驗證通過');
  });

  /**
   * 測試行動版縮圖載入狀態指示
   */
  test('應該提供行動版適用的載入狀態指示', async ({ page }) => {
    // 觸發縮圖生成
    await page.click('[data-testid="mobile-generate-thumbnails-btn"]');

    // 檢查行動版載入指示器
    await waitForElementVisible(
      page,
      '[data-testid="mobile-loading-indicator"]',
    );

    // 驗證載入狀態文字
    await assertTextContent(
      page,
      '[data-testid="mobile-loading-text"]',
      /正在生成縮圖|載入中/,
    );

    // 檢查進度指示器
    await expect(
      page.locator('[data-testid="mobile-progress-bar"]'),
    ).toBeVisible();

    // 等待載入完成
    await waitForThumbnailGeneration(page, { count: 3 });

    // 驗證載入指示器消失
    await expect(
      page.locator('[data-testid="mobile-loading-indicator"]'),
    ).not.toBeVisible();

    // 檢查完成狀態
    await assertTextContent(
      page,
      '[data-testid="mobile-completion-status"]',
      /完成|已生成/,
    );

    console.log('行動版載入狀態指示驗證通過');
  });

  /**
   * 測試行動版網路最佳化
   */
  test('應該在行動版上實作網路使用最佳化', async ({ page }) => {
    // 模擬慢速網路環境
    await page.route('**/video/**', async (route) => {
      // 添加延遲模擬慢速網路
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 200);
      });
      await route.continue();
    });

    // 記錄網路請求
    const networkRequests: string[] = [];
    page.on('request', (request) => {
      networkRequests.push(request.url());
    });

    // 生成縮圖
    await waitForThumbnailGeneration(page, { count: 3 });

    // 驗證行動版網路請求較少
    const videoRequests = networkRequests.filter((url) =>
      url.includes('video'),
    );

    // 行動版應該優化網路請求
    expect(videoRequests.length).toBeLessThan(10);

    // 檢查快取機制
    const cacheStatus = await page.evaluate(() => {
      return localStorage.getItem('mobileThumbnailCache') !== null;
    });

    expect(cacheStatus).toBe(true);

    // 驗證縮圖壓縮率
    const thumbnails = await getAllThumbnails(page);
    const avgSize =
      thumbnails.reduce((total, thumb) => {
        const base64Data = thumb.url.split(',')[1];
        const size = (base64Data.length * 3) / 4;
        return total + size;
      }, 0) / thumbnails.length;

    // 行動版平均縮圖大小應該更小
    expect(avgSize).toBeLessThan(15 * 1024); // 小於15KB

    console.log(`行動版平均縮圖大小: ${(avgSize / 1024).toFixed(2)}KB`);
  });

  /**
   * 測試行動版觸控縮圖操作
   */
  test('應該支援行動版觸控縮圖操作', async ({ page }) => {
    // 等待縮圖生成
    await waitForThumbnailGeneration(page, { count: 3 });

    const thumbnails = await getAllThumbnails(page);
    const testIndices = [0, 1, 2]; // 測試所有3個縮圖

    // 使用 reduce 來測試每個縮圖的觸控操作
    await testIndices.reduce(async (previousPromise, index) => {
      await previousPromise;

      const thumbnail = thumbnails[index];
      const expectedTime = thumbnail.timePosition;

      // 使用觸控點擊縮圖
      const thumbnailLocator = page.locator(
        `[data-testid="thumbnail-item"]:nth-child(${index + 1})`,
      );
      const thumbnailBox = await thumbnailLocator.boundingBox();

      if (thumbnailBox) {
        await page.touchscreen.tap(
          thumbnailBox.x + thumbnailBox.width / 2,
          thumbnailBox.y + thumbnailBox.height / 2,
        );
      }

      await page.waitForTimeout(500);

      // 獲取當前播放時間
      const currentTime = await page.evaluate(() => {
        const video = document.querySelector('video') as HTMLVideoElement;
        return video ? video.currentTime : 0;
      });

      // 驗證觸控導航正確
      assertNumberInRange(
        currentTime,
        expectedTime,
        `行動版縮圖 ${index + 1} 觸控導航`,
        1,
      );

      // 檢查觸控回饋效果
      await expect(
        page.locator(`[data-testid="thumbnail-item"]:nth-child(${index + 1})`),
      ).toHaveClass(/active|selected/);

      console.log(`行動版縮圖 ${index + 1} 觸控操作測試通過`);
    }, Promise.resolve());
  });

  /**
   * 測試行動版橫豎屏適配
   */
  test('應該正確適配行動版橫豎屏模式', async ({ page }) => {
    // 初始豎屏模式
    await page.setViewportSize({ width: 375, height: 667 });
    await waitForThumbnailGeneration(page, { count: 3 });

    // 檢查豎屏模式縮圖佈局
    const portraitLayout = await page.evaluate(() => {
      const container = document.querySelector(
        '[data-testid="mobile-thumbnail-container"]',
      ) as HTMLElement;
      return container ? window.getComputedStyle(container).flexDirection : '';
    });

    expect(portraitLayout).toBe('column');

    // 切換到橫屏模式
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(500);

    // 檢查橫屏模式縮圖佈局
    const landscapeLayout = await page.evaluate(() => {
      const container = document.querySelector(
        '[data-testid="mobile-thumbnail-container"]',
      ) as HTMLElement;
      return container ? window.getComputedStyle(container).flexDirection : '';
    });

    expect(landscapeLayout).toBe('row');

    // 驗證橫屏模式下縮圖仍然可見
    await expect(
      page.locator('[data-testid="thumbnail-item"]').first(),
    ).toBeVisible();

    // 檢查橫屏模式下的縮圖尺寸調整
    const landscapeThumbnailBox = await page
      .locator('[data-testid="thumbnail-item"]')
      .first()
      .boundingBox();

    expect(landscapeThumbnailBox?.height).toBeLessThan(200); // 橫屏模式下高度限制

    console.log('行動版橫豎屏適配驗證通過');
  });

  /**
   * 測試行動版錯誤處理和恢復
   */
  test('應該在行動版上正確處理錯誤並提供恢復機制', async ({ page }) => {
    // 模擬低記憶體環境錯誤
    await page.route('**/thumbnails/**', (route) => route.abort());

    // 嘗試生成縮圖
    await page.click('[data-testid="mobile-generate-thumbnails-btn"]');

    // 檢查行動版錯誤提示
    await waitForElementVisible(page, '[data-testid="mobile-thumbnail-error"]');

    await assertTextContent(
      page,
      '[data-testid="mobile-thumbnail-error"]',
      /記憶體不足|生成失敗|網路錯誤/,
    );

    // 檢查行動版特有的恢復選項
    await expect(
      page.locator('[data-testid="mobile-retry-btn"]'),
    ).toBeVisible();

    await expect(
      page.locator('[data-testid="mobile-reduce-quality-btn"]'),
    ).toBeVisible();

    // 嘗試降低品質重試
    await page.unroute('**/thumbnails/**');
    await page.click('[data-testid="mobile-reduce-quality-btn"]');

    // 驗證降低品質後成功生成
    await waitForThumbnailGeneration(page, { count: 3 });

    const thumbnailCount = await getThumbnailCount(page);
    expect(thumbnailCount).toBe(3);

    // 驗證品質確實降低了
    const thumbnails = await getAllThumbnails(page);
    const firstThumbnail = thumbnails[0];
    expect(firstThumbnail.quality).toBeLessThan(0.2); // 更低的品質

    console.log('行動版錯誤處理和恢復測試通過');
  });
});
