import { test, expect } from '@playwright/test';
import {
  waitForVideoLoaded,
  getCurrentTime,
  getVideoDuration,
  seekToTime,
} from '../../../helpers/video/video-playback';
import { isMobileDevice } from '../../../helpers/video/device-detection';
import {
  waitForElementVisible,
  waitForNetworkIdle,
} from '../../../helpers/common/wait-utils';
import {
  assertElementInteractable,
  assertNumberInRange,
  assertTimeDifference,
} from '../../../helpers/common/assertion-helpers';
import { getDefaultTestVideo } from '../../../helpers/common/test-data';

/**
 * 從提示文字解析時間
 */
async function parseTimeFromTooltip(tooltipText: string): Promise<number> {
  const timeMatch = tooltipText.match(/(\d{2}):(\d{2})/);
  if (timeMatch) {
    const minutes = parseInt(timeMatch[1], 10);
    const seconds = parseInt(timeMatch[2], 10);
    return minutes * 60 + seconds;
  }
  return 0;
}

/**
 * 時間軸操作測試
 */
test.describe('時間軸操作控制', () => {
  let videoDuration: number;

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

    // 獲取影片總時長
    videoDuration = await getVideoDuration(page);
  });

  /**
   * 測試時間軸拖拽功能
   */
  test('應該能夠透過拖拽時間軸調整播放位置', async ({ page }) => {
    // 檢查時間軸滑桿元素
    await assertElementInteractable(page, '[data-testid="timeline-slider"]');

    const timelineSlider = page.locator('[data-testid="timeline-slider"]');
    const sliderBox = await timelineSlider.boundingBox();

    expect(sliderBox).toBeTruthy();
    if (!sliderBox) return;

    // 獲取初始時間
    const initialTime = await getCurrentTime(page);
    expect(initialTime).toBe(0);

    // 拖拽到時間軸中間位置 (50%)
    const targetX = sliderBox.x + sliderBox.width * 0.5;
    const targetY = sliderBox.y + sliderBox.height * 0.5;

    // 執行拖拽操作
    await timelineSlider.hover();
    await page.mouse.down();
    await page.mouse.move(targetX, targetY);
    await page.mouse.up();

    // 驗證時間位置更新
    await page.waitForTimeout(500); // 等待時間更新
    const newTime = await getCurrentTime(page);
    const expectedTime = videoDuration * 0.5;

    // 允許 ±1 秒的誤差
    assertTimeDifference(newTime, expectedTime, '時間軸拖拽驗證', 1);

    // 檢查時間軸位置指示器
    const sliderValue = await timelineSlider.getAttribute('value');
    const normalizedValue = parseFloat(sliderValue || '0') / 100;
    assertNumberInRange(normalizedValue, 0.5, '滑桿位置驗證', 0.05);
  });

  /**
   * 測試時間點跳轉功能
   */
  test('應該能夠精確跳轉到指定時間點', async ({ page }) => {
    const targetTimes = [
      0,
      videoDuration * 0.25,
      videoDuration * 0.75,
      videoDuration - 1,
    ];

    await targetTimes.reduce(async (previousPromise, targetTime) => {
      await previousPromise;

      // 使用 seekToTime 跳轉到指定時間
      await seekToTime(page, targetTime);

      // 等待時間更新
      await page.waitForTimeout(300);

      // 驗證當前時間
      const currentTime = await getCurrentTime(page);
      assertTimeDifference(
        currentTime,
        targetTime,
        `時間跳轉到 ${targetTime}`,
        0.5,
      );

      // 檢查時間軸滑桿位置同步更新
      const expectedSliderValue = (targetTime / videoDuration) * 100;
      const sliderValue = await page
        .locator('[data-testid="timeline-slider"]')
        .getAttribute('value');
      const actualSliderValue = parseFloat(sliderValue || '0');

      assertNumberInRange(
        actualSliderValue,
        expectedSliderValue,
        '滑桿同步驗證',
        2,
      );

      // 檢查時間顯示更新
      const displayedTime = await page
        .locator('[data-testid="current-time"]')
        .textContent();
      expect(displayedTime).toMatch(/\d{2}:\d{2}/);
    }, Promise.resolve());
  });

  /**
   * 測試滑桿值變更處理 (atTrimChange)
   */
  test('滑桿值變更應該正確觸發時間更新', async ({ page }) => {
    const timelineSlider = page.locator('[data-testid="timeline-slider"]');

    // 測試不同的滑桿值
    const testValues = [0, 25, 50, 75, 100];

    await testValues.reduce(async (previousPromise, value) => {
      await previousPromise;

      // 設定滑桿值 (觸發 atTrimChange)
      await timelineSlider.fill(value.toString());

      // 等待變更處理
      await page.waitForTimeout(200);

      // 驗證時間更新
      const expectedTime = (value / 100) * videoDuration;
      const actualTime = await getCurrentTime(page);

      assertTimeDifference(
        actualTime,
        expectedTime,
        `滑桿值 ${value}% 時間更新`,
        1,
      );

      // 檢查時間軸變更事件觸發
      const changeEventFired = await page.evaluate(() => {
        return (window as any).lastTrimChangeEvent !== undefined;
      });
      expect(changeEventFired).toBe(true);
    }, Promise.resolve());
  });

  /**
   * 測試時間軸精細調整功能
   */
  test('應該支援時間軸的精細調整操作', async ({ page }) => {
    const timelineSlider = page.locator('[data-testid="timeline-slider"]');

    // 設定到中間位置
    await timelineSlider.fill('50');
    await page.waitForTimeout(300);

    const initialTime = await getCurrentTime(page);

    // 測試鍵盤方向鍵精細調整
    await timelineSlider.focus();

    // 右方向鍵前進
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(200);

    const timeAfterRight = await getCurrentTime(page);
    expect(timeAfterRight).toBeGreaterThan(initialTime);

    // 左方向鍵後退
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(200);

    const timeAfterLeft = await getCurrentTime(page);
    expect(timeAfterLeft).toBeLessThan(timeAfterRight);

    // 測試頁面上下鍵大幅度調整
    await page.keyboard.press('PageUp');
    await page.waitForTimeout(200);

    const timeAfterPageUp = await getCurrentTime(page);
    expect(timeAfterPageUp).toBeGreaterThan(timeAfterLeft);

    await page.keyboard.press('PageDown');
    await page.waitForTimeout(200);

    const timeAfterPageDown = await getCurrentTime(page);
    expect(timeAfterPageDown).toBeLessThan(timeAfterPageUp);
  });

  /**
   * 測試時間軸標記和提示功能
   */
  test('時間軸應該顯示正確的時間標記和提示', async ({ page }) => {
    // 檢查時間軸刻度標記
    await expect(
      page.locator('[data-testid="timeline-markers"]'),
    ).toBeVisible();

    // 檢查主要時間點標記 (0%, 25%, 50%, 75%, 100%)
    const markers = ['0', '25', '50', '75', '100'];

    // 並行檢查所有標記的可見性
    await Promise.all(
      markers.map((marker) =>
        expect(
          page.locator(`[data-testid="time-marker-${marker}"]`),
        ).toBeVisible(),
      ),
    );

    // 檢查滑鼠懸停時間提示
    const timelineSlider = page.locator('[data-testid="timeline-slider"]');
    const sliderBox = await timelineSlider.boundingBox();

    if (sliderBox) {
      // 懸停在 30% 位置
      const hoverX = sliderBox.x + sliderBox.width * 0.3;
      const hoverY = sliderBox.y + sliderBox.height * 0.5;

      await page.mouse.move(hoverX, hoverY);

      // 檢查時間提示顯示
      await waitForElementVisible(page, '[data-testid="time-tooltip"]');

      const tooltipText = await page
        .locator('[data-testid="time-tooltip"]')
        .textContent();
      expect(tooltipText).toMatch(/\d{2}:\d{2}/);

      // 驗證提示時間正確性
      const expectedTime = videoDuration * 0.3;
      const tooltipTime = await parseTimeFromTooltip(tooltipText || '');
      assertTimeDifference(tooltipTime, expectedTime, '時間提示驗證', 1);
    }
  });

  /**
   * 測試時間軸載入狀態指示
   */
  test('時間軸應該正確顯示影片載入進度', async ({ page }) => {
    // 檢查載入進度條
    await expect(page.locator('[data-testid="buffer-progress"]')).toBeVisible();

    // 驗證載入進度更新
    const initialBufferWidth = await page
      .locator('[data-testid="buffer-progress"]')
      .evaluate((el) => {
        return window.getComputedStyle(el).width;
      });

    // 等待一段時間讓載入進度更新
    await page.waitForTimeout(2000);

    const updatedBufferWidth = await page
      .locator('[data-testid="buffer-progress"]')
      .evaluate((el) => {
        return window.getComputedStyle(el).width;
      });

    // 載入進度應該有所增加
    expect(parseInt(updatedBufferWidth, 10)).toBeGreaterThanOrEqual(
      parseInt(initialBufferWidth, 10),
    );

    // 檢查載入完成狀態
    const isFullyLoaded = await page.evaluate(() => {
      const video = document.querySelector('video') as HTMLVideoElement;
      return (
        video &&
        video.buffered.length > 0 &&
        video.buffered.end(video.buffered.length - 1) >= video.duration * 0.9
      );
    });

    if (isFullyLoaded) {
      // 驗證載入完成時的視覺狀態
      await expect(page.locator('[data-testid="buffer-progress"]')).toHaveClass(
        /fully-loaded/,
      );
    }
  });

  /**
   * 測試行動裝置上的時間軸操作
   */
  test('在行動裝置上應該提供觸控友好的時間軸操作', async ({ page }) => {
    const isMobile = await isMobileDevice(page);

    if (isMobile) {
      // 檢查行動裝置專用的時間軸控制
      await expect(
        page.locator('[data-testid="mobile-timeline"]'),
      ).toBeVisible();

      const timelineSlider = page.locator('[data-testid="timeline-slider"]');
      const sliderBox = await timelineSlider.boundingBox();

      // 確保觸控區域足夠大
      expect(sliderBox?.height).toBeGreaterThanOrEqual(44);

      // 測試觸控拖拽
      if (sliderBox) {
        const startX = sliderBox.x + sliderBox.width * 0.2;
        const endX = sliderBox.x + sliderBox.width * 0.8;
        const y = sliderBox.y + sliderBox.height * 0.5;

        // 執行觸控拖拽
        await page.touchscreen.tap(startX, y);
        await page.waitForTimeout(100);

        await page.mouse.down();
        await page.mouse.move(endX, y);
        await page.mouse.up();

        // 驗證觸控拖拽結果
        await page.waitForTimeout(500);
        const newTime = await getCurrentTime(page);
        const expectedTime = videoDuration * 0.8;

        assertTimeDifference(newTime, expectedTime, '觸控拖拽驗證', 2); // 行動裝置允許更大誤差
      }

      // 檢查觸控回饋
      await expect(
        page.locator('[data-testid="touch-feedback"]'),
      ).toBeVisible();
    }
  });

  /**
   * 測試時間軸性能和響應性
   */
  test('時間軸操作應該具有良好的性能和響應性', async ({ page }) => {
    const timelineSlider = page.locator('[data-testid="timeline-slider"]');

    // 記錄開始時間
    const startTime = Date.now();

    // 執行快速連續的滑桿變更
    const rapidChanges = [10, 30, 50, 70, 90];

    await rapidChanges.reduce(async (previousPromise, value) => {
      await previousPromise;
      await timelineSlider.fill(value.toString());
      await page.waitForTimeout(50); // 短暫延遲模擬快速操作
    }, Promise.resolve());

    // 記錄結束時間
    const endTime = Date.now();
    const totalTime = endTime - startTime;

    // 驗證操作完成時間合理 (應該在 1 秒內完成)
    expect(totalTime).toBeLessThan(1000);

    // 檢查最終狀態正確
    await page.waitForTimeout(300);
    const finalTime = await getCurrentTime(page);
    const expectedFinalTime = videoDuration * 0.9;

    assertTimeDifference(finalTime, expectedFinalTime, '性能測試最終狀態', 1);

    // 檢查沒有性能問題的視覺指示
    await expect(
      page.locator('[data-testid="performance-warning"]'),
    ).not.toBeVisible();
  });
});
